
import { Link } from "react-router";
import { routepath } from "../../Routes/route";
import { ArrowRight, PenTool, BookOpen, TrendingUp } from "lucide-react";

type BannerProps = {
  isSidebarCollapsed?: boolean;
};

export default function Banner({ isSidebarCollapsed = false }: BannerProps) {
  return (
    <>
         {/* Hero Section - Modern Redesign with Image */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0077b6] via-[#005a8c] to-[#003d5c] text-white py-20 sm:py-24 lg:py-32">
        {/* Decorative Pattern Overlay */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className={`relative w-full ${isSidebarCollapsed ? 'pl-6 pr-4 sm:pl-8 sm:pr-6 lg:pl-10 lg:pr-8' : 'pl-0 pr-4 sm:pr-6 lg:pr-8'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
             

              {/* Main Heading */}
              <h1 className="mt-8 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight tracking-tight">
                Welcome to 
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#e6f0fa] to-cyan-200 mt-2">
                  BlogSphere
                </span>
              </h1>

              {/* Subtitle */}
              <p className="mt-6 text-lg sm:text-xl text-white/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Discover amazing stories and publish your own blogs with a clean, modern writing experience. 
                Join thousands of writers sharing their voice with the world.
              </p>

              {/* CTA Buttons */}
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to={routepath.addBlog}
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-[#0077b6] font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
                >
                  <PenTool className="w-5 h-5" />
                  Create Your Blog
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#featured"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-white/80 text-white font-bold text-lg hover:bg-white hover:text-[#0077b6] transition-all duration-300 backdrop-blur-sm"
                >
                  <BookOpen className="w-5 h-5" />
                  Explore Blogs
                </a>
              </div>
            </div>

            {/* Right Side - Image */}
            <div className="hidden lg:block">
              <div className="relative">
                {/* Main Image Container */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                  <img 
                    src="https://img.freepik.com/vector-premium/concepto-blogging-concepto-pagina-web_73366-17.jpg?w=500" 
                    alt="Blog Writing Illustration"
                    className="w-full h-auto object-cover"
                  />
                  
                  {/* Image Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0077b6]/20 to-transparent opacity-60"></div>
                  
                  {/* Floating Cards */}
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-4 transform rotate-12 hover:rotate-6 transition-transform">
                    <div className="w-full h-full bg-gradient-to-br from-[#0077b6] to-[#005a8c] rounded-xl flex items-center justify-center">
                      <PenTool className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-3 transform -rotate-12 hover:-rotate-6 transition-transform">
                    <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-1/4 -left-4 w-3 h-3 bg-yellow-300 rounded-full animate-ping" />
                <div className="absolute bottom-1/3 -right-4 w-2 h-2 bg-cyan-300 rounded-full animate-ping delay-1000" />
                
                {/* Stats Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#0077b6]" />
                    <span className="text-sm font-bold text-[#0077b6]">Trending</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Wave Pattern */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-16 sm:h-20 lg:h-24" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
              fill="white" fillOpacity="0.05"/>
            <path d="M0 120L60 115C120 110 240 100 360 95C480 90 600 90 720 92C840 95 960 100 1080 102C1200 105 1320 105 1380 105L1440 105V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
              fill="white" fillOpacity="0.1"/>
          </svg>
        </div>
      </section>
    </>
  )
}
