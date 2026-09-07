'use client'
import React, { useEffect, useRef } from 'react';
import { TemplateModal } from '@/shared/ui/components/modals/TemplateModal';
import { Button } from '@/shared/ui/components/buttons';
import { IoClose } from 'react-icons/io5';
import { useBarcodeScanner } from '@/shared/presentation/hooks/useBarcodeScanner';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onDetected: (code: string) => void;
    title?: string;
}

const BarcodeScannerModal = ({ isOpen, onClose, onDetected, title = 'Escanear código de barras' }: Props) => {
    const { videoRef, start, stop, error } = useBarcodeScanner();

    // Ref para siempre llamar la versión más reciente de onDetected sin reiniciar la cámara.
    const onDetectedRef = useRef(onDetected);
    useEffect(() => {
        onDetectedRef.current = onDetected;
    }, [onDetected]);

    useEffect(() => {
        if (isOpen) {
            start((code) => onDetectedRef.current(code));
        } else {
            stop();
        }
        return () => {
            stop();
        };
    }, [isOpen]);

    return (
        <TemplateModal size='full' isOpen={isOpen} onClose={onClose} title={title}>
            <div className="p-4 flex flex-col items-center gap-4">
                <div className="relative w-full max-w-md aspect-square rounded-xl overflow-hidden bg-black">
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        // playsInline es obligatorio: sin esto iOS Safari fuerza el reproductor nativo a pantalla completa
                        playsInline
                        className="w-full h-full object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <div className="w-2/3 aspect-square border-4 border-white/80 rounded-2xl" />
                    </div>
                </div>
                {error && (
                    <p className="text-red-600 text-sm text-center font-medium">{error}</p>
                )}
                <p className="text-gray-500 text-sm text-center">
                    Apunta la cámara al código de barras del producto.
                </p>
                <Button
                    type='button'
                    color='gray'
                    onClick={onClose}
                    className="w-full max-w-md justify-center"
                >
                    <IoClose className="text-xl" />
                    Cerrar
                </Button>
            </div>
        </TemplateModal>
    );
};

export { BarcodeScannerModal };
