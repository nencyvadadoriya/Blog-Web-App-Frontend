import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Edit2, Trash2, Eye, Calendar, Mail, Heart, MessageCircle, MoreVertical, Clock, User as UserIcon } from 'lucide-react';
import Header from '../../Components/Header/Header';
import Sidebar from '../../Components/Sidebar/Sidebar';
import MyBlogsSkeleton from '../../Components/Skeleton/MyBlogsSkeleton';
import { blogService } from '../../services/BlogServices';
import type { Blog, Comment } from '../../Types/Types';
import toast from 'react-hot-toast';

export default function MyBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [allBlogsCount, setAllBlogsCount] = useState<number>(0);
  const [expandedBlog, setExpandedBlog] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserEmailAndBlogs = async () => {
      try {
        // IMPORTANT: Blog.author has only _id/name/etc (no email). So we must filter by author._id.
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please login first');
          navigate('/login', { replace: true });
          return;
        }

        let userId = '';
        let email = '';

        // 1) Prefer profile API (token-based)
        const profileRes = await blogService.fetchUserProfile();
        userId = String(profileRes?.result?._id || '');
        email = String(profileRes?.result?.email || '');

        // 2) Fallback to localStorage.user for display + as last resort id
        if (!userId || !email) {
          try {
            const raw = localStorage.getItem('user');
            if (raw) {
              const parsed = JSON.parse(raw) as { _id?: string; email?: string };
              if (!userId) userId = String(parsed?._id || '');
              if (!email) email = String(parsed?.email || '');
            }
          } catch {
          }
        }

        if (!userId) {
          toast.error('User profile not available. Please login again.');
          navigate('/login', { replace: true });
          return;
        }

        setUserEmail(email);

        // Fetch all blogs and filter by user email
        const response = await blogService.fetchAllBlogs();
        const allBlogs: Blog[] = response?.result || [];
        setAllBlogsCount(allBlogs.length);
        
        // Filter blogs by current user's id
        const myBlogs = allBlogs.filter((blog: Blog) => String(blog.author?._id || '') === userId);

        setBlogs(myBlogs);
      } catch (error) {
        console.error('Failed to fetch user data or blogs:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to load your blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchUserEmailAndBlogs();
  }, [navigate]);

  const handleDelete = async (blogId: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;
    
    setDeletingId(blogId);
    try {
      await blogService.deleteBlog(blogId);
      setBlogs(prev => prev.filter(blog => blog._id !== blogId));
      toast.success('Blog deleted successfully');
    } catch (error) {
      console.error('Failed to delete blog:', error);
      toast.error('Failed to delete blog');
    } finally {
      setDeletingId(null);
    }
  };

  const toggleExpanded = (blogId: string) => {
    setExpandedBlog(expandedBlog === blogId ? null : blogId);
  };

  if (loading) {
    return <MyBlogsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header isSidebarCollapsed={isSidebarCollapsed} onSidebarToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
      <div className="flex">
        <Sidebar 
          active="myblogs" 
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <main className="flex-1 py-8">
          <div className={`max-w-7xl ${isSidebarCollapsed ? 'pl-8 pr-4 sm:pl-10 sm:pr-6 lg:pl-12 lg:pr-8' : 'pl-6 pr-4 sm:pl-8 sm:pr-6 lg:pl-10 lg:pr-8'}`}>
        {/* Header */}
        <div className="mb-8 bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-[#0077b6] to-[#00a8cc] bg-clip-text text-transparent">
                My Blogs
              </h1>
              <div className="flex items-center gap-6 text-gray-600">
                <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">{userEmail || 'Unknown email'}</span>
                </div>
                <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full">
                  <span className="font-semibold text-green-700">{blogs.length}</span>
                  <span className="text-sm text-green-600">blog{blogs.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-full">
                  <span className="font-semibold text-purple-700">{allBlogsCount}</span>
                  <span className="text-sm text-purple-600">total blogs</span>
                </div>
              </div>
            </div>
            <Link
              to="/addblog"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0077b6] to-[#00a8cc] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="font-medium">Create New Blog</span>
            </Link>
          </div>
        </div>

        {/* Blogs Grid - Professional Design */}
        {blogs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No blogs yet</h3>
            <p className="text-gray-500 mb-6 text-lg">Start by creating your first blog post</p>
            <Link
              to="/addblog"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0077b6] to-[#00a8cc] text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="font-medium">Create Your First Blog</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Blog Cards */}
            {blogs.map((blog) => (
              <div key={blog._id} className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100">
                <div className="flex flex-col lg:flex-row">
                  {/* Left - Thumbnail */}
                  {blog.thumbnail && (
                    <div className="lg:w-1/3 h-48 lg:h-auto overflow-hidden relative">
                      <img
                        src={blog.thumbnail}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm text-xs font-bold text-gray-800 rounded-full shadow-lg">
                          {blog.category || 'General'}
                        </span>
                      </div>

                      {/* Reading Time Badge */}
                      <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <span className="px-3 py-1.5 bg-black/70 backdrop-blur-sm text-xs font-medium text-white rounded-full">
                          5 min read
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Right - Content */}
                  <div className="flex-1 p-6 lg:p-8">
                    <div className="flex items-start justify-between mb-4">
                      {/* Title and Meta */}
                      <div className="flex-1">
                        <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#0077b6] transition-colors duration-300">
                          {blog.title}
                        </h3>
                        
                        <p className="text-gray-600 mb-4 line-clamp-2 text-base leading-relaxed">
                          {blog.subtitle}
                        </p>

                        {/* Meta Info */}
                        <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#0077b6]" />
                            <span>{new Date(blog.create_at).toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#0077b6]" />
                            <span>{new Date(blog.create_at).toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}</span>
                          </div>
                        </div>

                        {/* Tags */}
                        {blog.tags && blog.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-6">
                            {blog.tags.slice(0, 4).map((tag, index) => (
                              <span
                                key={index}
                                className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200 hover:border-blue-300 transition-colors"
                              >
                                #{tag}
                              </span>
                            ))}
                            {blog.tags.length > 4 && (
                              <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                                +{blog.tags.length - 4} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Stats Card */}
                      <div className="ml-6">
                        <div className="flex flex-col gap-2 items-end">
                          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-pink-100 shadow-sm">
                            <div className="p-1.5 rounded-lg bg-pink-50 text-pink-600">
                              <Heart className="w-4 h-4" />
                            </div>
                            <div className="text-sm font-semibold text-gray-900">{blog.likes || 0}</div>
                            
                          </div>
                          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-blue-100 shadow-sm">
                            <div className="p-1.5 rounded-lg bg-blue-50 text-[#0077b6]">
                              <MessageCircle className="w-4 h-4" />
                            </div>
                            <div className="text-sm font-semibold text-gray-900">{blog.comment?.length || 0}</div>
                            
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Comments Preview (when expanded) */}
                    {expandedBlog === blog._id && blog.comment && blog.comment.length > 0 && (
                      <div className="border-t border-gray-100 p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <div className="flex items-center gap-2 mb-4">
                          <MessageCircle className="w-5 h-5 text-blue-600" />
                          <h4 className="text-sm font-bold text-blue-800">Recent Comments</h4>
                          <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                            {blog.comment.length}
                          </span>
                        </div>
                        <div className="space-y-3 max-h-40 overflow-y-auto">
                          {blog.comment.slice(0, 3).map((comment: Comment) => (
                            <div key={comment._id} className="bg-white rounded-lg p-3 shadow-sm">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full flex items-center justify-center">
                                  <UserIcon className="w-3 h-3 text-white" />
                                </div>
                                <span className="text-sm font-semibold text-gray-800">{comment.userId?.name}</span>
                                <span className="text-xs text-gray-500">
                                  {new Date(comment.create_at).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">{comment.msg}</p>
                            </div>
                          ))}
                          {blog.comment.length > 3 && (
                            <p className="text-center text-sm text-blue-600 font-medium pt-2">
                              +{blog.comment.length - 3} more comments...
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="border-t border-gray-100 p-4 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleExpanded(blog._id)}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-white text-gray-700 border border-gray-200 hover:border-[#0077b6]/30 hover:text-[#0077b6] hover:bg-blue-50/40 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100"
                          >
                            <MoreVertical className="w-4 h-4" />
                            {expandedBlog === blog._id ? 'Hide Details' : 'Show Details'}
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/blog/${blog._id}`}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-[#0077b6] text-white hover:bg-[#005a8c] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Link>
                          <Link
                            to={`/editblog/${blog._id}`}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-100"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(blog._id)}
                            disabled={deletingId === blog._id}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-white text-red-700 border border-red-200 hover:bg-red-50 hover:border-red-300 transition-colors shadow-sm disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red-100"
                          >
                            {deletingId === blog._id ? (
                              <div className="w-4 h-4 border border-red-400 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
          </div>
        </main>
      </div>
    </div>
  );
}
