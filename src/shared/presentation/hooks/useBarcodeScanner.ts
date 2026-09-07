'use client'
import { useCallback, useEffect, useRef, useState } from 'react';
import type { IScannerControls } from '@zxing/browser';

const DEBOUNCE_MS = 1500;

const useBarcodeScanner = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const controlsRef = useRef<IScannerControls | null>(null);
    const cancelledRef = useRef(false);
    const lastDetectionRef = useRef<{ code: string; time: number } | null>(null);

    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const stop = useCallback(() => {
        cancelledRef.current = true;
        controlsRef.current?.stop();
        controlsRef.current = null;
        setIsScanning(false);
    }, []);

    const start = useCallback(async (onDetected: (code: string) => void) => {
        setError(null);

        if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
            setError('Tu navegador no soporta el acceso a la cámara, o la conexión no es segura (se requiere HTTPS).');
            return;
        }
        if (!videoRef.current) return;

        cancelledRef.current = false;
        lastDetectionRef.current = null;

        try {
            const { BrowserMultiFormatReader } = await import('@zxing/browser');
            const reader = new BrowserMultiFormatReader();

            const controls = await reader.decodeFromConstraints(
                { video: { facingMode: { ideal: 'environment' } } },
                videoRef.current,
                (result) => {
                    if (!result) return;
                    const code = result.getText();
                    const now = Date.now();
                    const last = lastDetectionRef.current;
                    if (last && last.code === code && now - last.time < DEBOUNCE_MS) return;
                    lastDetectionRef.current = { code, time: now };
                    onDetected(code);
                }
            );

            // El close/unmount pudo ocurrir mientras se esperaba el permiso de cámara.
            if (cancelledRef.current) {
                controls.stop();
                return;
            }
            controlsRef.current = controls;
            setIsScanning(true);
        } catch (err) {
            setIsScanning(false);
            const name = err instanceof Error ? err.name : undefined;
            if (name === 'NotAllowedError') {
                setError('Debes otorgar permiso de cámara para poder escanear.');
            } else if (name === 'NotFoundError' || name === 'OverconstrainedError') {
                setError('No se encontró una cámara disponible en este dispositivo.');
            } else {
                setError('No se pudo acceder a la cámara.');
            }
        }
    }, []);

    useEffect(() => {
        return () => {
            stop();
        };
    }, [stop]);

    return { videoRef, start, stop, error, isScanning };
};

export { useBarcodeScanner };
