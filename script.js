// Render Lucide Vector Icons
lucide.createIcons();

// --- Sound State ---
let isMuted = false;

function toggleSound() {
    isMuted = !isMuted;
    const soundIcon = document.getElementById('soundIcon');
    
    if (isMuted) {
        soundIcon.setAttribute('data-lucide', 'volume-x');
    } else {
        soundIcon.setAttribute('data-lucide', 'volume-2');
    }
    lucide.createIcons();
}

// --- Page Switching Logic ---
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));

    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
}

// --- Modal Popup Manager ---
function openModal(title, text) {
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalBody').innerText = text;
    document.getElementById('modalOverlay').classList.add('active');
}

function closeModals() {
    document.getElementById('modalOverlay').classList.remove('active');
}

function toggleLoginModal() {
    openModal('Roblox Authentication', 'Redirecting to Roblox login portal... Grant permissions to sync your garden stats.');
}

function toggleMenu() {
    openModal('Navigation Menu', 'Options:\n• Server Status: Online\n• Community Discord\n• Support Portal');
}

function toggleLanguage() {
    const langText = document.getElementById('langText');
    if (langText.innerText === 'US') {
        langText.innerText = 'EU';
    } else {
        langText.innerText = 'US';
    }
}

// --- Search functionality ---
function handleSearch(event) {
    if (event.key === 'Enter') {
        const query = event.target.value.trim().toLowerCase();
        if (query.includes('leak')) {
            showPage('leaks-page');
        } else if (query.includes('announc') || query.includes('update')) {
            showPage('announcements-page');
        } else if (query !== '') {
            openModal('Search Results', `Searching database for "${query}"... No matches found.`);
        }
    }
}

// Fallback if logo file is missing
document.getElementById('gameLogo').addEventListener('error', function() {
    this.style.display = 'none';
    const container = document.querySelector('.logo-container');
    container.innerHTML = `<h2 style="color: #71b933; font-weight: 900; font-size: 2.2rem;">GROW A GARDEN 2</h2>`;
});