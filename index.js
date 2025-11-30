// index.js - demo player logic and DOM interaction

// ES6 features: let/const, template literals, arrow functions, destructuring
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const quickPlaylistEl = document.getElementById('quickPlaylist');
const songTitleEl = document.getElementById('songTitle');
const songArtistEl = document.getElementById('songArtist');
const searchInput = document.getElementById('searchInput');

let currentIndex = 0;

// Objects & arrays: a small local music list (could be from API)
const songs = [
  { id: 1, title: 'Sunrise', artist: 'A. Composer', duration: 180 },
  { id: 2, title: 'Ocean Drive', artist: 'Beat Makers', duration: 210 },
  { id: 3, title: 'Night Wind', artist: 'Synth Duo', duration: 240 }
];

// Use map to render playlist items
function renderPlaylist(listEl, list) {
  listEl.innerHTML = '';
  list.forEach(song => {
    const li = document.createElement('li');
    li.className = 'song-item';
    li.innerHTML = `
      <div class="meta">
        <strong>${song.title}</strong>
        <span>— ${song.artist}</span>
      </div>
      <div>
        <button class="favorite" data-id="${song.id}">Fav</button>
        <button class="secondary" data-id="${song.id}" data-action="play">Play</button>
      </div>
    `;
    listEl.appendChild(li);
  });
}

// initialize quick playlist
renderPlaylist(quickPlaylist, songs);

// Helper: show current
function showCurrent() {
  const s = songs[currentIndex];
  if (s) {
    songTitleEl.textContent = s.title;
    songArtistEl.textContent = s.artist;
  } else {
    songTitleEl.textContent = 'No song selected';
    songArtistEl.textContent = '';
  }
}
showCurrent();

// Event handling: addEventListener for >= 3 actions
// 1) click on play button
playBtn.addEventListener('click', () => {
  // traditional function could also be used - mixing styles
  console.log('Play pressed');
  // pretend to play: update UI
  songTitleEl.style.color = '#3f51b5';
});

// 2) pause
pauseBtn.addEventListener('click', () => {
  console.log('Pause pressed');
  songTitleEl.style.color = '#222';
});

// 3) delegated click in playlist (play / fav)
quickPlaylist.addEventListener('click', (evt) => {
  const btn = evt.target;
  if (btn.matches('button[data-action="play"]')) {
    const id = Number(btn.dataset.id);
    // find index
    const idx = songs.findIndex(s => s.id === id);
    if (idx >= 0) {
      currentIndex = idx;
      showCurrent();
    }
  } else if (btn.matches('button.favorite')) {
    const id = Number(btn.dataset.id);
    toggleFavorite(id);
  }
});

// 4) prev/next/shuffle
prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  showCurrent();
});
nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % songs.length;
  showCurrent();
});
shuffleBtn.addEventListener('click', () => {
  // demonstrate callback function: shuffleArray accepts a callback to update UI
  shuffleArray(songs, showCurrent);
});

// input change event (search)
searchInput.addEventListener('input', (e) => {
  // dispatch to library via localStorage - simplest cross-page communication
  localStorage.setItem('searchQuery', e.target.value);
});

// Callback example: function that takes a callback
function shuffleArray(arr, cb) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]; // destructuring swap
  }
  if (typeof cb === 'function') cb(); // callback invoked
}

// localStorage usage: favorites
function getFavorites() {
  const raw = localStorage.getItem('favorites') || '[]';
  try { return JSON.parse(raw); } catch { return []; }
}
function toggleFavorite(id) {
  const favs = getFavorites();
  const index = favs.indexOf(id);
  if (index === -1) favs.push(id);
  else favs.splice(index, 1);
  localStorage.setItem('favorites', JSON.stringify(favs));
  // visual feedback (very basic)
  alert('Favorites saved: ' + JSON.stringify(favs));
}

// Extra: ensure quickPlaylist element variable exists in this scope
const quickPlaylist = document.getElementById('quickPlaylist');
