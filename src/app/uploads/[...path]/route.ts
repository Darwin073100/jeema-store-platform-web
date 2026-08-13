import { NextResponse } from 'next/server';
import { LocalFilesystemImageStorageAdapter } from '@/shared/infrastructure/storage/local-filesystem-image-storage.adapter';

type Params = {
  params: Promise<{ path: string[] }>;
};

/**
 * Sirve las imágenes subidas en modo local. A diferencia de `public/`, lee
 * el archivo del disco en cada request en vez de depender del escaneo
 * único que `next start` hace de `public/` al arrancar — ver el comentario
 * en `LocalFilesystemImageStorageAdapter`.
 */
export async function GET(_request: Request, { params }: Params) {
  const { path: segments } = await params;
  const storageKey = segments.join('/');

  const storage = new LocalFilesystemImageStorageAdapter();
  const file = await storage.read(storageKey);

  if (!file) {
    return new NextResponse(null, { status: 404 });
  }

  return new NextResponse(new Uint8Array(file.buffer), {
    headers: {
      'Content-Type': file.mimeType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
