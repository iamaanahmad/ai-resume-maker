import React, { useState } from 'react';
import SparklesIcon from './icons/SparklesIcon';
import TargetIcon from './icons/TargetIcon';
import QuestionMarkCircleIcon from './icons/QuestionMarkCircleIcon';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Resume Maker
              </h1>
              <p className="text-xs text-gray-500 -mt-1">Powered by AI</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#builder" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">
              Resume Builder
            </a>
            <a href="#ai-features" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">
              AI Features
            </a>
            <a href="/privacy" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">
              Privacy
            </a>
            <a href="/terms" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">
              Terms
            </a>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <a 
              href="https://www.paypal.me/iamaanahmad" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 text-red-600 hover:text-red-700 transition-colors duration-200 font-medium flex items-center space-x-1 border border-red-200 rounded-lg hover:bg-red-50"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span>Donate</span>
            </a>
            <a 
              href="#builder" 
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Start Building
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <nav className="flex flex-col space-y-4">
              <a href="#builder" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">
                Resume Builder
              </a>
              <a href="#ai-features" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">
                AI Features
              </a>
              <a href="/privacy" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">
                Privacy
              </a>
              <a href="/terms" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">
                Terms
              </a>
              <div className="pt-4 border-t border-gray-100 space-y-2">
                <a 
                  href="https://www.paypal.me/iamaanahmad" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full px-4 py-2 text-red-600 hover:text-red-700 transition-colors duration-200 font-medium flex items-center justify-center space-x-1 border border-red-200 rounded-lg hover:bg-red-50"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <span>Donate</span>
                </a>
                <a 
                  href="#builder" 
                  className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium text-center block"
                >
                  Start Building
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 