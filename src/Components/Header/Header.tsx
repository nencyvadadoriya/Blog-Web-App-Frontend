import { Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { blogService } from '../../services/BlogServices';
import type { User as UserType } from '../../Types/Types';
import Skeleton from '../Skeleton/Skeleton';
import toast from 'react-hot-toast/headless';

type HeaderProps = {
  isSidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
};

export default function Header({ isSidebarCollapsed = false }: HeaderProps) {
  const [user, setUser] = useState<UserType | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [searchQ, setSearchQ] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false);
  const [searchUsers, setSearchUsers] = useState<UserType[]>([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    const loadProfile = async () => {
      setIsUserLoading(true);
      try {
        const res = await blogService.fetchUserProfile();
        const profile: UserType | undefined = res?.result;
        if (profile) setUser(profile);
      } catch {
        try {
          const raw = localStorage.getItem('user');
          if (raw) {
            const parsed = JSON.parse(raw) as Partial<UserType>;
            if (parsed?.name || parsed?.email) {
              setUser(parsed as UserType);
            }
          }
        } catch {
        }
      } finally {
        setIsUserLoading(false);
      }
    };

    loadProfile();
  }, []);

  useEffect(() => {
    const onLogout = () => handleLogout();

    window.addEventListener('app:logout', onLogout as EventListener);

    return () => {
      window.removeEventListener('app:logout', onLogout as EventListener);
    };
  }, [navigate]);

  const initials = useMemo(() => {
    const value = (user?.name || user?.email || '').trim();
    if (!value) return 'U';
    const parts = value.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0][0]?.toUpperCase() || 'U';
    return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase() || 'U';
  }, [user?.name, user?.email]);

  useEffect(() => {
    const q = searchQ.trim();
    const t = setTimeout(async () => {
      if (q.length < 2) {
        setSearchUsers([]);
        setIsSearchLoading(false);
        return;
      }
      setIsSearchLoading(true);
      try {
        const res = await blogService.searchUsers(q);
        if (res?.error) {
          setSearchUsers([]);
          return;
        }
        setSearchUsers(res?.result || []);
      } catch (e) {
        console.error(e);
        setSearchUsers([]);
      } finally {
        setIsSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(t);
  }, [searchQ]);

  const handleFollowToggle = async (u: UserType) => {
    const wasFollowing = !!u.isFollowing;
    setSearchUsers((prev) => prev.map((x) => (x._id === u._id ? { ...x, isFollowing: !wasFollowing } : x)));
    try {
      if (wasFollowing) {
        await blogService.unfollowUser(u._id);
        toast.success('Unfollowed');
      } else {
        await blogService.followUser(u._id);
        toast.success('Followed');
      }
    } catch (e) {
      console.error(e);
      setSearchUsers((prev) => prev.map((x) => (x._id === u._id ? { ...x, isFollowing: wasFollowing } : x)));
      toast.error('Action failed');
    }
  };

  return (
    <header className={`bg-white shadow-sm sticky top-0 z-50 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-56'} transition-all duration-300`}>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          <div className="relative flex-1 mx-4">

            <div className="flex items-center gap-2 rounded-2xl border border-[#e6f0fa] bg-[#f7fbff] px-4 py-2.5 focus-within:bg-white focus-within:border-[#0077b6] focus-within:ring-2 focus-within:ring-[#e6f0fa] transition">
              <Search className="w-4 h-4 text-[#0077b6]" />
              <input
                value={searchQ}
                onChange={(e) => {
                  setSearchQ(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                onBlur={() => {
                  window.setTimeout(() => setIsSearchOpen(false), 160);
                }}
                placeholder="Search users by name or email"
                className="w-full bg-transparent outline-none text-sm text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {isSearchOpen && (searchQ.trim().length >= 2) && (
              <div className="absolute left-0 right-0 mt-2 rounded-2xl border border-[#e6f0fa] bg-white shadow-2xl overflow-hidden">
                {isSearchLoading ? (
                  <div className="p-4 space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="h-10 rounded-xl bg-gray-100 animate-pulse" />
                    ))}
                  </div>
                ) : searchUsers.length === 0 ? (
                  <div className="p-4 text-sm text-gray-500">No users found.</div>
                ) : (
                  <div className="max-h-80 overflow-auto">
                    {searchUsers.map((u) => (
                      <div 
                        key={u._id} 
                        className="flex items-center justify-between gap-3 px-4 py-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          navigate(`/user/${u._id}`, { state: { user: u, isFollowing: !!u.isFollowing } });
                          setIsSearchOpen(false);
                          setSearchQ('');
                        }}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {u.profile_image ? (
                            <img src={u.profile_image} className="w-9 h-9 rounded-full object-cover" alt={u.name} />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-[#0077b6] text-white flex items-center justify-center font-semibold">
                              {(u.name || u.email || 'U')[0]?.toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-gray-900 truncate">{u.name || 'User'}</div>
                            <div className="text-xs text-gray-500 truncate">{u.email}</div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFollowToggle(u);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${u.isFollowing
                              ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                              : 'bg-[#0077b6] text-white hover:bg-[#005a8c]'
                            }`}
                        >
                          {u.isFollowing ? 'Following' : 'Follow'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4 shrink-0">


            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="flex items-center gap-3 pl-2 pr-3 py-2 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition ml-auto"
              aria-label="Open profile"
            >
              {user?.profile_image ? (
                <img
                  src={user.profile_image}
                  alt={user?.name || user?.email || 'Profile'}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-[#e6f0fa]"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#0077b6] text-white flex items-center justify-center font-semibold ring-2 ring-[#e6f0fa]">
                  {initials}
                </div>
              )}

              <div className="text-right min-w-0">
                <div className="text-sm font-semibold text-gray-900 leading-5 truncate max-w-[220px]">
                  {isUserLoading ? <Skeleton className="h-4 w-28" /> : user?.name}
                </div>
                
              </div>
            </button>
          </div>
        </div>
      </div>

    </header>
  );
}
