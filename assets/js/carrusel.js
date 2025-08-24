 // --- JAVASCRIPT PARA LA FUNCIONALIDAD DEL CARRUSEL ---

        document.addEventListener('DOMContentLoaded', () => {
            // 1. Obtenemos el elemento del carrusel UNA SOLA VEZ.
            const carousel = document.getElementById('carousel');
            
            // Verificación para evitar errores si el elemento no existiera.
            if (!carousel) {
                console.error("El elemento del carrusel con id='carousel' no fue encontrado.");
                return;
            }

            // Array con la información de las imágenes.
            const images = [
                { src: 'assets/img/eralda11.jpg', title: 'Esmeralda Trapiche' },
                { src: 'assets/img/esmeralda26.jpg', title: 'Esmeralda' },
                { src: 'assets/img/esmeralda27.jpg', title: ' Esmeralda' },
                { src: 'assets/img/esmeralda28.jpg', title: ' Esmeralda' },
                { src: 'assets/img/esmeralda1.jpg', title: 'Esmeralda' },
                { src: 'assets/img/esmeralda2.jpg', title: 'Esmeralda' },
                { src: 'assets/img/esmeralda3.jpg', title: 'Esmeralda' },
                { src: 'assets/img/esmeralda4.jpg', title: 'Esmeralda' },
                { src: 'assets/img/esmeralda5.jpg', title: 'Esmeralda' },
                { src: 'assets/img/esmeralda8.jpg', title: 'Esmeralda' },
                { src: 'assets/img/esmeralda10.jpg', title: 'Esmeralda' },
                { src: 'assets/img/esmeralda12.jpg', title: 'Esmeralda' }
            ];

            // 2. Definimos las funciones DENTRO del listener para que tengan acceso a 'carousel'.

            // Función para cargar las imágenes en el carrusel
            function populateCarousel() {
                carousel.innerHTML = ''; // Limpia el carrusel
                images.forEach((img) => {
                    const item = document.createElement('div');
                    item.className = 'carousel-item';
                    item.innerHTML = `<img src="${img.src}" alt="${img.title}" loading="lazy">`;
                    item.onclick = () => { 
                        console.log(`Hiciste clic en: ${img.title}`);
                    };
                    carousel.appendChild(item);
                });
            }

            // Función para desplazar el carrusel con los botones
            function scrollCarousel(direction) {
                const scrollAmount = 280;
                carousel.scrollBy({
                    left: direction * scrollAmount,
                    behavior: 'smooth'
                });
            }

            let autoScrollInterval;

            // Función para iniciar el desplazamiento automático
            function startAutoScroll() {
                // Evita que se creen múltiples intervalos si ya existe uno
                if (autoScrollInterval) clearInterval(autoScrollInterval);

                autoScrollInterval = setInterval(() => {
                    // La variable 'carousel' ya está definida y disponible aquí. ¡Ya no dará error!
                    if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 1) { // Pequeño ajuste para ser más preciso
                        carousel.scrollTo({ left: 0, behavior: 'smooth' });
                    } else {
                        scrollCarousel(1);
                    }
                }, 3000);
            }

            // Función para detener el auto-scroll
            function stopAutoScroll() {
                clearInterval(autoScrollInterval);
            }

            // 3. Ejecutamos la lógica inicial
            populateCarousel();
            startAutoScroll();

            // Detiene el auto-scroll si el mouse está sobre el carrusel
            carousel.addEventListener('mouseenter', stopAutoScroll);
            carousel.addEventListener('mouseleave', startAutoScroll);

            // Asignamos las funciones a los botones de navegación para que sean accesibles desde el HTML
            // ya que ahora están dentro de un ámbito local y no global.
            document.querySelector('.nav-btn.prev').onclick = () => scrollCarousel(-1);
            document.querySelector('.nav-btn.next').onclick = () => scrollCarousel(1);
        });
