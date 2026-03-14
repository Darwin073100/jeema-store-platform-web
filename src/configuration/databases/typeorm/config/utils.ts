/**
 * Opciones de paginación
 */
export interface PaginationOptions {
  page: number;
  limit: number;
}

/**
 * Resultado paginado
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Utilidades para trabajar con TypeORM
 */
export class TypeOrmUtils {
  /**
   * Obtiene un resultado paginado usando QueryBuilder
   * Uso: const result = await TypeOrmUtils.getPaginated(
   *        queryBuilder,
   *        { page: 1, limit: 10 }
   *      )
   */
  static async getPaginated<T>(
    queryBuilder: any,
    options: PaginationOptions
  ): Promise<PaginatedResult<T>> {
    const skip = (options.page - 1) * options.limit;
    const pagedQuery = queryBuilder.skip(skip).take(options.limit);
    
    const [data, total] = await pagedQuery.getManyAndCount();

    return {
      data,
      total,
      page: options.page,
      limit: options.limit,
      totalPages: Math.ceil(total / options.limit),
    };
  }

  /**
   * Obtiene un resultado paginado desde un Repository
   * Uso: const result = await TypeOrmUtils.getPaginatedFromRepository(
   *        repository,
   *        { page: 1, limit: 10 },
   *        { where: { isActive: true } }
   *      )
   */
  static async getPaginatedFromRepository<T>(
    repository: any,
    options: PaginationOptions,
    findOptions?: any
  ): Promise<PaginatedResult<T>> {
    const skip = (options.page - 1) * options.limit;
    
    const [data, total] = await repository.findAndCount({
      ...findOptions,
      skip,
      take: options.limit,
    });

    return {
      data,
      total,
      page: options.page,
      limit: options.limit,
      totalPages: Math.ceil(total / options.limit),
    };
  }

  /**
   * Construye dinámicamente un objeto WHERE
   * Filtra valores null/undefined automáticamente
   * Útil para filtros opcionales
   */
  static buildWhereClause(
    filters: Record<string, any>
  ): Record<string, any> {
    return Object.entries(filters)
      .filter(([, value]) => value !== null && value !== undefined && value !== '')
      .reduce(
        (acc, [key, value]) => {
          acc[key] = value;
          return acc;
        },
        {} as Record<string, any>
      );
  }

  /**
   * Calcula el total de páginas
   */
  static getTotalPages(total: number, limit: number): number {
    return Math.ceil(total / limit);
  }

  /**
   * Calcula el skip (OFFSET) para una página
   */
  static getSkip(page: number, limit: number): number {
    return (page - 1) * limit;
  }
}
