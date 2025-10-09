import { ProtectedRoute } from "@/ui/components/routes/ProtectedRoute";
import { Metadata } from "next";
import { Button } from "@/ui/components/buttons";
import Link from "next/link";
import { viewProductByIdAction } from "@/features/product/actions/view-product-by-id.action";
import { ProductDetailsView } from "@/features/product/ui/product-detail/ProductDetailsView";
import { BreadcrumbItem, TemplateHeader } from "@/ui/components/templates/TemplateHeader";
import { FcSurvey } from "react-icons/fc";
import { findSaleInfoByIdAction } from "@/features/sale/actions/find-sale-info-by-id.action";
import { SaleStatusEnum } from "@/features/sale/domain/enums/sale-status.enum";

// Configurar la página para que no se cachée y siempre obtenga datos frescos
export const revalidate = 0; // Revalidar en cada request
export const dynamic = 'force-dynamic'; // Forzar renderizado dinámico

export const metadata: Metadata = {
    title: 'Detalles del Producto'
}

interface Props {
    params: {
        saleId: string;
    }
}

// La data de la venta ya desestructurada para facilitar la lectura
// const data = {
//     "saleId": "114",
//     "branchOfficeId": "1",
//     "customerId": "6",
//     "employeeId": "9",
//     "subTotalAmount": "435.00",
//     "discountAmount": "0.00",
//     "taxAmount": "69.60",
//     "totalAmount": "435.00",
//     "status": "completada",
//     "notes": null,
//     "createdAt": "2025-10-08T15:31:10.596Z",
//     "updatedAt": "2025-10-08T15:32:45.203Z",
//     "deletedAt": null,
//     "branchOffice": null,
//     "customer": {
//         "establishmentId": "1",
//         "addressId": "15",
//         "firstName": "Mario",
//         "lastName": "Magallon Martínez",
//         "companyName": "Los de la Doble MM",
//         "customerId": "6",
//         "phoneNumber": "5551234567",
//         "rfc": "MMM890123AX",
//         "email": "mamagallon@jemae.platform.com",
//         "customerType": "Minorista",
//         "address": {
//             "street": "Av. Reforma",
//             "externalNumber": "123",
//             "internalNumber": "4B",
//             "municipality": "Cuauhtémoc",
//             "neighborhood": "Centro",
//             "city": "Ciudad de México",
//             "state": "CDMX",
//             "postalCode": "06000",
//             "country": "México",
//             "reference": "Frente al parque"
//         },
//         "createdAt": "2025-09-29T02:20:09.312Z",
//         "updatedAt": null,
//         "deletedAt": null
//     },
//     "employee": {
//         "employeeId": "9",
//         "branchOfficeId": "1",
//         "employeeRoleId": "1",
//         "addressId": null,
//         "firstName": "Edwin",
//         "lastName": "Garcia",
//         "email": "edwin@gmail.com",
//         "phoneNumber": "7411073337",
//         "birthDate": "2000-07-30T00:00:00.000Z",
//         "gender": "masculino",
//         "hireDate": "2025-07-13T00:00:00.000Z",
//         "terminationDate": null,
//         "entryTime": "09:00:00",
//         "exitTime": "18:00:00",
//         "currentSalary": 15000,
//         "isActive": true,
//         "photoUrl": "https://example.com/photo.jpg",
//         "createdAt": "2025-08-04T04:29:12.691Z",
//         "updatedAt": null,
//         "deletedAt": null,
//         "address": null
//     },
//     "saleDetails": [
//         {
//             "saleDetailId": "144",
//             "discountItem": 0,
//             "inventoryId": "28",
//             "notes": "Agregado el 8/10/2025, 9:31:39 a.m.",
//             "productBarCodeAtSale": "som123",
//             "productCategoryAtSale": "Sombrillas",
//             "productDescriptionAtSale": "Probando",
//             "productBrandAtSale": "Generica",
//             "productId": "108",
//             "productNameAtSale": "Sombrilla de Doble Tela",
//             "productUnitAtSale": "pc",
//             "saleFor": "Mayoreo",
//             "quantity": 3,
//             "regularPriceAtSale": 70,
//             "saleId": "114",
//             "subtotalItem": "210.00",
//             "unitPriceAtSale": 70,
//             "createdAt": "2025-10-08T15:31:10.671Z",
//             "updatedAt": "2025-10-08T15:31:40.361Z",
//             "deletedAt": null
//         },
//         {
//             "saleDetailId": "145",
//             "discountItem": 0,
//             "inventoryId": "29",
//             "notes": "Agregado el 8/10/2025, 9:32:25 a.m.",
//             "productBarCodeAtSale": "sandinf123",
//             "productCategoryAtSale": "Calzado",
//             "productDescriptionAtSale": "",
//             "productBrandAtSale": "Sport",
//             "productId": "109",
//             "productNameAtSale": "Sandalia Sport de Niño",
//             "productUnitAtSale": "pc",
//             "saleFor": "Menudeo",
//             "quantity": 5,
//             "regularPriceAtSale": 45,
//             "saleId": "114",
//             "subtotalItem": "225.00",
//             "unitPriceAtSale": 45,
//             "createdAt": "2025-10-08T15:31:55.316Z",
//             "updatedAt": "2025-10-08T15:32:26.712Z",
//             "deletedAt": null
//         }
//     ],
//     "salePayments": [
//         {
//             "salePaymentId": "36",
//             "paymentMethodId": "1",
//             "saleId": "114",
//             "amountPaid": "435.00",
//             "referenceNumber": "REF-CASH-1759937549535",
//             "createdAt": "2025-10-08T15:32:45.685Z",
//             "updatedAt": null,
//             "deletedAt": null,
//             "paymentMethod": {
//                 "paymentMethodId": "1",
//                 "name": "Efectivo",
//                 "requiresReference": false,
//                 "createdAt": "2025-09-05T17:57:11.718Z",
//                 "updatedAt": "2025-09-05T17:58:54.621Z",
//                 "deletedAt": null
//             }
//         }
//     ]
// };

export default async function SaleInformationPage({ params }: Props) {
    // Función de utilidad para formatear moneda
    const formatCurrency = (amount: any) => `$${parseFloat(amount).toFixed(2)}`;

    // Función de utilidad para Badge (usando el verde esmeralda para 'completada')
    const getStatusBadge = (status: SaleStatusEnum) => {
        const statusText = status.charAt(0).toUpperCase() + status.slice(1);
        const classes = status === SaleStatusEnum.COMPLETED ? 'bg-emerald-100 text-emerald-800' : status === SaleStatusEnum.CANCELLED ?'bg-red-100 text-red-800': status === SaleStatusEnum.PENDING ? 'bg-yellow-100 text-yellow-800': 'bg-red-100 text-red-800';
        return (
            <span className={`px-3 py-1 text-sm font-semibold rounded-full uppercase ${classes}`}>
                {statusText}
            </span>
        );
    };

    const breadcrumbItems: BreadcrumbItem[] = [
        {
            label: 'ventas',
            href: '/sale'
        },
        {
            label: `Venta #${params.saleId}`
        }
    ]
    const { saleId } = await params;

    // Obtener los detalles del producto
    const saleResult = await findSaleInfoByIdAction(BigInt(saleId));

    if (!saleResult.ok || !saleResult.value) {
        return (
            <ProtectedRoute>
                <main className="flex flex-col gap-6 w-full min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-50 p-4">                    
                    <div className="bg-gradient-to-r from-gray-100 to-gray-100 border-2 border-gray-300 text-red-800 px-6 py-8 rounded-xl shadow-lg text-center">
                        <div className="text-6xl mb-4">🔍</div>
                        <h2 className="text-xl font-bold mb-2">¡Oops! No pudimos encontrar la informacion de la venta</h2>
                        <p className="text-red-700">La venta solicitada no existe en nuestra base de datos o no se pudo cargar en este momento.</p>
                        <div className="mt-6">
                            <Link href="/Sale">
                                <Button color="red">
                                    🏠 Volver a la lista de ventas
                                </Button>
                            </Link>
                        </div>
                    </div>
                </main>
            </ProtectedRoute>
        );
    }

    const data = saleResult.value;

    return (
        <ProtectedRoute>
            <TemplateHeader title={`Folio de la venta #${params.saleId}`} detail="Vista general de ventas" breadcrumbItems={breadcrumbItems}>
                    {/* ENCABEZADO Y ACCIONES PRINCIPALES */}
                    <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                            {getStatusBadge(data.status)}
                            {/* Botones de acción */}
                            <button className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors shadow-md">
                                Reimprimir ticket de la venta
                            </button>
                        </div>
                        <h1 className="text-3xl font-extrabold text-blue-600">
                        </h1>
                    </div>

                    {/* LAYOUT PRINCIPAL: 2/3 Productos/Totales y 1/3 Cliente/Empleado */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* COLUMNA PRINCIPAL (PRODUCTOS Y TOTALES) - MANTENIENDO EL ORDEN INVERTIDO */}
                        <div className="lg:col-span-2 space-y-6 order-last lg:order-first"> {/* Agregado 'order-last' para mover la columna abajo en móvil, pero 'lg:order-first' para mantenerla arriba en escritorio */}

                            {/* 1. SECCIÓN DE PRODUCTOS VENDIDOS (TABLA) - EN LA PARTE SUPERIOR */}
                            <div className="bg-white p-5 rounded-xl shadow-xl border border-blue-100/70"> {/* Sombra más fuerte y borde sutil azul para destacarla */}
                                <h2 className="text-2xl font-extrabold text-gray-900 mb-4 pb-3 border-b border-gray-100 flex items-center gap-2">
                                    <FcSurvey /> <span>Artículos de la Venta ({data.saleDetails?.length ?? 'N/A'})</span>
                                </h2>

                                {/* Contenedor responsivo para scroll horizontal */}
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-sm text-left">
                                        <thead className="text-xs text-gray-600 uppercase bg-blue-50/50 font-semibold sticky top-0"> {/* Fondo ligeramente azul para la cabecera */}
                                            <tr>
                                                <th scope="col" className="px-4 py-3">Producto</th>
                                                <th scope="col" className="px-4 py-3 text-right">Cant.</th>
                                                <th scope="col" className="px-4 py-3 text-right text-orange-600">P. Unitario</th>
                                                <th scope="col" className="px-4 py-3 text-right">Descuento</th>
                                                <th scope="col" className="px-4 py-3 text-right">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.saleDetails?.map(item => (
                                                <tr
                                                    key={item.saleDetailId}
                                                    className="bg-white border-b border-gray-100 hover:bg-blue-50/30 transition-colors duration-150" // Efecto hover sutil
                                                >
                                                    <td className="px-4 py-3">
                                                        <p className="font-semibold text-gray-800">{item.productNameAtSale}</p>
                                                        <p className="text-xs text-gray-500">Marca: {item.productBrandAtSale} | Código: {item.productBarCodeAtSale}</p>
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-medium">{item.quantity}</td>
                                                    <td className="px-4 py-3 text-right font-semibold text-orange-600">
                                                        {formatCurrency(item.unitPriceAtSale)}
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-red-600">
                                                        -{formatCurrency(item.discountItem)}
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-bold text-gray-900">
                                                        {formatCurrency(item.subtotalItem)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* 2. RESUMEN FINANCIERO (TOTALES) - SEGUNDO EN LA COLUMNA */}
                            <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200">
                                <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
                                    Resumen Financiero
                                </h2>
                                {/* ... (Contenido de totales sigue igual) ... */}
                                <div className="p-4 bg-gray-50 rounded-lg">

                                    <div className="flex justify-between items-center py-1">
                                        <span className="text-gray-700">Subtotal (sin IVA):</span>
                                        <span className="font-medium text-gray-800">{formatCurrency(data.subTotalAmount)}</span>
                                    </div>

                                    <div className="flex justify-between items-center py-1">
                                        <span className="text-gray-700">Impuestos (IVA):</span>
                                        <span className="font-medium text-gray-800">{formatCurrency(data.taxAmount)}</span>
                                    </div>

                                    <div className="flex justify-between items-center py-1">
                                        <span className="text-gray-700">Descuento Total:</span>
                                        <span className={`font-medium ${parseFloat(data?.discountAmount.toString()) > 0 ? 'text-red-600' : 'text-gray-800'}`}>
                                            -{formatCurrency(data.discountAmount)}
                                        </span>
                                    </div>

                                    <div className="pt-3 mt-3 border-t border-gray-300 flex justify-between items-center">
                                        <span className="text-xl font-bold text-gray-800">TOTAL FINAL:</span>
                                        <span className="text-3xl font-extrabold text-blue-700">
                                            {formatCurrency(data.totalAmount)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* COLUMNA LATERAL (DATOS DE CONTEXTO) - ORDEN NORMAL (SE MANTIENE EN LA DERECHA) */}
                        <aside className="lg:col-span-1 space-y-6">

                            {/* 3. DATOS DEL CLIENTE */}
                            <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200">
                                {/* ... (Contenido de Cliente sigue igual) ... */}
                                <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-blue-500/50">
                                    Datos del Cliente
                                </h2>
                                <dl className="text-sm">
                                    <div className="py-2">
                                        <dt className="font-semibold text-gray-600">Nombre:</dt>
                                        <dd className="text-gray-800">{data?.customer?.firstName} {data?.customer?.lastName}</dd>
                                    </div>
                                    <div className="py-2 border-t border-gray-100">
                                        <dt className="font-semibold text-gray-600">Empresa:</dt>
                                        <dd className="text-gray-800">{data?.customer?.companyName}</dd>
                                    </div>
                                    <div className="py-2 border-t border-gray-100">
                                        <dt className="font-semibold text-gray-600">Teléfono:</dt>
                                        <dd className="text-blue-600 hover:underline">{data?.customer?.phoneNumber}</dd>
                                    </div>
                                </dl>
                                <button className="mt-4 w-full py-2 text-sm font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors">
                                    Ver Perfil de Cliente
                                </button>
                            </div>

                            {/* 4. DATOS DEL EMPLEADO Y TIEMPO */}
                            <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200">
                                {/* ... (Contenido de Transacción sigue igual) ... */}
                                <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
                                    Información de la Transacción
                                </h2>
                                <dl className="text-sm">
                                    <div className="py-2">
                                        <dt className="font-semibold text-gray-600">Vendedor:</dt>
                                        <dd className="text-gray-800">{data?.employee?.firstName} {data?.employee?.lastName}</dd>
                                    </div>
                                    <div className="py-2 border-t border-gray-100">
                                        <dt className="font-semibold text-gray-600">Fecha de Venta:</dt>
                                        <dd className="text-gray-800">{new Date(data.createdAt).toLocaleDateString()}</dd>
                                    </div>
                                </dl>
                            </div>

                            {/* 5. PAGOS REALIZADOS */}
                            <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200">
                                {/* ... (Contenido de Pagos sigue igual) ... */}
                                <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
                                    Pagos
                                </h2>
                                {data.salePayments?.map(p => (
                                    <div key={p.salePaymentId} className="py-2 px-3 mb-2 rounded-md bg-blue-50 border-l-4 border-blue-400">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-semibold text-gray-700">{p?.paymentMethod?.name}</span>
                                            <span className="font-bold text-gray-900">{formatCurrency(p.amountPaid)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </aside>
                    </div>
            </TemplateHeader>
        </ProtectedRoute>
    );
}
