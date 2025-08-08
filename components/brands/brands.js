class SmoothCarousel {
    constructor(container, track) {
        this.container = container;
        this.track = track;
        this.items = track.children;
        this.thumb = document.getElementById('scrollThumb');
        
        this.pos = { x: 0, y: 0 };
        this.startPos = { x: 0, y: 0 };
        this.velocity = 0;
        this.isDragging = false;
        this.animationId = null;
        this.lastTime = 0;
        this.translateX = 0;
        
        this.setup();
    }

    setup() {
        this.calculateBounds();
        this.addEventListeners();
        this.updateScrollbar();
        
        window.addEventListener('resize', () => {
            this.calculateBounds();
            this.updateScrollbar();
        });
    }

    calculateBounds() {
        this.trackWidth = this.track.scrollWidth;
        this.containerWidth = this.container.offsetWidth;
        this.maxTranslate = 0;
        this.minTranslate = this.containerWidth - this.trackWidth;
    }

    addEventListeners() {
        this.container.addEventListener('mousedown', this.startDrag.bind(this));
        this.container.addEventListener('touchstart', this.startDrag.bind(this), { passive: false });
        
        document.addEventListener('mousemove', this.drag.bind(this));
        document.addEventListener('touchmove', this.drag.bind(this), { passive: false });
        
        document.addEventListener('mouseup', this.endDrag.bind(this));
        document.addEventListener('touchend', this.endDrag.bind(this));
        
        this.container.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });
    }

    startDrag(e) {
        this.isDragging = true;
        this.startPos.x = this.getX(e);
        this.startPos.y = this.getY(e);
        this.lastTime = Date.now();
        this.velocity = 0;
        
        this.container.style.cursor = 'grabbing';
        
        cancelAnimationFrame(this.animationId);
    }

    drag(e) {
        if (!this.isDragging) return;
        e.preventDefault();
        
        const currentTime = Date.now();
        const deltaTime = currentTime - this.lastTime;
        this.pos.x = this.getX(e);
        
        const deltaX = this.pos.x - this.startPos.x;
        this.translateX += deltaX;
        
        if (deltaTime > 0) {
            this.velocity = deltaX / deltaTime;
        }
        
        this.clampPosition();
        this.updateTransform();
        this.updateScrollbar();
        
        this.startPos.x = this.pos.x;
        this.lastTime = currentTime;
    }

    endDrag() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.container.style.cursor = 'grab';
        
        if (Math.abs(this.velocity) > 0.2) {
            this.applyInertia();
        }
    }

    applyInertia() {
        let amplitude = this.velocity * 15;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const damping = Math.min(elapsed / 1000, 1) * 0.1 + 0.9;
            
            amplitude *= damping;
            this.translateX += amplitude;
            
            this.clampPosition();
            this.updateTransform();
            this.updateScrollbar();
            
            if (Math.abs(amplitude) > 0.5) {
                this.animationId = requestAnimationFrame(animate);
            }
        };
        
        this.animationId = requestAnimationFrame(animate);
    }

    clampPosition() {
        this.translateX = Math.max(this.minTranslate, Math.min(this.maxTranslate, this.translateX));
    }

    updateTransform() {
        this.track.style.transform = `translateX(${this.translateX}px)`;
    }

    updateScrollbar() {
        if (!this.thumb) return;
        
        const trackWidth = this.track.scrollWidth;
        const containerWidth = this.container.offsetWidth;
        
        if (trackWidth <= containerWidth) {
            this.thumb.style.display = 'none';
            return;
        }
        
        this.thumb.style.display = 'block';
        
        const scrollbarWidth = this.thumb.parentElement.offsetWidth;
        const thumbWidth = Math.max((containerWidth / trackWidth) * scrollbarWidth, 30);
        const maxThumbX = scrollbarWidth - thumbWidth;
        const progress = Math.abs(this.translateX) / Math.abs(this.minTranslate);
        const thumbX = progress * maxThumbX;
        
        this.thumb.style.width = `${thumbWidth}px`;
        this.thumb.style.transform = `translateX(${thumbX}px)`;
    }

    handleWheel(e) {
        e.preventDefault();
        this.translateX -= e.deltaY * 0.5;
        this.clampPosition();
        this.updateTransform();
        this.updateScrollbar();
    }

    getX(e) {
        return e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    }

    getY(e) {
        return e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.getElementById('brandsCarousel');
    const track = document.getElementById('brandsTrack');
    
    if (carousel && track) {
        new SmoothCarousel(carousel, track);
    }
});