const publicKey = 'de96f66cc6adde2c4a47f9e078a15685';
const hash = '61964a28de7d1e376d86cfb3f5e02a38';
const api_url = `https://gateway.marvel.com:443/v1/public/characters?ts=1&apikey=${publicKey}&hash=${hash}`;
// Get the route parameters from the URL
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

// Get individual route parameters and manage navigation
const id = urlParams.get('id');
if(urlParams.get('id')){
  getHero(id)
}

if(urlParams.get('search')){
  const url = `index.html?search=${urlParams.get('search')}`;
  window.location.href = url;  
}


// function to fetch hero data
async function getHero(id) {
  const response = await fetch(
    `https://gateway.marvel.com/v1/public/characters/${id}?ts=1&apikey=${publicKey}&hash=${hash}`
  );
  const data = await response.json();
  return createHeroDetailPage(data.data.results[0])

}

// Function to generate a detail page
function createHeroDetailPage(heroDetail) {
    
  const heroContainer = document.getElementById('heroContainer');
  const heroImagecontainer = document.createElement('div');
  heroImagecontainer.classList.add('hero-image');
  const image = document.createElement('img');
  image.src = heroDetail?.thumbnail.path + '.' + heroDetail?.thumbnail.extension;
  heroImagecontainer.appendChild(image);

  const heroDescriptioncontainer = document.createElement('div');
  heroDescriptioncontainer.classList.add('hero-description');
  
  const heroname = document.createElement('h3');  
  heroname.classList.add('hero-name');
  heroname.textContent = heroDetail?.name;
  heroDescriptioncontainer.appendChild(heroname);

  const description = document.createElement('p');
  description.classList.add('hero-desc');
  description.textContent = heroDetail?.description;
  heroDescriptioncontainer.appendChild(description);

  heroContainer.appendChild(heroImagecontainer);
  heroContainer.appendChild(heroDescriptioncontainer);

  getComics(heroDetail?.id)
  getStories(heroDetail?.id)
}



// function to fetch comics
async function getComics(id) {
  const response = await fetch(
    `https://gateway.marvel.com/v1/public/characters/${id}/comics?ts=1&apikey=${publicKey}&hash=${hash}`
  );
  const data = await response.json();
  return createComics(data.data.results)

}

// Function to generate a comic detail div
function createComics(comics) {
  comics.forEach(comicsDetail => {
  const comicContainer = document.getElementById('comic-container');
  const comicImagecontainer = document.createElement('div');
  comicImagecontainer.classList.add('comic-image-container');
  const image = document.createElement('img');
  image.src = comicsDetail.thumbnail.path + '.' + comicsDetail.thumbnail.extension;
  comicImagecontainer.appendChild(image);

  const comicDescriptioncontainer = document.createElement('div');
  comicDescriptioncontainer.classList.add('comic-details');
  
  const comicname = document.createElement('h3');  
  comicname.textContent = comicsDetail.title;
  comicDescriptioncontainer.appendChild(comicname);

  const description = document.createElement('p');
  description.textContent = comicsDetail.description;
  comicDescriptioncontainer.appendChild(description);

  comicImagecontainer.appendChild(comicDescriptioncontainer);
  comicContainer.appendChild(comicImagecontainer);

})
}



// function to fetch stories
async function getStories(id) {
  const response = await fetch(
    `https://gateway.marvel.com/v1/public/characters/${id}/stories?ts=1&apikey=${publicKey}&hash=${hash}`
  );
  const data = await response.json();
  return createStories(data.data.results)

}

// Function to generate stories div

function createStories(stories) {
  const container = document.getElementById('story-container');

  stories.forEach((story, index) => {
    const storyContainer = document.createElement('div');
    storyContainer.classList.add('story-container');

    const comicDescriptionContainer = document.createElement('div');
    comicDescriptionContainer.classList.add('story-details');

    const storyName = document.createElement('h3');
    storyName.textContent = story.title;

    const description = document.createElement('p');
    description.textContent = story.description;

    comicDescriptionContainer.appendChild(storyName);
    comicDescriptionContainer.appendChild(description);
    storyContainer.appendChild(comicDescriptionContainer);

    container.appendChild(storyContainer);
  });

}

