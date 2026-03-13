import { EncryptionRepository } from "../../domain/repositories/encryption.repository";
import * as bcrypt from 'bcrypt';

export class BcryptEncryptionRepository implements EncryptionRepository{
    async encrypt (value: string): Promise<string> {
        const hashedPassword = await bcrypt.hash(value, 10);
        return hashedPassword;
    };

    async compare (value1: string, value2: string):Promise<boolean>{
        const isEqual = await bcrypt.compare(value1, value2);
        return isEqual;
    }

}