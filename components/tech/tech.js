document.addEventListener('DOMContentLoaded', function () {
    const ITEMS_PER_PAGE = 12;
    let currentPage = 1;
    let searchTerm = '';
    let allTechniques = [];

    // Определяем базовый путь в зависимости от языковой версии
    const currentPath = window.location.pathname;
    const isSubdirectory = currentPath.includes('/ru/') || currentPath.includes('/en/');
    const basePath = isSubdirectory ? '../' : '';

    // Определяем язык для локализации текста пагинации
    let currentLang = 'az'; // По умолчанию азербайджанский
    if (currentPath.includes('/ru/')) {
        currentLang = 'ru';
    } else if (currentPath.includes('/en/')) {
        currentLang = 'en';
    }

    // Локализация текста
    const translations = {
        az: {
            prev: 'Əvvəlki',
            next: 'Növbəti'
        },
        ru: {
            prev: 'Предыдущая',
            next: 'Следующая'
        },
        en: {
            prev: 'Previous',
            next: 'Next'
        }
    };

    // Technique names array
    const techniqueNames = [
        'Ford 1826', 'Ford 3536d', 'Mercedes Atego 815', 'Hyundai hd65', 'Qazel', 'Mitsubishi L200', 'Ford Cargo 3532T', 'Ford Cargo 1826', 'Ford Cargo',

        'Isuzu Evakuator', 'Hyundai hd35', 'Kamaz 54901', 'Mercedes Atego', 'Iveco Eurocargo', 'Iveco Daily', 'Mercedes Axor', 'Mitsubishi Canter', 'Isuzu', 'Isuzu Forward', 
        
        'CAT 303.5e', 'JCB 4cx', 'JCB 4cx4ws', 'CAT m322d', 'JCB js360', 'Liugong 908c', 'CAT 329d', 'CAT 305E', 'XCMG gr 165', 'Komatsu d65 px', 
        
        'MTZ1021', 'Komatsu D85PX', 'Volvo ew205d', 'Volvo g940', 'Luigong 4180', 'Hyundai HLF 30-5', 'Liugong 908c', 'CAT 246C', 'CAT 950H', 'JCB 220', 
        
        'JCB 290', 'JCB 330', 'Volvo 370', 'Volvo EC350E', 'CAT M318D', 'Bomag BW100', 'Case TX170-45', 'JCB 8035', 'Grove', 'MTZ 892', 
        
        'CAT 305E', 'Hitachi Zaxis 33U', 'Hitachi Zaxis 48U', 'Luigong CLG 906C', 'TCM FD 160', 'HELI CPCD 100', 'LIUGONG CPCD 30', 'Belarus-892 ESU-150', 'SHANTUI SD 32', 'CAT D6', 
        
        'Bomag BW213', 'JCB 8055', 'CAT 318D', 'CAT 428E', 'Bomag bw100', 'McELROY T250 HF BUTT', 'SKYJACK SJIII 4626', 'SKYJACK SJIII 4626', 'ATLAS COPCO XAS 186 DD', 'ATLAS COPCO XAS 156 DD', 
        
        'ATLAS COPCO XAS 77 DD', 'WACKER NEUSON BS 60-4S', 'WACKER NEUSON RD7HS', 'SINOBOOM GTZZ25', 'Sanko DOOSAN', 'MST 940', 'Luck 35'
    ];

    // Generate technique data
    function generateTechniques() {
        for (let i = 1; i <= 76; i++) {
            allTechniques.push({
                id: i,
                image: `${basePath}assets/images/tech/${i}.jpg`,
                title: techniqueNames[i - 1]
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

        // Update pagination  
        updatePagination(filteredTechniques.length);

        // Add click listeners
        addCardListeners();

        // Animate cards
        animateCards();
    }

    // Update statistics
    function updateStats(totalCount) {
        const totalElement = document.querySelector('.stat-number[data-stat="total"]');
        const showingElement = document.querySelector('.stat-number[data-stat="showing"]');
        const pageElement = document.querySelector('.stat-number[data-stat="page"]');
        
        if (totalElement) totalElement.textContent = totalCount;
        if (showingElement) showingElement.textContent = Math.min(ITEMS_PER_PAGE, totalCount - (currentPage - 1) * ITEMS_PER_PAGE);
        if (pageElement) pageElement.textContent = currentPage;
    }

    // Update pagination
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
            ← ${translations[currentLang].prev}
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
            ${translations[currentLang].next} →
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
        const section = document.querySelector('.texnikalar');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Initialize
    function init() {
        generateTechniques();

        // Search input
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', function () {
                searchTerm = this.value;
                currentPage = 1;
                renderTechniques();
            });
        }

        // Lightbox close
        const lightboxClose = document.querySelector('.lightbox__close');
        const lightbox = document.querySelector('.lightbox');
        
        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }
        
        if (lightbox) {
            lightbox.addEventListener('click', function (e) {
                if (e.target === this) closeLightbox();
            });
        }

        // ESC key to close lightbox
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeLightbox();
        });

        // Initial render
        renderTechniques();
    }

    init();
});