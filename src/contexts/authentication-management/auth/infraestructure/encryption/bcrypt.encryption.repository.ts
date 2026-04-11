import { EncryptionRepository } from "../../domain/repositories/encryption.repository";
import * as bcrypt from 'bcrypt';

export class BcryptEncryptionRepository implements EncryptionRepository{
    /**
     * Crea una instancia del repositorio (factory)
     * Uso: const repo = await TypeOrmAgregadoRepository.create();
     */
    static async create(): Promise<BcryptEncryptionRepository> {
        return new BcryptEncryptionRepository();
    }
    async encrypt (value: string): Promise<string> {
        if (value === undefined || value === null || value === '') {
            throw new Error('Value to encrypt is required');
        }

        const hashedPassword = await bcrypt.hash(value, 10);
        return hashedPassword;
    };

    async compare (value1: string, value2: string):Promise<boolean>{
        const isEqual = await bcrypt.compare(value1, value2);
        return isEqual;
    }

}