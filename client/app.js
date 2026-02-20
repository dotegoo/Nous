// ─── CONFIG ───────────────────────────────────────────────────────────────
const API_BASE = 'https://nous-0u15.onrender.com';

// ─── STARS ────────────────────────────────────────────────────────────────
(function () {
  const el = document.getElementById('starField');
  for (let i = 0; i < 130; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const size = Math.random() * 2.5 + 0.4;
    s.style.cssText = `
      width:${size}px; height:${size}px;
      top:${Math.random() * 100}%; left:${Math.random() * 100}%;
      --dur:${2 + Math.random() * 5}s;
      --delay:-${Math.random() * 7}s;
      --min-op:${0.04 + Math.random() * 0.1};
      --max-op:${0.3 + Math.random() * 0.6};
    `;
    el.appendChild(s);
  }
})();

// ─── TOKEN HELPERS ────────────────────────────────────────────────────────
function getToken()       { return localStorage.getItem('nous_token'); }
function setToken(t)      { localStorage.setItem('nous_token', t); }
function removeToken()    { localStorage.removeItem('nous_token'); }
function getUser()        { return JSON.parse(localStorage.getItem('nous_user') || 'null'); }
function setUser(u)       { localStorage.setItem('nous_user', JSON.stringify(u)); }
function removeUser()     { localStorage.removeItem('nous_user'); }

// ─── API HELPER ───────────────────────────────────────────────────────────
// Central fetch wrapper — attaches auth header, parses JSON, throws on errors
async function api(method, path, body = null) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${API_BASE}${path}`, opts);
  const data = await res.json();

  if (!res.ok) {
    // Throw the server's error message so callers can display it
    throw new Error(data.error || 'Something went wrong.');
  }

  return data;
}

// ─── AUTH ─────────────────────────────────────────────────────────────────
function switchTab(tab) {
  document.getElementById('loginForm').style.display  = tab === 'login'  ? '' : 'none';
  document.getElementById('signupForm').style.display = tab === 'signup' ? '' : 'none';
  document.getElementById('tabLogin').classList.toggle('active',  tab === 'login');
  document.getElementById('tabSignup').classList.toggle('active', tab === 'signup');
  // Clear messages when switching
  ['loginMsg', 'signupMsg'].forEach(id => {
    const el = document.getElementById(id);
    el.textContent = '';
    el.className = 'auth-message';
  });
}

function showAuthMsg(id, text, type) {
  const el = document.getElementById(id);
  el.textContent = text;
  el.className = 'auth-message ' + type;
}

async function signup() {
  const name     = document.getElementById('signupName').value.trim();
  const email    = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;

  if (!name || !email || !password) {
    return showAuthMsg('signupMsg', 'Please fill all fields.', 'error');
  }

  const btn = document.querySelector('#signupForm .btn-primary');
  btn.disabled = true;

  try {
    const data = await api('POST', '/auth/signup', { name, email, password });
    showAuthMsg('signupMsg', 'Account created. You may now enter.', 'success');
    setTimeout(() => switchTab('login'), 1200);
  } catch (err) {
    showAuthMsg('signupMsg', err.message, 'error');
  } finally {
    btn.disabled = false;
  }
}

async function login() {
  const email    = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (!email || !password) {
    return showAuthMsg('loginMsg', 'Please enter your credentials.', 'error');
  }

  const btn = document.querySelector('#loginForm .btn-primary');
  btn.disabled = true;

  try {
    const data = await api('POST', '/auth/login', { email, password });
    setToken(data.token);
    setUser(data.user);
    enterApp(data.user);
  } catch (err) {
    showAuthMsg('loginMsg', err.message, 'error');
  } finally {
    btn.disabled = false;
  }
}

function logout() {
  removeToken();
  removeUser();
  document.getElementById('mainApp').style.display    = 'none';
  document.getElementById('authScreen').style.display = 'flex';
  // Clear form fields
  ['loginEmail','loginPassword','signupName','signupEmail','signupPassword']
    .forEach(id => { document.getElementById(id).value = ''; });
}

function enterApp(user) {
  document.getElementById('authScreen').style.display = 'none';
  document.getElementById('mainApp').style.display    = 'block';
  document.getElementById('userGreeting').textContent = user.name;
  showView('interpret');
  calendarMonth = new Date();
}

// ─── BOOT: restore session on page load ───────────────────────────────────
window.addEventListener('DOMContentLoaded', async () => {
  const token = getToken();
  const user  = getUser();

  if (token && user) {
    // Verify the token is still valid against the server
    try {
      const data = await api('GET', '/auth/me');
      setUser(data.user); // refresh stored user data
      enterApp(data.user);
      return;
    } catch {
      // Token expired or invalid — clear and show auth screen
      removeToken();
      removeUser();
    }
  }

  document.getElementById('authScreen').style.display = 'flex';
});

// ─── VIEWS ────────────────────────────────────────────────────────────────
const VIEWS = ['interpret', 'calendar', 'journal'];

function showView(name) {
  VIEWS.forEach(v => {
    const cap = v.charAt(0).toUpperCase() + v.slice(1);
    document.getElementById('view' + cap).classList.remove('active');
    document.getElementById('nav'  + cap).classList.remove('active');
  });
  const cap = name.charAt(0).toUpperCase() + name.slice(1);
  document.getElementById('view' + cap).classList.add('active');
  document.getElementById('nav'  + cap).classList.add('active');

  if (name === 'calendar') { calendarMonth = calendarMonth || new Date(); renderCalendar(); }
  if (name === 'journal')  renderJournal();
}

// ─── LENS ─────────────────────────────────────────────────────────────────
let activeLens = 'jungian';
const LENS_LABELS = {
  jungian:   'Jungian',
  freudian:  'Freudian',
  spiritual: 'Spiritual',
  practical: 'Practical',
};

function selectLens(btn) {
  document.querySelectorAll('.lens-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeLens = btn.dataset.lens;
}

// ─── INTERPRET ────────────────────────────────────────────────────────────
const LOADING_MSGS = [
  'Nous is gazing into the symbolic realm…',
  'Tracing the threads of your unconscious mind…',
  'Reading the ancient language of visions…',
  'The symbols are slowly taking form…',
  'Consulting the archive of the collective unconscious…',
];
let loadInterval;

async function interpretDream() {
  const dream = document.getElementById('dreamInput').value.trim();
  if (!dream) return;

  const btn     = document.getElementById('interpretBtn');
  const loading = document.getElementById('loadingBar');
  const result  = document.getElementById('resultCard');
  const error   = document.getElementById('errorBanner');
  const loadMsg = document.getElementById('loadingMsg');

  btn.disabled = true;
  loading.classList.add('active');
  result.classList.remove('active');
  error.classList.remove('active');

  let mi = 0;
  loadMsg.textContent = LOADING_MSGS[0];
  loadInterval = setInterval(() => {
    mi = (mi + 1) % LOADING_MSGS.length;
    loadMsg.textContent = LOADING_MSGS[mi];
  }, 2800);

  try {
    // POST to our backend — Anthropic call happens server-side
    const data = await api('POST', '/dreams/interpret', {
      dream,
      lens: activeLens,
    });

    clearInterval(loadInterval);
    loading.classList.remove('active');

    const entry = data.dream;

    // Render interpretation
    document.getElementById('interpretationText').textContent = entry.interpretation;
    document.getElementById('resultLensBadge').textContent    = LENS_LABELS[activeLens] + ' lens';

    const grid = document.getElementById('symbolsGrid');
    grid.innerHTML = '';
    (entry.symbols || []).forEach(s => {
      const t = document.createElement('div');
      t.className   = 'symbol-tag';
      t.textContent = s;
      grid.appendChild(t);
    });

    result.classList.add('active');

  } catch (err) {
    clearInterval(loadInterval);
    loading.classList.remove('active');
    error.textContent = err.message || 'The visions could not be deciphered. Please try again.';
    error.classList.add('active');
  }

  btn.disabled = false;
}

function clearAll() {
  document.getElementById('dreamInput').value = '';
  document.getElementById('resultCard').classList.remove('active');
  document.getElementById('errorBanner').classList.remove('active');
}

// ─── CALENDAR ─────────────────────────────────────────────────────────────
let calendarMonth = new Date();

function changeMonth(dir) {
  calendarMonth.setMonth(calendarMonth.getMonth() + dir);
  renderCalendar();
  document.getElementById('detailEmpty').style.display   = '';
  document.getElementById('detailContent').style.display = 'none';
}

async function renderCalendar() {
  const year  = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth() + 1; // API expects 1-based month
  const today = new Date();

  document.getElementById('calTitle').textContent =
    new Date(year, month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();

  const grid = document.getElementById('calGrid');
  grid.innerHTML = '';

  // Day-of-week headers
  ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].forEach(d => {
    const el = document.createElement('div');
    el.className   = 'cal-dow';
    el.textContent = d;
    grid.appendChild(el);
  });

  // Fetch dreams for this month from the backend
  let dreamMap = {};
  try {
    const data = await api('GET', `/dreams/calendar?year=${year}&month=${month}`);
    dreamMap = data.calendar || {};
  } catch (err) {
    console.error('Could not load calendar data:', err.message);
  }

  const firstDay    = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const daysInPrev  = new Date(year, month - 1, 0).getDate();

  // Previous month trailing days
  for (let i = 0; i < firstDay; i++) {
    const el = document.createElement('div');
    el.className   = 'cal-day other-month';
    el.textContent = daysInPrev - firstDay + i + 1;
    grid.appendChild(el);
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const el      = document.createElement('div');
    el.className  = 'cal-day';
    const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isToday = today.getFullYear() === year && today.getMonth() === month - 1 && today.getDate() === d;

    if (isToday) el.classList.add('today');

    const entries = dreamMap[dateKey];
    if (entries && entries.length > 0) {
      el.classList.add('has-dream');
      const dot = document.createElement('div');
      dot.className = 'dream-dot';
      el.appendChild(dot);
      el.onclick = () => showDreamDetail(entries[0], el); // show first dream of that day
    }

    const num = document.createElement('span');
    num.textContent = d;
    el.insertBefore(num, el.firstChild);
    grid.appendChild(el);
  }

  // Next month leading days
  const remaining = 42 - firstDay - daysInMonth;
  for (let i = 1; i <= remaining; i++) {
    const el = document.createElement('div');
    el.className   = 'cal-day other-month';
    el.textContent = i;
    grid.appendChild(el);
  }
}

function showDreamDetail(entry, dayEl) {
  document.querySelectorAll('.cal-day').forEach(d => d.classList.remove('selected'));
  dayEl.classList.add('selected');

  document.getElementById('detailEmpty').style.display   = 'none';
  document.getElementById('detailContent').style.display = '';

  const dateStr = new Date(entry.createdAt).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });

  document.getElementById('detailDate').textContent     = dateStr.toUpperCase();
  document.getElementById('detailDreamText').textContent = '"' + entry.dream + '"';
  document.getElementById('detailLensTag').textContent   = (LENS_LABELS[entry.lens] || entry.lens) + ' Lens';
  document.getElementById('detailInterp').textContent    = entry.interpretation;

  const syms = document.getElementById('detailSymbols');
  syms.innerHTML = '';
  (entry.symbols || []).forEach(s => {
    const t = document.createElement('div');
    t.className   = 'detail-sym';
    t.textContent = s;
    syms.appendChild(t);
  });
}

// ─── JOURNAL ──────────────────────────────────────────────────────────────
async function renderJournal() {
  const container = document.getElementById('journalList');
  container.innerHTML = '<div class="empty-state"><div class="empty-icon">☽</div><p>Loading your dreams…</p></div>';

  try {
    const data   = await api('GET', '/dreams?limit=50');
    const dreams = data.dreams || [];

    container.innerHTML = '';

    if (!dreams.length) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">☽</div>
          <p>No dreams have been recorded yet.<br>Interpret your first dream to begin the journal.</p>
        </div>`;
      return;
    }

    const list = document.createElement('div');
    list.className = 'journal-list';

    dreams.forEach(entry => {
      const el       = document.createElement('div');
      el.className   = 'journal-entry fade-in';
      const dateStr  = new Date(entry.createdAt).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
      });

      el.innerHTML = `
        <div class="journal-dream">"${entry.dream}"</div>
        <div class="journal-meta">
          <div class="journal-date">${dateStr}</div>
          <div class="journal-lens">${LENS_LABELS[entry.lens] || entry.lens}</div>
        </div>
        <div class="journal-symbols">
          ${(entry.symbols || []).map(s => `<span class="journal-sym">${s}</span>`).join('')}
        </div>
      `;

      el.onclick = () => loadEntry(entry);
      list.appendChild(el);
    });

    container.appendChild(list);

  } catch (err) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">☽</div>
        <p>Could not load your journal.<br>${err.message}</p>
      </div>`;
  }
}

function loadEntry(entry) {
  showView('interpret');
  document.getElementById('dreamInput').value           = entry.dream;
  document.getElementById('interpretationText').textContent = entry.interpretation;
  document.getElementById('resultLensBadge').textContent    = (LENS_LABELS[entry.lens] || entry.lens) + ' lens';

  const grid = document.getElementById('symbolsGrid');
  grid.innerHTML = '';
  (entry.symbols || []).forEach(s => {
    const t = document.createElement('div');
    t.className   = 'symbol-tag';
    t.textContent = s;
    grid.appendChild(t);
  });

  document.getElementById('resultCard').classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─── KEYBOARD SHORTCUTS ───────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    if (document.activeElement.id === 'loginPassword')  login();
    if (document.activeElement.id === 'signupPassword') signup();
  }
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && document.activeElement.id === 'dreamInput') {
    interpretDream();
  }
});