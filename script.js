// --- CONFIGURATION ---
const CLIENT_ID = '4037165407323325158';

// Local port 3000 vs Live GitHub Pages URL
const REDIRECT_URI = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3000/'
    : 'https://fatalquackers.github.io/PlayGarp/';

// Local port 3000 vs Live Render backend URL
const BACKEND_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3000'
    : 'https://playgarp-backend.onrender.com';

// --- FUNCTIONS ---

// Trigger Roblox OAuth Redirect
function loginWithRoblox() {
    const authUrl = `https://apis.roblox.com/oauth/v1/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=openid%20profile`;
    window.location.href = authUrl;
}
}

// Process OAuth Code returning from Roblox redirect
async function handleOAuthCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
        // Clean up the URL bar
        window.history.replaceState({}, document.title, window.location.pathname);

        try {
            const res = await fetch(`${BACKEND_URL}/api/oauth/callback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: code, redirect_uri: REDIRECT_URI })
            });

            const data = await res.json();

            if (res.ok && data.user) {
                updateProfileBadge(data.user);
            } else {
                console.error('Authentication error:', data);
            }
        } catch (err) {
            console.error('Failed to reach backend:', err);
        }
    }
}

// Update UI Badge with Roblox Avatar
async function updateProfileBadge(user) {
    const badgeElement = document.getElementById('profile-badge');
    if (!badgeElement) return;

    try {
        const thumbRes = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${user.sub}&size=150x150&format=Png&isCircular=true`);
        const thumbData = await thumbRes.json();

        if (thumbData.data && thumbData.data.length > 0) {
            const avatarUrl = thumbData.data[0].imageUrl;
            badgeElement.innerHTML = `<img src="${avatarUrl}" alt="${user.preferred_username}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
        }
    } catch (e) {
        console.error('Failed to fetch avatar image:', e);
        badgeElement.textContent = user.preferred_username ? user.preferred_username[0].toUpperCase() : '✓';
    }
}

// Initialize handler when DOM is loaded
document.addEventListener('DOMContentLoaded', handleOAuthCallback);
