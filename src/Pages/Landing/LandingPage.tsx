import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight, BookOpen} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [, setShowLoginModal] = useState(false);

  const handleGoToRegister = () => {
    navigate('/login');
    setShowLoginModal(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-[#e6f0fa] bg-white fixed w-full z-10">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-bold text-[#1e4b7a]">
                BlogSphere
              </h1>
              <div className="hidden md:flex items-center gap-6">
                <a href="#" className="text-sm text-gray-600 hover:text-[#0077b6]">Platform</a>
                <a href="#" className="text-sm text-gray-600 hover:text-[#0077b6]">Creators</a>
                <a href="#" className="text-sm text-gray-600 hover:text-[#0077b6]">Community</a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleGoToRegister}
                className="rounded-md bg-[#0077b6] px-4 py-2 text-sm font-medium text-white hover:bg-[#005a8c] transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32  sm:pt-30 sm:pb-10 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Content */}
            <div className="max-w-3xl lg:max-w-xl">
              <div className="text-sm text-[#0077b6] mb-4 font-medium">
                Your voice deserves to be heard
              </div>
              
              <h1 className="text-6xl font-serif font-bold tracking-tight text-gray-900 sm:text-7xl lg:text-6xl xl:text-7xl">
                Where Ideas
                <span className="block text-[#0077b6]">
                  Take Flight
                </span>
              </h1>
              
              <p className="mt-6 text-base text-gray-500 max-w-xl leading-relaxed">
                Join a growing community of thinkers, writers, and creators. Share your perspective, spark conversations, and make an impact with every post.
              </p>
              
              <div className="mt-10 flex flex-wrap gap-4">
                <button
                  onClick={handleGoToRegister}
                  className="group inline-flex items-center gap-2 rounded-md bg-[#0077b6] px-6 py-3 text-sm font-medium text-white hover:bg-[#005a8c] transition-colors"
                >
                  Start your blog
                  <ArrowRight className="h-4 w-4" />
                </button>
                
                <button
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center gap-2 rounded-md border border-[#0077b6] bg-white px-6 py-3 text-sm font-medium text-[#0077b6] hover:bg-[#f0f7ff] transition-colors"
                >
                  <BookOpen className="h-4 w-4" />
                  Explore stories
                </button>
              </div>
            </div>

            {/* Right Side Image */}
            <div className="ml-10 flex-1 relative">
              {/* Main Illustration */}
              <div className="relative w-full max-w-lg mx-auto">
                {/* Alternative: If you want to use an actual image instead of SVG */}
                <img 
                  src="https://img.freepik.com/vector-premium/concepto-blogging-concepto-pagina-web_73366-17.jpg?w=360" 
                  alt="Writing illustration"
                  className="ml-15  w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <section className="border-t border-[#e6f0fa] py-12">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="flex items-center gap-8 text-xs">
            <span className="text-[#0077b6]">© 2026 BlogSphere</span>
            <span className="text-gray-300">·</span>
            <a href="#" className="text-gray-400 hover:text-[#0077b6]">Privacy</a>
            <span className="text-gray-300">·</span>
            <a href="#" className="text-gray-400 hover:text-[#0077b6]">Terms</a>
            <span className="text-gray-300">·</span>
            <a href="#" className="text-gray-400 hover:text-[#0077b6]">Contact</a>
          </div>
        </div>
      </section>
    </div>
  );
}