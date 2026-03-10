import { useEffect, useMemo, useState, useRef } from 'react';
import { Heart, MessageSquare, FileText, User, Edit3, Settings, Camera, X, Check } from 'lucide-react';
import Header from '../../Components/Header/Header';
import Sidebar from '../../Components/Sidebar/Sidebar';
import Footer from '../../Components/Footer/Footer';
import { blogService } from '../../services/BlogServices';
import type { Blog, User as UserType, Comment } from '../../Types/Types';
import toast from 'react-hot-toast/headless';

export default function ProfilePage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [myBlogs, setMyBlogs] = useState<Blog[]>([]);
  const [followers, setFollowers] = useState<UserType[]>([]);
  const [following, setFollowing] = useState<UserType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'likes' | 'comments'>('posts');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    bio: '',
    profile_image: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const modalFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [profileRes, blogsRes, followersRes, followingRes] = await Promise.all([
          blogService.fetchUserProfile(),
          blogService.fetchCurrentUserBlogs().catch(() => null),
          blogService.getFollowers().catch(() => null),
          blogService.getFollowing().catch(() => null)
        ]);

        const profile: UserType | undefined = profileRes?.result;
        if (profile) {
          setUser(profile);
          setEditForm({
            name: profile.name || '',
            email: profile.email || '',
            bio: profile.about || '',
            profile_image: profile.profile_image || ''
          });
        }

        const blogs: Blog[] = (blogsRes as any)?.result || [];
        setMyBlogs(blogs);

        setFollowers(((followersRes as any)?.result as UserType[]) || []);
        setFollowing(((followingRes as any)?.result as UserType[]) || []);
      } catch (e) {
        console.error(e);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleUpdateProfile = async () => {
    if (!user?._id) {
      toast.error('User not found');
      return;
    }
    setIsUpdating(true);
    try {
      await blogService.updateProfile({
        name: editForm.name,
        email: editForm.email,
        about: editForm.bio,
        profile_image: editForm.profile_image
      }, user._id);
      setUser(prev => prev ? { ...prev, ...editForm } : null);
      toast.success('Profile updated successfully!');
      setIsEditModalOpen(false);
    } catch (error: any) {
      console.error('Profile update error:', error);
      const errorMsg = error?.response?.data?.message || error?.message || 'Failed to update profile';
      toast.error(errorMsg);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle modal image click - trigger file input in modal
  const handleModalImageClick = () => {
    modalFileInputRef.current?.click();
  };

  // Handle file selection in modal
  const handleModalImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setEditForm(prev => ({ ...prev, profile_image: base64String }));
    };
    reader.readAsDataURL(file);
  };

  // Remove image from modal
  const handleRemoveModalImage = () => {
    setEditForm(prev => ({ ...prev, profile_image: '' }));
  };

  const stats = useMemo(() => {
    const totalPosts = myBlogs.length;
    const totalLikes = myBlogs.reduce((sum, b) => sum + (b.likes || 0), 0);
    const totalComments = myBlogs.reduce((sum, b) => sum + ((b.comment || []).length || 0), 0);

    const blogsWithLikes = myBlogs.filter(b => (b.likes || 0) > 0);
    const allComments = myBlogs.flatMap(b => 
      (b.comment || []).map((c: Comment) => ({
        ...c,
        blogTitle: b.title,
        blogId: b._id
      }))
    );

    return {
      totalPosts,
      totalLikes,
      totalComments,
      blogsWithLikes,
      allComments,
      commentByBlog: myBlogs
        .map((b) => ({ id: b._id, title: b.title, count: (b.comment || []).length }))
        .filter((x) => x.count > 0)
        .sort((a, b) => b.count - a.count)
    };
  }, [myBlogs]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isSidebarCollapsed={isSidebarCollapsed} onSidebarToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
      <div className="flex">
        <Sidebar 
          active="profile" 
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <main className="flex-1">
          {/* Profile Header Section */}
          <div className="bg-white border-b border-gray-200">
            <div className={`py-8 ${isSidebarCollapsed ? 'pl-8 pr-4 sm:pl-10 sm:pr-6 lg:pl-12 lg:pr-8' : 'pl-6 pr-4 sm:pl-8 sm:pr-6 lg:pl-10 lg:pr-8'}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-6">
                  {/* Profile Picture */}
                  <div className="relative">
                    {user?.profile_image ? (
                      <img src={user.profile_image} className="w-24 h-24 rounded-full object-cover ring-4 ring-[#e6f0fa] shadow-lg" alt={user.name} />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-[#0077b6] text-white flex items-center justify-center text-2xl font-bold ring-4 ring-[#e6f0fa] shadow-lg">
                        {(user?.name || user?.email || 'U')[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Profile Info */}
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {user?.name || 'Profile'}
                    </h1>
                    <p className="text-gray-600">{user?.email || ''}</p>
                    <div className="px-3 py-1 bg-[#e6f0fa] text-[#0077b6] rounded-full text-sm font-medium inline-block">
                      {stats.totalPosts} Posts
                    </div>
                    <p className="text-gray-700 max-w-xl">
                      {user?.about || "Passionate storyteller and digital creator sharing ideas and experiences."}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleEditProfile}
                    className="px-5 py-2.5 bg-[#0077b6] text-white rounded-lg font-medium hover:bg-[#005a8c] transition-colors flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </button>
                  <button className="p-2.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <Settings className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className={`py-6 ${isSidebarCollapsed ? 'pl-8 pr-4 sm:pl-10 sm:pr-6 lg:pl-12 lg:pr-8' : 'pl-6 pr-4 sm:pl-8 sm:pr-6 lg:pl-10 lg:pr-8'}`}>
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
          <div className={`pb-8 ${isSidebarCollapsed ? 'pl-8 pr-4 sm:pl-10 sm:pr-6 lg:pl-12 lg:pr-8' : 'pl-6 pr-4 sm:pl-8 sm:pr-6 lg:pl-10 lg:pr-8'}`}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Tab Navigation */}
              <div className="flex border-b border-gray-200 bg-gray-50">
                <button
                  onClick={() => setActiveTab('posts')}
                  className={`flex-1 px-6 py-4 font-medium transition-colors relative ${
                    activeTab === 'posts'
                      ? 'text-[#0077b6] bg-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <FileText className="w-5 h-5" />
                    My Posts
                  </span>
                  {activeTab === 'posts' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0077b6]"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('likes')}
                  className={`flex-1 px-6 py-4 font-medium transition-colors relative ${
                    activeTab === 'likes'
                      ? 'text-[#0077b6] bg-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Heart className="w-5 h-5" />
                    Liked Posts
                  </span>
                  {activeTab === 'likes' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0077b6]"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('comments')}
                  className={`flex-1 px-6 py-4 font-medium transition-colors relative ${
                    activeTab === 'comments'
                      ? 'text-[#0077b6] bg-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Comments
                  </span>
                  {activeTab === 'comments' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0077b6]"></div>
                  )}
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-8">
                {loading ? (
                  <div className="space-y-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-32 rounded-2xl bg-gray-100/50 animate-pulse"></div>
                    ))}
                  </div>
                ) : (
                  <>
                    {activeTab === 'posts' && (
                      <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Blog Posts</h2>
                        {myBlogs.length === 0 ? (
                          <div className="text-center py-16">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                              <FileText className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No posts yet</h3>
                            <p className="text-gray-500">Start writing your first amazing blog post!</p>
                          </div>
                        ) : (
                          <div className="grid gap-6">
                            {myBlogs.map((blog) => (
                              <div key={blog._id} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{blog.title}</h3>
                                <p className="text-gray-600 line-clamp-2 mb-4">{blog.content}</p>
                                <div className="flex items-center gap-6 text-sm">
                                  <span className="flex items-center gap-2 text-red-500">
                                    <Heart className="w-4 h-4" />
                                    {blog.likes || 0} likes
                                  </span>
                                  <span className="flex items-center gap-2 text-[#0077b6]">
                                    <MessageSquare className="w-4 h-4" />
                                    {(blog.comment || []).length} comments
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'likes' && (
                      <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Posts with Likes</h2>
                        {stats.blogsWithLikes.length === 0 ? (
                          <div className="text-center py-16">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                              <Heart className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No likes yet</h3>
                            <p className="text-gray-500">Keep writing engaging content to get likes!</p>
                          </div>
                        ) : (
                          <div className="grid gap-6">
                            {stats.blogsWithLikes.map((blog) => (
                              <div key={blog._id} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{blog.title}</h3>
                                <p className="text-gray-600 line-clamp-2 mb-4">{blog.content}</p>
                                <div className="flex items-center gap-6">
                                  <span className="flex items-center gap-2 text-red-500">
                                    <Heart className="w-4 h-4" />
                                    {blog.likes || 0} likes
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'comments' && (
                      <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">💬 Comments on My Posts</h2>
                        {stats.allComments.length === 0 ? (
                          <div className="text-center py-16">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                              <MessageSquare className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No comments yet</h3>
                            <p className="text-gray-500">Create engaging content to get comments!</p>
                          </div>
                        ) : (
                          <div className="grid gap-6">
                            {stats.allComments.map((comment: any, index) => (
                              <div key={`${comment.blogId}-${index}`} className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                <div className="flex items-start justify-between mb-3">
                                  <h4 className="font-semibold text-gray-900">{comment.blogTitle}</h4>
                                  <span className="text-sm text-gray-500">
                                    {new Date(comment.create_at || Date.now()).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="bg-white/80 rounded-xl p-4">
                                  <p className="text-gray-800 mb-2">{comment.msg}</p>
                                  <p className="text-sm text-gray-500">- {comment.userId?.name || 'Anonymous'}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <Footer />
        </main>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Profile Image Upload in Modal */}
              <div className="flex flex-col items-center mb-6">
                <div 
                  className="relative mb-4 cursor-pointer group"
                  onClick={handleModalImageClick}
                >
                  {editForm.profile_image ? (
                    <>
                      <img 
                        src={editForm.profile_image} 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full object-cover ring-4 ring-[#e6f0fa] shadow-lg"
                      />
                      {/* Close button to remove image */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveModalImage();
                        }}
                        className="absolute -top-1 -right-1 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md"
                        title="Remove image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-[#0077b6] text-white flex items-center justify-center text-2xl font-bold ring-4 ring-[#e6f0fa] shadow-lg group-hover:bg-[#005a8c] transition-colors">
                      <Camera className="w-8 h-8" />
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-medium">Click to change</span>
                  </div>
                </div>
                {/* Hidden file input for modal */}
                <input
                  type="file"
                  ref={modalFileInputRef}
                  onChange={handleModalImageChange}
                  accept="image/*"
                  className="hidden"
                />
                <p className="text-sm text-gray-500">Click circle to upload image</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                  rows={4}
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProfile}
                disabled={isUpdating}
                className="flex-1 px-4 py-3 bg-[#0077b6] text-white rounded-xl hover:bg-[#005a8c] hover:shadow-lg transition-all font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isUpdating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Update Profile
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
