'use client'
import { IoClose, IoCloseOutline, IoPushSharp } from 'react-icons/io5';
import { Button } from '../buttons';
import { useAuth, useWorkspace } from '@/shared/ui/hooks/auth/useAuth';
import { RoundedButton } from '../buttons/RoundedButton';
import { Spinner } from '../loadings/Spinner';
import { FcSettings } from 'react-icons/fc';
import { BiSolidUserAccount } from 'react-icons/bi';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogoutModal = ({ isOpen, onClose }: LogoutModalProps) => {
  const { logout, user, loading } = useAuth();
  const { employee } = useWorkspace();

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
        className="text-gray-600 absolute top-18 sm:right-1 right-4 bg-white rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
          <div className='border-b border-b-gray-300 p-4'>
            <h2 className="text-xl font-semibold">
              {`${employee?.firstName ?? 'o'} ${employee?.lastName ?? 'o'}`}
            </h2>
            <span className="font-medium">{user?.email}</span>
          </div>
        
        {/* Content */}
        <div className="">
          <button className='p-4 w-full flex gap-2 items-center font-semibold hover:bg-gray-200 cursor-pointer'>
            <FcSettings size={17}/>
            <span>Settings</span>
          </button>
          <button className='p-4 w-full flex gap-2 items-center font-semibold hover:bg-gray-200 cursor-pointer'>
            <BiSolidUserAccount size={17}/>
            <span>Perfil</span>
          </button>
        </div>
        
        {/* Actions */}
        <div className="w-full border-t border-t-gray-300">
          <button
          className='p-4 text-red-600 w-full flex items-center gap-2 hover:bg-red-100 cursor-pointer rounded-b-2xl'
            disabled={loading}
            onClick={handleLogout}
          >
            {loading? <Spinner/>: <IoPushSharp />}
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};
