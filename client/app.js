// ─── CONFIGURATIE ──────────────────────────────────────────────────────────
const API_BASE = 'https://nous-0u15.onrender.com/api';

// ─── TRADUCERI ─────────────────────────────────────────────────────────
const TRANSLATIONS = {
  en: {
    // Language selector
    langLabel: 'Language',

    // Auth screen
    tagline:        'The oracle of inner visions',
    tabEnter:       'Enter',
    tabBegin:       'Begin',
    labelName:      'Your Name',
    labelEmail:     'Email',
    labelPassword:  'Password',
    labelNewPass:   'New Password',
    placeholderName:     'How should Nous address you?',
    placeholderEmail:    'your@email.com',
    placeholderPassword: '········',
    placeholderNewPass:  'Create a password (min 6 chars)',
    btnEnter:       '✦ Enter the Oracle',
    btnAwaken:      '✦ Awaken the Oracle',
    msgFillFields:  'Please fill all fields.',
    msgCreated:     'Account created. You may now enter.',
    msgCredentials: 'Please enter your credentials.',

    // Topbar
    navInterpret: 'Interpret',
    navCalendar:  'Calendar',
    navJournal:   'Journal',
    btnLeave:     'Leave',

    // Interpret view
    interpretTitle:    'Interpret a Dream',
    interpretSubtitle: 'Speak freely of what visited you in the night',
    labelDream:        'Your Dream',
    placeholderDream:  'Describe the dream — its figures, landscapes, feelings, colours, the strange logic of its world…',
    labelLens:         'Interpretation Lens',
    lensJungian:       'Jungian',
    lensJungianDesc:   'Shadow & archetype',
    lensFreudian:      'Freudian',
    lensFreudianDesc:  'Desire & repression',
    lensSpiritual:     'Spiritual',
    lensSpiritualDesc: 'Soul & mythos',
    lensPractical:     'Practical',
    lensPracticalDesc: 'Mind & waking life',
    btnInterpret:      '✦ Interpret',
    btnClear:          'Clear',
    resultLabel:       '✦ Interpretation',
    symbolsLabel:      'Symbols Identified',
    errorInterpret:    'The visions could not be deciphered. Please try again.',

    // Loading messages
    loading: [
      'Nous is gazing into the symbolic realm…',
      'Tracing the threads of your unconscious mind…',
      'Reading the ancient language of visions…',
      'The symbols are slowly taking form…',
      'Consulting the archive of the collective unconscious…',
    ],

    // Calendar view
    calendarTitle:    'Dream Calendar',
    calendarSubtitle: 'Navigate the nights you have recorded',
    detailEmpty:      'Select a highlighted date to read its dream',
    btnPrev:          '‹',
    btnNext:          '›',
    dowLabels:        ['Su','Mo','Tu','We','Th','Fr','Sa'],
    lensTag:          'Lens',

    // Journal view
    journalTitle:    'Dream Journal',
    journalSubtitle: 'Your archive of interpreted visions',
    journalLoading:  'Loading your dreams…',
    journalEmpty:    'No dreams have been recorded yet.<br>Interpret your first dream to begin the journal.',
    journalError:    'Could not load your journal.',
  },

  de: {
    langLabel: 'Sprache',
    tagline:        'Das Orakel der inneren Visionen',
    tabEnter:       'Eintreten',
    tabBegin:       'Beginnen',
    labelName:      'Dein Name',
    labelEmail:     'E-Mail',
    labelPassword:  'Passwort',
    labelNewPass:   'Neues Passwort',
    placeholderName:     'Wie soll Nous dich ansprechen?',
    placeholderEmail:    'deine@email.de',
    placeholderPassword: '········',
    placeholderNewPass:  'Passwort erstellen (min. 6 Zeichen)',
    btnEnter:       '✦ Das Orakel betreten',
    btnAwaken:      '✦ Das Orakel erwecken',
    msgFillFields:  'Bitte alle Felder ausfüllen.',
    msgCreated:     'Konto erstellt. Du kannst jetzt eintreten.',
    msgCredentials: 'Bitte gib deine Zugangsdaten ein.',
    navInterpret: 'Deuten',
    navCalendar:  'Kalender',
    navJournal:   'Tagebuch',
    btnLeave:     'Verlassen',
    interpretTitle:    'Einen Traum deuten',
    interpretSubtitle: 'Sprich frei über das, was dich in der Nacht besucht hat',
    labelDream:        'Dein Traum',
    placeholderDream:  'Beschreibe den Traum — seine Gestalten, Landschaften, Gefühle, Farben, die seltsame Logik seiner Welt…',
    labelLens:         'Deutungslinse',
    lensJungian:       'Jungianisch',
    lensJungianDesc:   'Schatten & Archetyp',
    lensFreudian:      'Freudianisch',
    lensFreudianDesc:  'Begehren & Verdrängung',
    lensSpiritual:     'Spirituell',
    lensSpiritualDesc: 'Seele & Mythos',
    lensPractical:     'Praktisch',
    lensPracticalDesc: 'Geist & Wachleben',
    btnInterpret:      '✦ Deuten',
    btnClear:          'Löschen',
    resultLabel:       '✦ Deutung',
    symbolsLabel:      'Erkannte Symbole',
    errorInterpret:    'Die Visionen konnten nicht gedeutet werden. Bitte erneut versuchen.',
    loading: [
      'Nous blickt in das symbolische Reich…',
      'Die Fäden deines Unbewussten werden verfolgt…',
      'Die alte Sprache der Visionen wird gelesen…',
      'Die Symbole nehmen langsam Form an…',
      'Das Archiv des kollektiven Unbewussten wird befragt…',
    ],
    calendarTitle:    'Traumkalender',
    calendarSubtitle: 'Navigiere durch die aufgezeichneten Nächte',
    detailEmpty:      'Wähle ein markiertes Datum, um den Traum zu lesen',
    btnPrev: '‹', btnNext: '›',
    dowLabels: ['So','Mo','Di','Mi','Do','Fr','Sa'],
    lensTag: 'Linse',
    journalTitle:    'Traumtagebuch',
    journalSubtitle: 'Dein Archiv gedeuteter Visionen',
    journalLoading:  'Träume werden geladen…',
    journalEmpty:    'Noch keine Träume aufgezeichnet.<br>Deute deinen ersten Traum, um das Tagebuch zu beginnen.',
    journalError:    'Das Tagebuch konnte nicht geladen werden.',
  },

  fr: {
    langLabel: 'Langue',
    tagline:        'L\'oracle des visions intérieures',
    tabEnter:       'Entrer',
    tabBegin:       'Commencer',
    labelName:      'Votre nom',
    labelEmail:     'E-mail',
    labelPassword:  'Mot de passe',
    labelNewPass:   'Nouveau mot de passe',
    placeholderName:     'Comment Nous doit-il vous appeler ?',
    placeholderEmail:    'votre@email.fr',
    placeholderPassword: '········',
    placeholderNewPass:  'Créer un mot de passe (min. 6 caractères)',
    btnEnter:       '✦ Entrer dans l\'Oracle',
    btnAwaken:      '✦ Éveiller l\'Oracle',
    msgFillFields:  'Veuillez remplir tous les champs.',
    msgCreated:     'Compte créé. Vous pouvez maintenant entrer.',
    msgCredentials: 'Veuillez entrer vos identifiants.',
    navInterpret: 'Interpréter',
    navCalendar:  'Calendrier',
    navJournal:   'Journal',
    btnLeave:     'Partir',
    interpretTitle:    'Interpréter un rêve',
    interpretSubtitle: 'Parlez librement de ce qui vous a visité dans la nuit',
    labelDream:        'Votre rêve',
    placeholderDream:  'Décrivez le rêve — ses figures, paysages, émotions, couleurs, la logique étrange de son monde…',
    labelLens:         'Prisme d\'interprétation',
    lensJungian:       'Jungien',
    lensJungianDesc:   'Ombre & archétype',
    lensFreudian:      'Freudien',
    lensFreudianDesc:  'Désir & répression',
    lensSpiritual:     'Spirituel',
    lensSpiritualDesc: 'Âme & mythos',
    lensPractical:     'Pratique',
    lensPracticalDesc: 'Esprit & vie éveillée',
    btnInterpret:      '✦ Interpréter',
    btnClear:          'Effacer',
    resultLabel:       '✦ Interprétation',
    symbolsLabel:      'Symboles identifiés',
    errorInterpret:    'Les visions n\'ont pas pu être déchiffrées. Veuillez réessayer.',
    loading: [
      'Nous contemple le royaume symbolique…',
      'Les fils de votre inconscient sont tracés…',
      'Le langage ancien des visions est lu…',
      'Les symboles prennent lentement forme…',
      'Les archives de l\'inconscient collectif sont consultées…',
    ],
    calendarTitle:    'Calendrier des rêves',
    calendarSubtitle: 'Naviguez dans les nuits que vous avez enregistrées',
    detailEmpty:      'Sélectionnez une date mise en évidence pour lire son rêve',
    btnPrev: '‹', btnNext: '›',
    dowLabels: ['Di','Lu','Ma','Me','Je','Ve','Sa'],
    lensTag: 'Prisme',
    journalTitle:    'Journal des rêves',
    journalSubtitle: 'Votre archive de visions interprétées',
    journalLoading:  'Chargement de vos rêves…',
    journalEmpty:    'Aucun rêve enregistré pour l\'instant.<br>Interprétez votre premier rêve pour commencer le journal.',
    journalError:    'Le journal n\'a pas pu être chargé.',
  },

  it: {
    langLabel: 'Lingua',
    tagline:        'L\'oracolo delle visioni interiori',
    tabEnter:       'Entra',
    tabBegin:       'Inizia',
    labelName:      'Il tuo nome',
    labelEmail:     'E-mail',
    labelPassword:  'Password',
    labelNewPass:   'Nuova password',
    placeholderName:     'Come dovrebbe chiamarti Nous?',
    placeholderEmail:    'tua@email.it',
    placeholderPassword: '········',
    placeholderNewPass:  'Crea una password (min. 6 caratteri)',
    btnEnter:       '✦ Entra nell\'Oracolo',
    btnAwaken:      '✦ Risveglia l\'Oracolo',
    msgFillFields:  'Per favore compila tutti i campi.',
    msgCreated:     'Account creato. Puoi ora entrare.',
    msgCredentials: 'Per favore inserisci le tue credenziali.',
    navInterpret: 'Interpreta',
    navCalendar:  'Calendario',
    navJournal:   'Diario',
    btnLeave:     'Esci',
    interpretTitle:    'Interpreta un sogno',
    interpretSubtitle: 'Parla liberamente di ciò che ti ha visitato nella notte',
    labelDream:        'Il tuo sogno',
    placeholderDream:  'Descrivi il sogno — le sue figure, paesaggi, emozioni, colori, la logica strana del suo mondo…',
    labelLens:         'Lente di interpretazione',
    lensJungian:       'Junghiana',
    lensJungianDesc:   'Ombra & archetipo',
    lensFreudian:      'Freudiana',
    lensFreudianDesc:  'Desiderio & repressione',
    lensSpiritual:     'Spirituale',
    lensSpiritualDesc: 'Anima & mito',
    lensPractical:     'Pratica',
    lensPracticalDesc: 'Mente & vita quotidiana',
    btnInterpret:      '✦ Interpreta',
    btnClear:          'Cancella',
    resultLabel:       '✦ Interpretazione',
    symbolsLabel:      'Simboli identificati',
    errorInterpret:    'Le visioni non hanno potuto essere decifrate. Per favore riprova.',
    loading: [
      'Nous sta guardando nel regno simbolico…',
      'Tracciando i fili della tua mente inconscia…',
      'Leggendo l\'antico linguaggio delle visioni…',
      'I simboli stanno lentamente prendendo forma…',
      'Consultando l\'archivio dell\'inconscio collettivo…',
    ],
    calendarTitle:    'Calendario dei sogni',
    calendarSubtitle: 'Naviga le notti che hai registrato',
    detailEmpty:      'Seleziona una data evidenziata per leggere il suo sogno',
    btnPrev: '‹', btnNext: '›',
    dowLabels: ['Do','Lu','Ma','Me','Gi','Ve','Sa'],
    lensTag: 'Lente',
    journalTitle:    'Diario dei sogni',
    journalSubtitle: 'Il tuo archivio di visioni interpretate',
    journalLoading:  'Caricamento dei tuoi sogni…',
    journalEmpty:    'Nessun sogno registrato ancora.<br>Interpreta il tuo primo sogno per iniziare il diario.',
    journalError:    'Il diario non ha potuto essere caricato.',
  },

  ro: {
    langLabel: 'Limbă',
    tagline:        'Oracolul viziunilor interioare',
    tabEnter:       'Intră',
    tabBegin:       'Începe',
    labelName:      'Numele tău',
    labelEmail:     'E-mail',
    labelPassword:  'Parolă',
    labelNewPass:   'Parolă nouă',
    placeholderName:     'Cum ar trebui să te numească Nous?',
    placeholderEmail:    'al_tau@email.ro',
    placeholderPassword: '········',
    placeholderNewPass:  'Creează o parolă (min. 6 caractere)',
    btnEnter:       '✦ Intră în Oracle',
    btnAwaken:      '✦ Trezește Oracolul',
    msgFillFields:  'Te rugăm să completezi toate câmpurile.',
    msgCreated:     'Cont creat. Poți intra acum.',
    msgCredentials: 'Te rugăm să introduci credențialele.',
    navInterpret: 'Interpretează',
    navCalendar:  'Calendar',
    navJournal:   'Jurnal',
    btnLeave:     'Ieși',
    interpretTitle:    'Interpretează un vis',
    interpretSubtitle: 'Vorbește liber despre ce te-a vizitat în noapte',
    labelDream:        'Visul tău',
    placeholderDream:  'Descrie visul — figurile, peisajele, emoțiile, culorile, logica stranie a lumii sale…',
    labelLens:         'Lentilă de interpretare',
    lensJungian:       'Jungiană',
    lensJungianDesc:   'Umbră & arhetip',
    lensFreudian:      'Freudiană',
    lensFreudianDesc:  'Dorință & represie',
    lensSpiritual:     'Spirituală',
    lensSpiritualDesc: 'Suflet & mit',
    lensPractical:     'Practică',
    lensPracticalDesc: 'Minte & viața reală',
    btnInterpret:      '✦ Interpretează',
    btnClear:          'Șterge',
    resultLabel:       '✦ Interpretare',
    symbolsLabel:      'Simboluri identificate',
    errorInterpret:    'Viziunile nu au putut fi descifrate. Te rugăm să încerci din nou.',
    loading: [
      'Nous privește în tărâmul simbolic…',
      'Urmărind firele minții tale inconștiente…',
      'Citind limbajul antic al viziunilor…',
      'Simbolurile prind încet formă…',
      'Consultând arhiva inconștientului colectiv…',
    ],
    calendarTitle:    'Calendarul viselor',
    calendarSubtitle: 'Navighează prin nopțile pe care le-ai înregistrat',
    detailEmpty:      'Selectează o dată evidențiată pentru a citi visul',
    btnPrev: '‹', btnNext: '›',
    dowLabels: ['Du','Lu','Ma','Mi','Jo','Vi','Sâ'],
    lensTag: 'Lentilă',
    journalTitle:    'Jurnalul viselor',
    journalSubtitle: 'Arhiva ta de viziuni interpretate',
    journalLoading:  'Se încarcă visele tale…',
    journalEmpty:    'Niciun vis nu a fost înregistrat încă.<br>Interpretează primul tău vis pentru a începe jurnalul.',
    journalError:    'Jurnalul nu a putut fi încărcat.',
  },

  zh: {
    langLabel: '语言',
    tagline:        '内心异象的神谕',
    tabEnter:       '登录',
    tabBegin:       '注册',
    labelName:      '您的姓名',
    labelEmail:     '电子邮件',
    labelPassword:  '密码',
    labelNewPass:   '新密码',
    placeholderName:     'Nous 应如何称呼您？',
    placeholderEmail:    '您的@邮箱.com',
    placeholderPassword: '········',
    placeholderNewPass:  '创建密码（至少6个字符）',
    btnEnter:       '✦ 进入神谕',
    btnAwaken:      '✦ 唤醒神谕',
    msgFillFields:  '请填写所有字段。',
    msgCreated:     '账户已创建，您现在可以登录。',
    msgCredentials: '请输入您的凭据。',
    navInterpret: '解梦',
    navCalendar:  '日历',
    navJournal:   '日志',
    btnLeave:     '退出',
    interpretTitle:    '解读梦境',
    interpretSubtitle: '自由讲述夜晚造访您的一切',
    labelDream:        '您的梦境',
    placeholderDream:  '描述梦境——其中的人物、风景、情感、色彩，以及梦境世界的奇异逻辑……',
    labelLens:         '解读视角',
    lensJungian:       '荣格',
    lensJungianDesc:   '阴影与原型',
    lensFreudian:      '弗洛伊德',
    lensFreudianDesc:  '欲望与压抑',
    lensSpiritual:     '灵性',
    lensSpiritualDesc: '灵魂与神话',
    lensPractical:     '实用',
    lensPracticalDesc: '心理与现实',
    btnInterpret:      '✦ 解读',
    btnClear:          '清除',
    resultLabel:       '✦ 解读结果',
    symbolsLabel:      '识别的符号',
    errorInterpret:    '无法解读异象，请重试。',
    loading: [
      'Nous 正在凝视象征领域……',
      '追寻您无意识思维的线索……',
      '解读异象的古老语言……',
      '符号正在缓缓成形……',
      '查阅集体无意识档案……',
    ],
    calendarTitle:    '梦境日历',
    calendarSubtitle: '浏览您记录的夜晚',
    detailEmpty:      '选择高亮日期以读取梦境',
    btnPrev: '‹', btnNext: '›',
    dowLabels: ['日','一','二','三','四','五','六'],
    lensTag: '视角',
    journalTitle:    '梦境日志',
    journalSubtitle: '您的解读异象档案',
    journalLoading:  '正在加载您的梦境……',
    journalEmpty:    '尚未记录任何梦境。<br>解读您的第一个梦境以开始日志。',
    journalError:    '无法加载日志。',
  },

  ja: {
    langLabel: '言語',
    tagline:        '内なるビジョンの神託',
    tabEnter:       'ログイン',
    tabBegin:       '登録',
    labelName:      'お名前',
    labelEmail:     'メールアドレス',
    labelPassword:  'パスワード',
    labelNewPass:   '新しいパスワード',
    placeholderName:     'Nous はあなたをどう呼びますか？',
    placeholderEmail:    'your@email.jp',
    placeholderPassword: '········',
    placeholderNewPass:  'パスワードを作成（最低6文字）',
    btnEnter:       '✦ 神託に入る',
    btnAwaken:      '✦ 神託を目覚めさせる',
    msgFillFields:  'すべての項目を入力してください。',
    msgCreated:     'アカウントが作成されました。ログインできます。',
    msgCredentials: '認証情報を入力してください。',
    navInterpret: '解釈',
    navCalendar:  'カレンダー',
    navJournal:   '日記',
    btnLeave:     '退出',
    interpretTitle:    '夢を解釈する',
    interpretSubtitle: '夜にあなたを訪れたものについて自由に話してください',
    labelDream:        'あなたの夢',
    placeholderDream:  '夢を描写してください——その人物、風景、感情、色、世界の奇妙な論理……',
    labelLens:         '解釈のレンズ',
    lensJungian:       'ユング派',
    lensJungianDesc:   '影とアーキタイプ',
    lensFreudian:      'フロイト派',
    lensFreudianDesc:  '欲望と抑圧',
    lensSpiritual:     'スピリチュアル',
    lensSpiritualDesc: '魂と神話',
    lensPractical:     '実践的',
    lensPracticalDesc: '心と日常生活',
    btnInterpret:      '✦ 解釈する',
    btnClear:          'クリア',
    resultLabel:       '✦ 解釈',
    symbolsLabel:      '特定されたシンボル',
    errorInterpret:    'ビジョンを解読できませんでした。もう一度お試しください。',
    loading: [
      'Nous はシンボルの領域を見つめています……',
      'あなたの無意識の糸をたどっています……',
      'ビジョンの古代言語を読み解いています……',
      'シンボルがゆっくりと形を成しています……',
      '集合的無意識のアーカイブを参照しています……',
    ],
    calendarTitle:    '夢のカレンダー',
    calendarSubtitle: '記録した夜を巡る',
    detailEmpty:      'ハイライトされた日付を選択して夢を読む',
    btnPrev: '‹', btnNext: '›',
    dowLabels: ['日','月','火','水','木','金','土'],
    lensTag: 'レンズ',
    journalTitle:    '夢の日記',
    journalSubtitle: '解釈されたビジョンのアーカイブ',
    journalLoading:  '夢を読み込んでいます……',
    journalEmpty:    'まだ夢が記録されていません。<br>最初の夢を解釈して日記を始めましょう。',
    journalError:    '日記を読み込めませんでした。',
  },
};

// Language locale codes for date formatting
const LOCALE_CODES = {
  en: 'en-US', de: 'de-DE', fr: 'fr-FR',
  it: 'it-IT', ro: 'ro-RO', zh: 'zh-CN', ja: 'ja-JP',
};

// ─── STARE LIMBA ───────────────────────────────────────────────────────
let currentLang = localStorage.getItem('nous_lang') || 'en';

function t(key) {
  return TRANSLATIONS[currentLang]?.[key] ?? TRANSLATIONS.en[key] ?? key;
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('nous_lang', lang);
  applyTranslations();
}

function applyTranslations() {
  const T = TRANSLATIONS[currentLang];

  // Helper to safely set text on an element
  const setText  = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  const setHTML  = (id, val) => { const el = document.getElementById(id); if (el) el.innerHTML   = val; };
  const setPlaceholder = (id, val) => { const el = document.getElementById(id); if (el) el.placeholder = val; };
  const setAttr  = (id, attr, val) => { const el = document.getElementById(id); if (el) el.setAttribute(attr, val); };

  // Auth screen
  setText('authTagline',       T.tagline);
  setText('tabLogin',          T.tabEnter);
  setText('tabSignup',         T.tabBegin);
  setText('labelSignupName',   T.labelName);
  setText('labelLoginEmail',   T.labelEmail);
  setText('labelSignupEmail',  T.labelEmail);
  setText('labelLoginPassword',T.labelPassword);
  setText('labelSignupPassword',T.labelNewPass);
  setPlaceholder('signupName',     T.placeholderName);
  setPlaceholder('loginEmail',     T.placeholderEmail);
  setPlaceholder('signupEmail',    T.placeholderEmail);
  setPlaceholder('loginPassword',  T.placeholderPassword);
  setPlaceholder('signupPassword', T.placeholderNewPass);
  setText('btnLogin',          T.btnEnter);
  setText('btnSignup',         T.btnAwaken);

  // Topbar
  setText('navInterpret',  T.navInterpret);
  setText('navCalendar',   T.navCalendar);
  setText('navJournal',    T.navJournal);
  setText('btnLogout',     T.btnLeave);

  // Interpret view
  setText('interpretTitle',    T.interpretTitle);
  setText('interpretSubtitle', T.interpretSubtitle);
  setText('labelDream',        T.labelDream);
  setPlaceholder('dreamInput', T.placeholderDream);
  setText('labelLens',         T.labelLens);
  setText('lensNameJungian',   T.lensJungian);
  setText('lensDescJungian',   T.lensJungianDesc);
  setText('lensNameFreudian',  T.lensFreudian);
  setText('lensDescFreudian',  T.lensFreudianDesc);
  setText('lensNameSpiritual', T.lensSpiritual);
  setText('lensDescSpiritual', T.lensSpiritualDesc);
  setText('lensNamePractical', T.lensPractical);
  setText('lensDescPractical', T.lensPracticalDesc);
  setText('btnInterpret',      T.btnInterpret);
  setText('btnClear',          T.btnClear);
  setText('resultLabelText',   T.resultLabel);
  setText('symbolsLabelText',  T.symbolsLabel);

  // Calendar view
  setText('calendarTitle',    T.calendarTitle);
  setText('calendarSubtitle', T.calendarSubtitle);
  setText('detailEmptyText',  T.detailEmpty);

  // Journal view
  setText('journalTitle',    T.journalTitle);
  setText('journalSubtitle', T.journalSubtitle);

  // Update language selector highlight
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === currentLang);
  });

  // Re-render calendar day-of-week headers if calendar is active
  const calGrid = document.getElementById('calGrid');
  if (calGrid && calGrid.children.length > 0) renderCalendar();
}

// ─── STELE ────────────────────────────────────────────────────────────────
(function () {
  const el = document.getElementById('starField');
  if (!el) return;
  for (let i = 0; i < 130; i++) {
    const s    = document.createElement('div');
    s.className = 'star';
    const size  = Math.random() * 2.5 + 0.4;
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

// ─── HELPERI TOKEN ────────────────────────────────────────────────────────
function getToken()  { return localStorage.getItem('nous_token'); }
function setToken(v) { localStorage.setItem('nous_token', v); }
function removeToken() { localStorage.removeItem('nous_token'); }
function getUser()   { return JSON.parse(localStorage.getItem('nous_user') || 'null'); }
function setUser(u)  { localStorage.setItem('nous_user', JSON.stringify(u)); }
function removeUser() { localStorage.removeItem('nous_user'); }

// ─── HELPER API ─────────────────────────────────────────────────────────────
async function api(method, path, body = null) {
  const headers = { 'Content-Type': 'application/json' };
  const token   = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const opts = { method, headers };
  if (body)  opts.body = JSON.stringify(body);

  const res  = await fetch(`${API_BASE}${path}`, opts);
  const data = await res.json();

  if (!res.ok) throw new Error(data.error || 'Something went wrong.');
  return data;
}

// ─── AUTENTIFICARE ─────────────────────────────────────────────────────────────────
function switchTab(tab) {
  document.getElementById('loginForm').style.display  = tab === 'login'  ? '' : 'none';
  document.getElementById('signupForm').style.display = tab === 'signup' ? '' : 'none';
  document.getElementById('tabLogin').classList.toggle('active',  tab === 'login');
  document.getElementById('tabSignup').classList.toggle('active', tab === 'signup');
  ['loginMsg', 'signupMsg'].forEach(id => {
    const el = document.getElementById(id);
    el.textContent = '';
    el.className   = 'auth-message';
  });
}

function showAuthMsg(id, text, type) {
  const el = document.getElementById(id);
  el.textContent = text;
  el.className   = 'auth-message ' + type;
}

async function signup() {
  const name     = document.getElementById('signupName').value.trim();
  const email    = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;

  if (!name || !email || !password) {
    return showAuthMsg('signupMsg', t('msgFillFields'), 'error');
  }

  const btn = document.getElementById('btnSignup');
  btn.disabled = true;
  try {
    await api('POST', '/auth/signup', { name, email, password });
    showAuthMsg('signupMsg', t('msgCreated'), 'success');
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
    return showAuthMsg('loginMsg', t('msgCredentials'), 'error');
  }

  const btn = document.getElementById('btnLogin');
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

// ─── BOOT ─────────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', async () => {
  // Apply saved language immediately
  applyTranslations();

  const token = getToken();
  const user  = getUser();

  if (token && user) {
    try {
      const data = await api('GET', '/auth/me');
      setUser(data.user);
      enterApp(data.user);
      return;
    } catch {
      removeToken();
      removeUser();
    }
  }

  document.getElementById('authScreen').style.display = 'flex';
});

// ─── VIZUALIZARI ────────────────────────────────────────────────────────────────
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

// ─── LENTILA ─────────────────────────────────────────────────────────────────
let activeLens = 'jungian';

function getLensLabel(lens) {
  const map = {
    jungian:   t('lensJungian'),
    freudian:  t('lensFreudian'),
    spiritual: t('lensSpiritual'),
    practical: t('lensPractical'),
  };
  return map[lens] || lens;
}

function selectLens(btn) {
  document.querySelectorAll('.lens-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeLens = btn.dataset.lens;
}

// ─── INTERPRETEAZA ────────────────────────────────────────────────────────────
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

  const msgs = t('loading');
  let mi = 0;
  loadMsg.textContent = msgs[0];
  loadInterval = setInterval(() => {
    mi = (mi + 1) % msgs.length;
    loadMsg.textContent = msgs[mi];
  }, 2800);

  try {
    const data  = await api('POST', '/dreams/interpret', { dream, lens: activeLens });
    clearInterval(loadInterval);
    loading.classList.remove('active');

    const entry = data.dream;
    document.getElementById('interpretationText').textContent = entry.interpretation;
    document.getElementById('resultLensBadge').textContent    = getLensLabel(activeLens) + ' ' + t('lensTag');

    const grid = document.getElementById('symbolsGrid');
    grid.innerHTML = '';
    (entry.symbols || []).forEach(s => {
      const tag = document.createElement('div');
      tag.className   = 'symbol-tag';
      tag.textContent = s;
      grid.appendChild(tag);
    });

    result.classList.add('active');

  } catch (err) {
    clearInterval(loadInterval);
    loading.classList.remove('active');
    error.textContent = err.message || t('errorInterpret');
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
  const year   = calendarMonth.getFullYear();
  const month  = calendarMonth.getMonth() + 1;
  const today  = new Date();
  const locale = LOCALE_CODES[currentLang] || 'en-US';

  document.getElementById('calTitle').textContent =
    new Date(year, month - 1).toLocaleDateString(locale, { month: 'long', year: 'numeric' }).toUpperCase();

  const grid = document.getElementById('calGrid');
  grid.innerHTML = '';

  // Day-of-week headers in current language
  t('dowLabels').forEach(d => {
    const el = document.createElement('div');
    el.className   = 'cal-dow';
    el.textContent = d;
    grid.appendChild(el);
  });

  // Fetch this month's dreams
  let dreamMap = {};
  try {
    const data = await api('GET', `/dreams/calendar?year=${year}&month=${month}`);
    dreamMap   = data.calendar || {};
  } catch (err) {
    console.error('Could not load calendar data:', err.message);
  }

  const firstDay    = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const daysInPrev  = new Date(year, month - 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const el = document.createElement('div');
    el.className   = 'cal-day other-month';
    el.textContent = daysInPrev - firstDay + i + 1;
    grid.appendChild(el);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const el      = document.createElement('div');
    el.className  = 'cal-day';
    const dateKey = `${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const isToday = today.getFullYear() === year && today.getMonth() === month - 1 && today.getDate() === d;

    if (isToday) el.classList.add('today');

    const entries = dreamMap[dateKey];
    if (entries && entries.length > 0) {
      el.classList.add('has-dream');
      const dot = document.createElement('div');
      dot.className = 'dream-dot';
      el.appendChild(dot);
      el.onclick = () => showDreamDetail(entries[0], el);
    }

    const num = document.createElement('span');
    num.textContent = d;
    el.insertBefore(num, el.firstChild);
    grid.appendChild(el);
  }

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

  const locale  = LOCALE_CODES[currentLang] || 'en-US';
  const dateStr = new Date(entry.createdAt).toLocaleDateString(locale, {
    month: 'long', day: 'numeric', year: 'numeric',
  });

  document.getElementById('detailDate').textContent      = dateStr.toUpperCase();
  document.getElementById('detailDreamText').textContent = '"' + entry.dream + '"';
  document.getElementById('detailLensTag').textContent   = getLensLabel(entry.lens) + ' ' + t('lensTag');
  document.getElementById('detailInterp').textContent    = entry.interpretation;

  const syms = document.getElementById('detailSymbols');
  syms.innerHTML = '';
  (entry.symbols || []).forEach(s => {
    const tag = document.createElement('div');
    tag.className   = 'detail-sym';
    tag.textContent = s;
    syms.appendChild(tag);
  });
}

// ─── JURNAL ──────────────────────────────────────────────────────────────
async function renderJournal() {
  const locale    = LOCALE_CODES[currentLang] || 'en-US';
  const container = document.getElementById('journalList');
  container.innerHTML = `<div class="empty-state"><div class="empty-icon">☽</div><p>${t('journalLoading')}</p></div>`;

  try {
    const data   = await api('GET', '/dreams?limit=50');
    const dreams = data.dreams || [];
    container.innerHTML = '';

    if (!dreams.length) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">☽</div>
          <p>${t('journalEmpty')}</p>
        </div>`;
      return;
    }

    const list = document.createElement('div');
    list.className = 'journal-list';

    dreams.forEach(entry => {
      const el      = document.createElement('div');
      el.className  = 'journal-entry fade-in';
      const dateStr = new Date(entry.createdAt).toLocaleDateString(locale, {
        month: 'long', day: 'numeric', year: 'numeric',
      });

      el.innerHTML = `
        <div class="journal-dream">"${entry.dream}"</div>
        <div class="journal-meta">
          <div class="journal-date">${dateStr}</div>
          <div class="journal-lens">${getLensLabel(entry.lens)}</div>
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
        <p>${t('journalError')}<br>${err.message}</p>
      </div>`;
  }
}

function loadEntry(entry) {
  showView('interpret');
  document.getElementById('dreamInput').value               = entry.dream;
  document.getElementById('interpretationText').textContent = entry.interpretation;
  document.getElementById('resultLensBadge').textContent    = getLensLabel(entry.lens) + ' ' + t('lensTag');

  const grid = document.getElementById('symbolsGrid');
  grid.innerHTML = '';
  (entry.symbols || []).forEach(s => {
    const tag = document.createElement('div');
    tag.className   = 'symbol-tag';
    tag.textContent = s;
    grid.appendChild(tag);
  });

  document.getElementById('resultCard').classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─── SCURTATURI DE LA TASTATURA ───────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    if (document.activeElement.id === 'loginPassword')  login();
    if (document.activeElement.id === 'signupPassword') signup();
  }
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && document.activeElement.id === 'dreamInput') {
    interpretDream();
  }
});