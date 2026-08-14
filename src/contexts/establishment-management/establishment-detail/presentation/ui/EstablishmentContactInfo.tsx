'use client'
import React from 'react'
import { EstablishmentDetailTypeEnum } from '@/contexts/establishment-management/establishment-detail/domain/enums/establishment-detail-type.enum';
import { ButtonOutLine } from '@/shared/ui/components/buttons/ButtonOutLine';
import { ActionButton } from '@/shared/ui/components/buttons';
import { FloatMessage } from '@/shared/ui/components/messages';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import {
  BiPencil,
  BiTrash,
  BiPlus,
  BiMessageSquareDetail,
} from 'react-icons/bi';
import {
  FaPhone,
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaGlobe,
  FaEnvelope,
} from 'react-icons/fa';
import { IEstablishmentDetail } from '../interfaces/IEstablishmentDetail';
import { useEstablishmentDetailUIStore } from '../stores/establishment-detail-ui.store';
import { EstablishmentDetailFormModal } from './EstablishmentDetailFormModal';
import { deleteEstablishmentDetailAction } from '../actions/delete-establishment-detail.action';
import {
  ESTABLISHMENT_DETAIL_TYPE_LABELS,
  SINGLETON_ESTABLISHMENT_DETAIL_TYPES_ORDER,
} from '../lib/establishment-detail-catalog';
import { getDetailsByType, getFirstDetailByType } from '../lib/get-details-by-type';

interface Props {
  establishmentId: bigint,
  details: IEstablishmentDetail[],
}

const SINGLETON_ICONS: Record<EstablishmentDetailTypeEnum, React.ReactNode> = {
  [EstablishmentDetailTypeEnum.PHONE_NUMBER]: <FaPhone />,
  [EstablishmentDetailTypeEnum.WHATSAPP]: <FaWhatsapp />,
  [EstablishmentDetailTypeEnum.EMAIL]: <FaEnvelope />,
  [EstablishmentDetailTypeEnum.WEBSITE]: <FaGlobe />,
  [EstablishmentDetailTypeEnum.FACEBOOK]: <FaFacebook />,
  [EstablishmentDetailTypeEnum.INSTAGRAM]: <FaInstagram />,
  [EstablishmentDetailTypeEnum.TIKTOK]: <FaTiktok />,
  [EstablishmentDetailTypeEnum.SLOGAN]: <BiMessageSquareDetail />,
};

const EstablishmentContactInfo = ({ establishmentId, details }: Props) => {
  const {
    openModal,
    loading,
    initLoading,
    stopLoading,
    floatMessageState,
    setFloatMessageState,
  } = useEstablishmentDetailUIStore();

  const phonesAndWhatsapp = [
    ...getDetailsByType(details, EstablishmentDetailTypeEnum.PHONE_NUMBER),
    ...getDetailsByType(details, EstablishmentDetailTypeEnum.WHATSAPP),
  ];

  const handleDelete = async (detail: IEstablishmentDetail) => {
    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar "${detail.value}" (${ESTABLISHMENT_DETAIL_TYPE_LABELS[detail.type]})?`
    );
    if (!confirmed) return;

    initLoading('delete-establishment-detail');
    const result = await deleteEstablishmentDetailAction(detail.establishmentDetailId);
    stopLoading();

    if (result.ok) {
      setFloatMessageState({
        summary: '¡Correcto!',
        description: 'Dato de contacto eliminado correctamente 😉.',
        isActive: true,
        type: 'green'
      });
    } else {
      setFloatMessageState({
        summary: `${result.error?.statusCode}: ¡Error!`,
        description: `${result.error?.message} 😢.`,
        isActive: true,
        type: 'red'
      });
    }
    setTimeout(() => setFloatMessageState({}), 3000);
  };

  const isDeleting = loading === 'delete-establishment-detail';

  return (
    <div className="bg-white rounded-lg shadow-md w-full p-6 flex flex-col gap-6">
      {/* Teléfonos y WhatsApp */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-[12px] text-gray-500">TELÉFONOS Y WHATSAPP</h2>
        </div>
        <div className="flex flex-col gap-2 mb-3">
          {phonesAndWhatsapp.length === 0 && (
            <span className="text-sm text-gray-400">Sin teléfonos registrados.</span>
          )}
          {phonesAndWhatsapp.map((detail) => (
            <div
              key={detail.establishmentDetailId.toString()}
              className="flex items-center justify-between gap-2 bg-gray-50 rounded-lg px-3 py-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-gray-500">{SINGLETON_ICONS[detail.type]}</span>
                <span className="text-sm font-bold truncate">{detail.value}</span>
                <span className="text-[10px] text-gray-400 uppercase">{ESTABLISHMENT_DETAIL_TYPE_LABELS[detail.type]}</span>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <ActionButton variant="edit" onClick={() => openModal('edit', detail)}>
                  <BiPencil />
                </ActionButton>
                <ActionButton variant="delete" onClick={() => handleDelete(detail)} disabled={isDeleting}>
                  {isDeleting ? <Spinner /> : <BiTrash />}
                </ActionButton>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <ButtonOutLine
            size="sm"
            onClick={() => openModal('add', undefined, EstablishmentDetailTypeEnum.PHONE_NUMBER)}
          >
            <BiPlus /> Agregar teléfono
          </ButtonOutLine>
          <ButtonOutLine
            size="sm"
            color="green"
            onClick={() => openModal('add', undefined, EstablishmentDetailTypeEnum.WHATSAPP)}
          >
            <BiPlus /> Agregar WhatsApp
          </ButtonOutLine>
        </div>
      </div>

      {/* Redes sociales, sitio web y slogan */}
      <div>
        <h2 className="font-bold text-[12px] text-gray-500 mb-3">REDES SOCIALES, SITIO WEB Y SLOGAN</h2>
        <div className="flex flex-col gap-2">
          {SINGLETON_ESTABLISHMENT_DETAIL_TYPES_ORDER.map((type) => {
            const detail = getFirstDetailByType(details, type);
            return (
              <div
                key={type}
                className="flex items-center justify-between gap-2 bg-gray-50 rounded-lg px-3 py-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-gray-500">{SINGLETON_ICONS[type]}</span>
                  <span className="text-[10px] text-gray-400 uppercase flex-shrink-0">{ESTABLISHMENT_DETAIL_TYPE_LABELS[type]}</span>
                  {detail && <span className="text-sm font-bold truncate">{detail.value}</span>}
                  {!detail && <span className="text-sm text-gray-400">Sin registrar</span>}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {detail ? (
                    <>
                      <ActionButton variant="edit" onClick={() => openModal('edit', detail)}>
                        <BiPencil />
                      </ActionButton>
                      <ActionButton variant="delete" onClick={() => handleDelete(detail)} disabled={isDeleting}>
                        {isDeleting ? <Spinner /> : <BiTrash />}
                      </ActionButton>
                    </>
                  ) : (
                    <ActionButton variant="add" onClick={() => openModal('add', undefined, type)}>
                      <BiPlus /> Agregar
                    </ActionButton>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <EstablishmentDetailFormModal establishmentId={establishmentId} />
      <FloatMessage {...floatMessageState} />
    </div>
  )
}

export { EstablishmentContactInfo };
