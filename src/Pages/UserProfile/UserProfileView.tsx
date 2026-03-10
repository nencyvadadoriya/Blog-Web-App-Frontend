import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import { Heart, MessageSquare, FileText, User, ArrowLeft, UserPlus, UserMinus } from 'lucide-react';
import Header from '../../Components/Header/Header';
import Sidebar from '../../Components/Sidebar/Sidebar';
import Footer from '../../Components/Footer/Footer';
import { blogService } from '../../services/BlogServices';
import type { Blog, User as UserType, Comment } from '../../Types/Types';
import toast from 'react-hot-toast/headless';

export default function UserProfileView() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const stateUser = (location.state as any)?.user as UserType | undefined;
  const stateIsFollowing = (location.state as any)?.isFollowing as boolean | undefined;
  
  console.log('=== UserProfileView MOUNTED ===');
  console.log('userId from URL:', userId);
  console.log('Current URL:', window.location.pathname);
  
  const [user, setUser] = useState<UserType | null>(stateUser || null);
  const [userBlogs, setUserBlogs] = useState<Blog[]>([]);
  const [followers, setFollowers] = useState<UserType[]>([]);
  const [following, setFollowing] = useState<UserType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFollowing, setIsFollowing] = useState<boolean>(!!stateIsFollowing);
  const [activeTab, setActiveTab] = useState<'posts' | 'likes' | 'comments'>('posts');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  useEffect(() => {
    if (!userId) {
      toast.error('User ID not found');
      navigate('/people');
      return;
    }

    if (typeof stateIsFollowing === 'boolean') {
      setIsFollowing(stateIsFollowing);
    }

    const load = async () => {
      setLoading(true);
      try {
        // Fetch user profile by ID
        console.log('Fetching user with ID:', userId);
        const userRes = await blogService.getUserById(userId);
        console.log('Full User response:', userRes);
        
        // Handle different response formats
        let userData = userRes?.result || userRes?.data || userRes;
        console.log('Extracted User data:', userData);
        
        if (userData && typeof userData === 'object') {
          setUser(userData);
          if (typeof userData.isFollowing === 'boolean') {
            setIsFollowing(userData.isFollowing);
          }
        } else {
          toast.error('User not found or invalid data');
          return;
        }

        // Fetch user blogs
        console.log('Fetching blogs for user:', userId);
        const blogsRes = await blogService.getUserBlogs(userId);
        console.log('Full Blogs response:', blogsRes);
        let blogs = blogsRes?.result || blogsRes?.data || blogsRes || [];
        console.log('Extracted Blogs:', blogs);
        setUserBlogs(Array.isArray(blogs) ? blogs : []);

        // Fetch followers and following
        console.log('Fetching followers/following');
        const followersRes = await blogService.getUserFollowers(userId);
        const followingRes = await blogService.getUserFollowing(userId);
        console.log('Full Followers response:', followersRes);
        console.log('Full Following response:', followingRes);
        
        let followers = followersRes?.result || followersRes?.data || followersRes || [];
        let following = followingRes?.result || followingRes?.data || followingRes || [];
        
        setFollowers(Array.isArray(followers) ? followers : []);
        setFollowing(Array.isArray(following) ? following : []);
      } catch (e: any) {
        console.error('Error loading profile:', e);
        console.error('Error response:', e?.response);
        toast.error('Failed to load user profile: ' + (e?.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userId, navigate]);

  const stats = useMemo(() => {
    const totalPosts = userBlogs.length;
    const totalLikes = userBlogs.reduce((sum, b) => sum + (b.likes || 0), 0);
    const totalComments = userBlogs.reduce((sum, b) => sum + ((b.comment || []).length || 0), 0);
    const blogsWithLikes = userBlogs.filter(b => (b.likes || 0) > 0);
    const allComments = userBlogs.flatMap(b => 
      (b.comment || []).map((c: Comment) => ({
        ...c,
        blogTitle: b.title,
        blogId: b._id
      }))
    );
    return { totalPosts, totalLikes, totalComments, blogsWithLikes, allComments };
  }, [userBlogs]);

  const handleFollowToggle = async () => {
    if (!userId) return;
    try {
      if (isFollowing) {
        await blogService.unfollowUser(userId);
        setIsFollowing(false);
        toast.success('Unfollowed successfully');
      } else {
        await blogService.followUser(userId);
        setIsFollowing(true);
        toast.success('Followed successfully');
      }
      // Refresh followers count
      const followersRes = await blogService.getUserFollowers(userId);
      setFollowers(((followersRes as any)?.result as UserType[]) || []);
    } catch (error) {
      toast.error('Failed to update follow status');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isSidebarCollapsed={isSidebarCollapsed} onSidebarToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
      <div className="flex">
        <Sidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

        <main className="flex-1">
          <div className="min-h-screen bg-gradient-to-br from-[#e6f0fa] to-[#d4e6f5]">
            {/* Top Section */}
            <div className="pt-6 pb-4 px-4 sm:px-6 lg:px-8">
              <button 
                onClick={() => navigate('/homepage')}
                className="flex items-center gap-2 text-[#0077b6] hover:text-[#005a8c] transition-colors mb-4"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Home</span>
              </button>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="relative">
                  <div className="h-32 bg-gradient-to-r from-[#0077b6] to-[#005a8c]"></div>
                  <div className="absolute -bottom-12 left-8">
                    {user?.profile_image ? (
                      <img src={user.profile_image} className="w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-lg" alt={user.name} />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-[#0077b6] text-white flex items-center justify-center text-2xl font-bold ring-4 ring-white shadow-lg">
                        {(user?.name || user?.email || 'U')[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-16 pb-6 px-8">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h1 className="text-2xl font-bold text-gray-900 truncate">{user?.name || 'Loading...'}</h1>
                      <p className="text-gray-600 mt-1 truncate">{user?.email}</p>
                      <p className="text-gray-700 mt-2 max-w-2xl">{user?.about || 'No bio available'}</p>
                    </div>
                    <button
                      onClick={handleFollowToggle}
                      className={`shrink-0 flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
                        isFollowing 
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                          : 'bg-[#0077b6] text-white hover:bg-[#005a8c]'
                      }`}
                    >
                      {isFollowing ? (
                        <>
                          <UserMinus className="w-4 h-4" />
                          Unfollow
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          Follow
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

          {/* Stats Cards */}
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-[#e6f0fa] rounded-lg">
                    <FileText className="w-5 h-5 text-[#0077b6]" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{loading ? '-' : stats.totalPosts}</span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium">Total Posts</h3>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-red-50 rounded-lg">
                    <Heart className="w-5 h-5 text-red-500" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{loading ? '-' : stats.totalLikes}</span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium">Total Likes</h3>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{loading ? '-' : stats.totalComments}</span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium">Comments</h3>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{loading ? '-' : followers.length}</span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium">Followers</h3>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <User className="w-5 h-5 text-orange-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{loading ? '-' : following.length}</span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium">Following</h3>
              </div>
            </div>
          </div>

          {/* Tab Section */}
          <div className="pb-8 px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Tab Navigation */}
              <div className="flex border-b border-gray-200 bg-gray-50">
                <button
                  onClick={() => setActiveTab('posts')}
                  className={`flex-1 py-4 px-6 text-sm font-medium transition-all ${
                    activeTab === 'posts'
                      ? 'text-[#0077b6] border-b-2 border-[#0077b6] bg-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <FileText className="w-4 h-4" />
                    Posts ({stats.totalPosts})
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('likes')}
                  className={`flex-1 py-4 px-6 text-sm font-medium transition-all ${
                    activeTab === 'likes'
                      ? 'text-[#0077b6] border-b-2 border-[#0077b6] bg-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Heart className="w-4 h-4" />
                    Liked Posts ({stats.blogsWithLikes.length})
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('comments')}
                  className={`flex-1 py-4 px-6 text-sm font-medium transition-all ${
                    activeTab === 'comments'
                      ? 'text-[#0077b6] border-b-2 border-[#0077b6] bg-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Comments ({stats.allComments.length})
                  </span>
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077b6]"></div>
                  </div>
                ) : (
                  <>
                    {/* Posts Tab */}
                    {activeTab === 'posts' && (
                      <div className="space-y-4">
                        {userBlogs.length === 0 ? (
                          <div className="text-center py-12 text-gray-500">
                            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>No posts yet</p>
                          </div>
                        ) : (
                          userBlogs.map(blog => (
                            <div key={blog._id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                              <h3 className="font-semibold text-gray-900 mb-2">{blog.title}</h3>
                              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{blog.subtitle}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Heart className="w-4 h-4" />
                                  {blog.likes || 0} likes
                                </span>
                                <span className="flex items-center gap-1">
                                  <MessageSquare className="w-4 h-4" />
                                  {(blog.comment || []).length} comments
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {/* Liked Posts Tab */}
                    {activeTab === 'likes' && (
                      <div className="space-y-4">
                        {stats.blogsWithLikes.length === 0 ? (
                          <div className="text-center py-12 text-gray-500">
                            <Heart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>No liked posts</p>
                          </div>
                        ) : (
                          stats.blogsWithLikes.map(blog => (
                            <div key={blog._id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                              <h3 className="font-semibold text-gray-900 mb-2">{blog.title}</h3>
                              <div className="flex items-center gap-2 text-red-500">
                                <Heart className="w-4 h-4 fill-current" />
                                <span>{blog.likes} likes</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {/* Comments Tab */}
                    {activeTab === 'comments' && (
                      <div className="space-y-4">
                        {stats.allComments.length === 0 ? (
                          <div className="text-center py-12 text-gray-500">
                            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>No comments</p>
                          </div>
                        ) : (
                          stats.allComments.map((comment, idx) => (
                            <div key={`${comment._id}-${idx}`} className="bg-gradient-to-r from-[#e6f0fa] to-[#f0f7ff] rounded-xl p-4 border border-[#cce5ff]">
                              <p className="text-sm font-medium text-[#0077b6] mb-2">On: {comment.blogTitle}</p>
                              <div className="bg-white/80 rounded-xl p-4">
                                <p className="text-gray-800 mb-2">{comment.msg}</p>
                                <p className="text-sm text-gray-500">- {comment.userId?.name || 'Anonymous'}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}
