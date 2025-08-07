document.addEventListener('DOMContentLoaded', function () {
    const ITEMS_PER_PAGE = 12;
    let currentPage = 1;
    let searchTerm = '';
    let allTechniques = [];

    // Technique names array
    const techniqueNames = [
        'JCB 220', 'JCB 290', 'JCB 330', 'CAT 329d', 'Volvo 370', 'Volvo EC350E', 'JCB js360', 'CAT 318D',
        'Volvo ew205d', 'CAT M318D', 'CAT m322d', 'CAT 303.5e', 'JCB 8055', 'JCB 8035', 'CAT 305E',
        'Hitachi Zaxis 33U', 'Hitachi Zaxis 48U', 'Luigong CLG 906C', 'Liugong 908c', 'CAT 303.5dcr',
        'SHANTUI SD 32', 'Komatsu d65 px', 'CAT D6', 'Komatsu D85PX', 'Volvo g940', 'XCMG gr 165',
        'Luigong 4180', 'Ford 3536d', 'MAN TGX D38', 'Bomag BW100', 'Bomag BW216', 'Bomag bw100',
        'Bomag BW213', 'Ford Cargo 1826', 'Ford 1826', 'Hyundai HLF 30-5', 'Sanko DOOSAN', 'TCM FD 160',
        'HELI CPCD 100', 'LIUGONG CPCD 30', 'CAT 428E', 'JCB 4cx4ws', 'JCB 4cx', 'MST 544', 'JCB 3cx',
        'CAT 950H', 'Luck 35', 'Montracon', 'Özünlü Damper', 'Mitsubishi L200', 'MTZ 892', 'MTZ1021',
        'Qazel', 'Mercedes Atego 815', 'Hyundai hd65', 'Case TX170-45', 'MST 940', 'SINOBOOM GTZZ25',
        'Makasli', 'DPU 4045 / DPU4545', 'WELTECH 1200', 'WACKER NEUSON RD7HS', 'WACKER NEUSON BS 60-4S',
        'ÖZKANLAR ÖVR 40S', 'ÖZKANLAR ÖVR 60S', 'ATLAS COPCO XAS 77 DD', 'ATLAS COPCO XAS 156 DD',
        'ATLAS COPCO XAS 186 DD', 'SKYJACK SJIII 4626', 'SKYJACK SJIII 3220', 'McELROY T250 HF BUTT',
        'TURAN BORFIT AL160-AL630', 'TURAN BORFIT HST300', 'TURAN BORFIT EF100A', 'WACKER NEUSON LTN6L',
        'Ford Cargo 3532T'
    ];

    // Generate technique data
    function generateTechniques() {
        for (let i = 1; i <= 75; i++) {
            allTechniques.push({
                id: i,
                image: `assets/images/tech/${i}.jpg`,
                title: techniqueNames[i - 1] // используем названия по порядку
            });
        }
    }

    // Create technique card
    function createTechniqueCard(technique) {
    return `
        <div class="technique-card" data-id="${technique.id}">
            <div class="technique-card__image">
                <img src="${technique.image}" alt="${technique.title}" loading="lazy">
                <div class="technique-card__overlay">
                    <div class="overlay-icon">
                        <svg viewBox="0 0 24 24">
                            <defs>
                                <linearGradient id="overlaySearchGradient${technique.id}" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style="stop-color:#c99a18"/>
                                    <stop offset="100%" style="stop-color:#e7b836"/>
                                </linearGradient>
                            </defs>
                            <circle cx="9" cy="9" r="6" fill="none" stroke="url(#overlaySearchGradient${technique.id})" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></circle>
                            <line x1="20" y1="20" x2="15" y2="15" stroke="url(#overlaySearchGradient${technique.id})" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></line>
                        </svg>
                    </div>
                </div>
            </div>
            <div class="technique-card__content">
                <h3 class="technique-card__title">${technique.title}</h3>
            </div>
        </div>
    `;
}

    // Filter techniques by search
    function getFilteredTechniques() {
        return allTechniques.filter(technique => {
            return searchTerm === '' ||
                technique.title.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }

    // Render techniques
    function renderTechniques() {
        const filteredTechniques = getFilteredTechniques();
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const currentTechniques = filteredTechniques.slice(startIndex, endIndex);

        const grid = document.querySelector('.texnikalar__grid');
        grid.innerHTML = currentTechniques.map(createTechniqueCard).join('');

        // Update stats
        updateStats(filteredTechniques.length);

        // Update pagination
        updatePagination(filteredTechniques.length);

        // Add click listeners
        addCardListeners();

        // Animate cards
        animateCards();
    }

    // Update statistics
    function updateStats(totalCount) {
        document.querySelector('.stat-number[data-stat="total"]').textContent = totalCount;
        document.querySelector('.stat-number[data-stat="showing"]').textContent =
            Math.min(ITEMS_PER_PAGE, totalCount - (currentPage - 1) * ITEMS_PER_PAGE);
        document.querySelector('.stat-number[data-stat="page"]').textContent = currentPage;
    }

    // Update pagination
    // Update pagination (замени эту функцию в tech.js)
    function updatePagination(totalCount) {
        const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
        const pagination = document.querySelector('.pagination');

        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let paginationHTML = '';

        // Previous button
        paginationHTML += `
        <button class="pagination-btn pagination-btn--nav" data-page="prev" ${currentPage === 1 ? 'disabled' : ''}>
            ← Əvvəlki
        </button>
    `;

        // Calculate page range to show
        const maxVisiblePages = window.innerWidth < 768 ? 3 : 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        // Adjust start if we're near the end
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // First page and dots
        if (startPage > 1) {
            paginationHTML += `<button class="pagination-btn pagination-btn--page" data-page="1">1</button>`;
            if (startPage > 2) {
                paginationHTML += `<span class="pagination-dots">...</span>`;
            }
        }

        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
            <button class="pagination-btn pagination-btn--page ${i === currentPage ? 'active' : ''}" data-page="${i}">
                ${i}
            </button>
        `;
        }

        // Last page and dots
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += `<span class="pagination-dots">...</span>`;
            }
            paginationHTML += `<button class="pagination-btn pagination-btn--page" data-page="${totalPages}">${totalPages}</button>`;
        }

        // Next button
        paginationHTML += `
        <button class="pagination-btn pagination-btn--nav" data-page="next" ${currentPage === totalPages ? 'disabled' : ''}>
            Növbəti →
        </button>
    `;

        // Page info (mobile)
        paginationHTML += `
        <div class="pagination-info-mobile">
            <span>${currentPage} / ${totalPages}</span>
        </div>
    `;

        pagination.innerHTML = paginationHTML;

        // Add pagination listeners
        pagination.querySelectorAll('.pagination-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const page = this.getAttribute('data-page');

                if (page === 'prev' && currentPage > 1) {
                    currentPage--;
                } else if (page === 'next' && currentPage < totalPages) {
                    currentPage++;
                } else if (!isNaN(page)) {
                    currentPage = parseInt(page);
                }

                renderTechniques();
                scrollToTop();
            });
        });
    }

    // Add card click listeners
    function addCardListeners() {
        document.querySelectorAll('.technique-card').forEach(card => {
            card.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                const technique = allTechniques.find(t => t.id == id);
                openLightbox(technique);
            });
        });
    }

    // Animate cards
    function animateCards() {
        const cards = document.querySelectorAll('.technique-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px)';
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Lightbox functionality
    function openLightbox(technique) {
        const lightbox = document.querySelector('.lightbox');
        const image = lightbox.querySelector('.lightbox__image');

        image.src = technique.image;
        image.alt = technique.title;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        const lightbox = document.querySelector('.lightbox');
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Scroll to top
    function scrollToTop() {
        document.querySelector('.texnikalar').scrollIntoView({ behavior: 'smooth' });
    }

    // Initialize
    function init() {
        generateTechniques();

        // Search input
        const searchInput = document.querySelector('.search-input');
        searchInput.addEventListener('input', function () {
            searchTerm = this.value;
            currentPage = 1;
            renderTechniques();
        });

        // Lightbox close
        document.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
        document.querySelector('.lightbox').addEventListener('click', function (e) {
            if (e.target === this) closeLightbox();
        });

        // ESC key to close lightbox
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeLightbox();
        });

        // Initial render
        renderTechniques();
    }

    init();
});