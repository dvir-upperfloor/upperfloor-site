import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ContactDrawer from './ContactDrawer';
import AccessibilityDrawer from './AccessibilityDrawer';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const UpperFloor = () => {
  // Refs
  const containerRef = useRef(null);
  const introOverlayRef = useRef(null);
  const introLogoRef = useRef(null);
  const introTextRef = useRef(null);
  const navLogoRef = useRef(null);
  const dynamicLightRef = useRef(null);
  const aboutSectionRef = useRef(null);

  // State
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [sections, setSections] = useState([]);
  const [paginationDots, setPaginationDots] = useState([]);
  const [isAboutSectionActive, setIsAboutSectionActive] = useState(false);
  const [isContactDrawerOpen, setIsContactDrawerOpen] = useState(false);
  const [isAccessibilityDrawerOpen, setIsAccessibilityDrawerOpen] = useState(false);
  const [keyboardNavigation, setKeyboardNavigation] = useState(false);

  // Initialize sections and pagination
  useEffect(() => {
    // Get all sections
    const allSections = Array.from(document.querySelectorAll('.section, .stage-section, .results-section, .about-section, .contact-section'));
    setSections(allSections);

    // Get pagination dots
    const dots = document.querySelectorAll('.pagination-dot');
    setPaginationDots(Array.from(dots));

    // Initialize with first section active
    if (allSections.length > 0) {
      allSections[0].classList.add('active');
    }
    
    // Set about section ref
    aboutSectionRef.current = document.getElementById('about');
  }, []);

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

  // Handle opening the contact drawer
  const handleOpenContactDrawer = (e) => {
    e.preventDefault();
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

  // Enhanced water-like shimmer effects creation with rising droplets
  const createAdvancedWaterShimmerEffects = () => {
    const body = document.querySelector('body');
    
    // Create the amazing rising droplets effect (recreating your original bug!)
    const createRisingDroplets = () => {
      // Only 6 droplets - like in your original bug
      for (let i = 0; i < 6; i++) {
        setTimeout(() => {
          const droplet = document.createElement('div');
          droplet.className = 'rising-droplet-simple';
          
          // Random position across screen width (not at edges)
          const startX = 50 + Math.random() * (window.innerWidth - 100); // Stay away from edges
          const size = 3 + Math.random() * 2; // 3-5px
          
          droplet.style.cssText = `
            position: fixed;
            left: ${startX}px;
            bottom: -20px;
            width: ${size}px;
            height: ${size}px;
            background: rgba(56, 189, 248, 0.6);
            border-radius: 50%;
            z-index: -1;
            pointer-events: none;
            filter: blur(0.5px);
          `;
          
          body.appendChild(droplet);
          
          // Simple GSAP animation - just like your bug
          gsap.to(droplet, {
            y: -(window.innerHeight + 100),
            x: (Math.random() - 0.5) * 60, // Small horizontal drift
            duration: 25,
            ease: "none",
            onComplete: () => {
              droplet.remove();
              // Respawn after random delay
              setTimeout(() => createSingleDroplet(), Math.random() * 20000);
            }
          });
        }, i * 4000); // Stagger initial spawns every 4 seconds
      }
      
      // Function to create individual droplets after initial batch
      const createSingleDroplet = () => {
        const droplet = document.createElement('div');
        droplet.className = 'rising-droplet-simple';
        
        const startX = 50 + Math.random() * (window.innerWidth - 100);
        const size = 3 + Math.random() * 2;
        
        droplet.style.cssText = `
          position: fixed;
          left: ${startX}px;
          bottom: -20px;
          width: ${size}px;
          height: ${size}px;
          background: rgba(56, 189, 248, 0.6);
          border-radius: 50%;
          z-index: -1;
          pointer-events: none;
          filter: blur(0.5px);
        `;
        
        body.appendChild(droplet);
        
        gsap.to(droplet, {
          y: -(window.innerHeight + 100),
          x: (Math.random() - 0.5) * 60,
          duration: 25,
          ease: "none",
          onComplete: () => {
            droplet.remove();
            setTimeout(() => createSingleDroplet(), Math.random() * 20000);
          }
        });
      };
    };
    
    // Create water-like floating particles (original effect)
    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('div');
      particle.className = 'water-particle';
      
      // Random positioning across the screen width
      const startX = Math.random() * window.innerWidth;
      const delay = Math.random() * 15; // Random delay up to 15 seconds
      
      particle.style.position = 'fixed';
      particle.style.left = `${startX}px`;
      particle.style.width = '4px';
      particle.style.height = '4px';
      particle.style.background = 'rgba(56, 189, 248, 0.6)';
      particle.style.borderRadius = '50%';
      particle.style.zIndex = '-1';
      particle.style.pointerEvents = 'none';
      particle.style.filter = 'blur(1px)';
      particle.style.animationDelay = `-${delay}s`;
      
      // Vary particle sizes slightly
      const size = 3 + Math.random() * 4; // 3-7px
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      body.appendChild(particle);
      
      // Water particle animation
      gsap.to(particle, {
        y: -window.innerHeight - 100,
        x: (Math.random() - 0.5) * 200,
        rotation: 360,
        scale: 0.5 + Math.random() * 0.5,
        opacity: 0,
        duration: 15 + Math.random() * 10,
        repeat: -1,
        ease: "none",
        delay: delay
      });
    }
    
    // Create multiple subtle shimmer layers with water-like movement
    for (let i = 0; i < 8; i++) {
      const shimmer = document.createElement('div');
      shimmer.className = `water-shimmer water-shimmer-${i}`;
      
      // Random positioning and sizing
      const size = 150 + Math.random() * 300;
      const posX = Math.random() * 120 - 10; // Allow some overflow
      const posY = Math.random() * 120 - 10;
      
      shimmer.style.position = 'fixed';
      shimmer.style.width = `${size}px`;
      shimmer.style.height = `${size}px`;
      shimmer.style.left = `${posX}%`;
      shimmer.style.top = `${posY}%`;
      shimmer.style.borderRadius = '50%';
      shimmer.style.background = `radial-gradient(circle, rgba(56, 189, 248, ${0.003 + Math.random() * 0.007}) 0%, transparent 70%)`;
      shimmer.style.filter = `blur(${20 + Math.random() * 30}px)`;
      shimmer.style.zIndex = '-1';
      shimmer.style.pointerEvents = 'none';
      
      body.appendChild(shimmer);
      
      // Water-like animation with multiple keyframes
      const waterAnimation = gsap.timeline({ repeat: -1 });
      
      waterAnimation.to(shimmer, {
        x: (Math.random() - 0.5) * 80,
        y: (Math.random() - 0.5) * 60,
        scale: 0.7 + (Math.random() * 0.6),
        rotation: Math.random() * 360,
        opacity: 0.001 + (Math.random() * 0.008),
        duration: 8 + (Math.random() * 12),
        ease: "sine.inOut",
        delay: i * 1.5
      }).to(shimmer, {
        x: (Math.random() - 0.5) * 100,
        y: (Math.random() - 0.5) * 80,
        scale: 0.9 + (Math.random() * 0.4),
        rotation: Math.random() * 360,
        opacity: 0.002 + (Math.random() * 0.006),
        duration: 10 + (Math.random() * 8),
        ease: "sine.inOut"
      }).to(shimmer, {
        x: (Math.random() - 0.5) * 70,
        y: (Math.random() - 0.5) * 90,
        scale: 0.6 + (Math.random() * 0.7),
        rotation: Math.random() * 360,
        opacity: 0.003 + (Math.random() * 0.005),
        duration: 12 + (Math.random() * 6),
        ease: "sine.inOut"
      });
    }
    
    // Start the amazing rising droplets effect
    createRisingDroplets();
  };

  // Enhanced professional water-like light effect
  const createProfessionalWaterLightEffect = () => {
    const dynamicLight = dynamicLightRef.current;
    
    if (dynamicLight) {
      // Professional water shimmer function with multiple phases
      function professionalWaterShimmer() {
        if (!dynamicLight) return;
        
        // Create water-like variations
        const phase1Duration = 4 + Math.random() * 3; // 4-7 seconds
        const phase2Duration = 3 + Math.random() * 4; // 3-7 seconds
        const phase3Duration = 5 + Math.random() * 2; // 5-7 seconds
        
        // Phase 1: Gentle rise
        gsap.to(dynamicLight, {
          opacity: 0.45 + (Math.random() * 0.1),
          scale: 0.95 + (Math.random() * 0.1),
          rotation: (Math.random() - 0.5) * 3,
          x: (Math.random() - 0.5) * 30,
          y: (Math.random() - 0.5) * 40,
          duration: phase1Duration,
          ease: "sine.inOut",
          onComplete: () => {
            // Phase 2: Flow and ebb
            gsap.to(dynamicLight, {
              opacity: 0.3 + (Math.random() * 0.15),
              scale: 1.05 + (Math.random() * 0.08),
              rotation: (Math.random() - 0.5) * 4,
              x: (Math.random() - 0.5) * 50,
              y: (Math.random() - 0.5) * 35,
              duration: phase2Duration,
              ease: "sine.inOut",
              onComplete: () => {
                // Phase 3: Gentle descent
                gsap.to(dynamicLight, {
                  opacity: 0.5 + (Math.random() * 0.05),
                  scale: 0.98 + (Math.random() * 0.06),
                  rotation: (Math.random() - 0.5) * 2,
                  x: (Math.random() - 0.5) * 25,
                  y: (Math.random() - 0.5) * 45,
                  duration: phase3Duration,
                  ease: "sine.inOut",
                  onComplete: professionalWaterShimmer
                });
              }
            });
          }
        });
      }
      
      // Start professional water shimmer
      professionalWaterShimmer();
      
      // Add subtle pulsing overlay
      const pulseTimeline = gsap.timeline({ repeat: -1 });
      pulseTimeline.to(dynamicLight, {
        filter: "blur(45px) brightness(1.1)",
        duration: 6,
        ease: "sine.inOut"
      }).to(dynamicLight, {
        filter: "blur(55px) brightness(0.9)",
        duration: 8,
        ease: "sine.inOut"
      }).to(dynamicLight, {
        filter: "blur(50px) brightness(1)",
        duration: 4,
        ease: "sine.inOut"
      });
    }
  };

  // Intro animation on initial load
  useEffect(() => {
    const introOverlay = introOverlayRef.current;
    const introLogo = introLogoRef.current;
    const introText = introTextRef.current;
    const navLogo = navLogoRef.current;

    playIntroAnimation();

    function playIntroAnimation() {
      setTimeout(() => {
        // 1. First, fade in ONLY the logo with subtle shimmer
        gsap.to(introLogo, {
          opacity: 1,
          duration: 1.2,
          ease: "power2.out",
          // Add subtle glow effect during fade in
          onStart: () => {
            if (introLogo) {
              introLogo.style.filter = 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.1))';
            }
          }
        });

        // 2. After logo is visible, have text emerge from it with enhanced effect
        setTimeout(() => {
          // Animate text sliding out with glow
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

          // 3. Wait, then continue with enhanced animation sequence
          setTimeout(() => {
            // Fade out the text with shimmer effect
            gsap.to(introText, {
              opacity: 0,
              duration: 0.8,
              ease: "power2.in",
              onStart: () => {
                if (introText) {
                  introText.style.filter = 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.05))';
                }
              }
            });

            // Get exact nav logo position for proper animation
            if (navLogo && introLogo) {
              const navLogoRect = navLogo.getBoundingClientRect();
              const introLogoRect = introLogo.getBoundingClientRect();

              // Calculate exact translation needed
              const translateX = navLogoRect.left - introLogoRect.left + (navLogoRect.width - introLogoRect.width) / 2;
              const translateY = navLogoRect.top - introLogoRect.top + (navLogoRect.height - introLogoRect.height) / 2;

              // Calculate scale for logo
              const targetScale = navLogoRect.height / introLogoRect.height;

              // Move logo to the top position with enhanced effects
              gsap.to(introLogo, {
                x: translateX,
                y: translateY,
                scale: targetScale,
                duration: 1.8,
                ease: "power3.inOut",
                onStart: () => {
                  if (introLogo) {
                    introLogo.style.filter = 'drop-shadow(0 0 25px rgba(255, 255, 255, 0.15))';
                  }
                },
                onComplete: function() {
                  // Show the actual navigation logo with subtle glow
                  gsap.to(navLogo, { 
                    opacity: 1,
                    duration: 0.4,
                    onStart: () => {
                      if (navLogo) {
                        navLogo.style.filter = 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.05))';
                      }
                    }
                  });

                  // Hide the intro overlay with fade and shimmer
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

                      // Start main animations with water effects
                      createAdvancedWaterShimmerEffects();
                      animateHeroSection();
                      createProfessionalWaterLightEffect();
                    }
                  });
                }
              });
            }
          }, 1400);
        }, 1000);
      }, 300);
    }
  }, [sections]);

  // Animation functions
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
    
    // Animate specific graphic
    if (stageId === 'identify') {
      animateIdentifyGraphic();
    } else if (stageId === 'educate') {
      animateEducateGraphic();
    } else if (stageId === 'develop') {
      animateDevelopGraphic();
    }
  };

  const animateIdentifyGraphic = () => {
    // Make graphic visible
    gsap.set('.identify-graphic', { 
      visibility: "visible",
      opacity: 0 
    });
    
    // Fade in
    gsap.to('.identify-graphic', {
      opacity: 1,
      duration: 1.3,
      delay: 0.4,
      ease: "power2.out"
    });
    
    // Animate elements with enhanced effects
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
    
    // Enhanced rotation with subtle glow effect
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
    // Make graphic visible
    gsap.set('.educate-graphic', { 
      visibility: "visible",
      opacity: 0 
    });
    
    // Fade in
    gsap.to('.educate-graphic', {
      opacity: 1,
      duration: 1.1,
      delay: 0.4,
      ease: "power2.out"
    });
    
    // Reset circles
    gsap.set('.edu-circle', { 
      scale: 0,
      opacity: 0
    });
    
    // Enhanced staggered appearance
    gsap.to('.edu-circle', {
      scale: 1,
      opacity: 1,
      stagger: 0.15,
      duration: 0.9,
      delay: 0.6,
      ease: "back.out(1.7)"
    });
    
    // Enhanced pulsing with subtle glow
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
    // Make graphic visible
    gsap.set('.develop-graphic', { 
      visibility: "visible",
      opacity: 0 
    });
    
    // Fade in
    gsap.to('.develop-graphic', {
      opacity: 1,
      duration: 1.1,
      delay: 0.4,
      ease: "power2.out"
    });
    
    // Reset squares
    gsap.set('.dev-square', { 
      opacity: 0,
      scale: 0,
      rotation: -15
    });
    
    // Enhanced staggered appearance
    gsap.to('.dev-square', {
      opacity: 1,
      scale: 1,
      rotation: 0,
      stagger: 0.15,
      duration: 0.9,
      delay: 0.6,
      ease: "elastic.out(1, 0.7)"
    });
    
    // Enhanced hover animation
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
    
    // Enhanced counters animation
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

  const animateAboutSection = () => {
    gsap.to('.about-title', {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out"
    });
    
    gsap.to('.team-container', {
      opacity: 1,
      duration: 0.9,
      ease: "power3.out",
      delay: 0.3
    });
    
    gsap.to('.team-member', {
      y: 0,
      opacity: 1,
      stagger: 0.3,
      duration: 0.9,
      ease: "power3.out",
      delay: 0.3
    });
    
    gsap.to('.quote-container', {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      delay: 0.8
    });
    
    setIsAboutSectionActive(true);
  };

  const animateContactSection = () => {
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
        // Update ARIA for screen readers
        dot.setAttribute('aria-current', 'true');
        dot.setAttribute('aria-pressed', 'true');
      } else {
        dot.classList.remove('active');
        dot.setAttribute('aria-current', 'false');
        dot.setAttribute('aria-pressed', 'false');
      }
    });
  };

  // Scroll to section with smooth easing
  const scrollToSection = (index) => {
    if (index >= 0 && index < sections.length) {
      setCurrentSectionIndex(index);
      
      const section = sections[index];
      
      // Hide other sections
      sections.forEach(s => s.classList.remove('active'));
      
      // Scroll to section
      section.scrollIntoView({ behavior: 'smooth' });
      
      // Update active dot
      updateActiveDot(index);
      
      // Announce section change to screen readers
      const sectionTitles = ['דף בית', 'החזון שלנו', 'השלבים המרכזיים', 'שלב זהות', 'שלב חינוך', 'שלב פיתוח', 'התוצאות שלנו', 'מי אנחנו', 'צור קשר'];
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.className = 'sr-only';
      announcement.textContent = `עברת לחלק: ${sectionTitles[index] || 'לא ידוע'}`;
      document.body.appendChild(announcement);
      
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
      
      // After a delay, fade in the target section
      setTimeout(() => {
        section.classList.add('active');
      }, 300);
      
      // Animate specific section content
      if (section.id === 'identify' || section.id === 'educate' || section.id === 'develop') {
        animateStageContent(section.id);
      } else if (section.id === 'results') {
        animateResultsSection();
      } else if (section.id === 'about') {
        animateAboutSection();
      } else if (section.id === 'contact') {
        animateContactSection();
      } else if (section.id === 'vision') {
        animateVisionSection();
      } else if (section.id === 'stages') {
        animateStagesSection();
      }
      
      // Set about section state
      setIsAboutSectionActive(section.id === 'about');
    }
  };

  // Enhanced keyboard navigation
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Skip if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        return;
      }

      // Skip if a drawer is open
      if (isContactDrawerOpen || isAccessibilityDrawerOpen) {
        return;
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
          // Number keys 1-9 for direct section navigation
          const num = parseInt(e.key);
          if (num >= 1 && num <= 9 && num <= sections.length) {
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
  }, [currentSectionIndex, sections, isContactDrawerOpen, isAccessibilityDrawerOpen]);

  // Check if we should handle scroll or let about section scroll internally on mobile
  const shouldHandleScroll = (e) => {
    // If we're not in the about section, always handle scroll
    if (!isAboutSectionActive) return true;
    
    // Only apply special handling for mobile devices
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) return true;
    
    const aboutSection = aboutSectionRef.current;
    if (!aboutSection) return true;
    
    // Check if about section has scrollable content
    const isScrollable = aboutSection.scrollHeight > aboutSection.clientHeight;
    if (!isScrollable) return true;
    
    // Check if we're at the top of the about section and scrolling up
    if (aboutSection.scrollTop <= 0 && e.deltaY < 0) {
      return true;
    }
    
    // Check if we're at the bottom of the about section and scrolling down
    if (aboutSection.scrollTop + aboutSection.clientHeight >= aboutSection.scrollHeight - 5 && e.deltaY > 0) {
      return true;
    }
    
    // Otherwise, let the about section handle the scroll
    return false;
  };

  // Handle wheel event
  const handleWheel = (e) => {
    // For about section, only prevent default if we need to change sections
    if (shouldHandleScroll(e)) {
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
        
        // Reset throttle after 1000ms
        setTimeout(() => {
          setIsScrolling(false);
        }, 1000);
      }
    }
  };

  // Handle pagination dot click
  const handleDotClick = (index) => {
    scrollToSection(index);
  };

  // Handle keyboard navigation for pagination dots
  const handleDotKeyDown = (e, index) => {
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

  // Handle touch events for mobile
  const [touchStartY, setTouchStartY] = useState(0);
  
  const handleTouchStart = (e) => {
    setTouchStartY(e.touches[0].clientY);
  };
  
  const handleTouchEnd = (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const distance = touchStartY - touchEndY;
    
    if (!isScrolling) {
      setIsScrolling(true);
      
      // Special handling for About section on mobile
      const isMobile = window.innerWidth <= 768;
      if (isAboutSectionActive && isMobile) {
        const aboutSection = aboutSectionRef.current;
        if (aboutSection) {
          // Check if we're at the top or bottom of the about section
          const isAtTop = aboutSection.scrollTop <= 0;
          const isAtBottom = aboutSection.scrollTop + aboutSection.clientHeight >= aboutSection.scrollHeight - 5;
          
          if ((distance > 50 && isAtBottom) || (distance < -50 && isAtTop)) {
            // Only navigate between sections if at the extremes of the content
            scrollToSection(distance > 50 ? currentSectionIndex + 1 : currentSectionIndex - 1);
          }
          // If not at extremes, the natural scrolling will occur
        }
      } else {
        // For all other sections, handle normally
        if (distance > 50) {
          // Swipe up (scroll down)
          scrollToSection(currentSectionIndex + 1);
        } else if (distance < -50) {
          // Swipe down (scroll up)
          scrollToSection(currentSectionIndex - 1);
        }
      }
      
      // Reset throttle
      setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    }
  };

  // Add wheel and touch event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      container.addEventListener('touchstart', handleTouchStart, { passive: true });
      container.addEventListener('touchend', handleTouchEnd, { passive: true });
      
      return () => {
        container.removeEventListener('wheel', handleWheel);
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [currentSectionIndex, isScrolling, sections, isAboutSectionActive]);

  return (
    <>
      {/* Screen reader only class */}
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
        
        /* Water particle animation */
        @keyframes floatingParticles {
          0% { 
            transform: translateY(100vh) translateX(0) scale(0.5) rotate(0deg);
            opacity: 0;
          }
          10% { 
            opacity: 0.3;
            transform: translateY(90vh) translateX(-20px) scale(0.7) rotate(45deg);
          }
          50% { 
            opacity: 0.6;
            transform: translateY(50vh) translateX(-40px) scale(1) rotate(180deg);
          }
          90% { 
            opacity: 0.3;
            transform: translateY(10vh) translateX(-60px) scale(0.8) rotate(315deg);
          }
          100% { 
            transform: translateY(-10vh) translateX(-80px) scale(0.4) rotate(360deg);
            opacity: 0;
          }
        }

        .water-particle {
          position: fixed;
          width: 4px;
          height: 4px;
          background: rgba(56, 189, 248, 0.6);
          border-radius: 50%;
          z-index: -1;
          pointer-events: none;
          filter: blur(1px);
          animation: floatingParticles 15s linear infinite;
        }

        .water-particle:nth-child(odd) {
          animation-delay: -5s;
          background: rgba(30, 144, 255, 0.4);
        }

        .water-particle:nth-child(3n) {
          animation-delay: -10s;
          animation-duration: 18s;
          background: rgba(0, 191, 255, 0.5);
        }

        .water-particle:nth-child(4n) {
          animation-delay: -2s;
          animation-duration: 12s;
          background: rgba(0, 100, 200, 0.3);
        }
      `}</style>

      {/* Background Elements */}
      <div className="background-gradient"></div>
      <div className="dynamic-light" ref={dynamicLightRef}></div>
      <div className="grid-overlay"></div>
      <div className="floating-element floating-1"></div>
      <div className="floating-element floating-2"></div>
      <div className="dust-particles"></div>
      
      {/* Intro Overlay */}
      <div className="intro-overlay" ref={introOverlayRef}>
        <div className="intro-logo-container">
          <div className="intro-text" ref={introTextRef}>
            <img alt="טקסט Upper Floor" src="upperfloor-text.png" />
          </div>
          <div className="intro-logo">
            <img alt="לוגו Upper Floor" src="logo.png" ref={introLogoRef} />
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="nav" role="navigation">
        <div className="logo" style={{ opacity: 0 }} ref={navLogoRef}>
          <img alt="לוגו Upper Floor" height="40" src="logo.png" />
        </div>
        <div className="nav-buttons">
          <button className="contact-btn" onClick={handleOpenContactDrawer} aria-label="פתח טופס יצירת קשר">
            צור קשר <span className="arrow" aria-hidden="true">→</span>
          </button>
        </div>
      </nav>
      
      {/* Left-side Accessibility Button */}
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
      
      {/* Accessibility Drawer */}
      <AccessibilityDrawer open={isAccessibilityDrawerOpen} onClose={handleCloseAccessibilityDrawer} />
      
      {/* Pagination Dots */}
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
          aria-label="מי אנחנו"
          aria-current="false"
          aria-pressed="false"
          tabIndex="0"
        ></button>
        <button 
          className="pagination-dot" 
          onClick={() => handleDotClick(8)} 
          onKeyDown={(e) => handleDotKeyDown(e, 8)}
          aria-label="צור קשר"
          aria-current="false"
          aria-pressed="false"
          tabIndex="0"
        ></button>
      </nav>
      
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
            <h2 className="stage-title" > זהות עסקית</h2>
            <p className="stage-description">
              אנחנו מנתחים את פעילויות העסק שלך, מזהים הזדמנויות בעלות השפעה גבוהה ומעצבים יחד את עובדי ה-AI המתאימים ביותר לחזון העסקי שלך.
            </p>
          </div>
          <div className="identify-graphic" aria-hidden="true">
            <div className="identify-circle"></div>
            <div className="identify-inner"></div>
          </div>
        </section>
        
        {/* Educate Section */}
        <section className="stage-section" id="educate">
          <div className="stage-content" id="educate-content">
            <h2 className="stage-title">פיתוח והכשרה</h2>
            <p className="stage-description">
              לאחר האבחון - צוות המומחים שלנו מפתחים ומעצבים את עובד ה-AI, בהתאמה אישית למשימות והצרכים שלכם.
            </p>
          </div>
          <div className="educate-graphic" aria-hidden="true">
            <div className="edu-circle"></div>
            <div className="edu-circle"></div>
            <div className="edu-circle"></div>
            <div className="edu-circle"></div>
            <div className="edu-circle"></div>
          </div>
        </section>
        
        {/* Develop Section */}
        <section className="stage-section" id="develop">
          <div className="stage-content" id="develop-content">
            <h2 className="stage-title">הטמעה ואופטימיזציה</h2>
            <p className="stage-description">
              מרגע קליטת העובד, אנו עוקבים אחרי ביצועים, מודדים תוצאות ומשדרגים את העובד בהתאם לצרכים האישיים שלכם.
            </p>
          </div>
          <div className="develop-graphic" aria-hidden="true">
            <div className="dev-square"></div>
            <div className="dev-square"></div>
            <div className="dev-square"></div>
            <div className="dev-square"></div>
            <div className="dev-square"></div>
          </div>
        </section>
        
        {/* Results Section */}
        <section className="results-section" id="results">
          <h2 className="results-title">
            המִּסְפרים שלנו מְסַפרים
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
        
        {/* About Section */}
        <section className="about-section" id="about" ref={aboutSectionRef}>
          <div className="about-container">
            <h2 className="about-title">מי אנחנו?</h2>
            
            <div className="team-container">
              {/* Amir Kahana */}
              <article className="team-member">
                <div className="member-image">
                  <img src="amir.jpg" alt="אמיר כהנא, מייסד שותף של Upper Floor" />
                </div>
                <h3 className="member-name">אמיר כהנא</h3>
                <p className="member-title">Co-Founder</p>
                <p className="member-subtitle">מ"פ משוחרר | מומחה לסוכני בינה מלאכותית</p>
                <p className="member-bio">
                  אני מגיע מרקע פיקודי בצה"ל, שם ניהלתי מערכות מורכבות והתמודדתי עם אתגרים תחת לחץ גבוה. את הגישה הזו, של חשיבה מערכתית, עבודה מדויקת והתמקדות בתוצאה, אני מביא איתי לעולם העסקי.
                </p>
                <p className="member-bio">
                  המטרה שלי היא ללוות עסקים וחברות בבניית תהליכים חכמים שמבוססים על טכנולוגיה מתקדמת, יחד עם הבנה עמוקה של הצרכים בשטח, כדי לייצר שיפור אמיתי בתפעול, ברווחיות ובזמן.
                </p>
              </article>
              
              {/* Dvir Mizrachi */}
              <article className="team-member">
                <div className="member-image">
                  <img src="dvir.jpg" alt="דביר מזרחי, מייסד שותף של Upper Floor" />
                </div>
                <h3 className="member-name">דביר מזרחי</h3>
                <p className="member-title">Co-Founder</p>
                <p className="member-subtitle">הנדסאי תוכנה | קצין משוחרר | Full Stack Developer</p>
                <p className="member-bio">
                  בעל רקע טכני נרחב של פיתוח Full-Stack של מגוון פרוייקטים בשפות JAVA, JS, C#, Python.
                </p>
                <p className="member-bio">
                  בנוסף בעל רקע פיקודי מהצבא, למדתי לפתור בעיות, לחשוב במאקרו ולא במיקרו, להאציל סמכויות ולתכנן פרוייקטים עד היסוד.
                </p>
                <p className="member-bio">
                  מתעסק עם כל תחום סוכני הAI ומודלי השפה השונים.
                </p>
                <p className="member-bio">
                  המטרה שלי היא להתאים את הסוכנים שלי כמו כפפה ליד של כל בעל עסק/בעל ארגון באופטימיזציה מלאה.
                </p>
              </article>
            </div>
            
            <div className="quote-container">
              <blockquote className="quote">השאלה היא לא אם תטמיעו סוכנים, אלא מתי ובאיזו איכות.</blockquote>
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
          <a href="/accessibility.html" target="_blank" rel="noopener noreferrer">הצהרת נגישות</a>
        </div>
      </footer>
    </>
  );
};

export default UpperFloor;