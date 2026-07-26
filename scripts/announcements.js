const announcementsData = [
    {
        id: 'a1',
        icon: '👑',
        title: 'Guild Chat',
        time: '6d 14h ago',
        date: 'July 19, 2026',
        body: 'The Guild Chat is here! Request gifts, show off your guild contest progress, and keep up with your guildmates awesome achievements!'
    },
    {
        id: 'a2',
        icon: '🗺️',
        title: 'Explorer Ethan',
        time: '6d 14h ago',
        date: 'July 19, 2026',
        body: 'Explorer Ethan has arrived at the central plaza booth! Talk to him to unlock new world exploration challenges.'
    },
    {
        id: 'a3',
        icon: '🏆',
        title: 'Guild Brackets',
        time: '8d 16h ago',
        date: 'July 17, 2026',
        body: 'Guild Tournament brackets are officially seeded. Check your guild rank and get ready for competitive gardening!'
    },
    {
        id: 'a4',
        icon: '🐝',
        title: 'Firefly & Sun Bloom',
        time: '13d 11h ago',
        date: 'July 12, 2026',
        body: 'Summertime night events added! Catch glowing fireflies around Sun Blooms during night cycles for bonus seeds.'
    }
];

let selectedAnnouncementId = 'a1';

function renderAnnouncements() {
    const listContainer = document.getElementById('announcements-list');
    const detailContainer = document.getElementById('announcements-detail');

    if (!listContainer || !detailContainer) return;

    const selectedItem = announcementsData.find(i => i.id === selectedAnnouncementId) || announcementsData[0];

    listContainer.innerHTML = announcementsData.map(item => `
        <div class="news-item-card ${item.id === selectedItem.id ? 'active' : ''}" onclick="selectAnnouncement('${item.id}')">
            <div class="news-item-icon">${item.icon}</div>
            <div class="news-item-info">
                <h4>${item.title}</h4>
                <span>${item.time}</span>
            </div>
        </div>
    `).join('');

    detailContainer.innerHTML = `
        <div class="detail-header">
            <div class="detail-icon">${selectedItem.icon}</div>
            <div class="detail-titles">
                <h3>${selectedItem.title}</h3>
                <div class="detail-meta">${selectedItem.time} &bull; ${selectedItem.date}</div>
            </div>
        </div>
        <div class="detail-body">
            <p>${selectedItem.body}</p>
        </div>
    `;
}

function selectAnnouncement(id) {
    selectedAnnouncementId = id;
    renderAnnouncements();
}

window.initAnnouncements = function() {
    renderAnnouncements();
};