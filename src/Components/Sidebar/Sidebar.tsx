import { Home, LogOut, PlusSquare, User, FileText, Bookmark, Menu, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { routepath } from '../../Routes/route';

type SidebarProps = {
  onOpenProfile?: () => void;
  onLogout?: () => void;
  active?: 'home' | 'addblog' | 'myblogs' | 'saved' | 'profile' | 'people';
  footer?: ReactNode;
  isCollapsed?: boolean;
  onToggle?: () => void;
};

export default function Sidebar({  onLogout, active, footer, isCollapsed = false, onToggle }: SidebarProps) {
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/homepage' },
    { id: 'addblog', label: 'Add Blog', icon: PlusSquare, path: '/addblog' },
    { id: 'myblogs', label: 'My Blogs', icon: FileText, path: routepath.myBlogs },
    { id: 'saved', label: 'Saved', icon: Bookmark, path: routepath.saved },
    { id: 'profile', label: 'Profile', icon: User, path: routepath.profile },
  ];

  return (
    <aside className="hidden md:flex">
      <div className={`${isCollapsed ? 'w-20' : 'w-56'} shrink-0`} />
      <div className={`fixed left-0 top-0 h-screen ${isCollapsed ? 'w-20' : 'w-56'} border-r border-[#e6f0fa] bg-white shadow-sm transition-all duration-300`}>
        <div className={`h-16 ${isCollapsed ? 'px-2' : 'px-4'} pt-3 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && (
            <button
              type="button"
              onClick={() => navigate('/homepage')}
              className="flex items-center gap-2 pl-2"
            >
              <div className="w-8 h-8 bg-[#0077b6] rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="text-lg font-bold text-gray-900">BlogSphere</span>
            </button>
          )}
          
          <button
            type="button"
            onClick={onToggle}
            className={`${isCollapsed ? 'p-2.5' : 'p-2'} rounded-lg hover:bg-gray-100 transition-colors`}
          >
            {isCollapsed ? (
              <Menu className="w-5 h-5 text-gray-600" />
            ) : (
              <X className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        <div className="h-[calc(100vh-4rem)] flex flex-col py-4">
          {navItems.map((item) => {
            const isActive = active === item.id;
            const isHovered = hoveredItem === item.id;
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                type="button"
                className={`${isCollapsed ? 'mx-2' : 'mx-3'} mb-1 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} ${isCollapsed ? 'px-0' : 'px-3'} py-2.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-[#0077b6] text-white shadow-md'
                    : isHovered
                    ? 'bg-[#f0f7ff] text-[#0077b6]'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => {
                  if (item.path) navigate(item.path);
                }}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`${isCollapsed ? 'w-[22px] h-[22px]' : 'w-5 h-5'} flex-shrink-0`} />
                {!isCollapsed && (
                  <span className="font-medium text-sm">{item.label}</span>
                )}
              </button>
            );
          })}

          <div className="flex-1" />

          {footer && !isCollapsed && <div className="px-3 mb-2">{footer}</div>}

          <button
            type="button"
            className={`${isCollapsed ? 'mx-2' : 'mx-3'} mb-3 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} ${isCollapsed ? 'px-0' : 'px-3'} py-2.5 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200`}
            onMouseEnter={() => setHoveredItem('logout')}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={() => {
              if (onLogout) {
                onLogout();
                return;
              }
              window.dispatchEvent(new CustomEvent('app:logout'));
            }}
            title={isCollapsed ? 'Logout' : undefined}
          >
            <LogOut className={`${isCollapsed ? 'w-[22px] h-[22px]' : 'w-5 h-5'} flex-shrink-0`} />
            {!isCollapsed && (
              <span className="font-medium text-sm">Logout</span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
