class FooterSection {
    constructor() {
        this.footer = document.querySelector('.footer');
        this.footerLinks = document.querySelectorAll('.footer__link');
        this.contactLinks = document.querySelectorAll('.footer__contact[href]');
        this.ctaBtn = document.querySelector('.footer__cta');
        
        this.init();
    }

    init() {
        this.setupLinkAnimations();
        this.setupContactAnimations();
        this.setupCtaInteraction();
        this.setupScrollReveal();
    }

    setupLinkAnimations() {
        this.footerLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                
                link.style.transform = 'translateY(-2px) scale(0.95)';
                setTimeout(() => {
                    link.style.transform = 'translateY(-2px) scale(1)';
                }, 150);

                this.smoothScrollToSection(href);
                this.trackLinkClick(href);
            });
        });
    }

    setupContactAnimations() {
        this.contactLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                link.style.transform = 'translateY(-2px) scale(0.95)';
                setTimeout(() => {
                    link.style.transform = 'translateY(-2px) scale(1)';
                }, 150);

                if (href.startsWith('tel:')) {
                    this.trackPhoneClick(href);
                } else if (href.startsWith('mailto:')) {
                    this.trackEmailClick(href);
                }
            });
        });
    }

    setupCtaInteraction() {
        if (this.ctaBtn) {
            this.ctaBtn.addEventListener('click', () => {
                this.handleCtaClick();
            });
        }
    }

    handleCtaClick() {
        this.ctaBtn.style.transform = 'translateY(-4px) scale(0.95)';
        setTimeout(() => {
            this.ctaBtn.style.transform = 'translateY(-4px) scale(1)';
        }, 150);

        this.trackCtaClick();
        this.showContactModal();
    }

    setupScrollReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateFooterReveal();
                }
            });
        }, {
            threshold: 0.1
        });

        if (this.footer) {
            observer.observe(this.footer);
        }
    }

    animateFooterReveal() {
        const elements = [
            this.footer.querySelector('.footer__header'),
            this.footer.querySelector('.footer__content'),
            this.footer.querySelector('.footer__action')
        ];
        
        elements.forEach((element, index) => {
            if (element) {
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 200);
            }
        });
    }

    smoothScrollToSection(href) {
        if (href.startsWith('#')) {
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    }

    trackLinkClick(href) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'footer_link_click', {
                link_url: href,
                section: 'footer'
            });
        }
    }

    trackCtaClick() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'footer_cta_click', {
                button_text: 'Bizimlə Əlaqə',
                section: 'footer'
            });
        }
    }

    trackPhoneClick(phone) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'phone_click', {
                phone_number: phone,
                section: 'footer'
            });
        }
    }

    trackEmailClick(email) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'email_click', {
                email_address: email,
                section: 'footer'
            });
        }
    }

    showContactModal() {
        console.log('Opening contact modal from footer');
    }
}

const footerAnimationCSS = `
.footer__header,
.footer__content,
.footer__action {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}
`;

const style = document.createElement('style');
style.textContent = footerAnimationCSS;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    const footerSection = new FooterSection();
    window.FooterSection = footerSection;
});