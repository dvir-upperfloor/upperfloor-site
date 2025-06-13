import React, { useState, useEffect } from 'react';

const AccessibilityDrawer = ({ open, onClose }) => {
  const [fontSize, setFontSize] = useState(100);
  const [wordSpacing, setWordSpacing] = useState(0);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [visualMode, setVisualMode] = useState('normal'); // 'normal', 'dark', 'high-contrast', 'inverted', 'black-white'
  const [isBigCursor, setIsBigCursor] = useState(false);
  const [isReadingGuide, setIsReadingGuide] = useState(false);
  const [isStopAnimations, setIsStopAnimations] = useState(false);
  const [isUnderlineLinks, setIsUnderlineLinks] = useState(false);
  const [isHighlightHeaders, setIsHighlightHeaders] = useState(false);
  const [isReadableFont, setIsReadableFont] = useState(false);
  const [isHideImages, setIsHideImages] = useState(false);
  const [isDarkBigCursor, setIsDarkBigCursor] = useState(false);

  // Add/remove class to body when drawer opens/closes
  useEffect(() => {
    const accessibilityBtn = document.querySelector('.accessibility-btn');
    
    if (open) {
      document.body.classList.add('accessibility-drawer-open');
      if (accessibilityBtn) {
        accessibilityBtn.classList.add('drawer-open');
      }
    } else {
      document.body.classList.remove('accessibility-drawer-open');
      if (accessibilityBtn) {
        accessibilityBtn.classList.remove('drawer-open');
        // REMOVED: No longer automatically removing focus
      }
    }
    
    return () => {
      document.body.classList.remove('accessibility-drawer-open');
      if (accessibilityBtn) {
        accessibilityBtn.classList.remove('drawer-open');
      }
    };
  }, [open]);

  useEffect(() => {
    // Apply accessibility settings to the document
    const body = document.body;
    const html = document.documentElement;

    // Font size
    html.style.fontSize = `${fontSize}%`;

    // Word spacing - apply to all elements
    if (wordSpacing > 0) {
      const style = document.getElementById('accessibility-word-spacing') || document.createElement('style');
      style.id = 'accessibility-word-spacing';
      style.innerHTML = `
        * {
          word-spacing: ${wordSpacing * 0.2}em !important;
        }
      `;
      if (!document.getElementById('accessibility-word-spacing')) {
        document.head.appendChild(style);
      }
    } else {
      const style = document.getElementById('accessibility-word-spacing');
      if (style) {
        style.remove();
      }
    }

    // Letter spacing
    if (letterSpacing > 0) {
      body.style.letterSpacing = `${letterSpacing * 0.05}em`;
    } else {
      body.style.letterSpacing = '';
    }

    // Visual modes - remove all first
    body.classList.remove('dark-mode', 'high-contrast', 'inverted-contrast', 'black-white');
    
    // Apply selected visual mode
    switch(visualMode) {
      case 'dark':
        body.classList.add('dark-mode');
        break;
      case 'high-contrast':
        body.classList.add('high-contrast');
        break;
      case 'inverted':
        body.classList.add('inverted-contrast');
        break;
      case 'black-white':
        body.classList.add('black-white');
        break;
      default:
        // normal mode - no classes added
        break;
    }

    // Big cursor (white)
    if (isBigCursor) {
      body.classList.add('big-cursor');
    } else {
      body.classList.remove('big-cursor');
    }

    // Dark big cursor
    if (isDarkBigCursor) {
      body.classList.add('dark-big-cursor');
    } else {
      body.classList.remove('dark-big-cursor');
    }

    // UPDATED: Stop animations with proper CSS targeting including background
    if (isStopAnimations) {
      const stopAnimationsStyle = document.getElementById('stop-animations-style') || document.createElement('style');
      stopAnimationsStyle.id = 'stop-animations-style';
      stopAnimationsStyle.innerHTML = `
        /* Stop all animations and transitions except accessibility drawer */
        *:not(.accessibility-drawer):not(.accessibility-drawer *) {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
        
        /* Hide and stop all background animated elements */
        .dynamic-light,
        .water-particle,
        .water-shimmer,
        .floating-element,
        .dust-particles,
        .rising-droplet,
        .rising-droplet-simple {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          animation: none !important;
          transition: none !important;
        }
        
        /* Stop stage graphics animations */
        .identify-graphic,
        .educate-graphic,
        .develop-graphic,
        .identify-circle,
        .identify-inner,
        .edu-circle,
        .dev-square {
          animation: none !important;
          transition: none !important;
          transform: none !important;
        }
        
        /* Make stage graphics static and visible but not animated */
        .identify-graphic,
        .educate-graphic, 
        .develop-graphic {
          opacity: 0.3 !important;
          visibility: visible !important;
        }
        
        .identify-circle,
        .identify-inner {
          opacity: 1 !important;
          transform: scale(1) !important;
        }
        
        .edu-circle {
          opacity: 1 !important;
          transform: scale(1) !important;
        }
        
        .dev-square {
          opacity: 1 !important;
          transform: scale(1) rotate(0deg) !important;
        }
        
        /* Ensure background is pure black without any effects */
        .background-gradient {
          background: #000000 !important;
          animation: none !important;
          transition: none !important;
        }
        
        /* Stop any GSAP animations on background elements */
        .dynamic-light::before,
        .dynamic-light::after {
          display: none !important;
        }
        
        /* Keep accessibility drawer transitions working */
        .accessibility-drawer {
          transition: left 0.3s ease-in-out !important;
        }
        
        .accessibility-drawer.open {
          animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        
        /* Keep essential button interactions */
        .accessibility-drawer .setting-option,
        .accessibility-drawer button {
          transition: all 0.3s ease !important;
        }
      `;
      if (!document.getElementById('stop-animations-style')) {
        document.head.appendChild(stopAnimationsStyle);
      }
      
      // Also add class to body for additional control and stop GSAP animations
      body.classList.add('animations-stopped');
      
      // Kill all GSAP animations on background elements AND stage graphics
      const backgroundElements = document.querySelectorAll('.dynamic-light, .water-particle, .water-shimmer, .rising-droplet, .rising-droplet-simple, .floating-element');
      const stageElements = document.querySelectorAll('.identify-graphic, .educate-graphic, .develop-graphic, .identify-circle, .identify-inner, .edu-circle, .dev-square');
      
      [...backgroundElements, ...stageElements].forEach(element => {
        if (window.gsap) {
          window.gsap.killTweensOf(element);
        }
      });
      
      // Hide background elements
      backgroundElements.forEach(element => {
        element.style.display = 'none';
      });
      
      // Stop counter animations by setting final values immediately
      const statNumbers = document.querySelectorAll('.stat-number');
      statNumbers.forEach(statElement => {
        const originalText = statElement.textContent;
        if (originalText.includes('M+')) {
          statElement.textContent = '17M+';
        } else if (originalText.includes('435')) {
          statElement.textContent = '435+';
        } else if (originalText.includes('55')) {
          statElement.textContent = '55+';
        }
      });
      
    } else {
      const stopAnimationsStyle = document.getElementById('stop-animations-style');
      if (stopAnimationsStyle) {
        stopAnimationsStyle.remove();
      }
      body.classList.remove('animations-stopped');
      
      // Re-show background elements when animations are re-enabled
      const backgroundElements = document.querySelectorAll('.dynamic-light, .water-particle, .water-shimmer, .rising-droplet, .rising-droplet-simple, .floating-element');
      backgroundElements.forEach(element => {
        element.style.display = '';
      });
    }

    // Underline links
    if (isUnderlineLinks) {
      body.classList.add('underline-links');
    } else {
      body.classList.remove('underline-links');
    }

    // Highlight Headers
    if (isHighlightHeaders) {
      body.classList.add('highlight-headers');
    } else {
      body.classList.remove('highlight-headers');
    }

    // Readable Font
    if (isReadableFont) {
      body.classList.add('readable-font');
    } else {
      body.classList.remove('readable-font');
    }

    // Hide Images
    if (isHideImages) {
      body.classList.add('hide-images');
    } else {
      body.classList.remove('hide-images');
    }

    // Reading guide
    if (isReadingGuide) {
      createReadingGuide();
    } else {
      removeReadingGuide();
    }

    // Cleanup on unmount
    return () => {
      html.style.fontSize = '';
      body.style.letterSpacing = '';
      body.classList.remove('dark-mode', 'high-contrast', 'inverted-contrast', 'black-white', 'big-cursor', 'dark-big-cursor', 'underline-links', 'highlight-headers', 'readable-font', 'hide-images', 'animations-stopped');
      removeReadingGuide();
      // Remove word spacing style
      const wordSpacingStyle = document.getElementById('accessibility-word-spacing');
      if (wordSpacingStyle) {
        wordSpacingStyle.remove();
      }
      // Remove stop animations style
      const stopAnimationsStyle = document.getElementById('stop-animations-style');
      if (stopAnimationsStyle) {
        stopAnimationsStyle.remove();
      }
    };
  }, [fontSize, wordSpacing, letterSpacing, visualMode, isBigCursor, isDarkBigCursor, isStopAnimations, isUnderlineLinks, isHighlightHeaders, isReadableFont, isHideImages, isReadingGuide]);

  const createReadingGuide = () => {
  // Remove existing guide
  removeReadingGuide();
  
  const guide = document.createElement('div');
  guide.id = 'reading-guide';
  guide.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: #38bdf8;
    z-index: 9999;
    pointer-events: none;
    box-shadow: 0 0 8px rgba(56, 189, 248, 0.6);
  `;
  
  document.body.appendChild(guide);
  
  const updateGuidePosition = (e) => {
    // Remove any transition and update position immediately
    guide.style.transition = 'none';
    guide.style.top = e.clientY + 'px';
  };
  
  // Store the function reference for cleanup
  guide.updateFunction = updateGuidePosition;
  document.addEventListener('mousemove', updateGuidePosition);
};

  const removeReadingGuide = () => {
  const existingGuide = document.getElementById('reading-guide');
  if (existingGuide && existingGuide.updateFunction) {
    document.removeEventListener('mousemove', existingGuide.updateFunction);
    existingGuide.remove();
  }
};

  const resetSettings = () => {
    setFontSize(100);
    setWordSpacing(0);
    setLetterSpacing(0);
    setVisualMode('normal');
    setIsBigCursor(false);
    setIsDarkBigCursor(false);
    setIsReadingGuide(false);
    setIsStopAnimations(false);
    setIsUnderlineLinks(false);
    setIsHighlightHeaders(false);
    setIsReadableFont(false);
    setIsHideImages(false);
    
    // REMOVED: No longer automatically removing focus from reset button
  };

  return (
    <div className={`accessibility-drawer ${open ? 'open' : ''}`} role="dialog" aria-modal="true" aria-labelledby="accessibility-drawer-title">
      <div className="drawer-header">
        <button className="close-btn" onClick={onClose} aria-label="סגור את תפריט הנגישות">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h2 id="accessibility-drawer-title">כלי נגישות</h2>
      </div>

      <div className="drawer-content">
        {/* Display Mode Options - Row 1 */}
        <div className="settings-row" role="group" aria-labelledby="visual-modes-1">
          <h3 id="visual-modes-1" className="sr-only">מצבי תצוגה</h3>
          <button 
            className={`setting-option ${visualMode === 'dark' ? 'active' : ''}`} 
            onClick={() => setVisualMode(visualMode === 'dark' ? 'normal' : 'dark')}
            aria-pressed={visualMode === 'dark'}
            aria-label="גווני אפור - המר את האתר לגוונים של אפור"
          >
            <div className="option-icon" aria-hidden="true">🌫️</div>
            <span>גווני אפור</span>
          </button>
          <button 
            className={`setting-option ${visualMode === 'high-contrast' ? 'active' : ''}`} 
            onClick={() => setVisualMode(visualMode === 'high-contrast' ? 'normal' : 'high-contrast')}
            aria-pressed={visualMode === 'high-contrast'}
            aria-label="ניגודיות גבוהה - הגבר את הניגודיות לקריאה טובה יותר"
          >
            <div className="option-icon" aria-hidden="true">⚡</div>
            <span>ניגודיות גבוהה</span>
          </button>
          <button 
            className={`setting-option ${visualMode === 'inverted' ? 'active' : ''}`} 
            onClick={() => setVisualMode(visualMode === 'inverted' ? 'normal' : 'inverted')}
            aria-pressed={visualMode === 'inverted'}
            aria-label="ניגודיות הפוכה - הפוך את צבעי האתר"
          >
            <div className="option-icon" aria-hidden="true">🔄</div>
            <span>ניגודיות הפוכה</span>
          </button>
        </div>

        {/* Display Mode Options - Row 2 */}
        <div className="settings-row" role="group" aria-labelledby="visual-modes-2">
          <h3 id="visual-modes-2" className="sr-only">מצבי תצוגה נוספים</h3>
          <button 
            className={`setting-option ${visualMode === 'black-white' ? 'active' : ''}`} 
            onClick={() => setVisualMode(visualMode === 'black-white' ? 'normal' : 'black-white')}
            aria-pressed={visualMode === 'black-white'}
            aria-label="שחור לבן - המר את האתר לצבעים של שחור ולבן בלבד"
          >
            <div className="option-icon" aria-hidden="true">◐</div>
            <span>שחור לבן</span>
          </button>
          <button 
            className={`setting-option ${isStopAnimations ? 'active' : ''}`} 
            onClick={() => setIsStopAnimations(!isStopAnimations)}
            aria-pressed={isStopAnimations}
            aria-label="עצירת אנימציות - עצור את כל התנועות והאנימציות באתר כולל רקע"
          >
            <div className="option-icon" aria-hidden="true">⏸️</div>
            <span>עצירת אנימציות</span>
          </button>
          <button 
            className={`setting-option ${isReadableFont ? 'active' : ''}`} 
            onClick={() => setIsReadableFont(!isReadableFont)}
            aria-pressed={isReadableFont}
            aria-label="גופן קריא - הפוך את כל הטקסט למודגש לקריאה קלה יותר"
          >
            <div className="option-icon" aria-hidden="true">𝐀</div>
            <span>גופן קריא</span>
          </button>
        </div>

        {/* Font Size Control */}
        <div className="control-section">
          <label htmlFor="font-size-slider">התאמת גודל גופן</label>
          <div className="slider-control">
            <button 
              onClick={() => setFontSize(Math.max(50, fontSize - 10))}
              aria-label="הקטן גודל גופן"
            >−</button>
            <input
              id="font-size-slider"
              type="range"
              min="50"
              max="200"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              aria-label={`גודל גופן נוכחי: ${fontSize} אחוז`}
            />
            <span className="value" aria-live="polite">{fontSize}%</span>
            <button 
              onClick={() => setFontSize(Math.min(200, fontSize + 10))}
              aria-label="הגדל גודל גופן"
            >+</button>
          </div>
        </div>

        {/* Word Spacing Control */}
        <div className="control-section">
          <label htmlFor="word-spacing-slider">התאמת ריווח בין מילים</label>
          <div className="slider-control">
            <button 
              onClick={() => setWordSpacing(Math.max(0, wordSpacing - 1))}
              aria-label="הקטן ריווח בין מילים"
            >−</button>
            <input
              id="word-spacing-slider"
              type="range"
              min="0"
              max="5"
              value={wordSpacing}
              onChange={(e) => setWordSpacing(parseInt(e.target.value))}
              aria-label={`ריווח בין מילים נוכחי: ${wordSpacing}`}
            />
            <span className="value" aria-live="polite">{wordSpacing}</span>
            <button 
              onClick={() => setWordSpacing(Math.min(5, wordSpacing + 1))}
              aria-label="הגדל ריווח בין מילים"
            >+</button>
          </div>
        </div>

        {/* Letter Spacing Control */}
        <div className="control-section">
          <label htmlFor="letter-spacing-slider">התאמת ריווח בין אותיות</label>
          <div className="slider-control">
            <button 
              onClick={() => setLetterSpacing(Math.max(0, letterSpacing - 1))}
              aria-label="הקטן ריווח בין אותיות"
            >−</button>
            <input
              id="letter-spacing-slider"
              type="range"
              min="0"
              max="5"
              value={letterSpacing}
              onChange={(e) => setLetterSpacing(parseInt(e.target.value))}
              aria-label={`ריווח בין אותיות נוכחי: ${letterSpacing}`}
            />
            <span className="value" aria-live="polite">{letterSpacing}</span>
            <button 
              onClick={() => setLetterSpacing(Math.min(5, letterSpacing + 1))}
              aria-label="הגדל ריווח בין אותיות"
            >+</button>
          </div>
        </div>

        {/* Additional Options */}
        <div className="settings-grid" role="group" aria-labelledby="additional-options">
          <h3 id="additional-options" className="sr-only">אפשרויות נוספות</h3>
          <button 
            className={`setting-option ${isHighlightHeaders ? 'active' : ''}`} 
            onClick={() => setIsHighlightHeaders(!isHighlightHeaders)}
            aria-pressed={isHighlightHeaders}
            aria-label="הדגשת כותרות - הדגש את כל הכותרות ברקע כהה"
          >
            <div className="option-icon" aria-hidden="true">🏷️</div>
            <span>הדגשת כותרות</span>
          </button>
          <button 
            className={`setting-option ${isUnderlineLinks ? 'active' : ''}`} 
            onClick={() => setIsUnderlineLinks(!isUnderlineLinks)}
            aria-pressed={isUnderlineLinks}
            aria-label="הדגשת קישורים - הוסף קו תחתון לכל הקישורים"
          >
            <div className="option-icon" aria-hidden="true">🔗</div>
            <span>הדגשת קישורים</span>
          </button>
          <button 
            className={`setting-option ${isBigCursor ? 'active' : ''}`} 
            onClick={() => {
              if (isBigCursor) {
                setIsBigCursor(false);
              } else {
                setIsBigCursor(true);
                setIsDarkBigCursor(false);
              }
            }}
            aria-pressed={isBigCursor}
            aria-label="סמן גדול לבן - החלף את הסמן לסמן גדול בצבע לבן"
          >
            <div className="option-icon" aria-hidden="true">⚪</div>
            <span>סמן גדול</span>
          </button>
          <button 
            className={`setting-option ${isReadingGuide ? 'active' : ''}`} 
            onClick={() => setIsReadingGuide(!isReadingGuide)}
            aria-pressed={isReadingGuide}
            aria-label="מדריך קריאה - הצג קו כחול העוקב אחרי העכבר"
          >
            <div className="option-icon" aria-hidden="true">📏</div>
            <span>מדריך קריאה</span>
          </button>
          <button 
            className={`setting-option ${isHideImages ? 'active' : ''}`} 
            onClick={() => setIsHideImages(!isHideImages)}
            aria-pressed={isHideImages}
            aria-label="הסתרת תמונות - הסתר את כל התמונות לטעינה מהירה יותר"
          >
            <div className="option-icon" aria-hidden="true">🚫</div>
            <span>הסתרת תמונות</span>
          </button>
          <button 
            className={`setting-option ${isDarkBigCursor ? 'active' : ''}`} 
            onClick={() => {
              if (isDarkBigCursor) {
                setIsDarkBigCursor(false);
              } else {
                setIsDarkBigCursor(true);
                setIsBigCursor(false);
              }
            }}
            aria-pressed={isDarkBigCursor}
            aria-label="סמן גדול כהה - החלף את הסמן לסמן גדול בצבע שחור"
          >
            <div className="option-icon" aria-hidden="true">⚫</div>
            <span>סמן גדול כהה</span>
          </button>
        </div>

        {/* Reset Button */}
        <div className="control-section">
          <button 
            onClick={resetSettings}
            className="reset-button"
            aria-label="איפוס כל הגדרות הנגישות לברירת מחדל"
          >
            איפוס הגדרות
          </button>
        </div>

        {/* Footer */}
        <div className="drawer-footer">
          <div className="footer-links">
            <a href="/accessibility.html" target="_blank" rel="noopener noreferrer">הצהרת נגישות</a>
            <span> | </span>
            <a href="/terms.html" target="_blank" rel="noopener noreferrer">תנאים</a>
          </div>
          <div className="footer-credit">
            נגישות by <span className="heart">💙</span> Upper Floor
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityDrawer;