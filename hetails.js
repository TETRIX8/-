document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const index = parseInt(urlParams.get('index'), 10);
    const filmName = decodeURIComponent(urlParams.get('name'));
    const filmDetailsDiv = document.getElementById('film-details');

    console.log('URL Parameters:', { index, filmName });

    if (isNaN(index) || !filmName) {
        filmDetailsDiv.innerHTML = `<p>Invalid film index or name</p>`;
        return;
    }

    try {
        const response = await fetch(`https://api1650820663.bhcesh.me/list?token=3794a7638b5863cc60d7b2b9274fa32e&type=favorits&name=${encodeURIComponent(filmName)}`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response Data:', data);

        if (!data.results || index >= data.results.length || index < 0) {
            throw new Error('Film not found');
        }

        const film = data.results[index];
        console.log('Selected Film Data:', film);

        const name = film.name || 'Unknown';
        const year = film.year || 'Unknown';
        const poster = film.poster || 'default_poster_url'; // Replace with an actual default image URL
        const genre = film.genre || 'Unknown';
        const country = Array.isArray(film.country) ? film.country.join(', ') : 'Not available';
        const quality = film.quality || 'Not available';
        const imdb = film.imdb || 'Not available';
        const kinopoisk = film.kinopoisk || 'Not available';
        const iframe_url = film.iframe_url || '';
        const currentPageUrl = window.location.href;

        document.body.style.backgroundImage = `url(${poster})`;

        const detailsHTML = `
            <div class="video-container">
                <div class="message-overlay">Приятного просмотра! Спасибо, что вы с нами! EvloevFilm</div>
                ${iframe_url ? `<iframe id="film-iframe" src="${iframe_url}" frameborder="0" allowfullscreen></iframe>` : ''}
                <button id="add-to-favorites">Добавить в закладки</button>
            </div>
            <div class="details-content">
                <h2>${name} (${year})</h2>
                <p><b>Genre:</b> ${genre}</p>
                <p><b>Country:</b> ${country}</p>
                <p><b>Quality:</b> ${quality}</p>
                <p><b>IMDB:</b> ${imdb}</p>
                <p><b>Kinopoisk:</b> ${kinopoisk}</p>
            </div>
        `;

        document.getElementById('film-title').innerText = `${name} (${year})`;
        filmDetailsDiv.innerHTML = detailsHTML;

        document.getElementById('add-to-favorites').addEventListener('click', function() {
            addToFavorites(film, currentPageUrl, poster);
        });

        // Load playback time if available
        const savedTime = getFilmTime(filmName);
        const iframe = document.getElementById('film-iframe');
        if (iframe && savedTime) {
            iframe.src += `#t=${savedTime}`;
        }

        // Save playback time on window unload
        window.addEventListener('beforeunload', function() {
            const time = iframe.contentWindow ? iframe.contentWindow.currentTime : 0;
            addFilmToHistory({ name: filmName, iframe_url }, time);
        });

    } catch (error) {
        console.error('Error fetching film details:', error);
        filmDetailsDiv.innerHTML = `<p>An error occurred while fetching film details: ${error.message}</p>`;
    }
});

function addToFavorites(film, url, poster) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const existing = favorites.find(item => item.name === film.name);

    if (existing) {
        showToast('Уже есть в закладках');
    } else {
        favorites.push({ ...film, url, poster });
        localStorage.setItem('favorites', JSON.stringify(favorites));
        showToast('Добавлено в закладки');
    }
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('fade');
        setTimeout(() => {
            toast.remove();
        }, 1000);
    }, 2000);
}

function getFilmTime(name) {
    const history = JSON.parse(localStorage.getItem('viewingHistory')) || [];
    const film = history.find(item => item.name === name);
    return film ? film.time : 0;
}

function addFilmToHistory(film, time) {
    let history = JSON.parse(localStorage.getItem('viewingHistory')) || [];
    const existing = history.find(item => item.name === film.name);
    if (existing) {
        existing.time = time;
    } else {
        history.push({ ...film, time });
    }
    localStorage.setItem('viewingHistory', JSON.stringify(history));
}

function goToMainMenu() {
    window.location.href = 'index.html'; // Replace with your main menu URL
}

