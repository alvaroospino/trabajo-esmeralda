/**
 * Modal Manager Module
 * Handles modal functionality for the gallery
 */

import { GALLERY_CONFIG } from './config.js';
import { DOM, Performance, Animation } from './utils.js';

/**
 * Modal Manager Class
 * Manages modal display and interactions
 */
export class ModalManager {
  constructor() {
    this.isOpen = false;
    this.currentIndex = 0;
    this.mediaItems = [];
    this.keyboardHandler = null;
    
    // Ensure body overflow is reset on initialization
    document.body.style.overflow = '';
    
    this.init();
  }

  /**
   * Initialize modal manager
   */
  init() {
    this.bindEvents();
    this.setupKeyboardNavigation();
  }

  /**
   * Set media items
   * @param {Array} mediaItems - Array of media items
   */
  setMediaItems(mediaItems) {
    this.mediaItems = mediaItems;
  }

  /**
   * Open modal with specific item
   * @param {number} index - Item index
   */
  open(index = 0) {
    if (this.mediaItems.length === 0) return;
    
    this.currentIndex = Math.max(0, Math.min(index, this.mediaItems.length - 1));
    this.isOpen = true;
    
    const modal = DOM.get(GALLERY_CONFIG.SELECTORS.MODAL);
    if (modal) {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      
      setTimeout(() => {
        modal.classList.add('is-open');
        this.loadCurrentMedia();
      }, 10);
    }
  }

  /**
   * Close modal
   */
  close() {
    // Always restore body overflow, even if modal is not open
    document.body.style.overflow = '';
    
    if (!this.isOpen) return;
    
    const modal = DOM.get(GALLERY_CONFIG.SELECTORS.MODAL);
    if (modal) {
      modal.classList.remove('is-open');
      
      setTimeout(() => {
        modal.style.display = 'none';
        this.clearMedia();
      }, 300);
    }
    
    this.isOpen = false;
  }

  /**
   * Navigate to previous item
   */
  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.loadCurrentMedia();
    }
  }

  /**
   * Navigate to next item
   */
  next() {
    if (this.currentIndex < this.mediaItems.length - 1) {
      this.currentIndex++;
      this.loadCurrentMedia();
    }
  }

  /**
   * Load current media item
   */
  loadCurrentMedia() {
    const item = this.mediaItems[this.currentIndex];
    if (!item) {
      return;
    }

    // Update modal info
    this.updateModalInfo(item);
    
    // Show loading
    this.showLoading();
    
    // Clear previous media
    this.clearMedia();
    
    // Load new media
    if (item.type === 'video') {
      this.loadVideo(item.src);
    } else {
      this.loadImage(item.src);
    }
  }

  /**
   * Update modal information
   * @param {Object} item - Media item
   */
  updateModalInfo(item) {
    const title = DOM.get(GALLERY_CONFIG.SELECTORS.MODAL_TITLE);
    const description = DOM.get(GALLERY_CONFIG.SELECTORS.MODAL_DESCRIPTION);
    const counter = DOM.get(GALLERY_CONFIG.SELECTORS.MODAL_COUNTER);
    const category = DOM.get(GALLERY_CONFIG.SELECTORS.MODAL_CATEGORY);
    
    if (title) title.textContent = item.title || 'Esmeralda';
    if (description) description.textContent = item.description || '';
    if (counter) counter.textContent = `${this.currentIndex + 1} / ${this.mediaItems.length}`;
    if (category) {
      const categoryName = GALLERY_CONFIG.CATEGORIES[item.category]?.name || item.category;
      category.textContent = categoryName;
    }
  }

  /**
   * Show loading state
   */
  showLoading() {
    const loader = DOM.get('#mediaLoader');
    if (loader) {
      loader.style.display = 'flex';
    }
  }

  /**
   * Hide loading state
   */
  hideLoading() {
    const loader = DOM.get('#mediaLoader');
    if (loader) {
      loader.style.display = 'none';
    }
  }

  /**
   * Load image
   * @param {string} src - Image source
   */
  loadImage(src) {
    const modalImage = DOM.get(GALLERY_CONFIG.SELECTORS.MODAL_IMAGE);
    const modalVideo = DOM.get(GALLERY_CONFIG.SELECTORS.MODAL_VIDEO);
    const videoControls = DOM.get(GALLERY_CONFIG.SELECTORS.MODAL_CONTROLS);
    
    if (modalVideo) modalVideo.style.display = 'none';
    
    // Hide video controls for images
    if (videoControls) {
      videoControls.style.display = 'none';
      videoControls.classList.remove('is-visible');
    }
    
    if (modalImage) {
      modalImage.onload = () => {
        this.hideLoading();
        modalImage.style.display = 'block';
      };
      
      modalImage.onerror = () => {
        this.hideLoading();
        this.showError('Image not available');
      };
      
      modalImage.src = src;
    }
  }

  /**
   * Load video
   * @param {string} src - Video source
   */
  loadVideo(src) {
    const modalImage = DOM.get(GALLERY_CONFIG.SELECTORS.MODAL_IMAGE);
    const modalVideo = DOM.get(GALLERY_CONFIG.SELECTORS.MODAL_VIDEO);
    const videoControls = DOM.get(GALLERY_CONFIG.SELECTORS.MODAL_CONTROLS);
    const videoPlayButton = DOM.get('#modalVideoPlay');
    const modalContent = DOM.get('.modal__content');
    
    if (modalImage) modalImage.style.display = 'none';
    
    if (modalVideo) {
      modalVideo.onloadeddata = () => {
        this.hideLoading();
        modalVideo.style.display = 'block';
        
        // Show centered play button
        if (videoPlayButton) {
          videoPlayButton.style.display = 'block';
        }
        
        // Show video controls
        if (videoControls) {
          videoControls.style.display = 'flex';
          videoControls.classList.add('is-visible');
        }
        
        // Setup video controls first
        this.setupVideoControls(modalVideo);
        this.setupCenteredPlayButton(modalVideo, modalContent);
        // Add click-to-pause last to avoid conflicts
        this.setupVideoClickPause(modalVideo);
      };
      
      // Also try with loadedmetadata event for better compatibility
      modalVideo.onloadedmetadata = () => {
        if (videoControls && videoControls.style.display !== 'flex') {
          videoControls.style.display = 'flex';
          videoControls.classList.add('is-visible');
          this.setupVideoControls(modalVideo);
        }
        if (videoPlayButton && videoPlayButton.style.display !== 'block') {
          videoPlayButton.style.display = 'block';
          this.setupCenteredPlayButton(modalVideo, modalContent);
        }
        // Setup click-to-pause functionality
        this.setupVideoClickPause(modalVideo);
      };
      
      modalVideo.onerror = () => {
        this.hideLoading();
        this.showError('Video not available');
      };
      
      modalVideo.src = src;
      modalVideo.load(); // Force reload
      
      // Backup: Show controls after a small delay if they're not shown
      setTimeout(() => {
        if (videoControls && videoControls.style.display !== 'flex') {
          videoControls.style.display = 'flex';
          videoControls.classList.add('is-visible');
          this.setupVideoControls(modalVideo);
        }
        if (videoPlayButton && videoPlayButton.style.display !== 'block') {
          videoPlayButton.style.display = 'block';
          this.setupCenteredPlayButton(modalVideo, modalContent);
        }
        // Setup click-to-pause functionality
        this.setupVideoClickPause(modalVideo);
      }, 500);
    }
  }

  /**
   * Clear current media
   */
  clearMedia() {
    const modalImage = DOM.get(GALLERY_CONFIG.SELECTORS.MODAL_IMAGE);
    const modalVideo = DOM.get(GALLERY_CONFIG.SELECTORS.MODAL_VIDEO);
    
    if (modalImage) {
      modalImage.style.display = 'none';
      modalImage.src = '';
    }
    
    if (modalVideo) {
      modalVideo.style.display = 'none';
      modalVideo.pause();
      modalVideo.src = '';
      
      // Clean up click-to-pause handler
      if (modalVideo._clickToPauseHandler) {
        modalVideo.removeEventListener('click', modalVideo._clickToPauseHandler);
        delete modalVideo._clickToPauseHandler;
      }
    }
    
    // Hide video controls and centered play button
    const videoControls = DOM.get(GALLERY_CONFIG.SELECTORS.MODAL_CONTROLS);
    const videoPlayButton = DOM.get('#modalVideoPlay');
    const modalContent = DOM.get('.modal__content');
    
    if (videoControls) {
      videoControls.style.display = 'none';
      videoControls.classList.remove('is-visible');
    }
    
    if (videoPlayButton) {
      videoPlayButton.style.display = 'none';
    }
    
    if (modalContent) {
      modalContent.classList.remove('is-playing');
    }
  }

  /**
   * Setup video controls functionality
   * @param {HTMLVideoElement} video - Video element
   */
  setupVideoControls(video) {
    if (!video) {
      return;
    }

    const playPauseBtn = DOM.get(GALLERY_CONFIG.SELECTORS.MODAL_PLAY_PAUSE);
    const muteBtn = DOM.get(GALLERY_CONFIG.SELECTORS.MODAL_MUTE);
    const fullscreenBtn = DOM.get(GALLERY_CONFIG.SELECTORS.MODAL_FULLSCREEN);

    // Play/Pause button
    if (playPauseBtn) {
      // Remove previous event listeners
      const newPlayPauseBtn = playPauseBtn.cloneNode(true);
      playPauseBtn.parentNode.replaceChild(newPlayPauseBtn, playPauseBtn);
      
      DOM.on(newPlayPauseBtn, 'click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (video.paused) {
          video.play().catch(error => {
            // Error playing video
          });
        } else {
          video.pause();
        }
      });
    }

    // Mute button
    if (muteBtn) {
      // Remove previous event listeners
      const newMuteBtn = muteBtn.cloneNode(true);
      muteBtn.parentNode.replaceChild(newMuteBtn, muteBtn);
      
      DOM.on(newMuteBtn, 'click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        video.muted = !video.muted;
        const icon = newMuteBtn.querySelector('i');
        if (icon) {
          icon.className = video.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
        }
      });
    }

    // Fullscreen button
    if (fullscreenBtn) {
      // Remove previous event listeners
      const newFullscreenBtn = fullscreenBtn.cloneNode(true);
      fullscreenBtn.parentNode.replaceChild(newFullscreenBtn, fullscreenBtn);
      
      DOM.on(newFullscreenBtn, 'click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (video.requestFullscreen) {
          video.requestFullscreen();
        } else if (video.webkitRequestFullscreen) {
          video.webkitRequestFullscreen();
        } else if (video.mozRequestFullScreen) {
          video.mozRequestFullScreen();
        } else if (video.msRequestFullscreen) {
          video.msRequestFullscreen();
        }
      });
    }

    // Video event listeners
    DOM.on(video, 'play', () => {
      const playPauseIcon = DOM.get(GALLERY_CONFIG.SELECTORS.MODAL_PLAY_PAUSE + ' i');
      if (playPauseIcon) {
        playPauseIcon.className = 'fas fa-pause';
      }
      
      // Also hide centered button when video starts from controls
      const modalContent = DOM.get('.modal__content');
      if (modalContent) {
        modalContent.classList.add('is-playing');
      }
    });

    DOM.on(video, 'pause', () => {
      const playPauseIcon = DOM.get(GALLERY_CONFIG.SELECTORS.MODAL_PLAY_PAUSE + ' i');
      if (playPauseIcon) {
        playPauseIcon.className = 'fas fa-play';
      }
      
      // Show centered button when video is paused
      const modalContent = DOM.get('.modal__content');
      if (modalContent) {
        modalContent.classList.remove('is-playing');
      }
    });

    DOM.on(video, 'ended', () => {
      const playPauseIcon = DOM.get(GALLERY_CONFIG.SELECTORS.MODAL_PLAY_PAUSE + ' i');
      if (playPauseIcon) {
        playPauseIcon.className = 'fas fa-play';
      }
      
      // Show centered button when video ends
      const modalContent = DOM.get('.modal__content');
      if (modalContent) {
        modalContent.classList.remove('is-playing');
      }
      
      // Reset video to beginning for next play
      video.currentTime = 0;
    });

    // Initialize button states
    const playPauseIcon = DOM.get(GALLERY_CONFIG.SELECTORS.MODAL_PLAY_PAUSE + ' i');
    if (playPauseIcon) {
      playPauseIcon.className = 'fas fa-play';
    }
    
    const muteIcon = DOM.get(GALLERY_CONFIG.SELECTORS.MODAL_MUTE + ' i');
    if (muteIcon) {
      muteIcon.className = video.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
    }
  }

  /**
   * Setup centered play button functionality
   * @param {HTMLVideoElement} video - Video element
   * @param {Element} modalContent - Modal content container
   */
  setupCenteredPlayButton(video, modalContent) {
    if (!video || !modalContent) return;

    const centeredPlayBtn = DOM.get('#modalCenteredPlayBtn');
    if (!centeredPlayBtn) {
      return;
    }

    // Remove previous event listener
    const newCenteredPlayBtn = centeredPlayBtn.cloneNode(true);
    centeredPlayBtn.parentNode.replaceChild(newCenteredPlayBtn, centeredPlayBtn);

    // Add click event listener
    DOM.on(newCenteredPlayBtn, 'click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (video.paused) {
        // Hide button immediately when clicked
        modalContent.classList.add('is-playing');
        
        video.play().then(() => {
          // Ensure it stays hidden
          modalContent.classList.add('is-playing');
        }).catch(error => {
          // Show button again if there's an error
          modalContent.classList.remove('is-playing');
        });
      }
    });

    // Video event listeners for centered button
    DOM.on(video, 'play', () => {
      modalContent.classList.add('is-playing');
    });

    DOM.on(video, 'pause', () => {
      modalContent.classList.remove('is-playing');
    });

    DOM.on(video, 'ended', () => {
      modalContent.classList.remove('is-playing');
      // Reset video to beginning for next play
      video.currentTime = 0;
    });
  }

  /**
   * Setup video click-to-pause functionality
   * @param {HTMLVideoElement} video - Video element
   */
  setupVideoClickPause(video) {
    if (!video) return;

    // Remove any existing click listener to prevent duplicates
    if (video._clickToPauseHandler) {
      video.removeEventListener('click', video._clickToPauseHandler);
    }

    // Create the click handler
    const clickHandler = (e) => {
      // Don't interfere with control buttons
      if (e.target.closest('.modal__video-controls') || 
          e.target.closest('.modal__video-play')) {
        return;
      }
      
      e.preventDefault();
      e.stopPropagation();
      
      if (video.paused) {
        video.play().then(() => {
          this.showModalVideoFeedback('Reproduciendo');
        }).catch(error => {
          this.showModalVideoFeedback('Error');
        });
      } else {
        video.pause();
        this.showModalVideoFeedback('Pausado');
      }
    };

    // Store reference and add listener
    video._clickToPauseHandler = clickHandler;
    DOM.on(video, 'click', clickHandler);
  }

  /**
   * Show temporary visual feedback for modal video interaction
   * @param {string} message - Feedback message
   */
  showModalVideoFeedback(message) {
    const modalContent = DOM.get('.modal__content');
    if (!modalContent) return;
    
    // Remove existing feedback
    const existingFeedback = modalContent.querySelector('.modal__video-feedback');
    if (existingFeedback) {
      existingFeedback.remove();
    }
    
    // Create feedback element
    const feedback = DOM.create('div', {
      className: 'modal__video-feedback',
      innerHTML: `<span>${message}</span>`
    });
    
    modalContent.appendChild(feedback);
    
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
   * Show error message
   * @param {string} message - Error message
   */
  showError(message) {
    // This could be enhanced with a proper error display
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Close button
    const closeBtn = DOM.get(GALLERY_CONFIG.SELECTORS.MODAL_CLOSE);
    if (closeBtn) {
      DOM.on(closeBtn, 'click', () => this.close());
    }

    // Navigation buttons
    const prevBtn = DOM.get(GALLERY_CONFIG.SELECTORS.MODAL_PREV);
    const nextBtn = DOM.get(GALLERY_CONFIG.SELECTORS.MODAL_NEXT);
    
    if (prevBtn) {
      DOM.on(prevBtn, 'click', () => this.prev());
    }
    
    if (nextBtn) {
      DOM.on(nextBtn, 'click', () => this.next());
    }

    // Click outside to close
    const modal = DOM.get(GALLERY_CONFIG.SELECTORS.MODAL);
    if (modal) {
      DOM.on(modal, 'click', (e) => {
        if (e.target === modal) {
          this.close();
        }
      });
    }
  }

  /**
   * Setup keyboard navigation
   */
  setupKeyboardNavigation() {
    this.keyboardHandler = (e) => {
      if (!this.isOpen) return;
      
      switch (e.key) {
        case GALLERY_CONFIG.KEYBOARD.ESCAPE:
          this.close();
          break;
        case GALLERY_CONFIG.KEYBOARD.ARROW_LEFT:
          this.prev();
          break;
        case GALLERY_CONFIG.KEYBOARD.ARROW_RIGHT:
          this.next();
          break;
      }
    };

    DOM.on(document, 'keydown', this.keyboardHandler);
  }

  /**
   * Destroy modal manager
   */
  destroy() {
    this.close();
    
    if (this.keyboardHandler) {
      DOM.off(document, 'keydown', this.keyboardHandler);
    }
    
    this.mediaItems = [];
  }
}

export default ModalManager;