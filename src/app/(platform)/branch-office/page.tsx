'use client'
import { ProtectedRoute } from "@/ui/components/routes/ProtectedRoute";
import { Button } from "@/ui/components/buttons";
import { useState } from "react";
import { BreadcrumbItem, TemplateHeader } from "@/ui/components/templates/TemplateHeader";

export default function () {
    const breadcrumbItems: BreadcrumbItem[] = [
        {
            label: 'Sucursales'
        }
    ]
    const [isOpenModal, setIsOpenModal] = useState(false);
    const openModal = () => {
        if (isOpenModal) setIsOpenModal(false);
        else setIsOpenModal(true);
    };

    return (
        <ProtectedRoute>
            <TemplateHeader title="Vista Sucursales" detail="Vista general de las sucursales del establecimiento" breadcrumbItems={breadcrumbItems}>
                <div className="flex w-full justify-center">
                    <div className="flex flex-col gap-4 bg-white shadow-2xl rounded-2xl mx-auto max-w-2xl p-8 lg:max-w-7xl">
                        <div className="flex gap-2 items-center">
                            <h1 className="text-3xl font-bold">Sucursales</h1>
                            <Button color="blue" onClick={openModal}>Agregar sucursal</Button>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                                <div className="transition-all duration-300 hover:bg-gray-200 cursor-pointer flex flex-col gap-2 w-[300px] shadow-2xl p-4 rounded-2xl">
                                    <span className="text-xl font-bold">Sucursal la Guadalupe</span>
                                    <span>Los Tamarindos S.A. de C.V.</span>
                                    <span>41700</span>
                                    <span>Juan Ruiz de Alarcón</span>
                                    <span>14</span>
                                    <span>S/N</span>
                                    <span>Barrio de la Guadalupe, Ometepec</span>
                                    <span>Ometepec</span>
                                    <span>Guerrero</span>
                                </div>
                                <div className="transition-all duration-300 hover:bg-gray-200 cursor-pointer flex flex-col gap-2 w-[300px] shadow-2xl p-4 rounded-2xl">
                                    <span className="text-xl font-bold">Sucursal el Dispensario</span>
                                    <span>Los Tamarindos S.A. de C.V.</span>
                                    <span>41700</span>
                                    <span>Juan Ruiz de Alarcón</span>
                                    <span>14</span>
                                    <span>S/N</span>
                                    <span>Barrio el Dispensario, Ometepec</span>
                                    <span>Ometepec</span>
                                    <span>Guerrero</span>
                                </div>
                                <div className="transition-all duration-300 hover:bg-gray-200 cursor-pointer flex flex-col gap-2 w-[300px] shadow-2xl p-4 rounded-2xl">
                                    <span className="text-xl font-bold">Sucursal el Dispensario</span>
                                    <span>Los Tamarindos S.A. de C.V.</span>
                                    <span>41700</span>
                                    <span>Juan Ruiz de Alarcón</span>
                                    <span>14</span>
                                    <span>S/N</span>
                                    <span>Barrio el Dispensario, Ometepec</span>
                                    <span>Ometepec</span>
                                    <span>Guerrero</span>
                                </div>
                                <div className="transition-all duration-300 hover:bg-gray-200 cursor-pointer flex flex-col gap-2 w-[300px] shadow-2xl p-4 rounded-2xl">
                                    <span className="text-xl font-bold">Sucursal el Dispensario</span>
                                    <span>Los Tamarindos S.A. de C.V.</span>
                                    <span>41700</span>
                                    <span>Juan Ruiz de Alarcón</span>
                                    <span>14</span>
                                    <span>S/N</span>
                                    <span>Barrio el Dispensario, Ometepec</span>
                                    <span>Ometepec</span>
                                    <span>Guerrero</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <Modal isOpen={isOpenModal}>
                        <div className="flex w-full h-full justify-center items-center">
                            <form className="bg-white w-[700px] rounded-2xl shadow-md p-8 flex flex-col gap-4">
                                <div>
                                    <h1 className="text-2xl font-bold mb-4">Informacion de la sucursal</h1>
                                    <Button onClick={()=> openModal()}>Close</Button>
                                </div>
                                <div>
                                    <LabelInput htmlFor="txtName" value="Nombre de la sucursal" />
                                    <TextInput name="txtName" placeholder="Los Tamarindos S.A. de C.V." />
                                </div>
                                <div>
                                    <LabelInput htmlFor="txtPostalCode" value="Codigo postal" />
                                    <TextInput name="txtPostalCode" placeholder="41700" type="number" />
                                </div>
                                <div>
                                    <LabelInput htmlFor="txtStreet" value="Nombre de la calle" />
                                    <TextInput name="txtStreet" placeholder="Juan Ruiz de Alarcón" />
                                </div>
                                <div>
                                    <LabelInput htmlFor="txtInteriorNumber" value="Numero interior" />
                                    <TextInput name="txtInteriorNumber" placeholder="14" />
                                </div>
                                <div>
                                    <LabelInput htmlFor="txtExteriorNumber" value="Numero exterior" />
                                    <TextInput name="txtExteriorNumber" placeholder="S/N" />
                                </div>
                                <div>
                                    <LabelInput htmlFor="txtDistrict" value="Distrito o municipio" />
                                    <TextInput name="txtDistrict" placeholder="Barrio de la Guadalupe, Ometepec" />
                                </div>
                                <div>
                                    <LabelInput htmlFor="txtCity" value="Ciudad" />
                                    <TextInput name="txtCity" placeholder="Ometepec" />
                                </div>
                                <div>
                                    <LabelInput htmlFor="txtState" value="Estado" />
                                    <TextInput name="txtState" placeholder="Guerrero" />
                                </div>
                                <Button color="blue">Guardar</Button>
                            </form>
                        </div>
                    </Modal> */}
                </div>
                
            </TemplateHeader>
        </ProtectedRoute>
    );
}