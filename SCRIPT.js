document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('searchButton');
    const searchPopup = document.getElementById('searchPopup');
    const searchInput = document.getElementById('searchInput');
    const noMatches = document.getElementById('noMatches');
    const sections = document.querySelectorAll('section, .w3-padding-large, .w3-padding-64');
    const images = document.querySelectorAll('img');
    const header = document.getElementById('home');
    const table = document.querySelector('table');
    const w3Contents = document.querySelectorAll('.w3-content');
    const bgImage = document.getElementById('bgImage');

    if (searchButton) {
        searchButton.addEventListener('click', function() {
            searchPopup.style.display = 'block';
            searchInput.focus();
        });
    }

    searchInput.addEventListener('input', function() {
        const query = searchInput.value.toLowerCase();
        let hasMatches = false;

        sections.forEach(section => {
            const paragraphs = section.querySelectorAll('p');
            const headings = section.querySelectorAll('h2, h3, h4, h5, h6');
            const sectionImages = section.querySelectorAll('img');
            const textContent = Array.from(paragraphs).concat(Array.from(headings)).map(el => el.textContent.toLowerCase()).join(' ');

            if (query === '' || textContent.includes(query)) {
                section.style.display = 'block';
                sectionImages.forEach(img => img.classList.remove('hidden'));
                paragraphs.forEach(p => p.innerHTML = highlightText(p.textContent, query));
                headings.forEach(h => h.innerHTML = highlightText(h.textContent, query));
                hasMatches = true;
                if (query !== '') {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            } else {
                section.style.display = 'none';
                sectionImages.forEach(img => img.classList.add('hidden'));
            }
        });

        images.forEach(img => {
            const imgInVisibleSection = Array.from(sections).some(section => section.contains(img));
            img.classList[imgInVisibleSection || query === '' ? 'remove' : 'add']('hidden');
        });

        if (header && (query === '' || header.textContent.toLowerCase().includes(query))) {
            header.style.display = 'block';
        } else {
            header.style.display = 'none';
        }

        if (table) {
            const tableTextContent = table.textContent.toLowerCase();
            table.style.display = (query === '' || tableTextContent.includes(query)) ? 'block' : 'none';
        }

        w3Contents.forEach(content => {
            const textContent = content.textContent.toLowerCase();
            content.style.display = (query === '' || textContent.includes(query)) ? 'block' : 'none';
        });

        noMatches.style.display = hasMatches ? 'none' : 'block';
    });

    function highlightText(text, query) {
        if (query === '') return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }

    function clearSearchResults() {
        sections.forEach(section => {
            const paragraphs = section.querySelectorAll('p');
            const headings = section.querySelectorAll('h2, h3, h4, h5, h6');
            const sectionImages = section.querySelectorAll('img');

            paragraphs.forEach(p => p.innerHTML = p.textContent);
            headings.forEach(h => h.innerHTML = h.textContent);
            sectionImages.forEach(img => img.classList.remove('hidden'));
        });

        images.forEach(img => img.classList.remove('hidden'));
        if (header) header.style.display = 'block';
        if (table) table.style.display = 'block';

        w3Contents.forEach(content => content.style.display = 'block');
        if (bgImage) bgImage.classList.remove('hidden');
    }

    // Add event listener for Escape key press
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeSearchPopup();
        }
    });
});

function closeSearchPopup() {
    // Hide the popup
    document.getElementById('searchPopup').style.display = 'none';
    // Refresh the page
    location.reload();
}

const image = document.getElementById('image');
const fullscreenBtn = document.getElementById('fullscreen-btn');

fullscreenBtn.addEventListener('click', () => {
    if (image.requestFullscreen) {
        image.requestFullscreen();
    } else if (image.mozRequestFullScreen) { // Firefox
        image.mozRequestFullScreen();
    } else if (image.webkitRequestFullscreen) { // Chrome, Safari and Opera
        image.webkitRequestFullscreen();
    } else if (image.msRequestFullscreen) { // IE/Edge
        image.msRequestFullscreen();
    }
});

// SLIDERS
const slides = document.querySelector('.slides');
const slideImages = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const indicators = document.querySelectorAll('.indicator');
const thumbnails = document.querySelectorAll('.thumbnail');

let currentIndex = 0;
let slideInterval;

function showSlide(index) {
    currentIndex = index;
    const offset = -index * 100;
    slides.style.transform = `translateX(${offset}%)`;

    slideImages.forEach(slide => slide.classList.remove('active'));
    slideImages[index].classList.add('active');

    updateActiveIndicator(index);
    updateActiveThumbnail(index);
}

function updateActiveIndicator(index) {
    indicators.forEach(indicator => indicator.classList.remove('active'));
    indicators[index].classList.add('active');
}

function updateActiveThumbnail(index) {
    thumbnails.forEach(thumbnail => thumbnail.classList.remove('active'));
    thumbnails[index].classList.add('active');
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % slideImages.length;
    showSlide(currentIndex);
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + slideImages.length) % slideImages.length;
    showSlide(currentIndex);
}

function startSlider() {
    slideInterval = setInterval(nextSlide, 5000);
}

function stopSlider() {
    clearInterval(slideInterval);
}

nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

indicators.forEach(indicator => {
    indicator.addEventListener('click', (e) => {
        const index = parseInt(e.target.getAttribute('data-slide'));
        showSlide(index);
    });
});

thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', (e) => {
        const index = parseInt(e.currentTarget.getAttribute('data-slide'));
        showSlide(index);
    });
});

slides.addEventListener('mouseenter', stopSlider);
slides.addEventListener('mouseleave', startSlider);

startSlider();
