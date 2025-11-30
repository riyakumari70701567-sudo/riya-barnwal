// library.js - demonstrates arrays/objects, map/filter/reduce, fetch async/await, DOM creation

const songListEl = document.getElementById('songList');
const filterInput = document.getElementById('filterInput');
const loadApiBtn = document.getElementById('loadApi');
const statsEl = document.getElementById('stats');

// initial array of songs (objects)
let library = [
  { id: 101, title: 'Morning Breeze', artist: 'Indie Folk', length: 150, tags: ['calm'] },
  { id: 102, title: 'Electric Night', artist: 'Synthwave', length: 220, tags: ['energetic'] },
  { id: 103, title: 'Calm River', artist: 'Piano One', length: 200, tags: ['calm'] }
];

// render using loop & DOM methods
function renderLibrary(list) {
  songListEl.innerHTML = '';
  // Use for..of loop (JS basics)
  for (const s of list) {
    const li = document.createElement('li');
    li.className = 'song-item';
    // template literals & destructuring
    const { id, title, artist, length } = s;
    li.innerHTML = `<div class="meta"><strong>${title}</strong><span> — ${artist}</span></div>
                    <div>
                      <span>${Math.floor(length/60)}:${('0'+(length%60)).slice(-2)}</span>
                      <button class="secondary" data-id="${id}" data-action="select">Select</button>
                    </div>`;
    songListEl.appendChild(li);
  }
}

// show stats using reduce
function computeStats(arr) {
  const total = arr.reduce((acc, cur) => acc + (cur.length || 0), 0);
  const avg = arr.length ? Math.round(total / arr.length) : 0;
  statsEl.innerHTML = `Total songs: ${arr.length}. Avg length: ${avg} sec.`;
}

renderLibrary(library);
computeStats(library);

// filter input -> demonstrates event handling
filterInput.addEventListener('input', (e) => {
  const q = e.target.value.trim().toLowerCase();
  // use filter
  const filtered = library.filter(s => s.title.toLowerCase().includes(q));
  renderLibrary(filtered);
});

// event delegation for select button
songListEl.addEventListener('click', (e) => {
  if (e.target.matches('button[data-action="select"]')) {
    const id = Number(e.target.dataset.id);
    const selected = library.find(s => s.id === id);
    if (selected) {
      // store selected in session storage as state
      sessionStorage.setItem('selectedSong', JSON.stringify(selected));
      alert('Selected: ' + selected.title);
    }
  }
});

// Async fetch from public API - using JSONPlaceholder to simulate extra songs
// Async/Await and try/catch (Advanced requirements)
async function fetchMoreSongs() {
  try {
    loadApiBtn.textContent = 'Loading...';
    const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
    if (!res.ok) throw new Error('Network not OK ' + res.status);
    const data = await res.json();
    // map fetched posts to song-like objects using map
    const newSongs = data.map(p => ({
      id: 200 + p.id,
      title: p.title.slice(0, 24),
      artist: 'API Artist',
      length: 180 + (p.id * 5),
      body: p.body
    }));
    // merge using spread operator
    library = [...library, ...newSongs];
    renderLibrary(library);
    computeStats(library);
  } catch (err) {
    console.error('Fetch error:', err);
    alert('Failed to load API: ' + err.message);
  } finally {
    loadApiBtn.textContent = 'Load more from API';
  }
}

// button to trigger API call
loadApiBtn.addEventListener('click', fetchMoreSongs);

// demonstrate map/filter/reduce: show how many 'calm' tags exist
function tagSummary() {
  const allTags = library.flatMap(s => s.tags || []);
  const calmCount = allTags.filter(t => t === 'calm').length;
  return { totalSongs: library.length, calmCount };
}

// show immediately
console.log('Tag summary:', tagSummary());
