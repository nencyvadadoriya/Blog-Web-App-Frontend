import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { 
  Calendar, 
  Clock, 
  User as UserIcon, 
  Heart, 
  MessageCircle, 
  Edit2, 
  Trash2, 
  ArrowLeft,
  Tag,
  Share2
} from 'lucide-react';
import Header from '../../Components/Header/Header';
import Sidebar from '../../Components/Sidebar/Sidebar';
import BlogDetailsSkeleton from '../../Components/Skeleton/BlogDetailsSkeleton';
import { blogService } from '../../services/BlogServices';
import type { Blog, Comment } from '../../Types/Types';
import toast from 'react-hot-toast';

export default function BlogDetails() {
  const { blogId } = useParams<{ blogId: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [liking, setLiking] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      if (!blogId) {
        toast.error('Blog ID not found');
        navigate('/myblogs');
        return;
      }

      try {
        const response = await blogService.fetchSinglBlog(blogId);
        if (response?.result) {
          setBlog(response.result);
        } else {
          toast.error('Blog not found');
          navigate('/myblogs');
        }
      } catch (error) {
        console.error('Failed to fetch blog:', error);
        toast.error('Failed to load blog');
        navigate('/myblogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId, navigate]);

  const handleLike = async () => {
    if (!blog || liking) return;
    
    setLiking(true);
    try {
      const response = await blogService.likeBlog(blog._id, !blog.likes);
      if (response?.result !== undefined) {
        setBlog(prev => prev ? { ...prev, likes: response.result } : null);
        toast.success(blog.likes ? 'Like removed' : 'Blog liked!');
      }
    } catch (error) {
      console.error('Failed to like blog:', error);
      toast.error('Failed to update like');
    } finally {
      setLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!blog || !confirm('Are you sure you want to delete this blog?')) return;
    
    setDeleting(true);
    try {
      await blogService.deleteBlog(blog._id);
      toast.success('Blog deleted successfully');
      navigate('/myblogs');
    } catch (error) {
      console.error('Failed to delete blog:', error);
      toast.error('Failed to delete blog');
    } finally {
      setDeleting(false);
    }
  };

  const handleShare = async () => {
    if (!blog) return;
    
    const url = window.location.href;
    const title = blog.title;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: blog.subtitle,
          url,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
      } catch (error) {
        console.error('Failed to copy:', error);
        toast.error('Failed to copy link');
      }
    }
  };

  if (loading) {
    return <BlogDetailsSkeleton />;
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header isSidebarCollapsed={isSidebarCollapsed} onSidebarToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
        <div className="flex">
          <Sidebar 
            active="myblogs" 
            isCollapsed={isSidebarCollapsed}
            onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Blog not found</h2>
              <Link
                to="/myblogs"
                className="inline-flex items-center gap-2 bg-[#0077b6] text-white px-6 py-3 rounded-lg hover:bg-[#005a8c] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to My Blogs
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
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
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <div className="mb-6">
              <Link
                to="/myblogs"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-[#0077b6] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to My Blogs
              </Link>
            </div>

            {/* Blog Content */}
            <article className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
              {/* Header Image */}
              {blog.thumbnail && (
                <div className="h-64 sm:h-96 overflow-hidden">
                  <img
                    src={blog.thumbnail}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-6 sm:p-8">
                {/* Title and Actions */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                      {blog.title}
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed">
                      {blog.subtitle}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={handleShare}
                      className="p-2 text-gray-600 hover:text-[#0077b6] hover:bg-blue-50 rounded-lg transition-colors"
                      title="Share blog"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                    <Link
                      to={`/editblog/${blog._id}`}
                      className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Edit blog"
                    >
                      <Edit2 className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete blog"
                    >
                      {deleting ? (
                        <div className="w-5 h-5 border border-red-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b">
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4" />
                    <span>{blog.author?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(blog.create_at).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(blog.create_at).toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}</span>
                  </div>
                  {blog.category && (
                    <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {blog.category}
                    </div>
                  )}
                </div>

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {blog.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 text-sm rounded-full border border-blue-100"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Content */}
                <div className="prose prose-lg max-w-none mb-8">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {blog.content}
                  </div>
                </div>

                {/* Engagement Bar */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-8">
                  <button
                    onClick={handleLike}
                    disabled={liking}
                    className="flex items-center gap-2 text-pink-600 hover:text-pink-700 transition-colors disabled:opacity-50"
                  >
                    <Heart className={`w-5 h-5 ${blog.likes > 0 ? 'fill-current' : ''}`} />
                    <span className="font-semibold">{blog.likes || 0}</span>
                    <span className="text-sm">likes</span>
                  </button>
                  
                  <div className="flex items-center gap-2 text-blue-600">
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-semibold">{blog.comment?.length || 0}</span>
                    <span className="text-sm">comments</span>
                  </div>
                </div>

                {/* Comments Section */}
                {blog.comment && blog.comment.length > 0 && (
                  <div className="border-t pt-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                      Comments ({blog.comment.length})
                    </h3>
                    <div className="space-y-4">
                      {blog.comment.map((comment: Comment) => (
                        <div key={comment._id} className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-start gap-3">
                            {comment.userId?.profile_image ? (
                              <img
                                src={comment.userId.profile_image}
                                alt={comment.userId.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                                <UserIcon className="w-5 h-5 text-white" />
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold text-gray-900">
                                  {comment.userId?.name}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {new Date(comment.create_at).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric', 
                                    year: 'numeric' 
                                  })}
                                </span>
                              </div>
                              <p className="text-gray-700 leading-relaxed">
                                {comment.msg}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(!blog.comment || blog.comment.length === 0) && (
                  <div className="border-t pt-8 text-center">
                    <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                  </div>
                )}
              </div>
            </article>
          </div>
        </main>
      </div>
    </div>
  );
}
