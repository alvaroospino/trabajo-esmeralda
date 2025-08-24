 // Optimized image data
const images = [
    { src: 'assets/img/eralda11.jpg', category: 'coleccion1', title: 'Esmeralda', desc: '' },
    { src: 'assets/img/gema1.jpg', category: 'coleccion2', title: 'Esmeralda', desc: '' },
    { src: 'assets/img/gema2.jpg', category: 'coleccion3', title: 'Esmeralda', desc: '' },
    { src: 'assets/img/gema3.jpg', category: 'coleccion1', title: 'Esmeralda', desc: '' },
    { src: 'assets/img/gema4.jpg', category: 'coleccion2', title: 'Esmeralda', desc: '' },
    { src: 'assets/img/gema5.jpg', category: 'coleccion3', title: 'Esmeralda', desc: '' },
    { src: 'assets/img/gema6.jpg', category: 'coleccion1', title: 'Esmeralda', desc: '' },
    { src: 'assets/img/gema9.jpg', category: 'coleccion2', title: 'Esmeralda', desc: '' },
    { src: 'assets/img/gema11.jpg', category: 'coleccion3', title: 'Esmeralda', desc: '' },
    { src: 'assets/img/gema12.jpg', category: 'coleccion1', title: 'Esmeralda', desc: '' },
    { src: 'assets/img/gema13.jpg', category: 'coleccion2', title: 'Esmeralda', desc: '' },
    { src: 'assets/img/gema16.jpg', category: 'coleccion3', title: 'Esmeralda', desc: '' },
    { src: 'assets/img/gema15.jpg', category: 'coleccion1', title: 'Esmeralda', desc: '' },
    { src: 'assets/img/gema17.jpg', category: 'coleccion2', title: 'Esmeralda', desc: '' },
    { src: 'assets/img/gema18.jpg', category: 'coleccion3', title: 'Esmeralda', desc: '' },
    { src: 'assets/img/gema19.jpg', category: 'coleccion1', title: 'Esmeralda', desc: '' },
    { src: 'assets/img/gema20.jpg', category: 'coleccion2', title: 'Esmeralda', desc: '' },
    { src: 'assets/img/gema21.jpg', category: 'coleccion3', title: 'Esmeralda', desc: '' },
    { src: 'assets/img/gema22.jpg', category: 'coleccion1', title: 'Esmeralda', desc: '' },
    { src: 'assets/img/gema23.jpg', category: 'coleccion2', title: 'Esmeralda', desc: '' }
];

let currentImageIndex = 0;
let filteredImages = [...images];

// Create fewer particles for mobile performance
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = window.innerWidth < 768 ? 15 : 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.width = Math.random() * 3 + 1 + 'px';
        particle.style.height = particle.style.width;
        particle.style.animationDelay = Math.random() * 25 + 's';
        particle.style.animationDuration = (Math.random() * 15 + 15) + 's';
        particlesContainer.appendChild(particle);
    }
}

// JavaScript para efectos adicionales (opcional)
document.addEventListener('DOMContentLoaded', function() {
    const backButton = document.getElementById('backButton');

    // Efecto ripple al hacer clic
    backButton.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: var(--emerald-glow);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            z-index: 0;
        `;

        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Mobile-optimized carousel
function populateCarousel() {
    const carousel = document.getElementById('carousel');

    setTimeout(() => {
        carousel.innerHTML = '';

        images.slice(0, 12).forEach((img, index) => {
            const item = document.createElement('div');
            item.className = 'carousel-item';
            item.innerHTML = `<img src="${img.src}" alt="${img.title}" loading="lazy">`;
            item.addEventListener('click', () => openModal(index));
            carousel.appendChild(item);
        });

        // Add scroll snapping effect
        setupCarouselScrolling();
    }, 500);
}

// Enhanced carousel scrolling for mobile
function setupCarouselScrolling() {
    const carousel = document.getElementById('carousel');
    if (!carousel) return; // Add this check to prevent errors
    
    let isScrolling = false;

    carousel.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                updateCarouselActiveItem();
                isScrolling = false;
            });
            isScrolling = true;
        }
    });
}

function updateCarouselActiveItem() {
    const carousel = document.getElementById('carousel');
    if (!carousel) return; // Add this check to prevent errors
    
    const items = carousel.querySelectorAll('.carousel-item');
    const scrollLeft = carousel.scrollLeft;
    const itemWidth = items[0].offsetWidth + 16; // width + gap

    const activeIndex = Math.round(scrollLeft / itemWidth);

    items.forEach((item, index) => {
        item.classList.toggle('active', index === activeIndex);
    });
}

// Mobile-optimized gallery
function populateGallery(imagesToShow = images) {
    const gallery = document.getElementById('galleryGrid');

    setTimeout(() => {
        gallery.innerHTML = '';

        imagesToShow.forEach((img, index) => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.dataset.category = img.category;

            item.innerHTML = `
                <img src="${img.src}" alt="${img.title}" loading="lazy" onerror="handleImageError(this)">
                <div class="gallery-item-overlay">
                    <div class="overlay-title">${img.title}</div>
                    <div class="overlay-description">${img.desc}</div>
                </div>
            `;

            // Add touch feedback
            addTouchHandlers(item, img);
            gallery.appendChild(item);
        });

        // Trigger intersection observer
        setTimeout(() => {
            document.querySelectorAll('.gallery-item').forEach(item => {
                observer.observe(item);
            });
        }, 100);
    }, 300);
}

// Improved touch handling for gallery items
function addTouchHandlers(item, img) {
    let touchStartTime = 0;
    let touchStartPos = { x: 0, y: 0 };

    item.addEventListener('touchstart', function(e) {
        touchStartTime = Date.now();
        touchStartPos = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
        this.classList.add('touching');
    }, { passive: true });

    item.addEventListener('touchend', function(e) {
        const touchEndTime = Date.now();
        const touchDuration = touchEndTime - touchStartTime;
        const touchEndPos = {
            x: e.changedTouches[0].clientX,
            y: e.changedTouches[0].clientY
        };
        
        // Calcular la distancia del movimiento
        const moveDistance = Math.sqrt(
            Math.pow(touchEndPos.x - touchStartPos.x, 2) + 
            Math.pow(touchEndPos.y - touchStartPos.y, 2)
        );

        // Solo activar si fue un toque rápido y el movimiento fue mínimo (menos de 10px)
        if (touchDuration < 300 && moveDistance < 10) {
            const imageIndex = images.findIndex(image => image.src === img.src);
            openModal(imageIndex);
        }

        this.classList.remove('touching');
    }, { passive: true });

    item.addEventListener('touchcancel', function() {
        this.classList.remove('touching');
    }, { passive: true });
}

// Optimized gallery filtering
function filterGallery(category, button) {
    // Update active button
    document.querySelectorAll('.control-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    // Filter images
    filteredImages = category === 'all' ? [...images] : images.filter(img => img.category === category);

    // Add loading state
    document.getElementById('galleryGrid').innerHTML = '<div class="loading"></div>';

    // Populate with filtered images
    populateGallery(filteredImages);
}

// Shuffle function
function shuffleGallery(button) {
    document.querySelectorAll('.control-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    filteredImages = [...images].sort(() => Math.random() - 0.5);
    document.getElementById('galleryGrid').innerHTML = '<div class="loading"></div>';
    populateGallery(filteredImages);
}

// Mobile-optimized modal
function openModal(index) {
    currentImageIndex = index;
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modalImage');

    modalImage.src = images[index].src;
    modalImage.alt = images[index].title;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Prevent body scroll
    document.addEventListener('touchmove', preventScroll, { passive: false });
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';

    // Re-enable body scroll
    document.removeEventListener('touchmove', preventScroll);
}

function preventScroll(e) {
    if (!e.target.closest('.modal-content')) {
        e.preventDefault();
    }
}

function navigateModal(direction) {
    currentImageIndex += direction;

    if (currentImageIndex < 0) currentImageIndex = images.length - 1;
    if (currentImageIndex >= images.length) currentImageIndex = 0;

    const modalImage = document.getElementById('modalImage');
    modalImage.style.opacity = '0.5';

    setTimeout(() => {
        modalImage.src = images[currentImageIndex].src;
        modalImage.alt = images[currentImageIndex].title;
        modalImage.style.opacity = '1';
    }, 150);
}

// Enhanced touch/swipe support
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchmove', function(e) {
    touchEndX = e.touches[0].clientX;
    touchEndY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', function(e) {
    if (!document.getElementById('modal').classList.contains('active')) return;

    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    const minSwipeDistance = 50;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDistance) {
        if (diffX > 0) {
            navigateModal(1); // Swipe left = next image
        } else {
            navigateModal(-1); // Swipe right = previous image
        }
    }
}, { passive: true });

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    const modal = document.getElementById('modal');

    if (modal.classList.contains('active')) {
        switch(e.key) {
            case 'Escape':
                closeModal();
                break;
            case 'ArrowLeft':
                navigateModal(-1);
                break;
            case 'ArrowRight':
                navigateModal(1);
                break;
        }
    }
});

// Intersection Observer for performance
const observerOptions = {
    threshold: 0.1,
    rootMargin: '50px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Error handling for images
function handleImageError(img) {
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMzMzIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkltYWdlbiBubyBkaXNwb25ibGU8L3RleHQ+Cjwvc3ZnPg==';
    img.classList.add('error');
}

// Battery API optimization
function optimizeForBattery() {
    if ('getBattery' in navigator) {
        navigator.getBattery().then(function(battery) {
            if (battery.level < 0.2) { // Less than 20% battery
                document.getElementById('particles').style.display = 'none';
                document.body.classList.add('low-battery');
            }
        });
    }
}

// Performance optimization based on connection
function checkPerformance() {
    if ('connection' in navigator) {
        const connection = navigator.connection;
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
            document.getElementById('particles').style.display = 'none';
            document.documentElement.style.setProperty('--transition-smooth', 'none');
            document.documentElement.style.setProperty('--transition-bounce', 'none');
        }
    }
}

// Viewport size optimization
function optimizeViewport() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Handle orientation change
function handleOrientationChange() {
    setTimeout(() => {
        optimizeViewport();
        const carousel = document.getElementById('carousel');
        if (carousel) {
            carousel.scrollLeft = 0;
        }
    }, 100);
}

// Preload critical images for better performance
function preloadImages() {
    const criticalImages = images.slice(0, 6);
    
    criticalImages.forEach(img => {
        const image = new Image();
        image.src = img.src;
    });
}

// Network status handling
function handleNetworkChange() {
    if (!navigator.onLine) {
        document.body.classList.add('offline');
    } else {
        document.body.classList.remove('offline');
    }
}

// Initialize all optimizations
window.addEventListener('load', () => {
    preloadImages();
    checkPerformance();
    optimizeForBattery();
    optimizeViewport();
});

// Event listeners
window.addEventListener('orientationchange', handleOrientationChange);
window.addEventListener('resize', optimizeViewport);
window.addEventListener('online', handleNetworkChange);
window.addEventListener('offline', handleNetworkChange);

// Header scroll effect with direction detection
function handleHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScroll = 0;
    const scrollThreshold = 50;
    let isScrollingUp = false;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        if (currentScroll <= 0) {
            // Si estamos en la parte superior, siempre mostrar el header
            header.classList.remove('scrolled');
            return;
        }

        if (currentScroll > lastScroll && !header.classList.contains('scrolled') && currentScroll > scrollThreshold) {
            // Scrolling hacia abajo y el header está visible
            header.classList.add('scrolled');
            isScrollingUp = false;
        } else if (currentScroll < lastScroll && header.classList.contains('scrolled')) {
            // Scrolling hacia arriba y el header está oculto
            header.classList.remove('scrolled');
            isScrollingUp = true;
        }

        lastScroll = currentScroll;
    }, { passive: true }); // Optimización de rendimiento
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    createParticles();
    populateCarousel();
    populateGallery();
    handleHeaderScroll();
    
    // Check initial network status
    handleNetworkChange();
});

// Debounced resize handler for particles
let resizeTimeout;
let lastWidth = window.innerWidth;

window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (window.innerWidth !== lastWidth) {
            document.getElementById('particles').innerHTML = '';
            createParticles();
            lastWidth = window.innerWidth;
        }
    }, 250);
});

// Memory cleanup
window.addEventListener('beforeunload', function() {
    observer.disconnect();
    document.removeEventListener('touchmove', preventScroll);
});

// Performance observer for debugging
if ('PerformanceObserver' in window) {
    const perfObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
            if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
                console.log(`First Contentful Paint: ${entry.startTime}ms`);
            }
        });
    });
    
    try {
        perfObserver.observe({ entryTypes: ['paint'] });
    } catch (e) {
        // Performance observer not supported
    }
}

// PWA-like behavior hints
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log('PWA install available');
});

// Service Worker hint (if HTTPS)
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    window.addEventListener('load', function() {
        console.log('Service Worker support available');
        // Here you could register a service worker for offline functionality
    });
}

// Accessibility: Announce content changes
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Add accessibility announcements to filter changes
const originalFilterGallery = filterGallery;
filterGallery = function(category, button) {
    originalFilterGallery(category, button);
    
    const categoryNames = {
        'all': 'todas las imágenes',
        'coleccion1': 'imágenes de la Colección 1',
        'coleccion2': 'imágenes de la Colección 2',
        'coleccion3': 'imágenes de la Colección 3'
    };
    
    announceToScreenReader(`Mostrando ${categoryNames[category] || category}`);
};

// Reduce motion preference detection
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    document.getElementById('particles').style.display = 'none';
}

// Listen for changes in motion preference
prefersReducedMotion.addEventListener('change', () => {
    if (prefersReducedMotion.matches) {
        document.getElementById('particles').style.display = 'none';
    } else {
        document.getElementById('particles').style.display = 'block';
        createParticles();
    }
});