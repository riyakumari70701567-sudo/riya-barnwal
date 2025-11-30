// settings.js - form validation, localStorage read/write, and DOM updates
const form = document.getElementById('settingsForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const genreInput = document.getElementById('genre');
const savedEl = document.getElementById('saved');
const clearBtn = document.getElementById('clearBtn');

// load saved settings on page load (localStorage usage)
function loadSaved() {
  const raw = localStorage.getItem('userSettings');
  if (raw) {
    try {
      const obj = JSON.parse(raw);
      nameInput.value = obj.name || '';
      emailInput.value = obj.email || '';
      genreInput.value = obj.genre || '';
      renderSaved(obj);
    } catch (e) {
      console.error('parse error', e);
      savedEl.textContent = 'No valid saved settings.';
    }
  } else {
    savedEl.textContent = 'No saved settings yet.';
  }
}
function renderSaved(obj) {
  savedEl.innerHTML = `<div>Saved Name: <strong>${escapeHtml(obj.name || '')}</strong></div>
                       <div>Saved Email: <strong>${escapeHtml(obj.email || '')}</strong></div>
                       <div>Genre: <strong>${escapeHtml(obj.genre || '')}</strong></div>`;
}

// small helper to avoid naive injection
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
}

// Form validation (JS) before saving
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  // basic validation: required fields & simple email regex
  if (!name) {
    alert('Name is required.');
    return;
  }
  if (!validateEmail(email)) {
    alert('Please enter a valid email.');
    return;
  }
  const settings = { name, email, genre: genreInput.value.trim() };
  localStorage.setItem('userSettings', JSON.stringify(settings));
  renderSaved(settings);
  alert('Settings saved to localStorage.');
});

// clear saved
clearBtn.addEventListener('click', () => {
  localStorage.removeItem('userSettings');
  nameInput.value = '';
  emailInput.value = '';
  genreInput.value = '';
  savedEl.textContent = 'Cleared saved settings.';
});

// simple email validation (not perfect but sufficient for demo)
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// also demonstrate sessionStorage retrieval of selected song from library
window.addEventListener('load', () => {
  loadSaved();
  const sel = sessionStorage.getItem('selectedSong');
  if (sel) {
    try {
      const obj = JSON.parse(sel);
      const el = document.createElement('div');
      el.innerHTML = `Recently selected song: <strong>${escapeHtml(obj.title)}</strong> by ${escapeHtml(obj.artist)}`;
      savedEl.appendChild(el);
    } catch (e) {
      // ignore
    }
  }
});

// demonstration of array methods: pretend we have saved favorite songs id array
function demoArrayMethods() {
  // sample favorites
  const favsRaw = localStorage.getItem('favorites') || '[]';
  let favs;
  try { favs = JSON.parse(favsRaw); }
  catch { favs = []; }
  // map -> convert id to string message
  const mapped = favs.map(id => `Song id ${id}`);
  // reduce -> make comma list
  const summary = mapped.reduce((acc, cur) => acc ? `${acc}, ${cur}` : cur, '');
  // filter -> ids > 150
  const bigIds = favs.filter(id => id > 150);
  console.log('Favorite songs:', mapped, 'summary:', summary, 'big ids:', bigIds);
}
demoArrayMethods();
