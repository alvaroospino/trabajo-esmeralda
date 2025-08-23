// Emerald Elite - Main JavaScript - Mejorado con Galería Visible

class EmeraldElite {
    constructor() {
        this.isLoaded = false;
        this.particles = [];
        this.videoHandler = null;
        
        this.init();
    }

    init() {
        this.showLoadingScreen();
        this.setupEventListeners();
        this.createParticles();
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

        window.addEventListener('resize', () => {
            this.handleResize();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Pausar videos con ESC
                if (this.videoHandler) {
                    this.videoHandler.stopAllPlayback();
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
    // Si hago clic en una imagen (pero NO en un video)
    if (e.target.tagName === "IMG" && !e.target.classList.contains("gallery-video")) {
        return; // dejamos que se dispare el modal
    }

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
    }

    onVideoPause(video, container) {
        container.classList.remove('playing');
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

// NUEVO: Clase para manejar el carrusel de esmeraldas
class EmeraldCarousel {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 6;
        this.container = document.getElementById("carouselContainer");
        this.indicators = document.querySelectorAll(".indicator");
        this.thumbnails = document.querySelectorAll(".thumbnail");
        this.slides = document.querySelectorAll(".carousel-slide");
        this.prevBtn = document.getElementById("prevBtn");
        this.nextBtn = document.getElementById("nextBtn");
        this.isAnimating = false;
        this.autoPlayInterval = null;

        if (this.container) {
            this.init();
            this.startAutoPlay();
        }
    }

    init() {
        // Event listeners para navegación
        this.prevBtn.addEventListener("click", () => this.prevSlide());
        this.nextBtn.addEventListener("click", () => this.nextSlide());

        // Event listeners para indicadores
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener("click", () => this.goToSlide(index));
        });

        // Event listeners para thumbnails
        this.thumbnails.forEach((thumbnail, index) => {
            thumbnail.addEventListener("click", () => this.goToSlide(index));
        });

        // Touch/swipe support para móvil
        this.addTouchSupport();

        // Keyboard support
        document.addEventListener("keydown", (e) => {
            if (e.key === "ArrowLeft") this.prevSlide();
            if (e.key === "ArrowRight") this.nextSlide();
        });

        // Pausar autoplay al pasar el mouse
        const carousel = document.getElementById("emeraldCarousel");
        carousel.addEventListener("mouseenter", () => this.stopAutoPlay());
        carousel.addEventListener("mouseleave", () => this.startAutoPlay());

        // Actualizar controles iniciales
        this.updateControls();
    }

   addTouchSupport() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        const carousel = document.getElementById("emeraldCarousel");

        carousel.addEventListener("touchstart", (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            this.stopAutoPlay(); // detener autoplay mientras toca
        });

        carousel.addEventListener("touchmove", (e) => {
            endX = e.touches[0].clientX;
            const diffX = startX - endX;
            const diffY = startY - e.touches[0].clientY;
            
            // Prevenir scroll vertical solo si el movimiento horizontal es mayor
            if (Math.abs(diffX) > Math.abs(diffY)) {
                e.preventDefault();
            }
        });

        carousel.addEventListener("touchend", (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;

            // Minimum swipe distance
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }

            this.startAutoPlay(); // reanudar autoplay después de soltar
        });
    }
    goToSlide(slideIndex) {
        if (this.isAnimating || slideIndex === this.currentSlide) return;

        this.isAnimating = true;
        this.currentSlide = slideIndex;

        // Animate container
        const translateX = -this.currentSlide * 100;
        this.container.style.transform = `translateX(${translateX}%)`;

        // Update active states
        this.updateActiveStates();
        this.updateControls();

        // Reset animation flag
        setTimeout(() => {
            this.isAnimating = false;
        }, 800);
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.goToSlide(nextIndex);
    }

    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.goToSlide(prevIndex);
    }

    updateActiveStates() {
        // Update slides
        this.slides.forEach((slide, index) => {
            slide.classList.toggle("active", index === this.currentSlide);
        });

        // Update indicators
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle("active", index === this.currentSlide);
        });

        // Update thumbnails
        this.thumbnails.forEach((thumbnail, index) => {
            thumbnail.classList.toggle("active", index === this.currentSlide);
        });
    }

    updateControls() {
        // En móvil, siempre mantener los controles activos para navegación circular
        // En PC, se pueden deshabilitar en los extremos si se prefiere
        const isMobile = window.innerWidth <= 768;

        if (!isMobile) {
            this.prevBtn.classList.toggle("disabled", this.currentSlide === 0);
            this.nextBtn.classList.toggle(
                "disabled",
                this.currentSlide === this.totalSlides - 1
            );
        } else {
            this.prevBtn.classList.remove("disabled");
            this.nextBtn.classList.remove("disabled");
        }
    }

    startAutoPlay() {
        this.stopAutoPlay(); // limpiar antes de iniciar
        this.autoPlayInterval = setInterval(() => {
            if (!this.isAnimating) {
                this.nextSlide();
            }
        }, 5000);
    }

    stopAutoPlay() {
        clearInterval(this.autoPlayInterval);
    }
}


// NUEVO: Clase para el modal de imágenes

class ImageModal {
    constructor() {
        this.modal = document.getElementById("imageModal");
        this.modalImg = document.getElementById("modalImg");
        this.captionText = document.getElementById("caption");
        this.closeBtn = document.querySelector(".modal .close");

        if (this.modal) {
            this.setupEventListeners();
        }
    }

    setupEventListeners() {
        // Al dar click en el botón 'Ver Imagen' -> abre modal con la imagen
        document.querySelectorAll('.view-image-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault(); // Evita el comportamiento predeterminado del botón
                e.stopPropagation(); // Evita que el evento se propague a la tarjeta padre

                // Encuentra la tarjeta padre para obtener la imagen
                const card = e.target.closest('.premium-card');
                const img = card.querySelector('img.gallery-image');
                
                if (img) {
                    this.openModal(img.src, img.alt);
                }
            });
        });

        // Cerrar modal al dar click en la X
        if (this.closeBtn) {
            this.closeBtn.onclick = () => { this.closeModal(); };
        }

        // Cerrar modal al dar click fuera de la imagen
        this.modal.onclick = (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        };
    }

    // El resto de tus métodos openModal() y closeModal()
    openModal(imageSrc, altText) {
        this.modal.style.display = "block";
        this.modalImg.src = imageSrc;
        this.captionText.innerHTML = altText;
        document.body.style.overflow = "hidden"; // Deshabilita el scroll del fondo
    }

    closeModal() {
        this.modal.style.display = "none";
        document.body.style.overflow = "auto"; // Habilita el scroll del fondo
    }
}

// NUEVO: Función para actualizar el año
function updateYear() {
    const dateElement = document.getElementById("date");
    if (dateElement) {
        dateElement.textContent = new Date().getFullYear();
    }
}


// Inicializar todas las clases cuando DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.emeraldElite = new EmeraldElite();
    new EmeraldCarousel();
    new ImageModal();
    updateYear();
    
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