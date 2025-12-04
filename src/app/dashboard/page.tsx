"use client";

import { useAuth, useWorkspace } from "@/shared/hooks/useAuth";
import { ProtectedRoute } from "@/shared/ui/components/routes/ProtectedRoute";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { establishment, branchOffice, employee } = useWorkspace();
  const router = useRouter();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Dashboard
                </h1>
                <p className="text-gray-600 mt-2">
                  Bienvenido de vuelta, {employee?.firstName || user?.username}
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => router.push('/profile')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Ver Perfil
                </button>
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>

          {/* Información del Workspace */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Establecimiento
              </h3>
              <p className="text-2xl font-bold text-blue-600">
                {establishment?.name}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                ID: {establishment?.establishmentId}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Sucursal
              </h3>
              <p className="text-2xl font-bold text-green-600">
                {branchOffice?.name}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {branchOffice?.address.city}, {branchOffice?.address.state}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Usuario
              </h3>
              <p className="text-lg font-bold text-purple-600">
                {user?.username}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {user?.email}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {user?.roles.map(role => (
                  <span
                    key={role}
                    className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Permisos del Usuario */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Permisos del Usuario
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {user?.permissions.map(permission => (
                <span
                  key={permission}
                  className="bg-gray-100 text-gray-800 text-sm px-3 py-2 rounded-lg text-center"
                >
                  {permission}
                </span>
              ))}
            </div>
          </div>

          {/* Enlaces Rápidos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Ventas
              </h4>
              <p className="text-gray-600 mb-4">
                Gestionar ventas y clientes
              </p>
              <button 
                onClick={() => router.push('/sale')}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
              >
                Ir a Ventas
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Productos
              </h4>
              <p className="text-gray-600 mb-4">
                Administrar inventario
              </p>
              <button 
                onClick={() => router.push('/products')}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
              >
                Ir a Productos
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Sucursales
              </h4>
              <p className="text-gray-600 mb-4">
                Gestionar sucursales
              </p>
              <button 
                onClick={() => router.push('/branch-office')}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg"
              >
                Ir a Sucursales
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
