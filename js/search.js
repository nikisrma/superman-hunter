const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const searchName = urlParams.get('search');
// function to fetch data

async function searchHero(name) {
    const response = await fetch(
        `https://gateway.marvel.com:443/v1/public/characters?name=${name}&ts=1&apikey=${publicKey}&hash=${hash}`
    );
    const data = await response.json();
    return data;
}

// Event listener for form submission (search)
const searchForm = document.querySelector('.navbar-form');
searchForm.addEventListener('submit', handleSearchForm);

// Function to handle form submission (search)
function handleSearchForm(event) {
    event.preventDefault();
    const searchInput = document.querySelector('[name="search"]');
    const searchTerm = searchInput.value.trim();

    if (searchTerm !== '') {
        const url = `index.html?search=${searchTerm}`;
        window.location.href = url;     
    }
}

function search(name){
    if(name){
    searchHero(name)
    .then((data) => {
        var heroes = data.data.results
        showSearchResults(heroes);
    })
}
}
search(searchName)

// Function to show the popup with matching search results
function showSearchResults(data) {
    const searchResultsDiv = document.getElementById('searchResults');
    searchResultsDiv.innerHTML = ''; 
    if (data.length > 0) {
        const searchResultsTitle = document.createElement('h2');
        searchResultsTitle.textContent = 'Search Results';
        searchResultsDiv.appendChild(searchResultsTitle);

        data.forEach((heroes) => {
            const hero = createCard(heroes);
            searchResultsDiv.appendChild(hero);
        });
    } else {
        // Show the Bootstrap modal
        $('#searchModal').modal('show');
    }
}

