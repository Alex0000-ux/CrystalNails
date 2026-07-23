document.addEventListener('DOMContentLoaded', () => {

    // 1. Menu Hamburger
    const hamburger = document.querySelector('.hamburger');
    const nav = document.getElementById('main-nav');

    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !isExpanded);
            nav.classList.toggle('active');
        });

        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.setAttribute('aria-expanded', 'false');
                nav.classList.remove('active');
            });
        });
    }

    // 2. Animazioni allo Scroll
    const elements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fade-in 0.8s ease forwards';
            }
        });
    }, { threshold: 0.15 });

    elements.forEach(el => {
        el.style.opacity = '0'; // reset iniziale per l'animazione
        observer.observe(el);
    });

    // 3. Caricamento Dinamico Galleria + Slider
    const track = document.querySelector('.slider-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (track) {
        // Legge dinamicamente il file gallery-data.json
        fetch('img/gallery-data.json')
            .then(response => response.json())
            .then(data => {
                const totalImages = data.totalImages;

                // Genera i percorsi INVERTITI (es. da foto36.jpg a foto1.jpg)
                const immaginiGalleria = Array.from(
                    { length: totalImages },
                    (_, i) => `img/galleria/nails-${totalImages - i}.jpg`
                );

                // Inserisce le immagini nel DOM
                track.innerHTML = immaginiGalleria.map((src, index) =>
                    `<img src="${src}" alt="Lavoro ${totalImages - index}" class="zoomable" loading="lazy">`
                ).join('');

                // Inizializza lo slider dopo aver inserito le immagini
                initSlider();
            })
            .catch(error => {
                console.error('Errore nel caricamento del file JSON della galleria:', error);
            });

        // Funzione per attivare i pulsanti e il ridimensionamento dello slider
        function initSlider() {
            if (!prevBtn || !nextBtn) return;

            const imgs = track.querySelectorAll('img');
            let currentIndex = 0;

            function getVisibleCards() {
                if (window.innerWidth <= 768) return 1;
                if (window.innerWidth <= 992) return 2;
                return 4;
            }

            function updateSlider() {
                if (imgs.length === 0) return;
                const imgWidth = imgs[0].getBoundingClientRect().width;
                const gap = 20;
                const amountToMove = currentIndex * (imgWidth + gap);
                track.style.transform = `translateX(-${amountToMove}px)`;
            }

            nextBtn.addEventListener('click', () => {
                const visibleCards = getVisibleCards();
                const maxIndex = imgs.length - visibleCards;
                if (currentIndex < maxIndex) {
                    currentIndex++;
                } else {
                    currentIndex = 0;
                }
                updateSlider();
            });

            prevBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                } else {
                    const visibleCards = getVisibleCards();
                    currentIndex = imgs.length - visibleCards;
                }
                updateSlider();
            });

            window.addEventListener('resize', () => {
                const maxIndex = imgs.length - getVisibleCards();
                if (currentIndex > maxIndex) currentIndex = maxIndex;
                updateSlider();
            });
        }
    }

    // 4. Lightbox (Immagini a schermo intero)
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightbox = document.querySelector('.lightbox-close');

    if (lightbox && lightboxImg) {
        // Event Delegation per gestire il click sulle immagini dinamiche
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('zoomable')) {
                lightboxImg.src = e.target.src;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });

        if (closeLightbox) {
            closeLightbox.addEventListener('click', () => {
                lightbox.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // 5. Invio Modulo Corsi su WhatsApp
    const courseForms = document.querySelectorAll('.course-contact-form');
    courseForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Impedisce il ricaricamento della pagina

            // Raccoglie i dati inseriti nei campi
            const nome = form.querySelector('[name="nome"]').value.trim();
            const cognome = form.querySelector('[name="cognome"]').value.trim();
            const telefono = form.querySelector('[name="telefono"]').value.trim();
            const corso = form.querySelector('[name="corso"]').value.trim();

            // Compone il messaggio formattato
            const messaggio = `Ciao! Vorrei informazioni sul corso.\n\n` +
                `📌 *Dettagli Richiesta:*\n` +
                `• Nome: ${nome}\n` +
                `• Cognome: ${cognome}\n` +
                `• Telefono: ${telefono}\n` +
                `• Corso: ${corso}`;

            // Numero WhatsApp di destinazione
            const numeroWhatsApp = "393398694862";

            // Crea l'URL WhatsApp con il messaggio codificato
            const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(messaggio)}`;

            // Apri WhatsApp in una nuova scheda/app
            window.open(url, '_blank');
        });
    });

});