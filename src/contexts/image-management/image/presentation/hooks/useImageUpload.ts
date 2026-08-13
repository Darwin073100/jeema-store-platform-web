'use client'
import { useState } from 'react';
import { ImageOwnerType } from '../../domain/enums/image-owner-type.enum';
import { uploadImageAction } from '../actions/upload-image.action';
import { setPrimaryImageAction } from '../actions/set-primary-image.action';
import { deleteImageAction } from '../actions/delete-image.action';
import { IImage } from '../interfaces/IImage';
import { ErrorEntity } from '@/shared/lib/utils/error.entity';

/**
 * `ErrorEntity.message` puede ser `string | string[]` (mismo contrato que
 * el resto de las Server Actions del proyecto) — se normaliza a `string`
 * para poder guardarlo en un `useState<string | null>`.
 */
const toErrorMessage = (error: ErrorEntity | undefined, fallback: string): string => {
    if (!error?.message) return fallback;
    return Array.isArray(error.message) ? error.message.join(' ') : error.message;
};

/**
 * Envuelve las Server Actions de escritura de `image-management`
 * (subir, marcar principal, eliminar) con manejo de estado
 * loading/error por operación.
 */
export const useImageUpload = (ownerType: ImageOwnerType) => {
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const [settingPrimaryId, setSettingPrimaryId] = useState<bigint | null>(null);
    const [setPrimaryError, setSetPrimaryError] = useState<string | null>(null);

    const [deletingId, setDeletingId] = useState<bigint | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const upload = async (ownerId: bigint, file: File): Promise<IImage | null> => {
        setUploading(true);
        setUploadError(null);

        const formData = new FormData();
        formData.append('file', file);

        const result = await uploadImageAction(ownerType, ownerId, formData);
        setUploading(false);

        if (result.ok && result.value) {
            return result.value;
        }

        setUploadError(toErrorMessage(result.error, 'No se pudo subir la imagen.'));
        return null;
    };

    const setPrimary = async (imageId: bigint): Promise<IImage | null> => {
        setSettingPrimaryId(imageId);
        setSetPrimaryError(null);

        const result = await setPrimaryImageAction(ownerType, imageId);
        setSettingPrimaryId(null);

        if (result.ok && result.value) {
            return result.value;
        }

        setSetPrimaryError(toErrorMessage(result.error, 'No se pudo marcar la imagen como principal.'));
        return null;
    };

    const remove = async (imageId: bigint): Promise<boolean> => {
        setDeletingId(imageId);
        setDeleteError(null);

        const result = await deleteImageAction(ownerType, imageId);
        setDeletingId(null);

        if (result.ok) {
            return true;
        }

        setDeleteError(toErrorMessage(result.error, 'No se pudo eliminar la imagen.'));
        return false;
    };

    return {
        upload,
        uploading,
        uploadError,

        setPrimary,
        settingPrimaryId,
        setPrimaryError,

        remove,
        deletingId,
        deleteError,
    };
};
