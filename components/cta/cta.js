class CtaSection {
    constructor() {
        this.section = document.querySelector('.cta');
        this.buttons = document.querySelectorAll('.cta__btn');
        this.primaryBtn = document.querySelector('.cta__btn--primary');
        this.secondaryBtn = document.querySelector('.cta__btn--secondary');
        this.features = document.querySelectorAll('.cta__feature');
        this.logo = document.querySelector('.cta__logo');
        
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupButtonInteractions();
        this.setupLogoInteraction();
        this.setupFeatureAnimations();
    }

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '-20% 0px -20% 0px',
            threshold: 0.3
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateEntry();
                }
            });
        }, options);

        if (this.section) {
            this.observer.observe(this.section);
        }
    }

    animateEntry() {
        const elements = [
            this.section.querySelector('.cta__badge'),
            this.section.querySelector('.cta__title'),
            this.section.querySelector('.cta__subtitle'),
            this.section.querySelector('.cta__buttons'),
            this.section.querySelector('.cta__features'),
            this.section.querySelector('.cta__logo')
        ];

        elements.forEach((element, index) => {
            if (element) {
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 200);
            }
        });

        setTimeout(() => {
            this.animateFeatures();
        }, 1200);
    }

    setupButtonInteractions() {
        this.buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleButtonClick(e, button);
            });

            button.addEventListener('mouseenter', () => {
                this.animateButtonHover(button);
            });

            button.addEventListener('mouseleave', () => {
                this.resetButtonHover(button);
            });
        });
    }

    handleButtonClick(e, button) {
        e.preventDefault();
        
        button.style.transform = 'translateY(-3px) scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'translateY(-3px) scale(1)';
        }, 150);

        this.createButtonRipple(button);
        
        if (button.classList.contains('cta__btn--primary')) {
            this.trackConsultationClick();
            this.showConsultationModal();
        } else {
            this.trackCallClick();
            this.initiateCall();
        }
    }

    animateButtonHover(button) {
        const svg = button.querySelector('svg');
        if (svg) {
            svg.style.transform = 'translateX(5px)';
        }

        if (button.classList.contains('cta__btn--primary')) {
            this.createSparkleEffect(button);
        }
    }

    resetButtonHover(button) {
        const svg = button.querySelector('svg');
        if (svg) {
            svg.style.transform = 'translateX(0)';
        }
    }

    createButtonRipple(button) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: ${size}px;
            height: ${size}px;
            background: ${button.classList.contains('cta__btn--primary') ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)'};
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: ctaRipple 0.6s ease-out;
            pointer-events: none;
            z-index: 10;
        `;
        
        button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    createSparkleEffect(button) {
        for (let i = 0; i < 4; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.style.cssText = `
                    position: absolute;
                    top: ${Math.random() * 100}%;
                    left: ${Math.random() * 100}%;
                    width: 4px;
                    height: 4px;
                    background: var(--cta-primary-light);
                    border-radius: 50%;
                    animation: ctaSparkle 1s ease-out forwards;
                    pointer-events: none;
                    z-index: 5;
                `;
                button.appendChild(sparkle);
                
                setTimeout(() => sparkle.remove(), 1000);
            }, i * 100);
        }
    }

    setupLogoInteraction() {
        if (this.logo) {
            this.logo.addEventListener('mouseenter', () => {
                this.animateLogoHover();
            });

            this.logo.addEventListener('mouseleave', () => {
                this.resetLogoHover();
            });

            this.logo.addEventListener('click', () => {
                this.handleLogoClick();
            });
        }
    }

    animateLogoHover() {
        this.createLogoGlow();
    }

    resetLogoHover() {
        
    }

    handleLogoClick() {
        this.logo.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.logo.style.transform = 'scale(1.05)';
        }, 150);

        this.trackLogoClick();
        this.showAboutModal();
    }

    createLogoGlow() {
        const glow = document.createElement('div');
        glow.style.cssText = `
            position: absolute;
            top: -10px;
            left: -10px;
            right: -10px;
            bottom: -10px;
            background: radial-gradient(circle, var(--cta-primary-alpha-20) 0%, transparent 70%);
            border-radius: 50%;
            animation: ctaLogoGlow 1s ease-out;
            pointer-events: none;
            z-index: -1;
        `;
        
        this.logo.style.position = 'relative';
        this.logo.appendChild(glow);
        setTimeout(() => glow.remove(), 1000);
    }

    setupFeatureAnimations() {
        this.features.forEach((feature, index) => {
            feature.style.opacity = '0';
            feature.style.transform = 'translateX(-20px)';
            feature.style.transition = 'all 0.4s ease';
        });
    }

    animateFeatures() {
        this.features.forEach((feature, index) => {
            setTimeout(() => {
                feature.style.opacity = '1';
                feature.style.transform = 'translateX(0)';
                
                this.createFeatureGlow(feature);
            }, index * 150);
        });
    }

    createFeatureGlow(feature) {
        const icon = feature.querySelector('svg');
        if (icon) {
            icon.style.filter = 'drop-shadow(0 0 8px var(--cta-primary-alpha-50))';
            setTimeout(() => {
                icon.style.filter = 'none';
            }, 1000);
        }
    }

    trackConsultationClick() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'cta_consultation_click', {
                section: 'cta',
                button_type: 'primary'
            });
        }
    }

    trackCallClick() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'cta_call_click', {
                section: 'cta',
                button_type: 'secondary'
            });
        }
    }

    trackLogoClick() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'cta_logo_click', {
                section: 'cta'
            });
        }
    }

    showConsultationModal() {
        console.log('Opening consultation modal from CTA');
    }

    initiateCall() {
        window.open('tel:+994503102529', '_self');
    }

    showAboutModal() {
        console.log('Opening about modal from logo click');
    }

    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

const ctaCSS = `
@keyframes ctaRipple {
    to {
        transform: translate(-50%, -50%) scale(2);
        opacity: 0;
    }
}

@keyframes ctaSparkle {
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

@keyframes ctaLogoGlow {
    0% {
        transform: scale(0);
        opacity: 0.8;
    }
    50% {
        transform: scale(1);
        opacity: 0.4;
    }
    100% {
        transform: scale(1.2);
        opacity: 0;
    }
}

.cta__badge,
.cta__title,
.cta__subtitle,
.cta__buttons,
.cta__features,
.cta__logo {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
`;

const style = document.createElement('style');
style.textContent = ctaCSS;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    const ctaSection = new CtaSection();
    window.CtaSection = ctaSection;
});