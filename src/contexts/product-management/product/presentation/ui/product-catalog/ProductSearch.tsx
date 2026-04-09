'use client'
import { TextInput } from '@/shared/ui/components/inputs';
import React from 'react'
import { useProductStore } from '../../stores/product.store';
import { useProductActionsBar } from '../../hooks/useProductActionsBar';

function ProductSearch() {
  const { setSearchCharacter } = useProductStore();
  const { onSubmit } = useProductActionsBar();
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCharacter(event.target.value);
  };
  return (
    <form className="flex gap-2"  onSubmit={(e) => onSubmit(e)}>
        <TextInput placeholder="Filtrar por nombre, códigos de barras o categorías" onChange={handleSearchChange} />
    </form>
  )
}

export { ProductSearch };
