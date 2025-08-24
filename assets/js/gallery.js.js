
    // NUEVO: Función para actualizar el año
    function updateYear() {
        const dateElement = document.getElementById("date");
        if (dateElement) {
            dateElement.textContent = new Date().getFullYear();
        }
    }
    updateYear();

    // Datos de medios optimizados (imágenes y videos)
    const mediaItems = [
        { src: 'assets/img/eralda11.jpg', type: 'image', category: 'coleccion1', title: 'Esmeralda Premium', desc: 'Gema de alta calidad' },
        { src: 'assets/img/gema1.jpg', type: 'image', category: 'coleccion2', title: 'Esmeralda Natural', desc: 'Piedra preciosa colombiana' },
        { src: 'assets/video/esmeralda.mp4', type: 'video', category: 'videos', title: 'Video Esmeralda', desc: 'Presentación de nuestra colección' },
        { src: 'assets/img/gema2.jpg', type: 'image', category: 'coleccion3', title: 'Esmeralda Exclusiva', desc: 'Calidad excepcional' },
        { src: 'assets/img/gema3.jpg', type: 'image', category: 'coleccion1', title: 'Esmeralda Brillante', desc: 'Corte perfecto' },
        { src: 'assets/video/esmeralda01.mp4', type: 'video', category: 'videos', title: 'Presentación', desc: 'Esmeralda de alta calidad' },
        { src: 'assets/img/gema4.jpg', type: 'image', category: 'coleccion2', title: 'Esmeralda Verde', desc: 'Color intenso' },
        { src: 'assets/img/gema5.jpg', type: 'image', category: 'coleccion3', title: 'Esmeralda Pura', desc: 'Sin tratamientos' },
        { src: 'assets/img/gema6.jpg', type: 'image', category: 'coleccion1', title: 'Esmeralda Única', desc: 'Pieza especial' },
        { src: 'assets/video/esmeralda6.mp4', type: 'video', category: 'videos', title: 'Presentación', desc: 'Colores vivos y luz natural' },
        { src: 'assets/img/gema9.jpg', type: 'image', category: 'coleccion2', title: 'Esmeralda Transparente', desc: 'Claridad excepcional' },
        { src: 'assets/img/gema11.jpg', type: 'image', category: 'coleccion3', title: 'Esmeralda Facetada', desc: 'Múltiples caras' },
        { src: 'assets/img/gema12.jpg', type: 'image', category: 'coleccion1', title: 'Esmeralda Cabujón', desc: 'Forma redondeada' },
        { src: 'assets/img/gema13.jpg', type: 'image', category: 'coleccion2', title: 'Esmeralda Oval', desc: 'Corte tradicional' },
        { src: 'assets/img/gema16.jpg', type: 'image', category: 'coleccion3', title: 'Esmeralda Gota de Agua', desc: 'Forma geométrica' },
        { src: 'assets/img/gema15.jpg', type: 'image', category: 'coleccion1', title: 'Esmeralda Corazon', desc: 'Forma natural' },
        { src: 'assets/img/gema17.jpg', type: 'image', category: 'coleccion2', title: 'Esmeralda Corazon', desc: 'forma narutal' },
        { src: 'assets/img/gema18.jpg', type: 'image', category: 'coleccion3', title: 'Esmeralda Rectangular', desc: 'Forma geométrica' },
        { src: 'assets/img/gema19.jpg', type: 'image', category: 'coleccion1', title: 'Esmeralda Pera', desc: 'Forma de lágrima' },
        { src: 'assets/img/gema20.jpg', type: 'image', category: 'coleccion2', title: 'Esmeralda Princesa', desc: 'Corte cuadrado' }
    ];

    let currentMediaIndex = 0;
    let filteredMedia = [...mediaItems];
    let playingVideos = new Set();

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

    // Efectos del botón de regreso
    document.addEventListener('DOMContentLoaded', function() {
        const backButton = document.getElementById('backButton');

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

            mediaItems.slice(0, 12).forEach((media, index) => {
                const item = document.createElement('div');
                item.className = 'carousel-item';
                
                if (media.type === 'video') {
                    item.classList.add('video-item');
                    item.innerHTML = `<video src="${media.src}" muted loop preload="metadata"></video>`;
                } else {
                    item.innerHTML = `<img src="${media.src}" alt="${media.title}" loading="lazy">`;
                }
                
                item.addEventListener('click', () => openModal(index));
                carousel.appendChild(item);
            });

            setupCarouselScrolling();
        }, 500);
    }

    function setupCarouselScrolling() {
        const carousel = document.getElementById('carousel');
        if (!carousel) return;
        
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
        if (!carousel) return;
        
        const items = carousel.querySelectorAll('.carousel-item');
        const scrollLeft = carousel.scrollLeft;
        const itemWidth = items[0].offsetWidth + 16;

        const activeIndex = Math.round(scrollLeft / itemWidth);

        items.forEach((item, index) => {
            item.classList.toggle('active', index === activeIndex);
        });
    }

    // Gallery con soporte para videos
    function populateGallery(mediaToShow = mediaItems) {
        const gallery = document.getElementById('galleryGrid');

        setTimeout(() => {
            gallery.innerHTML = '';

            mediaToShow.forEach((media, index) => {
                const item = document.createElement('div');
                item.className = 'gallery-item';
                item.dataset.category = media.category;
                item.dataset.index = index;

                let mediaElement = '';
                let controls = '';

                if (media.type === 'video') {
                    mediaElement = `<video src="${media.src}" muted loop preload="metadata" onerror="handleMediaError(this)"></video>`;
                    controls = `
                        <div class="video-controls">
                            <button class="video-play-btn" onclick="toggleVideo(event, this, '${media.src}')">
                                <i class="fas fa-play"></i>
                            </button>
                        </div>
                    `;
                } else {
                    mediaElement = `<img src="${media.src}" alt="${media.title}" loading="lazy" onerror="handleMediaError(this)">`;
                }

                item.innerHTML = `
                    ${mediaElement}
                    ${controls}
                    <div class="gallery-item-overlay">
                        <div class="overlay-title">${media.title}</div>
                        <div class="overlay-description">${media.desc}</div>
                    </div>
                `;

                addTouchHandlers(item, media, index);
                gallery.appendChild(item);
            });

            setTimeout(() => {
                document.querySelectorAll('.gallery-item').forEach(item => {
                    observer.observe(item);
                });
            }, 100);
        }, 300);
    }

    function toggleVideo(event, button, videoSrc) {
        event.stopPropagation();
        
        const galleryItem = button.closest('.gallery-item');
        const video = galleryItem.querySelector('video');
        const icon = button.querySelector('i');
        
        if (video.paused) {
            pauseAllVideos();
            
            video.play().then(() => {
                icon.className = 'fas fa-pause';
                button.classList.add('playing');
                galleryItem.classList.add('playing');
                playingVideos.add(videoSrc);
            }).catch(err => {
                console.error('Error playing video:', err);
            });
        } else {
            video.pause();
            icon.className = 'fas fa-play';
            button.classList.remove('playing');
            galleryItem.classList.remove('playing');
            playingVideos.delete(videoSrc);
        }
    }

    function pauseAllVideos() {
        document.querySelectorAll('.gallery-item video').forEach(video => {
            if (!video.paused) {
                video.pause();
                const button = video.parentElement.querySelector('.video-play-btn');
                const icon = button.querySelector('i');
                const galleryItem = button.closest('.gallery-item');
                
                icon.className = 'fas fa-play';
                button.classList.remove('playing');
                galleryItem.classList.remove('playing');
            }
        });
        playingVideos.clear();
    }

    function addTouchHandlers(item, media, mediaIndex) {
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
            
            const moveDistance = Math.sqrt(
                Math.pow(touchEndPos.x - touchStartPos.x, 2) + 
                Math.pow(touchEndPos.y - touchStartPos.y, 2)
            );

            if (touchDuration < 300 && moveDistance < 10) {
                if (!e.target.closest('.video-controls')) {
                    openModal(mediaIndex);
                }
            }

            this.classList.remove('touching');
        }, { passive: true });

        item.addEventListener('touchcancel', function() {
            this.classList.remove('touching');
        }, { passive: true });
    }

    function filterGallery(category, button) {
        document.querySelectorAll('.control-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        pauseAllVideos();

        filteredMedia = category === 'all' ? [...mediaItems] : mediaItems.filter(media => media.category === category);

        document.getElementById('galleryGrid').innerHTML = '<div class="loading"></div>';
        populateGallery(filteredMedia);
    }

    function shuffleGallery(button) {
        document.querySelectorAll('.control-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        pauseAllVideos();
        
        filteredMedia = [...mediaItems].sort(() => Math.random() - 0.5);
        document.getElementById('galleryGrid').innerHTML = '<div class="loading"></div>';
        populateGallery(filteredMedia);
    }

    // MODAL MEJORADO CON NAVEGACIÓN ARREGLADA
    function openModal(index) {
        currentMediaIndex = index;
        const modal = document.getElementById('modal');
        const modalImage = document.getElementById('modalImage');
        const modalVideo = document.getElementById('modalVideo');
        const modalVideoControls = document.getElementById('modalVideoControls');
        const modalProgress = document.getElementById('modalProgress');
        const currentMedia = mediaItems[index];

        pauseAllVideos();

        // Actualizar información del header
        updateModalInfo();

        if (currentMedia.type === 'video') {
            modalImage.style.display = 'none';
            modalVideo.style.display = 'block';
            modalVideoControls.style.display = 'flex';
            modalProgress.style.display = 'block';
            
            modalVideo.src = currentMedia.src;
            modalVideo.load();
            updateModalVideoControls();
        } else {
            modalVideo.style.display = 'none';
            modalVideoControls.style.display = 'none';
            modalProgress.style.display = 'none';
            modalImage.style.display = 'block';
            
            modalImage.src = currentMedia.src;
            modalImage.alt = currentMedia.title;
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        document.addEventListener('touchmove', preventScroll, { passive: false });
    }

    function updateModalInfo() {
        const currentMedia = mediaItems[currentMediaIndex];
        document.getElementById('modalTitle').textContent = currentMedia.title;
        document.getElementById('modalDescription').textContent = currentMedia.desc;
        document.getElementById('modalCounter').textContent = `${currentMediaIndex + 1} / ${mediaItems.length}`;
    }

    function closeModal() {
        const modal = document.getElementById('modal');
        const modalVideo = document.getElementById('modalVideo');
        
        if (modalVideo && !modalVideo.paused) {
            modalVideo.pause();
        }
        
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        document.removeEventListener('touchmove', preventScroll);
    }

    function preventScroll(e) {
        if (!e.target.closest('.modal-container')) {
            e.preventDefault();
        }
    }

    function navigateModal(direction) {
        currentMediaIndex += direction;

        if (currentMediaIndex < 0) currentMediaIndex = mediaItems.length - 1;
        if (currentMediaIndex >= mediaItems.length) currentMediaIndex = 0;

        const modalImage = document.getElementById('modalImage');
        const modalVideo = document.getElementById('modalVideo');
        const modalVideoControls = document.getElementById('modalVideoControls');
        const modalProgress = document.getElementById('modalProgress');
        const currentMedia = mediaItems[currentMediaIndex];

        // Pausar video actual
        if (modalVideo && !modalVideo.paused) {
            modalVideo.pause();
        }

        // Actualizar información
        updateModalInfo();

        // Transición suave
        modalImage.style.opacity = '0.5';
        modalVideo.style.opacity = '0.5';

        setTimeout(() => {
            if (currentMedia.type === 'video') {
                modalImage.style.display = 'none';
                modalVideo.style.display = 'block';
                modalVideoControls.style.display = 'flex';
                modalProgress.style.display = 'block';
                modalVideo.src = currentMedia.src;
                modalVideo.load();
                updateModalVideoControls();
            } else {
                modalVideo.style.display = 'none';
                modalVideoControls.style.display = 'none';
                modalProgress.style.display = 'none';
                modalImage.style.display = 'block';
                modalImage.src = currentMedia.src;
                modalImage.alt = currentMedia.title;
            }
            
            modalImage.style.opacity = '1';
            modalVideo.style.opacity = '1';
        }, 150);
    }

    // Controles de video del modal
    function toggleModalVideo() {
        const modalVideo = document.getElementById('modalVideo');
        const playPauseBtn = document.getElementById('modalPlayPauseBtn');
        const icon = playPauseBtn.querySelector('i');

        if (modalVideo.paused) {
            modalVideo.play();
            icon.className = 'fas fa-pause';
        } else {
            modalVideo.pause();
            icon.className = 'fas fa-play';
        }
    }

    function muteModalVideo() {
        const modalVideo = document.getElementById('modalVideo');
        const muteIcon = document.getElementById('modalMuteBtn').querySelector('i');

        modalVideo.muted = !modalVideo.muted;
        muteIcon.className = modalVideo.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
    }

    function toggleFullscreen() {
        const modalVideo = document.getElementById('modalVideo');
        
        if (!document.fullscreenElement) {
            modalVideo.requestFullscreen().catch(err => {
                console.error('Error attempting to enable fullscreen:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    function updateModalVideoControls() {
        const modalVideo = document.getElementById('modalVideo');
        const playPauseBtn = document.getElementById('modalPlayPauseBtn');
        const icon = playPauseBtn.querySelector('i');
        const muteIcon = document.getElementById('modalMuteBtn').querySelector('i');

        icon.className = modalVideo.paused ? 'fas fa-play' : 'fas fa-pause';
        muteIcon.className = modalVideo.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
    }

    function updateProgress() {
        const modalVideo = document.getElementById('modalVideo');
        const progressBar = document.getElementById('modalProgressBar');
        
        if (modalVideo.duration > 0) {
            const progress = (modalVideo.currentTime / modalVideo.duration) * 100;
            progressBar.style.width = progress + '%';
        }
    }

    // Event listeners para el modal
    document.addEventListener('DOMContentLoaded', function() {
        const modalVideo = document.getElementById('modalVideo');
        const modalClose = document.getElementById('modalClose');
        const modalPrev = document.getElementById('modalPrev');
        const modalNext = document.getElementById('modalNext');
        const modalPlayPauseBtn = document.getElementById('modalPlayPauseBtn');
        const modalMuteBtn = document.getElementById('modalMuteBtn');
        const modalFullscreenBtn = document.getElementById('modalFullscreenBtn');
        
        // Event listeners con prevención de propagación
        modalClose.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeModal();
        });

        modalPrev.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            navigateModal(-1);
        });

        modalNext.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            navigateModal(1);
        });

        modalPlayPauseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleModalVideo();
        });

        modalMuteBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            muteModalVideo();
        });

        modalFullscreenBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleFullscreen();
        });

        // Event listeners para el modal background
        const modal = document.getElementById('modal');
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Event listeners para el video
        if (modalVideo) {
            modalVideo.addEventListener('play', updateModalVideoControls);
            modalVideo.addEventListener('pause', updateModalVideoControls);
            modalVideo.addEventListener('volumechange', updateModalVideoControls);
            modalVideo.addEventListener('timeupdate', updateProgress);
            modalVideo.addEventListener('loadedmetadata', updateModalVideoControls);
        }
    });

    // Navegación por teclado y touch mejorada
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', function(e) {
        if (!document.getElementById('modal').classList.contains('active')) return;
        
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchmove', function(e) {
        if (!document.getElementById('modal').classList.contains('active')) return;
        
        touchEndX = e.touches[0].clientX;
        touchEndY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', function(e) {
        if (!document.getElementById('modal').classList.contains('active')) return;

        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;
        const minSwipeDistance = 50;

        // Solo procesar swipes horizontales que no interfieran con controles
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDistance) {
            // Verificar que no se haya tocado un control del modal
            if (!e.target.closest('.modal-video-controls') && 
                !e.target.closest('.modal-close') && 
                !e.target.closest('.modal-nav')) {
                
                if (diffX > 0) {
                    navigateModal(1); // Swipe left = next
                } else {
                    navigateModal(-1); // Swipe right = previous
                }
            }
        }
    }, { passive: true });

    document.addEventListener('keydown', function(e) {
        const modal = document.getElementById('modal');

        if (modal.classList.contains('active')) {
            switch(e.key) {
                case 'Escape':
                    closeModal();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    navigateModal(-1);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    navigateModal(1);
                    break;
                case ' ':
                    e.preventDefault();
                    if (document.getElementById('modalVideo').style.display !== 'none') {
                        toggleModalVideo();
                    }
                    break;
                case 'f':
                case 'F':
                    e.preventDefault();
                    if (document.getElementById('modalVideo').style.display !== 'none') {
                        toggleFullscreen();
                    }
                    break;
                case 'm':
                case 'M':
                    e.preventDefault();
                    if (document.getElementById('modalVideo').style.display !== 'none') {
                        muteModalVideo();
                    }
                    break;
            }
        }
    });

    // Intersection Observer
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

    // Error handling
    function handleMediaError(element) {
        if (element.tagName === 'VIDEO') {
            const placeholder = document.createElement('div');
            placeholder.style.cssText = `
                width: 100%;
                height: 100%;
                background: #333;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #666;
                font-size: 14px;
                text-align: center;
            `;
            placeholder.innerHTML = 'Video no disponible';
            element.parentNode.replaceChild(placeholder, element);
        } else {
            element.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMzMzIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkltYWdlbiBubyBkaXNwb25ibGU8L3RleHQ+Cjwvc3ZnPg==';
            element.classList.add('error');
        }
    }

    // Optimizaciones de rendimiento
    function optimizeForBattery() {
        if ('getBattery' in navigator) {
            navigator.getBattery().then(function(battery) {
                if (battery.level < 0.2) {
                    document.getElementById('particles').style.display = 'none';
                    document.body.classList.add('low-battery');
                    pauseAllVideos();
                }
            });
        }
    }

    function checkPerformance() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                document.getElementById('particles').style.display = 'none';
                document.documentElement.style.setProperty('--transition-smooth', 'none');
                document.documentElement.style.setProperty('--transition-bounce', 'none');
                pauseAllVideos();
            }
        }
    }

    function optimizeViewport() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    function handleOrientationChange() {
        setTimeout(() => {
            optimizeViewport();
            const carousel = document.getElementById('carousel');
            if (carousel) {
                carousel.scrollLeft = 0;
            }
            pauseAllVideos();
        }, 100);
    }

    function preloadMedia() {
        const criticalMedia = mediaItems.slice(0, 6);
        
        criticalMedia.forEach(media => {
            if (media.type === 'image') {
                const image = new Image();
                image.src = media.src;
            } else if (media.type === 'video') {
                const video = document.createElement('video');
                video.src = media.src;
                video.preload = 'metadata';
            }
        });
    }

    function handleNetworkChange() {
        if (!navigator.onLine) {
            document.body.classList.add('offline');
            pauseAllVideos();
        } else {
            document.body.classList.remove('offline');
        }
    }

    // Header scroll effect
    function handleHeaderScroll() {
        const header = document.querySelector('.header');
        // Umbral de desplazamiento en píxeles para ocultar el header.
        // El header se mostrará solo cuando el scroll esté casi en la parte superior.
        const scrollThreshold = 10; 

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            
            if (currentScroll > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    // Inicialización
    window.addEventListener('load', () => {
        preloadMedia();
        checkPerformance();
        optimizeForBattery();
        optimizeViewport();
    });

    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', optimizeViewport);
    window.addEventListener('online', handleNetworkChange);
    window.addEventListener('offline', handleNetworkChange);

    document.addEventListener('DOMContentLoaded', function() {
        createParticles();
        populateCarousel();
        populateGallery();
        handleHeaderScroll();
        handleNetworkChange();
    });

    // Cleanup
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

    window.addEventListener('beforeunload', function() {
        observer.disconnect();
        document.removeEventListener('touchmove', preventScroll);
        pauseAllVideos();
    });