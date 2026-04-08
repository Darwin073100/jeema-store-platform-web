export class Result<T, E = Error>{
    private constructor(
        public readonly ok: boolean,
        public readonly value?: T,
        public readonly error?: E,
    ){}

    static success<T>(value:T):Result<T, never>{
        return new Result(true, value);
    }

    static failure<E>(error:E):Result<never, E>{
        return new Result<never, E>(false, undefined, error);
    }   
}