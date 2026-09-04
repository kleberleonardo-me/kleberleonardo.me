/**
 * DIGITAL IDENTITY CARD - CORE INTERACTION & EXPERIENCE CONTROLLER
 * Engineered for GitHub Pages deployment (Vanilla JS)
 */

// CONFIGURATION: Set destination messaging URL here (encoded)
const CONFIG = {
    // Array of string fragments that resolve to "im/index.html"
    MESSENGER_PATH: ['i', 'm', '/', 'i', 'n', 'd', 'e', 'x', '.', 'h', 't', 'm', 'l'],
    ENABLE_PARALLAX: true,
    TILT_MAX_ANGLE: 8 // Max tilt angle in degrees
};

document.addEventListener('DOMContentLoaded', () => {
    initEntryAnimation();
    initParallaxAndTilt();
    initAtmosphereCanvas();
    initProtectionHandlers();
    initActions();
});

/**
 * Entry Sequence Controller
 */
function initEntryAnimation() {
    const card = document.getElementById('cardContainer');
    setTimeout(() => {
        card.classList.add('is-ready');
    }, 100);
}

/**
 * 3D Parallax & Gyroscope Motion Controller
 */
function initParallaxAndTilt() {
    if (!CONFIG.ENABLE_PARALLAX) return;

    const card = document.getElementById('cardContainer');
    let bounds = card.getBoundingClientRect();

    function updateBounds() {
        bounds = card.getBoundingClientRect();
    }

    window.addEventListener('resize', updateBounds);

    // Mouse Movement (Desktop)
    window.addEventListener('mousemove', (e) => {
        if (window.innerWidth < 768) return; // Disable complex desktop tilt on mobile touch devices

        const mouseX = e.clientX;
        const mouseY = e.clientY;

        const leftX = mouseX - bounds.left;
        const topY = mouseY - bounds.top;

        const center = {
            x: leftX - bounds.width / 2,
            y: topY - bounds.height / 2
        };

        const distance = Math.sqrt(center.x ** 2 + center.y ** 2);

        const rotateX = (center.y / (bounds.height / 2)) * -CONFIG.TILT_MAX_ANGLE;
        const rotateY = (center.x / (bounds.width / 2)) * CONFIG.TILT_MAX_ANGLE;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
    });

    // Reset card tilt on mouse leave
    document.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });

    // Mobile Gyroscope Integration (Mobile Device Orientation)
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', (e) => {
            if (window.innerWidth > 768) return;
            
            const beta = e.beta;   // Pitch (-180 to 180)
            const gamma = e.gamma; // Roll (-90 to 90)

            if (beta && gamma) {
                const tiltX = Math.min(Math.max(beta - 45, -CONFIG.TILT_MAX_ANGLE), CONFIG.TILT_MAX_ANGLE);
                const tiltY = Math.min(Math.max(gamma, -CONFIG.TILT_MAX_ANGLE), CONFIG.TILT_MAX_ANGLE);

                card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
            }
        });
    }
}

/**
 * Atmospheric Particle Canvas Generator
 */
function initAtmosphereCanvas() {
    const canvas = document.getElementById('atmosphere-canvas');
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = Array.from({ length: 35 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.2 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
        speedY: -(Math.random() * 0.3 + 0.1)
    }));

    function render() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.y += p.speedY;
            if (p.y < 0) {
                p.y = height;
                p.x = Math.random() * width;
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(226, 192, 141, ${p.alpha})`;
            ctx.fill();
        });

        requestAnimationFrame(render);
    }

    render();
}

/**
 * Native App Feel UI Protection
 */
function initProtectionHandlers() {
    // Prevent context menu
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    // Prevent image dragging
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('dragstart', (e) => e.preventDefault());
    });

    // Prevent key combinations (Copy, Save, Inspect)
    document.addEventListener('keydown', (e) => {
        if (
            (e.ctrlKey || e.metaKey) && 
            (e.key === 'c' || e.key === 's' || e.key === 'u' || e.key === 'i')
        ) {
            e.preventDefault();
        }
    });
}

/**
 * CTA Button Action Handler
 */
function initActions() {
    const btn = document.getElementById('ctaButton');
    if (!btn) return;

    btn.addEventListener('click', (e) => {
        e.preventDefault();

        // Subtle tactile feel trigger
        if (navigator.vibrate) {
            navigator.vibrate(20);
        }

        // Dynamically build path on click to bypass static scraping and avoid hover status preview
        const targetUrl = CONFIG.MESSENGER_PATH.join('');
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
    });
}
