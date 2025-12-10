// Carousel and Modal Script with 3-Card Cyclic Loop
document.addEventListener('DOMContentLoaded', () => {

    // --- Carousel Logic - Show 3 Cards with Infinite Loop ---
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const dotsNav = document.querySelector('.carousel-nav');
    const dots = Array.from(dotsNav.children);

    // Get real slides (excluding clones)
    const realSlides = slides.filter(slide => !slide.classList.contains('clone'));
    const totalRealSlides = realSlides.length; // Should be 3

    let currentIndex = 1; // Start at index 1 (after the cloned last card)

    // Set initial position to show first 3 real cards
    const slideWidth = slides[0].getBoundingClientRect().width;
    track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

    // Function to update carousel position
    const updateCarousel = (animate = true) => {
        const slideWidth = slides[0].getBoundingClientRect().width;

        if (!animate) {
            track.style.transition = 'none';
        } else {
            track.style.transition = 'transform 0.5s ease-in-out';
        }

        track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

        // Update dots based on real position
        const realIndex = ((currentIndex - 1) % totalRealSlides + totalRealSlides) % totalRealSlides;
        dots.forEach((dot, index) => {
            dot.classList.toggle('current-slide', index === realIndex);
        });
    };

    // Function to move carousel
    const moveCarousel = (direction) => {
        currentIndex += direction;
        updateCarousel(true);

        // Handle infinite loop
        const slideWidth = slides[0].getBoundingClientRect().width;

        // If we've moved past the last real slide, jump to the start
        if (currentIndex >= totalRealSlides + 1) {
            setTimeout(() => {
                currentIndex = 1;
                updateCarousel(false);
            }, 500);
        }

        // If we've moved before the first real slide, jump to the end
        if (currentIndex <= 0) {
            setTimeout(() => {
                currentIndex = totalRealSlides;
                updateCarousel(false);
            }, 500);
        }
    };

    // Click on dots to jump to specific card
    dotsNav.addEventListener('click', e => {
        const targetDot = e.target.closest('button');
        if (!targetDot) return;

        const targetIndex = dots.indexOf(targetDot);
        currentIndex = targetIndex + 1; // +1 because of clone at start
        updateCarousel(true);
    });

    // Auto-play carousel (cycles every 4 seconds)
    let autoPlayInterval = setInterval(() => {
        moveCarousel(1);
    }, 4000);

    // Pause auto-play on hover
    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.addEventListener('mouseenter', () => {
        clearInterval(autoPlayInterval);
    });

    carouselContainer.addEventListener('mouseleave', () => {
        autoPlayInterval = setInterval(() => {
            moveCarousel(1);
        }, 4000);
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        updateCarousel(false);
    });

    // --- Hamburger Menu Logic ---
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // --- Modal Logic ---
    const modal = document.getElementById('project-modal');
    const closeBtn = document.querySelector('.close-modal');
    const projectCards = document.querySelectorAll('.project-card');
    const modalTitle = document.getElementById('modal-title');
    const modalImage = document.getElementById('modal-image');
    const modalDesc = document.getElementById('modal-desc');
    const modalTags = document.getElementById('modal-tags');

    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            // Get project data from clicked card
            const title = card.querySelector('h3').innerText;
            const imgSrc = card.querySelector('img').src;
            const desc = card.querySelector('p').innerText;
            const tags = card.querySelectorAll('.tags span');

            // Populate modal with data
            modalTitle.innerText = title;
            modalImage.src = imgSrc;
            modalDesc.innerText = desc;

            // Clear and add tags
            modalTags.innerHTML = '';
            tags.forEach(tag => {
                const tagClone = tag.cloneNode(true);
                modalTags.appendChild(tagClone);
            });

            // Show modal
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scroll
        });
    });

    // Close modal on X button click
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

});
