document.addEventListener('DOMContentLoaded', function() {
    const hero = document.querySelector('.hero');
    const video = document.querySelector('.hero__video-bg');
    const particlesContainer = document.querySelector('.hero__particles');
    const statNumbers = document.querySelectorAll('.hero__stat-number');
    
    function createParticles() {
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'hero__particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = (15 + Math.random() * 10) + 's';
            particlesContainer.appendChild(particle);
        }
    }
    
    createParticles();
    
    function handleVideoLoad() {
        video.play().catch(error => {
            console.log('Video autoplay failed:', error);
        });
    }
    
    if (video) {
        video.addEventListener('loadeddata', handleVideoLoad);
        
        video.addEventListener('ended', function() {
            video.currentTime = 0;
            video.play();
        });
    }
    
    function animateNumbers() {
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalNumber = parseInt(target.getAttribute('data-count'));
                    const duration = 2000;
                    const increment = finalNumber / (duration / 16);
                    let currentNumber = 0;
                    
                    const updateNumber = () => {
                        currentNumber += increment;
                        if (currentNumber < finalNumber) {
                            target.textContent = Math.floor(currentNumber) + '+';
                            requestAnimationFrame(updateNumber);
                        } else {
                            target.textContent = finalNumber + '+';
                        }
                    };
                    
                    updateNumber();
                    observer.unobserve(target);
                }
            });
        }, observerOptions);
        
        statNumbers.forEach(stat => {
            observer.observe(stat);
        });
    }
    
    if (statNumbers.length > 0) {
        animateNumbers();
    }
    
    const heroTitle = document.querySelector('.hero__title');
    const heroSubtitle = document.querySelector('.hero__subtitle');
    
    const glitchElements = document.querySelectorAll('.hero__glitch');
    glitchElements.forEach(element => {
        element.setAttribute('data-text', element.textContent);
    });
    
    const buttons = document.querySelectorAll('.hero__btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function(e) {
            const ripple = document.createElement('span');
            ripple.className = 'btn-ripple';
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
    
    const style = document.createElement('style');
    style.textContent = `
        .btn-ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            transform: scale(0);
            animation: ripple-effect 0.6s ease-out;
            pointer-events: none;
        }
        @keyframes ripple-effect {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});