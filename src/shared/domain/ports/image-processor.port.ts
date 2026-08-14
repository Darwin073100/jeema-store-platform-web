export const IMAGE_PROCESSOR_PORT = Symbol('IMAGE_PROCESSOR_PORT');

/**
 * Datos de entrada para procesar (comprimir/redimensionar) un archivo binario
 * de imagen, agnóstico al dueño de la imagen.
 */
export interface ProcessImageInput {
  /** Contenido binario crudo del archivo, ya validado como jpeg/png/webp por el llamador. */
  buffer: Buffer;
  /** Mime type ya validado por el llamador (whitelist jpeg/png/webp). */
  mimeType: string;
}

/**
 * Resultado de un procesamiento exitoso: el binario ya redimensionado y
 * re-codificado, junto con sus nuevos metadatos.
 */
export interface ProcessImageResult {
  /** Contenido binario ya redimensionado/recomprimido. */
  buffer: Buffer;
  /** Mime type resultante (puede diferir del de entrada si se re-codificó a otro formato). */
  mimeType: string;
  width: number;
  height: number;
  sizeBytes: number;
}

/**
 * ImageProcessorPort desacopla a los use-cases de `image-management` de
 * *cómo* se comprime/redimensiona un archivo antes de guardarlo. El dominio y
 * la aplicación no conocen `sharp` ni ningún detalle de codecs/calidad; sólo
 * invocan esta operación. La política concreta (dimensión máxima, calidad,
 * formato de salida) vive en la implementación/adaptador, parametrizada por
 * variables de entorno — este puerto sólo expone la operación.
 *
 * La *decisión* de si corresponde comprimir (¿el archivo supera el umbral de
 * tamaño?) la toma `UploadImageUseCase` antes de invocar este puerto, no el
 * adaptador — así la regla de negocio queda en la capa de aplicación,
 * testeable sin `sharp` de por medio.
 *
 * Única implementación concreta: `SharpImageProcessorAdapter`
 * (`src/shared/infrastructure/image-processing/`), resuelta vía
 * `DependencyFactory.getImageProcessor()`.
 */
export interface ImageProcessorPort {
  process(input: ProcessImageInput): Promise<ProcessImageResult>;
}
