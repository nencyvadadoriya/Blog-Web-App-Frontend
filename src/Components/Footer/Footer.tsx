import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="text-xl font-bold text-white">BlogSpace</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your daily source of inspiration, stories, and insights. Join our community of readers and writers.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-sm hover:text-blue-400 transition-colors">Home</a>
              </li>
              <li>
                <a href="/articles" className="text-sm hover:text-blue-400 transition-colors">Articles</a>
              </li>
              <li>
                <a href="/categories" className="text-sm hover:text-blue-400 transition-colors">Categories</a>
              </li>
              <li>
                <a href="/about" className="text-sm hover:text-blue-400 transition-colors">About Us</a>
              </li>
              <li>
                <a href="/contact" className="text-sm hover:text-blue-400 transition-colors">Contact</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Categories</h3>
            <ul className="space-y-3">
              <li>
                <a href="/category/technology" className="text-sm hover:text-blue-400 transition-colors">Technology</a>
              </li>
              <li>
                <a href="/category/lifestyle" className="text-sm hover:text-blue-400 transition-colors">Lifestyle</a>
              </li>
              <li>
                <a href="/category/business" className="text-sm hover:text-blue-400 transition-colors">Business</a>
              </li>
              <li>
                <a href="/category/travel" className="text-sm hover:text-blue-400 transition-colors">Travel</a>
              </li>
              <li>
                <a href="/category/health" className="text-sm hover:text-blue-400 transition-colors">Health</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">123 Blog Street, Digital City, DC 12345</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span className="text-sm">info@blogspace.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © {currentYear} BlogSpace. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="/privacy" className="text-sm hover:text-blue-400 transition-colors">Privacy Policy</a>
              <a href="/terms" className="text-sm hover:text-blue-400 transition-colors">Terms of Service</a>
              <a href="/cookies" className="text-sm hover:text-blue-400 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
