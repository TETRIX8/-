function addFilmToHistory(film, time) {
    let history = JSON.parse(localStorage.getItem('viewingHistory')) || [];
    
    // Check if the film already exists in the history
    const existingIndex = history.findIndex(item => item.name === film.name);
    
    if (existingIndex !== -1) {
        // Update the existing entry
        history[existingIndex].time = time;
    } else {
        // Add new entry to the history
        history.push({ name: film.name, url: film.iframe_url, time });
        
        // Ensure history has at most 10 entries
        if (history.length > 10) {
            history.shift(); // Remove the oldest entry
        }
    }

    localStorage.setItem('viewingHistory', JSON.stringify(history));
}

function getFilmHistory() {
    return JSON.parse(localStorage.getItem('viewingHistory')) || [];
}

function getFilmTime(name) {
    const history = getFilmHistory();
    const film = history.find(item => item.name === name);
    return film ? film.time : 0;
}
