document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    const topbar = document.querySelector('.topbar');
    const burger = document.querySelector('.header__burger');
    const mobileMenu = document.querySelector('.header__mobile-menu');
    const mobileClose = document.querySelector('.header__mobile-close');
    const mobileLinks = document.querySelectorAll('.header__mobile-nav-link');
    const navLinks = document.querySelectorAll('.header__nav-link, .header__mobile-nav-link');
    const ctaButtons = document.querySelectorAll('.header__cta, .header__mobile-cta');
    const mobileLangButtons = document.querySelectorAll('.header__mobile-lang');
    let lastScroll = 0;
    
    function handleScroll() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
            if (topbar) {
                topbar.classList.add('hidden');
            }
        } else {
            header.classList.remove('scrolled');
            if (topbar) {
                topbar.classList.remove('hidden');
            }
        }
        
        // Скрываем header при скролле вниз, показываем при скролле вверх
        if (currentScroll > lastScroll && currentScroll > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    }
    
    window.addEventListener('scroll', handleScroll);
    
    function toggleMobileMenu() {
        burger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    }
    
    burger.addEventListener('click', toggleMobileMenu);
    
    mobileClose.addEventListener('click', function() {
        burger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            burger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    document.addEventListener('click', function(e) {
        if (!burger.contains(e.target) && !mobileMenu.contains(e.target)) {
            burger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const additionalOffset = window.pageYOffset > 50 ? 0 : 40; // учитываем topbar
                const targetPosition = targetSection.offsetTop - headerHeight - additionalOffset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    mobileLangButtons.forEach(button => {
        button.addEventListener('click', function() {
            mobileLangButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    const languageSwitcher = document.querySelector('.language-switcher');
    const languageOptions = document.querySelectorAll('.language-switcher__option');
    const currentLang = document.querySelector('.language-switcher__current');
    
    if (languageOptions.length > 0) {
        languageOptions.forEach(option => {
            option.addEventListener('click', function(e) {
                e.preventDefault();
                languageOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                
                const flag = this.querySelector('img').src;
                const code = this.querySelector('span').textContent.slice(0, 2).toUpperCase();
                
                currentLang.querySelector('img').src = flag;
                currentLang.querySelector('span').textContent = code;
            });
        });
    }
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px',
        threshold: 0
    };
    
    const sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const navLink = document.querySelector(`.header__nav-link[href="#${id}"]`);
            const mobileNavLink = document.querySelector(`.header__mobile-nav-link[href="#${id}"]`);
            
            if (entry.isIntersecting) {
                document.querySelectorAll('.header__nav-link, .header__mobile-nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                
                if (navLink) navLink.classList.add('active');
                if (mobileNavLink) mobileNavLink.classList.add('active');
            }
        });
    }, observerOptions);
    
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    const logo = document.querySelector('.header__logo');
    logo.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    const style = document.createElement('style');
    style.textContent = `
        .header__nav-link.active {
            color: #ff6b35;
        }
        .header__nav-link.active::after {
            transform: translateX(-50%) scaleX(1);
        }
        .header__mobile-nav-link.active {
            color: #ff6b35;
            background: rgba(255, 107, 53, 0.05);
            border-left-color: #ff6b35;
        }
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 768) {
                burger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }, 250);
    });
});