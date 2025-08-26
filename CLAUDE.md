# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a luxury Colombian emerald jewelry website called "Import Export" featuring a modern, elegant design with glassmorphism effects and interactive multimedia galleries. The site showcases Colombian emeralds through image and video galleries with premium visual effects.

## Architecture

- **Frontend**: Static HTML5 website with vanilla JavaScript (ES6+)
- **Styling**: CSS3 with custom properties, glassmorphism design, responsive layout
- **Assets**: Organized in `/assets/` with separate folders for CSS, JS, images, and videos
- **Pages**: Main site (`index.html`) and dedicated gallery page (`galeria.html`)

## Key Components

### JavaScript Architecture
- `assets/js/script.js` - Main application class `EmeraldElite` with modular design
- `assets/js/gallery.js.js` - Gallery functionality with video handling and modal interactions
- `assets/js/carrusel.js` - Carousel component for image rotation
- `assets/js/video-handler.js` - Video playback and control management

### Styling System
- `assets/css/style.css` - Main styles with CSS custom properties for theming
- `assets/css/gallery.css` - Gallery-specific styles
- `assets/css/carrusel.css` - Carousel component styles  
- `assets/css/mobile-fixes.css` - Mobile-specific responsive adjustments

### Media Management
- Images stored in `assets/img/` (esmeralda*.jpg, gema*.jpg patterns)
- Videos in `assets/video/` (esmeralda*.mp4 patterns)
- Media items are configured in JavaScript arrays with metadata (title, description, category)

## Development Patterns

### CSS Custom Properties
The site uses a comprehensive CSS custom property system:
- Color scheme based on emerald greens (`--primary-green`, `--emerald-*` variants)
- Glassmorphism effects using `--glass-bg` and `--glass-border`
- Smooth transitions with `--transition-smooth` and `--transition-bounce`

### Interactive Components
- Modal system for full-screen media viewing with navigation controls
- Gallery filtering by categories (coleccion1, coleccion2, coleccion3, videos)
- Responsive carousel with touch/swipe support
- Particle animation system with performance optimization

### Mobile Optimization
- Reduced particle count on mobile devices (`window.innerWidth < 768`)
- Touch-friendly gallery navigation
- Responsive breakpoints in `mobile-fixes.css`

## Content Management

### Adding New Emeralds
1. Add images to `assets/img/` following naming convention (esmeralda*.jpg or gema*.jpg)
2. Update the `mediaItems` array in `assets/js/gallery.js.js` with new entries
3. Specify category (coleccion1, coleccion2, coleccion3) for filtering

### Video Content
1. Place video files in `assets/video/` (preferably .mp4 format)
2. Add video entries to `mediaItems` array with `type: 'video'`
3. Ensure video optimization for web delivery (compressed, appropriate resolution)

## Performance Considerations

- Images and videos should be web-optimized before adding
- Particle system automatically reduces count on mobile
- Video preloading is controlled to prevent excessive bandwidth usage
- Lazy loading implemented for gallery images

## Browser Compatibility

- Modern browsers with ES6+ support
- CSS Grid and Flexbox for layout
- CSS custom properties for theming
- Intersection Observer API for scroll animations