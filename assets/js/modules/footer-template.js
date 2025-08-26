/**
 * Footer Template Module
 * Plantilla unificada para el footer en ambas páginas
 * @author Claude Code Assistant
 */

class FooterTemplate {
    constructor() {
        this.currentYear = new Date().getFullYear();
    }

    /**
     * Genera la plantilla HTML del footer
     * @param {string} page - Tipo de página ('index' o 'gallery')
     * @returns {string} HTML del footer
     */
    generateFooter(page = 'index') {
        const isGallery = page === 'gallery';
        
        return `
        <footer class="footer">
            <div class="footer__container">
                <div class="footer__brand">
                    <div class="footer__brand-emblem">
                        <i class="footer__brand-gem fas fa-gem"></i>
                        <i class="footer__brand-gem fas fa-gem"></i>
                        <i class="footer__brand-gem fas fa-gem"></i>
                    </div>
                    <div class="logo">
                        <img src="${isGallery ? '' : './'}assets/img/logo.png" class="logo-image" alt="Import Export - Esmeraldas Colombianas de Muzo Logo" />
                        <span class="logo-text">IMPORT EXPORT</span>
                    </div>
                    <p class="footer__brand-tagline">Colombian Emeralds Excellence</p>
                    <div class="footer__description">
                        <p>Especialistas en esmeraldas colombianas de la más alta calidad. Cada pieza representa décadas de experiencia y pasión por la excelencia gemológica.</p>
                    </div>
                </div>

                <div class="footer__nav">
                    <div class="footer__nav-section">
                        <h4 class="footer__nav-title">Navegación</h4>
                        <ul class="footer__nav-list">
                            <li><a href="${isGallery ? 'index.html' : '#inicio'}" class="footer__nav-link"><i class="footer__nav-icon fas fa-home"></i> Inicio</a></li>
                            <li><a href="${isGallery ? 'index.html#catalogo' : '#catalogo'}" class="footer__nav-link"><i class="footer__nav-icon fas fa-gem"></i> Catálogo</a></li>
                            <li><a href="${isGallery ? 'index.html#nosotros' : '#nosotros'}" class="footer__nav-link"><i class="footer__nav-icon fas fa-users"></i> Nosotros</a></li>
                            <li><a href="${isGallery ? 'index.html#contacto' : '#contacto'}" class="footer__nav-link"><i class="footer__nav-icon fas fa-envelope"></i> Contacto</a></li>
                            ${isGallery ? '<li><a href="#gallery" class="footer__nav-link"><i class="footer__nav-icon fas fa-images"></i> Galería</a></li>' : ''}
                        </ul>
                    </div>
                    
                    ${isGallery ? `
                    <div class="footer__nav-section">
                        <h4 class="footer__nav-title">Colecciones</h4>
                        <ul class="footer__nav-list">
                            <li><a href="#" class="footer__nav-link" onclick="window.galleryCore?.filterGallery('coleccion1')"><i class="footer__nav-icon fas fa-gem"></i> Premium</a></li>
                            <li><a href="#" class="footer__nav-link" onclick="window.galleryCore?.filterGallery('coleccion2')"><i class="footer__nav-icon fas fa-star"></i> Exclusiva</a></li>
                            <li><a href="#" class="footer__nav-link" onclick="window.galleryCore?.filterGallery('coleccion3')"><i class="footer__nav-icon fas fa-crown"></i> Royal</a></li>
                            <li><a href="#" class="footer__nav-link" onclick="window.galleryCore?.filterGallery('videos')"><i class="footer__nav-icon fas fa-play"></i> Videos</a></li>
                        </ul>
                    </div>
                    ` : ''}
                </div>
                
                <div class="footer__quality">
                    <div class="footer__quality-grid">
                        <div class="footer__seal">
                            <i class="footer__seal-icon fas fa-certificate"></i>
                            <span class="footer__seal-text">Certificado GIA</span>
                        </div>
                        <div class="footer__seal">
                            <i class="footer__seal-icon fas fa-shield-alt"></i>
                            <span class="footer__seal-text">100% Auténtico</span>
                        </div>
                        <div class="footer__seal">
                            <i class="footer__seal-icon fas fa-award"></i>
                            <span class="footer__seal-text">Calidad Premium</span>
                        </div>
                        <div class="footer__seal">
                            <i class="footer__seal-icon fas fa-globe-americas"></i>
                            <span class="footer__seal-text">Origen Colombia</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="footer__bottom">
                <div class="footer__copyright">
                    <p>&copy; <span id="date">${this.currentYear}</span> Import Export Colombian Emeralds. Todos los derechos reservados.</p>
                    <p class="footer__legal-notice">Galería Premium • Piezas Únicas • Certificación Internacional</p>
                </div>
            </div>
        </footer>`;
    }

    /**
     * Inyecta el footer en la página
     * @param {string} page - Tipo de página ('index' o 'gallery')
     */
    injectFooter(page = 'index') {
        const existingFooter = document.querySelector('footer');
        if (existingFooter) {
            existingFooter.outerHTML = this.generateFooter(page);
        } else {
            document.body.insertAdjacentHTML('beforeend', this.generateFooter(page));
        }
        
        // Actualizar el año dinámicamente
        this.updateYear();
    }

    /**
     * Actualiza el año en el footer
     */
    updateYear() {
        const dateElement = document.getElementById("date");
        if (dateElement) {
            dateElement.textContent = this.currentYear;
        }
    }

    /**
     * Inicializar el footer basado en la página actual
     */
    init() {
        const isGalleryPage = window.location.pathname.includes('galeria.html');
        const pageType = isGalleryPage ? 'gallery' : 'index';
        
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.injectFooter(pageType);
            });
        } else {
            this.injectFooter(pageType);
        }
    }
}

// Auto-inicialización si se incluye el script
if (typeof window !== 'undefined') {
    window.FooterTemplate = FooterTemplate;
    
    // Auto-init si no es un módulo ES6
    if (!document.currentScript?.hasAttribute('type') || document.currentScript.getAttribute('type') !== 'module') {
        const footerTemplate = new FooterTemplate();
        footerTemplate.init();
    }
}

// Export para módulos ES6
export default FooterTemplate;