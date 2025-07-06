const API_KEY = "a8412d2494bc6a4c9f1cb04480ac7ca7";
const BASE_URL = "https://api.themoviedb.org/3";

const movieList = document.getElementById("movie-list");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const homeButton = document.getElementById("home-button");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const closeModal = document.getElementById("close-modal");
const sectionTitle = document.getElementById("section-title");

function clearInput() {
  searchInput.value = "";
}

const genreList = [
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 27, name: "Horror" },
  
];


function createGenreButtons() {
  const genreContainer = document.createElement("div");
  genreContainer.className = "home-buttons";
  genreList.forEach((genre) => {
    const btn = document.createElement("button");
    btn.textContent = genre.name;
    btn.onclick = () => loadMoviesByGenre(genre.id, genre.name);
    genreContainer.appendChild(btn);
  });
  sectionTitle.insertAdjacentElement("afterend", genreContainer);
}

function loadMoviesByGenre(genreId, genreName) {
  fetchMovies(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&sort_by=popularity.desc`
  );
  sectionTitle.textContent = `🎭 ${genreName} Movies`;
  homeButton.style.display = "block";
}

async function fetchMovies(url) {
  const res = await fetch(url);
  const data = await res.json();
  displayMovies(data.results);
}

function displayMovies(movies) {
  movieList.innerHTML = "";
  movies.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("movie-card");
    div.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title}">
      <h4>${movie.title}</h4>
      <p>⭐ ${movie.vote_average}</p>
    `;
    div.addEventListener("click", () => showMovieDetails(movie.id));
    movieList.appendChild(div);
  });
}

async function showMovieDetails(id) {
  const [detailsRes, providerRes] = await Promise.all([
    fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`),
    fetch(`${BASE_URL}/movie/${id}/watch/providers?api_key=${API_KEY}`),
  ]);

  const movie = await detailsRes.json();
  const providers = await providerRes.json();
  const indiaLink = providers.results?.IN?.link;
  let ottLink = indiaLink
    ? `<p><a href="${indiaLink}" target="_blank">🎥 Watch on OTT</a></p>`
    : "";

  modalBody.innerHTML = `
    <div class="movie-details-wrapper">
      <img class="movie-details-img" src="https://image.tmdb.org/t/p/w300${
        movie.poster_path
      }" />
      <div class="movie-description-box">
        <h2 class="movie-details-head">${movie.title}</h2>
        <p class="movie-details-para">${movie.overview}</p>
        <p class="movie-details-para"><strong>Genres:</strong> ${movie.genres
          .map((g) => g.name)
          .join(", ")}</p>
        <p class="movie-details-para"><strong>Release Date:</strong> ${
          movie.release_date
        }</p>
        <p class="movie-details-para"><strong>Rating:</strong> ${
          movie.vote_average
        }</p>
        ${ottLink}
      </div>
    </div>
  `;

  modal.classList.remove("hidden");
  modal.scrollIntoView({ behavior: "smooth" });
}

closeModal.onclick = () => {
  modal.classList.add("hidden");
};

window.onclick = (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
};

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (query) {
    fetchMovies(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
    sectionTitle.textContent = `🔍 Search Results for "${query}"`;
    homeButton.style.display = "block";
  }
});

homeButton.addEventListener("click", () => {
  loadTamilMovies();
  searchInput.value = "";
  sectionTitle.textContent = "🎞️ Popular Tamil Movies";
  homeButton.style.display = "none";
});

function loadTamilMovies() {
  fetchMovies(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_original_language=ta&sort_by=popularity.desc`
  );
}

function loadCategories() {
  alert("Load category functionality to be implemented.");
}

function loadSuggestions() {
  alert("Load suggestions functionality to be implemented.");
}

// Initialize
createGenreButtons();
loadTamilMovies();
