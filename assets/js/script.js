// Emerald Elite - Main JavaScript - Mejorado con Galería Visible

class EmeraldElite {
    constructor() {
        this.isLoaded = false;
        this.particles = [];
        this.videoHandler = null;
        
        this.init();
    }

    init() {
        this.realPreloader = new RealPreloader();
        this.setupEventListeners();
        this.createParticles();
        this.setupMobileMenu();
        this.setupGalleryScroll();
        this.initVideoHandler();
        this.setupImageLoadingStates();
    }

    // NUEVO: Inicializar el manejador de videos mejorado
    initVideoHandler() {
        this.videoHandler = new VideoHandler(this);
    }

    // Métodos mantenidos para compatibilidad pero ahora manejados por RealPreloader
    showLoadingScreen() {
        // Manejado por RealPreloader
    }

    hideLoadingScreen() {
        // Manejado por RealPreloader
        this.isLoaded = true;
    }

    // Particle System
    createParticles() {
        const container = document.querySelector('.hero-particles');
        if (!container) return;

        const particleCount = window.innerWidth < 768 ? 8 : 15;
        
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
            this.updateActiveNavLink(); // NUEVO: Actualizar navegación activa
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

    // NUEVO: Actualizar enlace de navegación activo
    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href').substring(1);
            link.classList.remove('active');
            
            if (href === currentSection) {
                link.classList.add('active');
            }
        });
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



    // NUEVO: Indicador de progreso de scroll
    setupScrollProgress() {
        // Crear barra de progreso
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress-bar';
        progressBar.innerHTML = '<div class="scroll-progress-fill"></div>';
        document.body.appendChild(progressBar);
        
        const progressFill = progressBar.querySelector('.scroll-progress-fill');
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            progressFill.style.width = `${Math.min(scrollPercent, 100)}%`;
        });
    }

    // NUEVO: Estados de carga para imágenes
    setupImageLoadingStates() {
        const galleryImages = document.querySelectorAll('.gallery-image');
        
        galleryImages.forEach(img => {
            const card = img.closest('.gallery-card');
            if (!card) return;
            
            // Mostrar skeleton mientras carga
            card.classList.add('loading');
            
            if (img.complete) {
                this.onImageLoaded(card);
            } else {
                img.addEventListener('load', () => {
                    this.onImageLoaded(card);
                });
                
                img.addEventListener('error', () => {
                    this.onImageError(card);
                });
            }
        });
    }
    
    onImageLoaded(card) {
        setTimeout(() => {
            card.classList.remove('loading');
            card.classList.add('loaded');
        }, 300); // Pequeño delay para suavizar la transición
    }
    
    onImageError(card) {
        card.classList.remove('loading');
        card.classList.add('error');
        
        // Mostrar placeholder de error
        const errorDiv = document.createElement('div');
        errorDiv.className = 'image-error-placeholder';
        errorDiv.innerHTML = `
            <div class="error-icon">⚠️</div>
            <div class="error-text">Error al cargar imagen</div>
        `;
        card.appendChild(errorDiv);
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

// NUEVO: Sistema de Preloader Funcional y Adaptativo
class RealPreloader {
    constructor() {
        this.preloader = document.getElementById('preloader');
        this.progressBar = null;
        this.progressText = null;
        
        this.startTime = Date.now();
        this.minDisplayTime = 600; // Mínimo 0.6 segundos
        this.maxDisplayTime = 2500; // Máximo 2.5 segundos
        this.resourcesLoaded = false;
        
        this.totalResources = 0;
        this.loadedResources = 0;
        
        if (this.preloader) {
            this.init();
        }
    }
    
    init() {
        this.createProgressIndicator();
        this.collectResources();
        this.startLoading();
    }
    
    createProgressIndicator() {
        // Crear barra de progreso
        const progressContainer = document.createElement('div');
        progressContainer.className = 'preload-progress';
        progressContainer.innerHTML = `
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
            <div class="progress-text">Cargando recursos... 0%</div>
        `;
        
        this.preloader.querySelector('.preload-container').appendChild(progressContainer);
        this.progressBar = progressContainer.querySelector('.progress-fill');
        this.progressText = progressContainer.querySelector('.progress-text');
    }
    
    collectResources() {
        const images = document.querySelectorAll('img');
        // Solo contar videos con preload diferente de 'none'
        const videos = document.querySelectorAll('video:not([preload="none"])');
        
        // Contar recursos críticos
        this.totalResources = images.length + videos.length;
        
        // Si no hay recursos, marcar como cargado
        if (this.totalResources === 0) {
            this.resourcesLoaded = true;
            this.checkIfReady();
            return;
        }
        
        // Monitorear imágenes
        images.forEach(img => {
            if (img.complete) {
                this.onResourceLoaded();
            } else {
                img.addEventListener('load', () => this.onResourceLoaded());
                img.addEventListener('error', () => this.onResourceLoaded());
            }
        });
        
        // Monitorear solo videos críticos (hero video principalmente)
        videos.forEach(video => {
            if (video.readyState >= 2 || video.classList.contains('hero-video')) {
                this.onResourceLoaded();
            } else {
                video.addEventListener('canplay', () => this.onResourceLoaded());
                video.addEventListener('error', () => this.onResourceLoaded());
            }
        });
        
        // Timeout de seguridad para recursos que no cargan
        setTimeout(() => {
            if (!this.resourcesLoaded) {
                this.resourcesLoaded = true;
                this.checkIfReady();
            }
        }, 1500); // Timeout rápido de 1.5 segundos
    }
    
    onResourceLoaded() {
        this.loadedResources++;
        this.updateProgress();
        
        if (this.loadedResources >= this.totalResources) {
            this.resourcesLoaded = true;
            this.checkIfReady();
        }
    }
    
    updateProgress() {
        const progress = (this.loadedResources / this.totalResources) * 100;
        
        if (this.progressBar) {
            this.progressBar.style.width = `${progress}%`;
        }
        
        if (this.progressText) {
            if (progress < 100) {
                this.progressText.textContent = `Cargando recursos... ${Math.round(progress)}%`;
            } else {
                this.progressText.textContent = 'Preparando contenido...';
            }
        }
    }
    
    checkIfReady() {
        if (!this.resourcesLoaded) return;
        
        const elapsed = Date.now() - this.startTime;
        const remaining = Math.max(0, this.minDisplayTime - elapsed);
        
        setTimeout(() => {
            this.hide();
        }, remaining);
    }
    
    startLoading() {
        // Actualizar texto inicial
        if (this.progressText) {
            this.progressText.textContent = `Cargando recursos... 0% (${this.totalResources} elementos)`;
        }
        
        // Timeout absoluto
        setTimeout(() => {
            if (this.preloader && this.preloader.style.display !== 'none') {
                this.hide();
            }
        }, this.maxDisplayTime);
    }
    
    hide() {
        if (!this.preloader) return;
        
        // Mostrar 100% antes de ocultar
        if (this.progressBar) {
            this.progressBar.style.width = '100%';
        }
        if (this.progressText) {
            this.progressText.textContent = '¡Listo! 100%';
        }
        
        setTimeout(() => {
            this.preloader.classList.add('fade-out');
            
            setTimeout(() => {
                this.preloader.style.display = 'none';
                
                // Trigger evento personalizado para indicar que el preloader terminó
                document.dispatchEvent(new CustomEvent('preloaderComplete'));
            }, 600);
        }, 300);
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
        
        .image-error-placeholder {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            color: #ff4444;
            background: rgba(255, 68, 68, 0.1);
            backdrop-filter: blur(10px);
            padding: 2rem;
            border-radius: 15px;
            border: 1px solid #ff4444;
            z-index: 3;
        }
        
        .error-icon {
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }
        
        .error-text {
            font-size: 0.9rem;
            font-weight: 500;
        }
        
        .gallery-card.loaded .gallery-image {
            animation: imageReveal 0.6s ease-out;
        }
        
        @keyframes imageReveal {
            from {
                opacity: 0;
                transform: scale(0.95);
                filter: blur(5px);
            }
            to {
                opacity: 1;
                transform: scale(1);
                filter: blur(0);
            }
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
        
        /* Preloader Progress Styles */
        .preload-progress {
            margin-top: 2rem;
            text-align: center;
            width: 100%;
            max-width: 300px;
        }
        
        .progress-bar {
            width: 100%;
            height: 4px;
            background: rgba(0, 255, 127, 0.2);
            border-radius: 2px;
            overflow: hidden;
            margin-bottom: 1rem;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(0, 255, 127, 0.3);
        }
        
        .progress-fill {
            height: 100%;
            width: 0%;
            background: linear-gradient(90deg, #00FF7F, #40E0D0);
            transition: width 0.3s ease;
            border-radius: 2px;
            box-shadow: 0 0 10px rgba(0, 255, 127, 0.5);
            position: relative;
        }
        
        .progress-fill::after {
            content: '';
            position: absolute;
            right: 0;
            top: 0;
            width: 6px;
            height: 100%;
            background: rgba(255, 255, 255, 0.8);
            filter: blur(1px);
            animation: shimmer 2s infinite;
        }
        
        .progress-text {
            color: rgba(255, 255, 255, 0.9);
            font-size: 0.9rem;
            font-weight: 500;
            text-shadow: 0 0 10px rgba(0, 255, 127, 0.5);
            animation: pulse 2s infinite;
        }
        
        @keyframes shimmer {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 0.8; }
            50% { opacity: 1; }
        }
        
        /* Scroll Progress Bar */
        .scroll-progress-bar {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: rgba(0, 0, 0, 0.1);
            z-index: 9999;
            backdrop-filter: blur(10px);
        }
        
        .scroll-progress-fill {
            height: 100%;
            width: 0%;
            background: linear-gradient(90deg, var(--primary-green), var(--secondary-green));
            transition: width 0.25s ease;
            box-shadow: 0 0 10px var(--emerald-glow);
            position: relative;
        }
        
        .scroll-progress-fill::after {
            content: '';
            position: absolute;
            right: 0;
            top: 0;
            width: 6px;
            height: 100%;
            background: rgba(255, 255, 255, 0.8);
            box-shadow: 0 0 8px var(--primary-green);
            filter: blur(1px);
        }
    `;

    // Inyectar estilos adicionales
    const styleSheet = document.createElement('style');
    styleSheet.textContent = additionalStyles;
    document.head.appendChild(styleSheet);
});