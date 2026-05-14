'use client'
import { CardLink } from "@/shared/ui/components/cards";
import { FcSettings, FcTodoList } from "react-icons/fc";
import { MdDashboard } from "react-icons/md";

const TransfersOptions = () => {
    const homeCards = [
        {
            title: 'Configurar sucursal',
            description: 'Configura tu sucursal para traspasos.',
            to: '/transfers/configuration',
            Icon: FcSettings
        },
        {
            title: 'Lista de traspasos',
            description: 'Visualiza la lista de traspasos enviados y recibidos.',
            to: '/transfers/list',
            Icon: FcTodoList
        }
    ];
    return (
        <>
            {homeCards.map(item => (
                <CardLink
                    key={item.title.toString()}
                    title={item.title}
                    description={item.description}
                    to={item.to}
                    Icon={item.Icon}
                />
            ))}
        </>
    )
}

export { TransfersOptions };