'use client'
import { IoClose, IoCloseOutline, IoPushSharp } from 'react-icons/io5';
import { Button } from '../buttons';
import { useAuth } from '@/shared/hooks/useAuth';
import { RoundedButton } from '../buttons/RoundedButton';
import { Spinner } from '../loadings/Spinner';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogoutModal = ({ isOpen, onClose }: LogoutModalProps) => {
  const { logout, user, loading } = useAuth();

  if (!isOpen) return null;

  const handleLogout = async () => {
    await logout();
    onClose();
    // Opcional: redirigir al login
    window.location.href = '/auth/login';
  };

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      {/* Modal positioned top-right */}
      <div
        className=" absolute top-24 sm:right-6 right-4 bg-white rounded-2xl shadow-2xl p-6 w-96 max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Cerrar Sesión
          </h2>
          <RoundedButton
            color='red'
            onClick={onClose}
          >
            <IoClose size={24} />
          </RoundedButton>
        </div>
        
        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-600 mb-2">
            ¿Estás seguro que quieres cerrar sesión?
          </p>
          <p className="text-sm text-gray-500">
            Usuario: <span className="font-medium">{user?.email}</span>
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button
            color='gray'
            onClick={onClose}
          >
            <IoCloseOutline />
            Cancelar
          </Button>
          <Button
            disabled={loading}
            color='red'
            onClick={handleLogout}
          >
            {loading? <Spinner/>: <IoPushSharp />}
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </div>
  );
};
