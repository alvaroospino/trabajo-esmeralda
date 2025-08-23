// Función para manejar los videos
function setupVideoHandlers() {
    const videoCards = document.querySelectorAll('.video-card');

    videoCards.forEach(card => {
        const video = card.querySelector('.emerald-video');
        const overlay = card.querySelector('.video-overlay');
        const playBtn = card.querySelector('.play-btn');
        
        if (!video || !overlay || !playBtn) return;

        const togglePlayPause = () => {
            if (video.paused) {
                video.play();
                overlay.style.opacity = '0';
            } else {
                video.pause();
                overlay.style.opacity = '1';
            }
        };

        // Click en el botón de reproducción
        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            togglePlayPause();
        });

        // Click en el video
        video.addEventListener('click', () => {
            togglePlayPause();
        });

        // Mostrar overlay cuando el video termine
        video.addEventListener('ended', () => {
            overlay.style.opacity = '1';
        });

        // Mostrar overlay cuando el video esté pausado
        video.addEventListener('pause', () => {
            overlay.style.opacity = '1';
        });

        // Ocultar overlay cuando el video esté reproduciéndose
        video.addEventListener('play', () => {
            overlay.style.opacity = '0';
        });
    });
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', setupVideoHandlers);
