class FooterSection {
    constructor() {
        this.footer = document.querySelector('.footer');
        this.socialLinks = document.querySelectorAll('.footer__social-link');
        this.footerLinks = document.querySelectorAll('.footer__link');
        this.ctaBtn = document.querySelector('.footer__cta-btn');
        this.contactLinks = document.querySelectorAll('.footer__contact-link');
        this.decorations = document.querySelectorAll('.footer__decoration');
        
        this.init();
    }

    init() {
        this.setupSocialInteractions();
        this.setupLinkAnimations();
        this.setupCtaInteraction();
        this.setupContactInteractions();
        this.setupScrollAnimations();
        this.setupDecorationAnimations();
    }

    setupSocialInteractions() {
        this.socialLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                this.animateSocialHover(link);
            });

            link.addEventListener('mouseleave', () => {
                this.resetSocialAnimation(link);
            });

            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSocialClick(link);
            });
        });
    }

    animateSocialHover(link) {
        const platform = link.dataset.platform;
        link.style.transform = 'translateY(-5px) scale(1.1)';
        
        this.createSparkleEffect(link);
    }

    resetSocialAnimation(link) {
        link.style.transform = 'translateY(0) scale(1)';
    }

    handleSocialClick(link) {
        const platform = link.dataset.platform;
        
        link.style.transform = 'translateY(-5px) scale(0.95)';
        setTimeout(() => {
            link.style.transform = 'translateY(-5px) scale(1.1)';
        }, 150);

        this.trackSocialClick(platform);
        console.log(`Opening ${platform} social link`);
    }

    setupLinkAnimations() {
        this.footerLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                this.animateLinkHover(link);
            });

            link.addEventListener('click', (e) => {
                this.handleLinkClick(e, link);
            });
        });
    }

    animateLinkHover(link) {
        link.style.transform = 'translateX(8px)';
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            left: -5px;
            top: 50%;
            transform: translateY(-50%);
            width: 3px;
            height: 3px;
            background: #c99a18;
            border-radius: 50%;
            animation: linkRipple 0.6s ease-out;
            pointer-events: none;
        `;
        
        link.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    handleLinkClick(e, link) {
        e.preventDefault();
        const href = link.getAttribute('href');
        
        link.style.transform = 'translateX(3px) scale(0.98)';
        setTimeout(() => {
            link.style.transform = 'translateX(8px) scale(1)';
        }, 150);

        this.trackLinkClick(href);
        this.smoothScrollToSection(href);
    }

    setupCtaInteraction() {
        if (this.ctaBtn) {
            this.ctaBtn.addEventListener('click', () => {
                this.handleCtaClick();
            });

            this.ctaBtn.addEventListener('mouseenter', () => {
                this.animateCtaHover();
            });
        }
    }

    handleCtaClick() {
        this.ctaBtn.style.transform = 'translateY(-3px) scale(0.95)';
        setTimeout(() => {
            this.ctaBtn.style.transform = 'translateY(-3px) scale(1)';
        }, 150);

        this.createButtonRipple(this.ctaBtn);
        this.trackCtaClick();
        this.showContactModal();
    }

    animateCtaHover() {
        const svg = this.ctaBtn.querySelector('svg');
        if (svg) {
            svg.style.animation = 'arrowBounce 0.6s ease infinite';
        }
    }

    setupContactInteractions() {
        this.contactLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.handleContactClick(e, link);
            });

            link.addEventListener('mouseenter', () => {
                link.style.transform = 'translateX(5px)';
            });

            link.addEventListener('mouseleave', () => {
                link.style.transform = 'translateX(0)';
            });
        });
    }

    handleContactClick(e, link) {
        const href = link.getAttribute('href');
        
        if (href.startsWith('tel:')) {
            this.trackPhoneClick(href);
        } else if (href.startsWith('mailto:')) {
            this.trackEmailClick(href);
        }

        this.createContactClickEffect(link);
    }

    setupScrollAnimations() {
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
        const elements = this.footer.querySelectorAll('.footer__brand, .footer__column, .footer__contact');
        
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    setupDecorationAnimations() {
        this.decorations.forEach((decoration, index) => {
            decoration.addEventListener('mouseenter', () => {
                decoration.style.opacity = '0.1';
                decoration.style.transform = 'scale(1.2)';
            });

            decoration.addEventListener('mouseleave', () => {
                decoration.style.opacity = '0.03';
                decoration.style.transform = 'scale(1)';
            });
        });
    }

    createSparkleEffect(element) {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.style.cssText = `
                    position: absolute;
                    top: ${Math.random() * 100}%;
                    left: ${Math.random() * 100}%;
                    width: 4px;
                    height: 4px;
                    background: #c99a18;
                    border-radius: 50%;
                    animation: sparkleFloat 1s ease-out forwards;
                    pointer-events: none;
                    z-index: 100;
                `;
                element.appendChild(sparkle);
                
                setTimeout(() => sparkle.remove(), 1000);
            }, i * 100);
        }
    }

    createButtonRipple(button) {
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 20px;
            height: 20px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: buttonRipple 0.6s ease-out;
            pointer-events: none;
        `;
        
        button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    createContactClickEffect(element) {
        element.style.transform = 'translateX(5px) scale(0.95)';
        setTimeout(() => {
            element.style.transform = 'translateX(5px) scale(1)';
        }, 150);

        const glow = document.createElement('div');
        glow.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(90deg, transparent, rgba(201, 154, 24, 0.2), transparent);
            animation: contactGlow 0.8s ease-out;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.appendChild(glow);
        setTimeout(() => glow.remove(), 800);
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

    trackSocialClick(platform) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'social_click', {
                platform: platform,
                section: 'footer'
            });
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

const footerCSS = `
@keyframes linkRipple {
    to {
        transform: translateY(-50%) scale(3);
        opacity: 0;
    }
}

@keyframes arrowBounce {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(3px); }
}

@keyframes buttonRipple {
    to {
        transform: translate(-50%, -50%) scale(4);
        opacity: 0;
    }
}

@keyframes contactGlow {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}

@keyframes sparkleFloat {
    0% {
        transform: scale(0) rotate(0deg);
        opacity: 1;
    }
    50% {
        transform: scale(1) rotate(180deg);
        opacity: 0.8;
    }
    100% {
        transform: scale(0) rotate(360deg);
        opacity: 0;
    }
}

.footer__brand,
.footer__column,
.footer__contact {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}
`;

const style = document.createElement('style');
style.textContent = footerCSS;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    const footerSection = new FooterSection();
    window.FooterSection = footerSection;
});