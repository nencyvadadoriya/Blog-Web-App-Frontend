import {  X } from 'lucide-react';
import { useEffect } from 'react';
import type { User } from '../../Types/Types';
import Skeleton from '../Skeleton/Skeleton';

type ProfileDrawerProps = {
  open: boolean;
  onClose: () => void;
  onLogout?: () => void;
  user?: User | null;
  isLoading?: boolean;
};

function getInitials(nameOrEmail?: string) {
  const value = (nameOrEmail || '').trim();
  if (!value) return '';
  const parts = value.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ;
  return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase() ;
}

export default function ProfileDrawer({ open, onClose, user, isLoading }: ProfileDrawerProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const name = user?.name || '';
  const email = user?.email || '';
  const about = user?.about || '';
  const gender = user?.gender || '';
  const profileImage = user?.profile_image || '';

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        aria-label="Close profile"
        onClick={onClose}
      />

      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
            <p className="text-sm text-gray-500 truncate">Manage your account</p>
          </div>
          <button
            type="button"
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-700"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-4">
            {profileImage ? (
              <img
                src={profileImage}
                alt={name || email || 'Profile'}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-[#e6f0fa]"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-[#0077b6] text-white flex items-center justify-center font-semibold ring-2 ring-[#e6f0fa]">
                {getInitials(name || email)}
              </div>
            )}

            <div className="min-w-0">
              <div className="text-base font-semibold text-gray-900 truncate">
                {isLoading ? <Skeleton className="h-4 w-40" /> : name || 'User'}
              </div>
              <div className="text-sm text-gray-600 truncate">{isLoading ? <Skeleton className="h-4 w-56" /> : email}</div>
            </div>
          </div>

         

          <div className="mt-6 grid grid-cols-1 gap-4">
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <div className="text-xs font-semibold text-gray-500">About</div>
              <div className="mt-1 text-sm text-gray-800 whitespace-pre-wrap">{about || '-'}</div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <div className="text-xs font-semibold text-gray-500">Gender</div>
              <div className="mt-1 text-sm text-gray-800">{gender || '-'}</div>
            </div>
          </div>

          
        </div>
      </aside>
    </div>
  );
}
