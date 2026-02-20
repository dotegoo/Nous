
// Stars
(function(){
  const el = document.getElementById('starField');
  for(let i=0;i<130;i++){
    const s = document.createElement('div');
    s.className = 'star';
    const size = Math.random()*2.5+0.4;
    s.style.cssText = `width:${size}px;height:${size}px;top:${Math.random()*100}%;left:${Math.random()*100}%;
      --dur:${2+Math.random()*5}s;--delay:-${Math.random()*7}s;
      --min-op:${0.04+Math.random()*0.1};--max-op:${0.3+Math.random()*0.6};`;
    el.appendChild(s);
  }
})();

// ─── STORAGE (localStorage mock backend) ───
function getUsers(){ return JSON.parse(localStorage.getItem('nous_users')||'{}'); }
function saveUsers(u){ localStorage.setItem('nous_users', JSON.stringify(u)); }
function getSession(){ return JSON.parse(sessionStorage.getItem('nous_session')||'null'); }
function setSession(u){ sessionStorage.setItem('nous_session', JSON.stringify(u)); }
function getDreams(uid){ return JSON.parse(localStorage.getItem('nous_dreams_'+uid)||'[]'); }
function saveDreams(uid,d){ localStorage.setItem('nous_dreams_'+uid, JSON.stringify(d)); }

// ─── AUTH ───
function switchTab(tab){
  document.getElementById('loginForm').style.display = tab==='login'?'':'none';
  document.getElementById('signupForm').style.display = tab==='signup'?'':'none';
  document.getElementById('tabLogin').classList.toggle('active', tab==='login');
  document.getElementById('tabSignup').classList.toggle('active', tab==='signup');
}

function showAuthMsg(id, text, type){
  const el = document.getElementById(id);
  el.textContent = text;
  el.className = 'auth-message '+type;
}

function signup(){
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim().toLowerCase();
  const pass = document.getElementById('signupPassword').value;
  if(!name||!email||!pass) return showAuthMsg('signupMsg','Please fill all fields.','error');
  if(pass.length<6) return showAuthMsg('signupMsg','Password must be at least 6 characters.','error');
  if(!/\S+@\S+\.\S+/.test(email)) return showAuthMsg('signupMsg','Please enter a valid email.','error');
  const users = getUsers();
  if(users[email]) return showAuthMsg('signupMsg','An account with this email already exists.','error');
  users[email] = { name, email, password: btoa(pass), id: email };
  saveUsers(users);
  showAuthMsg('signupMsg','Account created. You may now enter.','success');
  setTimeout(()=>switchTab('login'), 1200);
}

function login(){
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const pass = document.getElementById('loginPassword').value;
  if(!email||!pass) return showAuthMsg('loginMsg','Please enter your credentials.','error');
  const users = getUsers();
  const user = users[email];
  if(!user || btoa(pass)!==user.password) return showAuthMsg('loginMsg','Invalid email or password.','error');
  setSession(user);
  enterApp(user);
}

function logout(){
  sessionStorage.removeItem('nous_session');
  document.getElementById('mainApp').style.display = 'none';
  document.getElementById('authScreen').style.display = 'flex';
}

function enterApp(user){
  document.getElementById('authScreen').style.display = 'none';
  document.getElementById('mainApp').style.display = 'block';
  document.getElementById('userGreeting').textContent = user.name;
  showView('interpret');
  calendarMonth = new Date();
}

// Boot
window.addEventListener('DOMContentLoaded', ()=>{
  const user = getSession();
  if(user && getUsers()[user.email]){ enterApp(user); }
  else { document.getElementById('authScreen').style.display = 'flex'; }
});

// ─── VIEWS ───
const VIEWS = ['interpret','calendar','journal'];
function showView(name){
  VIEWS.forEach(v=>{
    const cap = v.charAt(0).toUpperCase()+v.slice(1);
    document.getElementById('view'+cap).classList.remove('active');
    document.getElementById('nav'+cap).classList.remove('active');
  });
  const cap = name.charAt(0).toUpperCase()+name.slice(1);
  document.getElementById('view'+cap).classList.add('active');
  document.getElementById('nav'+cap).classList.add('active');
  if(name==='calendar'){ calendarMonth=calendarMonth||new Date(); renderCalendar(); }
  if(name==='journal') renderJournal();
}

// ─── LENS ───
let activeLens = 'jungian';
const LENS_LABELS = { jungian:'Jungian', freudian:'Freudian', spiritual:'Spiritual', practical:'Practical' };
const LENS_PROMPTS = {
  jungian: `You are Nous, a Jungian dream analyst. Interpret through the lens of Carl Jung — archetypes (Shadow, Anima/Animus, Self, Persona, Hero), the collective unconscious, individuation, and symbolic amplification. Speak with poetic depth and wisdom.`,
  freudian: `You are Nous, a Freudian dream analyst. Interpret through the lens of Sigmund Freud — unconscious wishes, repression, id/ego/superego dynamics, symbolic displacement, condensation, and latent vs manifest content. Be psychoanalytically insightful but accessible.`,
  spiritual: `You are Nous, a spiritual dream interpreter drawing from world mythology, ancient symbolism, Hermeticism, shamanic traditions, and the soul's language. Interpret dreams as messages from deeper dimensions of existence — oracular, poetic, timeless.`,
  practical: `You are Nous, a practical psychological dream analyst. Interpret dreams as the mind processing waking-life emotions, relationships, stress, and unresolved experiences. Keep the interpretation grounded, relatable, and personally insightful.`
};

function selectLens(btn){
  document.querySelectorAll('.lens-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  activeLens = btn.dataset.lens;
}

// ─── INTERPRET ───
const LOADING_MSGS = [
  "Nous is gazing into the symbolic realm…",
  "Tracing the threads of your unconscious mind…",
  "Reading the ancient language of visions…",
  "The symbols are slowly taking form…",
  "Consulting the archive of the collective unconscious…"
];
let loadInterval;

async function interpretDream(){
  const dream = document.getElementById('dreamInput').value.trim();
  if(!dream) return;
  const user = getSession();
  if(!user) return;

  const btn = document.getElementById('interpretBtn');
  const loading = document.getElementById('loadingBar');
  const result = document.getElementById('resultCard');
  const error = document.getElementById('errorBanner');
  const loadMsg = document.getElementById('loadingMsg');

  btn.disabled = true;
  loading.classList.add('active');
  result.classList.remove('active');
  error.classList.remove('active');

  let mi = 0;
  loadMsg.textContent = LOADING_MSGS[0];
  loadInterval = setInterval(()=>{ mi=(mi+1)%LOADING_MSGS.length; loadMsg.textContent=LOADING_MSGS[mi]; }, 2800);

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: LENS_PROMPTS[activeLens] + '\n\nRespond ONLY with a valid JSON object (no markdown, no preamble):\n{\n  "interpretation": "2-4 paragraphs separated by \\n\\n, elegant and insightful, addressing the dreamer as you",\n  "symbols": ["3-6 short symbol labels identified in the dream"]\n}',
        messages: [{ role:'user', content:'Interpret this dream: '+dream }]
      })
    });
    const data = await res.json();
    const raw = data.content?.[0]?.text || '';
    const parsed = JSON.parse(raw.replace(/```json|```/g,'').trim());

    clearInterval(loadInterval);
    loading.classList.remove('active');

    document.getElementById('interpretationText').textContent = parsed.interpretation;
    document.getElementById('resultLensBadge').textContent = LENS_LABELS[activeLens]+' lens';

    const grid = document.getElementById('symbolsGrid');
    grid.innerHTML = '';
    (parsed.symbols||[]).forEach(s=>{
      const t = document.createElement('div'); t.className='symbol-tag'; t.textContent=s; grid.appendChild(t);
    });

    result.classList.add('active');

    // Save
    const entry = {
      id: Date.now(),
      dream,
      interpretation: parsed.interpretation,
      symbols: parsed.symbols||[],
      lens: activeLens,
      date: new Date().toISOString(),
      dateStr: new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})
    };
    const dreams = getDreams(user.id);
    dreams.unshift(entry);
    saveDreams(user.id, dreams);

  } catch(e) {
    clearInterval(loadInterval);
    loading.classList.remove('active');
    error.textContent = 'The visions could not be deciphered at this time. Please try again.';
    error.classList.add('active');
  }
  btn.disabled = false;
}

function clearAll(){
  document.getElementById('dreamInput').value = '';
  document.getElementById('resultCard').classList.remove('active');
  document.getElementById('errorBanner').classList.remove('active');
}

// ─── CALENDAR ───
let calendarMonth = new Date();

function changeMonth(dir){
  calendarMonth.setMonth(calendarMonth.getMonth()+dir);
  renderCalendar();
  document.getElementById('detailEmpty').style.display='';
  document.getElementById('detailContent').style.display='none';
}

function renderCalendar(){
  const user = getSession();
  if(!user) return;
  const dreams = getDreams(user.id);
  const dreamMap = {};
  dreams.forEach(d=>{ const k=d.date.slice(0,10); if(!dreamMap[k]) dreamMap[k]=d; });

  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();
  const today = new Date();

  document.getElementById('calTitle').textContent =
    new Date(year,month).toLocaleDateString('en-US',{month:'long',year:'numeric'}).toUpperCase();

  const grid = document.getElementById('calGrid');
  grid.innerHTML = '';

  ['Su','Mo','Tu','We','Th','Fr','Sa'].forEach(d=>{
    const el = document.createElement('div'); el.className='cal-dow'; el.textContent=d; grid.appendChild(el);
  });

  const firstDay = new Date(year,month,1).getDay();
  const daysInMonth = new Date(year,month+1,0).getDate();
  const daysInPrev = new Date(year,month,0).getDate();

  for(let i=0;i<firstDay;i++){
    const el=document.createElement('div'); el.className='cal-day other-month';
    el.textContent=daysInPrev-firstDay+i+1; grid.appendChild(el);
  }
  for(let d=1;d<=daysInMonth;d++){
    const el=document.createElement('div'); el.className='cal-day';
    const dateKey=`${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const isToday = today.getFullYear()===year&&today.getMonth()===month&&today.getDate()===d;
    if(isToday) el.classList.add('today');
    const entry = dreamMap[dateKey];
    if(entry){
      el.classList.add('has-dream');
      const dot=document.createElement('div'); dot.className='dream-dot'; el.appendChild(dot);
      el.onclick=()=>showDreamDetail(entry,el);
    }
    const num=document.createElement('span'); num.textContent=d; el.insertBefore(num,el.firstChild);
    grid.appendChild(el);
  }
  const remaining=42-firstDay-daysInMonth;
  for(let i=1;i<=remaining;i++){
    const el=document.createElement('div'); el.className='cal-day other-month'; el.textContent=i; grid.appendChild(el);
  }
}

function showDreamDetail(entry, dayEl){
  document.querySelectorAll('.cal-day').forEach(d=>d.classList.remove('selected'));
  dayEl.classList.add('selected');
  document.getElementById('detailEmpty').style.display='none';
  document.getElementById('detailContent').style.display='';
  document.getElementById('detailDate').textContent=entry.dateStr.toUpperCase();
  document.getElementById('detailDreamText').textContent='"'+entry.dream+'"';
  document.getElementById('detailLensTag').textContent=(LENS_LABELS[entry.lens]||entry.lens)+' Lens';
  document.getElementById('detailInterp').textContent=entry.interpretation;
  const syms=document.getElementById('detailSymbols'); syms.innerHTML='';
  (entry.symbols||[]).forEach(s=>{ const t=document.createElement('div'); t.className='detail-sym'; t.textContent=s; syms.appendChild(t); });
}

// ─── JOURNAL ───
function renderJournal(){
  const user=getSession();
  if(!user) return;
  const dreams=getDreams(user.id);
  const container=document.getElementById('journalList');
  container.innerHTML='';
  if(!dreams.length){
    container.innerHTML='<div class="empty-state"><div class="empty-icon">☽</div><p>No dreams have been recorded yet.<br>Interpret your first dream to begin the journal.</p></div>';
    return;
  }
  const list=document.createElement('div'); list.className='journal-list';
  dreams.forEach(entry=>{
    const el=document.createElement('div'); el.className='journal-entry fade-in';
    el.innerHTML=`
      <div class="journal-dream">"${entry.dream}"</div>
      <div class="journal-meta">
        <div class="journal-date">${entry.dateStr}</div>
        <div class="journal-lens">${LENS_LABELS[entry.lens]||entry.lens}</div>
      </div>
      <div class="journal-symbols">${(entry.symbols||[]).map(s=>`<span class="journal-sym">${s}</span>`).join('')}</div>
    `;
    el.onclick=()=>loadEntry(entry);
    list.appendChild(el);
  });
  container.appendChild(list);
}

function loadEntry(entry){
  showView('interpret');
  document.getElementById('dreamInput').value=entry.dream;
  document.getElementById('interpretationText').textContent=entry.interpretation;
  document.getElementById('resultLensBadge').textContent=(LENS_LABELS[entry.lens]||entry.lens)+' lens';
  const grid=document.getElementById('symbolsGrid'); grid.innerHTML='';
  (entry.symbols||[]).forEach(s=>{ const t=document.createElement('div'); t.className='symbol-tag'; t.textContent=s; grid.appendChild(t); });
  document.getElementById('resultCard').classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
}

// Keyboard shortcuts
document.addEventListener('keydown', e=>{
  if(e.key==='Enter'){
    if(document.activeElement.id==='loginPassword') login();
    if(document.activeElement.id==='signupPassword') signup();
  }
  if(e.key==='Enter'&&(e.metaKey||e.ctrlKey)&&document.activeElement.id==='dreamInput') interpretDream();
});