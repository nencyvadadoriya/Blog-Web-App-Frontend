 // Sample blog posts data
  import { 
  User, 
  Bookmark, 
  Heart, 
  MessageCircle,
  Share2, 
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { useNavigate } from "react-router";
import { routepath } from "../../Routes/route";
import { blogService } from "../../services/BlogServices";
import type { Blog, User as UserType } from "../../Types/Types";
import FeaturedSkeletonGrid from "../../Components/Skeleton/FeaturedSkeletonGrid";

type FeaturedProps = {
  isSidebarCollapsed?: boolean;
};

export default function Featured({ isSidebarCollapsed = false }: FeaturedProps) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [feed, setFeed] = useState<'all' | 'following'>('all');
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [likedBlogIds, setLikedBlogIds] = useState<Record<string, boolean>>({});
  const [savedBlogIds, setSavedBlogIds] = useState<Record<string, boolean>>({});
  const [expandedCommentsBlogId, setExpandedCommentsBlogId] = useState<Record<string, boolean>>({});
  const [openCommentSections, setOpenCommentSections] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [isCommentSubmitting, setIsCommentSubmitting] = useState<boolean>(false);

  const [shareBlogId, setShareBlogId] = useState<string | null>(null);
  const [shareTab, setShareTab] = useState<'simple' | 'inapp'>('simple');
  const [shareUsers, setShareUsers] = useState<UserType[]>([]);
  const [selectedShareUserIds, setSelectedShareUserIds] = useState<Record<string, boolean>>({});
  const [isShareLoading, setIsShareLoading] = useState<boolean>(false);
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const navigate = useNavigate();

  const loadBlogs = async () => {
    setIsLoading(true);
    try {
      const res = await blogService.fetchAllBlogs();
      if (!res) {
        setBlogs([]);
        return;
      }
      if (res.error) {
        toast.error(res.msg || "Failed to load blogs");
        setBlogs([]);
        return;
      }
      const list: Blog[] = res?.result || [];
      setBlogs(list);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load blogs");
    } finally {
      setIsLoading(false);
    }
  };

  const loadFollowingBlogs = async () => {
    setIsLoading(true);
    try {
      const res = await blogService.fetchFollowingBlogs();
      if (!res) {
        setBlogs([]);
        return;
      }
      if (res.error) {
        toast.error(res.msg || 'Failed to load following feed');
        setBlogs([]);
        return;
      }
      const list: Blog[] = res?.result || [];
      setBlogs(list);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load following feed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSaved = async (blogId: string) => {
    const isSaved = !!savedBlogIds[blogId];
    const nextSaved = !isSaved;
    setSavedBlogIds((prev) => ({ ...prev, [blogId]: nextSaved }));
    try {
      await blogService.toggleSavedBlog(blogId);
      toast.success(nextSaved ? 'Saved' : 'Removed from saved');
    } catch (e) {
      console.error(e);
      setSavedBlogIds((prev) => ({ ...prev, [blogId]: isSaved }));
      toast.error('Failed to update saved');
    }
  };

  const openShare = async (blogId: string) => {
    setShareBlogId(blogId);
    setShareTab('simple');
    setSelectedShareUserIds({});
    setShareUsers([]);
    setIsShareLoading(true);
    try {
      const [followersRes, followingRes] = await Promise.all([
        blogService.getFollowers().catch(() => null),
        blogService.getFollowing().catch(() => null)
      ]);

      const followers: UserType[] = (followersRes as any)?.result || [];
      const following: UserType[] = (followingRes as any)?.result || [];
      const map = new Map<string, UserType>();
      for (const u of [...followers, ...following]) {
        if (u?._id) map.set(u._id, u);
      }
      setShareUsers(Array.from(map.values()));
    } finally {
      setIsShareLoading(false);
    }
  };

  const closeShare = () => {
    setShareBlogId(null);
    setShareUsers([]);
    setSelectedShareUserIds({});
    setIsShareLoading(false);
    setIsSharing(false);
  };

  const shareLinkFor = (blogId: string) => {
    return `${window.location.origin}${routepath.blogDetails}/${blogId}`;
  };

  const handleSimpleShare = async (blogId: string) => {
    const link = shareLinkFor(blogId);
    try {
      const nav = navigator as any;
      if (nav?.share) {
        await nav.share({ title: 'Blog', url: link });
        toast.success('Shared successfully!');
        return;
      }
      
      await navigator.clipboard.writeText(link);
      toast.success('Link copied to clipboard!');
    } catch (e) {
      console.error(e);
      toast.error('Share failed');
    }
  };

  const handleInAppShare = async () => {
    if (!shareBlogId) return;
    const ids = Object.keys(selectedShareUserIds).filter((id) => selectedShareUserIds[id]);
    if (ids.length === 0) {
      toast.error('Select at least one user');
      return;
    }
    setIsSharing(true);
    try {
      await blogService.shareBlogToUsers(shareBlogId, ids);
      toast.success('Shared to selected users');
      closeShare();
    } catch (e) {
      console.error(e);
      toast.error('Failed to share');
    } finally {
      setIsSharing(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const profileRes = await blogService.fetchUserProfile();
        const user: UserType | undefined = profileRes?.result;
        if (user) setCurrentUser(user);

        try {
          const savedRes = await blogService.getSavedBlogs();
          const savedList: Blog[] = savedRes?.result || [];
          const map: Record<string, boolean> = {};
          for (const b of savedList) {
            if (b?._id) map[b._id] = true;
          }
          setSavedBlogIds(map);
        } catch {
        }
      } catch (e) {
        console.error(e);
      }
      await loadBlogs();
    };

    init();
  }, []);

  useEffect(() => {
    if (feed === 'all') {
      loadBlogs();
    } else {
      loadFollowingBlogs();
    }
  }, [feed]);

  const handleDelete = async (blogId: string) => {
    const ok = window.confirm("Are you sure you want to delete this blog?");
    if (!ok) return;
    try {
      await blogService.deleteBlog(blogId);
      toast.success("Blog deleted");
      await loadBlogs();
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleLike = async (blogId: string) => {
    const isLiked = !!likedBlogIds[blogId];
    const nextLiked = !isLiked;

    setLikedBlogIds((prev) => ({ ...prev, [blogId]: nextLiked }));
    setBlogs((prev) =>
      prev.map((b) =>
        b._id === blogId
          ? {
              ...b,
              likes: Math.max(0, (b.likes || 0) + (nextLiked ? 1 : -1))
            }
          : b
      )
    );

    try {
      const res = await blogService.likeBlog(blogId, nextLiked);
      const updated: Blog | undefined = (res as any)?.result;
      if (updated?._id) {
        setBlogs((prev) => prev.map((b) => (b._id === updated._id ? updated : b)));
      }
    } catch {
      setLikedBlogIds((prev) => ({ ...prev, [blogId]: isLiked }));
      setBlogs((prev) =>
        prev.map((b) =>
          b._id === blogId
            ? {
                ...b,
                likes: Math.max(0, (b.likes || 0) + (isLiked ? 1 : -1))
              }
            : b
        )
      );
    }
  };


  const handleSubmitComment = async (blogId: string) => {
    const msg = (commentInputs[blogId] || '').trim();
    if (!msg) {
      toast.error('Please enter a comment');
      return;
    }
    setIsCommentSubmitting(true);
    try {
      const res = await blogService.addBlogComment(blogId, msg);
      const updated: Blog | undefined = (res as any)?.result;
      if (updated?._id) {
        setBlogs((prev) => prev.map((b) => (b._id === updated._id ? updated : b)));
      }
      setCommentInputs(prev => ({ ...prev, [blogId]: '' }));
    } catch (e) {
      console.error(e);
    } finally {
      setIsCommentSubmitting(false);
    }
  };

  return (
    
   <>
     {/* Featured Posts */}
      <section id="featured" className="py-16">
        <div className={`w-full ${isSidebarCollapsed ? 'pl-8 pr-4 sm:pl-10 sm:pr-6 lg:pl-12 lg:pr-8' : 'pl-4 pr-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8'}`}>
          <div className="flex items-center justify-between mb-12 gap-4">
            <h2 className="text-3xl font-bold text-gray-800">Featured Posts</h2>

            <div className="inline-flex rounded-xl bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => setFeed('all')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                  feed === 'all' ? 'bg-white shadow text-gray-900' : 'text-gray-600'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFeed('following')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                  feed === 'following' ? 'bg-white shadow text-gray-900' : 'text-gray-600'
                }`}
              >
                Following
              </button>
            </div>
          </div>

          {isLoading ? (
            <FeaturedSkeletonGrid />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 items-start">
              {blogs.length === 0 ? (
                <div className="col-span-full text-center text-gray-500">No blogs found</div>
              ) : (
                blogs.map((post) => (
                  <article key={post._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <img 
                    src={post.thumbnail} 
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-[#e6f0fa] text-[#0077b6] text-xs px-2 py-1 rounded-full font-medium">
                        {post.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.subtitle}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4 gap-3">
                      <div className="flex items-center gap-1 min-w-0">
                        <User className="w-4 h-4 shrink-0" />
                        <span className="truncate">{post.author?.name || "Unknown"}</span>
                      </div>

                      {(post.tags || []).length > 0 && (
                        <div className="flex flex-wrap justify-end gap-2">
                          {(post.tags || []).slice(0, 3).map((t) => (
                            <span
                              key={t}
                              className="bg-[#e6f0fa] text-[#0077b6] text-xs px-2 py-1 rounded-full font-medium"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => handleToggleLike(post._id)}
                          className={`flex items-center gap-1 transition-colors ${
                            likedBlogIds[post._id]
                              ? 'text-red-500 fill-red-500'
                              : 'text-gray-500 hover:text-red-500'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${likedBlogIds[post._id] ? 'fill-current' : ''}`} />
                          <span>{post.likes}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setOpenCommentSections(prev => ({ 
                              ...prev, 
                              [post._id]: !prev[post._id] 
                            }));
                            if (!commentInputs[post._id]) {
                              setCommentInputs(prev => ({ ...prev, [post._id]: '' }));
                            }
                          }}
                          className="flex items-center gap-1 text-gray-500 hover:text-[#0077b6] transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.comment?.length || 0}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleSaved(post._id)}
                          className={`flex items-center gap-1 transition-colors ${
                            savedBlogIds[post._id]
                              ? 'text-[#0077b6]'
                              : 'text-gray-500 hover:text-[#0077b6]'
                          }`}
                        >
                          <Bookmark className={`w-4 h-4 ${savedBlogIds[post._id] ? 'fill-current' : ''}`} />
                          <span>{savedBlogIds[post._id] ? 1 : 0}</span>
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        {currentUser?._id === post.author?._id && (
                          <>
                            <button
                              type="button"
                              onClick={() => navigate(routepath.editBlog + '/' + post._id)}
                              className="text-gray-500 hover:text-[#0077b6] transition-colors"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(post._id)}
                              className="text-gray-500 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          type="button"
                          onClick={() => openShare(post._id)}
                          className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Comments Section */}
                  {openCommentSections[post._id] && (
                    <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
                      {/* Comments Display */}
                      {(post.comment || []).length > 0 && (
                        <div className="space-y-3 mb-4">
                          {(post.comment || []).slice(0, expandedCommentsBlogId[post._id] ? undefined : 2).map((c: any) => (
                            <div key={c._id || c.create_at} className="rounded-lg border border-gray-200 bg-white px-3 py-2">
                              <div className="flex items-center justify-between gap-2">
                                <div className="text-sm font-medium text-gray-900 truncate">
                                  {c?.userId?.name || 'User'}
                                </div>
                                <div className="text-xs text-gray-500 shrink-0">{c?.create_at || ''}</div>
                              </div>
                              <div className="text-sm text-gray-700 mt-1 break-words">{c?.msg}</div>
                            </div>
                          ))}
                          
                          {/* More/Less Comments Button */}
                          {(post.comment || []).length > 2 && (
                            <button
                              type="button"
                              onClick={() => setExpandedCommentsBlogId(prev => ({ 
                                ...prev, 
                                [post._id]: !prev[post._id] 
                              }))}
                              className="text-sm text-[#0077b6] hover:text-[#005a8c] font-medium"
                            >
                              {expandedCommentsBlogId[post._id] 
                                ? 'Show less' 
                                : `Show ${post.comment.length - 2} more comment${post.comment.length - 2 > 1 ? 's' : ''}`
                              }
                            </button>
                          )}
                        </div>
                      )}

                      {/* Comment Input */}
                      <div className="flex items-center gap-2">
                        <input
                          value={commentInputs[post._id] || ''}
                          onChange={(e) => setCommentInputs(prev => ({ ...prev, [post._id]: e.target.value }))}
                          placeholder="Write a comment..."
                          className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-[#0077b6] focus:ring-2 focus:ring-[#e6f0fa] outline-none text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => handleSubmitComment(post._id)}
                          disabled={isCommentSubmitting}
                          className="px-4 py-2 rounded-lg bg-[#0077b6] text-white font-medium hover:bg-[#005a8c] disabled:opacity-60 text-sm"
                        >
                          {isCommentSubmitting ? 'Posting...' : 'Post'}
                        </button>
                      </div>
                    </div>
                  )}
                  </article>
                ))
              )}
            </div>
          )}
        </div>
      </section>

      {shareBlogId && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={closeShare} />
          <div className="absolute left-1/2 top-1/2 w-[min(560px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <div className="text-base font-semibold text-gray-900">Share</div>
              <button type="button" onClick={closeShare} className="text-gray-500 hover:text-gray-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-5 pt-4">
              <div className="inline-flex rounded-xl bg-gray-100 p-1">
                <button
                  type="button"
                  onClick={() => setShareTab('simple')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    shareTab === 'simple' ? 'bg-white shadow text-gray-900' : 'text-gray-600'
                  }`}
                >
                  Simple
                </button>
                <button
                  type="button"
                  onClick={() => setShareTab('inapp')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    shareTab === 'inapp' ? 'bg-white shadow text-gray-900' : 'text-gray-600'
                  }`}
                >
                  Followers/Following
                </button>
              </div>
            </div>

            <div className="px-5 py-4">
              {shareTab === 'simple' ? (
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">Share link</div>
                  <div className="flex items-center gap-2">
                    <input
                      readOnly
                      value={shareLinkFor(shareBlogId)}
                      className="flex-1 px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => handleSimpleShare(shareBlogId)}
                      className="px-4 py-2 rounded-xl bg-[#0077b6] text-white text-sm font-semibold hover:bg-[#005a8c]"
                    >
                      Share
                    </button>
                  </div>
                  <div className="text-xs text-gray-500">
                    Note: Browser support required for native share. Otherwise link will be copied.
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">Select users from your followers/following</div>

                  {isShareLoading ? (
                    <div className="space-y-2">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-10 rounded-xl bg-gray-100 animate-pulse" />
                      ))}
                    </div>
                  ) : shareUsers.length === 0 ? (
                    <div className="text-sm text-gray-500">No followers/following found yet.</div>
                  ) : (
                    <div className="max-h-64 overflow-auto border border-gray-200 rounded-xl">
                      {shareUsers.map((u) => (
                        <label
                          key={u._id}
                          className="flex items-center gap-3 px-3 py-2 border-b last:border-b-0 cursor-pointer hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={!!selectedShareUserIds[u._id]}
                            onChange={(e) =>
                              setSelectedShareUserIds((prev) => ({ ...prev, [u._id]: e.target.checked }))
                            }
                          />
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">{u.name}</div>
                            <div className="text-xs text-gray-500 truncate">{u.email}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={closeShare}
                      className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={isSharing || isShareLoading}
                      onClick={handleInAppShare}
                      className="px-4 py-2 rounded-xl bg-[#0077b6] text-white text-sm font-semibold hover:bg-[#005a8c] disabled:opacity-60"
                    >
                      {isSharing ? 'Sharing...' : 'Share'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
   </>

  );
}
