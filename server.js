require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS so your GitHub Pages site can make requests to Render
app.use(cors());
app.use(express.json());

const CLIENT_ID = process.env.ROBLOX_CLIENT_ID;
const CLIENT_SECRET = process.env.ROBLOX_CLIENT_SECRET;
// Server-side configured redirect URI (recommended).
const SERVER_REDIRECT_URI = process.env.ROBLOX_REDIRECT_URI;
const NODE_ENV = process.env.NODE_ENV || 'production';
// Optional whitelist of redirect URIs (comma-separated) to allow client-provided redirects in production for testing.
const ALLOWED_REDIRECT_URIS = process.env.ALLOWED_REDIRECT_URIS || '';

// Build a normalized set for efficient checks (normalize by removing trailing slash)
const normalize = (u) => {
    if (!u) return u;
    try {
        return u.endsWith('/') ? u.slice(0, -1) : u;
    } catch (e) {
        return u;
    }
};

const allowedSet = new Set(
    ALLOWED_REDIRECT_URIS.split(',')
        .map(s => s.trim())
        .filter(Boolean)
        .map(normalize)
);

// Root endpoint to verify server is active
app.get('/', (req, res) => {
    res.send('PlayGarp Backend is Live!');
});

// OAuth Callback & Token Exchange Endpoint
app.post('/api/oauth/callback', async (req, res) => {
    const { code, redirect_uri } = req.body;

    if (!code) {
        return res.status(400).json({ error: 'Missing authorization code' });
    }

    try {
        // Determine which redirect URI to use for the token exchange.
        // Priority:
        // 1) If NODE_ENV === 'development' and a client-provided redirect_uri exists -> use it (developer convenience)
        // 2) If client-provided redirect_uri is localhost -> allow it for testing (temporary)
        // 3) If client-provided redirect_uri is present and is listed in ALLOWED_REDIRECT_URIS -> use it (safe whitelist)
        // 4) Otherwise use SERVER_REDIRECT_URI (recommended for production)

        let redirectToUse = null;

        const isLocalRedirect = redirect_uri && (redirect_uri.startsWith('http://localhost') || redirect_uri.startsWith('http://127.0.0.1'));

        if (NODE_ENV === 'development' && redirect_uri) {
            redirectToUse = redirect_uri;
            console.log('Using client redirect (development) ->', redirectToUse);
        } else if (isLocalRedirect) {
            redirectToUse = redirect_uri;
            console.log('Using client redirect (localhost allowed) ->', redirectToUse);
        } else if (redirect_uri && allowedSet.has(normalize(redirect_uri))) {
            redirectToUse = redirect_uri;
            console.log('Using client redirect (whitelisted) ->', redirectToUse);
        } else {
            redirectToUse = SERVER_REDIRECT_URI;
            console.log('Using server-configured redirect ->', redirectToUse);
        }

        if (!redirectToUse) {
            return res.status(400).json({ error: 'No redirect URI configured on server and none allowed from client' });
        }

        // DEBUG LOG: print the redirectToUse so we can confirm what's being sent to Roblox
        console.log('SERVER redirectToUse ->', redirectToUse);

        // 1. Exchange authorization code for access token
        const tokenParams = new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirectToUse
        });

        const tokenResponse = await fetch('https://apis.roblox.com/oauth/v1/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: tokenParams
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
            console.error('Roblox Token Error:', tokenData);
            return res.status(tokenResponse.status).json(tokenData);
        }

        // 2. Retrieve user profile info using access token
        const userResponse = await fetch('https://apis.roblox.com/oauth/v1/userinfo', {
            headers: { 'Authorization': `Bearer ${tokenData.access_token}` }
        });

        const userData = await userResponse.json();

        // 3. Return user data and token to client
        res.json({
            access_token: tokenData.access_token,
            user: userData
        });

    } catch (err) {
        console.error('Server error during OAuth exchange:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Changed local fallback port to 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
