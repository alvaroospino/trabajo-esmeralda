// Lazy loading optimizado para videos y performance
class LazyVideoLoader {
    constructor() {
        this.videos = [];
        this.observer = null;
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.findVideos();
    }

    setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) {
            // Fallback para navegadores sin soporte
            this.loadAllVideos();
            return;
        }

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadVideo(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '100px 0px', // Cargar videos 100px antes de que sean visibles
            threshold: 0.1
        });
    }

    findVideos() {
        const videos = document.querySelectorAll('video[data-lazy]');
        videos.forEach(video => {
            this.observer.observe(video);
        });
    }

    loadVideo(video) {
        const src = video.dataset.src;
        if (src) {
            video.src = src;
            video.load();
            video.removeAttribute('data-lazy');
            video.removeAttribute('data-src');
        }
    }

    loadAllVideos() {
        // Fallback para navegadores sin IntersectionObserver
        const videos = document.querySelectorAll('video[data-lazy]');
        videos.forEach(video => this.loadVideo(video));
    }
}

// Performance optimizado para reducir repaints
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.optimizeScrolling();
        this.optimizeAnimations();
    }

    optimizeScrolling() {
        let ticking = false;

        function updateScrollEffects() {
            // Batch DOM reads/writes para mejor performance
            requestAnimationFrame(() => {
                const scrollY = window.pageYOffset;
                
                // Update navigation
                const nav = document.querySelector('.nav');
                if (nav) {
                    nav.classList.toggle('scrolled', scrollY > 100);
                }

                ticking = false;
            });
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                ticking = true;
                updateScrollEffects();
            }
        }, { passive: true });
    }

    optimizeAnimations() {
        // Reducir animaciones en dispositivos de bajo rendimiento
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
            document.documentElement.style.setProperty('--transition-smooth', '0.2s ease');
            document.documentElement.style.setProperty('--transition-bounce', '0.3s ease');
        }

        // Pausar animaciones cuando la pestaña no está visible
        document.addEventListener('visibilitychange', () => {
            const particles = document.querySelectorAll('.particle');
            particles.forEach(particle => {
                if (document.hidden) {
                    particle.style.animationPlayState = 'paused';
                } else {
                    particle.style.animationPlayState = 'running';
                }
            });
        });
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new LazyVideoLoader();
    new PerformanceOptimizer();
});