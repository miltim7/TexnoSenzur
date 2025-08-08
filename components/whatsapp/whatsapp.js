class WhatsAppWidget {
    constructor() {
        this.whatsappBtn = document.querySelector('.whatsapp-btn');
        this.phoneNumber = '994503102529';
        
        this.init();
    }

    init() {
        this.setupWhatsAppInteraction();
        this.setupScrollBehavior();
    }

    setupWhatsAppInteraction() {
        if (this.whatsappBtn) {
            this.whatsappBtn.addEventListener('click', (e) => {
                this.handleWhatsAppClick(e);
            });

            this.whatsappBtn.addEventListener('mouseenter', () => {
                this.pausePulseAnimation();
            });

            this.whatsappBtn.addEventListener('mouseleave', () => {
                this.resumePulseAnimation();
            });
        }
    }

    handleWhatsAppClick(e) {
        this.whatsappBtn.style.transform = 'translateY(-3px) scale(0.95)';
        setTimeout(() => {
            this.whatsappBtn.style.transform = 'translateY(-3px) scale(1.05)';
        }, 150);

        this.trackWhatsAppClick();
    }

    pausePulseAnimation() {
        this.whatsappBtn.style.animationPlayState = 'paused';
    }

    resumePulseAnimation() {
        this.whatsappBtn.style.animationPlayState = 'running';
    }

    setupScrollBehavior() {
        let lastScrollTop = 0;
        const whatsappFloat = document.querySelector('.whatsapp-float');

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop && scrollTop > 300) {
                whatsappFloat.style.transform = 'translateY(100px)';
                whatsappFloat.style.opacity = '0.7';
            } else {
                whatsappFloat.style.transform = 'translateY(0)';
                whatsappFloat.style.opacity = '1';
            }
            
            lastScrollTop = scrollTop;
        });
    }

    trackWhatsAppClick() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'whatsapp_click', {
                phone_number: this.phoneNumber,
                widget_type: 'floating_button'
            });
        }
        
        console.log('WhatsApp button clicked - redirecting to chat');
    }
}

const whatsappCSS = `
.whatsapp-float {
    transition: all 0.3s ease;
}
`;

const style = document.createElement('style');
style.textContent = whatsappCSS;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    const whatsappWidget = new WhatsAppWidget();
    window.WhatsAppWidget = whatsappWidget;
});