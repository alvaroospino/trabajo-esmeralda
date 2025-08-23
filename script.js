// Emerald Elite - Main JavaScript - Mejorado con Galería Visible

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
        this.videoHandler = null;
        
        this.init();
    }

    init() {
        this.showLoadingScreen();
        this.setupEventListeners();
        this.createParticles();
        this.initCarousel();
        this.setupIntersectionObserver();
        this.setupMobileMenu();
        this.setupGalleryScroll();
        this.initVideoHandler(); // Nueva inicialización
        
        // Simulate loading time
        setTimeout(() => {
            this.hideLoadingScreen();
        }, 3000);
    }

    // NUEVO: Inicializar el manejador de videos mejorado
    initVideoHandler() {
        this.videoHandler = new VideoHandler(this);
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
                
                // Pausar videos al navegar
                if (this.videoHandler) {
                    this.videoHandler.stopAllPlayback();
                }
                
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
            this.handleVideoVisibility(); // NUEVO: Manejar visibilidad de videos
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
                    case 'Escape':
                        // Pausar videos con ESC
                        if (this.videoHandler) {
                            this.videoHandler.stopAllPlayback();
                        }
                        break;
                }
            }
        });
    }

    // NUEVO: Manejar visibilidad de videos al hacer scroll
    handleVideoVisibility() {
        if (!this.videoHandler || !this.videoHandler.hasActiveVideo()) return;
        
        const activeVideo = this.videoHandler.getActiveVideo();
        if (!activeVideo) return;
        
        const videoRect = activeVideo.getBoundingClientRect();
        const isInViewport = videoRect.top < window.innerHeight && videoRect.bottom > 0;
        
        // Pausar video si sale del viewport
        if (!isInViewport && !activeVideo.paused) {
            setTimeout(() => {
                this.videoHandler.stopAllPlayback();
            }, 500); // Delay para evitar pausas accidentales
        }
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
                // Pausar videos al navegar en móvil
                if (this.videoHandler) {
                    this.videoHandler.stopAllPlayback();
                }
                
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

    // Premium Gallery Scroll
    setupGalleryScroll() {
        const leftScroller = document.querySelector('.scroll-indicator.scroll-left');
        const rightScroller = document.querySelector('.scroll-indicator.scroll-right');
        const gallery = document.getElementById('premiumGallery');

        if (!gallery) return;

        const scrollAmount = 370;

        if (leftScroller) {
            leftScroller.addEventListener('click', () => {
                // Pausar videos antes de hacer scroll
                if (this.videoHandler) {
                    this.videoHandler.stopAllPlayback();
                }
                gallery.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            });
        }
        if (rightScroller) {
            rightScroller.addEventListener('click', () => {
                // Pausar videos antes de hacer scroll
                if (this.videoHandler) {
                    this.videoHandler.stopAllPlayback();
                }
                gallery.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            });
        }

        // NUEVO: Manejar scroll en galería premium
        gallery.addEventListener('scroll', () => {
            this.handleGalleryScroll();
        });
    }

    // NUEVO: Manejar scroll en galería
    handleGalleryScroll() {
        // Pausar videos que salen del área visible durante el scroll
        if (this.videoHandler && this.videoHandler.hasActiveVideo()) {
            const gallery = document.getElementById('premiumGallery');
            const activeVideo = this.videoHandler.getActiveVideo();
            const galleryRect = gallery.getBoundingClientRect();
            const videoRect = activeVideo.getBoundingClientRect();
            
            const isVisibleInGallery = 
                videoRect.left < galleryRect.right && 
                videoRect.right > galleryRect.left;
                
            if (!isVisibleInGallery) {
                this.videoHandler.stopAllPlayback();
            }
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
            // No avanzar si hay un video reproduciéndose
            if (!this.isDragging && (!this.videoHandler || !this.videoHandler.hasActiveVideo())) {
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
                track.style.transition = 'none';
                track.style.transform = `translateX(${baseTranslate - dragOffset}%)`;
            }
        }, { passive: true });

        carousel.addEventListener('touchend', () => {
            if (!this.isDragging) return;
            
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

// NUEVO: Manejador de Videos Mejorado
class VideoHandler {
    constructor(emeraldElite) {
        this.activeVideo = null;
        this.emeraldElite = emeraldElite;
        this.setupVideoHandlers();
    }

    setupVideoHandlers() {
        const allVideos = document.querySelectorAll('.gallery-video');
        const videoContainers = document.querySelectorAll('.gallery-card');

        videoContainers.forEach(container => {
            const video = container.querySelector('.gallery-video');
            const videoOverlay = container.querySelector('.video-overlay');
            
            if (!video) return;

            // Función principal para manejar reproducción
            const handleVideoToggle = (e) => {
                // Prevenir que se active si se hace clic en botones
                if (e.target.closest('.gallery-action')) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }

                e.preventDefault();
                e.stopPropagation();
                
                if (video.paused) {
                    this.playVideo(video, container);
                } else {
                    this.pauseVideo(video, container);
                }
            };

            // Eventos para el overlay de play y el contenedor
            if (videoOverlay) {
                videoOverlay.addEventListener('click', handleVideoToggle);
            }
            
            container.addEventListener('click', handleVideoToggle);

            // Eventos del video
            video.addEventListener('play', () => {
                this.onVideoPlay(video, container);
            });

            video.addEventListener('pause', () => {
                this.onVideoPause(video, container);
            });

            video.addEventListener('ended', () => {
                this.onVideoEnd(video, container);
            });

            video.addEventListener('loadeddata', () => {
                container.classList.add('video-loaded');
            });

            video.addEventListener('contextmenu', (e) => {
                e.preventDefault();
            });
        });

        this.setupRegularVideos();
    }

    playVideo(video, container) {
        this.pauseAllVideos();
        
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    this.activeVideo = video;
                })
                .catch(error => {
                    console.log('Error al reproducir video:', error);
                    this.onVideoError(video, container, error);
                });
        }
    }

    pauseVideo(video, container) {
        video.pause();
    }

    pauseAllVideos() {
        const allVideos = document.querySelectorAll('.gallery-video, .emerald-video');
        allVideos.forEach(video => {
            if (!video.paused) {
                video.pause();
            }
        });
    }

    onVideoPlay(video, container) {
        container.classList.add('playing');
        
        if (this.emeraldElite && this.emeraldElite.pauseAutoPlay) {
            this.emeraldElite.pauseAutoPlay();
        }
    }

    onVideoPause(video, container) {
        container.classList.remove('playing');
        
        if (this.emeraldElite && this.emeraldElite.resumeAutoPlay) {
            setTimeout(() => {
                this.emeraldElite.resumeAutoPlay();
            }, 1000);
        }

        this.activeVideo = null;
    }

    onVideoEnd(video, container) {
        video.currentTime = 0;
        container.classList.remove('playing');
        this.addEndEffect(container);
        this.activeVideo = null;
    }

    onVideoError(video, container, error) {
        container.classList.remove('playing');
        this.showErrorMessage(container);
    }

    addEndEffect(container) {
        container.classList.add('video-ended');
        setTimeout(() => {
            container.classList.remove('video-ended');
        }, 2000);
    }

    showErrorMessage(container) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'video-error-message';
        errorDiv.innerHTML = `
            <div class="error-content">
                <span>⚠️</span>
                <p>Error al cargar el video</p>
            </div>
        `;
        
        container.appendChild(errorDiv);
        
        setTimeout(() => {
            if (errorDiv && errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 3000);
    }

    setupRegularVideos() {
        const regularVideos = document.querySelectorAll('.emerald-video');
        const playButtons = document.querySelectorAll('.play-btn');

        playButtons.forEach((btn, index) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const video = regularVideos[index];
                if (video) {
                    if (video.paused) {
                        this.pauseAllVideos();
                        video.play();
                        btn.style.display = 'none';
                    } else {
                        video.pause();
                        btn.style.display = 'flex';
                    }
                }
            });
        });

        regularVideos.forEach((video, index) => {
            video.addEventListener('click', () => {
                if (video.paused) {
                    this.pauseAllVideos();
                    video.play();
                    if (playButtons[index]) playButtons[index].style.display = 'none';
                } else {
                    video.pause();
                    if (playButtons[index]) playButtons[index].style.display = 'flex';
                }
            });

            video.addEventListener('pause', () => {
                if (playButtons[index]) playButtons[index].style.display = 'flex';
            });

            video.addEventListener('ended', () => {
                if (playButtons[index]) playButtons[index].style.display = 'flex';
                video.currentTime = 0;
            });
        });
    }

    stopAllPlayback() {
        this.pauseAllVideos();
    }

    getActiveVideo() {
        return this.activeVideo;
    }

    hasActiveVideo() {
        return this.activeVideo !== null && !this.activeVideo.paused;
    }
}

// Analytics y tracking (placeholder)
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

    static trackVideoInteraction(action, videoElement) {
        this.track('video_interaction', {
            action,
            video_src: videoElement.currentSrc || videoElement.src,
            duration: videoElement.duration,
            current_time: videoElement.currentTime
        });
    }
}

// Carrusel mejorado con analytics
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

// Inicializar cuando DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.emeraldElite = new EnhancedCarousel();
    
    // Estilos CSS adicionales para efectos
    const additionalStyles = `
        .video-error-message {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 0, 0, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid #ff4444;
            border-radius: 10px;
            padding: 1rem;
            z-index: 1000;
            animation: errorFade 3s ease-out forwards;
        }
        
        .error-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: #ff4444;
            font-size: 0.9rem;
        }
        
        .video-ended {
            animation: endPulse 0.5s ease-out;
        }
        
        @keyframes errorFade {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        }
        
        @keyframes endPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
        }
    `;

    // Inyectar estilos adicionales
    const styleSheet = document.createElement('style');
    styleSheet.textContent = additionalStyles;
    document.head.appendChild(styleSheet);
});