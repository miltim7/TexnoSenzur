class ServicesSection {
    constructor() {
        this.section = document.querySelector('.services');
        this.cards = document.querySelectorAll('.services__card');
        this.ctaBtn = document.querySelector('.services__cta-btn');
        this.decorations = document.querySelectorAll('.services__decoration');
        this.currentCard = 0;
        
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupCardAnimations();
        this.setupCtaInteraction();
        this.setupCardFiltering();
        this.setupScrollAnimations();
    }

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '-10% 0px -10% 0px',
            threshold: 0.2
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCardsSequentially();
                }
            });
        }, options);

        if (this.section) {
            this.observer.observe(this.section);
        }
    }

    animateCardsSequentially() {
        this.cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                this.createCardEntryEffect(card);
            }, index * 150);
        });
    }

    setupCardAnimations() {
        this.cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px)';
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';

            card.addEventListener('mouseenter', () => {
                this.activateCard(card, index);
            });

            card.addEventListener('mouseleave', () => {
                this.deactivateCard(card);
            });

            card.addEventListener('click', () => {
                this.handleCardClick(card, index);
            });
        });
    }

    activateCard(card, index) {
        card.classList.add('card-active');
        this.currentCard = index;
        
        this.createCardHoverEffect(card);
        this.animateCardIcon(card);
        this.animateCardList(card);
    }

    deactivateCard(card) {
        card.classList.remove('card-active');
    }

    createCardEntryEffect(card) {
        const sparkles = document.createElement('div');
        sparkles.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            z-index: 10;
        `;
        
        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.style.cssText = `
                    position: absolute;
                    top: ${Math.random() * 100}%;
                    left: ${Math.random() * 100}%;
                    width: 4px;
                    height: 4px;
                    background: var(--services-primary);
                    border-radius: 50%;
                    animation: serviceSparkleFloat 1.5s ease-out forwards;
                `;
                sparkles.appendChild(sparkle);
                
                setTimeout(() => sparkle.remove(), 1500);
            }, i * 100);
        }
        
        card.appendChild(sparkles);
        setTimeout(() => sparkles.remove(), 2000);
    }

    createCardHoverEffect(card) {
        const icon = card.querySelector('.services__card-icon');
        if (icon) {
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                width: 20px;
                height: 20px;
                background: var(--services-primary-alpha-30);
                border-radius: 50%;
                transform: translate(-50%, -50%) scale(0);
                animation: serviceIconRipple 0.8s ease-out;
                pointer-events: none;
            `;
            
            icon.appendChild(ripple);
            setTimeout(() => ripple.remove(), 800);
        }
    }

    animateCardIcon(card) {
        const icon = card.querySelector('.services__card-icon');
        if (icon) {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
            setTimeout(() => {
                icon.style.transform = 'scale(1.1) rotate(-5deg)';
                setTimeout(() => {
                    icon.style.transform = 'scale(1.1) rotate(0deg)';
                }, 150);
            }, 150);
        }
    }

    animateCardList(card) {
        const listItems = card.querySelectorAll('.services__card-list li');
        listItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.transform = 'translateX(10px)';
                item.style.color = 'var(--services-white)';
            }, index * 50);
        });

        setTimeout(() => {
            listItems.forEach(item => {
                item.style.transform = 'translateX(0)';
                item.style.color = 'var(--services-white-alpha-80)';
            });
        }, 1000);
    }

    handleCardClick(card, index) {
        const category = card.dataset.category;
        
        card.style.transform = 'translateY(-10px) scale(0.98)';
        setTimeout(() => {
            card.style.transform = 'translateY(-10px) scale(1)';
        }, 150);

        this.trackCardClick(category, index);
        this.showServiceModal(category, index);
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
        this.showConsultationModal();
    }

    animateCtaHover() {
        const svg = this.ctaBtn.querySelector('svg');
        if (svg) {
            svg.style.animation = 'serviceArrowBounce 0.6s ease infinite';
        }
    }

    setupCardFiltering() {
        this.cards.forEach(card => {
            const category = card.dataset.category;
            card.addEventListener('mouseenter', () => {
                this.highlightRelatedCards(category);
            });

            card.addEventListener('mouseleave', () => {
                this.resetCardHighlights();
            });
        });
    }

    highlightRelatedCards(category) {
        this.cards.forEach(card => {
            if (card.dataset.category !== category) {
                card.style.opacity = '0.7';
                card.style.transform = 'translateY(0) scale(0.98)';
            }
        });
    }

    resetCardHighlights() {
        this.cards.forEach(card => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
        });
    }

    setupScrollAnimations() {
        window.addEventListener('scroll', () => {
            this.updateCardsOnScroll();
        });
    }

    updateCardsOnScroll() {
        const sectionRect = this.section.getBoundingClientRect();
        const sectionCenter = sectionRect.top + sectionRect.height / 2;
        const viewportCenter = window.innerHeight / 2;
        
        if (Math.abs(sectionCenter - viewportCenter) < 300) {
            this.highlightActiveCard();
        }
    }

    highlightActiveCard() {
        this.cards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            const isInView = rect.top < window.innerHeight * 0.6 && rect.bottom > window.innerHeight * 0.4;
            
            if (isInView && this.currentCard !== index) {
                this.currentCard = index;
                this.emphasizeCard(card);
            }
        });
    }

    emphasizeCard(card) {
        this.cards.forEach(c => c.classList.remove('card-emphasized'));
        card.classList.add('card-emphasized');
        
        const number = card.querySelector('.services__card-number');
        if (number) {
            number.style.animation = 'serviceNumberPulse 1s ease-out';
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
            background: var(--services-black-alpha-20);
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: serviceButtonRipple 0.6s ease-out;
            pointer-events: none;
        `;
        
        button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    trackCardClick(category, index) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'service_card_click', {
                service_category: category,
                card_index: index,
                section: 'services'
            });
        }
    }

    trackCtaClick() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'service_cta_click', {
                button_text: 'Məsləhət Al',
                section: 'services'
            });
        }
    }

    showServiceModal(category, index) {
        console.log(`Opening service modal for ${category}, card ${index}`);
    }

    showConsultationModal() {
        console.log('Opening consultation modal');
    }

    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        
        window.removeEventListener('scroll', this.updateCardsOnScroll);
    }
}

const servicesCSS = `
@keyframes serviceSparkleFloat {
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

@keyframes serviceIconRipple {
    to {
        transform: translate(-50%, -50%) scale(4);
        opacity: 0;
    }
}

@keyframes serviceArrowBounce {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(5px); }
}

@keyframes serviceButtonRipple {
    to {
        transform: translate(-50%, -50%) scale(4);
        opacity: 0;
    }
}

@keyframes serviceNumberPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
}

.card-emphasized .services__card-number {
    animation: serviceNumberPulse 2s ease-in-out;
}
`;

const style = document.createElement('style');
style.textContent = servicesCSS;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    const servicesSection = new ServicesSection();
    window.ServicesSection = servicesSection;
});