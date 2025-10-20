'use client'
import { Badge } from '@/ui/components/badges/Badge';
import { Button } from '@/ui/components/buttons';
import { Spinner } from '@/ui/components/loadings/Spinner';
import { useRouter } from 'next/navigation';
import React from 'react'
import { IoPersonAdd } from 'react-icons/io5';

const EmployeeOptios = () => {
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);
    const handleNewEmployee = ()=>{
        setLoading(true);
        router.push('/configurations/employees/new');
    }
    return (
        <div className="flex gap-4 items-center justify-between">
            <Button onClick={()=> handleNewEmployee()} disabled={loading}>
                {loading? <Spinner/>: <IoPersonAdd />} 
                Nuevo empleado
            </Button>
            <div>
                Empleados<Badge>{1}</Badge>
            </div>
        </div>
    )
}

export { EmployeeOptios };
