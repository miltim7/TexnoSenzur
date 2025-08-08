class ContactSection {
    constructor() {
        this.section = document.querySelector('.contact');
        this.form = document.querySelector('#contactForm');
        this.submitBtn = this.form?.querySelector('.contact__submit-btn');
        this.formStatus = this.form?.querySelector('#formStatus');
        this.inputs = this.form?.querySelectorAll('.contact__input');
        
        this.isSubmitting = false;
        
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupFormHandling();
        this.setupInputAnimations();
        this.setupPhoneFormatting();
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
            this.section.querySelector('.contact__badge'),
            this.section.querySelector('.contact__title'),
            this.section.querySelector('.contact__subtitle'),
            this.section.querySelector('.contact__form-wrapper')
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

    setupFormHandling() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                this.handleFormSubmit(e);
            });
        }
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        if (this.isSubmitting) return;
        
        const formData = new FormData(this.form);
        const data = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            message: formData.get('message')
        };

        if (!this.validateForm(data)) {
            return;
        }

        this.isSubmitting = true;
        this.setLoadingState(true);

        try {
            await this.sendEmail(data);
            this.showStatus('success', 'Mesajınız uğurla göndərildi! Tezliklə sizinlə əlaqə saxlayacağıq.');
            this.form.reset();
            this.trackFormSubmission('success');
        } catch (error) {
            this.showStatus('error', error.message || 'Mesaj göndərilmədi. Zəhmət olmasa yenidən cəhd edin.');
            this.trackFormSubmission('error');
        } finally {
            this.isSubmitting = false;
            this.setLoadingState(false);
        }
    }

    async sendEmail(data) {
        try {
            const response = await fetch('send_email.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            
            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Server error');
            }
            
            return result;
        } catch (error) {
            console.error('Email send error:', error);
            throw error;
        }
    }

    validateForm(data) {
        const { name, phone, email, message } = data;
        
        if (!name.trim() || name.trim().length < 2) {
            this.showStatus('error', 'Zəhmət olmasa düzgün ad daxil edin.');
            return false;
        }
        
        if (!phone.trim() || !this.isValidPhone(phone)) {
            this.showStatus('error', 'Zəhmət olmasa düzgün telefon nömrəsi daxil edin.');
            return false;
        }
        
        if (!email.trim() || !this.isValidEmail(email)) {
            this.showStatus('error', 'Zəhmət olmasa düzgün email daxil edin.');
            return false;
        }
        
        if (!message.trim() || message.trim().length < 10) {
            this.showStatus('error', 'Mesaj ən azı 10 simvol olmalıdır.');
            return false;
        }
        
        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^(\+994|994)?[0-9]{9}$/;
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
        return phoneRegex.test(cleanPhone);
    }

    setLoadingState(loading) {
        if (this.submitBtn) {
            if (loading) {
                this.submitBtn.classList.add('loading');
                this.submitBtn.disabled = true;
            } else {
                this.submitBtn.classList.remove('loading');
                this.submitBtn.disabled = false;
            }
        }
    }

    showStatus(type, message) {
        if (this.formStatus) {
            this.formStatus.className = `contact__form-status ${type}`;
            this.formStatus.textContent = message;
            
            setTimeout(() => {
                this.formStatus.className = 'contact__form-status';
            }, 5000);
        }
    }

    setupInputAnimations() {
        this.inputs?.forEach(input => {
            input.addEventListener('focus', () => {
                this.animateInputFocus(input);
            });

            input.addEventListener('blur', () => {
                this.animateInputBlur(input);
            });

            input.addEventListener('input', () => {
                this.handleInputChange(input);
            });
        });
    }

    animateInputFocus(input) {
        const group = input.closest('.contact__form-group');
        if (group) {
            group.style.transform = 'translateY(-2px)';
            this.createInputGlow(input);
        }
    }

    animateInputBlur(input) {
        const group = input.closest('.contact__form-group');
        if (group) {
            group.style.transform = 'translateY(0)';
        }
    }

    handleInputChange(input) {
        if (input.value.trim()) {
            input.style.borderColor = 'var(--contact-primary-alpha-30)';
        } else {
            input.style.borderColor = 'var(--contact-white-alpha-15)';
        }
    }

    createInputGlow(input) {
        const glow = document.createElement('div');
        glow.style.cssText = `
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(45deg, var(--contact-primary-alpha-20), transparent, var(--contact-primary-alpha-20));
            border-radius: var(--contact-border-radius-md);
            animation: contactInputGlow 2s ease-out;
            pointer-events: none;
            z-index: -1;
        `;
        
        const group = input.closest('.contact__form-group');
        group.style.position = 'relative';
        group.appendChild(glow);
        setTimeout(() => glow.remove(), 2000);
    }

    setupPhoneFormatting() {
        const phoneInput = this.form?.querySelector('#phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                this.formatPhoneNumber(e.target);
            });
        }
    }

    formatPhoneNumber(input) {
        let value = input.value.replace(/[^\d]/g, '');
        
        if (value.startsWith('994')) {
            value = '+' + value;
        } else if (value.length > 0 && !value.startsWith('+994')) {
            value = '+994' + value;
        }
        
        if (value.length > 13) {
            value = value.substring(0, 13);
        }
        
        input.value = value;
    }

    trackFormSubmission(status) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'contact_form_submit', {
                status: status,
                section: 'contact'
            });
        }
    }

    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

const contactCSS = `
@keyframes contactInputGlow {
    0% {
        opacity: 0;
        transform: scale(0.8);
    }
    50% {
        opacity: 1;
        transform: scale(1);
    }
    100% {
        opacity: 0;
        transform: scale(1.1);
    }
}

.contact__badge,
.contact__title,
.contact__subtitle,
.contact__form-wrapper {
    opacity: 0;
    transform: translateY(50px);
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}
`;

const style = document.createElement('style');
style.textContent = contactCSS;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    const contactSection = new ContactSection();
    window.ContactSection = contactSection;
});