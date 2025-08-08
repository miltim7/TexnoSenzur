// Language Switcher Functionality
class LanguageSwitcher {
    constructor() {
        this.currentLang = this.getCurrentLanguage();
        this.languages = {
            'az': {
                flag: 'https://flagcdn.com/24x18/az.png',
                name: 'Azərbaycan',
                code: 'AZ',
                path: '/'
            },
            'en': {
                flag: 'https://flagcdn.com/24x18/gb.png',
                name: 'English',
                code: 'EN',
                path: '/en'
            },
            'ru': {
                flag: 'https://flagcdn.com/24x18/ru.png',
                name: 'Русский',
                code: 'RU',
                path: '/ru'
            }
        };
        
        this.init();
    }

    getCurrentLanguage() {
        const path = window.location.pathname;
        if (path.startsWith('/en')) return 'en';
        if (path.startsWith('/ru')) return 'ru';
        return 'az'; // default
    }

    init() {
        this.updateCurrentLanguage();
        this.updateDropdownLinks();
        this.bindEvents();
    }

    updateCurrentLanguage() {
        const currentLangElement = document.querySelector('.language-switcher__current');
        const currentLang = this.languages[this.currentLang];
        
        if (currentLangElement && currentLang) {
            const img = currentLangElement.querySelector('img');
            const span = currentLangElement.querySelector('span');
            
            if (img) img.src = currentLang.flag;
            if (span) span.textContent = currentLang.code;
        }
    }

    updateDropdownLinks() {
        const dropdownOptions = document.querySelectorAll('.language-switcher__option');
        
        dropdownOptions.forEach(option => {
            const img = option.querySelector('img');
            const span = option.querySelector('span');
            
            if (img && span) {
                const altAttr = img.getAttribute('alt');
                let langKey = '';
                
                // Determine language key based on flag or text
                if (altAttr === 'AZ' || span.textContent.includes('Azərbaycan')) {
                    langKey = 'az';
                } else if (altAttr === 'EN' || span.textContent.includes('English')) {
                    langKey = 'en';
                } else if (altAttr === 'RU' || span.textContent.includes('Русский')) {
                    langKey = 'ru';
                }
                
                if (langKey && this.languages[langKey]) {
                    const lang = this.languages[langKey];
                    option.href = lang.path;
                    
                    // Update active state
                    if (langKey === this.currentLang) {
                        option.classList.add('active');
                    } else {
                        option.classList.remove('active');
                    }
                }
            }
        });
    }

    bindEvents() {
        // Toggle dropdown
        const switcher = document.querySelector('.language-switcher');
        const current = document.querySelector('.language-switcher__current');
        const dropdown = document.querySelector('.language-switcher__dropdown');

        if (current && dropdown) {
            current.addEventListener('click', (e) => {
                e.preventDefault();
                switcher.classList.toggle('active');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!switcher.contains(e.target)) {
                    switcher.classList.remove('active');
                }
            });
        }

        // Handle language selection
        const options = document.querySelectorAll('.language-switcher__option');
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const href = option.getAttribute('href');
                if (href && href !== '#') {
                    // Add smooth transition effect
                    document.body.style.opacity = '0.8';
                    setTimeout(() => {
                        window.location.href = href;
                    }, 100);
                }
            });
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LanguageSwitcher();
});

// Also initialize if script loads after DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new LanguageSwitcher();
    });
} else {
    new LanguageSwitcher();
}