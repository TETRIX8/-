document.addEventListener('DOMContentLoaded', function() {
    const historyList = document.getElementById('history-list');
    const activities = JSON.parse(localStorage.getItem('activityHistory')) || [];

    if (activities.length === 0) {
        historyList.innerHTML = '<p>История активности пуста.</p>';
        return;
    }

    const listHTML = activities.map(item => {
        const film = item.film || {};
        const action = formatAction(item.action);
        const time = item.time ? ` на ${formatTime(item.time)}` : '';

        return `
            <div class="history-item">
                <a href="${film.iframe_url}">
                    <h2>${film.name || 'Unknown'}</h2>
                </a>
                <p>${action}${time}</p>
            </div>
        `;
    }).join('');

    historyList.innerHTML = listHTML;
});

function formatAction(action) {
    switch (action) {
        case 'add_to_favorites':
            return 'Добавлено в закладки';
        case 'save_to_history':
            return 'Сохранено в историю';
        case 'start_viewing':
            return 'Начато просмотр';
        case 'stop_viewing':
            return 'Остановлено просмотр';
        default:
            return 'Неизвестное действие';
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes} минут${secs > 0 ? ` ${secs} секунд` : ''}`;
}
