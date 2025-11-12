'use server'
import { revalidatePath } from 'next/cache';
import { ProductRepositoryFactory } from "../infraestructure/factories/product-repository.factory";
import { RegisterCompleteProductUseCase } from '../application/use-case/register-complete-product.use-case';
import { RegisterCompleteProductDTO } from '../application/dtos/register-complete-product.dto';
import { cookies } from 'next/headers';
import { EstablishmentEntity } from '@/features/establishment/domain/entities/establishment.entity';
import { BranchOfficeEntity } from '@/features/branch-office/domain/entities/branch-office.entity';

export async function registerCompleteProductAction(dto:RegisterCompleteProductDTO){
    // ✅ Usando DI - Las dependencias se inyectan automáticamente
    const productRepository = ProductRepositoryFactory.create();
    
    const useCase = new RegisterCompleteProductUseCase(
        productRepository,
    );
    
    const cookieStore = await cookies();                 
    let establishment = cookieStore.get('establishmentCookie')?.value ?? null;
    let establishmentId = BigInt(0);
    if (establishment) {
        establishmentId = (JSON.parse(establishment) as EstablishmentEntity).establishmentId;
    }              
    let branchOffice = cookieStore.get('branchOfficeCookie')?.value ?? null;
    let branchOfficeId = BigInt(0);
    if (branchOffice) {
        branchOfficeId = (JSON.parse(branchOffice) as BranchOfficeEntity).branchOfficeId;
    }

    const currentDTO:RegisterCompleteProductDTO = {
        ...dto,
        establishmentId: establishmentId.toString(),
        inventory: dto.inventory? {
            ...dto.inventory,
            branchOfficeId: branchOfficeId.toString()
        }: null
    }

    const result = await useCase.execute(currentDTO);

    // Invalidar el caché de la página de productos para que se actualicen los datos
    if (result?.ok) {
        revalidatePath('/products');
    }

    return {
        ...result
    }
}