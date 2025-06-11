import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ScrollToTopProps {
  showHomeButton?: boolean;
  className?: string;
}

const ScrollToTop: React.FC<ScrollToTopProps> = ({ 
  showHomeButton = false, 
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex flex-col space-y-2 ${className}`}>
      {/* Scroll to Top Button */}
      <Button
        onClick={scrollToTop}
        size="sm"
        className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group"
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
      </Button>

      {/* Home Button (optional) */}
      {showHomeButton && (
        <Link to="/">
          <Button
            size="sm"
            variant="outline"
            className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-white hover:border-blue-300 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group"
            aria-label="Go to home page"
          >
            <Home className="h-5 w-5 text-gray-600 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-200" />
          </Button>
        </Link>
      )}
    </div>
  );
};

export default ScrollToTop;
