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
        this.setupGalleryScroll(); // Added for premium gallery
        this.setupAllVideoPlayers();
        
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
            
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            
            particle.style.animationDelay = Math.random() * 8 + 's';
            particle.style.animationDuration = (Math.random() * 6 + 6) + 's';
            
            container.appendChild(particle);
            this.particles.push(particle);
        }
    }

    // Navigation
    setupEventListeners() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        window.addEventListener('scroll', () => {
            this.handleNavScroll();
            this.handleScrollIndicator();
        });

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

        document.querySelectorAll('.indicator').forEach((indicator, index) => {
            indicator.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.goToSlide(index);
            });
        });

        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => this.pauseAutoPlay());
            carouselContainer.addEventListener('mouseleave', () => this.resumeAutoPlay());
        }

        this.setupTouchSupport();

        window.addEventListener('resize', () => {
            this.handleResize();
        });

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

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                menu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        document.addEventListener('click', (e) => {
            if (!toggle.contains(e.target) && !menu.contains(e.target)) {
                toggle.classList.remove('active');
                menu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // CONSOLIDATED Video Handlers
    _handleVideoPlay(video, allVideos) {
        if (video.paused) {
            allVideos.forEach(v => {
                if (v !== video) {
                    v.pause();
                    if(v.closest('.gallery-card')) v.closest('.gallery-card').classList.remove('playing');
                }
            });
            video.play();
            if(video.closest('.gallery-card')) video.closest('.gallery-card').classList.add('playing');
        } else {
            video.pause();
             if(video.closest('.gallery-card')) video.closest('.gallery-card').classList.remove('playing');
        }
    }
// Video Handlers Unificados
    setupAllVideoPlayers() {
        const allVideos = document.querySelectorAll('.emerald-video, .gallery-video');
        const videoContainers = document.querySelectorAll('.gallery-card');

        videoContainers.forEach(container => {
            const video = container.querySelector('.gallery-video');
            if (!video) return;

            // Función para manejar la reproducción/pausa
            const togglePlay = (e) => {
                // Evita que el video se active si se hace clic en un botón de acción
                if (e.target.closest('.gallery-action')) {
                    return;
                }
                e.preventDefault();
                e.stopPropagation();
                this._handleVideoPlay(video, allVideos);
            };

            // Asigna el evento al contenedor principal para asegurar la captura del clic
            container.addEventListener('click', togglePlay);

            // Gestiona las clases y el estado visual del video
            video.addEventListener('play', () => {
                container.classList.add('playing');
            });

            video.addEventListener('pause', () => {
                container.classList.remove('playing');
            });

            video.addEventListener('ended', () => {
                container.classList.remove('playing');
                video.currentTime = 0; // Reinicia el video al terminar
            });
        });

        // Este código es para los otros videos que puedas tener con la clase .play-btn
        // Lo mantenemos por si lo usas en otras secciones.
        const playButtons = document.querySelectorAll('.play-btn');
        const regularVideos = document.querySelectorAll('.emerald-video');
        playButtons.forEach((btn, index) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const video = regularVideos[index];
                if (video) {
                   this._handleVideoPlay(video, allVideos);
                }
            });
        });

         regularVideos.forEach((video, index) => {
            video.addEventListener('pause', () => {
                if(playButtons[index]) playButtons[index].style.display = 'flex';
            });

            video.addEventListener('ended', () => {
                if(playButtons[index]) playButtons[index].style.display = 'flex';
                video.currentTime = 0;
            });

            video.addEventListener('play', () => {
                 if(playButtons[index]) playButtons[index].style.display = 'none';
            });

            video.addEventListener('click', () => {
                this._handleVideoPlay(video, allVideos);
            });
        });
    }

    // Premium Gallery Scroll
    setupGalleryScroll() {
        const leftScroller = document.querySelector('.scroll-indicator.scroll-left');
        const rightScroller = document.querySelector('.scroll-indicator.scroll-right');
        const gallery = document.getElementById('premiumGallery');

        if (!gallery) return;

        const scrollAmount = 370;

        if (leftScroller) {
            leftScroller.addEventListener('click', () => {
                gallery.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            });
        }
        if (rightScroller) {
            rightScroller.addEventListener('click', () => {
                gallery.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            });
        }
    }

    // Carousel Functionality
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

        const translateX = -this.currentSlide * (100 / this.totalSlides);
        track.style.transform = `translateX(${translateX}%)`;

        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });

        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
    }

    startAutoPlay() {
        if (!this.isLoaded || this.totalSlides <= 1) return;
        
        this.pauseAutoPlay();
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

    // Touch Support for Carousel
    setupTouchSupport() {
        const carousel = document.querySelector('.carousel-container');
        if (!carousel) return;

        let startX = 0;
        let currentX = 0;

        carousel.addEventListener('touchstart', (e) => {
            if (e.target.closest('.nav-btn') || e.target.closest('.indicator')) return;
            
            startX = e.touches[0].clientX;
            this.isDragging = true;
            this.pauseAutoPlay();
        }, { passive: true });

        carousel.addEventListener('touchmove', (e) => {
            if (!this.isDragging) return;
            currentX = e.touches[0].clientX;
            
            const diffX = startX - currentX;
            const track = document.querySelector('.carousel-track');
            if (track) {
                const baseTranslate = -this.currentSlide * (100 / this.totalSlides);
                const dragOffset = (diffX / carousel.offsetWidth) * (100 / this.totalSlides);
                track.style.transition = 'none'; // Disable transition for smooth dragging
                track.style.transform = `translateX(${baseTranslate - dragOffset}%)`;
            }
        }, { passive: true });

        carousel.addEventListener('touchend', () => {
            if (!this.isDragging) return;
            
            const track = document.querySelector('.carousel-track');
            if(track) track.style.transition = ''; // Re-enable transition

            const diffX = startX - currentX;
            const threshold = 50;

            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            } else {
                this.updateCarousel();
            }
            
            this.isDragging = false;
            this.resumeAutoPlay();
        }, { passive: true });

        let isMouseDown = false;
        
        carousel.addEventListener('mousedown', (e) => {
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
            
            const diffX = startX - currentX;
            const track = document.querySelector('.carousel-track');
            if (track) {
                const baseTranslate = -this.currentSlide * (100 / this.totalSlides);
                const dragOffset = (diffX / carousel.offsetWidth) * (100 / this.totalSlides);
                track.style.transition = 'none';
                track.style.transform = `translateX(${baseTranslate - dragOffset}%)`;
            }
            e.preventDefault();
        });

        document.addEventListener('mouseup', () => {
            if (!isMouseDown) return;

            const track = document.querySelector('.carousel-track');
            if(track) track.style.transition = '';
            
            const diffX = startX - currentX;
            const threshold = 50;

            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            } else {
                this.updateCarousel();
            }
            
            isMouseDown = false;
            this.isDragging = false;
            carousel.style.cursor = 'grab';
            this.resumeAutoPlay();
        });

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
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const elementsToAnimate = document.querySelectorAll(
            '.section-header, .gallery-card, .contact-card, .video-card, .about-grid'
        );
        elementsToAnimate.forEach(element => {
            observer.observe(element);
        });
    }

    // Handle Window Resize
    handleResize() {
        this.updateCarousel();
        
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
}

// Analytics and tracking (placeholder)
class EmeraldAnalytics {
    static track(event, data = {}) {
        console.log('Analytics Event:', event, data);
    }

    static trackCarouselInteraction(action, slideIndex) {
        this.track('carousel_interaction', {
            action,
            slide_index: slideIndex
        });
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // *** FIX: Instantiate the EnhancedCarousel to enable analytics ***
    const emeraldElite = new EnhancedCarousel();
});