class AdvantagesSection {
    constructor() {
        this.counters = document.querySelectorAll('.counter-item__number');
        this.particles = document.querySelectorAll('.particle');
        this.advantageCards = document.querySelectorAll('.advantage-card');
        this.section = document.querySelector('.advantages');
        this.isCounterAnimated = false;
        this.isVisible = false;

        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupCounterAnimation();
        this.setupCardInteractions();
        this.setupParticleAnimation();
    }

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '-10% 0px -10% 0px',
            threshold: 0.3
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.isVisible) {
                    this.isVisible = true;
                    this.startCounterAnimation();
                }
            });
        }, options);

        if (this.section) {
            this.observer.observe(this.section);
        }
    }

    setupCounterAnimation() {
        this.counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            counter.textContent = '0';
        });
    }

    startCounterAnimation() {
        if (this.isCounterAnimated) return;
        this.isCounterAnimated = true;

        this.counters.forEach((counter, index) => {
            setTimeout(() => {
                this.animateCounter(counter);
            }, index * 200);
        });
    }

    animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2500;
        const start = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);

            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOutCubic * target);

            counter.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(animate);

                if (Math.floor(elapsed / 100) % 2 === 0) {
                    counter.style.transform = 'scale(1.05)';
                } else {
                    counter.style.transform = 'scale(1)';
                }
            } else {
                counter.textContent = target;
                counter.style.transform = 'scale(1)';
                this.addCompletionEffect(counter);
            }
        };

        requestAnimationFrame(animate);
    }

    addCompletionEffect(counter) {
        counter.style.transition = 'all 0.3s ease';
        counter.style.transform = 'scale(1.1)';
        counter.style.textShadow = '0 0 20px var(--advantages-primary)';

        setTimeout(() => {
            counter.style.transform = 'scale(1)';
            counter.style.textShadow = 'none';
        }, 300);
    }

    setupCardInteractions() {
        this.advantageCards.forEach((card, index) => {
            card.addEventListener('mouseenter', () => {
                this.activateCard(card, index);
            });

            card.addEventListener('mouseleave', () => {
                this.deactivateCard(card);
            });

            card.addEventListener('click', () => {
                this.handleCardClick(card, index);
            });

            card.addEventListener('touchstart', () => {
                this.activateCard(card, index);
            }, { passive: true });
        });
    }

    activateCard(card, index) {
        card.classList.add('card-active');
        this.createRippleEffect(card);

        if ('vibrate' in navigator && window.innerWidth <= 768) {
            navigator.vibrate(10);
        }
    }

    deactivateCard(card) {
        card.classList.remove('card-active');
    }

    handleCardClick(card, index) {
        this.createClickEffect(card);

        if (typeof gtag !== 'undefined') {
            gtag('event', 'advantage_card_click', {
                card_index: index,
                section: 'advantages'
            });
        }
    }

    createRippleEffect(card) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
           position: absolute;
           top: 50%;
           left: 50%;
           width: 10px;
           height: 10px;
           background: var(--advantages-primary-alpha-30);
           border-radius: 50%;
           transform: translate(-50%, -50%) scale(0);
           animation: rippleExpand 0.6s ease-out;
           pointer-events: none;
           z-index: 10;
       `;

        card.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    createClickEffect(card) {
        card.style.transform = 'translateY(-20px) scale(0.98)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
    }

    setupParticleAnimation() {
        this.particles.forEach((particle, index) => {
            const speed = parseFloat(particle.getAttribute('data-speed')) || 0.5;
            const delay = index * 3000;

            particle.style.animationDuration = `${20 / speed}s`;
            particle.style.animationDelay = `${delay}ms`;
            particle.style.animationPlayState = 'running';
        });
    }

    refresh() {
        this.isCounterAnimated = false;
        this.isVisible = false;
        this.setupCounterAnimation();
    }

    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }

        this.advantageCards.forEach(card => {
            card.removeEventListener('mouseenter', this.activateCard);
            card.removeEventListener('mouseleave', this.deactivateCard);
            card.removeEventListener('click', this.handleCardClick);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const advantagesSection = new AdvantagesSection();
    window.AdvantagesSection = advantagesSection;
});

document.addEventListener('visibilitychange', () => {
    const particles = document.querySelectorAll('.particle');
    if (document.hidden) {
        particles.forEach(particle => {
            particle.style.animationPlayState = 'paused';
        });
    } else {
        particles.forEach(particle => {
            particle.style.animationPlayState = 'running';
        });
    }
});