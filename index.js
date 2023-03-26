
const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');
const menudiv = document.getElementById('menuimg');
var open =false;

// Function for working of menu 
function menuvisible() {
    menudiv.classList.remove("menuhide");
    menudiv.classList.add("menu-visible");
    menudiv.classList.remove("menu");
}

function menuhide(){
    menudiv.classList.add("menuhide");
    menudiv.classList.add("menu");
}


// load movies from API
async function loadMovies(searchTerm){
    const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=e93ead13`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    // console.log(data.Search);
    if(data.Response == "True") displayMovieList(data.Search);
}

function findMovies(){
    let searchTerm = (movieSearchBox.value).trim();
    if(searchTerm.length > 0){
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}

function displayMovieList(movies){
    searchList.innerHTML = "";
    for(let idx = 0; idx < movies.length; idx++){
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].imdbID; // setting movie id in  data-id
        movieListItem.classList.add('search-list-item');
        if(movies[idx].Poster != "N/A")
            moviePoster = movies[idx].Poster;
        else 
            moviePoster = "image_not_found.png";

        movieListItem.innerHTML = `
        <div class = "search-item-thumbnail">
            <img src = "${moviePoster}">
        </div>
        <div class = "search-item-info">
            <h3>${movies[idx].Title}</h3>
            <p>${movies[idx].Year}</p>
        </div>
        `;
        searchList.appendChild(movieListItem);
    }
    loadMovieDetails();
}

function loadMovieDetails(){
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            // console.log(movie.dataset.id);
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";
            const result = await fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=fc1fef96`);
            const movieDetails = await result.json();
            // console.log(movieDetails);
            displayMovieDetails(movieDetails);
        });
    });
}

function displayMovieDetails(details){
    resultGrid.innerHTML = `
    <div class = "movie-poster">
        <img src = "${(details.Poster != "N/A") ? details.Poster : "404.avif"}" alt = "movie poster">
    </div>
    <div class = "movie-info">
        <h3 class = "movie-title" id ="name">${details.Title}</h3>
        <p><button class="btn-watchlist" id="add-movie-btn" onclick="addto()">Add To Watchlist</button></p>
        <ul class = "movie-misc-info">
            <li class = "year">Year: ${details.Year}</li>
            <li class = "rated">Ratings: ${details.Rated}</li>
            <li class = "released">Released: ${details.Released}</li>
        </ul>
        <p class = "genre"><b>Genre:</b> ${details.Genre}</p>
        <p class = "writer"><b>Writer:</b> ${details.Writer}</p>
        <p class = "actors"><b>Actors: </b>${details.Actors}</p>
        <p class = "plot"><b>Plot:</b> ${details.Plot}</p>
        <p class = "language"><b>Language:</b> ${details.Language}</p>
        <p class = "awards"><b><i class = "fas fa-award"></i></b> ${details.Awards}</p>
    </div>
    `;
}


window.addEventListener('click', (event) => {
    if(event.target.className != "form-control"){
        searchList.classList.add('hide-search-list');
    }
});

// Watchlist 

const watchlist = [];

const addMovieBtn = document.getElementById("add-movie-btn");
function addto() {
  const added = document.getElementById("add-movie-btn");
  const titleInput = document.getElementById("name");
  const title = titleInput.innerText;
  if(!watchlist.includes(title)) {
    added.innerText = "added";
    watchlist.push(title);
    if (!open) {
        openNav();
    }
    renderWatchlist();
    return;
  }
  else{
    added.innerText = "add to watchlist";
    let index = watchlist.indexOf(title);
    watchlist.splice(index, 1)
    renderWatchlist();
    return;
  }
};

function renderWatchlist() {
    const watchlistEl = document.getElementById("watchlist");
    watchlistEl.innerHTML = "";
    for (let i = 0; i < watchlist.length; i++) {
      const listItemEl = document.createElement("li");
      listItemEl.textContent = watchlist[i];
      watchlistEl.appendChild(listItemEl);
    }
  }
  
//   watch list function
  function openNav() {
    if (open) {
        closeNav();
        return
    }
    document.getElementById("mySidepanel").style.width = "300px";
    open =true;
  }
  
  function closeNav() {
    document.getElementById("mySidepanel").style.width = "0";
    open = false;
  }


// Extra if we want to store watchlist items locally

  window.addEventListener("load", function() {
    const storedWatchlist = localStorage.getItem("watchlist");
    if (storedWatchlist) {
      watchlist.push(...JSON.parse(storedWatchlist));
    }
    renderWatchlist();
  });
  
  window.addEventListener("beforeunload", function() {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  });
  
