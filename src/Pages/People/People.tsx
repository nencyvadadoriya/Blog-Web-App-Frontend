import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import Header from '../../Components/Header/Header';
import Sidebar from '../../Components/Sidebar/Sidebar';
import Footer from '../../Components/Footer/Footer';
import { blogService } from '../../services/BlogServices';
import type { User } from '../../Types/Types';
import toast from 'react-hot-toast/headless';

export default function People() {
  const navigate = useNavigate();
  const [q, setQ] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  useEffect(() => {
    const value = q.trim();
    const t = setTimeout(async () => {
      if (value.length < 2) {
        setUsers([]);
        return;
      }

      setLoading(true);
      try {
        const res = await blogService.searchUsers(value);
        if (!res) {
          setUsers([]);
          return;
        }
        if (res.error) {
          toast.error(res.msg || 'Search failed');
          setUsers([]);
          return;
        }
        setUsers(res.result || []);
      } catch (e) {
        console.error(e);
        toast.error('Search failed');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(t);
  }, [q]);

  const handleFollowToggle = async (u: User) => {
    const wasFollowing = !!u.isFollowing;
    setUsers((prev) => prev.map((x) => (x._id === u._id ? { ...x, isFollowing: !wasFollowing } : x)));

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
      setUsers((prev) => prev.map((x) => (x._id === u._id ? { ...x, isFollowing: wasFollowing } : x)));
      toast.error('Action failed');
    }
  };

  const list = useMemo(() => {
    if (q.trim().length < 2) {
      return <div className="text-sm text-gray-500">Type at least 2 letters to search users.</div>;
    }

    if (loading) {
      return (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-14 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      );
    }

    if (users.length === 0) {
      return <div className="text-sm text-gray-500">No users found.</div>;
    }

    return (
      <div className="divide-y rounded-2xl border border-gray-100 bg-white">
        {users.map((u) => (
          <div 
            key={u._id} 
            className="flex items-center justify-between gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => navigate(`/user/${u._id}/details`, { state: { user: u, isFollowing: !!u.isFollowing } })}
          >
            <div className="flex items-center gap-3 min-w-0">
              {u.profile_image ? (
                <img src={u.profile_image} className="w-10 h-10 rounded-full object-cover" alt={u.name} />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#0077b6] text-white flex items-center justify-center font-semibold">
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
              onClick={(e) => {
                e.stopPropagation();
                handleFollowToggle(u);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                u.isFollowing
                  ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  : 'bg-[#0077b6] text-white hover:bg-[#005a8c]'
              }`}
            >
              {u.isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>
        ))}
      </div>
    );
  }, [loading, q, users]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isSidebarCollapsed={isSidebarCollapsed} onSidebarToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
      <div className="flex">
        <Sidebar  active="people" 
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <main className="flex-1">
          <div className="max-w-3xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-gray-900">People</h1>
            <p className="text-sm text-gray-500 mt-1">Search users and follow them.</p>

            <div className="mt-6">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name or email"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white focus:border-[#0077b6] focus:ring-2 focus:ring-[#e6f0fa] outline-none"
              />
            </div>

            <div className="mt-6">{list}</div>
          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
}
