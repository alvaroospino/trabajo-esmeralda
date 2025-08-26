/**
 * Gallery Application - Main Entry Point
 * Professional emerald gallery with modular architecture
 */

import { GALLERY_CONFIG } from './modules/config.js';
import { DOM, Performance, Animation } from './modules/utils.js';
import { GalleryCore } from './modules/gallery-core.js';
import { ModalManager } from './modules/modal-manager.js';

/**
 * Gallery Application Class
 * Coordinates all gallery components and functionality
 */
class GalleryApp {
  constructor() {
    this.galleryCore = null;
    this.modalManager = null;
    this.isInitialized = false;
    this.particles = [];
    this.floatingGems = [];
    
    this.init();
  }

  /**
   * Initialize the application
   */
  async init() {
    try {
      
      // Show page loader
      this.showPageLoader();
      
      // Initialize core components
      await this.initializeCore();
      
      // Setup global functionality
      this.setupGlobalFeatures();
      
      // Hide page loader
      await this.hidePageLoader();
      
      this.isInitialized = true;
      
    } catch (error) {
      this.handleInitializationError(error);
    }
  }

  /**
   * Initialize core components
   */
  async initializeCore() {
    // Initialize gallery core
    this.galleryCore = new GalleryCore();
    
    // Initialize modal manager
    this.modalManager = new ModalManager();
    this.modalManager.setMediaItems(GALLERY_CONFIG.MEDIA_ITEMS);
    
    // Expose to global scope for HTML onclick handlers
    window.galleryCore = this.galleryCore;
    window.galleryModal = this.modalManager;
    
    // Wait for core to be ready
    await new Promise(resolve => {
      const checkReady = () => {
        if (this.galleryCore.isInitialized) {
          resolve();
        } else {
          setTimeout(checkReady, 100);
        }
      };
      checkReady();
    });
  }

  /**
   * Setup global features
   */
  setupGlobalFeatures() {
    this.createParticleSystem();
    this.createFloatingGems();
    this.setupScrollToTop();
    this.setupNavigationButton();
    this.setupViewportHeight();
    this.setupPerformanceOptimizations();
    this.updateDateYear();
  }

  /**
   * Show page loader with progress animation
   */
  showPageLoader() {
    const loader = DOM.get(GALLERY_CONFIG.SELECTORS.PAGE_LOADER);
    if (loader) {
      DOM.toggleClass(loader, GALLERY_CONFIG.CLASSES.LOADED, false);
      
      // Animate progress bar
      let progress = 0;
      const progressBar = DOM.get(GALLERY_CONFIG.SELECTORS.LOAD_PROGRESS);
      
      const progressInterval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress >= 95) {
          progress = 95;
          clearInterval(progressInterval);
        }
        
        if (progressBar) {
          progressBar.style.width = progress + '%';
        }
      }, GALLERY_CONFIG.ANIMATIONS.LOADER_PROGRESS_INTERVAL);
      
      this.progressInterval = progressInterval;
    }
  }

  /**
   * Hide page loader
   */
  async hidePageLoader() {
    // Complete progress bar
    const progressBar = DOM.get(GALLERY_CONFIG.SELECTORS.LOAD_PROGRESS);
    if (progressBar) {
      progressBar.style.width = '100%';
    }
    
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
    
    // Wait a moment before hiding
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const loader = DOM.get(GALLERY_CONFIG.SELECTORS.PAGE_LOADER);
    if (loader) {
      DOM.toggleClass(loader, GALLERY_CONFIG.CLASSES.LOADED, true);
      
      // Remove from DOM after transition
      setTimeout(() => {
        if (loader.parentNode) {
          loader.parentNode.removeChild(loader);
        }
      }, 500);
    }
  }

  /**
   * Create particle system
   */
  createParticleSystem() {
    const container = DOM.get(GALLERY_CONFIG.SELECTORS.PARTICLES_CONTAINER);
    if (!container) return;

    const particleCount = Performance.isMobile() 
      ? GALLERY_CONFIG.PERFORMANCE.PARTICLES_MOBILE 
      : GALLERY_CONFIG.PERFORMANCE.PARTICLES_DESKTOP;

    // Clear existing particles
    container.innerHTML = '';
    this.particles = [];

    for (let i = 0; i < particleCount; i++) {
      const particle = DOM.create('div', {
        className: GALLERY_CONFIG.CLASSES.PARTICLE,
        attributes: {
          'style': `
            left: ${Math.random() * 100}%;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            animation-delay: ${Math.random() * 25}s;
            animation-duration: ${Math.random() * 15 + 15}s;
          `
        }
      });

      container.appendChild(particle);
      this.particles.push(particle);
    }
  }

  /**
   * Create floating gems
   */
  createFloatingGems() {
    const container = DOM.get(GALLERY_CONFIG.SELECTORS.FLOATING_GEMS_CONTAINER);
    if (!container) return;

    const gemCount = Performance.isMobile()
      ? GALLERY_CONFIG.PERFORMANCE.GEMS_MOBILE
      : GALLERY_CONFIG.PERFORMANCE.GEMS_DESKTOP;

    const gemIcons = ['fas fa-gem', 'fas fa-star', 'fas fa-sparkles'];

    // Clear existing gems
    container.innerHTML = '';
    this.floatingGems = [];

    for (let i = 0; i < gemCount; i++) {
      const gem = DOM.create('div', {
        className: GALLERY_CONFIG.CLASSES.FLOATING_GEM,
        innerHTML: `<i class="${gemIcons[Math.floor(Math.random() * gemIcons.length)]}"></i>`,
        attributes: {
          'style': `
            left: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 20}s;
            animation-duration: ${Math.random() * 10 + 15}s;
          `
        }
      });

      container.appendChild(gem);
      this.floatingGems.push(gem);
    }
  }

  /**
   * Setup scroll to top functionality
   */
  setupScrollToTop() {
    const scrollButton = DOM.get(GALLERY_CONFIG.SELECTORS.SCROLL_TO_TOP);
    if (!scrollButton) return;

    // Show/hide based on scroll position
    const handleScroll = Performance.throttle(() => {
      const shouldShow = window.pageYOffset > 300;
      DOM.toggleClass(scrollButton, GALLERY_CONFIG.CLASSES.VISIBLE, shouldShow);
    }, 100);

    DOM.on(window, 'scroll', handleScroll, { passive: true });

    // Click handler
    DOM.on(scrollButton, 'click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /**
   * Setup navigation button
   */
  setupNavigationButton() {
    const navButton = DOM.get(GALLERY_CONFIG.SELECTORS.NAV_BUTTON);
    if (!navButton) return;

    // Add ripple effect on click
    DOM.on(navButton, 'click', (e) => {
      this.createRippleEffect(e.target, e);
    });
  }

  /**
   * Create ripple effect
   * @param {Element} element - Target element
   * @param {Event} event - Click event
   */
  createRippleEffect(element, event) {
    const ripple = DOM.create('span', {
      className: 'ripple-effect',
      attributes: {
        'style': `
          position: absolute;
          border-radius: 50%;
          background: rgba(0, 255, 127, 0.6);
          transform: scale(0);
          animation: ripple 0.6s ease-out;
          pointer-events: none;
        `
      }
    });

    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = size + 'px';
    ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';

    element.style.position = 'relative';
    element.appendChild(ripple);

    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  }

  /**
   * Setup viewport height for mobile
   */
  setupViewportHeight() {
    const updateVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    updateVH();
    DOM.on(window, 'resize', Performance.debounce(updateVH, 100));
    DOM.on(window, 'orientationchange', updateVH);
  }

  /**
   * Setup performance optimizations
   */
  setupPerformanceOptimizations() {
    // Reduce particles on low-end devices
    this.optimizeForBattery();
    this.optimizeForConnection();
    this.handleResizeOptimization();
  }

  /**
   * Optimize for battery level
   */
  async optimizeForBattery() {
    if ('getBattery' in navigator) {
      try {
        const battery = await navigator.getBattery();
        if (battery.level < 0.2) {
          this.enableLowPowerMode();
        }
      } catch (error) {
        // Battery API not available
      }
    }
  }

  /**
   * Optimize for connection speed
   */
  optimizeForConnection() {
    const connection = Performance.getConnectionType();
    if (connection === 'slow-2g' || connection === '2g') {
      this.enableLowPowerMode();
    }
  }

  /**
   * Enable low power mode
   */
  enableLowPowerMode() {
    
    // Hide particles and floating gems
    const particles = DOM.get(GALLERY_CONFIG.SELECTORS.PARTICLES_CONTAINER);
    const gems = DOM.get(GALLERY_CONFIG.SELECTORS.FLOATING_GEMS_CONTAINER);
    
    if (particles) particles.style.display = 'none';
    if (gems) gems.style.display = 'none';
    
    // Disable transitions
    document.documentElement.style.setProperty('--transition-fast', 'none');
    document.documentElement.style.setProperty('--transition-base', 'none');
    document.documentElement.style.setProperty('--transition-slow', 'none');
    
    document.body.classList.add('low-power-mode');
  }

  /**
   * Handle resize optimization
   */
  handleResizeOptimization() {
    let resizeTimeout;
    let lastWidth = window.innerWidth;

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (window.innerWidth !== lastWidth) {
          // Only recreate particles if width changed significantly
          if (Math.abs(window.innerWidth - lastWidth) > 100) {
            this.createParticleSystem();
            this.createFloatingGems();
          }
          lastWidth = window.innerWidth;
        }
      }, GALLERY_CONFIG.PERFORMANCE.DEBOUNCE_DELAY);
    };

    DOM.on(window, 'resize', handleResize);
  }

  /**
   * Update current year in footer
   */
  updateDateYear() {
    const dateElement = DOM.get('#date');
    if (dateElement) {
      dateElement.textContent = new Date().getFullYear();
    }
  }

  /**
   * Handle initialization error
   * @param {Error} error - Initialization error
   */
  handleInitializationError(error) {
    
    // Hide loader
    const loader = DOM.get(GALLERY_CONFIG.SELECTORS.PAGE_LOADER);
    if (loader) {
      DOM.toggleClass(loader, GALLERY_CONFIG.CLASSES.LOADED, true);
    }
    
    // Show error message
    const galleryGrid = DOM.get(GALLERY_CONFIG.SELECTORS.GALLERY_GRID);
    if (galleryGrid) {
      galleryGrid.innerHTML = `
        <div class="gallery__empty">
          <i class="gallery__empty-icon fas fa-exclamation-triangle"></i>
          <h3 class="gallery__empty-title">Error al cargar la galería</h3>
          <p class="gallery__empty-description">Por favor, recarga la página para intentar de nuevo.</p>
          <button onclick="window.location.reload()" class="action-button" style="margin-top: 1rem;">
            <i class="fas fa-refresh"></i> Recargar página
          </button>
        </div>
      `;
    }
  }

  /**
   * Cleanup and destroy
   */
  destroy() {
    if (this.galleryCore) {
      this.galleryCore.destroy();
    }
    
    if (this.modalManager) {
      this.modalManager.destroy();
    }
    
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
    
    // Clear particle systems
    this.particles = [];
    this.floatingGems = [];
    
    // Remove global references
    delete window.galleryCore;
    delete window.galleryModal;
    
    this.isInitialized = false;
  }
}

// CSS for ripple effect
const rippleCss = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;

// Add ripple CSS to document
const style = document.createElement('style');
style.textContent = rippleCss;
document.head.appendChild(style);

// Initialize the application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.galleryApp = new GalleryApp();
  });
} else {
  window.galleryApp = new GalleryApp();
}

// Handle page unload
window.addEventListener('beforeunload', () => {
  if (window.galleryApp) {
    window.galleryApp.destroy();
  }
});

export default GalleryApp;