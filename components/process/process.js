class ProcessSection {
    constructor() {
        this.steps = document.querySelectorAll('.process__step');
        this.ctaBtn = document.querySelector('.process__cta-btn');
        this.section = document.querySelector('.process');
        this.currentStep = 0;
        
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupStepAnimations();
        this.setupCtaInteraction();
        this.setupScrollTrigger();
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
                    this.animateStepsSequentially();
                }
            });
        }, options);

        if (this.section) {
            this.observer.observe(this.section);
        }
    }

    animateStepsSequentially() {
        this.steps.forEach((step, index) => {
            setTimeout(() => {
                step.classList.add('visible');
                this.animateStepNumber(step);
            }, index * 400);
        });
    }

    animateStepNumber(step) {
        const number = step.querySelector('.process__step-number');
        if (number) {
            number.style.transform = 'translateX(-50%) scale(1.2)';
            setTimeout(() => {
                number.style.transform = 'translateX(-50%) scale(1)';
            }, 200);
        }
    }

    setupStepAnimations() {
        this.steps.forEach((step, index) => {
            const content = step.querySelector('.process__step-content');
            const image = step.querySelector('.process__step-image');
            
            step.addEventListener('mouseenter', () => {
                this.activateStep(step, index);
            });

            step.addEventListener('mouseleave', () => {
                this.deactivateStep(step);
            });

            if (image) {
                image.addEventListener('click', () => {
                    this.handleImageClick(step, index);
                });
            }
        });
    }

    activateStep(step, index) {
        step.classList.add('step-active');
        
        const features = step.querySelectorAll('.feature-item');
        features.forEach((feature, i) => {
            setTimeout(() => {
                feature.style.transform = 'translateX(10px)';
                feature.style.background = 'var(--process-primary-alpha-15)';
            }, i * 100);
        });

        this.createSparkles(step);
    }

    deactivateStep(step) {
        step.classList.remove('step-active');
        
        const features = step.querySelectorAll('.feature-item');
        features.forEach(feature => {
            feature.style.transform = 'translateX(0)';
            feature.style.background = 'var(--process-primary-alpha-05)';
        });
    }

    handleImageClick(step, index) {
        this.trackStepInteraction(index);
        this.showStepModal(step, index);
    }

    createSparkles(step) {
        const content = step.querySelector('.process__step-content');
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.style.cssText = `
                    position: absolute;
                    top: ${Math.random() * 100}%;
                    left: ${Math.random() * 100}%;
                    width: 4px;
                    height: 4px;
                    background: var(--process-primary);
                    border-radius: 50%;
                    animation: sparkleFloat 1s ease-out forwards;
                    pointer-events: none;
                    z-index: 100;
                `;
                content.appendChild(sparkle);
                
                setTimeout(() => sparkle.remove(), 1000);
            }, i * 100);
        }
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
        this.ctaBtn.style.transform = 'translateY(-3px) scale(0.98)';
        setTimeout(() => {
            this.ctaBtn.style.transform = 'translateY(-3px) scale(1)';
        }, 150);

        this.trackCtaClick();
        this.showContactModal();
    }

    animateCtaHover() {
        const svg = this.ctaBtn.querySelector('svg');
        if (svg) {
            svg.style.animation = 'arrowBounce 0.6s ease infinite';
        }
    }

    setupScrollTrigger() {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            const direction = currentScrollY > lastScrollY ? 'down' : 'up';
            
            this.updateStepsOnScroll(direction);
            lastScrollY = currentScrollY;
        });
    }

    updateStepsOnScroll(direction) {
        const sectionRect = this.section.getBoundingClientRect();
        const sectionCenter = sectionRect.top + sectionRect.height / 2;
        const viewportCenter = window.innerHeight / 2;
        
        if (Math.abs(sectionCenter - viewportCenter) < 200) {
            this.highlightActiveStep();
        }
    }

    highlightActiveStep() {
        this.steps.forEach((step, index) => {
            const rect = step.getBoundingClientRect();
            const isInView = rect.top < window.innerHeight * 0.7 && rect.bottom > window.innerHeight * 0.3;
            
            if (isInView && this.currentStep !== index) {
                this.currentStep = index;
                this.emphasizeStep(step);
            }
        });
    }

    emphasizeStep(step) {
        this.steps.forEach(s => s.classList.remove('step-emphasized'));
        step.classList.add('step-emphasized');
        
        const pulse = step.querySelector('.process__step-pulse');
        if (pulse) {
            pulse.style.animation = 'stepPulse 1s ease-out';
        }
    }

    trackStepInteraction(index) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'process_step_click', {
                step_number: index + 1,
                section: 'process'
            });
        }
    }

    trackCtaClick() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'process_cta_click', {
                section: 'process',
                button_text: 'İndi Sifariş Ver'
            });
        }
    }

    showStepModal(step, index) {
        console.log(`Opening modal for step ${index + 1}`);
    }

    showContactModal() {
        console.log('Opening contact modal');
    }

    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        
        window.removeEventListener('scroll', this.updateStepsOnScroll);
    }
}

const sparkleCSS = `
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

@keyframes arrowBounce {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(5px); }
}

.step-emphasized .process__step-number {
    animation: emphasizePulse 2s ease-in-out;
}

@keyframes emphasizePulse {
    0%, 100% { transform: translateX(-50%) scale(1); }
    50% { transform: translateX(-50%) scale(1.1); }
}
`;

const style = document.createElement('style');
style.textContent = sparkleCSS;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    const processSection = new ProcessSection();
    window.ProcessSection = processSection;
});