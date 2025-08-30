# Feature: Lot Management

Este feature maneja la gestión de lotes en el sistema.

## Componentes Disponibles

### 1. RegisterLotModal
Modal para registrar nuevos lotes.

**Uso:**
```tsx
import { RegisterLotModal, useRegisterLotModal } from '@/features/lot';

const MyComponent = () => {
    const { handleOpenRegisterLotModal } = useRegisterLotModal();
    
    return (
        <>
            <button onClick={() => handleOpenRegisterLotModal('123')}>
                Agregar Lote
            </button>
            <RegisterLotModal />
        </>
    );
};
```

### 2. RegisterLotButton
Componente que incluye el botón y el modal.

**Uso:**
```tsx
import { RegisterLotButton } from '@/features/lot';

const MyComponent = () => {
    return <RegisterLotButton productId="123" />;
};
```

### 3. UpdateLotModal
Modal para actualizar lotes existentes.

**Uso:**
```tsx
import { UpdateLotModal, useUpdateLotModal } from '@/features/lot';

const MyComponent = () => {
    const { handleOpenUpdateLotModal } = useUpdateLotModal();
    
    return (
        <>
            <button onClick={() => handleOpenUpdateLotModal(lotEntity)}>
                Editar Lote
            </button>
            <UpdateLotModal />
        </>
    );
};
```

## Hooks Disponibles

### useRegisterLotModal
- `handleOpenRegisterLotModal(productId?: string)`: Abre el modal de registro
- `handleCloseRegisterLotModal()`: Cierra el modal
- `register, handleSubmit, errors`: Funciones de React Hook Form
- `isLoading`: Estado de carga
- `floatMessageState`: Estado de mensajes de notificación

### useUpdateLotModal  
- `handleOpenUpdateLotModal(lot: LotEntity)`: Abre el modal de actualización
- `handleCloseUpdateLotModal()`: Cierra el modal
- `register, handleSubmit, errors`: Funciones de React Hook Form
- `isLoading`: Estado de carga
- `floatMessageState`: Estado de mensajes de notificación

## Validaciones

Ambos formularios incluyen validaciones con Yup:

- **Número de lote**: Requerido, string
- **Precio de compra**: Requerido, número positivo con hasta 4 decimales
- **Cantidad inicial**: Requerido, número positivo con hasta 3 decimales
- **Unidad de compra**: Requerido, debe ser un valor del enum ForSaleEnum
- **Fecha de recepción**: Requerida, formato YYYY-MM-DD
- **Fecha de fabricación**: Opcional, formato YYYY-MM-DD
- **Fecha de caducidad**: Opcional, formato YYYY-MM-DD

## Server Actions

- `registerLotAction(dto: RegisterLotDTO)`: Registra un nuevo lote
- `updateLotAction(dto: UpdateLotDTO)`: Actualiza un lote existente
