'use client'
import { TextInput } from '@/shared/ui/components/inputs';
import React from 'react'
import { useLotStore } from '../../stores/lot.store';

function LotSearch() {
  const { setSearchCharacter } = useLotStore();
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCharacter(event.target.value);
  };
  return (
    <form className="flex gap-2"  onSubmit={(e) => e.preventDefault()}>
        <TextInput placeholder="Filtrar por producto o por proveedor." onChange={handleSearchChange} />
    </form>
  )
}

export { LotSearch };
