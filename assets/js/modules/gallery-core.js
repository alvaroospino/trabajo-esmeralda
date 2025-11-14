/**
 * Gallery Core Module
 * Main gallery functionality with professional architecture
 */

import { GALLERY_CONFIG } from './config.js';
import { DOM, Performance, Animation, Media, Validator } from './utils.js';

/**
 * Gallery Core Class
 * Handles the main gallery functionality
 */
export class GalleryCore {
  constructor() {
    this.mediaItems = GALLERY_CONFIG.MEDIA_ITEMS;
    this.filteredMedia = [...this.mediaItems];
    this.currentFilter = 'all';
    this.currentView = 'grid';
    this.intersectionObserver = null;
    this.playingVideos = new Set();
    this.isInitialized = false;
    
    this.init();
  }

  /**
   * Initialize the gallery
   */
  async init() {
    try {
      this.setupIntersectionObserver();
      this.bindEvents();
      this.updateCounters();
      await this.render();
      await this.renderFeaturedCarousel();
      
      this.isInitialized = true;
    } catch (error) {
      this.showError();
    }
  }

  /**
   * Setup Intersection Observer for performance
   */
  setupIntersectionObserver() {
    const options = {
      threshold: GALLERY_CONFIG.PERFORMANCE.INTERSECTION_THRESHOLD,
      rootMargin: GALLERY_CONFIG.PERFORMANCE.INTERSECTION_ROOT_MARGIN
    };

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(GALLERY_CONFIG.CLASSES.VISIBLE);
          this.intersectionObserver.unobserve(entry.target);
        }
      });
    }, options);
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Resize handler with debounce
    const handleResize = Performance.debounce(() => {
      this.handleResize();
    }, GALLERY_CONFIG.PERFORMANCE.DEBOUNCE_DELAY);

    DOM.on(window, 'resize', handleResize);
    DOM.on(window, 'orientationchange', handleResize);
  }

  /**
   * Handle window resize
   */
  handleResize() {
    this.updateViewportHeight();
    if (Performance.isMobile() !== this.wasMobile) {
      this.wasMobile = Performance.isMobile();
      this.render();
    }
  }

  /**
   * Update viewport height for mobile
   */
  updateViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  /**
   * Update filter counters
   */
  updateCounters() {
    const counters = {
      all: this.mediaItems.length,
      videos: this.mediaItems.filter(item => item.type === 'video').length,
      coleccion1: this.mediaItems.filter(item => item.category === 'coleccion1').length,
      coleccion2: this.mediaItems.filter(item => item.category === 'coleccion2').length,
      coleccion3: this.mediaItems.filter(item => item.category === 'coleccion3').length
    };

    // Update counter elements using config selectors
    const counterElements = {
      all: DOM.get(GALLERY_CONFIG.SELECTORS.COUNT_ALL),
      videos: DOM.get(GALLERY_CONFIG.SELECTORS.COUNT_VIDEOS),
      coleccion1: DOM.get(GALLERY_CONFIG.SELECTORS.COUNT_COL1),
      coleccion2: DOM.get(GALLERY_CONFIG.SELECTORS.COUNT_COL2),
      coleccion3: DOM.get(GALLERY_CONFIG.SELECTORS.COUNT_COL3)
    };

    Object.entries(counterElements).forEach(([key, element]) => {
      if (element) element.textContent = counters[key];
    });

    // Update total items
    const totalElement = DOM.get(GALLERY_CONFIG.SELECTORS.TOTAL_ITEMS);
    if (totalElement) totalElement.textContent = counters.all;
  }

  /**
   * Filter gallery by category
   * @param {string} category - Filter category
   * @param {Element} buttonElement - Filter button element
   */
  async filterGallery(category, buttonElement) {
    try {
      // Update active states
      this.updateActiveFilter(buttonElement);
      
      // Stop all playing videos
      this.stopAllVideos();
      
      // Filter media items
      this.filteredMedia = category === 'all' 
        ? [...this.mediaItems]
        : this.mediaItems.filter(item => item.category === category);
      
      this.currentFilter = category;
      
      // Update status
      this.updateGalleryStatus(category, this.filteredMedia.length);
      
      // Show loading state
      this.showLoading();
      
      // Render filtered gallery
      await this.render();
      
    } catch (error) {
      this.showError();
    }
  }

  /**
   * Shuffle gallery items
   * @param {Element} buttonElement - Shuffle button element
   */
  async shuffleGallery(buttonElement) {
    try {
      // Update active states
      this.clearActiveFilters();
      DOM.toggleClass(buttonElement, GALLERY_CONFIG.CLASSES.ACTIVE, true);
      
      // Stop all playing videos
      this.stopAllVideos();
      
      // Shuffle media items
      this.filteredMedia = [...this.mediaItems].sort(() => Math.random() - 0.5);
      this.currentFilter = 'shuffle';
      
      // Update status
      this.updateGalleryStatus('shuffle', this.filteredMedia.length);
      
      // Show loading state
      this.showLoading();
      
      // Render shuffled gallery
      await this.render();
      
    } catch (error) {
      this.showError();
    }
  }

  /**
   * Change gallery view
   * @param {string} viewType - View type ('grid' or 'masonry')
   * @param {Element} buttonElement - View button element
   */
  changeView(viewType, buttonElement) {
    try {
      // Update active view button
      DOM.getAll('.view-option').forEach(btn => {
        DOM.toggleClass(btn, GALLERY_CONFIG.CLASSES.ACTIVE, false);
      });
      DOM.toggleClass(buttonElement, GALLERY_CONFIG.CLASSES.ACTIVE, true);

      // Update gallery grid class
      const galleryGrid = DOM.get(GALLERY_CONFIG.SELECTORS.GALLERY_GRID);
      if (galleryGrid) {
        galleryGrid.classList.remove(GALLERY_CONFIG.CLASSES.GRID_VIEW, GALLERY_CONFIG.CLASSES.MASONRY_VIEW);
        galleryGrid.classList.add(`${viewType}-view`);

        // For masonry view, ensure proper layout after class change
        if (viewType === 'masonry') {
          Performance.raf(() => {
            this.adjustMasonryLayout();
          });
        }
      }

      this.currentView = viewType;

    } catch (error) {
      // Change view error handled silently
    }
  }

  /**
   * Adjust masonry layout for proper item positioning
   */
  adjustMasonryLayout() {
    const galleryGrid = DOM.get(GALLERY_CONFIG.SELECTORS.GALLERY_GRID);
    if (!galleryGrid) return;

    const items = galleryGrid.querySelectorAll(`.${GALLERY_CONFIG.CLASSES.GALLERY_ITEM}`);
    items.forEach((item, index) => {
      // Force reflow to ensure proper masonry positioning
      item.style.gridRowEnd = 'span 1';
      Performance.raf(() => {
        // For masonry layout, we need to calculate the actual height of each item
        // and set grid-row-end accordingly to create the masonry effect
        const mediaElement = item.querySelector('.gallery-item__media');
        if (mediaElement) {
          // Wait for image/video to load to get proper dimensions
          if (mediaElement.complete || mediaElement.readyState >= 2) {
            this.setMasonrySpan(item, mediaElement);
          } else {
            // If not loaded yet, wait for load event
            DOM.on(mediaElement, 'load', () => {
              this.setMasonrySpan(item, mediaElement);
            }, { once: true });
          }
        }
      });
    });
  }

  /**
   * Set the grid-row-end span for masonry layout based on media dimensions
   * @param {Element} item - Gallery item element
   * @param {Element} mediaElement - Media element (img or video)
   */
  setMasonrySpan(item, mediaElement) {
    const rect = mediaElement.getBoundingClientRect();
    const aspectRatio = rect.width / rect.height;

    // Calculate how many grid rows this item should span
    // Base this on the aspect ratio - taller items span more rows
    let span = Math.ceil(aspectRatio * 8); // Adjust multiplier for desired effect

    // Ensure minimum and maximum spans
    span = Math.max(8, Math.min(20, span)); // Min 8 rows, max 20 rows

    item.style.gridRowEnd = `span ${span}`;
  }

  /**
   * Update active filter button
   * @param {Element} activeButton - Active button element
   */
  updateActiveFilter(activeButton) {
    DOM.getAll(`.${GALLERY_CONFIG.CLASSES.FILTER_TAB}`).forEach(btn => {
      DOM.toggleClass(btn, GALLERY_CONFIG.CLASSES.ACTIVE, false);
    });
    DOM.toggleClass(activeButton, GALLERY_CONFIG.CLASSES.ACTIVE, true);
  }

  /**
   * Clear all active filters
   */
  clearActiveFilters() {
    DOM.getAll(`.${GALLERY_CONFIG.CLASSES.FILTER_TAB}`).forEach(btn => {
      DOM.toggleClass(btn, GALLERY_CONFIG.CLASSES.ACTIVE, false);
    });
    DOM.getAll(`.${GALLERY_CONFIG.CLASSES.ACTION_BUTTON}`).forEach(btn => {
      DOM.toggleClass(btn, GALLERY_CONFIG.CLASSES.ACTIVE, false);
    });
  }

  /**
   * Update gallery status display
   * @param {string} category - Current category
   * @param {number} count - Item count
   */
  updateGalleryStatus(category, count) {
    const currentFilterElement = DOM.get(GALLERY_CONFIG.SELECTORS.CURRENT_FILTER);
    const itemCountElement = DOM.get(GALLERY_CONFIG.SELECTORS.ITEM_COUNT);
    
    if (currentFilterElement) {
      const categoryName = GALLERY_CONFIG.CATEGORIES[category]?.name || 'Todas las piezas';
      currentFilterElement.textContent = categoryName;
    }
    
    if (itemCountElement) {
      itemCountElement.textContent = `${count} elemento${count !== 1 ? 's' : ''}`;
    }
  }

  /**
   * Show loading state
   */
  showLoading() {
    const galleryGrid = DOM.get(GALLERY_CONFIG.SELECTORS.GALLERY_GRID);
    if (galleryGrid) {
      galleryGrid.innerHTML = `
        <div class="${GALLERY_CONFIG.CLASSES.GALLERY_LOADER}">
          <div class="gallery__spinner"></div>
          <p class="gallery__loading-text">Preparando la colección...</p>
        </div>
      `;
    }
  }

  /**
   * Show error state
   */
  showError() {
    const galleryGrid = DOM.get(GALLERY_CONFIG.SELECTORS.GALLERY_GRID);
    if (galleryGrid) {
      galleryGrid.innerHTML = `
        <div class="gallery__empty">
          <i class="gallery__empty-icon fas fa-exclamation-triangle"></i>
          <h3 class="gallery__empty-title">Error al cargar la galería</h3>
          <p class="gallery__empty-description">Por favor, intente nuevamente más tarde.</p>
        </div>
      `;
    }
  }

  /**
   * Render gallery
   */
  async render() {
    const galleryGrid = DOM.get(GALLERY_CONFIG.SELECTORS.GALLERY_GRID);
    if (!galleryGrid) {
      return;
    }

    try {
      // Clear existing content
      galleryGrid.innerHTML = '';

      // Check if there are items to display
      if (this.filteredMedia.length === 0) {
        this.showEmptyState();
        return;
      }

      // Create gallery items
      const fragment = document.createDocumentFragment();
      
      await Promise.all(
        this.filteredMedia.map(async (item, index) => {
          if (!Validator.isValidMediaItem(item)) {
            return;
          }

          const galleryItem = await this.createGalleryItem(item, index);
          if (galleryItem) {
            fragment.appendChild(galleryItem);
          }
        })
      );

      galleryGrid.appendChild(fragment);

      // Setup intersection observer for visible items
      Performance.raf(() => {
        const items = galleryGrid.querySelectorAll(`.${GALLERY_CONFIG.CLASSES.GALLERY_ITEM}`);
        items.forEach(item => {
          if (this.intersectionObserver) {
            this.intersectionObserver.observe(item);
          } else {
            // Fallback for browsers without intersection observer
            setTimeout(() => {
              item.classList.add(GALLERY_CONFIG.CLASSES.VISIBLE);
            }, index * 50);
          }
        });
      });

    } catch (error) {
      this.showError();
    }
  }

  /**
   * Show empty state
   */
  showEmptyState() {
    const galleryGrid = DOM.get(GALLERY_CONFIG.SELECTORS.GALLERY_GRID);
    if (galleryGrid) {
      galleryGrid.innerHTML = `
        <div class="gallery__empty">
          <i class="gallery__empty-icon fas fa-search"></i>
          <h3 class="gallery__empty-title">No se encontraron elementos</h3>
          <p class="gallery__empty-description">Intenta con otro filtro o categoría.</p>
        </div>
      `;
    }
  }

  /**
   * Create gallery item element
   * @param {Object} item - Media item data
   * @param {number} index - Item index
   * @returns {Promise<Element>} Gallery item element
   */
  async createGalleryItem(item, index) {
    try {
      const galleryItem = DOM.create('div', {
        className: `${GALLERY_CONFIG.CLASSES.GALLERY_ITEM}`,
        attributes: {
          'data-category': item.category,
          'data-index': index,
          'data-type': item.type
        }
      });

      // Create media element
      let mediaElement;
      let controls = '';

      if (item.type === 'video') {
        mediaElement = DOM.create('video', {
          className: 'gallery-item__media',
          attributes: {
            src: item.src,
            muted: 'true',
            loop: 'true',
            preload: 'metadata'
          }
        });

        controls = `
          <div class="gallery-item__video-controls">
            <button class="video-play-button" data-src="${item.src}">
              <i class="fas fa-play"></i>
            </button>
          </div>
        `;
      } else {
        mediaElement = DOM.create('img', {
          className: 'gallery-item__media',
          attributes: {
            src: item.src,
            alt: item.title,
            loading: 'lazy'
          }
        });
      }

      // Create overlay
      const overlay = DOM.create('div', {
        className: 'gallery-item__overlay',
        innerHTML: `
          <div class="gallery-item__title">${item.title}</div>
          <div class="gallery-item__description">${item.description}</div>
        `
      });

      // Assemble gallery item
      galleryItem.appendChild(mediaElement);
      if (controls) galleryItem.insertAdjacentHTML('beforeend', controls);
      galleryItem.appendChild(overlay);

      // Add event listeners
      this.setupGalleryItemEvents(galleryItem, item, index);

      // Add error handling for media
      this.setupMediaErrorHandling(mediaElement);

      return galleryItem;

    } catch (error) {
      return null;
    }
  }

  /**
   * Setup gallery item event listeners
   * @param {Element} galleryItem - Gallery item element
   * @param {Object} item - Media item data
   * @param {number} index - Item index
   */
  setupGalleryItemEvents(galleryItem, item, index) {
    // Touch/click events for opening modal
    this.setupTouchEvents(galleryItem, index);

    // Video controls
    if (item.type === 'video') {
      const playButton = galleryItem.querySelector('.video-play-button');
      if (playButton) {
        DOM.on(playButton, 'click', (e) => {
          e.stopPropagation();
          this.toggleVideo(galleryItem, item.src);
        });
      }
    }
  }

  /**
   * Setup touch events for gallery item
   * @param {Element} galleryItem - Gallery item element
   * @param {number} index - Item index
   */
  setupTouchEvents(galleryItem, index) {
    let touchStartTime = 0;
    let touchStartPos = { x: 0, y: 0 };

    // Touch start
    DOM.on(galleryItem, 'touchstart', (e) => {
      touchStartTime = Date.now();
      touchStartPos = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
      DOM.toggleClass(galleryItem, GALLERY_CONFIG.CLASSES.TOUCHING, true);
    }, { passive: true });

    // Touch end
    DOM.on(galleryItem, 'touchend', (e) => {
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

      // Check if it's a tap
      if (touchDuration < GALLERY_CONFIG.TOUCH.MAX_TAP_DURATION && 
          moveDistance < GALLERY_CONFIG.TOUCH.MAX_TAP_DISTANCE) {
        
        if (!e.target.closest('.gallery-item__video-controls')) {
          this.openModal(index);
        }
      }

      DOM.toggleClass(galleryItem, GALLERY_CONFIG.CLASSES.TOUCHING, false);
    }, { passive: true });

    // Touch cancel
    DOM.on(galleryItem, 'touchcancel', () => {
      DOM.toggleClass(galleryItem, GALLERY_CONFIG.CLASSES.TOUCHING, false);
    }, { passive: true });

    // Click event for non-touch devices
    DOM.on(galleryItem, 'click', (e) => {
      if (!e.target.closest('.gallery-item__video-controls')) {
        this.openModal(index);
      }
    });
  }

  /**
   * Setup media error handling
   * @param {Element} mediaElement - Media element
   */
  setupMediaErrorHandling(mediaElement) {
    DOM.on(mediaElement, 'error', () => {
      this.handleMediaError(mediaElement);
    });
  }

  /**
   * Handle media loading error
   * @param {Element} mediaElement - Failed media element
   */
  handleMediaError(mediaElement) {
    const placeholder = DOM.create('div', {
      className: 'gallery-item__error',
      innerHTML: `
        <i class="fas fa-exclamation-triangle"></i>
        <p>${GALLERY_CONFIG.MESSAGES.MEDIA_ERROR}</p>
      `
    });

    if (mediaElement.parentNode) {
      mediaElement.parentNode.replaceChild(placeholder, mediaElement);
    }
  }

  /**
   * Toggle video playback
   * @param {Element} galleryItem - Gallery item element
   * @param {string} videoSrc - Video source URL
   */
  toggleVideo(galleryItem, videoSrc) {
    const video = galleryItem.querySelector('video');
    const playButton = galleryItem.querySelector('.video-play-button');
    const icon = playButton.querySelector('i');
    
    if (!video) return;

    if (video.paused) {
      // Stop all other videos first
      this.stopAllVideos();
      
      video.play().then(() => {
        icon.className = 'fas fa-pause';
        DOM.toggleClass(playButton, GALLERY_CONFIG.CLASSES.PLAYING, true);
        DOM.toggleClass(galleryItem, GALLERY_CONFIG.CLASSES.PLAYING, true);
        this.playingVideos.add(videoSrc);
      }).catch(error => {
        // Video play error handled silently
      });
    } else {
      video.pause();
      icon.className = 'fas fa-play';
      DOM.toggleClass(playButton, GALLERY_CONFIG.CLASSES.PLAYING, false);
      DOM.toggleClass(galleryItem, GALLERY_CONFIG.CLASSES.PLAYING, false);
      this.playingVideos.delete(videoSrc);
    }
  }

  /**
   * Stop all playing videos
   */
  stopAllVideos() {
    DOM.getAll('video').forEach(video => {
      if (!video.paused) {
        video.pause();
        const galleryItem = video.closest(`.${GALLERY_CONFIG.CLASSES.GALLERY_ITEM}`);
        if (galleryItem) {
          const playButton = galleryItem.querySelector('.video-play-button');
          const icon = playButton?.querySelector('i');
          
          if (icon) icon.className = 'fas fa-play';
          if (playButton) DOM.toggleClass(playButton, GALLERY_CONFIG.CLASSES.PLAYING, false);
          DOM.toggleClass(galleryItem, GALLERY_CONFIG.CLASSES.PLAYING, false);
        }
      }
    });
    this.playingVideos.clear();
  }

  /**
   * Open modal with media item
   * @param {number} index - Media item index
   */
  openModal(index) {
    // This will be handled by the ModalManager
    if (window.galleryModal) {
      window.galleryModal.open(index);
    }
  }

  /**
   * Render featured carousel
   */
  async renderFeaturedCarousel() {
    const carousel = DOM.get(GALLERY_CONFIG.SELECTORS.FEATURED_CAROUSEL);
    if (!carousel) {
      return;
    }

    try {
      // Get featured items
      const featuredItems = this.mediaItems.filter(item => item.featured);
      
      if (featuredItems.length === 0) {
        carousel.innerHTML = `
          <div class="featured__empty">
            <p>No hay piezas destacadas disponibles</p>
          </div>
        `;
        return;
      }

      // Clear existing content
      carousel.innerHTML = '';

      // Create carousel items
      for (let i = 0; i < featuredItems.length; i++) {
        const item = featuredItems[i];
        const carouselItem = this.createCarouselItem(item, i);
        carousel.appendChild(carouselItem);
      }

      // Setup carousel navigation
      this.setupCarouselNavigation(featuredItems);
      this.setupCarouselIndicators(featuredItems);

    } catch (error) {
      carousel.innerHTML = `
        <div class="featured__error">
          <i class="fas fa-exclamation-triangle"></i>
          <p>Error al cargar las piezas destacadas</p>
        </div>
      `;
    }
  }

  /**
   * Create carousel item
   * @param {Object} item - Media item
   * @param {number} index - Item index
   * @returns {Element} Carousel item element
   */
  createCarouselItem(item, index) {
    const isVideo = item.type === 'video';
    const carouselItem = DOM.create('div', {
      className: `featured__item ${isVideo ? 'is-video' : ''}`,
      attributes: {
        'data-index': index,
        'data-src': item.src,
        'data-type': item.type
      }
    });

    if (isVideo) {
      // For videos, create a thumbnail or first frame with pause functionality
      carouselItem.innerHTML = `
        <video class="featured__item-media featured__video-clickable" muted preload="metadata">
          <source src="${item.src}" type="video/mp4">
        </video>
        <div class="featured__video-overlay">
          <div class="featured__video-indicator">
            <i class="fas fa-play"></i>
          </div>
        </div>
      `;
    } else {
      carouselItem.innerHTML = `
        <img class="featured__item-media" src="${item.src}" alt="${item.title}" loading="lazy">
      `;
    }

    // Add click handler with video pause/play functionality
    DOM.on(carouselItem, 'click', (e) => {
      const clickedVideo = e.target.closest('video.featured__video-clickable');
      
      if (clickedVideo && isVideo) {
        // Handle video play/pause directly
        e.preventDefault();
        e.stopPropagation();
        this.toggleCarouselVideo(carouselItem, clickedVideo);
      } else if (!isVideo || !e.target.closest('.featured__video-overlay')) {
        // Open modal for images or when clicking outside video overlay
        const galleryIndex = this.mediaItems.findIndex(galleryItem => galleryItem.src === item.src);
        if (galleryIndex !== -1) {
          this.openModal(galleryIndex);
        }
      }
    });

    // Add video end event listener for auto-pause
    if (isVideo) {
      const video = carouselItem.querySelector('video.featured__video-clickable');
      if (video) {
        DOM.on(video, 'ended', () => {
          this.handleCarouselVideoEnd(carouselItem, video);
        });
      }
    }

    return carouselItem;
  }

  /**
   * Setup carousel navigation
   * @param {Array} featuredItems - Featured items array
   */
  setupCarouselNavigation(featuredItems) {
    const carousel = DOM.get(GALLERY_CONFIG.SELECTORS.FEATURED_CAROUSEL);
    const prevButton = DOM.get(GALLERY_CONFIG.SELECTORS.CAROUSEL_PREV);
    const nextButton = DOM.get(GALLERY_CONFIG.SELECTORS.CAROUSEL_NEXT);
    
    if (!carousel || !prevButton || !nextButton) return;

    let currentIndex = 0;
    
    const getItemWidth = () => {
      // Detect screen size and return appropriate width + gap
      if (window.innerWidth >= 1280) {
        return 380 + 32; // Large desktop: item + gap
      } else if (window.innerWidth >= 1024) {
        return 350 + 24; // Desktop: item + gap  
      } else if (window.innerWidth >= 768) {
        return 320 + 16; // Tablet: item + gap
      }
      return 280 + 16; // Mobile: item + gap
    };

    const updateCarouselPosition = () => {
      if (window.innerWidth >= 1024) {
        // Desktop: Use transform instead of scrollTo
        const itemWidth = getItemWidth();
        const translateX = -(currentIndex * itemWidth);
        carousel.style.transform = `translateX(${translateX}px)`;
        carousel.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)';
      } else {
        // Mobile/Tablet: Use scroll behavior
        const itemWidth = getItemWidth();
        const scrollPosition = currentIndex * itemWidth;
        carousel.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      }
      this.updateCarouselIndicators(currentIndex);
    };

    // Previous button
    DOM.on(prevButton, 'click', () => {
      currentIndex = Math.max(0, currentIndex - 1);
      updateCarouselPosition();
    });

    // Next button
    DOM.on(nextButton, 'click', () => {
      const maxIndex = Math.max(0, featuredItems.length - 1);
      currentIndex = Math.min(maxIndex, currentIndex + 1);
      updateCarouselPosition();
    });

    // Touch/swipe and mouse drag support
    let startX = 0;
    let startY = 0;
    let isDragging = false;
    let isMouseDrag = false;

    // Touch events
    DOM.on(carousel, 'touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isDragging = true;
    }, { passive: true });

    DOM.on(carousel, 'touchmove', (e) => {
      if (!isDragging) return;
      // Only prevent default for horizontal swipes to allow vertical page scrolling
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const deltaX = Math.abs(currentX - startX);
      const deltaY = Math.abs(currentY - startY);
      
      // Only prevent if horizontal swipe is more dominant than vertical
      if (deltaX > deltaY && deltaX > 10) {
        e.preventDefault();
      }
    });

    DOM.on(carousel, 'touchend', (e) => {
      if (!isDragging) return;
      
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      
      if (Math.abs(diff) > 50) { // Minimum swipe distance
        if (diff > 0) {
          // Swipe left - next
          const maxIndex = Math.max(0, featuredItems.length - 1);
          currentIndex = Math.min(maxIndex, currentIndex + 1);
        } else {
          // Swipe right - previous
          currentIndex = Math.max(0, currentIndex - 1);
        }
        updateCarouselPosition();
      }
      
      isDragging = false;
    });

    // Mouse drag events for desktop
    DOM.on(carousel, 'mousedown', (e) => {
      if (window.innerWidth >= 1024) {
        startX = e.clientX;
        isMouseDrag = true;
        carousel.style.cursor = 'grabbing';
        // Disable transition during drag
        carousel.style.transition = 'none';
        e.preventDefault();
      }
    });

    DOM.on(document, 'mousemove', (e) => {
      if (!isMouseDrag) return;
      // Only prevent default when actually dragging the carousel
      e.preventDefault();
    });

    DOM.on(document, 'mouseup', (e) => {
      if (!isMouseDrag) return;
      
      const endX = e.clientX;
      const diff = startX - endX;
      
      if (Math.abs(diff) > 50) { // Minimum drag distance
        if (diff > 0) {
          // Drag left - next
          const maxIndex = Math.max(0, featuredItems.length - 1);
          currentIndex = Math.min(maxIndex, currentIndex + 1);
        } else {
          // Drag right - previous
          currentIndex = Math.max(0, currentIndex - 1);
        }
      }
      
      // Re-enable transition and update position
      updateCarouselPosition();
      isMouseDrag = false;
      carousel.style.cursor = 'grab';
    });

    // Mouse wheel support for desktop - only when hovering carousel
    DOM.on(carousel, 'wheel', (e) => {
      if (window.innerWidth >= 1024) {
        // Only prevent default if the user is directly interacting with carousel
        const rect = carousel.getBoundingClientRect();
        const isHoveringCarousel = e.clientX >= rect.left && e.clientX <= rect.right &&
                                   e.clientY >= rect.top && e.clientY <= rect.bottom;
        
        if (isHoveringCarousel) {
          e.preventDefault();
          e.stopPropagation();
          
          if (e.deltaY > 0) {
            // Scroll down/right - next
            const maxIndex = Math.max(0, featuredItems.length - 1);
            currentIndex = Math.min(maxIndex, currentIndex + 1);
          } else {
            // Scroll up/left - previous
            currentIndex = Math.max(0, currentIndex - 1);
          }
          
          updateCarouselPosition();
        }
      }
    }, { passive: false });

    // Keyboard navigation for desktop - only when carousel is focused or hovered
    let isCarouselFocused = false;
    
    DOM.on(carousel, 'mouseenter', () => {
      isCarouselFocused = true;
    });
    
    DOM.on(carousel, 'mouseleave', () => {
      isCarouselFocused = false;
    });
    
    DOM.on(document, 'keydown', (e) => {
      if (window.innerWidth >= 1024 && isCarouselFocused && DOM.isInViewport(carousel)) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          currentIndex = Math.max(0, currentIndex - 1);
          updateCarouselPosition();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          const maxIndex = Math.max(0, featuredItems.length - 1);
          currentIndex = Math.min(maxIndex, currentIndex + 1);
          updateCarouselPosition();
        }
      }
    });
  }

  /**
   * Setup carousel indicators
   * @param {Array} featuredItems - Featured items array
   */
  setupCarouselIndicators(featuredItems) {
    const indicatorsContainer = DOM.get(GALLERY_CONFIG.SELECTORS.CAROUSEL_INDICATORS);
    if (!indicatorsContainer) return;

    indicatorsContainer.innerHTML = '';

    for (let i = 0; i < featuredItems.length; i++) {
      const indicator = DOM.create('div', {
        className: `featured__indicator ${i === 0 ? 'is-active' : ''}`,
        attributes: { 'data-index': i }
      });

      DOM.on(indicator, 'click', () => {
        const carousel = DOM.get(GALLERY_CONFIG.SELECTORS.FEATURED_CAROUSEL);
        if (carousel) {
          // Use the same responsive width calculation
          const getItemWidth = () => {
            if (window.innerWidth >= 1280) {
              return 380 + 32;
            } else if (window.innerWidth >= 1024) {
              return 350 + 24;
            } else if (window.innerWidth >= 768) {
              return 320 + 16;
            }
            return 280 + 16;
          };
          
          const itemWidth = getItemWidth();
          
          if (window.innerWidth >= 1024) {
            // Desktop: Use transform
            const translateX = -(i * itemWidth);
            carousel.style.transform = `translateX(${translateX}px)`;
            carousel.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)';
          } else {
            // Mobile/Tablet: Use scroll behavior
            const scrollPosition = i * itemWidth;
            carousel.scrollTo({
              left: scrollPosition,
              behavior: 'smooth'
            });
          }
          
          this.updateCarouselIndicators(i);
        }
      });

      indicatorsContainer.appendChild(indicator);
    }
  }

  /**
   * Update carousel indicators
   * @param {number} activeIndex - Active indicator index
   */
  updateCarouselIndicators(activeIndex) {
    const indicators = DOM.getAll('.featured__indicator');
    indicators.forEach((indicator, index) => {
      DOM.toggleClass(indicator, 'is-active', index === activeIndex);
    });
  }

  /**
   * Toggle carousel video play/pause with visual feedback
   * @param {Element} carouselItem - Carousel item container
   * @param {Element} video - Video element
   */
  toggleCarouselVideo(carouselItem, video) {
    const overlay = carouselItem.querySelector('.featured__video-overlay');
    const indicator = carouselItem.querySelector('.featured__video-indicator i');
    
    if (!video || !indicator) return;

    try {
      if (video.paused) {
        // Play video
        video.play().then(() => {
          indicator.className = 'fas fa-pause';
          carouselItem.classList.add('is-playing');
          this.showVideoFeedback(overlay, 'Reproduciendo');
        }).catch(error => {
          this.showVideoFeedback(overlay, 'Error');
        });
      } else {
        // Pause video
        video.pause();
        indicator.className = 'fas fa-play';
        carouselItem.classList.remove('is-playing');
        this.showVideoFeedback(overlay, 'Pausado');
      }
    } catch (error) {
      // Error toggling carousel video handled silently
    }
  }

  /**
   * Handle carousel video end - auto-pause and reset indicator
   * @param {Element} carouselItem - Carousel item container
   * @param {Element} video - Video element
   */
  handleCarouselVideoEnd(carouselItem, video) {
    const overlay = carouselItem.querySelector('.featured__video-overlay');
    const indicator = carouselItem.querySelector('.featured__video-indicator i');
    
    if (!video || !indicator) return;

    try {
      // Reset video state
      indicator.className = 'fas fa-play';
      carouselItem.classList.remove('is-playing');
      
      // Show completion feedback
      this.showVideoFeedback(overlay, 'Video completado');
      
      // Optional: Reset video to beginning for next play
      video.currentTime = 0;
      
    } catch (error) {
      // Error handling carousel video end
    }
  }

  /**
   * Show temporary visual feedback for video interaction
   * @param {Element} overlay - Video overlay element
   * @param {string} message - Feedback message
   */
  showVideoFeedback(overlay, message) {
    if (!overlay) return;
    
    // Remove existing feedback
    const existingFeedback = overlay.querySelector('.featured__video-feedback');
    if (existingFeedback) {
      existingFeedback.remove();
    }
    
    // Create feedback element
    const feedback = DOM.create('div', {
      className: 'featured__video-feedback',
      innerHTML: `<span>${message}</span>`
    });
    
    overlay.appendChild(feedback);
    
    // Show with animation
    setTimeout(() => {
      feedback.classList.add('is-visible');
    }, 10);
    
    // Hide after delay
    setTimeout(() => {
      feedback.classList.remove('is-visible');
      setTimeout(() => {
        if (feedback.parentNode) {
          feedback.parentNode.removeChild(feedback);
        }
      }, 300);
    }, 1500);
  }

  /**
   * Cleanup and destroy
   */
  destroy() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    
    this.stopAllVideos();
    
    // Remove event listeners
    DOM.getAll(`.${GALLERY_CONFIG.CLASSES.GALLERY_ITEM}`).forEach(item => {
      item.replaceWith(item.cloneNode(true));
    });
    
    this.mediaItems = [];
    this.filteredMedia = [];
    this.playingVideos.clear();
  }
}

export default GalleryCore;