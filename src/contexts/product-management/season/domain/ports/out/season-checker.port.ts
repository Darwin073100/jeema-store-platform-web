export const SEASON_CHECKER_PORT = Symbol('SEASON_CHECKER_PORT');

export interface SeasonCheckerPort {
    exists(seasonId: bigint): Promise<boolean>;
}