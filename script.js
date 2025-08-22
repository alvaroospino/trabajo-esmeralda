// Emerald Elite - Main JavaScript - Mejorado

class EmeraldElite {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 0;
        this.autoPlayInterval = null;
        this.isLoaded = false;
        this.particles = [];
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragCurrentX = 0;
        
        this.init();
    }

    init() {
        this.showLoadingScreen();
        this.setupEventListeners();
        this.createParticles();
        this.initCarousel();
        this.setupIntersectionObserver();
        this.setupMobileMenu();
        this.setupVideoHandlers();
        
        // Simulate loading time
        setTimeout(() => {
            this.hideLoadingScreen();
        }, 3000);
    }

    // Loading Screen
    showLoadingScreen() {
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.remove('hidden');
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            this.isLoaded = true;
            this.startAutoPlay();
        }
    }

    // Particle System
    createParticles() {
        const container = document.querySelector('.hero-particles');
        if (!container) return;

        const particleCount = window.innerWidth < 768 ? 15 : 30;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random position
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            
            // Random animation delay and duration
            particle.style.animationDelay = Math.random() * 8 + 's';
            particle.style.animationDuration = (Math.random() * 6 + 6) + 's';
            
            container.appendChild(particle);
            this.particles.push(particle);
        }
    }

    // Navigation
    setupEventListeners() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed nav
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Navigation scroll effect
        window.addEventListener('scroll', () => {
            this.handleNavScroll();
            this.handleScrollIndicator();
        });

        // Carousel controls - CORREGIDO
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.previousSlide();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.nextSlide();
            });
        }

        // Carousel indicators - CORREGIDO
        document.querySelectorAll('.indicator').forEach((indicator, index) => {
            indicator.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.goToSlide(index);
            });
        });

        // Pause autoplay on hover
        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => this.pauseAutoPlay());
            carouselContainer.addEventListener('mouseleave', () => this.resumeAutoPlay());
            
            // ELIMINAMOS EL CLICK EN EL CARRUSEL PARA NAVEGAR
            // Solo los botones y indicadores pueden navegar ahora
        }

        // Touch/swipe support for carousel - MEJORADO
        this.setupTouchSupport();

        // Resize handler
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.target.closest('.carousel-container') || e.target.closest('.carousel-indicators')) {
                switch(e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.previousSlide();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.nextSlide();
                        break;
                    case 'Home':
                        e.preventDefault();
                        this.goToSlide(0);
                        break;
                    case 'End':
                        e.preventDefault();
                        this.goToSlide(this.totalSlides - 1);
                        break;
                }
            }
        });
    }

    handleNavScroll() {
        const nav = document.querySelector('.nav');
        if (!nav) return;

        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }

    handleScrollIndicator() {
        const indicator = document.querySelector('.scroll-indicator');
        if (!indicator) return;

        if (window.scrollY > 200) {
            indicator.style.opacity = '0';
        } else {
            indicator.style.opacity = '1';
        }
    }

    // Mobile Menu
    setupMobileMenu() {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const menu = document.querySelector('.mobile-menu');
        const navLinks = document.querySelectorAll('.mobile-nav-link');

        if (!toggle || !menu) return;

        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            menu.classList.toggle('active');
            document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking on links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                menu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!toggle.contains(e.target) && !menu.contains(e.target)) {
                toggle.classList.remove('active');
                menu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Video Handlers
    setupVideoHandlers() {
        const playButtons = document.querySelectorAll('.play-btn');
        const videos = document.querySelectorAll('.emerald-video');

        playButtons.forEach((btn, index) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const video = videos[index];
                if (video) {
                    if (video.paused) {
                        // Pause all other videos
                        videos.forEach(v => {
                            if (v !== video) {
                                v.pause();
                                v.currentTime = 0;
                            }
                        });
                        video.play();
                        btn.style.display = 'none';
                    }
                }
            });
        });

        // Show play button when video ends or is paused
        videos.forEach((video, index) => {
            video.addEventListener('pause', () => {
                playButtons[index].style.display = 'flex';
            });

            video.addEventListener('ended', () => {
                playButtons[index].style.display = 'flex';
                video.currentTime = 0;
            });

            video.addEventListener('play', () => {
                playButtons[index].style.display = 'none';
            });

            // Click on video to pause/play
            video.addEventListener('click', () => {
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
            });
        });
    }

    // Carousel Functionality - MEJORADO
    initCarousel() {
        const slides = document.querySelectorAll('.carousel-slide');
        this.totalSlides = slides.length;
        
        if (this.totalSlides > 0) {
            this.updateCarousel();
        }
    }

    nextSlide() {
        if (this.isDragging) return;
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateCarousel();
    }

    previousSlide() {
        if (this.isDragging) return;
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateCarousel();
    }

    goToSlide(index) {
        if (this.isDragging) return;
        if (index >= 0 && index < this.totalSlides) {
            this.currentSlide = index;
            this.updateCarousel();
        }
    }

    updateCarousel() {
        const track = document.querySelector('.carousel-track');
        const slides = document.querySelectorAll('.carousel-slide');
        const indicators = document.querySelectorAll('.indicator');

        if (!track || slides.length === 0) return;

        // Update track position - CORREGIDO
        const translateX = -this.currentSlide * 25; // 25% porque cada slide ocupa 25% del ancho total
        track.style.transform = `translateX(${translateX}%)`;

        // Update active states
        slides.forEach((slide, index) => {
            if (index === this.currentSlide) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        indicators.forEach((indicator, index) => {
            if (index === this.currentSlide) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }

    startAutoPlay() {
        if (!this.isLoaded || this.totalSlides <= 1) return;
        
        this.pauseAutoPlay(); // Clear any existing interval
        this.autoPlayInterval = setInterval(() => {
            if (!this.isDragging) {
                this.nextSlide();
            }
        }, 6000);
    }

    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    resumeAutoPlay() {
        this.startAutoPlay();
    }

    // Touch Support for Carousel - MEJORADO
    setupTouchSupport() {
        const carousel = document.querySelector('.carousel-container');
        if (!carousel) return;

        let startX = 0;
        let currentX = 0;

        // Touch events
        carousel.addEventListener('touchstart', (e) => {
            // Solo si no es un botón de navegación o indicador
            if (e.target.closest('.nav-btn') || e.target.closest('.indicator')) return;
            
            startX = e.touches[0].clientX;
            this.isDragging = true;
            this.pauseAutoPlay();
        }, { passive: true });

        carousel.addEventListener('touchmove', (e) => {
            if (!this.isDragging) return;
            currentX = e.touches[0].clientX;
            
            // Visual feedback durante el drag
            const diffX = startX - currentX;
            const track = document.querySelector('.carousel-track');
            if (track) {
                const baseTranslate = -this.currentSlide * 25;
                const dragOffset = (diffX / carousel.offsetWidth) * 25;
                track.style.transform = `translateX(${baseTranslate - dragOffset}%)`;
            }
        }, { passive: true });

        carousel.addEventListener('touchend', () => {
            if (!this.isDragging) return;
            
            const diffX = startX - currentX;
            const threshold = 50;
            const track = document.querySelector('.carousel-track');

            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            } else {
                // Return to original position
                this.updateCarousel();
            }
            
            this.isDragging = false;
            this.resumeAutoPlay();
        }, { passive: true });

        // Mouse drag support for desktop - MEJORADO
        let isMouseDown = false;
        
        carousel.addEventListener('mousedown', (e) => {
            // Solo si no es un botón de navegación o indicador
            if (e.target.closest('.nav-btn') || e.target.closest('.indicator') || e.target.closest('.slide-cta')) return;
            
            startX = e.clientX;
            isMouseDown = true;
            this.isDragging = true;
            carousel.style.cursor = 'grabbing';
            this.pauseAutoPlay();
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isMouseDown || !this.isDragging) return;
            currentX = e.clientX;
            
            // Visual feedback durante el drag
            const diffX = startX - currentX;
            const track = document.querySelector('.carousel-track');
            if (track) {
                const baseTranslate = -this.currentSlide * 25;
                const dragOffset = (diffX / carousel.offsetWidth) * 25;
                track.style.transform = `translateX(${baseTranslate - dragOffset}%)`;
            }
            e.preventDefault();
        });

        document.addEventListener('mouseup', () => {
            if (!isMouseDown) return;
            
            const diffX = startX - currentX;
            const threshold = 50;

            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            } else {
                // Return to original position
                this.updateCarousel();
            }
            
            isMouseDown = false;
            this.isDragging = false;
            carousel.style.cursor = 'grab';
            this.resumeAutoPlay();
        });

        // Prevent context menu on long press
        carousel.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    // Intersection Observer for Animations
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Unobserve after animation is done
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const elementsToAnimate = document.querySelectorAll(
            '.section-header, .featured-card, .contact-card, .video-card, .about-grid'
        );
        elementsToAnimate.forEach(element => {
            observer.observe(element);
        });
    }

    // Handle Window Resize
    handleResize() {
        // Recalculate carousel position on resize
        this.updateCarousel();
        
        // Recreate particles if needed
        const particleContainer = document.querySelector('.hero-particles');
        if (particleContainer && this.particles.length > 0) {
            const newParticleCount = window.innerWidth < 768 ? 15 : 30;
            if (Math.abs(this.particles.length - newParticleCount) > 5) {
                particleContainer.innerHTML = '';
                this.particles = [];
                this.createParticles();
            }
        }
    }

    // Enhanced Cursor for desktop
    setupEnhancedCursor() {
        // Only add custom cursor on desktop devices
        if (window.innerWidth < 768) return;

        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, var(--primary-green), transparent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            mix-blend-mode: difference;
            transition: transform 0.1s ease;
            opacity: 0;
        `;
        document.body.appendChild(cursor);

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
            cursor.style.opacity = '1';
        });

        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
        });

        const interactable = document.querySelectorAll('a, button, .carousel-container, .featured-card, .video-card');
        interactable.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(1.5)';
                cursor.style.background = 'radial-gradient(circle, var(--secondary-green), transparent)';
            });
            element.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursor.style.background = 'radial-gradient(circle, var(--primary-green), transparent)';
            });
        });
    }

    // Lazy loading for videos
    setupLazyLoading() {
        const videoObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const video = entry.target;
                    if (video.dataset.src) {
                        video.src = video.dataset.src;
                        video.load();
                        observer.unobserve(video);
                    }
                }
            });
        });

        const lazyVideos = document.querySelectorAll('video[data-src]');
        lazyVideos.forEach(video => {
            videoObserver.observe(video);
        });
    }

    // Performance optimization
    optimizePerformance() {
        // Reduce motion for users who prefer it
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            const animatedElements = document.querySelectorAll('[class*="animation"], [class*="transition"]');
            animatedElements.forEach(element => {
                element.style.animation = 'none';
                element.style.transition = 'none';
            });
            this.pauseAutoPlay(); // Disable carousel autoplay
        }

        // Optimize particles based on device performance
        if (navigator.hardwareConcurrency <= 2) {
            const particleContainer = document.querySelector('.hero-particles');
            if (particleContainer) {
                particleContainer.innerHTML = '';
                this.particles = [];
            }
        }
    }

    // Error handling
    handleErrors() {
        window.addEventListener('error', (e) => {
            console.warn('Non-critical error:', e.error?.message || 'Unknown error');
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.warn('Promise rejection:', e.reason);
            e.preventDefault(); // Prevent default browser error handling
        });
    }

    // Initialize all features
    initializeAllFeatures() {
        this.setupEnhancedCursor();
        this.setupLazyLoading();
        this.optimizePerformance();
        this.handleErrors();
        
        // Add loading states
        this.addLoadingStates();
        
        // Performance monitoring
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData && perfData.loadEventEnd > 0) {
                        const loadTime = Math.round(perfData.loadEventEnd - perfData.fetchStart);
                        console.log(`Page loaded in ${loadTime}ms`);
                    }
                }, 0);
            });
        }
    }

    // Add loading states for better UX
    addLoadingStates() {
        const videos = document.querySelectorAll('.emerald-video');
        videos.forEach(video => {
            video.addEventListener('loadstart', () => {
                const container = video.closest('.video-container');
                if (container) {
                    container.classList.add('loading');
                }
            });

            video.addEventListener('canplay', () => {
                const container = video.closest('.video-container');
                if (container) {
                    container.classList.remove('loading');
                }
            });
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const emeraldElite = new EmeraldElite();
    
    // Initialize additional features after main load
    window.addEventListener('load', () => {
        emeraldElite.initializeAllFeatures();
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        // Handle navigation state if needed
    });
});

// Service Worker Registration (for PWA support)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered successfully');
            })
            .catch((registrationError) => {
                console.log('SW registration failed:', registrationError);
            });
    });
}

// Additional utility functions
class EmeraldUtils {
    // Smooth scroll to element
    static scrollToElement(elementId, offset = 80) {
        const element = document.getElementById(elementId);
        if (element) {
            const elementPosition = element.offsetTop - offset;
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    }

    // Format number with commas
    static formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // Debounce function for performance
    static debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    // Throttle function for scroll events
    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Check if element is in viewport
    static isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Get device type
    static getDeviceType() {
        const ua = navigator.userAgent;
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            return "tablet";
        }
        if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
            return "mobile";
        }
        return "desktop";
    }

    // Preload images
    static preloadImages(imageUrls) {
        imageUrls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }

    // Copy text to clipboard
    static async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                document.body.removeChild(textArea);
                return true;
            } catch (err) {
                document.body.removeChild(textArea);
                return false;
            }
        }
    }
}

// Analytics and tracking (placeholder)
class EmeraldAnalytics {
    static track(event, data = {}) {
        // Implement your analytics tracking here
        console.log('Analytics Event:', event, data);
        
        // Example: Google Analytics 4
        // gtag('event', event, data);
        
        // Example: Custom analytics
        // analytics.track(event, data);
    }

    static trackPageView(page) {
        this.track('page_view', { page });
    }

    static trackCarouselInteraction(action, slideIndex) {
        this.track('carousel_interaction', {
            action,
            slide_index: slideIndex
        });
    }

    static trackVideoPlay(videoTitle) {
        this.track('video_play', {
            video_title: videoTitle
        });
    }

    static trackContactAction(action) {
        this.track('contact_action', { action });
    }
}


// Enhanced carousel with analytics
class EnhancedCarousel extends EmeraldElite {
    nextSlide() {
        super.nextSlide();
        EmeraldAnalytics.trackCarouselInteraction('next', this.currentSlide);
    }

    previousSlide() {
        super.previousSlide();
        EmeraldAnalytics.trackCarouselInteraction('previous', this.currentSlide);
    }

    goToSlide(index) {
        super.goToSlide(index);
        EmeraldAnalytics.trackCarouselInteraction('goto', index);
    }
}

// Global error handling
window.addEventListener('error', (e) => {
    console.warn('Global error caught:', e.error?.message || 'Unknown error');
});

window.addEventListener('unhandledrejection', (e) => {
    console.warn('Unhandled promise rejection:', e.reason);
    e.preventDefault();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EmeraldElite, EmeraldUtils, EmeraldAnalytics };
}

// Global utilities
window.EmeraldUtils = EmeraldUtils;
window.EmeraldAnalytics = EmeraldAnalytics;