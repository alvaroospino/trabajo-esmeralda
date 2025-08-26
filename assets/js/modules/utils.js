/**
 * Utility Functions Module
 * Common helper functions for the emerald gallery
 */

import { GALLERY_CONFIG } from './config.js';

/**
 * DOM Utilities
 */
export const DOM = {
  /**
   * Get element by selector with error handling
   * @param {string} selector - CSS selector
   * @returns {Element|null} DOM element or null
   */
  get(selector) {
    try {
      return document.querySelector(selector);
    } catch (error) {
      return null;
    }
  },

  /**
   * Get all elements by selector
   * @param {string} selector - CSS selector
   * @returns {NodeList} NodeList of elements
   */
  getAll(selector) {
    try {
      return document.querySelectorAll(selector);
    } catch (error) {
      return [];
    }
  },

  /**
   * Create element with attributes and classes
   * @param {string} tag - HTML tag name
   * @param {Object} options - Element options
   * @returns {Element} Created element
   */
  create(tag, options = {}) {
    const element = document.createElement(tag);
    
    if (options.className) {
      element.className = options.className;
    }
    
    if (options.attributes) {
      Object.entries(options.attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
    }
    
    if (options.innerHTML) {
      element.innerHTML = options.innerHTML;
    }
    
    if (options.textContent) {
      element.textContent = options.textContent;
    }
    
    return element;
  },

  /**
   * Add event listener with error handling
   * @param {Element} element - Target element
   * @param {string} event - Event type
   * @param {Function} handler - Event handler
   * @param {Object} options - Event options
   */
  on(element, event, handler, options = {}) {
    if (!element) return;
    
    try {
      element.addEventListener(event, handler, options);
    } catch (error) {
      // Failed to add event listener
    }
  },

  /**
   * Remove event listener
   * @param {Element} element - Target element
   * @param {string} event - Event type
   * @param {Function} handler - Event handler
   */
  off(element, event, handler) {
    if (!element) return;
    
    try {
      element.removeEventListener(event, handler);
    } catch (error) {
      // Failed to remove event listener
    }
  },

  /**
   * Toggle class on element
   * @param {Element} element - Target element
   * @param {string} className - Class name to toggle
   * @param {boolean} force - Force add/remove
   */
  toggleClass(element, className, force) {
    if (!element) return;
    element.classList.toggle(className, force);
  },

  /**
   * Check if element is in viewport
   * @param {Element} element - Target element
   * @returns {boolean} True if in viewport
   */
  isInViewport(element) {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
};

/**
 * Performance Utilities
 */
export const Performance = {
  /**
   * Debounce function execution
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in ms
   * @returns {Function} Debounced function
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func.apply(this, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Throttle function execution
   * @param {Function} func - Function to throttle
   * @param {number} limit - Time limit in ms
   * @returns {Function} Throttled function
   */
  throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * Request animation frame with fallback
   * @param {Function} callback - Callback function
   * @returns {number} Request ID
   */
  raf(callback) {
    return window.requestAnimationFrame 
      ? window.requestAnimationFrame(callback)
      : setTimeout(callback, 16);
  },

  /**
   * Cancel animation frame
   * @param {number} id - Request ID
   */
  cancelRaf(id) {
    if (window.cancelAnimationFrame) {
      window.cancelAnimationFrame(id);
    } else {
      clearTimeout(id);
    }
  },

  /**
   * Check if device is mobile
   * @returns {boolean} True if mobile device
   */
  isMobile() {
    return window.innerWidth < GALLERY_CONFIG.BREAKPOINTS.MOBILE;
  },

  /**
   * Check if device is tablet
   * @returns {boolean} True if tablet device
   */
  isTablet() {
    return window.innerWidth >= GALLERY_CONFIG.BREAKPOINTS.MOBILE && 
           window.innerWidth < GALLERY_CONFIG.BREAKPOINTS.DESKTOP;
  },

  /**
   * Check if user prefers reduced motion
   * @returns {boolean} True if prefers reduced motion
   */
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  /**
   * Check connection type for performance optimization
   * @returns {string} Connection type
   */
  getConnectionType() {
    if ('connection' in navigator) {
      return navigator.connection.effectiveType;
    }
    return 'unknown';
  }
};

/**
 * Animation Utilities
 */
export const Animation = {
  /**
   * Animate element with CSS transition
   * @param {Element} element - Target element
   * @param {Object} styles - CSS styles to apply
   * @param {number} duration - Animation duration in ms
   * @returns {Promise} Promise that resolves when animation ends
   */
  transition(element, styles, duration = GALLERY_CONFIG.ANIMATIONS.TRANSITION_BASE) {
    return new Promise((resolve) => {
      if (!element) {
        resolve();
        return;
      }

      const originalTransition = element.style.transition;
      element.style.transition = `all ${duration}ms ease`;

      Object.entries(styles).forEach(([property, value]) => {
        element.style[property] = value;
      });

      const handleTransitionEnd = () => {
        element.style.transition = originalTransition;
        element.removeEventListener('transitionend', handleTransitionEnd);
        resolve();
      };

      element.addEventListener('transitionend', handleTransitionEnd);
      
      // Fallback timeout
      setTimeout(resolve, duration + 50);
    });
  },

  /**
   * Fade in element
   * @param {Element} element - Target element
   * @param {number} duration - Animation duration
   * @returns {Promise} Animation promise
   */
  fadeIn(element, duration) {
    if (!element) return Promise.resolve();
    
    element.style.opacity = '0';
    element.style.display = 'block';
    
    return this.transition(element, { opacity: '1' }, duration);
  },

  /**
   * Fade out element
   * @param {Element} element - Target element
   * @param {number} duration - Animation duration
   * @returns {Promise} Animation promise
   */
  fadeOut(element, duration) {
    if (!element) return Promise.resolve();
    
    return this.transition(element, { opacity: '0' }, duration)
      .then(() => {
        element.style.display = 'none';
      });
  },

  /**
   * Slide up element
   * @param {Element} element - Target element
   * @param {number} duration - Animation duration
   * @returns {Promise} Animation promise
   */
  slideUp(element, duration) {
    if (!element) return Promise.resolve();
    
    element.style.transform = 'translateY(20px)';
    element.style.opacity = '0';
    
    return this.transition(element, {
      transform: 'translateY(0)',
      opacity: '1'
    }, duration);
  }
};

/**
 * Media Utilities
 */
export const Media = {
  /**
   * Preload image
   * @param {string} src - Image source
   * @returns {Promise} Promise that resolves when image loads
   */
  preloadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  },

  /**
   * Preload video metadata
   * @param {string} src - Video source
   * @returns {Promise} Promise that resolves when metadata loads
   */
  preloadVideo(src) {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.onloadedmetadata = () => resolve(video);
      video.onerror = reject;
      video.preload = 'metadata';
      video.src = src;
    });
  },

  /**
   * Format time duration
   * @param {number} seconds - Time in seconds
   * @returns {string} Formatted time string
   */
  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  },

  /**
   * Get media aspect ratio
   * @param {Element} mediaElement - Media element
   * @returns {number} Aspect ratio
   */
  getAspectRatio(mediaElement) {
    if (!mediaElement) return 1;
    
    const width = mediaElement.videoWidth || mediaElement.naturalWidth || mediaElement.clientWidth;
    const height = mediaElement.videoHeight || mediaElement.naturalHeight || mediaElement.clientHeight;
    
    return width / height || 1;
  }
};

/**
 * Storage Utilities
 */
export const Storage = {
  /**
   * Set localStorage item with error handling
   * @param {string} key - Storage key
   * @param {any} value - Value to store
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // Failed to save to localStorage
    }
  },

  /**
   * Get localStorage item with error handling
   * @param {string} key - Storage key
   * @param {any} defaultValue - Default value if not found
   * @returns {any} Retrieved value or default
   */
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      return defaultValue;
    }
  },

  /**
   * Remove localStorage item
   * @param {string} key - Storage key
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      // Failed to remove from localStorage
    }
  }
};

/**
 * Validation Utilities
 */
export const Validator = {
  /**
   * Check if value is valid URL
   * @param {string} url - URL to validate
   * @returns {boolean} True if valid URL
   */
  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Check if media item is valid
   * @param {Object} item - Media item to validate
   * @returns {boolean} True if valid
   */
  isValidMediaItem(item) {
    return item && 
           typeof item.src === 'string' && 
           typeof item.type === 'string' && 
           typeof item.category === 'string' &&
           typeof item.title === 'string';
  }
};

/**
 * Math Utilities
 */
export const Math = {
  /**
   * Clamp number between min and max
   * @param {number} value - Value to clamp
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number} Clamped value
   */
  clamp(value, min, max) {
    return window.Math.min(window.Math.max(value, min), max);
  },

  /**
   * Generate random number between min and max
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number} Random number
   */
  random(min, max) {
    return window.Math.random() * (max - min) + min;
  },

  /**
   * Linear interpolation
   * @param {number} start - Start value
   * @param {number} end - End value
   * @param {number} factor - Interpolation factor (0-1)
   * @returns {number} Interpolated value
   */
  lerp(start, end, factor) {
    return start + (end - start) * factor;
  }
};