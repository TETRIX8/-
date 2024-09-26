async function fetchAndDisplayData(url, listId) {
    try {
        const cacheBuster = new Date().getTime(); // Add a cache buster to the URL
        const response = await fetch(`${url}&_=${cacheBuster}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const results = data.results || [];
        console.log(`Results fetched: ${results.length}`); // Log number of results

        // Remove duplicates and process data
        const uniqueResults = [...new Set(results.map(item => item.id))];

        // Fetch detailed data for each item
        const detailedDataPromises = uniqueResults.map(async (id) => {
            try {
                const detailResponse = await fetch(`https://api1663355922.bhcesh.me/franchise/details?token=3794a7638b5863cc60d7b2b9274fa32e&id=${id}`);
                
                if (!detailResponse.ok) {
                    throw new Error(`HTTP error! status: ${detailResponse.status}`);
                }

                const data = await detailResponse.json();
                return { data, id }; // Include id in the returned object
            } catch (error) {
                console.error(`Error fetching film details for ID ${id}:`, error);
                return null; // Return null if there's an error
            }
        });

        const detailedData = await Promise.all(detailedDataPromises);
        console.log(`Detailed data fetched: ${detailedData.length}`); // Log number of detailed data items

        // Update DOM with fetched data
        const listElement = document.getElementById(listId);
        listElement.innerHTML = ''; // Clear existing content

        detailedData.forEach((item, index) => {
            if (item && item.data) {
                const { data } = item;
                const name = data.name || 'Unknown';
                const year = data.year || 'Unknown';
                const poster = data.poster || 'placeholder.jpg'; // Add a placeholder image if no poster
                const imdb = data.imdb || 'N/A';
                const kinopoisk = data.kinopoisk || 'N/A';
                const quality = data.quality || 'N/A';

                // Process country
                let country = 'N/A';
                if (Array.isArray(data.country)) {
                    country = data.country.join(', ');
                } else if (typeof data.country === 'object' && data.country !== null) {
                    country = Object.values(data.country).join(', ');
                }

                // Process genre
                let genre = 'N/A';
                if (Array.isArray(data.genre)) {
                    genre = data.genre.join(', ');
                } else if (typeof data.genre === 'object' && data.genre !== null) {
                    genre = Object.values(data.genre).join(', ');
                }

                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <img src="${poster}" alt="${name}" class="poster-image">
                    <div class="item-details">
                        <strong>${name}</strong> (${year})<br>
                        IMDb: ${imdb}<br>
                        Kinopoisk: ${kinopoisk}<br>
                        Quality: ${quality}<br>
                        Country: ${country}<br>
                        Genre: ${genre}
                        <br><a href="film-details.html?index=0&name=${encodeURIComponent(name)}">Смотреть</a>
                    </div>
                `;
                listElement.appendChild(listItem);

                // Debugging log for each item
                console.log(`Item added: ${name}`);
            }
        });

        console.log('Data displayed successfully.');
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Function to handle section visibility and data fetching
function showSection(sectionId, url) {
    const sections = document.querySelectorAll('.update-section');
    sections.forEach(section => {
        if (section.id === sectionId) {
            section.style.display = 'block';
            if (!section.classList.contains('loaded')) {
                fetchAndDisplayData(url, section.querySelector('ul').id);
                section.classList.add('loaded');
            }
        } else {
            section.style.display = 'none';
        }
    });
}

// Add event listeners to buttons
document.getElementById('show-films').addEventListener('click', () => {
    showSection('news-films', 'https://api1664409738.bhcesh.me/video/news?limit=50&type=films&token=3794a7638b5863cc60d7b2b9274fa32e&year=2023');
});

document.getElementById('show-serials').addEventListener('click', () => {
    showSection('news-serials', 'https://api1664409738.bhcesh.me/video/news?limit=50&join_seasons=false&type=serials&token=3794a7638b5863cc60d7b2b9274fa32e&year=2023');
});

document.getElementById('show-shows').addEventListener('click', () => {
    showSection('news-show', 'https://api1664409738.bhcesh.me/video/news?limit=300&type=show&token=3794a7638b5863cc60d7b2b9274fa32e&year=2023');
});

// Initialize the default view
showSection('news-films', 'https://api1664409738.bhcesh.me/video/news?limit=50&type=films&token=3794a7638b5863cc60d7b2b9274fa32e&year=2023');
