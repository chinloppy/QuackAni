function openDetails(id) {
  window.location.href = `details.html?id=${id}`;
}

function renderAnimeGrid(containerId, list) {
  const container = document.getElementById(containerId);

  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = `<div class="no-results">No anime found. Try another search.</div>`;
    setResultCount(0);
    return;
  }
   container.innerHTML = list.map(anime => `
    <article class="anime-card" onclick="openDetails('${anime.id}')">
      <div class="poster-box">
        <img src="${anime.image}" alt="${anime.title}">
        <div class="hover-label">View Details</div>
      </div>
      <div class="card-info">
        <h3>${anime.title}</h3>
        <p>${anime.genre.slice(0, 2).join(" • ")} • ${anime.type}</p>
      </div>
    </article>
  `).join("");

  setResultCount(list.length);
}
function setResultCount(count) {
  const resultCount = document.getElementById("resultCount");
  if (resultCount) {
    resultCount.textContent = `${count} result${count === 1 ? "" : "s"}`;
  }
}

function activateSearch(inputId, gridId, sourceList) {
  const input = document.getElementById(inputId);
  if (!input) return;

  input.addEventListener("input", () => {
    const keyword = input.value.trim().toLowerCase();

    const filtered = sourceList.filter(anime => {
      const combinedText = `${anime.title} ${anime.genre.join(" ")} ${anime.type}`.toLowerCase();
      return combinedText.includes(keyword);
    });
     renderAnimeGrid(gridId, filtered);

    const genreTitle = document.getElementById("genreTitle");
    if (genreTitle && keyword !== "") {
      genreTitle.textContent = `Search results for "${input.value}"`;
      removeActiveGenre();
    }
    else if (genreTitle && keyword === "") {
      genreTitle.textContent = "All Anime";
    }
  });
}

function activateSearchRedirect(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;

  input.addEventListener("input", () => {
    const keyword = input.value.trim();
    if (keyword.length >= 1) {
      window.location.href = `popular.html?search=${encodeURIComponent(keyword)}`;
    }
  });
  }

function renderGenreButtons() {
  const container = document.getElementById("genreButtons");
  if (!container) return;

  container.innerHTML = genres.map(genre => `
    <button onclick="filterByGenre('${genre}', this)" class="${genre === "All" ? "active" : ""}">${genre}</button>
  `).join("");
}

function filterByGenre(genre, clickedButton) {
  removeActiveGenre();
  clickedButton.classList.add("active");

  const filtered = genre === "All"
    ? animeList
    : animeList.filter(anime => anime.genre.includes(genre));

  const title = document.getElementById("genreTitle");
  if (title) title.textContent = genre === "All" ? "All Anime" : `${genre} Anime`;

  const searchInput = document.getElementById("searchInput");
  if (searchInput) searchInput.value = "";
  renderAnimeGrid("animeGrid", filtered);
}

function removeActiveGenre() {
  document.querySelectorAll(".genre-buttons button").forEach(btn => {
    btn.classList.remove("active");
  });
}

function renderDetailsPage() {
  const detailsPage = document.getElementById("detailsPage");
  if (!detailsPage) return;

  const params = new URLSearchParams(window.location.search);
  const animeId = params.get("id");
  const anime = animeList.find(item => item.id === animeId) || animeList[0];

  document.title = `QuackuAni | ${anime.title}`;
   const relatedAnime = animeList
    .filter(item => item.id !== anime.id && item.genre.some(g => anime.genre.includes(g)))
    .slice(0, 4);

  detailsPage.innerHTML = `
    <section class="details-hero" style="background-image: url('${anime.banner}');">
      <div>
        <a href="popular.html" class="back-btn">← Back to Popular</a>
        <h1>${anime.title}</h1>
        <p>${anime.genre.join(" • ")} • ${anime.type}</p>
      </div>
    </section>

    <section class="details-content">
      <aside class="details-poster">
        <img src="${anime.image}" alt="${anime.title}">
        <div class="poster-meta">
  <div class="poster-meta-top">
    <div>
      <p>⭐ ⭐ ⭐ ⭐ ⭐</p>
      <p>${anime.type}</p>
    </div>

    <span 
  class="details-favorite-btn ${getFavorites().includes(anime.id) ? "active" : ""}"
  onclick="toggleFavoriteFromDetails('${anime.id}')"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="30"
    height="30"
    viewBox="0 0 24 24"
  >
    <path d="M20.84 4.61c-1.54-1.32-3.83-1.13-5.23.33L12 8.7l-3.61-3.76c-1.4-1.46-3.69-1.65-5.23-.33-1.78 1.53-1.87 4.26-.26 5.93L12 20l9.1-9.46c1.61-1.67 1.52-4.4-.26-5.93z"></path>
  </svg>
</span>
  </div>
</div>
        
        </aside>

      <div class="details-main">
        <div class="info-panel">
          <h2>Anime Information</h2>

          <div class="info-grid">
            <div class="info-item">
              <small>Title</small>
              <strong>${anime.title}</strong>
            </div>
            <div class="info-item">
              <small>Director</small>
              <strong>${anime.director}</strong>
            </div>
            <div class="info-item">
              <small>Writer</small>
              <strong>${anime.writer}</strong>
            </div>
            <div class="info-item">
              <small>Genre</small>
              <strong>${anime.genre.join(", ")}</strong>
            </div>
             <div class="info-item">
              <small>Running Time</small>
              <strong>${anime.runningTime}</strong>
            </div>
            <div class="info-item">
              <small>Release Date</small>
              <strong>${anime.releaseDate}</strong>
            </div>
          </div>

          <h2>Plot</h2>
          <p>${anime.plot}</p>

          <h2>Synopsis</h2>
          <p>${anime.synopsis}</p>
        </div>

        <div class="quotes-panel">
          <h2>Popular Quotes</h2>
          <ul>
           ${anime.quotes.map(quote => `<li>“${quote}”</li>`).join("")}
          </ul>
        </div>

        <div class="related-panel">
          <h2>Related Anime</h2>
          <div class="related-grid">
            ${relatedAnime.map(item => `
              <article class="related-card" onclick="openDetails('${item.id}')">
                <img src="${item.image}" alt="${item.title}">
                <h3>${item.title}</h3>
              </article>
            `).join("")}
          </div>
        </div>
      </div>
    </section>
  `;
}
function applySearchFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const keyword = params.get("search");

  if (!keyword) return;

  const input = document.getElementById("searchInput");
  if (input) input.value = keyword;

  const filtered = animeList.filter(anime => {
    const combinedText = `${anime.title} ${anime.genre.join(" ")} ${anime.type}`.toLowerCase();
    return combinedText.includes(keyword.toLowerCase());
  });

  renderAnimeGrid("animeGrid", filtered);
}
function getCurrentUser() {
  return localStorage.getItem("currentUser") || "guest";
}

function getFavoritesKey() {
  return `favorites_${getCurrentUser()}`;
}

function getFavorites() {
  return JSON.parse(localStorage.getItem(getFavoritesKey())) || [];
}

function saveFavorites(favorites) {
  localStorage.setItem(getFavoritesKey(), JSON.stringify(favorites));
}

function toggleFavoriteFromDetails(id) {
  let favorites = getFavorites();

  if (favorites.includes(id)) {
    favorites = favorites.filter(item => item !== id);
  } else {
    favorites.push(id);
  }

  saveFavorites(favorites);

  const heart = document.querySelector(".details-favorite-btn");

  if (heart) {
    heart.classList.toggle("active");
  }

  if (document.getElementById("favoritesGrid")) {
    renderFavoritesPage();
  }
}

function renderFavoritesPage() {
  const container = document.getElementById("favoritesGrid");
  if (!container) return;

  const favorites = getFavorites();
  const reviews = getReviews();

  const favoriteAnime = animeList.filter(anime => favorites.includes(anime.id));

  if (favoriteAnime.length === 0) {
    container.innerHTML = `
      <div class="favorites-empty">
        <div class="empty-heart">♡</div>
        <h2>No favorites yet!</h2>
        <p>Add your next anime to binge watch!</p>
        <a href="popular.html">Browse Anime</a>
      </div>
    `;

    setResultCount(0);
    return;
  }

  container.innerHTML = favoriteAnime.map(anime => {
    const review = reviews[anime.id];

    return `
      <article class="anime-card" onclick="openDetails('${anime.id}')">
        <div class="poster-box">
          <img src="${anime.image}" alt="${anime.title}">
          <div class="hover-label">View Details</div>
        </div>

        <div class="card-info">
          <h3>${anime.title}</h3>
          <p>${anime.genre.slice(0, 2).join(" • ")} • ${anime.type}</p>

          ${review ? `
            <div class="saved-review">
              <p class="yellow-stars">${makeStars(review.rating)}</p>
              <p><strong>Status:</strong> ${review.status}</p>
              <p>${review.thoughts}</p>
            </div>
          ` : ""}

          <button 
            class="review-btn"
            onclick="event.stopPropagation(); openReviewModal('${anime.id}')"
          >
            ${review ? "Edit Review" : "Write Review"}
          </button>
        </div>
      </article>
    `;
  }).join("");

  setResultCount(favoriteAnime.length);
}


function activateFavoriteSearch(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;

  input.addEventListener("input", () => {
    const keyword = input.value.trim().toLowerCase();
    const favorites = getFavorites();

    const favoriteAnime = animeList.filter(anime =>
      favorites.includes(anime.id) &&
      `${anime.title} ${anime.genre.join(" ")} ${anime.type}`
        .toLowerCase()
        .includes(keyword)
    );

    const container = document.getElementById("favoritesGrid");

    if (favoriteAnime.length === 0) {
      container.innerHTML = `
        <div class="favorites-empty">
          <div class="empty-heart">♡</div>
          <h2>No favorites yet!</h2>
          <p>Add your next anime to binge watch!</p>
          <a href="popular.html">Browse Anime</a>
        </div>
      `;

      const resultCount = document.getElementById("resultCount");
      if (resultCount) resultCount.textContent = "0 results";

      return;
    }

  });
}
let currentReviewAnimeId = null;
let selectedRating = 0;

function getReviewsKey() {
  return `reviews_${getCurrentUser()}`;
}

function getReviews() {
  return JSON.parse(localStorage.getItem(getReviewsKey())) || {};
}

function saveReviews(reviews) {
  localStorage.setItem(getReviewsKey(), JSON.stringify(reviews));
}

function openReviewModal(animeId) {
  currentReviewAnimeId = animeId;

  const anime = animeList.find(item => item.id === animeId);
  const reviews = getReviews();
  const savedReview = reviews[animeId];

  document.getElementById("reviewAnimeTitle").textContent = `Review ${anime.title}`;
  document.getElementById("watchStatus").value = savedReview ? savedReview.status : "Plan to Watch";
  document.getElementById("reviewText").value = savedReview ? savedReview.thoughts : "";

  selectedRating = savedReview ? savedReview.rating : 0;
  updateStars();

  document.getElementById("reviewModal").classList.add("active");
}

function closeReviewModal() {
  document.getElementById("reviewModal").classList.remove("active");
  currentReviewAnimeId = null;
  selectedRating = 0;
}

function setRating(rating) {
  selectedRating = rating;
  updateStars();
}

function updateStars() {
  const stars = document.querySelectorAll("#reviewStars span");

  stars.forEach((star, index) => {
    star.classList.toggle("active", index < selectedRating);
  });
}

function saveReview() {
  if (!currentReviewAnimeId) return;

  const status = document.getElementById("watchStatus").value;
  const thoughts = document.getElementById("reviewText").value.trim();

  if (selectedRating === 0) {
  showReviewNotice("Please choose a star rating first.");
  return;
}

if (!thoughts) {
  showReviewNotice("Quacku needs your thoughts! Please write something about the anime.");
  return;
}

  const reviews = getReviews();

  reviews[currentReviewAnimeId] = {
    status: status,
    rating: selectedRating,
    thoughts: thoughts
  };

  saveReviews(reviews);
  closeReviewModal();
  renderFavoritesPage();
}

function makeStars(rating) {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}
function showReviewNotice(message) {
  const oldNotice = document.querySelector(".review-notice");

  if (oldNotice) oldNotice.remove();

  const notice = document.createElement("div");
  notice.className = "review-notice";
  notice.textContent = message;

  document.querySelector(".review-box").appendChild(notice);

  setTimeout(() => {
    notice.remove();
  }, 2500);
}
window.addEventListener("DOMContentLoaded", applySearchFromUrl);