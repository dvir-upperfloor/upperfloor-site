import React, { useState, useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import ContactDrawer from './ContactDrawer';
import AccessibilityDrawer from './AccessibilityDrawer';
import HamburgerMenu from './HamburgerMenu';
import AboutPage from './AboutPage';
import ArticlesPage from './ArticlesPage';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const UpperFloor = () => {
  // Refs
  const containerRef = useRef(null);
  const introOverlayRef = useRef(null);
  const introLogoRef = useRef(null);
  const introTextRef = useRef(null);
  const introLogoContainerRef = useRef(null);
  const navLogoRef = useRef(null);

  // State
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [sections, setSections] = useState([]);
  const [paginationDots, setPaginationDots] = useState([]);
  const [isContactDrawerOpen, setIsContactDrawerOpen] = useState(false);
  const [isAccessibilityDrawerOpen, setIsAccessibilityDrawerOpen] = useState(false);
  const [keyboardNavigation, setKeyboardNavigation] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // New states for hamburger menu and page navigation
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('main'); // 'main', 'about', 'articles'

  // FIXED: Add persistent accessibility state - matching your existing structure
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    fontSize: 100,
    wordSpacing: 0,
    letterSpacing: 0,
    visualMode: 'normal', // 'normal', 'dark', 'high-contrast', 'inverted', 'black-white'
    isBigCursor: false,
    isReadingGuide: false,
    isStopAnimations: false,
    isUnderlineLinks: false,
    isHighlightHeaders: false,
    isReadableFont: false,
    isHideImages: false,
    isDarkBigCursor: false
  });

  // FIXED: Function to update accessibility settings
  const updateAccessibilitySettings = (newSettings) => {
    setAccessibilitySettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  // FIXED: Function to apply accessibility classes to body
  const applyAccessibilityClasses = () => {
    const baseClass = currentPage === 'main' ? 'main-page' : 'page-mode';
    let classes = [baseClass];

    // Add visual mode classes
    if (accessibilitySettings.visualMode === 'dark') classes.push('dark-mode');
    if (accessibilitySettings.visualMode === 'high-contrast') classes.push('high-contrast');
    if (accessibilitySettings.visualMode === 'inverted') classes.push('inverted-contrast');
    if (accessibilitySettings.visualMode === 'black-white') classes.push('black-white');
    
    // Add other accessibility classes
    if (accessibilitySettings.isHighlightHeaders) classes.push('highlight-headers');
    if (accessibilitySettings.isReadableFont) classes.push('readable-font');
    if (accessibilitySettings.isBigCursor) classes.push('big-cursor');
    if (accessibilitySettings.isDarkBigCursor) classes.push('dark-big-cursor');
    if (accessibilitySettings.isHideImages) classes.push('hide-images');
    if (accessibilitySettings.isUnderlineLinks) classes.push('underline-links');
    if (accessibilitySettings.isStopAnimations) classes.push('animations-stopped');

    // Add accessibility drawer open class if needed
    if (isAccessibilityDrawerOpen) classes.push('accessibility-drawer-open');

    document.body.className = classes.join(' ');
  };

  // FIXED: Apply accessibility settings whenever they change or page changes
  useEffect(() => {
    applyAccessibilityClasses();
    
    // Apply font size as percentage
    document.documentElement.style.fontSize = accessibilitySettings.fontSize + '%';
    
    // Apply word spacing
    if (accessibilitySettings.wordSpacing > 0) {
      const style = document.getElementById('accessibility-word-spacing') || document.createElement('style');
      style.id = 'accessibility-word-spacing';
      style.innerHTML = `
        * {
          word-spacing: ${accessibilitySettings.wordSpacing * 0.2}em !important;
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

    // Apply letter spacing
    if (accessibilitySettings.letterSpacing > 0) {
      document.body.style.letterSpacing = `${accessibilitySettings.letterSpacing * 0.05}em`;
    } else {
      document.body.style.letterSpacing = '';
    }

    // FIXED: High contrast mode - hide floating particles
    if (accessibilitySettings.visualMode === 'high-contrast') {
      const floatingElements = document.querySelectorAll('.floating-particles, .floating-particle, .gradient-overlay-1, .gradient-overlay-2, .gradient-overlay-3, .background-logo');
      floatingElements.forEach(element => {
        element.style.display = 'none';
        element.style.visibility = 'hidden';
        element.style.opacity = '0';
      });
    } else {
      const floatingElements = document.querySelectorAll('.floating-particles, .floating-particle, .gradient-overlay-1, .gradient-overlay-2, .gradient-overlay-3, .background-logo');
      floatingElements.forEach(element => {
        element.style.display = '';
        element.style.visibility = '';
        element.style.opacity = '';
      });
    }
  }, [accessibilitySettings, currentPage, isAccessibilityDrawerOpen]);

  // FIXED: Improved mobile detection
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Stable particle data that doesn't change on re-render
  const particleData = useMemo(() => {
    const count = isMobile ? 8 : 15; // Fewer particles on mobile
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDelay: Math.random() * 10,
      animationDuration: 12 + Math.random() * 8
    }));
  }, [isMobile]);

  // Initialize sections and pagination
  useEffect(() => {
    // Get all sections except about section
    const allSections = Array.from(document.querySelectorAll('.section, .stage-section, .results-section, .contact-section'));
    setSections(allSections);

    // Get pagination dots
    const dots = document.querySelectorAll('.pagination-dot');
    setPaginationDots(Array.from(dots));

    // FIXED: More robust mobile initialization with delay to ensure elements exist
    if (isMobile) {
      setTimeout(() => {
        // Mobile: Force all sections visible
        const mobileSections = document.querySelectorAll('.section, .stage-section, .results-section, .contact-section');
        mobileSections.forEach(section => {
          section.classList.add('active');
          section.style.opacity = '1';
          section.style.visibility = 'visible';
        });
        
        // Mobile: Force all content visible
        const mobileContent = document.querySelectorAll('.vision-content, .stages-content, .stage-content, .results-title, .stats-container, .contact-title, .contact-info, .contact-buttons');
        mobileContent.forEach(element => {
          element.style.opacity = '1';
          element.style.transform = 'none';
          element.style.visibility = 'visible';
        });
        
        // Mobile: Force stage content visible
        const stageContents = document.querySelectorAll('.stage-content');
        stageContents.forEach(content => {
          content.style.opacity = '1';
          content.style.visibility = 'visible';
          content.style.transform = 'none';
        });
      }, 100); // Small delay to ensure DOM is ready
    } else {
      // Desktop: Initialize with first section active only
      if (allSections.length > 0) {
        allSections[0].classList.add('active');
      }
    }
  }, [currentPage, isMobile]);

  // Keyboard navigation detection
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Tab' || e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        setKeyboardNavigation(true);
      }
    };

    const handleMouseDown = () => {
      setKeyboardNavigation(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  // Handle hamburger menu toggle
  const handleHamburgerToggle = () => {
    setIsHamburgerOpen(!isHamburgerOpen);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isHamburgerOpen && !event.target.closest('.hamburger-menu') && !event.target.closest('.hamburger-btn')) {
        setIsHamburgerOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape' && isHamburgerOpen) {
        setIsHamburgerOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isHamburgerOpen]);

  // Handle page navigation
  const handlePageNavigation = (page) => {
    setCurrentPage(page);
    setIsHamburgerOpen(false);
    
    // Reset current section index when going back to main
    if (page === 'main') {
      setCurrentSectionIndex(0);
    }
  };

  // Handle home navigation from hamburger menu
  const handleNavigateToHome = () => {
    setCurrentPage('main');
    setIsHamburgerOpen(false);
    setCurrentSectionIndex(0);
  };

  // Handle back navigation from pages
  const handleBackNavigation = () => {
    handlePageNavigation('main');
  };

  // REMOVED: The old useEffect that was overwriting body className - now handled by applyAccessibilityClasses

  // Handle opening the contact drawer
  const handleOpenContactDrawer = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsContactDrawerOpen(true);
    
    // Announce to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = 'טופס יצירת קשר נפתח';
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  // Handle closing the contact drawer
  const handleCloseContactDrawer = () => {
    setIsContactDrawerOpen(false);
  };

  // Handle opening/closing the accessibility drawer with toggle
  const handleToggleAccessibilityDrawer = () => {
    setIsAccessibilityDrawerOpen(!isAccessibilityDrawerOpen);
    
    // Announce to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = isAccessibilityDrawerOpen ? 'תפריט נגישות נסגר' : 'תפריט נגישות נפתח';
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  // Handle closing the accessibility drawer
  const handleCloseAccessibilityDrawer = () => {
    setIsAccessibilityDrawerOpen(false);
  };

  // FIXED: Intro animation - improved mobile scaling and smoother transitions
  useEffect(() => {
    if (currentPage !== 'main') return; // Only run intro on main page
    
    const introOverlay = introOverlayRef.current;
    const introLogo = introLogoRef.current;
    const introText = introTextRef.current;
    const introLogoContainer = introLogoContainerRef.current;
    const navLogo = navLogoRef.current;

    playIntroAnimation();

    function playIntroAnimation() {
      setTimeout(() => {
        // 1. First, fade in ONLY the logo with subtle shimmer
        gsap.to(introLogo, {
          opacity: 1,
          duration: 1.2,
          ease: "power2.out",
          onStart: () => {
            if (introLogo) {
              introLogo.style.filter = 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.1))';
            }
          }
        });

        // 2. After logo is visible, have text emerge from it
        setTimeout(() => {
          gsap.to(introText, {
            opacity: 1,
            x: 15,
            scale: 1,
            duration: 0.9,
            ease: "back.out(1.7)",
            onStart: () => {
              if (introText) {
                introText.style.filter = 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.08))';
              }
            }
          });

          // 3. Continue with animation sequence
          setTimeout(() => {
            // Fade out the text
            gsap.to(introText, {
              opacity: 0,
              duration: 0.8,
              ease: "power2.in"
            });

            // Get exact nav logo position for proper animation
            if (navLogo && introLogo) {
              const navLogoRect = navLogo.getBoundingClientRect();
              const introLogoRect = introLogo.getBoundingClientRect();

              // FIXED: Better mobile scaling calculation
              const isMobileDevice = window.innerWidth <= 768;
              const mobileScaleFactor = isMobileDevice ? 0.7 : 1; // Updated scale factor

              // Calculate exact translation needed
              const translateX = (navLogoRect.left - introLogoRect.left + (navLogoRect.width - introLogoRect.width) / 2) / mobileScaleFactor;
              const translateY = (navLogoRect.top - introLogoRect.top + (navLogoRect.height - introLogoRect.height) / 2) / mobileScaleFactor;

              // Calculate scale for logo
              const targetScale = navLogoRect.height / introLogoRect.height;

              // Move logo to the top position
              gsap.to(introLogo, {
                x: translateX,
                y: translateY,
                scale: targetScale,
                duration: 1.8,
                ease: "power3.inOut",
                onComplete: function() {
                  // Show the actual navigation logo
                  gsap.to(navLogo, { 
                    opacity: 1,
                    duration: 0.4
                  });

                  // Hide the intro overlay
                  gsap.to(introOverlay, {
                    opacity: 0,
                    duration: 1,
                    delay: 0.1,
                    ease: "power2.out",
                    onComplete: function() {
                      if (introOverlay) introOverlay.style.display = 'none';

                      // Make sure initial section is visible
                      if (sections[0]) sections[0].classList.add('active');

                      // Show accessibility button after intro completes
                      const accessibilityBtn = document.querySelector('.accessibility-btn');
                      if (accessibilityBtn) {
                        accessibilityBtn.classList.add('visible');
                      }

                      // Start main animations
                      animateHeroSection();
                      
                      // FIXED: Mobile gets all content visible immediately + animations
                      if (isMobile) {
                        // Force all mobile content visible immediately
                        setTimeout(() => {
                          const allMobileElements = document.querySelectorAll('.section, .stage-section, .results-section, .contact-section, .vision-content, .stages-content, .stage-content, .results-title, .stats-container, .contact-title, .contact-info, .contact-buttons');
                          allMobileElements.forEach(element => {
                            element.style.opacity = '1';
                            element.style.transform = 'none';
                            element.style.visibility = 'visible';
                            element.classList.add('active');
                          });
                        }, 100);
                        
                        // Then trigger animations for visual effect
                        setTimeout(() => {
                          animateVisionSection();
                        }, 500);
                        setTimeout(() => {
                          animateStagesSection();
                        }, 1000);
                        setTimeout(() => {
                          animateResultsSection();
                        }, 1500);
                        setTimeout(() => {
                          animateContactSection();
                        }, 2000);
                      }
                    }
                  });
                }
              });
            }
          }, 1400);
        }, 1000);
      }, 300);
    }
  }, [sections, currentPage, isMobile]);

  // FIXED: Simplified and optimized animations
  const animateHeroSection = () => {
    gsap.to('.hero-subtitle', {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out"
    });
    
    gsap.to('.hero-title', {
      opacity: 1,
      y: 0,
      duration: 1.1,
      delay: 0.2,
      ease: "power3.out"
    });
    
    gsap.to('.hero-description', {
      opacity: 1,
      y: 0,
      duration: 1.1,
      delay: 0.4,
      ease: "power3.out"
    });
  };

  const animateVisionSection = () => {
    if (isMobile) {
      // Mobile: Just ensure visibility, skip opacity animations
      const visionContent = document.querySelector('.vision-content');
      if (visionContent) {
        visionContent.style.opacity = '1';
        visionContent.style.transform = 'none';
        visionContent.style.visibility = 'visible';
      }
      return;
    }
    
    gsap.to('.vision-content', {
      opacity: 1,
      duration: 1.1,
      ease: "power3.out"
    });
    
    gsap.from('.vision-title, .vision-subtitle', {
      y: 30,
      opacity: 0,
      stagger: 0.2,
      duration: 0.9,
      ease: "power3.out"
    });
  };

  const animateStagesSection = () => {
    if (isMobile) {
      // Mobile: Just ensure visibility, skip opacity animations
      const stagesContent = document.querySelector('.stages-content');
      if (stagesContent) {
        stagesContent.style.opacity = '1';
        stagesContent.style.transform = 'none';
        stagesContent.style.visibility = 'visible';
      }
      return;
    }
    
    gsap.to('.stages-content', {
      opacity: 1,
      duration: 1.1,
      ease: "power3.out"
    });
    
    gsap.from('.stages-title', {
      y: 30,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out"
    });
  };

  const animateStageContent = (stageId) => {
    if (isMobile) {
      // Mobile: Just ensure all stage content is visible
      const allStageContent = document.querySelectorAll('.stage-content');
      allStageContent.forEach(content => {
        content.style.opacity = '1';
        content.style.transform = 'none';
        content.style.visibility = 'visible';
      });
      return;
    }
    
    // Desktop stage content animation
    // Reset other stages
    document.querySelectorAll('.stage-content').forEach(content => {
      if (content.id !== `${stageId}-content`) {
        gsap.to(content, {
          opacity: 0,
          y: 30,
          duration: 0.5,
          ease: "power3.out",
          onComplete: () => {
            gsap.set(content, { visibility: "hidden" });
          }
        });
      }
    });
    
    // Make current content visible
    gsap.set(`#${stageId}-content`, { visibility: "visible" });
    
    // Animate current stage
    gsap.fromTo(`#${stageId}-content`, 
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1.1,
        delay: 0.3,
        ease: "power2.out"
      }
    );
    
    // Hide all graphics
    gsap.set('.identify-graphic, .educate-graphic, .develop-graphic', { 
      opacity: 0,
      visibility: "hidden" 
    });
    
    // Show graphics on desktop only
    if (stageId === 'identify') {
      animateIdentifyGraphic();
    } else if (stageId === 'educate') {
      animateEducateGraphic();
    } else if (stageId === 'develop') {
      animateDevelopGraphic();
    }
  };

  const animateIdentifyGraphic = () => {
    if (isMobile) return;
    
    gsap.set('.identify-graphic', { 
      visibility: "visible",
      opacity: 0 
    });
    
    gsap.to('.identify-graphic', {
      opacity: 1,
      duration: 1.3,
      delay: 0.4,
      ease: "power2.out"
    });
    
    gsap.fromTo('.identify-circle', 
      { scale: 0.9, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1.6,
        ease: "elastic.out(1, 0.7)"
      }
    );
    
    gsap.fromTo('.identify-inner', 
      { scale: 0.7, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1.6,
        delay: 0.2,
        ease: "elastic.out(1, 0.7)"
      }
    );
    
    gsap.to('.identify-circle', {
      rotation: 360,
      transformOrigin: "50% 50%",
      duration: 60,
      repeat: -1,
      ease: "none",
      delay: 1.5
    });
    
    gsap.to('.identify-inner', {
      rotation: -360,
      transformOrigin: "50% 50%",
      duration: 40,
      repeat: -1,
      ease: "none",
      delay: 1.5
    });
  };

  const animateEducateGraphic = () => {
    if (isMobile) return;
    
    gsap.set('.educate-graphic', { 
      visibility: "visible",
      opacity: 0 
    });
    
    gsap.to('.educate-graphic', {
      opacity: 1,
      duration: 1.1,
      delay: 0.4,
      ease: "power2.out"
    });
    
    gsap.set('.edu-circle', { 
      scale: 0,
      opacity: 0
    });
    
    gsap.to('.edu-circle', {
      scale: 1,
      opacity: 1,
      stagger: 0.15,
      duration: 0.9,
      delay: 0.6,
      ease: "back.out(1.7)"
    });
    
    gsap.to('.edu-circle', {
      scale: 1.1,
      duration: 2.2,
      repeat: -1,
      yoyo: true,
      stagger: 0.3,
      ease: "sine.inOut",
      delay: 1.5
    });
  };

  const animateDevelopGraphic = () => {
    if (isMobile) return;
    
    gsap.set('.develop-graphic', { 
      visibility: "visible",
      opacity: 0 
    });
    
    gsap.to('.develop-graphic', {
      opacity: 1,
      duration: 1.1,
      delay: 0.4,
      ease: "power2.out"
    });
    
    gsap.set('.dev-square', { 
      opacity: 0,
      scale: 0,
      rotation: -15
    });
    
    gsap.to('.dev-square', {
      opacity: 1,
      scale: 1,
      rotation: 0,
      stagger: 0.15,
      duration: 0.9,
      delay: 0.6,
      ease: "elastic.out(1, 0.7)"
    });
    
    gsap.to('.dev-square', {
      y: -8,
      rotation: 5,
      duration: 2.8,
      repeat: -1,
      yoyo: true,
      stagger: 0.4,
      ease: "sine.inOut",
      delay: 1.5
    });
  };

  const animateResultsSection = () => {
    if (isMobile) {
      // Mobile: Just ensure visibility, skip opacity animations
      const elements = document.querySelectorAll('.results-title, .stats-container, .stat-item');
      elements.forEach(element => {
        element.style.opacity = '1';
        element.style.transform = 'none';
        element.style.visibility = 'visible';
      });
      
      // Still run counters animation on mobile
      const statElements = document.querySelectorAll('.stat-number');
      statElements.forEach(statElement => {
        const value = statElement.innerText;
        let start = 0;
        const end = parseInt(value.replace(/[^\d]/g, ''));
        const plus = value.includes('+') ? '+' : '';
        
        const counter = { value: start };
        gsap.to(counter, {
          value: end,
          duration: 2.2,
          delay: 0.5,
          ease: "power2.out",
          onUpdate: function() {
            statElement.innerText = Math.floor(counter.value) + plus;
          }
        });
      });
      return;
    }
    
    gsap.to('.results-title', {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out"
    });
    
    gsap.to('.stats-container', {
      opacity: 1,
      duration: 0.9,
      ease: "power3.out",
      delay: 0.3
    });
    
    gsap.to('.stat-item', {
      y: 0,
      stagger: 0.15,
      duration: 0.9,
      ease: "power3.out",
      delay: 0.3
    });
    
    // Counters animation
    const statElements = document.querySelectorAll('.stat-number');
    statElements.forEach(statElement => {
      const value = statElement.innerText;
      let start = 0;
      const end = parseInt(value.replace(/[^\d]/g, ''));
      const plus = value.includes('+') ? '+' : '';
      
      const counter = { value: start };
      gsap.to(counter, {
        value: end,
        duration: 2.2,
        delay: 0.5,
        ease: "power2.out",
        onUpdate: function() {
          statElement.innerText = Math.floor(counter.value) + plus;
        }
      });
    });
  };

  const animateContactSection = () => {
    if (isMobile) {
      // Mobile: Just ensure visibility, skip opacity animations
      const elements = document.querySelectorAll('.contact-title, .contact-info, .contact-buttons');
      elements.forEach(element => {
        element.style.opacity = '1';
        element.style.transform = 'none';
        element.style.visibility = 'visible';
      });
      return;
    }
    
    gsap.to('.contact-title, .contact-info, .contact-buttons', {
      opacity: 1,
      y: 0,
      stagger: 0.15,
      duration: 0.9,
      ease: "power3.out"
    });
  };

  // Update active pagination dot
  const updateActiveDot = (index) => {
    paginationDots.forEach((dot, i) => {
      if (i === index) {
        dot.classList.add('active');
        dot.setAttribute('aria-current', 'true');
        dot.setAttribute('aria-pressed', 'true');
      } else {
        dot.classList.remove('active');
        dot.setAttribute('aria-current', 'false');
        dot.setAttribute('aria-pressed', 'false');
      }
    });
  };

  // FIXED: Desktop-only scroll to section (mobile uses normal scrolling)
  const scrollToSection = (index) => {
    // FIXED: Mobile uses normal scrolling - no custom section handling
    if (isMobile) {
      return; // Let mobile use natural browser scrolling
    }
    
    if (index >= 0 && index < sections.length) {
      setCurrentSectionIndex(index);
      
      const section = sections[index];
      
      // Hide other sections (desktop only)
      sections.forEach(s => s.classList.remove('active'));
      
      // Update active dot (desktop only)
      updateActiveDot(index);
      
      // Announce section change to screen readers
      const sectionTitles = ['דף בית', 'החזון שלנו', 'השלבים המרכזיים', 'שלב זהות', 'שלב חינוך', 'שלב פיתוח', 'התוצאות שלנו', 'צור קשר'];
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.className = 'sr-only';
      announcement.textContent = `עברת לחלק: ${sectionTitles[index] || 'לא ידוע'}`;
      document.body.appendChild(announcement);
      
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
      
      // Desktop: Smooth scrolling behavior
      section.scrollIntoView({ behavior: 'smooth' });
      
      // After a delay, fade in the target section AND THEN animate content
      setTimeout(() => {
        section.classList.add('active');
        
        // FIXED: Animate content AFTER section becomes active
        if (section.id === 'identify' || section.id === 'educate' || section.id === 'develop') {
          animateStageContent(section.id);
        } else if (section.id === 'results') {
          animateResultsSection();
        } else if (section.id === 'contact') {
          animateContactSection();
        } else if (section.id === 'vision') {
          animateVisionSection();
        } else if (section.id === 'stages') {
          animateStagesSection();
        }
      }, 300);
    }
  };

  // Enhanced keyboard navigation (desktop only)
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        return;
      }

      if (isContactDrawerOpen || isAccessibilityDrawerOpen || currentPage !== 'main' || isMobile) {
        return; // Skip keyboard nav on mobile - use natural scrolling
      }

      switch (e.key) {
        case 'ArrowDown':
        case 'PageDown':
          e.preventDefault();
          scrollToSection(currentSectionIndex + 1);
          break;
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          scrollToSection(currentSectionIndex - 1);
          break;
        case 'Home':
          e.preventDefault();
          scrollToSection(0);
          break;
        case 'End':
          e.preventDefault();
          scrollToSection(sections.length - 1);
          break;
        case 'Escape':
          if (isContactDrawerOpen) {
            handleCloseContactDrawer();
          } else if (isAccessibilityDrawerOpen) {
            handleCloseAccessibilityDrawer();
          }
          break;
        default:
          const num = parseInt(e.key);
          if (num >= 1 && num <= 8 && num <= sections.length) {
            e.preventDefault();
            scrollToSection(num - 1);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [currentSectionIndex, sections, isContactDrawerOpen, isAccessibilityDrawerOpen, currentPage, isMobile]);

  // FIXED: Desktop-only wheel event handling (mobile uses natural scrolling)
  const handleWheel = (e) => {
    // Don't handle scroll if drawers are open
    if (isContactDrawerOpen || isAccessibilityDrawerOpen || isHamburgerOpen) {
      return;
    }
    
    // Don't handle scroll if user is interacting with form elements
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
      return;
    }
    
    // Only handle scroll on main page and desktop (mobile uses natural scrolling)
    if (!isMobile) {
      e.preventDefault();
      
      if (!isScrolling) {
        setIsScrolling(true);
        
        // Determine scroll direction
        if (e.deltaY > 0) {
          // Scroll down
          scrollToSection(currentSectionIndex + 1);
        } else {
          // Scroll up
          scrollToSection(currentSectionIndex - 1);
        }
        
        // Reset throttle after 800ms
        setTimeout(() => {
          setIsScrolling(false);
        }, 800);
      }
    }
  };

  // Handle pagination dot click (desktop only)
  const handleDotClick = (index) => {
    if (currentPage === 'main' && !isMobile) {
      scrollToSection(index);
    }
  };

  // Handle keyboard navigation for pagination dots (desktop only)
  const handleDotKeyDown = (e, index) => {
    if (currentPage !== 'main' || isMobile) return;
    
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      scrollToSection(index);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = index > 0 ? index - 1 : paginationDots.length - 1;
      paginationDots[prevIndex]?.focus();
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = index < paginationDots.length - 1 ? index + 1 : 0;
      paginationDots[nextIndex]?.focus();
    }
  };

  // FIXED: Desktop-only event listeners (mobile gets natural scrolling)
  useEffect(() => {
    if (currentPage === 'main' && !isMobile) {
      // Desktop: Only wheel events for snap scrolling
      document.addEventListener('wheel', handleWheel, { passive: false });
      
      return () => {
        document.removeEventListener('wheel', handleWheel);
      };
    }
    // Mobile: NO event listeners - pure natural browser scrolling
  }, [currentSectionIndex, isScrolling, sections, currentPage, isContactDrawerOpen, isAccessibilityDrawerOpen, isHamburgerOpen, isMobile]);

  // Render different pages based on currentPage state
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'about':
        return <AboutPage onNavigateBack={handleBackNavigation} />;
      case 'articles':
        return <ArticlesPage onNavigateBack={handleBackNavigation} />;
      default:
        return renderMainPage();
    }
  };

  const renderMainPage = () => (
    <>
      {/* Background */}
      <div className="new-background">
        <div className="background-logo">
          <img
            src="/lovable-uploads/7c4edd67-efed-4534-af72-d6b32adca96e.png"
            alt="Background Logo"
          />
        </div>
       
        <div className="floating-particles">
          {particleData.map((particle) => (
            <div
              key={particle.id}
              className="floating-particle"
              style={{
                left: particle.left + '%',
                animationDelay: particle.animationDelay + 's',
                animationDuration: particle.animationDuration + 's'
              }}
            />
          ))}
        </div>
        
        <div className="gradient-overlay-1"></div>
        <div className="gradient-overlay-2"></div>
        <div className="gradient-overlay-3"></div>
      </div>
      
      {/* Intro Overlay */}
      <div className="intro-overlay" ref={introOverlayRef}>
        <div className="intro-logo-container" ref={introLogoContainerRef}>
          <div className="intro-text" ref={introTextRef}>
            <img alt="טקסט Upper Floor" src="upperfloor-text.png" />
          </div>
          <div className="intro-logo">
            <img alt="לוגו Upper Floor" src="logo.png" ref={introLogoRef} />
          </div>
        </div>
      </div>
      
      {/* Pagination Dots - hidden on mobile */}
      {!isMobile && (
        <nav className="pagination" role="navigation" aria-label="ניווט בין חלקי האתר">
          <button 
            className="pagination-dot active" 
            onClick={() => handleDotClick(0)} 
            onKeyDown={(e) => handleDotKeyDown(e, 0)}
            aria-label="דף בית"
            aria-current="true"
            aria-pressed="true"
            tabIndex="0"
          ></button>
          <button 
            className="pagination-dot" 
            onClick={() => handleDotClick(1)} 
            onKeyDown={(e) => handleDotKeyDown(e, 1)}
            aria-label="החזון שלנו"
            aria-current="false"
            aria-pressed="false"
            tabIndex="0"
          ></button>
          <button 
            className="pagination-dot" 
            onClick={() => handleDotClick(2)} 
            onKeyDown={(e) => handleDotKeyDown(e, 2)}
            aria-label="השלבים המרכזיים"
            aria-current="false"
            aria-pressed="false"
            tabIndex="0"
          ></button>
          <button 
            className="pagination-dot" 
            onClick={() => handleDotClick(3)} 
            onKeyDown={(e) => handleDotKeyDown(e, 3)}
            aria-label="שלב זהות"
            aria-current="false"
            aria-pressed="false"
            tabIndex="0"
          ></button>
          <button 
            className="pagination-dot" 
            onClick={() => handleDotClick(4)} 
            onKeyDown={(e) => handleDotKeyDown(e, 4)}
            aria-label="שלב חינוך"
            aria-current="false"
            aria-pressed="false"
            tabIndex="0"
          ></button>
          <button 
            className="pagination-dot" 
            onClick={() => handleDotClick(5)} 
            onKeyDown={(e) => handleDotKeyDown(e, 5)}
            aria-label="שלב פיתוח"
            aria-current="false"
            aria-pressed="false"
            tabIndex="0"
          ></button>
          <button 
            className="pagination-dot" 
            onClick={() => handleDotClick(6)} 
            onKeyDown={(e) => handleDotKeyDown(e, 6)}
            aria-label="התוצאות שלנו"
            aria-current="false"
            aria-pressed="false"
            tabIndex="0"
          ></button>
          <button 
            className="pagination-dot" 
            onClick={() => handleDotClick(7)} 
            onKeyDown={(e) => handleDotKeyDown(e, 7)}
            aria-label="צור קשר"
            aria-current="false"
            aria-pressed="false"
            tabIndex="0"
          ></button>
        </nav>
      )}
      
      {/* Main Container */}
      <main className="container" ref={containerRef} id="main-content">
        {/* Hero Section */}
        <section className="section" id="hero" role="banner">
          <div className="hero-content">
            <p className="hero-subtitle">אנחנו לא עוד חברת AI</p>
            <h1 className="hero-title">
              אנחנו מובילים את המהפכה בתעשיות
              <span className="rotating-text" aria-live="polite" aria-atomic="true">
                <span>נדל"ן</span>
                <span>ייעוץ פיננסי</span>
                <span>קמעונאות</span>
                <span>כושר ותזונה</span>
                <span>אירועים</span>
              </span>
              באמצעות עובדי AI מותאמים לעסק שלך
            </h1>
            <p className="hero-description">
             החלום שלכם לשכפל את העובד המצטיין הוא כבר לא חלום.
            </p>
          </div>
        </section>
        
        {/* Vision Section */}
        <section className="section" id="vision">
          <div className="vision-content">
            <h2 className="vision-title">
                 בואו לקחת חלק במהפכת ה-AI<br />
              <span className="highlight">ואנחנו</span> ניקח את העסק שלכם <span className="highlight">לקומה הבאה</span>
            </h2>
            <p className="vision-subtitle">
              "זו לא שאלה של האם תעסיק עובד AI, אלא מתי..."
            </p>
          </div>
        </section>
        
        {/* Core Stages Section */}
        <section className="section" id="stages">
          <div className="stages-content">
            <div className="stages-left">
              <h2 className="stages-title">
                העסק שלך במרחק שלושה שלבים מעובד AI<br />
                <span className="highlight">שסוגר משימות ומייצר תוצאות</span>
              </h2>
            </div>
          </div>
        </section>
        
        {/* Identify Section */}
        <section className="stage-section" id="identify">
          <div className="stage-content" id="identify-content">
            <h2 className="stage-title">זהות עסקית</h2>
            <p className="stage-description">
              אנחנו מנתחים את פעילויות העסק שלך, מזהים הזדמנויות בעלות השפעה גבוהה ומעצבים יחד את עובדי ה-AI המתאימים ביותר לחזון העסקי שלך.
            </p>
          </div>
          {!isMobile && (
            <div className="identify-graphic" aria-hidden="true">
              <div className="identify-circle"></div>
              <div className="identify-inner"></div>
            </div>
          )}
        </section>
        
        {/* Educate Section */}
        <section className="stage-section" id="educate">
          <div className="stage-content" id="educate-content">
            <h2 className="stage-title">פיתוח והכשרה</h2>
            <p className="stage-description">
              לאחר האבחון - צוות המומחים שלנו מפתחים ומעצבים את עובד ה-AI, בהתאמה אישית למשימות והצרכים שלכם.
            </p>
          </div>
          {!isMobile && (
            <div className="educate-graphic" aria-hidden="true">
              <div className="edu-circle"></div>
              <div className="edu-circle"></div>
              <div className="edu-circle"></div>
              <div className="edu-circle"></div>
              <div className="edu-circle"></div>
            </div>
          )}
        </section>
        
        {/* Develop Section */}
        <section className="stage-section" id="develop">
          <div className="stage-content" id="develop-content">
            <h2 className="stage-title">הטמעה ואופטימיזציה</h2>
            <p className="stage-description">
              מרגע קליטת העובד, אנו עוקבים אחרי ביצועים, מודדים תוצאות ומשדרגים את העובד בהתאם לצרכים האישיים שלכם.
            </p>
          </div>
          {!isMobile && (
            <div className="develop-graphic" aria-hidden="true">
              <div className="dev-square"></div>
              <div className="dev-square"></div>
              <div className="dev-square"></div>
              <div className="dev-square"></div>
              <div className="dev-square"></div>
            </div>
          )}
        </section>
        
        {/* Results Section */}
        <section className="results-section" id="results">
          <h2 className="results-title">
            המִּסְפרים שלנו מְסַפרים
          </h2>
          <div className="stats-container">
            <div className="stat-item">
              <div className="stat-number" aria-live="polite">934</div>
              <div className="stat-label"> עסקים שהתקדמו בעזרת AI</div>
            </div>
            <div className="stat-item">
              <div className="stat-number" aria-live="polite">35 </div>
              <div className="stat-label">עובדי AI בשטח</div>
            </div>
            <div className="stat-item">
              <div className="stat-number" aria-live="polite">284 </div>
              <div className="stat-label">פתרונות שהוטמעו עם Upperfloor</div>
            </div>
          </div>
        </section>
        
        {/* Contact Section */}
        <section className="contact-section" id="contact">
          <h2 className="contact-title">
            אנחנו מצפים לעזור <span className="highlight">לעסק שלך</span>
          </h2>
          <div className="contact-info">
            <a className="contact-email" href="mailto:info@upperfloor.ai" aria-label="שלח אימייל ל-Upper Floor">info@upperfloor.ai</a>
          </div>
          <div className="contact-buttons">
            <button className="contact-btn" onClick={handleOpenContactDrawer} aria-label="פתח טופס יצירת קשר">
              צור קשר <span className="arrow" aria-hidden="true">→</span>
            </button>
          </div>
        </section>
      </main>

      {/* Social Media Footer */}
      <footer className="social-footer" role="contentinfo">
        <div className="social-links">
          <a href="https://www.facebook.com/profile.php?id=61575901230962" target="_blank" rel="noopener noreferrer" aria-label="עמוד הפייסבוק של Upper Floor">
            <img src="facebook-icon.png" alt="" className="social-icon" />
          </a>
          <a href="https://www.instagram.com/upperfloor.ai/" target="_blank" rel="noopener noreferrer" aria-label="עמוד האינסטגרם של Upper Floor">
            <img src="instagram-icon1.png" alt="" className="social-icon" />
          </a>
          <a href="https://www.linkedin.com/company/upperfloor-ai/about/" target="_blank" rel="noopener noreferrer" aria-label="עמוד הלינקדאין של Upper Floor">
            <img src="linkedin-icon2.png" alt="" className="social-icon" />
          </a>
        </div>
        <div className="privacy-links">
          <a href="/terms.html" target="_blank" rel="noopener noreferrer">תנאים והגבלות</a>
          <a href="/privacy.html" target="_blank" rel="noopener noreferrer">מדיניות פרטיות</a>
          <a href="/privacy.html" target="_blank" rel="noopener noreferrer">הצהרת נגישות</a>
        </div>
      </footer>
    </>
  );

  return (
    <>
      <style jsx global>{`
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>

      {/* Navigation */}
      <nav className="nav" role="navigation">
        <div className="nav-left">
          <div className="logo" style={{ opacity: currentPage === 'main' ? 0 : 1 }} ref={navLogoRef}>
            <img alt="לוגו Upper Floor" height="40" src="logo.png" />
          </div>
        </div>
        
        <div className="nav-right">
          <button 
            className="hamburger-btn" 
            onClick={handleHamburgerToggle}
            aria-label="פתח תפריט ניווט"
            aria-expanded={isHamburgerOpen}
          >
            <img src="hamburger.jpg" alt="תפריט" className="hamburger-icon" />
          </button>
          
          <button className="contact-btn contact-btn-positioned" onClick={handleOpenContactDrawer} aria-label="פתח טופס יצירת קשר">
            צור קשר <span className="arrow" aria-hidden="true">→</span>
          </button>
        </div>
      </nav>
      
      {/* Hamburger Menu */}
      <HamburgerMenu 
        isOpen={isHamburgerOpen} 
        onClose={() => setIsHamburgerOpen(false)}
        onNavigateToHome={handleNavigateToHome}
        onNavigateToAbout={() => handlePageNavigation('about')}
        onNavigateToArticles={() => handlePageNavigation('articles')}
        currentPage={currentPage}
      />
      
      {/* Accessibility Button */}
      <button 
        className="accessibility-btn" 
        onClick={handleToggleAccessibilityDrawer} 
        aria-label="פתח כלי נגישות"
        aria-expanded={isAccessibilityDrawerOpen}
      >
        <img 
          src="stickman.jpg" 
          alt="סמל נגישות" 
          style={{
            width: '48px',
            height: '48px',
            objectFit: 'contain'
          }}
        />
      </button>
      
      {/* Contact Drawer */}
      <ContactDrawer open={isContactDrawerOpen} onClose={handleCloseContactDrawer} />
      
      {/* FIXED: Accessibility Drawer with persistent state using your existing structure */}
      <AccessibilityDrawer 
        open={isAccessibilityDrawerOpen} 
        onClose={handleCloseAccessibilityDrawer}
        settings={accessibilitySettings}
        onSettingsChange={updateAccessibilitySettings}
      />
      
      {/* Render current page content */}
      {renderCurrentPage()}
    </>
  );
};

export default UpperFloor;