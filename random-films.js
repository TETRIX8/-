async function fetchFilms() {
    const url = 'https://api1650820663.bhcesh.me/list?token=3794a7638b5863cc60d7b2b9274fa32e&type=favorits';
    try {
        let response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        let data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching film data:', error);
        return [];
    }
}

function getRandomFilms(films, count) {
    let shuffled = films.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

async function displayRandomFilms() {
    const filmContainer = document.getElementById('film-container');
    const films = await fetchFilms();
    const randomFilms = getRandomFilms(films, 5); // Number of random films to display

    if (randomFilms.length > 0) {
        let resultsHTML = '';
        randomFilms.forEach((film, index) => {
            resultsHTML += `<div class="favorite-item">
                                <div class="favorite-item-content">
                                    <img src="${film.poster}" alt="${film.name}">
                                    <div class="favorite-item-details">
                                        <h2>${film.name}</h2>
                                        <button class="watch-film" onclick="window.location.href='film-details.html?index=${index}&name=${encodeURIComponent(film.name)}'">Смотреть</button>
                                    </div>
                                </div>
                            </div>`;
        });
        filmContainer.innerHTML = resultsHTML;
    } else {
        filmContainer.innerHTML = '<p>No films available.</p>';
    }
}

displayRandomFilms();
