import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import { DomainException } from "@/shared/domain/exceptions/domain.exceptions";

/**
 * No hay sesión activa: la petición llegó sin usuario autenticado.
 */
export class UnauthenticatedException extends DomainException {
    constructor(message = 'Debes iniciar sesión para realizar esta operación.') {
        super(message, 401);
    }
}

/**
 * Hay sesión, pero el usuario no tiene los roles/permisos requeridos.
 */
export class ForbiddenException extends DomainException {
    constructor(message = 'No tienes permisos para realizar esta operación.') {
        super(message, 403);
    }
}

interface RequireSessionOptions {
    /** Basta con tener AL MENOS UNO de estos roles (mismo criterio que HideElement). */
    roles?: string[];
    /** Basta con tener AL MENOS UNO de estos permisos. */
    permissions?: string[];
}

const hasAny = (owned: string[] | undefined, required: string[] | undefined): boolean => {
    if (!required || required.length === 0) return true;
    const ownedLower = (owned ?? []).map(item => item.toLowerCase());
    return required.some(item => ownedLower.includes(item.toLowerCase()));
};

/**
 * Autoriza un Server Action o un Server Component. Los Server Actions son endpoints POST públicos:
 * `proxy.ts` protege páginas, no actions, por eso cada action debe llamar a esta función primero.
 * @throws {UnauthenticatedException} si no hay sesión (401).
 * @throws {ForbiddenException} si faltan roles o permisos (403).
 * @returns {Promise<Session['user']>} el usuario de la sesión.
 */
export async function requireSession({ roles, permissions }: RequireSessionOptions = {}): Promise<Session['user']> {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        throw new UnauthenticatedException();
    }
    if (!hasAny(session.user.roles, roles) || !hasAny(session.user.permissions, permissions)) {
        throw new ForbiddenException();
    }
    return session.user;
}
