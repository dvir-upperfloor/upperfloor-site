import React, { useEffect } from 'react';

const HamburgerMenu = ({ 
  isOpen, 
  onClose, 
  onNavigateToHome,
  onNavigateToAbout, 
  onNavigateToArticles,
  currentPage = 'main'
}) => {
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="hamburger-backdrop" 
          onClick={handleBackdropClick}
          aria-hidden="true"
        />
      )}
      
      {/* Hamburger Menu - Clean horizontal layout */}
      <div 
        className={`hamburger-menu ${isOpen ? 'open' : ''}`}
        role="navigation"
        aria-label="תפריט ניווט ראשי"
        aria-hidden={!isOpen}
      >        
        <div className="hamburger-menu-content">
          <nav className="hamburger-nav">
            <ul className="hamburger-nav-list">
              {/* Home Page Option */}
              <li className="hamburger-nav-item">
                <button
                  className={`hamburger-nav-link ${currentPage === 'main' ? 'active' : ''}`}
                  onClick={onNavigateToHome}
                  tabIndex={isOpen ? 0 : -1}
                  aria-label="עבור לדף הבית"
                  type="button"
                >
                  דף הבית
                </button>
              </li>
              
              {/* About Page Option */}
              <li className="hamburger-nav-item">
                <button
                  className={`hamburger-nav-link ${currentPage === 'about' ? 'active' : ''}`}
                  onClick={onNavigateToAbout}
                  tabIndex={isOpen ? 0 : -1}
                  aria-label="עבור לעמוד אודות"
                  type="button"
                >
                  אודות
                </button>
              </li>
              
              {/* Articles Page Option */}
              <li className="hamburger-nav-item">
                <button
                  className={`hamburger-nav-link ${currentPage === 'articles' ? 'active' : ''}`}
                  onClick={onNavigateToArticles}
                  tabIndex={isOpen ? 0 : -1}
                  aria-label="עבור לעמוד מאמרים"
                  type="button"
                >
                  מאמרים
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default HamburgerMenu;