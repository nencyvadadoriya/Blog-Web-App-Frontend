import { Tag, User, FileText, X, Upload, ImageIcon } from 'lucide-react';
import Header from '../../Components/Header/Header';
import Sidebar from '../../Components/Sidebar/Sidebar';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast/headless';
import { useNavigate } from 'react-router';
import { blogService } from '../../services/BlogServices';
import { routepath } from '../../Routes/route';
import axios from 'axios';
import AddBlogSkeleton from '../../Components/Skeleton/AddBlogSkeleton';
import Skeleton from '../../Components/Skeleton/Skeleton';

const AddBlog = () => {

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        const saved = localStorage.getItem('sidebarCollapsed');
        return saved ? JSON.parse(saved) : true;
    });

    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', JSON.stringify(isSidebarCollapsed));
    }, [isSidebarCollapsed]);

    const [formData, setFormData] = useState<{
        title: string;
        subtitle: string;
        author: string;
        category: string;
        tags: string[];
        content: string;
        thumbnail: string;
    }>({
        title: '',
        subtitle: '',
        author: '',
        category: '',
        tags: [],
        content: '',
        thumbnail: ''
    });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

    const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
    const [authorName, setAuthorName] = useState<string>('');
    const [tagsText, setTagsText] = useState<string>('');

    const navigator = useNavigate();

    useEffect(() => {
        const loadProfile = async () => {
            setIsPageLoading(true);
            try {
                const res = await blogService.fetchUserProfile();
                const userId: string | undefined = res?.result?._id;
                const name: string | undefined = res?.result?.name;

                if (userId) {
                    setFormData(prev => ({
                        ...prev,
                        author: userId
                    }));
                }

                if (name) {
                    setAuthorName(name);
                }
            } catch (e) {
                try {
                    const raw = localStorage.getItem('user');

                    if (raw) {
                        const parsed = JSON.parse(raw) as { _id?: string; name?: string };
                        if (parsed?._id) {
                            setFormData(prev => ({
                                ...prev,
                                author: parsed._id as string
                            }));
                        }
                        if (parsed?.name) setAuthorName(parsed.name);
                    }
                } catch {
                }
            } finally {
                setIsPageLoading(false);
            }
        };

        loadProfile();
    }, []);

    if (isPageLoading) {
        return <AddBlogSkeleton />;
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
        setHasSubmitted(true);

        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please login first');
            navigator(routepath.login, { replace: true });
            return;
        }

        // Ensure we have a valid author id. If profile API fails, backend may throw 500.
        let authorId = String(formData.author || '');
        if (!authorId) {
            try {
                const profileRes = await blogService.fetchUserProfile();
                authorId = String(profileRes?.result?._id || '');
                if (authorId) {
                    setFormData(prev => ({
                        ...prev,
                        author: authorId
                    }));
                }
            } catch {
            }
        }

        if (!authorId) {
            toast.error('Your profile could not be loaded. Please login again.');
            navigator(routepath.login, { replace: true });
            return;
        }

        if (formData.title === '' || formData.subtitle === '' || formData.author === '' || formData.content === '' || !thumbnailFile) {
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
            data.append('author', authorId);
            data.append('tags', (formData.tags || []).join(','));
            data.append('thumbnail', thumbnailFile);

            console.log('Submitting blog with data:', {
                title: formData.title,
                subtitle: formData.subtitle,
                content: formData.content,
                category: formData.category,
                author: authorId,
                tags: formData.tags,
                thumbnailFileName: thumbnailFile.name,
                thumbnailFileSize: thumbnailFile.size
            });

            const response = await blogService.blogAddUrl(data);

            if (!response.error) {
                toast.success('Blog published successfully!');
                navigator(routepath.HomePage);
            } else {
                toast.error(response.message || 'Failed to publish blog');
            }
        }
        catch (error) {
            console.error("Add Blog Error: ", error);
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                const msg =
                    (error.response?.data as any)?.msg ||
                    (error.response?.data as any)?.message ||
                    error.message ||
                    'Failed to add blog. Please try again.';

                if (status === 500) {
                    console.error('Add Blog 500 Response Data: ', error.response?.data);
                }

                if (status === 401) {
                    toast.error('Session expired. Please login again.');
                    navigator(routepath.login, { replace: true });
                } else {
                    toast.error(msg);
                }
                return;
            }
            toast.error('Failed to add blog. Please try again.');
        }
        finally {
            setIsSubmitting(false);
        }
    }

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
                    <div className={`min-h-screen bg-white py-8 ${isSidebarCollapsed ? 'pl-8 pr-4 sm:pl-10 sm:pr-6 lg:pl-12 lg:pr-8' : 'pl-6 pr-4 sm:pl-8 sm:pr-6 lg:pl-10 lg:pr-8'}`}>
                        <div className="max-w-3xl">

                            {/* Main Form - Compact Design */}
                            <form className="bg-white rounded-xl shadow-lg p-6 space-y-4" onSubmit={handleSubmit}>
                                <h1 className="text-3xl font-bold text-[#1e4b7a] mb-4">
                                    Create New Blog Post
                                </h1>
                                
                                {/* Title and Subtitle Row */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {/* Title Field */}
                                    <div className="space-y-1">
                                        <label className="flex items-center text-sm font-medium text-gray-700">
                                            <FileText className="w-4 h-4 mr-2 text-[#0077b6]" />
                                            Title <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <input
                                            type="text" value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="Enter title..."
                                            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#0077b6] focus:ring-1 focus:ring-[#e6f0fa] outline-none transition text-sm"
                                        />
                                        <p className="text-red-500 text-xs">{hasSubmitted && formData.title === '' ? "Required" : ""}</p>
                                    </div>

                                    {/* Subtitle Field */}
                                    <div className="space-y-1">
                                        <label className="flex items-center text-sm font-medium text-gray-700">
                                            <FileText className="w-4 h-4 mr-2 text-[#0077b6]" />
                                            Subtitle <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.subtitle}
                                            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                            placeholder="Add subtitle..."
                                            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#0077b6] focus:ring-1 focus:ring-[#e6f0fa] outline-none transition text-sm"
                                        />
                                        <p className="text-red-500 text-xs">{hasSubmitted && formData.subtitle === '' ? "Required" : ""}</p>
                                    </div>
                                </div>

                                {/* Author and Category Row */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {/* Author Field */}
                                    <div className="space-y-1">
                                        <label className="flex items-center text-sm font-medium text-gray-700">
                                            <User className="w-4 h-4 mr-2 text-[#0077b6]" />
                                            Author <span className="text-xs text-gray-500 ml-2">(auto)</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={authorName || ''}
                                            readOnly
                                            className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none bg-gray-50 text-gray-700 text-sm"
                                        />
                                        <p className="text-red-500 text-xs">{hasSubmitted && formData.author === '' ? "Required" : ""}</p>
                                    </div>

                                    {/* Category Dropdown */}
                                    <div className="space-y-1">
                                        <label className="flex items-center text-sm font-medium text-gray-700">
                                            <FileText className="w-4 h-4 mr-2 text-[#0077b6]" />
                                            Category
                                        </label>
                                        <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#0077b6] focus:ring-1 focus:ring-[#e6f0fa] outline-none transition bg-white text-sm">
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

                                {/* Tags and Content Row */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                    {/* Tags Input */}
                                    <div className="space-y-1 lg:col-span-1">
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
                                                const parsed: string[] = value
                                                    .split(',')
                                                    .map(t => t.trim().toLowerCase())
                                                    .filter(Boolean)
                                                    .slice(0, 10);
                                                setFormData(prev => ({ ...prev, tags: parsed }));
                                            }}
                                            placeholder="react, javascript"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#e6f0fa] outline-none transition text-sm"
                                        />
                                    </div>

                                    {/* Content Field */}
                                    <div className="space-y-1 lg:col-span-2">
                                        <label className="flex items-center text-sm font-medium text-gray-700">
                                            <FileText className="w-4 h-4 mr-2 text-[#0077b6]" />
                                            Content <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={formData.content}
                                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                            placeholder="Write your blog content..."
                                            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#0077b6] focus:ring-1 focus:ring-[#e6f0fa] outline-none transition resize-none text-sm"
                                        />
                                        <p className="text-red-500 text-xs">{hasSubmitted && formData.content === '' ? "Required" : ""}</p>
                                    </div>
                                </div>

                                {/* Thumbnail Upload - Compact */}
                                <div className="space-y-1">
                                    <label className="flex items-center text-sm font-medium text-gray-700">
                                        <ImageIcon className="w-4 h-4 mr-2" />
                                        Thumbnail Image
                                    </label>

                                    {formData.thumbnail ? (
                                        <div className="relative">
                                            <img
                                                src={formData.thumbnail}
                                                alt="Thumbnail preview"
                                                className="w-full h-32 object-cover rounded-lg shadow-md"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFormData(prev => ({ ...prev, thumbnail: '' }));
                                                    setThumbnailFile(null);
                                                }}
                                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="block">
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors cursor-pointer">
                                                <div className="flex flex-col items-center">
                                                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                                    <span className="text-gray-700 font-medium text-sm mb-1">
                                                        Upload Thumbnail
                                                    </span>
                                                    <span className="text-gray-500 text-xs">
                                                        PNG, JPG (max 5MB)
                                                    </span>
                                                </div>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                />
                                            </div>
                                        </label>
                                    )}
                                    <p className="text-red-500 text-xs">{hasSubmitted && (!thumbnailFile || formData.thumbnail === '') ? "Thumbnail required" : ""}</p>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end pt-2">
                                    <button
                                        type="submit" disabled={isSubmitting || isLoading}
                                        className="px-6 py-2 bg-[#0077b6] text-white font-semibold rounded-lg hover:bg-[#005a8c] focus:ring-2 focus:ring-[#e6f0fa] transition transform hover:scale-105 text-sm"
                                    >
                                        {isSubmitting ? (
                                            <Skeleton className="h-4 w-28 bg-white/30" />
                                        ) : (
                                            <>
                                                Publish Story
                                            </>
                                        )}
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

export default AddBlog