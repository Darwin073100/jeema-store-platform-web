'use client'
import { useCallback, useEffect, useState } from 'react';
import { ImageOwnerType } from '../../domain/enums/image-owner-type.enum';
import { listImagesByOwnerAction } from '../actions/list-images-by-owner.action';
import { IImage } from '../interfaces/IImage';
import { ErrorEntity } from '@/shared/lib/utils/error.entity';

/**
 * `ErrorEntity.message` puede ser `string | string[]` — se normaliza a
 * `string` para poder guardarlo en un `useState<string | null>`.
 */
const toErrorMessage = (error: ErrorEntity | undefined, fallback: string): string => {
    if (!error?.message) return fallback;
    return Array.isArray(error.message) ? error.message.join(' ') : error.message;
};

/**
 * Lista y mantiene sincronizado el conjunto de imágenes de un dueño
 * (`ownerType` + `ownerId`), consumiendo `listImagesByOwnerAction`.
 *
 * Si `ownerId` es `null` (el dueño todavía no existe, p. ej. un producto en
 * proceso de alta) no se dispara ninguna petición y `images` se mantiene
 * vacío.
 */
export const useOwnerImages = (ownerType: ImageOwnerType, ownerId: bigint | null) => {
    const [images, setImages] = useState<IImage[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        if (ownerId === null) {
            setImages([]);
            return;
        }

        setLoading(true);
        setError(null);
        const result = await listImagesByOwnerAction(ownerType, ownerId);
        setLoading(false);

        if (result.ok && result.value) {
            setImages(result.value);
        } else {
            setError(toErrorMessage(result.error, 'No se pudieron cargar las imágenes.'));
        }
    }, [ownerType, ownerId]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return {
        images,
        loading,
        error,
        refresh,
    };
};
