/**
 * Gallery Configuration Module
 * Centralized configuration for the emerald gallery
 */

export const GALLERY_CONFIG = {
  // Performance settings
  PERFORMANCE: {
    PARTICLES_DESKTOP: 30,
    PARTICLES_MOBILE: 15,
    GEMS_DESKTOP: 15,
    GEMS_MOBILE: 8,
    INTERSECTION_THRESHOLD: 0.1,
    INTERSECTION_ROOT_MARGIN: '50px',
    DEBOUNCE_DELAY: 250,
    LOADING_DELAY: 200,
  },

  // Animation settings
  ANIMATIONS: {
    TRANSITION_FAST: 150,
    TRANSITION_BASE: 250,
    TRANSITION_SLOW: 350,
    MODAL_ANIMATION_DURATION: 400,
    LOADER_PROGRESS_INTERVAL: 200,
  },

  // Breakpoints
  BREAKPOINTS: {
    MOBILE: 768,
    TABLET: 1024,
    DESKTOP: 1280,
  },

  // Categories mapping
  CATEGORIES: {
    all: { name: 'Todas las piezas', icon: 'fa-grip' },
    videos: { name: 'Videos', icon: 'fa-play-circle' },
    coleccion1: { name: 'Colección Premium', icon: 'fa-gem' },
    coleccion2: { name: 'Colección Exclusiva', icon: 'fa-star' },
    coleccion3: { name: 'Colección Royal', icon: 'fa-crown' },
    shuffle: { name: 'Orden aleatorio', icon: 'fa-shuffle' },
  },

  // Elements selectors
  SELECTORS: {
    // Containers
    PARTICLES_CONTAINER: '#particles',
    FLOATING_GEMS_CONTAINER: '#floatingGems',
    GALLERY_GRID: '#galleryGrid',
    FEATURED_CAROUSEL: '#carousel',
    
    // Navigation
    NAV_BUTTON: '#backButton',
    SCROLL_TO_TOP: '#scrollToTop',
    
    // Modal
    MODAL: '#modal',
    MODAL_IMAGE: '#modalImage',
    MODAL_VIDEO: '#modalVideo',
    MODAL_TITLE: '#modalTitle',
    MODAL_DESCRIPTION: '#modalDescription',
    MODAL_COUNTER: '#modalCounter',
    MODAL_CATEGORY: '#modalCategory',
    
    // Controls
    MODAL_CLOSE: '#modalClose',
    MODAL_PREV: '#modalPrev',
    MODAL_NEXT: '#modalNext',
    MODAL_PLAY_PAUSE: '#modalPlayPauseBtn',
    MODAL_MUTE: '#modalMuteBtn',
    MODAL_FULLSCREEN: '#modalFullscreenBtn',
    MODAL_PROGRESS: '#modalProgress',
    MODAL_PROGRESS_BAR: '#modalProgressBar',
    MODAL_CONTROLS: '#modalVideoControls',
    
    // Stats and counters
    TOTAL_ITEMS: '#totalItems',
    COUNT_ALL: '#countAll',
    COUNT_VIDEOS: '#countVideos',
    COUNT_COL1: '#countCol1',
    COUNT_COL2: '#countCol2',
    COUNT_COL3: '#countCol3',
    CURRENT_FILTER: '#currentFilter',
    ITEM_COUNT: '#itemCount',
    
    // Loader
    PAGE_LOADER: '#pageLoader',
    LOAD_PROGRESS: '#loadProgress',
    
    // Carousel
    CAROUSEL_PREV: '#carouselPrev',
    CAROUSEL_NEXT: '#carouselNext',
    CAROUSEL_INDICATORS: '#carouselIndicators',
  },

  // CSS Classes
  CLASSES: {
    // States
    ACTIVE: 'is-active',
    VISIBLE: 'is-visible',
    PLAYING: 'is-playing',
    TOUCHING: 'is-touching',
    LOADED: 'is-loaded',
    
    // Gallery
    GALLERY_ITEM: 'gallery-item',
    GALLERY_LOADER: 'gallery__loading',
    FILTER_TAB: 'filter-tab',
    ACTION_BUTTON: 'action-button',
    VIEW_OPTION: 'view-option',
    
    // Featured
    FEATURED_ITEM: 'featured__item',
    FEATURED_INDICATOR: 'featured__indicator',
    
    // Modal
    MODAL_CONTAINER: 'modal__container',
    MODAL_MEDIA: 'modal__media',
    
    // Effects
    PARTICLE: 'particle',
    FLOATING_GEM: 'floating-gem',
    
    // Layout
    GRID_VIEW: 'grid-view',
    MASONRY_VIEW: 'masonry-view',
  },

  // Media items data structure
  MEDIA_ITEMS: [
    { 
      src: 'assets/img/eralda11.jpg', 
      type: 'image', 
      category: 'coleccion1', 
      title: 'Esmeralda Premium', 
      description: 'Gema de alta calidad con corte perfecto',
      featured: true
    },
    { 
      src: 'assets/img/gema1.jpg', 
      type: 'image', 
      category: 'coleccion2', 
      title: 'Esmeralda Natural', 
      description: 'Piedra preciosa colombiana sin tratamientos',
      featured: false
    },
    { 
      src: 'assets/video/esmeralda.mp4', 
      type: 'video', 
      category: 'videos', 
      title: 'Video Esmeralda', 
      description: 'Presentación de nuestra colección premium',
      featured: true
    },
    { 
      src: 'assets/img/gema2.jpg', 
      type: 'image', 
      category: 'coleccion3', 
      title: 'Esmeralda Exclusiva', 
      description: 'Calidad excepcional con certificación GIA',
      featured: false
    },
    { 
      src: 'assets/img/gema3.jpg', 
      type: 'image', 
      category: 'coleccion1', 
      title: 'Esmeralda Brillante', 
      description: 'Corte perfecto con máximo brillo',
      featured: true
    },
    { 
      src: 'assets/video/esmeralda01.mp4', 
      type: 'video', 
      category: 'videos', 
      title: 'Presentación Premium', 
      description: 'Esmeralda de alta calidad bajo luz natural',
      featured: false
    },
    { 
      src: 'assets/img/gema4.jpg', 
      type: 'image', 
      category: 'coleccion2', 
      title: 'Esmeralda Verde Intenso', 
      description: 'Color verde profundo característico',
      featured: false
    },
    { 
      src: 'assets/img/gema5.jpg', 
      type: 'image', 
      category: 'coleccion3', 
      title: 'Esmeralda Pura', 
      description: 'Sin tratamientos, pureza natural',
      featured: true
    },
    { 
      src: 'assets/img/gema6.jpg', 
      type: 'image', 
      category: 'coleccion1', 
      title: 'Esmeralda Única', 
      description: 'Pieza especial de colección limitada',
      featured: false
    },
    { 
      src: 'assets/video/esmeralda6.mp4', 
      type: 'video', 
      category: 'videos', 
      title: 'Colores Naturales', 
      description: 'Presentación con colores vivos y luz natural',
      featured: true
    },
    { 
      src: 'assets/img/gema9.jpg', 
      type: 'image', 
      category: 'coleccion2', 
      title: 'Esmeralda Transparente', 
      description: 'Claridad excepcional y transparencia perfecta',
      featured: false
    },
    { 
      src: 'assets/img/gema11.jpg', 
      type: 'image', 
      category: 'coleccion3', 
      title: 'Esmeralda Facetada', 
      description: 'Múltiples caras que realzan su belleza',
      featured: false
    },
    { 
      src: 'assets/img/gema12.jpg', 
      type: 'image', 
      category: 'coleccion1', 
      title: 'Esmeralda Cabujón', 
      description: 'Forma redondeada clásica y elegante',
      featured: true
    },
    { 
      src: 'assets/img/gema13.jpg', 
      type: 'image', 
      category: 'coleccion2', 
      title: 'Esmeralda Oval', 
      description: 'Corte tradicional de alta precisión',
      featured: false
    },
    { 
      src: 'assets/img/gema16.jpg', 
      type: 'image', 
      category: 'coleccion3', 
      title: 'Esmeralda Gota', 
      description: 'Forma geométrica distintiva y moderna',
      featured: false
    },
    { 
      src: 'assets/img/gema15.jpg', 
      type: 'image', 
      category: 'coleccion1', 
      title: 'Esmeralda Corazón', 
      description: 'Forma natural excepcional',
      featured: true
    },
    { 
      src: 'assets/img/gema17.jpg', 
      type: 'image', 
      category: 'coleccion2', 
      title: 'Esmeralda Corazón Natural', 
      description: 'Forma natural excepcional y única',
      featured: false
    },
    { 
      src: 'assets/img/gema18.jpg', 
      type: 'image', 
      category: 'coleccion3', 
      title: 'Esmeralda Rectangular', 
      description: 'Forma geométrica perfectamente definida',
      featured: false
    },
    { 
      src: 'assets/img/gema19.jpg', 
      type: 'image', 
      category: 'coleccion1', 
      title: 'Esmeralda Pera', 
      description: 'Elegante forma de lágrima',
      featured: false
    },
    { 
      src: 'assets/img/gema20.jpg', 
      type: 'image', 
      category: 'coleccion2', 
      title: 'Esmeralda Princesa', 
      description: 'Corte cuadrado de máxima elegancia',
      featured: true
    },
    { 
      src: 'assets/video/esmeralda8.mp4', 
      type: 'video', 
      category: 'videos', 
      title: 'Esmeralda Natural', 
      description: 'Color natural en su máxima expresión',
      featured: false
    }
  ],

  // Touch and gesture settings
  TOUCH: {
    MIN_SWIPE_DISTANCE: 50,
    MAX_TAP_DURATION: 300,
    MAX_TAP_DISTANCE: 10,
  },

  // Keyboard shortcuts
  KEYBOARD: {
    ESCAPE: 'Escape',
    ARROW_LEFT: 'ArrowLeft',
    ARROW_RIGHT: 'ArrowRight',
    SPACE: ' ',
    KEY_F: 'f',
    KEY_M: 'm',
    KEY_I: 'i',
  },

  // Error messages
  MESSAGES: {
    MEDIA_ERROR: 'Media no disponible',
    LOADING_ERROR: 'Error al cargar la galería',
    VIDEO_ERROR: 'Video no disponible',
    IMAGE_ERROR: 'Imagen no disponible',
  },
};

export default GALLERY_CONFIG;