const publicKey = 'de96f66cc6adde2c4a47f9e078a15685';
const hash = '61964a28de7d1e376d86cfb3f5e02a38';
const api_url = `https://gateway.marvel.com:443/v1/public/characters?ts=1&apikey=${publicKey}&hash=${hash}`;
var heroes = []

/** to show fav heroes */
function toShowFavorites() {
    const urlParams = new URLSearchParams(window.location.search);
    const showFavorites = urlParams.get('showFavorites');
    return showFavorites
}

const showFavorites = toShowFavorites()

// function to fetch data
async function fetchData() {
    const response = await fetch(
        `https://gateway.marvel.com:443/v1/public/characters?ts=1&apikey=${publicKey}&hash=${hash}`
    );
    const data = await response.json();
    return data;
}

// Function to fetch all the heroes from api 
fetchData()
    .then((data) => {
        heroes = data.data.results
        if (showFavorites) {
            const title = document.getElementById('title');
            title.textContent = 'Favorite Heroes'
            let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            addHeroTOTheList(favorites)
        }
        else {
            addHeroTOTheList(heroes)
        }
    })

// Function to create and add hero to the list container
function addHeroTOTheList(heroes) {
    const heroesContainer = document.getElementById('heroesContainer');
    if (heroes.length > 0) {
        const row = document.createElement('div');
        row.classList.add('row');
        heroes.forEach((heroData) => {
            const cardCol = createHero(heroData);
            row.appendChild(cardCol);
        });
        heroesContainer.appendChild(row);
    }
    else {
        const p = document.createElement('p')
        p.classList.add('no-data-found');
        p.textContent = 'No Data Found.'
        heroesContainer.appendChild(p)
    }
}

// Function to create dynamic card for hero
function createHero(heroDetail) {
    const cardCol = document.createElement('div');
    
    cardCol.classList.add('col-lg-3', 'col-md-3', 'col-sm-6', 'col-6','card-col', 'd-flex', 'align-items-stretch');
        
    const card = document.createElement('div');
    card.classList.add('hero');


    const heroImg = document.createElement('div');
    heroImg.classList.add('image-container');
    const image = document.createElement('img');
    image.src = heroDetail?.thumbnail.path + '.' + heroDetail?.thumbnail.extension;
    heroImg.appendChild(image);
    card.appendChild(heroImg);

    const heroInfo = document.createElement('div');
    heroInfo.classList.add('hero-info');
    const heroName = document.createElement('h4');
    heroName.textContent = heroDetail?.name;
    heroInfo.appendChild(heroName);

    card.appendChild(heroInfo);

    const button = document.createElement('button');
    button.textContent = isHeroInFavorites(heroDetail?.id) ? 'Remove From Favorites' : 'Add to Favorites';
    button.setAttribute('id', heroDetail?.id); 
    card.appendChild(button);

    // Event listener for "Add to Favorites" button click
    button.addEventListener('click', handleFavoritesButtonClick);

    
    // Event listener to navigate to detail page
    card.addEventListener('click', function(){
        navigateToDetailPage(heroDetail?.id)
    });


    cardCol.appendChild(card);

    return cardCol;
}

// Function to handle "Add to Favorites" button click
function handleFavoritesButtonClick(event) {
    event.stopPropagation();

    const button = event.target;
    const heroId = button.getAttribute('id');
    if (isHeroInFavorites(heroId)) {
        removeFromFavorites(heroId);
        button.textContent = 'Add to Favorites';
    } else {
         findheroDataById(heroId).then((data)=>{
            addToFavorites(data);
            button.textContent = 'Remove from Favorites';
        });
    }
}

// function to fetch hero data

  async function findheroDataById(heroId) {
    const response = await fetch(
      `https://gateway.marvel.com/v1/public/characters/${heroId}?ts=1&apikey=${publicKey}&hash=${hash}`
    );
    const data = await response.json();
    const heroData = data.data.results[0];
    return heroData;
}

// Function to check if the hero is in favorites list (localStorage)
function isHeroInFavorites(heroId) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    return favorites.some((heroData) => String(heroData?.id) === String(heroId));
}

// Function to add hero data to favorites list in localStorage
function addToFavorites(heroData) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.push(heroData);
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Function to remove hero data from favorites list in localStorage
function removeFromFavorites(heroId) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const updatedFavorites = favorites.filter((heroData) => String(heroData?.id) !== String(heroId));
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
}


function navigateToDetailPage(heroId) {
    const url = `detail.html?id=${heroId}`;
    window.location.href = url;
}
