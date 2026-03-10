import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import { Heart, MessageSquare, FileText, ArrowLeft, UserPlus, UserMinus } from 'lucide-react';
import Header from '../../Components/Header/Header';
import Sidebar from '../../Components/Sidebar/Sidebar';
import Footer from '../../Components/Footer/Footer';
import { blogService } from '../../services/BlogServices';
import type { Blog, User as UserType, Comment } from '../../Types/Types';
import toast from 'react-hot-toast/headless';

export default function InDetailsUserProfileView() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const stateUser = (location.state as any)?.user as UserType | undefined;
  const stateIsFollowing = (location.state as any)?.isFollowing as boolean | undefined;

  const [user, setUser] = useState<UserType | null>(stateUser || null);
  const [userBlogs, setUserBlogs] = useState<Blog[]>([]);
  const [followers, setFollowers] = useState<UserType[]>([]);
  const [following, setFollowing] = useState<UserType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFollowing, setIsFollowing] = useState<boolean>(!!stateIsFollowing);
  const [activeTab, setActiveTab] = useState<'posts' | 'likes' | 'comments'>('posts');
  const [activeConnectionTab, setActiveConnectionTab] = useState<'followers' | 'following' | null>(null);

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
        try {
          const userRes = await blogService.getUserById(userId);
          const userData = (userRes as any)?.result || (userRes as any)?.data || userRes;
          if (userData && typeof userData === 'object') {
            setUser(userData);
            if (typeof userData.isFollowing === 'boolean') {
              setIsFollowing(userData.isFollowing);
            }
          }
        } catch {
        }

        try {
          const blogsRes = await blogService.getUserBlogs(userId);
          const blogs = (blogsRes as any)?.result || (blogsRes as any)?.data || blogsRes || [];
          setUserBlogs(Array.isArray(blogs) ? blogs : []);
        } catch {
          setUserBlogs([]);
        }

        try {
          const followersRes = await blogService.getUserFollowers(userId);
          const followersData = (followersRes as any)?.result || (followersRes as any)?.data || followersRes || [];
          setFollowers(Array.isArray(followersData) ? followersData : []);
        } catch {
          setFollowers([]);
        }

        try {
          const followingRes = await blogService.getUserFollowing(userId);
          const followingData = (followingRes as any)?.result || (followingRes as any)?.data || followingRes || [];
          setFollowing(Array.isArray(followingData) ? followingData : []);
        } catch {
          setFollowing([]);
        }
      } catch (e: any) {
        console.error('Error loading profile:', e);
        toast.error('Failed to load user profile: ' + (e?.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userId, navigate, stateIsFollowing]);

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
      const followersRes = await blogService.getUserFollowers(userId);
      setFollowers(((followersRes as any)?.result as UserType[]) || []);
    } catch {
      toast.error('Failed to update follow status');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isSidebarCollapsed={isSidebarCollapsed} onSidebarToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
      <div className="flex">
        <Sidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

        <main className="flex-1">
          <div className="min-h-screen bg-white">
            <div className="pt-4 px-4 sm:px-6 lg:px-8">
              <button
                onClick={() => navigate('/homepage')}
                className="flex items-center gap-2 text-gray-600 hover:text-[#0077b6] transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium text-sm">Back</span>
              </button>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4">
                  <div className="sticky top-20">
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                      <div className="h-24 bg-gradient-to-r from-[#0077b6] to-[#005a8c]"></div>

                      <div className="px-6 pb-6">
                        <div className="relative -mt-12 mb-4">
                          {user?.profile_image ? (
                            <img
                              src={user.profile_image}
                              className="w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-md"
                              alt={user.name}
                            />
                          ) : (
                            <div className="w-24 h-24 rounded-full bg-[#0077b6] text-white flex items-center justify-center text-3xl font-bold ring-4 ring-white shadow-md">
                              {(user?.name || user?.email || 'U')[0]?.toUpperCase()}
                            </div>
                          )}
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900">{user?.name || 'Loading...'}</h1>
                        <p className="text-gray-500 text-sm mt-1">{user?.email}</p>

                        <p className="text-gray-700 mt-4 text-sm leading-relaxed">{user?.about || 'No bio available'}</p>

                        <button
                          onClick={handleFollowToggle}
                          className={`w-full mt-6 flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all ${
                            isFollowing
                              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
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

                        <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-100">
                          <button
                            type="button"
                            onClick={() => setActiveConnectionTab((prev) => (prev === 'followers' ? null : 'followers'))}
                            className="text-center"
                          >
                            <div className="text-xl font-bold text-gray-900">{loading ? '-' : followers.length}</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide mt-0.5">Followers</div>
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveConnectionTab((prev) => (prev === 'following' ? null : 'following'))}
                            className="text-center"
                          >
                            <div className="text-xl font-bold text-gray-900">{loading ? '-' : following.length}</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide mt-0.5">Following</div>
                          </button>
                        </div>

                        {activeConnectionTab && (
                          <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="text-sm font-semibold text-gray-900">
                                {activeConnectionTab === 'followers' ? 'Followers' : 'Following'}
                              </div>
                              <button
                                type="button"
                                onClick={() => setActiveConnectionTab(null)}
                                className="text-xs text-gray-500 hover:text-gray-800"
                              >
                                Close
                              </button>
                            </div>

                            {(activeConnectionTab === 'followers' ? followers : following).length === 0 ? (
                              <div className="text-sm text-gray-500 py-2">No users found.</div>
                            ) : (
                              <div className="max-h-56 overflow-auto divide-y divide-gray-200 rounded-lg bg-white">
                                {(activeConnectionTab === 'followers' ? followers : following).map((u: any, idx: number) => {
                                  const id = typeof u === 'string' ? u : u?._id;
                                  const name = typeof u === 'string' ? '' : u?.name || '';
                                  const email = typeof u === 'string' ? '' : u?.email || '';
                                  const primary = email || name || '';
                                  const secondary = email && name ? name : '';
                                  return (
                                    <button
                                      key={id || idx}
                                      type="button"
                                      onClick={() => {
                                        if (id) navigate(`/user/${id}/details`);
                                      }}
                                      className="w-full text-left px-3 py-2 hover:bg-gray-50"
                                    >
                                      <div className="text-sm font-medium text-gray-900 truncate">{primary}</div>
                                      <div className="text-xs text-gray-500 truncate">{secondary}</div>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="hidden lg:block mt-6 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                      <nav className="flex flex-col">
                        <button
                          onClick={() => setActiveTab('posts')}
                          className={`flex items-center gap-3 px-6 py-4 text-left transition-all ${
                            activeTab === 'posts'
                              ? 'bg-[#e6f0fa] text-[#0077b6] border-l-4 border-[#0077b6]'
                              : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
                          }`}
                        >
                          <FileText className="w-5 h-5" />
                          <span className="font-medium">Posts</span>
                          <span className="ml-auto text-sm text-gray-500">({stats.totalPosts})</span>
                        </button>
                        <button
                          onClick={() => setActiveTab('likes')}
                          className={`flex items-center gap-3 px-6 py-4 text-left transition-all ${
                            activeTab === 'likes'
                              ? 'bg-[#e6f0fa] text-[#0077b6] border-l-4 border-[#0077b6]'
                              : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
                          }`}
                        >
                          <Heart className="w-5 h-5" />
                          <span className="font-medium">Liked Posts</span>
                          <span className="ml-auto text-sm text-gray-500">({stats.blogsWithLikes.length})</span>
                        </button>
                        <button
                          onClick={() => setActiveTab('comments')}
                          className={`flex items-center gap-3 px-6 py-4 text-left transition-all ${
                            activeTab === 'comments'
                              ? 'bg-[#e6f0fa] text-[#0077b6] border-l-4 border-[#0077b6]'
                              : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
                          }`}
                        >
                          <MessageSquare className="w-5 h-5" />
                          <span className="font-medium">Comments</span>
                          <span className="ml-auto text-sm text-gray-500">({stats.allComments.length})</span>
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-8">
                  <div className="lg:hidden mb-6">
                    <div className="flex border-b border-gray-200 bg-white rounded-t-xl">
                      <button
                        onClick={() => setActiveTab('posts')}
                        className={`flex-1 py-3 px-4 text-sm font-medium transition-all ${
                          activeTab === 'posts'
                            ? 'text-[#0077b6] border-b-2 border-[#0077b6]'
                            : 'text-gray-600'
                        }`}
                      >
                        Posts ({stats.totalPosts})
                      </button>
                      <button
                        onClick={() => setActiveTab('likes')}
                        className={`flex-1 py-3 px-4 text-sm font-medium transition-all ${
                          activeTab === 'likes'
                            ? 'text-[#0077b6] border-b-2 border-[#0077b6]'
                            : 'text-gray-600'
                        }`}
                      >
                        Liked ({stats.blogsWithLikes.length})
                      </button>
                      <button
                        onClick={() => setActiveTab('comments')}
                        className={`flex-1 py-3 px-4 text-sm font-medium transition-all ${
                          activeTab === 'comments'
                            ? 'text-[#0077b6] border-b-2 border-[#0077b6]'
                            : 'text-gray-600'
                        }`}
                      >
                        Comments ({stats.allComments.length})
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm min-h-[400px]">
                    {loading ? (
                      <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077b6]"></div>
                      </div>
                    ) : (
                      <div className="p-6">
                        {activeTab === 'posts' && (
                          <div className="space-y-6">
                            {userBlogs.length === 0 ? (
                              <div className="text-center py-16 text-gray-500">
                                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                <p className="text-lg">No posts yet</p>
                              </div>
                            ) : (
                              userBlogs.map(blog => (
                                <article
                                  key={blog._id}
                                  className="group cursor-pointer"
                                  onClick={() => navigate(`/blogdetails/${blog._id}`)}
                                >
                                  {blog.thumbnail && (
                                    <div className="mb-4 rounded-xl overflow-hidden">
                                      <img
                                        src={blog.thumbnail}
                                        alt={blog.title}
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                      />
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-[#e6f0fa] text-[#0077b6] text-xs px-2 py-0.5 rounded-full font-medium">
                                      {blog.category}
                                    </span>
                                  </div>
                                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#0077b6] transition-colors">
                                    {blog.title}
                                  </h3>
                                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{blog.subtitle}</p>
                                  <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                      <Heart className="w-4 h-4" />
                                      {blog.likes || 0}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <MessageSquare className="w-4 h-4" />
                                      {(blog.comment || []).length}
                                    </span>
                                  </div>
                                  <hr className="mt-6 border-gray-100" />
                                </article>
                              ))
                            )}
                          </div>
                        )}

                        {activeTab === 'likes' && (
                          <div className="space-y-6">
                            {stats.blogsWithLikes.length === 0 ? (
                              <div className="text-center py-16 text-gray-500">
                                <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                <p className="text-lg">No liked posts</p>
                              </div>
                            ) : (
                              stats.blogsWithLikes.map(blog => (
                                <article
                                  key={blog._id}
                                  className="group cursor-pointer"
                                  onClick={() => navigate(`/blogdetails/${blog._id}`)}
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                                    <span className="text-sm text-red-500 font-medium">{blog.likes} likes</span>
                                  </div>
                                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#0077b6] transition-colors">
                                    {blog.title}
                                  </h3>
                                  <p className="text-gray-600 text-sm line-clamp-2">{blog.subtitle}</p>
                                  <hr className="mt-6 border-gray-100" />
                                </article>
                              ))
                            )}
                          </div>
                        )}

                        {activeTab === 'comments' && (
                          <div className="space-y-6">
                            {stats.allComments.length === 0 ? (
                              <div className="text-center py-16 text-gray-500">
                                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                <p className="text-lg">No comments</p>
                              </div>
                            ) : (
                              stats.allComments.map((comment, idx) => (
                                <div key={`${comment._id}-${idx}`} className="bg-gray-50 rounded-xl p-4">
                                  <p className="text-sm font-medium text-[#0077b6] mb-2">On: {comment.blogTitle}</p>
                                  <p className="text-gray-800">{comment.msg}</p>
                                  <p className="text-sm text-gray-500 mt-2">— {comment.userId?.name || 'Anonymous'}</p>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
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
