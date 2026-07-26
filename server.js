require('dotenv').config(); // <-- ADD THIS AT THE VERY TOP
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

// Enable CORS so your frontend (e.g. port 5500, 3000) can talk to port 5000
app.use(cors({
    origin: '*',
    credentials: true
}));

app.use(express.json());

// Optionally serve static frontend files if accessed directly on port 5000
app.use(express.static(path.join(__dirname)));

// Roblox OAuth Configuration
const ROBLOX_CLIENT_ID = '4037165407323325158';
// Add your Client Secret here from Roblox Creator Dashboard (if generated)
const ROBLOX_CLIENT_SECRET = process.env.ROBLOX_CLIENT_SECRET || ''; 

// API Endpoint hit by handleOAuthCallback() in nav.js
app.post('/api/auth/roblox', async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ error: 'Authorization code is missing.' });
    }

    try {
        // Build redirect URI matching what was sent during the initial auth request
        const redirectUri = req.headers.referer || 'http://localhost:5500/';
        const cleanRedirectUri = new URL(redirectUri).origin + '/';

        console.log(`[OAuth] Swapping code for token with redirect URI: ${cleanRedirectUri}`);

        // Token exchange payload
        const params = new URLSearchParams({
            client_id: ROBLOX_CLIENT_ID,
            client_secret: ROBLOX_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: cleanRedirectUri
        });

        // Exchange authorization code for user access token with Roblox
        const tokenResponse = await fetch('https://apis.roblox.com/oauth/v1/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
            console.error('[OAuth Error] Roblox token exchange failed:', tokenData);
            return res.status(400).json({ 
                error: tokenData.error_description || tokenData.error || 'Roblox token exchange failed' 
            });
        }

        // Fetch User Info using access token
        const userInfoResponse = await fetch('https://apis.roblox.com/oauth/v1/userinfo', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` }
        });

        const userInfo = await userInfoResponse.json();

        if (!userInfoResponse.ok) {
            console.error('[OAuth Error] Fetching user info failed:', userInfo);
            return res.status(400).json({ error: 'Failed to fetch Roblox profile' });
        }

        console.log(`[OAuth Success] User authenticated: ${userInfo.preferred_username || userInfo.name}`);

        return res.json({
            username: userInfo.preferred_username || userInfo.name || 'Roblox Player',
            displayName: userInfo.nickname || userInfo.name || 'Player',
            sub: userInfo.sub,
            avatarUrl: userInfo.picture || ''
        });

    } catch (err) {
        console.error('[Server Error]', err);
        return res.status(500).json({ error: 'Internal server error during authentication' });
    }
});

app.listen(PORT, () => {
    console.log(`\n========================================`);
    console.log(`🚀 Roblox Hub Backend Server Online!`);
    console.log(`🌐 Running on: http://localhost:${PORT}`);
    console.log(`========================================\n`);
});