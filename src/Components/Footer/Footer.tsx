import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone, BookOpen, ChevronRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-white to-blue-50 text-gray-800 border-t border-gray-200 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0077b6] via-[#1e4b7a] to-[#0077b6]"></div>
      <div className="absolute top-10 -left-20 w-64 h-64 bg-[#0077b6]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 -right-20 w-80 h-80 bg-[#1e4b7a]/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-[#0077b6] to-[#1e4b7a] rounded-xl flex items-center justify-center shadow-lg shadow-[#0077b6]/20 group-hover:shadow-xl group-hover:shadow-[#0077b6]/30 transition-all duration-300 transform group-hover:scale-110">
                <BookOpen className="w-5 h-5 text-white fill-white/20" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[#0077b6] to-[#1e4b7a] bg-clip-text text-transparent">
                BlogSphere
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Your daily source of inspiration, stories, and insights. Join our community of passionate readers and writers.
            </p>
            
          

            {/* Social Links */}
            <div className="flex space-x-3 pt-2">
              <a href="#" className="w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center text-[#0077b6] hover:bg-[#0077b6] hover:text-white hover:border-[#0077b6] transition-all duration-300 shadow-sm hover:shadow-md">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center text-[#0077b6] hover:bg-[#0077b6] hover:text-white hover:border-[#0077b6] transition-all duration-300 shadow-sm hover:shadow-md">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center text-[#0077b6] hover:bg-[#0077b6] hover:text-white hover:border-[#0077b6] transition-all duration-300 shadow-sm hover:shadow-md">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center text-[#0077b6] hover:bg-[#0077b6] hover:text-white hover:border-[#0077b6] transition-all duration-300 shadow-sm hover:shadow-md">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4 text-lg relative inline-block">
              Quick Links
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#0077b6] to-[#1e4b7a]"></span>
            </h3>
            <ul className="space-y-3">
              {['Home', 'Articles', 'About Us', 'Contact'].map((item, index) => (
                <li key={index}>
                  <a 
                    href={`/${item.toLowerCase().replace(' ', '-')}`} 
                    className="text-sm text-gray-600 hover:text-[#0077b6] transition-all duration-300 flex items-center group"
                  >
                    <ChevronRight className="w-3 h-3 text-[#0077b6] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 mr-0 group-hover:mr-1" />
                    <span>{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories Section */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4 text-lg relative inline-block">
              Categories
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#0077b6] to-[#1e4b7a]"></span>
            </h3>
            <ul className="space-y-3">
              {['Technology', 'Lifestyle', 'Business', 'Travel'].map((category, index) => (
                <li key={index}>
                  <a 
                    href={`/category/${category.toLowerCase()}`} 
                    className="text-sm text-gray-600 hover:text-[#0077b6] transition-all duration-300 flex items-center group"
                  >
                    <ChevronRight className="w-3 h-3 text-[#0077b6] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 mr-0 group-hover:mr-1" />
                    <span>{category}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info Section */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4 text-lg relative inline-block">
              Contact Info
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#0077b6] to-[#1e4b7a]"></span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 group">
                <div className="p-2 bg-[#0077b6]/10 rounded-lg group-hover:bg-[#0077b6] transition-colors duration-300">
                  <MapPin className="w-4 h-4 text-[#0077b6] group-hover:text-white transition-colors duration-300" />
                </div>
                <span className="text-sm text-gray-600">123 Blog Street, Digital City, DC 12345</span>
              </li>
              <li className="flex items-center space-x-3 group">
                <div className="p-2 bg-[#0077b6]/10 rounded-lg group-hover:bg-[#0077b6] transition-colors duration-300">
                  <Phone className="w-4 h-4 text-[#0077b6] group-hover:text-white transition-colors duration-300" />
                </div>
                <span className="text-sm text-gray-600">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3 group">
                <div className="p-2 bg-[#0077b6]/10 rounded-lg group-hover:bg-[#0077b6] transition-colors duration-300">
                  <Mail className="w-4 h-4 text-[#0077b6] group-hover:text-white transition-colors duration-300" />
                </div>
                <span className="text-sm text-gray-600">info@blogsphere.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-500">
  © {currentYear} BlogSphere. Crafted with <span className="bg-gradient-to-r from-[#0077b6] to-[#1e4b7a] bg-clip-text text-transparent">❤</span> for readers worldwide.
</p>
            <div className="flex space-x-8">
              <a href="#" className="text-sm text-gray-500 hover:text-[#0077b6] transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-500 hover:text-[#0077b6] transition-colors">Terms of Service</a>
              <a href="#" className="text-sm text-gray-500 hover:text-[#0077b6] transition-colors">Cookie Policy</a>
            </div>
          </div>
          
        </div>
      </div>
    </footer>
  );
}