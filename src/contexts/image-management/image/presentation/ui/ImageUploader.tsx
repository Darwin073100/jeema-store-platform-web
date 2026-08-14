'use client'
import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { HiOutlineStar, HiStar, HiOutlineTrash, HiOutlineCloudUpload } from 'react-icons/hi';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import { ImageOwnerType } from '../../domain/enums/image-owner-type.enum';
import { useOwnerImages } from '../hooks/useOwnerImages';
import { useImageUpload } from '../hooks/useImageUpload';
import { ImageThumbnail } from './ImageThumbnail';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
// Espejo de MAX_RAW_UPLOAD_SIZE_MB (default backend 15MB, ver .env.template) — sólo para dar
// feedback inmediato en el cliente; la validación real y autoritativa ocurre en el servidor.
// Por debajo de este límite, el backend acepta la imagen tal cual viene de la cámara/galería
// y la comprime/redimensiona automáticamente si hace falta (no hace falta comprimir antes de subir).
const MAX_SIZE_BYTES = 15 * 1024 * 1024;

interface Props {
    ownerType: ImageOwnerType;
    /**
     * `null` cuando el dueño todavía no existe (p. ej. formulario de alta de
     * producto/empleado sin guardar aún). En ese caso el uploader se muestra
     * deshabilitado con un mensaje explicativo, nunca se inventa un id falso.
     */
    ownerId: bigint | null;
    /** Límite de slots visibles en la UI (el dominio permite hasta 3 para cualquier dueño). */
    maxSlots: number;
    /** Nombre descriptivo del dueño, usado en textos de accesibilidad. Ej: "producto", "empleado". */
    entityLabel?: string;
    className?: string;
}

/**
 * Componente genérico de subida/gestión de imágenes para cualquier dueño
 * (`ImageOwnerType`). Soporta preview local antes/durante la subida,
 * selección de imagen principal, eliminación, y límite de slots
 * configurable por prop (`maxSlots`) — el backend permite hasta 3 imágenes
 * para cualquier dueño, la UI decide cuántas exponer.
 */
const ImageUploader = ({ ownerType, ownerId, maxSlots, entityLabel = 'elemento', className }: Props) => {
    const { images, loading, error: listError, refresh } = useOwnerImages(ownerType, ownerId);
    const {
        upload, uploading, uploadError,
        setPrimary, settingPrimaryId, setPrimaryError,
        remove, deletingId, deleteError,
    } = useImageUpload(ownerType);

    const [localError, setLocalError] = useState<string | null>(null);
    const [pendingPreviewUrl, setPendingPreviewUrl] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        return () => {
            if (pendingPreviewUrl) URL.revokeObjectURL(pendingPreviewUrl);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const slotsAvailable = Math.max(0, maxSlots - images.length - (pendingPreviewUrl ? 1 : 0));
    const canAddMore = ownerId !== null && slotsAvailable > 0 && !uploading;

    const handlePickFile = () => {
        setLocalError(null);
        inputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file || ownerId === null) return;

        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
            setLocalError('Formato no soportado. Usa una imagen JPEG, PNG o WEBP.');
            return;
        }
        if (file.size > MAX_SIZE_BYTES) {
            setLocalError('La imagen supera el tamaño máximo permitido (15MB).');
            return;
        }

        setLocalError(null);
        const previewUrl = URL.createObjectURL(file);
        setPendingPreviewUrl(previewUrl);

        const uploaded = await upload(ownerId, file);

        URL.revokeObjectURL(previewUrl);
        setPendingPreviewUrl(null);

        if (uploaded) {
            await refresh();
        }
    };

    const handleSetPrimary = async (imageId: bigint) => {
        const updated = await setPrimary(imageId);
        if (updated) await refresh();
    };

    const handleRemove = async (imageId: bigint) => {
        const removed = await remove(imageId);
        if (removed) await refresh();
    };

    const combinedError = localError || listError || uploadError || setPrimaryError || deleteError;

    if (ownerId === null) {
        return (
            <div
                className={clsx(
                    'rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-4 text-center text-sm text-gray-500',
                    className
                )}
            >
                Guarda primero el registro para poder subir imágenes.
            </div>
        );
    }

    return (
        <div className={clsx('flex flex-col gap-3', className)}>
            <div className="flex flex-wrap gap-3">
                {images.map((image) => {
                    const isBusy = settingPrimaryId === image.imageId || deletingId === image.imageId;
                    return (
                        <div key={image.imageId.toString()} className="relative group">
                            <ImageThumbnail
                                src={image.url}
                                alt={`Imagen de ${entityLabel}${image.isPrimary ? ' (principal)' : ''}`}
                                size={88}
                            />
                            {image.isPrimary && (
                                <span
                                    className="absolute -top-2 -left-2 bg-yellow-400 text-white rounded-full p-1 shadow"
                                    title="Imagen principal"
                                >
                                    <HiStar size={14} />
                                </span>
                            )}
                            {isBusy ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-lg">
                                    <Spinner color="blue" size={20} />
                                </div>
                            ) : (
                                <div className="absolute inset-0 rounded-lg bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100">
                                    {!image.isPrimary && (
                                        <button
                                            type="button"
                                            aria-label="Marcar como imagen principal"
                                            title="Marcar como principal"
                                            onClick={() => handleSetPrimary(image.imageId)}
                                            className="cursor-pointer bg-white/90 hover:bg-white text-yellow-500 rounded-full p-1.5"
                                        >
                                            <HiOutlineStar size={16} />
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        aria-label="Eliminar imagen"
                                        title="Eliminar imagen"
                                        onClick={() => handleRemove(image.imageId)}
                                        className="cursor-pointer bg-white/90 hover:bg-white text-red-600 rounded-full p-1.5"
                                    >
                                        <HiOutlineTrash size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}

                {pendingPreviewUrl && (
                    <div className="relative">
                        <ImageThumbnail src={pendingPreviewUrl} alt="Vista previa de la imagen a subir" size={88} />
                        <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-lg">
                            <Spinner color="blue" size={20} />
                        </div>
                    </div>
                )}

                {canAddMore && (
                    <button
                        type="button"
                        onClick={handlePickFile}
                        aria-label="Subir imagen"
                        title="Subir imagen"
                        className="cursor-pointer w-[88px] h-[88px] rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-blue-500 hover:border-blue-400 transition-all"
                    >
                        <HiOutlineCloudUpload size={22} />
                        <span className="text-xs">Subir</span>
                    </button>
                )}
            </div>

            <input
                ref={inputRef}
                type="file"
                accept={ALLOWED_MIME_TYPES.join(',')}
                onChange={handleFileChange}
                className="hidden"
                aria-hidden="true"
                tabIndex={-1}
            />

            {loading && images.length === 0 && <p className="text-sm text-gray-400">Cargando imágenes...</p>}
            {combinedError && <p className="text-sm text-red-500" role="alert">{combinedError}</p>}
            {!combinedError && images.length >= maxSlots && (
                <p className="text-xs text-gray-400">Alcanzaste el máximo de {maxSlots} imagen{maxSlots > 1 ? 'es' : ''}.</p>
            )}
        </div>
    );
};

export { ImageUploader };
