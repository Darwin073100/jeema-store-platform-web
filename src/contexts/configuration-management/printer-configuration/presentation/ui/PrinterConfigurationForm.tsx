'use client';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Document, Page, StyleSheet, Text, View, pdf } from '@react-pdf/renderer';
import {
  IoCheckmarkCircle,
  IoCloudOfflineOutline,
  IoPrintOutline,
  IoRefreshOutline,
} from 'react-icons/io5';
import { LabelInput } from '@/shared/ui/components/labels';
import { TextInput, SelectMenu } from '@/shared/ui/components/inputs';
import { Button } from '@/shared/ui/components/buttons';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import { FloatMessage } from '@/shared/ui/components/messages';
import { FloatMessageType } from '@/shared/ui/types/FloatMessageType';
import { useWorkspace } from '@/shared/presentation/hooks/auth/useAuth';
import { useQzTray, blobToBase64 } from '../hooks/useQzTray';
import { IPrinterConfiguration, PrinterConnectionTypeView } from '../interfaces/IPrinterConfiguration';
import { registerPrinterConfigurationAction } from '../actions/register-printer-configuration.action';
import { updatePrinterConfigurationAction } from '../actions/update-printer-configuration.action';
import { findPrinterConfigurationByBranchAction } from '../actions/find-printer-configuration-by-branch.action';

const CONNECTION_TYPE_ITEMS = [
  { value: 'QZ_OS_PRINTER', text: 'Impresora del sistema (USB o red ya instalada)' },
  { value: 'QZ_NETWORK', text: 'Red directa (IP y puerto)' },
  { value: 'QZ_USB', text: 'USB (identificador manual)' },
];

const PAPER_WIDTH_ITEMS = [
  { value: '58', text: '58 mm' },
  { value: '80', text: '80 mm' },
];

const schema = yup.object({
  label: yup.string().trim().required('La etiqueta es obligatoria').max(100, 'Máximo 100 caracteres'),
  connectionType: yup
    .mixed<PrinterConnectionTypeView>()
    .oneOf(['QZ_OS_PRINTER', 'QZ_NETWORK', 'QZ_USB'], 'Selecciona un tipo de conexión válido')
    .required('Selecciona el tipo de conexión'),
  printerName: yup.string().when('connectionType', {
    is: 'QZ_OS_PRINTER',
    then: (s) => s.trim().required('Selecciona una impresora de la lista'),
    otherwise: (s) => s.optional(),
  }),
  usbTarget: yup.string().when('connectionType', {
    is: 'QZ_USB',
    then: (s) => s.trim().required('Ingresa el identificador de la impresora USB'),
    otherwise: (s) => s.optional(),
  }),
  networkHost: yup.string().when('connectionType', {
    is: 'QZ_NETWORK',
    then: (s) => s.trim().required('La IP es obligatoria'),
    otherwise: (s) => s.optional(),
  }),
  networkPort: yup.string().when('connectionType', {
    is: 'QZ_NETWORK',
    then: (s) => s.trim().required('El puerto es obligatorio').matches(/^\d{1,5}$/, 'Puerto inválido'),
    otherwise: (s) => s.optional(),
  }),
  paperWidthMm: yup
    .string()
    .oneOf(['58', '80'], 'Selecciona un ancho de papel válido')
    .required('Selecciona el ancho de papel'),
  copies: yup
    .number()
    .typeError('Debe ser un número')
    .integer('Debe ser un número entero')
    .min(1, 'Mínimo 1 copia')
    .max(10, 'Máximo 10 copias')
    .required('Indica el número de copias'),
  autoPrintOnSale: yup.boolean().default(false),
  isActive: yup.boolean().default(true),
}).required();

type FormData = yup.InferType<typeof schema>;

/** Ancho de página en puntos PDF, replicando la conversión usada en Ticket58Document. */
const mmToPt = (mm: number) => mm * 2.83465;

/**
 * Documento mínimo de prueba, independiente de `Ticket58Document` (ese requiere una `ISale` real
 * completa). Usa el mismo pipeline de impresión (`useQzTray().printPdf` + `blobToBase64`) que la
 * venta real — solo cambia el contenido del PDF, no la lógica de impresión.
 */
const TestPrintDocument = ({ label, paperWidthMm }: { label: string; paperWidthMm: number }) => {
  const styles = StyleSheet.create({
    page: {
      width: mmToPt(paperWidthMm),
      padding: mmToPt(3),
      flexDirection: 'column',
      alignItems: 'center',
    },
    title: { fontSize: 12, fontWeight: 'bold', marginBottom: 6, textAlign: 'center' },
    line: { fontSize: 8, marginBottom: 3, textAlign: 'center' },
  });
  return (
    <Document>
      <Page size={[styles.page.width as number, mmToPt(60)]} style={styles.page}>
        <Text style={styles.title}>Ticket de prueba</Text>
        <Text style={styles.line}>{label || 'Impresora térmica'}</Text>
        <Text style={styles.line}>{`Ancho de papel: ${paperWidthMm}mm`}</Text>
        <Text style={styles.line}>{new Date().toLocaleString()}</Text>
        <Text style={styles.line}>JEEMA Store Platform</Text>
      </Page>
    </Document>
  );
};

function targetFromForm(data: FormData): string {
  if (data.connectionType === 'QZ_NETWORK') {
    return `${data.networkHost}:${data.networkPort}`;
  }
  if (data.connectionType === 'QZ_USB') {
    return data.usbTarget ?? '';
  }
  return data.printerName ?? '';
}

function formFromExisting(config: IPrinterConfiguration): Partial<FormData> {
  const base: Partial<FormData> = {
    label: config.label,
    connectionType: config.connectionType,
    paperWidthMm: String(config.paperWidthMm) as '58' | '80',
    copies: config.copies,
    autoPrintOnSale: config.autoPrintOnSale,
    isActive: config.isActive,
  };
  if (config.connectionType === 'QZ_NETWORK') {
    const [host, port] = config.target.split(':');
    return { ...base, networkHost: host, networkPort: port };
  }
  if (config.connectionType === 'QZ_USB') {
    return { ...base, usbTarget: config.target };
  }
  return { ...base, printerName: config.target };
}

export const PrinterConfigurationForm = () => {
  const { branchOffice, isLoading: workspaceLoading } = useWorkspace();
  const { connected, connecting, error: qzError, printers, findingPrinters, connect, findPrinters, printPdf } = useQzTray();

  const [existingConfig, setExistingConfig] = useState<IPrinterConfiguration | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testPrinting, setTestPrinting] = useState(false);
  const [floatMessageState, setFloatMessageState] = useState<FloatMessageType>({});

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      label: '',
      connectionType: 'QZ_OS_PRINTER',
      paperWidthMm: '58',
      copies: 1,
      autoPrintOnSale: false,
      isActive: true,
    },
  });

  const connectionType = watch('connectionType');

  useEffect(() => {
    const loadExistingConfig = async () => {
      if (!branchOffice) {
        return;
      }
      setLoadingConfig(true);
      try {
        const result = await findPrinterConfigurationByBranchAction(branchOffice.branchOfficeId);
        if (result.ok && result.value && result.value.printerConfigurations.length > 0) {
          const current = result.value.printerConfigurations[0];
          setExistingConfig(current);
          reset(formFromExisting(current));
        }
      } finally {
        setLoadingConfig(false);
      }
    };
    loadExistingConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchOffice?.branchOfficeId]);

  const notify = (payload: FloatMessageType, autoHideMs = 5000) => {
    setFloatMessageState({ ...payload, isActive: true });
    setTimeout(() => setFloatMessageState({}), autoHideMs);
  };

  const buildPrinterConfigView = (data: FormData): IPrinterConfiguration => ({
    printerConfigurationId: existingConfig?.printerConfigurationId ?? BigInt(0),
    branchOfficeId: branchOffice?.branchOfficeId ?? BigInt(0),
    label: data.label,
    connectionType: data.connectionType,
    target: targetFromForm(data),
    paperWidthMm: Number(data.paperWidthMm) as 58 | 80,
    autoPrintOnSale: data.autoPrintOnSale,
    openCashDrawer: false,
    copies: data.copies,
    isActive: true,
    createdAt: new Date(),
    updatedAt: null,
  });

  const onSubmit = async (data: FormData) => {
    if (!branchOffice) {
      notify({ summary: '¡Error!', description: 'No se encontró la sucursal actual.', type: 'red' });
      return;
    }

    setSaving(true);
    try {
      const target = targetFromForm(data);
      let result;
      if (existingConfig) {
        result = await updatePrinterConfigurationAction({
          printerConfigurationId: existingConfig.printerConfigurationId,
          label: data.label,
          connectionType: data.connectionType,
          target,
          paperWidthMm: Number(data.paperWidthMm),
          autoPrintOnSale: data.autoPrintOnSale,
          openCashDrawer: false,
          copies: data.copies,
          isActive: data.isActive,
        });
      } else {
        result = await registerPrinterConfigurationAction({
          branchOfficeId: branchOffice.branchOfficeId,
          label: data.label,
          connectionType: data.connectionType,
          target,
          paperWidthMm: Number(data.paperWidthMm),
          autoPrintOnSale: data.autoPrintOnSale,
          openCashDrawer: false,
          copies: data.copies,
        });
      }

      if (result.ok && result.value) {
        setExistingConfig(result.value);
        reset(formFromExisting(result.value));
        notify({ summary: '¡Correcto!', description: 'Configuración de impresora guardada.', type: 'green' });
      } else {
        notify({ summary: '¡Error!', description: result.error?.message?.toString() ?? 'No se pudo guardar la configuración.', type: 'red' });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleConnect = async () => {
    try {
      await connect();
      notify({ summary: 'Conectado', description: 'QZ Tray está en ejecución y disponible.', type: 'green' }, 3000);
    } catch (err) {
      notify({ summary: 'No se pudo conectar', description: err instanceof Error ? err.message : 'Verifica que QZ Tray esté instalado y en ejecución.', type: 'red' });
    }
  };

  const handleFindPrinters = async () => {
    try {
      await findPrinters();
    } catch (err) {
      notify({ summary: 'No se pudo buscar impresoras', description: err instanceof Error ? err.message : 'Revisa la conexión con QZ Tray.', type: 'red' });
    }
  };

  const handleTestPrint = handleSubmit(async (data) => {
    setTestPrinting(true);
    try {
      const printerConfigView = buildPrinterConfigView(data);
      const doc = <TestPrintDocument label={data.label} paperWidthMm={Number(data.paperWidthMm)} />;
      const blob = await pdf(doc).toBlob();
      const base64Pdf = await blobToBase64(blob);
      await printPdf(base64Pdf, printerConfigView);
      notify({ summary: '¡Enviado!', description: 'Ticket de prueba enviado a la impresora.', type: 'green' }, 3000);
    } catch (err) {
      notify({ summary: 'No se pudo imprimir', description: err instanceof Error ? err.message : 'Revisa la conexión con QZ Tray y la impresora.', type: 'red' });
    } finally {
      setTestPrinting(false);
    }
  });

  if (workspaceLoading || loadingConfig) {
    return (
      <div className="flex items-center gap-2 justify-center p-8 bg-white rounded-2xl shadow-md">
        <Spinner color="black" />
        <span>Cargando configuración de impresora...</span>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white w-full rounded-2xl shadow-md p-4 flex flex-col gap-4 mb-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            {connected ? (
              <IoCheckmarkCircle className="text-green-500 text-2xl" />
            ) : (
              <IoCloudOfflineOutline className="text-gray-400 text-2xl" />
            )}
            <span className="text-sm text-gray-600">
              {connected ? 'QZ Tray conectado' : 'QZ Tray no conectado'}
            </span>
          </div>
          <Button type="button" color={connected ? 'gray' : 'blue'} onClick={handleConnect} disabled={connecting}>
            {connecting ? <Spinner /> : <IoRefreshOutline />}
            {connected ? 'Reconectar impresora' : 'Conectar impresora'}
          </Button>
        </div>
        {qzError && <p className="text-red-500 text-sm">{qzError}</p>}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white w-full rounded-2xl shadow-md p-4 flex flex-col gap-4">
        <h1 className="text-2xl mb-2 text-gray-700">Configuración de impresora térmica</h1>

        <div>
          <LabelInput htmlFor="label" value="Etiqueta" required="yes" description="Nombre para identificar esta impresora, ej. 'Caja 1'." />
          <TextInput {...register('label')} error={!!errors.label} errorMessage={errors.label?.message} name="label" placeholder="Caja 1" />
        </div>

        <div>
          <LabelInput htmlFor="connectionType" value="Tipo de conexión" required="yes" />
          <SelectMenu {...register('connectionType')} items={CONNECTION_TYPE_ITEMS} error={!!errors.connectionType} errorMessage={errors.connectionType?.message} name="connectionType" />
        </div>

        {connectionType === 'QZ_OS_PRINTER' && (
          <div>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <LabelInput htmlFor="printerName" value="Impresora" required="yes" description="Impresora instalada en el sistema operativo, detectada por QZ Tray." />
                <SelectMenu
                  {...register('printerName')}
                  items={printers.map((p) => ({ value: p, text: p }))}
                  error={!!errors.printerName}
                  errorMessage={errors.printerName?.message}
                  name="printerName"
                />
              </div>
              <Button type="button" color="gray" size="sm" onClick={handleFindPrinters} disabled={findingPrinters}>
                {findingPrinters ? <Spinner color="black" /> : <IoRefreshOutline />}
                Buscar
              </Button>
            </div>
            {printers.length === 0 && (
              <p className="text-xs text-gray-500 mt-1">
                Sin impresoras detectadas todavía. Conecta con QZ Tray y pulsa &quot;Buscar&quot;.
              </p>
            )}
          </div>
        )}

        {connectionType === 'QZ_NETWORK' && (
          <div className="flex gap-4 max-sm:flex-col">
            <div className="flex-1">
              <LabelInput htmlFor="networkHost" value="Dirección IP" required="yes" />
              <TextInput {...register('networkHost')} error={!!errors.networkHost} errorMessage={errors.networkHost?.message} name="networkHost" placeholder="192.168.1.50" />
            </div>
            <div className="w-32">
              <LabelInput htmlFor="networkPort" value="Puerto" required="yes" />
              <TextInput {...register('networkPort')} error={!!errors.networkPort} errorMessage={errors.networkPort?.message} name="networkPort" placeholder="9100" />
            </div>
          </div>
        )}

        {connectionType === 'QZ_USB' && (
          <div>
            <LabelInput htmlFor="usbTarget" value="Identificador de impresora USB" required="yes" description="Nombre con el que QZ Tray/el sistema reconoce la impresora USB." />
            <TextInput {...register('usbTarget')} error={!!errors.usbTarget} errorMessage={errors.usbTarget?.message} name="usbTarget" placeholder="POS-58" />
          </div>
        )}

        <div>
          <LabelInput htmlFor="paperWidthMm" value="Ancho de papel" required="yes" />
          <SelectMenu {...register('paperWidthMm')} items={PAPER_WIDTH_ITEMS} error={!!errors.paperWidthMm} errorMessage={errors.paperWidthMm?.message} name="paperWidthMm" />
        </div>

        <div>
          <LabelInput htmlFor="copies" value="Copias" required="yes" />
          <TextInput {...register('copies', { valueAsNumber: true })} type="number" min={1} max={10} error={!!errors.copies} errorMessage={errors.copies?.message} name="copies" />
        </div>

        <label className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 px-4 py-3">
          <span className="flex flex-col">
            <span className="font-medium text-gray-700">Imprimir automáticamente al finalizar venta</span>
            <span className="text-xs text-gray-500">Envía el ticket a esta impresora en paralelo, sin diálogos, al completar una venta.</span>
          </span>
          <input type="checkbox" className="peer sr-only" {...register('autoPrintOnSale')} />
          <span className="relative h-6 w-11 shrink-0 rounded-full bg-slate-200 transition-colors peer-checked:bg-blue-600 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-5" />
        </label>

        <label className={clsx('flex items-center justify-between gap-4 rounded-xl border border-gray-200 px-4 py-3 opacity-60')}>
          <span className="flex flex-col">
            <span className="font-medium text-gray-700">Abrir cajón portamonedas</span>
            <span className="text-xs text-gray-500">Próximamente (fase 2) — requiere comandos ESC/POS crudos, aún no implementados.</span>
          </span>
          <input type="checkbox" disabled className="peer sr-only" checked={false} readOnly />
          <span className="relative h-6 w-11 shrink-0 rounded-full bg-slate-100 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow" />
        </label>

        {existingConfig && (
          <label className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 px-4 py-3">
            <span className="flex flex-col">
              <span className="font-medium text-gray-700">Configuración activa</span>
              <span className="text-xs text-gray-500">Desactívala para dejar de usarla sin eliminar los datos.</span>
            </span>
            <input type="checkbox" className="peer sr-only" {...register('isActive')} />
            <span className="relative h-6 w-11 shrink-0 rounded-full bg-slate-200 transition-colors peer-checked:bg-blue-600 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-5" />
          </label>
        )}

        <div className="flex gap-3 flex-wrap">
          <Button type="submit" color="blue" disabled={saving}>
            {saving ? <>Guardando <Spinner /></> : 'Guardar configuración'}
          </Button>
          <Button type="button" color="teal" onClick={handleTestPrint} disabled={testPrinting}>
            {testPrinting ? <Spinner /> : <IoPrintOutline />}
            Imprimir ticket de prueba
          </Button>
        </div>
      </form>

      <FloatMessage
        key={floatMessageState.summary}
        description={floatMessageState.description}
        summary={floatMessageState.summary}
        type={floatMessageState.type}
        isActive={floatMessageState.isActive}
      />
    </>
  );
};
