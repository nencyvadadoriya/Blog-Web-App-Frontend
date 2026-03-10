import { FileText, ImageIcon, Tag, Upload, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast/headless';
import { useNavigate, useParams } from 'react-router';
import Header from '../../Components/Header/Header';
import Sidebar from '../../Components/Sidebar/Sidebar';
import EditBlogSkeleton from '../../Components/Skeleton/EditBlogSkeleton';
import { routepath } from '../../Routes/route';
import { blogService } from '../../services/BlogServices';
import type { AddBlog, Blog } from '../../Types/Types';

const EditBlog = () => {
    const { blogId } = useParams();
    const navigator = useNavigate();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        const saved = localStorage.getItem('sidebarCollapsed');
        return saved ? JSON.parse(saved) : true;
    });

    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', JSON.stringify(isSidebarCollapsed));
    }, [isSidebarCollapsed]);

    const [authorEmail, setAuthorEmail] = useState<string>('');

    const normalizeTags = (raw: unknown): string[] => {
        if (!raw) return [];
        if (Array.isArray(raw)) {
            return raw
                .map((t) => {
                    if (typeof t === 'string') return t;
                    if (t && typeof t === 'object') {
                        const obj = t as Record<string, unknown>;
                        const value = obj.tag ?? obj.name ?? obj.label;
                        return typeof value === 'string' ? value : '';
                    }
                    return '';
                })
                .map((t) => t.trim())
                .filter(Boolean);
        }
        if (typeof raw === 'string') {
            return raw
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean);
        }
        return [];
    };

    const [formData, setFormData] = useState<Partial<AddBlog>>({
        title: '',
        subtitle: '',
        author: '',
        category: 'General',
        tags: [],
        content: '',
        thumbnail: ''
    });
    const [tagsText, setTagsText] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

    useEffect(() => {
        const loadBlog = async () => {
            if (!blogId) return;
            setIsPageLoading(true);
            setIsLoading(true);
            try {
                const res = await blogService.fetchSinglBlog(blogId);
                const blog: Blog | undefined =
                    (res as any)?.result?.result ??
                    (res as any)?.result ??
                    (res as any)?.data?.result ??
                    (res as any)?.blog;
                if (!blog) {
                    toast.error('Blog not found');
                    navigator(routepath.HomePage);
                    return;
                }

                const rawTags =
                    (blog as any).tags ??
                    (blog as any).tag ??
                    (blog as any).tagsList ??
                    (blog as any).tagList;

                setFormData({
                    _id: blog._id,
                    title: blog.title,
                    subtitle: blog.subtitle,
                    content: blog.content,
                    thumbnail: blog.thumbnail,
                    author: blog.author?._id || '',
                    category: blog.category || 'General',
                    tags: normalizeTags(rawTags)
                });

                setTagsText(normalizeTags(rawTags).join(', '));

                const emailFromBlog = String((blog as any).author?.email || '');
                if (emailFromBlog) {
                    setAuthorEmail(emailFromBlog);
                } else {
                    try {
                        const profileRes = await blogService.fetchUserProfile();
                        const profileEmail = String((profileRes as any)?.result?.email || '');
                        setAuthorEmail(profileEmail);
                    } catch {
                        try {
                            const raw = localStorage.getItem('user');
                            if (raw) {
                                const parsed = JSON.parse(raw) as { email?: string };
                                setAuthorEmail(String(parsed?.email || ''));
                            } else {
                                setAuthorEmail('');
                            }
                        } catch {
                            setAuthorEmail('');
                        }
                    }
                }
            } catch (e) {
                console.error(e);
                toast.error('Failed to load blog');
            } finally {
                setIsLoading(false);
                setIsPageLoading(false);
            }
        };

        loadBlog();
    }, [blogId, navigator]);

    if (isPageLoading) {
        return <EditBlogSkeleton />;
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsLoading(true);
        const file = e.target.files?.[0];
        if (!file) {
            setIsLoading(false);
            return;
        }

        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            setIsLoading(false);
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB');
            setIsLoading(false);
            return;
        }

        setThumbnailFile(file);
        setFormData(prev => ({
            ...prev,
            thumbnail: URL.createObjectURL(file)
        }));
        setIsLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!blogId) return;

        if (formData.title === '' || formData.subtitle === '' || formData.author === '' || formData.content === '' || formData.thumbnail === '') {
            toast.error('Please fill all required fields');
            return;
        }

        try {
            setIsSubmitting(true);

            const data = new FormData();
            data.append('title', String(formData.title || ''));
            data.append('subtitle', String(formData.subtitle || ''));
            data.append('content', String(formData.content || ''));
            data.append('category', String(formData.category || 'General'));
            data.append('author', String(formData.author || ''));
            data.append('tags', (formData.tags || []).join(','));
            if (thumbnailFile) {
                data.append('thumbnail', thumbnailFile);
            }

            const response = await blogService.updateBlog(blogId, data);
            if (!response?.error) {
                toast.success('Blog updated successfully!');
                navigator(routepath.HomePage);
            } else {
                toast.error(response?.msg || 'Failed to update blog');
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to update blog. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Header isSidebarCollapsed={isSidebarCollapsed} onSidebarToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
            <div className="flex">
                <Sidebar 
                    active="addblog" 
                    isCollapsed={isSidebarCollapsed}
                    onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                />
                <main className="flex-1">
                    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto">
                            <form className="bg-white rounded-2xl shadow-xl p-8 space-y-6" onSubmit={handleSubmit}>
                        <h1 className="text-4xl font-bold text-[#1e4b7a] mb-5">Edit Blog Post</h1>

                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-gray-700">
                                <FileText className="w-4 h-4 mr-2 text-[#0077b6]" />
                                Blog Title <span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Enter your blog title..."
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0077b6] focus:ring-2 focus:ring-[#e6f0fa] outline-none transition"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-gray-700">
                                <FileText className="w-4 h-4 mr-2 text-[#0077b6]" />
                                Subtitle <span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.subtitle}
                                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                placeholder="Add a catchy subtitle..."
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0077b6] focus:ring-2 focus:ring-[#e6f0fa] outline-none transition"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-medium text-gray-700">
                                    <User className="w-4 h-4 mr-2 text-[#0077b6]" />
                                    Author <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={authorEmail}
                                    placeholder="Author Email"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0077b6] focus:ring-2 focus:ring-[#e6f0fa] outline-none transition"
                                    disabled
                                    readOnly
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-medium text-gray-700">
                                    <FileText className="w-4 h-4 mr-2 text-[#0077b6]" />
                                    Category
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0077b6] focus:ring-2 focus:ring-[#e6f0fa] outline-none transition bg-white"
                                    disabled={isLoading}
                                >
                                    <option value="General">General</option>
                                    <option value="Technology">Technology</option>
                                    <option value="Travel">Travel</option>
                                    <option value="Food">Food</option>
                                    <option value="Lifestyle">Lifestyle</option>
                                    <option value="Fashion">Fashion</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Business">Business</option>
                                    <option value="Education">Education</option>
                                </select>
                            </div>
                        </div>

                        <div className="mb-8">
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                <ImageIcon className="w-4 h-4 mr-2" />
                                Thumbnail Image
                            </label>

                            {formData.thumbnail ? (
                                <div className="relative mb-4">
                                    <img
                                        src={formData.thumbnail}
                                        alt="Thumbnail preview"
                                        className="w-full h-48 object-cover rounded-lg shadow-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFormData(prev => ({ ...prev, thumbnail: '' }));
                                            setThumbnailFile(null);
                                        }}
                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                        disabled={isLoading}
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <label className="block">
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                                        <div className="flex flex-col items-center">
                                            <Upload className="w-12 h-12 text-gray-400 mb-3" />
                                            <span className="text-gray-700 font-medium mb-1">Upload Thumbnail</span>
                                            <span className="text-gray-500 text-sm">PNG, JPG or GIF (max 5MB)</span>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            disabled={isLoading}
                                        />
                                    </div>
                                </label>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-gray-700">
                                <Tag className="w-4 h-4 mr-2 text-[#0077b6]" />
                                Tags
                            </label>
                            <input
                                type="text"
                                value={tagsText}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setTagsText(value);
                                    const parsed = value
                                        .split(',')
                                        .map(t => t.trim().toLowerCase())
                                        .filter(Boolean)
                                        .slice(0, 10);
                                    setFormData(prev => ({ ...prev, tags: parsed }));
                                }}
                                placeholder="e.g. react, javascript, webdev"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e6f0fa] focus:border-[#0077b6] outline-none transition"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-gray-700">
                                <FileText className="w-4 h-4 mr-2 text-[#0077b6]" />
                                Blog Content <span className="text-red-500 ml-1">*</span>
                            </label>
                            <textarea
                                rows={6}
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                placeholder="Write your blog content here..."
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0077b6] focus:ring-2 focus:ring-[#e6f0fa] outline-none transition resize-none"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting || isLoading}
                                className="px-8 py-3 bg-[#0077b6] text-white font-semibold rounded-lg hover:bg-[#005a8c] focus:ring-4 focus:ring-[#e6f0fa] transition transform hover:scale-105"
                            >
                                {isSubmitting ? 'Updating...' : 'Update Blog'}
                            </button>
                        </div>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default EditBlog;
