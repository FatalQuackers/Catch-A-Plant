// Dedicated script for Leaks Page (Option 2: Live Discord Reader Integration)

// Configuration - Replace these with your actual Discord Server & Channel IDs
const DISCORD_GUILD_ID = '1189976214245478510'; 
const DISCORD_CHANNEL_ID = '1502623143028719798'; 

// Preset topics/highlights for the left sidebar navigation
const leakHighlights = [
    {
        id: 'live-feed',
        icon: '💬',
        title: 'Live Discord Feed',
        time: 'Real-time',
        description: 'Direct interactive view of the #leaks channel.'
    },
    {
        id: 'l1',
        icon: '🍄',
        title: 'Void Shroom Mutation',
        time: 'Pinned',
        description: 'Datamined spore triggers & corruption biome odds.'
    },
    {
        id: 'l2',
        icon: '🚿',
        title: 'Golden Watering Can',
        time: 'Pinned',
        description: 'Launch event exclusive tool stats and perk list.'
    },
    {
        id: 'l3',
        icon: '🌵',
        title: 'Cactus of Doom',
        time: 'Pinned',
        description: 'Concept artwork & defense spike mechanics.'
    }
];

let selectedLeakId = 'live-feed';

function renderLeaksPage() {
    const listContainer = document.getElementById('leaks-list');
    const detailContainer = document.getElementById('leaks-detail');

    if (!listContainer || !detailContainer) return;

    // Render Left Sidebar List
    listContainer.innerHTML = leakHighlights.map(item => `
        <div class="news-item-card ${item.id === selectedLeakId ? 'active' : ''}" onclick="selectLeak('${item.id}')">
            <div class="news-item-icon">${item.icon}</div>
            <div class="news-item-info">
                <h4>${item.title}</h4>
                <span>${item.time}</span>
            </div>
        </div>
    `).join('');

    // Render Right Panel (Live WidgetBot Discord Embed)
    detailContainer.innerHTML = `
        <div class="detail-header" style="justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 16px;">
                <div class="detail-icon">👀</div>
                <div class="detail-titles">
                    <h3>#leaks Live Feed</h3>
                    <div class="detail-meta">Connected to Discord &bull; Live Updates</div>
                </div>
            </div>
            <a href="https://discord.gg" target="_blank" class="nav-btn login-btn" style="text-decoration: none; font-size: 0.85rem;">
                Join Discord
            </a>
        </div>
        <div class="detail-body" style="padding-top: 15px; flex: 1; display: flex; flex-direction: column;">
            <!-- WidgetBot Embedded Reader -->
            <iframe 
                src="https://e.widgetbot.io/channels/${DISCORD_GUILD_ID}/${DISCORD_CHANNEL_ID}" 
                height="450" 
                width="100%" 
                style="border: none; border-radius: 12px; background: #0e121e; flex: 1;"
                title="Discord Leaks Feed">
            </iframe>
        </div>
    `;
}

function selectLeak(id) {
    selectedLeakId = id;
    renderLeaksPage();
}

window.initLeaks = function() {
    renderLeaksPage();
};