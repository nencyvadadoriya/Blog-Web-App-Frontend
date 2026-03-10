import { useEffect, useMemo, useState } from 'react';
import Header from '../../Components/Header/Header';
import Sidebar from '../../Components/Sidebar/Sidebar';
import Footer from '../../Components/Footer/Footer';
import { blogService } from '../../services/BlogServices';
import type { Blog } from '../../Types/Types';
import toast from 'react-hot-toast/headless';
import { useNavigate } from 'react-router';
import { routepath } from '../../Routes/route';

export default function Saved() {
  const [loading, setLoading] = useState<boolean>(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await blogService.getSavedBlogs();
        if (!res) {
          setBlogs([]);
          return;
        }
        if (res.error) {
          toast.error(res.msg || 'Failed to load saved blogs');
          setBlogs([]);
          return;
        }
        setBlogs(res.result || []);
      } catch (e) {
        console.error(e);
        toast.error('Failed to load saved blogs');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const content = useMemo(() => {
    if (loading) {
      return (
        <div className={`max-w-6xl py-10 ${isSidebarCollapsed ? 'pl-8 pr-4 sm:pl-10 sm:pr-6 lg:pl-12 lg:pr-8' : 'pl-6 pr-4 sm:pl-8 sm:pr-6 lg:pl-10 lg:pr-8'}`}>
          <div className="h-8 w-44 bg-gray-200 rounded animate-pulse mb-6" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200 animate-pulse" />
                <div className="p-6 space-y-3">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className={`max-w-6xl py-10 ${isSidebarCollapsed ? 'pl-8 pr-4 sm:pl-10 sm:pr-6 lg:pl-12 lg:pr-8' : 'pl-6 pr-4 sm:pl-8 sm:pr-6 lg:pl-10 lg:pr-8'}`}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Saved</h1>
          <button
            type="button"
            onClick={() => navigate(routepath.HomePage)}
            className="text-sm font-semibold text-[#0077b6] hover:text-[#005a8c]"
          >
            Back to Home
          </button>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center text-gray-500 py-16">No saved blogs yet.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
            {blogs.map((post) => (
              <article
                key={post._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <img src={post.thumbnail} alt={post.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-[#e6f0fa] text-[#0077b6] text-xs px-2 py-1 rounded-full font-medium">
                      {post.category}
                    </span>
                  </div>
                  <h3
                    className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 cursor-pointer hover:text-[#0077b6]"
                    onClick={() => navigate(routepath.blogDetails + '/' + post._id)}
                  >
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.subtitle}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="truncate">{post.author?.name || 'Unknown'}</div>
                    <div className="shrink-0">{post.likes || 0} likes</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    );
  }, [blogs, loading, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isSidebarCollapsed={isSidebarCollapsed} onSidebarToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
      <div className="flex">
        <Sidebar 
          active="saved" 
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <main className="flex-1">
          {content}
          <Footer />
        </main>
      </div>
    </div>
  );
}
