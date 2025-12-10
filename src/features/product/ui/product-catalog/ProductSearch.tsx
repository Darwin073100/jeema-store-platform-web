'use client'
import { TextInput } from '@/shared/ui/components/inputs';
import React from 'react'
import { useProductStore } from '../../infraestructure/stores/product.store';

function ProductSearch() {
  const { setSearchCharacter } = useProductStore();
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCharacter(event.target.value);
  };
  return (
    <form className="flex gap-2"  onSubmit={(e) => e.preventDefault()}>
        <TextInput placeholder="Filtrar por nombre, códigos de barras o categorías" onChange={handleSearchChange} />
    </form>
  )
}

export { ProductSearch };
