document.getElementById('film-search-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    searchFilms();
});

document.getElementById('film-name').addEventListener('input', async function(event) {
    searchFilms();
});

async function searchFilms(category = '') {
    const filmName = document.getElementById('film-name') ? document.getElementById('film-name').value.trim() : '';
    const filmResultsDiv = document.getElementById('film-results');

    if (filmName === "") {
        filmResultsDiv.innerHTML = '<p>Please enter a film name to search.</p>';
        return;
    }

    let url = `https://api1650820663.bhcesh.me/list?token=3794a7638b5863cc60d7b2b9274fa32e&type=favorits`;

    if (category === 'popular') {
        url += '&category=popular';
    } else if (category === 'new') {
        url += '&category=new';
    } else {
        url += `&name=${encodeURIComponent(filmName)}`;
    }

    try {
        let response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let data = await response.json();

        if (data.results.length > 0) {
            let resultsHTML = '<div class="results-container">🔍 Мы нашли несколько <b>Фильмов</b> с похожим названием:</div>';
            data.results.forEach((film, index) => {
                resultsHTML += `<div class="film-result">
                                    <img src="${film.poster}" alt="${film.name}" class="film-poster">
                                    <a href="film-details.html?index=${index}&name=${encodeURIComponent(filmName)}">${film.name}</a> | <b>${film.year}</b>
                                </div>`;
            });
            filmResultsDiv.innerHTML = resultsHTML;
        } else {
            filmResultsDiv.innerHTML = '<p>No films found.</p>';
        }
    } catch (error) {
        console.error('Error fetching film data:', error);
        filmResultsDiv.innerHTML = `<p>An error occurred while searching for films: ${error.message}</p>`;
    }
}

function displayBookmarks() {
    const filmResultsDiv = document.getElementById('film-results');
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    if (bookmarks.length > 0) {
        let resultsHTML = '<div class="results-container">📚 <b>Мои Закладки</b>:</div>';
        bookmarks.forEach((film, index) => {
            resultsHTML += `<div class="film-result">
                                <img src="${film.poster}" alt="${film.name}" class="film-poster">
                                <a href="film-details.html?index=${index}&name=${encodeURIComponent(film.name)}">${film.name}</a> | <b>${film.year}</b>
                            </div>`;
        });
        filmResultsDiv.innerHTML = resultsHTML;
    } else {
        filmResultsDiv.innerHTML = '<p>No bookmarks found.</p>';
    }
}
