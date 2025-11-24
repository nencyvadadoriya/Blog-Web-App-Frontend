import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { 
  Search, 
  User, 
  Bookmark, 
  Heart, 
  Share2, 
  Calendar,
  Clock,
  ArrowRight,
  Menu,
  X
} from "lucide-react";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate()

  // Sample blog posts data
  const featuredPosts = [
    {
      id: 1,
      title: "The Future of Web Development in 2024",
      excerpt: "Exploring the latest trends and technologies shaping the future of web development including AI, Web3, and new frameworks.",
      author: "Sarah Johnson",
      date: "Dec 15, 2024",
      readTime: "8 min read",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=500&h=300&fit=crop",
      likes: 142,
      saved: 56
    },
    {
      id: 2,
      title: "Mastering React Hooks: A Complete Guide",
      excerpt: "Deep dive into React Hooks with practical examples and best practices for building modern React applications.",
      author: "Mike Chen",
      date: "Dec 12, 2024",
      readTime: "12 min read",
      category: "Programming",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&h=300&fit=crop",
      likes: 89,
      saved: 34
    },
    {
      id: 3,
      title: "The Art of Minimalist Design",
      excerpt: "How minimalist design principles can create more effective and beautiful user interfaces.",
      author: "Emma Davis",
      date: "Dec 10, 2024",
      readTime: "6 min read",
      category: "Design",
      image: "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=500&h=300&fit=crop",
      likes: 203,
      saved: 78
    }
  ];

  const recentPosts = [
    {
      id: 4,
      title: "Getting Started with TypeScript",
      excerpt: "A beginner-friendly introduction to TypeScript and why it's becoming essential for modern web development.",
      author: "Alex Thompson",
      date: "Dec 8, 2024",
      readTime: "10 min read",
      category: "Programming"
    },
    {
      id: 5,
      title: "CSS Grid vs Flexbox: When to Use What",
      excerpt: "Understanding the differences between CSS Grid and Flexbox with practical layout examples.",
      author: "Lisa Wang",
      date: "Dec 5, 2024",
      readTime: "7 min read",
      category: "CSS"
    },
    {
      id: 6,
      title: "Building Scalable APIs with Node.js",
      excerpt: "Best practices for building robust and scalable REST APIs using Node.js and Express.",
      author: "David Kim",
      date: "Dec 3, 2024",
      readTime: "15 min read",
      category: "Backend"
    }
  ];

  const categories = [
    { name: "Technology", count: 24 },
    { name: "Programming", count: 18 },
    { name: "Design", count: 12 },
    { name: "Lifestyle", count: 8 },
    { name: "Business", count: 6 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-xl font-bold text-gray-800">BlogSphere</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium">Home</Link>
              <Link to="/blog" className="text-gray-600 hover:text-blue-600 font-medium">Blog</Link>
              <Link to="/categories" className="text-gray-600 hover:text-blue-600 font-medium">Categories</Link>
              <Link to="/about" className="text-gray-600 hover:text-blue-600 font-medium">About</Link>
              <Link to="/contact" className="text-gray-600 hover:text-blue-600 font-medium">Contact</Link>
            </nav>

            {/* Search and User Actions */}
            <div className="hidden md:flex items-center gap-4">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Write Article
              </button>
              <button className="p-2 text-gray-600 hover:text-blue-600">
                <User className="w-5 h-5" />
              </button>
              <button className="p-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200 group" onClick={()=>{
                localStorage.removeItem('token');
                navigate('/login' , {replace : true})
              }}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg></button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
              <nav className="flex flex-col gap-4">
                <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium">Home</Link>
                <Link to="/blog" className="text-gray-600 hover:text-blue-600 font-medium">Blog</Link>
                <Link to="/categories" className="text-gray-600 hover:text-blue-600 font-medium">Categories</Link>
                <Link to="/about" className="text-gray-600 hover:text-blue-600 font-medium">About</Link>
                <Link to="/contact" className="text-gray-600 hover:text-blue-600 font-medium">Contact</Link>
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Search articles..."
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Search
                  </button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to <span className="text-yellow-300">BlogSphere</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Discover amazing stories, creative ideas, and professional insights from writers around the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Start Reading
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Become a Writer
            </button>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Featured Posts</h2>
            <Link to="/blog" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full font-medium">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{post.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors">
                        <Heart className="w-4 h-4" />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors">
                        <Bookmark className="w-4 h-4" />
                        <span>{post.saved}</span>
                      </button>
                    </div>
                    <button className="text-gray-500 hover:text-gray-700 transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Recent Posts */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Recent Posts</h2>
              <div className="space-y-8">
                {recentPosts.map((post) => (
                  <article key={post.id} className="border-b border-gray-200 pb-8 last:border-b-0">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
                        {post.category}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3 hover:text-blue-600 transition-colors">
                      <Link to={`/post/${post.id}`}>{post.title}</Link>
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <span>By {post.author}</span>
                        <span>{post.date}</span>
                      </div>
                      <span>{post.readTime}</span>
                    </div>
                  </article>
                ))}
              </div>

              {/* Load More Button */}
              <div className="text-center mt-12">
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                  Load More Articles
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Categories */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Categories</h3>
                <div className="space-y-3">
                  {categories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                      <span className="text-gray-600 hover:text-blue-600 cursor-pointer transition-colors">
                        {category.name}
                      </span>
                      <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-3">Subscribe to Newsletter</h3>
                <p className="text-blue-100 mb-4">
                  Get the latest posts delivered right to your inbox.
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 placeholder-blue-200 text-white focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  <button className="w-full bg-white text-blue-600 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">B</span>
                </div>
                <span className="text-xl font-bold">BlogSphere</span>
              </div>
              <p className="text-gray-400">
                Sharing knowledge, inspiring creativity, and building community through the power of words.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Technology</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Programming</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Design</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Lifestyle</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BlogSphere. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}