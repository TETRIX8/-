document.addEventListener('DOMContentLoaded', function() {
    const favoritesListDiv = document.getElementById('favorites-list');
    const sortSelect = document.getElementById('sort-select');

    // Retrieve bookmarks from localStorage
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // Function to render the bookmarks list
    function renderFavorites() {
        favoritesListDiv.innerHTML = '';
        if (favorites.length === 0) {
            favoritesListDiv.innerHTML = '<p>У вас нет закладок</p>';
        } else {
            favorites.forEach((film, index) => {
                const filmDiv = document.createElement('div');
                filmDiv.classList.add('favorite-item');
                filmDiv.innerHTML = `
                    <img src="${film.poster || 'default_poster_url'}" alt="${film.name}" style="width: 80px; height: auto;">
                    <h2>${film.name} (${film.year})</h2>
                    <button class="watch-film" onclick="location.href='${film.url}'">Смотреть</button>
                    <button class="remove-favorite" data-index="${index}" style="font-size: smaller;">Удалить</button>
                `;
                favoritesListDiv.appendChild(filmDiv);
            });
        }
    }

    // Function to sort favorites
    function sortFavorites(criteria) {
        if (criteria === 'name') {
            favorites.sort((a, b) => a.name.localeCompare(b.name));
        } else if (criteria === 'time') {
            favorites.sort((a, b) => new Date(b.time) - new Date(a.time)); // Assuming `time` is stored as a date string
        }
        renderFavorites();
    }

    // Handler for sorting
    sortSelect.addEventListener('change', function() {
        const criteria = sortSelect.value;
        sortFavorites(criteria);
    });

    // Initial render
    sortFavorites(sortSelect.value);

    // Handler to remove a bookmark
    favoritesListDiv.addEventListener('click', function(event) {
        if (event.target.classList.contains('remove-favorite')) {
            const index = parseInt(event.target.getAttribute('data-index'), 10);
            if (!isNaN(index) && index >= 0 && index < favorites.length) {
                favorites.splice(index, 1);
                localStorage.setItem('favorites', JSON.stringify(favorites));
                showToast('Фильм удален из закладок');
                sortFavorites(sortSelect.value); // Re-render after removal
            } else {
                showToast('Ошибка удаления закладки');
            }
        }
    });

    // Function to show notification
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerText = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('fade');
        }, 3000); // Notification fades out after 3 seconds

        setTimeout(() => {
            document.body.removeChild(toast);
        }, 4000); // Notification is removed after 4 seconds
    }
});
