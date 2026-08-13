/**
 * ImageOwnerGatewayPort desacopla los use-cases de `image-management` de
 * los tres contextos que pueden ser "dueños" de una imagen (producto,
 * empleado, establecimiento).
 *
 * Cada `ownerType` tiene un adaptador concreto que implementa este puerto
 * reutilizando directamente el repositorio ya existente de su contexto
 * (`ProductRepository`/`EmployeeRepository`/`EstablishmentRepository`), sin
 * introducir ningún puerto/adaptador "checker" nuevo.
 */
export interface ImageOwnerGatewayPort {
  /** Verifica que el dueño exista antes de asociarle una imagen. */
  exists(ownerId: bigint): Promise<boolean>;

  /**
   * Sincroniza el campo denormalizado del dueño (`imageUrl`/`photoUrl`/`logoUrl`)
   * cuando cambia cuál es su imagen principal. `url` es `null` cuando ya no
   * queda ninguna imagen activa.
   */
  updatePrimaryImageUrl(ownerId: bigint, url: string | null): Promise<void>;
}
