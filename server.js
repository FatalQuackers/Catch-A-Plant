require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS so your GitHub Pages site can make requests to Render
app.use(cors());
app.use(express.json());

const CLIENT_ID = process.env.ROBLOX_CLIENT_ID;
const CLIENT_SECRET = process.env.ROBLOX_CLIENT_SECRET;
// Server-side configured redirect URI (recommended). Do NOT rely on the client's redirect_uri in production.
const SERVER_REDIRECT_URI = process.env.ROBLOX_REDIRECT_URI;
const NODE_ENV = process.env.NODE_ENV || 'production';

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
        // Use server-configured redirect URI in production. Allow client-provided redirect during development only.
        const redirectToUse = (NODE_ENV === 'development' && redirect_uri) ? redirect_uri : SERVER_REDIRECT_URI;

        if (!redirectToUse) {
            return res.status(400).json({ error: 'No redirect URI configured on server' });
        }

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
