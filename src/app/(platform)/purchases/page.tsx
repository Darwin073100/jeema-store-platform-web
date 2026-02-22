import { ProtectedRoute } from "@/shared/ui/components/routes/ProtectedRoute"
import { BreadcrumbItem, TemplateHeader } from "@/shared/ui/components/templates/TemplateHeader"
import Product from '../../../shared/ui/assets/images/product.svg';
import Inventory from '../../../shared/ui/assets/images/inventary.svg';
import Suplier from '../../../shared/ui/assets/images/supliers.svg';
import { CardLink } from "@/shared/ui/components/cards";

export const metadata = {
    title: 'Compras|Opciones',
}

const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Compras'},
    { label: 'Opciones' }
]
const homeCards = [
    {
        title: 'Catalogo Compras',
        description: 'Revisa la lista de compras sucursal.',
        to: '/products/list',
        image: Inventory
    },
    {
        title: 'Proveedores',
        description: 'Agrega y revisa todos tus proveedores',
        to: '/purchases/supliers',
        image: Suplier
    }
];
export default function () {
    return (
        <ProtectedRoute>
            <TemplateHeader title="Menu de opciones | compras" detail="Opciones o acciones para compras." breadcrumbItems={breadcrumbItems}>
                <main className="flex flex-col gap-4 w-full">
                    <form className="flex max-md:flex-col gap-4 w-full text-gray-700">
                        {homeCards.map(item => (
                            <CardLink
                                key={item.title.toString()}
                                title={item.title}
                                description={item.description}
                                to={item.to}
                                image={item.image}
                            />
                        ))}
                    </form>
                </main>
            </TemplateHeader>
        </ProtectedRoute>
    )
}