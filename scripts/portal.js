/* ==========================================
   PORTAL & FLOATING ANIMATIONS
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    initPortalParticles();
});

function initPortalParticles() {
    const container = document.body;
    const particleCount = 12;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.cssText = `
            position: fixed;
            width: ${Math.random() * 8 + 4}px;
            height: ${Math.random() * 8 + 4}px;
            background: ${Math.random() > 0.5 ? 'rgba(0, 255, 136, 0.4)' : 'rgba(59, 130, 246, 0.4)'};
            border-radius: 50%;
            pointer-events: none;
            left: ${Math.random() * 100}vw;
            top: ${Math.random() * 100}vh;
            filter: blur(2px);
            animation: floatParticle ${Math.random() * 10 + 10}s infinite ease-in-out;
            z-index: 0;
        `;
        container.appendChild(particle);
    }
}