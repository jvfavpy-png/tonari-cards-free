
"use strict";

/*
  =====================================================
  Tonari Cards Free v1.0.4 / UI based on v2.1.0
  =====================================================

  対応CSV：
  旧形式：カテゴリ,質問
  v1.1：ID,カテゴリ,危険度,質問,メモ
  v1.2：ID,カード種別,カテゴリ,危険度,攻め度,質問,メモ

  v1.2で使う列：
  ID / カード種別 / カテゴリ / 危険度 / 攻め度 / 質問
  メモ列は管理用。画面には出さない。
*/

const CSV_FILE_NAME = "questions_free_30.csv";
const IS_FREE_VERSION = true;
const ADULT_CATEGORY = "大人のムード";
const ATTACK_CATEGORIES = ["攻めミッション", "大人ミッション"];
const RECENT_HISTORY_LIMIT = 20;

const FREE_CSV_TEXT = String.raw`ID,カード種別,カテゴリ,危険度,攻め度,質問,メモ
Q001,質問,もしも,日中向け,soft,明日から1週間だけ仕事も予定も全部なくなったら\nまず何をする？,無料版
Q002,質問,もしも,日中向け,soft,宝くじで3億円当たったら\n誰にも言わずに最初に買うものは？,無料版
Q004,質問,もしも,日中向け,soft,これから一生タダになるなら\n外食・旅行・服・家電のどれがいい？,無料版
Q007,質問,もしも,日中向け,soft,相手と中身が1日入れ替わったら\nまず何を確認する？,無料版
Q031,質問,究極の二択,夜向け,NORMAL,一生ラーメン禁止か一生寿司禁止なら\nどっちがきつい？,無料版
Q034,質問,究極の二択,夜向け,NORMAL,一生旅行に行けない代わりに豪邸か\n家は普通だけど毎月旅行なら\nどっちがいい？,無料版
Q035,質問,究極の二択,夜向け,NORMAL,どれだけ食べても太らない体か\n毎日8時間ぐっすり眠れる体なら\nどっちがほしい？,無料版
Q040,質問,究極の二択,深夜向け,NORMAL,喧嘩してもすぐ仲直りする関係か\n喧嘩は少ないけど本音も少ない関係なら\nどっちがいい？,無料版
Q061,質問,暴露,深夜向け,NORMAL,今だから言える\n初対面のときの正直な印象は？,無料版
Q065,質問,暴露,夜向け,NORMAL,相手に言われて実はけっこう嬉しかった一言は？,無料版
Q067,質問,暴露,深夜向け,NORMAL,付き合う前\n相手のどこを一番見ていた？,無料版
Q091,質問,黒歴史と学生時代,夜向け,NORMAL,学生時代の自分にキャッチコピーをつけるなら何にする？,無料版
Q092,質問,黒歴史と学生時代,夜向け,NORMAL,今思うと一番痛かったファッションは？,無料版
Q096,質問,黒歴史と学生時代,夜向け,NORMAL,修学旅行や遠足で一番覚えている事件は？,無料版
Q121,質問,恋愛の本音,夜向け,NORMAL,付き合う前に一番ドキッとした瞬間は？,無料版
Q122,質問,恋愛の本音,夜向け,NORMAL,相手のどんな仕草を見ると\n今でもいいなと思う？,無料版
Q123,質問,恋愛の本音,夜向け,NORMAL,「好き」って言葉で言われるのと行動で示されるの\nどっちが刺さる？,無料版
Q124,質問,恋愛の本音,夜向け,NORMAL,恋人にされると一番安心することは？,無料版
Q130,質問,恋愛の本音,夜向け,NORMAL,デートで一番大事なのは場所・会話・雰囲気のどれ？,無料版
Q211,質問,デートと旅行,日中向け,soft,今すぐ行けるなら\n日帰りでどこに行きたい？,無料版
Q212,質問,デートと旅行,日中向け,soft,旅行で一番テンションが上がる瞬間は？,無料版
Q216,質問,デートと旅行,日中向け,soft,温泉旅行で一番楽しみにすることは？,無料版
Q217,質問,デートと旅行,日中向け,soft,旅行中に相手のどんな行動を見ると嬉しい？,無料版
Q272,質問,推しとランキング,日中向け,soft,相手の好きなところランキングを作るなら\n1位は？,無料版
Q273,質問,推しとランキング,日中向け,soft,今まで行った場所で楽しかったランキング1位は？,無料版
Q331,質問,相手当てクイズ,日中向け,soft,相手が今一番食べたいもの\n何だと思う？,無料版
M003,ミッション,恋愛の本音,夜向け,NORMAL,相手の好きなところを3つ言う,無料版
M028,ミッション,恋愛の本音,夜向け,NORMAL,相手の好きなところを\n外見以外で3つ言う,無料版
M034,ミッション,デートと旅行,日中向け,soft,今日の相手を一言で褒める,無料版
M035,ミッション,デートと旅行,日中向け,soft,次のカードまで\nスマホを置く,無料版`;


const STORAGE_KEY_PREFIX = IS_FREE_VERSION ? "tonariCardsFree" : "coupleCards";

const STORAGE_KEYS = {
  categoryEnabled: `${STORAGE_KEY_PREFIX}.categoryEnabled.v2`,
  favorites: `${STORAGE_KEY_PREFIX}.favorites.v2`,
  hidden: `${STORAGE_KEY_PREFIX}.hidden.v2`,
  adultMode: `${STORAGE_KEY_PREFIX}.adultMode.v2`,
  attackMode: `${STORAGE_KEY_PREFIX}.attackMode.v2`,
  cardType: `${STORAGE_KEY_PREFIX}.cardType.v2`
};

const CARD_TYPE = {
  QUESTION: "質問",
  MISSION: "ミッション"
};

const ATTACK_LEVEL = {
  SOFT: "soft",
  NORMAL: "NORMAL",
  HARD: "HARD",
  VERY_HARD: "veryHARD"
};

const CARD_TYPE_LABELS = {
  all: "Mix",
  questions: "Question",
  missions: "Mission"
};

const DANGER_META = {
  "軽め": { label: "日中向け", dangerClass: "danger-light" },
  "普通": { label: "夜向け", dangerClass: "danger-normal" },
  "危険": { label: "深夜向け", dangerClass: "danger-danger" },
  "深夜限定": { label: "明け方向け", dangerClass: "danger-night" },
  "日中向け": { label: "日中向け", dangerClass: "danger-light" },
  "夜向け": { label: "夜向け", dangerClass: "danger-normal" },
  "深夜向け": { label: "深夜向け", dangerClass: "danger-danger" },
  "明け方向け": { label: "明け方向け", dangerClass: "danger-night" }
};

const CATEGORY_META = {
  "もしも": { fallbackDanger: "軽め", description: "ゆるく話せる" },
  "デートと旅行": { fallbackDanger: "軽め", description: "次の行き先の話もできる" },
  "推しとランキング": { fallbackDanger: "軽め", description: "好きなものが見えてくる" },
  "相手当てクイズ": { fallbackDanger: "軽め", description: "どれだけ分かってるか試せる" },
  "究極の二択": { fallbackDanger: "普通", description: "選ぶだけで話が転がる" },
  "黒歴史と学生時代": { fallbackDanger: "普通", description: "昔の話でちょっと笑える" },
  "恋愛の本音": { fallbackDanger: "普通", description: "少し本音寄り" },
  "妄想とファンタジー": { fallbackDanger: "普通", description: "もしもの話でゆるく遊ぶ" },
  "暴露": { fallbackDanger: "危険", description: "少しだけ本音が出る" },
  "地雷と境界線": { fallbackDanger: "危険", description: "価値観が出るカード" },
  "SNSとスマホ": { fallbackDanger: "危険", description: "スマホまわりの価値観" },
  "大人のムード": { fallbackDanger: "深夜限定", description: "ふたりだけの空気で話す" },
  "大人ミッション": { fallbackDanger: "深夜限定", description: "ふたりで少し近づく" },
  "攻めミッション": { fallbackDanger: "深夜限定", description: "キス系も入る" }
};

const CATEGORY_DISPLAY_NAMES = {
  "大人のムード": "Adult Mood",
  "大人ミッション": "Mission",
  "攻めミッション": "Spice Mission"
};

function getCategoryLabel(category) {
  return CATEGORY_DISPLAY_NAMES[category] || category;
}

const PLAY_CONFIG = {
  temperature: {
    title: "温度で選ぶ",
    description: "今の空気で選ぶ。",
    modes: {
      light: {
        label: "日中用",
        description: "軽く話せるカード",
        categories: ["もしも", "デートと旅行", "推しとランキング", "相手当てクイズ"]
      },
      normal: {
        label: "夜用",
        description: "少し本音寄り",
        categories: ["究極の二択", "暴露", "黒歴史と学生時代", "恋愛の本音", "妄想とファンタジー"]
      },
      dangerous: {
        label: "深夜用",
        description: "価値観や秘密も少し",
        categories: ["地雷と境界線", "SNSとスマホ", "暴露", "大人のムード"]
      },
      midnight: {
        label: "明け方用",
        description: "深夜寄り",
        categories: ["大人のムード", "大人ミッション", "攻めミッション", "妄想とファンタジー", "恋愛の本音", "地雷と境界線"]
      }
    }
  },

  fate: {
    title: "運命に任せる",
    description: "テーマだけ決めて、あとはカード任せ。",
    modes: {
      landmine: {
        label: "地雷カード",
        description: "価値観が出るカード",
        categories: ["地雷と境界線", "SNSとスマホ"]
      },
      sweet: {
        label: "イチャイチャ",
        description: "ちょっと甘め",
        categories: ["恋愛の本音", "大人のムード", "大人ミッション", "デートと旅行"]
      },
      drink: {
        label: "酒が進む",
        description: "笑いながらテンポよく",
        categories: ["究極の二択", "もしも", "黒歴史と学生時代", "推しとランキング"]
      },
      secret: {
        label: "秘密暴露",
        description: "小さな秘密が出るかも",
        categories: ["暴露", "黒歴史と学生時代", "相手当てクイズ"]
      },
      blush: {
        label: "赤面カード",
        description: "少し照れるカード",
        categories: ["大人のムード", "大人ミッション", "攻めミッション", "恋愛の本音", "妄想とファンタジー"]
      }
    }
  },

  mood: {
    title: "気分で選ぶ",
    description: "今の気分で選ぶ。",
    modes: {
      laugh: {
        label: "笑いたい",
        description: "軽く笑いたいとき",
        categories: ["もしも", "究極の二択", "黒歴史と学生時代", "推しとランキング"]
      },
      closer: {
        label: "仲良くなりたい",
        description: "相手のことを少し知る",
        categories: ["恋愛の本音", "デートと旅行", "相手当てクイズ"]
      },
      dokidoki: {
        label: "ドキドキしたい",
        description: "甘めと妄想を少し",
        categories: ["妄想とファンタジー", "大人のムード", "大人ミッション", "恋愛の本音"]
      },
      drinking: {
        label: "飲みながら盛り上がりたい",
        description: "飲みながらちょうどいい",
        categories: ["暴露", "究極の二択", "黒歴史と学生時代", "地雷と境界線"]
      },
      attack: {
        label: "踏み込みたい",
        description: "少し踏み込む",
        categories: ["地雷と境界線", "大人のムード", "大人ミッション", "攻めミッション", "暴露", "SNSとスマホ"]
      }
    }
  }
};

const FREE_LOCKED_MODES = {
  temperature: new Set(["midnight"]),
  fate: new Set(["blush"]),
  mood: new Set(["attack"])
};

function isModeLockedInFreeVersion(playTypeKey, modeKey) {
  return IS_FREE_VERSION && Boolean(FREE_LOCKED_MODES[playTypeKey]?.has(modeKey));
}


const state = {
  allCards: [],
  cardsByCategory: new Map(),
  categoryEnabled: {},
  favorites: new Set(),
  hiddenCards: new Set(),

  adultMode: false,
  attackMode: false,
  cardType: "all",

  currentPlayTypeKey: null,
  currentModeKey: null,
  currentMode: null,
  currentDrawType: "candidate",
  currentCard: null,
  pendingHideCardId: null,
  hideConfirmTimer: null,

  recentCardIds: [],
  recentCategories: [],
  lastCardId: null,

  isBusy: false
};

const elements = {
  loadingScreen: document.getElementById("loadingScreen"),
  titleScreen: document.getElementById("titleScreen"),
  errorScreen: document.getElementById("errorScreen"),
  topScreen: document.getElementById("topScreen"),
  settingsScreen: document.getElementById("settingsScreen"),
  hiddenScreen: document.getElementById("hiddenScreen"),
  favoriteScreen: document.getElementById("favoriteScreen"),
  modeScreen: document.getElementById("modeScreen"),
  drawChoiceScreen: document.getElementById("drawChoiceScreen"),
  candidateScreen: document.getElementById("candidateScreen"),
  questionScreen: document.getElementById("questionScreen"),

  errorMessage: document.getElementById("errorMessage"),
  csvFileInput: document.getElementById("csvFileInput"),
  startButton: document.getElementById("startButton"),

  adultToggle: document.getElementById("adultToggle"),
  attackPanel: document.getElementById("attackPanel"),
  attackToggle: document.getElementById("attackToggle"),

  adultModal: document.getElementById("adultModal"),
  cancelAdultMode: document.getElementById("cancelAdultMode"),
  confirmAdultMode: document.getElementById("confirmAdultMode"),

  attackModal: document.getElementById("attackModal"),
  cancelAttackMode: document.getElementById("cancelAttackMode"),
  confirmAttackMode: document.getElementById("confirmAttackMode"),

  openSettingsButton: document.getElementById("openSettingsButton"),
  showFavoritesButton: document.getElementById("showFavoritesButton"),
  backToTopFromSettings: document.getElementById("backToTopFromSettings"),
  backToTopFromFavorites: document.getElementById("backToTopFromFavorites"),
  categoryToggleList: document.getElementById("categoryToggleList"),
  enableAllCategories: document.getElementById("enableAllCategories"),
  openHiddenCardsButton: document.getElementById("openHiddenCardsButton"),
  resetHiddenCards: document.getElementById("resetHiddenCards"),
  resetSavedData: document.getElementById("resetSavedData"),
  settingsStatus: document.getElementById("settingsStatus"),
  hiddenList: document.getElementById("hiddenList"),
  backToSettingsFromHidden: document.getElementById("backToSettingsFromHidden"),
  backToSettingsFromHiddenBottom: document.getElementById("backToSettingsFromHiddenBottom"),
  restoreAllHiddenCards: document.getElementById("restoreAllHiddenCards"),
  favoriteList: document.getElementById("favoriteList"),

  cardTypeHelp: document.getElementById("cardTypeHelp"),
  topAvailabilityHelp: document.getElementById("topAvailabilityHelp"),
  cardTypeInputs: Array.from(document.querySelectorAll('input[name="cardType"]')),

  modeTitle: document.getElementById("modeTitle"),
  modeDescription: document.getElementById("modeDescription"),
  modeButtonList: document.getElementById("modeButtonList"),

  drawChoiceTitle: document.getElementById("drawChoiceTitle"),
  drawChoiceDescription: document.getElementById("drawChoiceDescription"),
  backToModeFromDrawChoice: document.getElementById("backToModeFromDrawChoice"),
  quickDrawButton: document.getElementById("quickDrawButton"),
  candidateDrawButton: document.getElementById("candidateDrawButton"),

  candidateNotice: document.getElementById("candidateNotice"),
  candidateList: document.getElementById("candidateList"),

  questionCard: document.getElementById("questionCard"),
  questionType: document.getElementById("questionType"),
  questionCategory: document.getElementById("questionCategory"),
  questionDanger: document.getElementById("questionDanger"),
  questionText: document.getElementById("questionText"),
  questionStatus: document.getElementById("questionStatus"),

  backToTopFromMode: document.getElementById("backToTopFromMode"),
  backToDrawChoiceFromCandidate: document.getElementById("backToDrawChoiceFromCandidate"),
  backToModeFromQuestion: document.getElementById("backToModeFromQuestion"),
  reshuffleCandidates: document.getElementById("reshuffleCandidates"),
  nextCardButton: document.getElementById("nextCardButton"),
  passButton: document.getElementById("passButton"),
  favoriteButton: document.getElementById("favoriteButton"),
  hideQuestionButton: document.getElementById("hideQuestionButton")
};

document.addEventListener("DOMContentLoaded", init);

async function init() {
  setupEvents();
  loadLocalSettings();
  syncSettingsToUI();

  try {
    showScreen("loadingScreen");
    const csvText = await fetchCsvText();
    loadCardsFromCsvText(csvText);
    refreshAvailableChoices();
    showScreen("titleScreen");
  } catch (error) {
    showCsvError(error);
  }
}

function setupEvents() {
  if (elements.startButton) {
    elements.startButton.addEventListener("click", () => showScreen("topScreen"));
  }

  document.querySelectorAll("[data-play-type]").forEach((button) => {
    button.addEventListener("click", () => openModeSelect(button.dataset.playType));
  });

  elements.openSettingsButton.addEventListener("click", () => {
    renderCategorySettings();
    showScreen("settingsScreen");
  });

  elements.showFavoritesButton.addEventListener("click", () => {
    renderFavorites();
    showScreen("favoriteScreen");
  });

  elements.openHiddenCardsButton.addEventListener("click", () => {
    renderHiddenCards();
    showScreen("hiddenScreen");
  });

  elements.backToTopFromSettings.addEventListener("click", () => showScreen("topScreen"));
  elements.backToTopFromFavorites.addEventListener("click", () => showScreen("topScreen"));
  elements.backToSettingsFromHidden.addEventListener("click", () => {
    renderCategorySettings();
    showScreen("settingsScreen");
  });
  elements.backToSettingsFromHiddenBottom.addEventListener("click", () => {
    renderCategorySettings();
    showScreen("settingsScreen");
  });
  elements.backToTopFromMode.addEventListener("click", () => showScreen("topScreen"));
  elements.backToModeFromDrawChoice.addEventListener("click", () => showScreen("modeScreen"));
  elements.backToDrawChoiceFromCandidate.addEventListener("click", () => showScreen("drawChoiceScreen"));
  elements.backToModeFromQuestion.addEventListener("click", () => showScreen("modeScreen"));

  elements.enableAllCategories.addEventListener("click", enableAllCategories);
  elements.resetHiddenCards.addEventListener("click", resetHiddenCards);
  elements.restoreAllHiddenCards.addEventListener("click", resetHiddenCards);
  elements.resetSavedData.addEventListener("click", resetSavedData);

  elements.cardTypeInputs.forEach((input) => {
    input.addEventListener("change", () => {
      if (!input.checked) return;
      state.cardType = input.value;
      saveCardType();
      refreshAvailableChoices();
      syncCardTypeHelp();
      refreshCurrentScreenAfterFilterChange("変更した。");
    });
  });

  elements.quickDrawButton.addEventListener("click", () => {
    state.currentDrawType = "quick";
    quickDrawCard("このカード。");
  });

  elements.candidateDrawButton.addEventListener("click", () => {
    state.currentDrawType = "candidate";
    showCandidateCards("中身はまだ秘密。気になるカードで。");
  });

  elements.reshuffleCandidates.addEventListener("click", () => showCandidateCards("別のカード"));

  elements.nextCardButton.addEventListener("click", () => {
    if (state.currentDrawType === "quick") {
      quickDrawCard("もう1枚。");
    } else {
      showCandidateCards("次はどれにする？");
    }
  });

  elements.passButton.addEventListener("click", () => {
    if (state.currentDrawType === "quick") {
      quickDrawCard("無理せずパス。別のカードへ。");
    } else {
      showCandidateCards("無理せずパス。別のカードへ。");
    }
  });

  elements.favoriteButton.addEventListener("click", toggleFavoriteForCurrentCard);
  elements.hideQuestionButton.addEventListener("click", hideCurrentCard);

  elements.adultToggle.addEventListener("change", handleAdultToggleChange);
  elements.attackToggle.addEventListener("change", handleAttackToggleChange);

  elements.cancelAdultMode.addEventListener("click", () => {
    closeAdultModal();
    elements.adultToggle.checked = false;
  });

  elements.confirmAdultMode.addEventListener("click", () => {
    state.adultMode = true;
    saveAdultMode();
    syncSettingsToUI();
    closeAdultModal();
    refreshCurrentScreenAfterFilterChange("Adult ON");
  });

  elements.cancelAttackMode.addEventListener("click", () => {
    closeAttackModal();
    elements.attackToggle.checked = false;
  });

  elements.confirmAttackMode.addEventListener("click", () => {
    state.attackMode = true;
    saveAttackMode();
    syncSettingsToUI();
    closeAttackModal();
    refreshCurrentScreenAfterFilterChange("Spice ON");
  });

  elements.csvFileInput.addEventListener("change", handleCsvFileSelected);

  elements.adultModal.addEventListener("click", (event) => {
    if (event.target === elements.adultModal) {
      closeAdultModal();
      elements.adultToggle.checked = state.adultMode;
    }
  });

  elements.attackModal.addEventListener("click", (event) => {
    if (event.target === elements.attackModal) {
      closeAttackModal();
      elements.attackToggle.checked = state.attackMode;
    }
  });
}

async function fetchCsvText() {
  try {
    const response = await fetch(CSV_FILE_NAME, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`CSVが見つからない。ファイル名を確認。`);
    }

    return await response.text();
  } catch (error) {
    if (typeof FREE_CSV_TEXT === "string" && FREE_CSV_TEXT.trim()) {
      return FREE_CSV_TEXT;
    }
    throw error;
  }
}

function handleCsvFileSelected(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      loadCardsFromCsvText(String(reader.result || ""));
      refreshAvailableChoices();
      showScreen("topScreen");
    } catch (error) {
      showCsvError(error);
    }
  };
  reader.onerror = () => showCsvError(new Error("そのCSVは読めなかった。"));
  reader.readAsText(file, "UTF-8");
}

function loadCardsFromCsvText(csvText) {
  const rows = parseCsv(csvText);

  if (rows.length < 2) {
    throw new Error("CSVにカードが入ってない。1行目を確認。");
  }

  const header = rows[0].map((value) => normalizeText(value));
  const idIndex = header.indexOf("ID");
  const typeIndex = header.indexOf("カード種別");
  const categoryIndex = header.indexOf("カテゴリ");
  const dangerIndex = header.indexOf("危険度");
  const attackIndex = header.indexOf("攻め度");
  const questionIndex = header.indexOf("質問");

  if (categoryIndex === -1 || questionIndex === -1) {
    throw new Error("CSVの1行目に「カテゴリ」と「質問」が必要。v1.2形式でもOK。");
  }

  const cards = [];
  const seenIds = new Set();

  for (let i = 1; i < rows.length; i += 1) {
    const row = rows[i];
    if (!row || row.every((cell) => normalizeText(cell) === "")) continue;

    const category = normalizeText(row[categoryIndex]);
    const text = normalizeCardText(row[questionIndex]);
    if (!category || !text) continue;

    const type = normalizeCardType(typeIndex >= 0 ? row[typeIndex] : "");
    const rawDanger = dangerIndex >= 0 ? normalizeText(row[dangerIndex]) : "";
    const danger = normalizeDanger(rawDanger || getCategoryFallbackDanger(category));
    const attackLevel = normalizeAttackLevel(attackIndex >= 0 ? row[attackIndex] : "");
    const rawId = idIndex >= 0 ? normalizeText(row[idIndex]) : "";
    let id = rawId || `${type === CARD_TYPE.MISSION ? "M" : "Q"}-${i}-${category}-${text}`;

    if (seenIds.has(id)) {
      id = `${id}-${i}`;
    }
    seenIds.add(id);

    cards.push({ id, type, category, danger, attackLevel, question: text });
  }

  if (cards.length === 0) {
    throw new Error("使えるカードが見つからない。CSVのカテゴリと質問を確認。");
  }

  state.allCards = cards;
  state.cardsByCategory = buildCardMap(cards);
  setupDefaultCategoryEnabled();
  state.recentCardIds = [];
  state.recentCategories = [];
  state.lastCardId = null;
  state.currentCard = null;
  state.pendingHideCardId = null;
  window.clearTimeout(state.hideConfirmTimer);
}

function parseCsv(text) {
  const cleanText = String(text || "").replace(/^\uFEFF/, "");
  const rows = [];
  let row = [];
  let value = "";
  let insideQuotes = false;

  for (let i = 0; i < cleanText.length; i += 1) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];

    if (char === "\"") {
      if (insideQuotes && nextChar === "\"") {
        value += "\"";
        i += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
      continue;
    }

    if (char === "," && !insideQuotes) {
      row.push(value);
      value = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && nextChar === "\n") i += 1;
      row.push(value);
      rows.push(row);
      row = [];
      value = "";
      continue;
    }

    value += char;
  }

  row.push(value);
  rows.push(row);
  return rows;
}

function buildCardMap(cards) {
  const map = new Map();
  cards.forEach((item) => {
    if (!map.has(item.category)) map.set(item.category, []);
    map.get(item.category).push(item);
  });
  return map;
}

function normalizeText(value) {
  return String(value || "")
    .replace(/^\uFEFF/, "")
    .replace(/^[\s\u3000]+|[\s\u3000]+$/g, "");
}

function normalizeCardText(value) {
  return normalizeText(value)
    .replace(/\\n/g, "\n")
    .replace(/[\t ]+\n/g, "\n")
    .replace(/\n[\t ]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n");
}

function normalizeDanger(value) {
  const normalized = normalizeText(value);
  return DANGER_META[normalized] ? normalized : "普通";
}

function normalizeCardType(value) {
  const normalized = normalizeText(value);
  if (normalized === CARD_TYPE.MISSION) return CARD_TYPE.MISSION;
  return CARD_TYPE.QUESTION;
}

function normalizeAttackLevel(value) {
  const normalized = normalizeText(value);
  const lower = normalized.toLowerCase().replace(/[\s_\-]/g, "");

  if (lower === "soft" || normalized === "軽め") return ATTACK_LEVEL.SOFT;
  if (lower === "normal" || normalized === "通常") return ATTACK_LEVEL.NORMAL;
  if (lower === "hard" || normalized === "攻め") return ATTACK_LEVEL.HARD;
  if (lower === "veryhard" || lower === "veryhard" || normalized === "かなり攻め") return ATTACK_LEVEL.VERY_HARD;

  return ATTACK_LEVEL.NORMAL;
}

function getCategoryFallbackDanger(category) {
  return CATEGORY_META[category]?.fallbackDanger || "普通";
}

function showScreen(screenKey) {
  const screenMap = {
    loadingScreen: elements.loadingScreen,
    titleScreen: elements.titleScreen,
    errorScreen: elements.errorScreen,
    topScreen: elements.topScreen,
    settingsScreen: elements.settingsScreen,
    hiddenScreen: elements.hiddenScreen,
    favoriteScreen: elements.favoriteScreen,
    modeScreen: elements.modeScreen,
    drawChoiceScreen: elements.drawChoiceScreen,
    candidateScreen: elements.candidateScreen,
    questionScreen: elements.questionScreen
  };

  Object.values(screenMap).forEach((screen) => screen.classList.remove("active"));
  screenMap[screenKey].classList.add("active");
  document.body.classList.toggle("title-active", screenKey === "titleScreen" || screenKey === "loadingScreen");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showCsvError(error) {
  elements.errorMessage.textContent = error.message || "読めなかった。";
  showScreen("errorScreen");
}

function handleAdultToggleChange() {
  if (elements.adultToggle.checked) {
    if (!state.adultMode) {
      elements.adultToggle.checked = false;
      openAdultModal();
    }
    return;
  }

  state.adultMode = false;
  state.attackMode = false;
  saveAdultMode();
  saveAttackMode();
  syncSettingsToUI();
  refreshCurrentScreenAfterFilterChange("Adult OFF。");
}

function handleAttackToggleChange() {
  if (!state.adultMode) {
    state.attackMode = false;
    syncSettingsToUI();
    return;
  }

  if (elements.attackToggle.checked) {
    if (!state.attackMode) {
      elements.attackToggle.checked = false;
      openAttackModal();
    }
    return;
  }

  state.attackMode = false;
  saveAttackMode();
  syncSettingsToUI();
  refreshCurrentScreenAfterFilterChange("Spice OFF。");
}

function openAdultModal() {
  elements.adultModal.classList.add("active");
  elements.adultModal.setAttribute("aria-hidden", "false");
}

function closeAdultModal() {
  elements.adultModal.classList.remove("active");
  elements.adultModal.setAttribute("aria-hidden", "true");
}

function openAttackModal() {
  elements.attackModal.classList.add("active");
  elements.attackModal.setAttribute("aria-hidden", "false");
}

function closeAttackModal() {
  elements.attackModal.classList.remove("active");
  elements.attackModal.setAttribute("aria-hidden", "true");
}

function syncSettingsToUI() {
  elements.adultToggle.checked = state.adultMode;
  elements.attackToggle.checked = state.attackMode;

  if (IS_FREE_VERSION) {
    elements.adultToggle.disabled = true;
    elements.attackToggle.disabled = true;
  }

  document.body.classList.toggle("adult-on", state.adultMode);
  document.body.classList.toggle("attack-on", state.attackMode);

  const showAttackPanel = IS_FREE_VERSION || state.adultMode;
  elements.attackPanel.classList.toggle("visible", showAttackPanel);
  elements.attackPanel.setAttribute("aria-hidden", showAttackPanel ? "false" : "true");

  refreshCardTypeChoices();
  elements.cardTypeInputs.forEach((input) => {
    input.checked = input.value === state.cardType;
  });
  syncCardTypeHelp();
  refreshTopPlayChoices();
}

function syncCardTypeHelp() {
  const label = CARD_TYPE_LABELS[state.cardType] || CARD_TYPE_LABELS.all;
  const helpMap = {
    all: state.attackMode ? "Spiceの質問とMission。" : "QuestionとMissionを混ぜる。",
    questions: state.attackMode ? "Spiceの質問だけ。" : "質問だけ。",
    missions: state.attackMode ? "SpiceのMissionだけ。" : "ミッションだけ。"
  };
  elements.cardTypeHelp.textContent = `${label}：${helpMap[state.cardType] || helpMap.all}`;
}

function openModeSelect(playTypeKey) {
  const playType = PLAY_CONFIG[playTypeKey];
  if (!playType) return;

  state.currentPlayTypeKey = playTypeKey;
  state.currentModeKey = null;
  state.currentMode = null;

  elements.modeTitle.textContent = playType.title;
  elements.modeDescription.textContent = getPlayTypeDescription(playTypeKey);
  elements.modeButtonList.innerHTML = "";

  const availableModes = getAvailableModesForPlayType(playTypeKey);

  if (availableModes.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-card";
    empty.textContent = "この組み合わせだと出ない。Mixにするか、出すカードを戻す。";
    elements.modeButtonList.appendChild(empty);
  }

  availableModes.forEach(([modeKey, mode]) => {
    const button = document.createElement("button");
    button.className = "mode-button";
    button.type = "button";
    button.innerHTML = `
      <span>${escapeHtml(mode.label)}</span>
      <small>${escapeHtml(mode.description)}</small>
    `;

    button.addEventListener("click", () => selectMode(modeKey));
    elements.modeButtonList.appendChild(button);
  });

  showScreen("modeScreen");
}

function selectMode(modeKey) {
  const playType = PLAY_CONFIG[state.currentPlayTypeKey];
  if (!playType || !playType.modes[modeKey]) return;

  state.currentModeKey = modeKey;
  state.currentMode = playType.modes[modeKey];
  elements.drawChoiceTitle.textContent = `${state.currentMode.label}の引き方`;
  elements.drawChoiceDescription.textContent = "すぐ見るなら一発。迷うなら候補から。";
  showScreen("drawChoiceScreen");
}

function showCandidateCards(message) {
  if (state.isBusy || !state.currentMode) return;
  setBusy(true);

  const availableCategories = getAvailableCategoriesForCurrentMode();
  const candidateCategories = pickCandidateCategories(availableCategories);

  elements.candidateList.innerHTML = "";
  elements.candidateNotice.textContent = message || "";

  if (availableCategories.length === 0) {
    elements.candidateNotice.textContent = "この組み合わせだと出ない。少し戻す。";
    showScreen("candidateScreen");
    setBusy(false);
    return;
  }

  if (candidateCategories.length === 0) {
    state.recentCategories = [];
    state.recentCardIds = [];
    const retryCategories = pickCandidateCategories(getAvailableCategoriesForCurrentMode());
    retryCategories.forEach((category) => elements.candidateList.appendChild(createCandidateButton(category)));
  } else {
    candidateCategories.forEach((category) => elements.candidateList.appendChild(createCandidateButton(category)));
  }

  showScreen("candidateScreen");
  window.setTimeout(() => setBusy(false), 220);
}

function getAvailableCategoriesForCurrentMode() {
  if (!state.currentMode) return [];
  return state.currentMode.categories
    .map((category) => normalizeText(category))
    .filter((category) => isCategoryAvailable(category));
}

function isCategoryAvailable(category) {
  if (state.categoryEnabled[category] === false) return false;
  const cards = state.cardsByCategory.get(category) || [];
  return cards.some((card) => isCardAllowed(card));
}

function isCardAllowed(card) {
  return isCardAllowedForType(card, state.cardType);
}

function isCardAllowedForType(card, cardType) {
  if (!card || state.hiddenCards.has(card.id)) return false;

  if (!state.adultMode && isAdultCard(card)) return false;
  if (!state.attackMode && isAttackCard(card)) return false;
  if (state.attackMode && !isAttackCard(card)) return false;

  if (cardType === "questions" && card.type !== CARD_TYPE.QUESTION) return false;
  if (cardType === "missions" && card.type !== CARD_TYPE.MISSION) return false;

  return true;
}

function refreshAvailableChoices() {
  refreshCardTypeChoices();
  refreshTopPlayChoices();
  syncCardTypeHelp();
}

function refreshCardTypeChoices() {
  if (!elements.cardTypeInputs || elements.cardTypeInputs.length === 0) return;

  const availableTypes = ["all", "questions", "missions"].filter((type) => hasAnyCardForType(type));
  const fallbackType = availableTypes.includes("all") ? "all" : availableTypes[0] || "all";

  if (!availableTypes.includes(state.cardType)) {
    state.cardType = fallbackType;
    saveCardType();
  }

  elements.cardTypeInputs.forEach((input) => {
    const label = input.closest("label");
    const canUse = availableTypes.includes(input.value);
    if (label) label.classList.toggle("is-hidden", !canUse);
    input.disabled = !canUse;
    input.checked = input.value === state.cardType;
  });
}

function hasAnyCardForType(cardType) {
  return state.allCards.some((card) => isCardAllowedForType(card, cardType));
}

function refreshTopPlayChoices() {
  const buttons = document.querySelectorAll("[data-play-type]");
  let visibleCount = 0;

  buttons.forEach((button) => {
    const canUse = hasAvailableMode(button.dataset.playType);
    button.classList.toggle("is-hidden", !canUse);
    if (canUse) visibleCount += 1;
  });

  if (!elements.topAvailabilityHelp) return;

  if (visibleCount === 0) {
    elements.topAvailabilityHelp.textContent = "この組み合わせだと出ない。Mixにするか、出すカードを戻す。";
  } else if (state.attackMode) {
    elements.topAvailabilityHelp.textContent = "今はSpiceだけ。いつもの質問も混ぜるならSpiceをOFF。";
  } else {
    elements.topAvailabilityHelp.textContent = "";
  }
}

function hasAvailableMode(playTypeKey) {
  return getAvailableModesForPlayType(playTypeKey).length > 0;
}

function getAvailableModesForPlayType(playTypeKey) {
  const playType = PLAY_CONFIG[playTypeKey];
  if (!playType) return [];

  return Object.entries(playType.modes).filter(([modeKey, mode]) => {
    if (isModeLockedInFreeVersion(playTypeKey, modeKey)) return false;
    return mode.categories.some((category) => isCategoryAvailable(normalizeText(category)));
  });
}

function getPlayTypeDescription(playTypeKey) {
  const playType = PLAY_CONFIG[playTypeKey];
  if (!playType) return "";
  if (state.attackMode) {
    return "今はSpiceだけ。いつもの質問も混ぜるならSpiceをOFF。";
  }
  return playType.description;
}

function isAdultCard(card) {
  return card.category === ADULT_CATEGORY || ATTACK_CATEGORIES.includes(card.category) || card.danger === "明け方向け" || isAttackCard(card);
}

function isAttackCard(card) {
  return card.attackLevel === ATTACK_LEVEL.HARD || card.attackLevel === ATTACK_LEVEL.VERY_HARD || card.category === "攻めミッション";
}

function pickCandidateCategories(categories) {
  const uniqueCategories = Array.from(new Set(categories));
  if (uniqueCategories.length === 0) return [];

  const blockedCategory = getBlockedCategoryByStreak();
  let pool = uniqueCategories;

  if (blockedCategory && uniqueCategories.length >= 2) {
    pool = uniqueCategories.filter((category) => category !== blockedCategory);
  }

  return shuffleArray(pool).slice(0, Math.min(3, pool.length));
}

function getBlockedCategoryByStreak() {
  const recent = state.recentCategories;
  if (recent.length < 2) return null;

  const last = recent[recent.length - 1];
  const beforeLast = recent[recent.length - 2];
  return last && last === beforeLast ? last : null;
}

function createCandidateButton(category) {
  const meta = getCategoryDisplayMeta(category);
  const availableCards = (state.cardsByCategory.get(category) || []).filter((card) => isCardAllowed(card));
  const hasMission = availableCards.some((card) => card.type === CARD_TYPE.MISSION);
  const hasAttack = availableCards.some((card) => isAttackCard(card));

  const button = document.createElement("button");
  button.type = "button";
  button.className = `candidate-card ${meta.dangerClass}${hasMission ? " candidate-card--mission" : ""}${hasAttack ? " candidate-card--attack" : ""}`;

  const typeLabel = hasMission && state.cardType !== "questions" ? "ミッションあり" : "質問";

  button.innerHTML = `
    <div class="candidate-meta">
      <span class="candidate-category">${escapeHtml(getCategoryLabel(category))}</span>
      <span class="type-pill">${escapeHtml(typeLabel)}</span>
      <span class="danger-pill">${escapeHtml(meta.dangerLabel)}</span>
    </div>
    <p class="candidate-desc">${escapeHtml(meta.description)}</p>
  `;

  button.addEventListener("click", () => selectCandidateCategory(category));
  return button;
}

function selectCandidateCategory(category) {
  if (state.isBusy) return;

  const card = pickCardFromCategory(category);
  if (!card) {
    elements.candidateNotice.textContent = "このカードは今出せない。";
    showScreen("candidateScreen");
    return;
  }

  showCard(card, "これどう？");
}

function quickDrawCard(message) {
  if (state.isBusy || !state.currentMode) return;

  const categories = getAvailableCategoriesForCurrentMode();
  if (categories.length === 0) {
    elements.candidateNotice.textContent = "この組み合わせだと出ない。少し戻す。";
    showScreen("candidateScreen");
    return;
  }

  const blockedCategory = getBlockedCategoryByStreak();
  let categoryPool = categories;

  if (blockedCategory && categories.length >= 2) {
    categoryPool = categories.filter((category) => category !== blockedCategory);
  }

  const shuffledCategories = shuffleArray(categoryPool);

  for (const category of shuffledCategories) {
    const card = pickCardFromCategory(category);
    if (card) {
      showCard(card, message || "これどう？");
      return;
    }
  }

  state.recentCardIds = [];
  const retryCategory = randomItem(shuffledCategories);
  const retryCard = retryCategory ? pickCardFromCategory(retryCategory) : null;

  if (retryCard) {
    showCard(retryCard, message || "これどう？");
  } else {
    elements.candidateNotice.textContent = "カードが見つからない。外したカードを戻すと出るかも。";
    showScreen("candidateScreen");
  }
}

function pickCardFromCategory(category) {
  const cards = (state.cardsByCategory.get(category) || []).filter((item) => isCardAllowed(item));
  if (cards.length === 0) return null;

  let pool = cards.filter((item) => {
    const notRecent = !state.recentCardIds.includes(item.id);
    const notSameAsLast = item.id !== state.lastCardId;
    return notRecent && notSameAsLast;
  });

  if (pool.length === 0) {
    state.recentCardIds = [];
    pool = cards.filter((item) => item.id !== state.lastCardId);
  }

  if (pool.length === 0) pool = cards.slice();
  return randomItem(pool);
}

function showCard(card, statusText) {
  const meta = getCardDisplayMeta(card);

  state.currentCard = card;
  state.lastCardId = card.id;
  addRecentCard(card.id);
  addRecentCategory(card.category);

  elements.questionType.textContent = card.type;
  elements.questionCategory.textContent = getCategoryLabel(card.category);
  elements.questionDanger.textContent = meta.dangerLabel;
  elements.questionText.textContent = card.question;
  elements.questionStatus.textContent = statusText || getDefaultStatus(card);

  elements.questionCard.className = `question-card ${meta.dangerClass}${card.type === CARD_TYPE.MISSION ? " question-card--mission" : ""}${isAttackCard(card) ? " question-card--attack" : ""}`;
  void elements.questionCard.offsetWidth;
  elements.questionCard.classList.add("flip");

  updateQuestionActionButtons();
  showScreen("questionScreen");
}

function getDefaultStatus(card) {
  if (card.type === CARD_TYPE.MISSION) {
    return "きつかったらパスでOK。やるかどうかはふたりで決める。";
  }
  return "きつかったらパスでOK。今日は話さないのもアリ。";
}

function addRecentCard(cardId) {
  state.recentCardIds.push(cardId);
  while (state.recentCardIds.length > RECENT_HISTORY_LIMIT) {
    state.recentCardIds.shift();
  }
}

function addRecentCategory(category) {
  state.recentCategories.push(category);
  while (state.recentCategories.length > 10) {
    state.recentCategories.shift();
  }
}

function renderCategorySettings() {
  const categories = getAllKnownCategories();
  elements.categoryToggleList.innerHTML = "";
  showSettingsStatus(`外したカード：${state.hiddenCards.size}枚 / お気に入り：${state.favorites.size}枚`);

  categories.forEach((category) => {
    const meta = getCategoryDisplayMeta(category);
    const cards = state.cardsByCategory.get(category) || [];
    const cardCount = cards.length;
    const isAdultLocked = !state.adultMode && isAdultCategory(category);
    const isAttackLocked = !state.attackMode && isAttackCategory(category);
    const isEnabled = state.categoryEnabled[category] !== false;

    const item = document.createElement("label");
    item.className = `setting-row ${meta.dangerClass}${isAdultLocked || isAttackLocked ? " setting-row--locked" : ""}`;
    item.innerHTML = `
      <span class="setting-row__main">
        <span class="setting-row__title">${escapeHtml(getCategoryLabel(category))}</span>
        <span class="setting-row__desc">${escapeHtml(meta.description)} / ${cardCount}枚${isAdultLocked ? " / Adult" : ""}${isAttackLocked ? " / Spice" : ""}</span>
      </span>
      <span class="setting-toggle">
        <input type="checkbox" ${isEnabled ? "checked" : ""} ${isAdultLocked || isAttackLocked ? "disabled" : ""} />
        <span></span>
      </span>
    `;

    const checkbox = item.querySelector("input");
    checkbox.addEventListener("change", () => {
      state.categoryEnabled[category] = checkbox.checked;
      saveCategoryEnabled();
      refreshAvailableChoices();
    });

    elements.categoryToggleList.appendChild(item);
  });
}

function getAllKnownCategories() {
  const fromCsv = Array.from(state.cardsByCategory.keys());
  if (IS_FREE_VERSION) {
    return fromCsv;
  }

  const fromConfig = Object.keys(CATEGORY_META);
  return Array.from(new Set([...fromConfig, ...fromCsv]));
}

function isAdultCategory(category) {
  return category === ADULT_CATEGORY || ATTACK_CATEGORIES.includes(category);
}

function isAttackCategory(category) {
  return category === "攻めミッション";
}

function setupDefaultCategoryEnabled() {
  getAllKnownCategories().forEach((category) => {
    if (typeof state.categoryEnabled[category] !== "boolean") {
      state.categoryEnabled[category] = true;
    }
  });
  saveCategoryEnabled();
}

function enableAllCategories() {
  getAllKnownCategories().forEach((category) => {
    state.categoryEnabled[category] = true;
  });
  saveCategoryEnabled();
  refreshAvailableChoices();
  renderCategorySettings();
}

function resetHiddenCards() {
  if (state.hiddenCards.size === 0) {
    showSettingsStatus("外したカードはまだない。");
    if (elements.hiddenScreen.classList.contains("active")) renderHiddenCards();
    return;
  }

  const ok = window.confirm("外したカードを全部戻す？\nお気に入りはそのまま残る。");
  if (!ok) return;

  state.hiddenCards.clear();
  saveHiddenCards();
  state.recentCardIds = [];
  refreshAvailableChoices();
  showSettingsStatus("外したカードを全部戻した。");

  if (elements.hiddenScreen.classList.contains("active")) {
    renderHiddenCards();
  } else {
    renderCategorySettings();
  }
}

function resetSavedData() {
  const ok = window.confirm("お気に入り・外したカード・ON/OFFを最初に戻す？\nCSVのカード自体は消えない。");
  if (!ok) return;

  state.categoryEnabled = {};
  state.favorites.clear();
  state.hiddenCards.clear();
  state.adultMode = false;
  state.attackMode = false;
  state.cardType = "all";
  state.recentCardIds = [];
  state.recentCategories = [];
  state.lastCardId = null;
  state.currentCard = null;
  setupDefaultCategoryEnabled();
  saveFavorites();
  saveHiddenCards();
  saveAdultMode();
  saveAttackMode();
  saveCardType();
  syncSettingsToUI();
  renderCategorySettings();
  showSettingsStatus("最初の状態に戻した。");
}

function showSettingsStatus(message) {
  if (!elements.settingsStatus) return;
  elements.settingsStatus.textContent = message || "";
}

function toggleFavoriteForCurrentCard() {
  if (!state.currentCard) return;

  if (state.favorites.has(state.currentCard.id)) {
    state.favorites.delete(state.currentCard.id);
    elements.questionStatus.textContent = "お気に入りから外した。";
  } else {
    state.favorites.add(state.currentCard.id);
    elements.questionStatus.textContent = "お気に入りに入れた。";
  }

  saveFavorites();
  updateQuestionActionButtons();
}

function hideCurrentCard() {
  if (!state.currentCard) return;

  if (state.pendingHideCardId !== state.currentCard.id) {
    state.pendingHideCardId = state.currentCard.id;
    elements.hideQuestionButton.textContent = "もう一回で外す";
    elements.questionStatus.textContent = "もう一回で、このカードは出なくなる。";

    window.clearTimeout(state.hideConfirmTimer);
    state.hideConfirmTimer = window.setTimeout(() => {
      state.pendingHideCardId = null;
      updateQuestionActionButtons();
    }, 2500);
    return;
  }

  window.clearTimeout(state.hideConfirmTimer);
  state.pendingHideCardId = null;

  state.hiddenCards.add(state.currentCard.id);
  state.favorites.delete(state.currentCard.id);
  saveHiddenCards();
  saveFavorites();

  if (state.currentDrawType === "quick") {
    quickDrawCard("このカードは外した。別のカードへ。");
  } else {
    showCandidateCards("このカードは外した。別のカードへ。");
  }
}

function updateQuestionActionButtons() {
  if (!state.currentCard) return;
  elements.favoriteButton.textContent = state.favorites.has(state.currentCard.id)
    ? "お気に入り済み"
    : "お気に入り";
  elements.hideQuestionButton.textContent = "外す";
}

function renderFavorites() {
  const favoriteCards = state.allCards.filter((item) => state.favorites.has(item.id));
  elements.favoriteList.innerHTML = "";

  if (favoriteCards.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-card";
    empty.textContent = "お気に入りはまだ空。気に入ったカードはここに残る。";
    elements.favoriteList.appendChild(empty);
    return;
  }

  favoriteCards.forEach((card) => {
    const meta = getCardDisplayMeta(card);
    const item = document.createElement("div");
    item.className = `favorite-card ${meta.dangerClass}${card.type === CARD_TYPE.MISSION ? " favorite-card--mission" : ""}`;
    item.innerHTML = `
      <div class="candidate-meta">
        <span class="type-pill">${escapeHtml(card.type)}</span>
        <span class="candidate-category">${escapeHtml(getCategoryLabel(card.category))}</span>
        <span class="danger-pill">${escapeHtml(meta.dangerLabel)}</span>
      </div>
      <p>${escapeHtml(card.question)}</p>
      <button class="ghost-button full-width" type="button">お気に入りから外す</button>
    `;

    item.querySelector("button").addEventListener("click", () => {
      state.favorites.delete(card.id);
      saveFavorites();
      renderFavorites();
    });

    elements.favoriteList.appendChild(item);
  });
}

function renderHiddenCards() {
  const hiddenCards = state.allCards.filter((item) => state.hiddenCards.has(item.id));
  elements.hiddenList.innerHTML = "";

  if (hiddenCards.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-card";
    empty.textContent = "外したカードはまだない。";
    elements.hiddenList.appendChild(empty);
    return;
  }

  hiddenCards.forEach((card) => {
    const meta = getCardDisplayMeta(card);
    const item = document.createElement("div");
    item.className = `favorite-card ${meta.dangerClass}${card.type === CARD_TYPE.MISSION ? " favorite-card--mission" : ""}`;
    item.innerHTML = `
      <div class="candidate-meta">
        <span class="type-pill">${escapeHtml(card.type)}</span>
        <span class="candidate-category">${escapeHtml(getCategoryLabel(card.category))}</span>
        <span class="danger-pill">${escapeHtml(meta.dangerLabel)}</span>
      </div>
      <p>${escapeHtml(card.question)}</p>
      <button class="secondary-button full-width" type="button">また出す</button>
    `;

    item.querySelector("button").addEventListener("click", () => {
      state.hiddenCards.delete(card.id);
      saveHiddenCards();
      refreshAvailableChoices();
      renderHiddenCards();
    });

    elements.hiddenList.appendChild(item);
  });
}

function getCategoryDisplayMeta(category) {
  const categoryMeta = CATEGORY_META[category] || { fallbackDanger: "普通", description: "カード" };
  const dangerMeta = DANGER_META[categoryMeta.fallbackDanger] || DANGER_META["普通"];

  return {
    description: categoryMeta.description,
    dangerLabel: dangerMeta.label,
    dangerClass: dangerMeta.dangerClass
  };
}

function getCardDisplayMeta(card) {
  const dangerMeta = DANGER_META[card.danger] || DANGER_META[getCategoryFallbackDanger(card.category)] || DANGER_META["普通"];
  return {
    dangerLabel: dangerMeta.label,
    dangerClass: dangerMeta.dangerClass
  };
}

function refreshCurrentScreenAfterFilterChange(message) {
  refreshAvailableChoices();

  if (elements.topScreen.classList.contains("active")) {
    refreshTopPlayChoices();
  }

  if (elements.settingsScreen.classList.contains("active")) {
    renderCategorySettings();
  }

  if (elements.modeScreen.classList.contains("active")) {
    openModeSelect(state.currentPlayTypeKey);
    return;
  }

  if (elements.drawChoiceScreen.classList.contains("active") && state.currentMode) {
    const stillAvailable = state.currentMode.categories.some((category) => isCategoryAvailable(normalizeText(category)));
    if (!stillAvailable) {
      showScreen("modeScreen");
    }
  }

  if (elements.candidateScreen.classList.contains("active")) {
    showCandidateCards(message || "今の状態に合わせた。");
  }

  if (elements.questionScreen.classList.contains("active") && state.currentCard && !isCardAllowed(state.currentCard)) {
    if (state.currentDrawType === "quick") {
      quickDrawCard(message || "今の状態に合わせた。");
    } else {
      showCandidateCards(message || "今の状態に合わせた。");
    }
  }
}

function loadLocalSettings() {
  state.categoryEnabled = readJson(STORAGE_KEYS.categoryEnabled, {});
  state.favorites = new Set(readJson(STORAGE_KEYS.favorites, []));
  state.hiddenCards = new Set(readJson(STORAGE_KEYS.hidden, []));
  state.adultMode = readBool(STORAGE_KEYS.adultMode, false);
  state.attackMode = readBool(STORAGE_KEYS.attackMode, false);
  state.cardType = readString(STORAGE_KEYS.cardType, "all", ["all", "questions", "missions"]);

  if (IS_FREE_VERSION) {
    state.adultMode = false;
    state.attackMode = false;
  }

  if (!state.adultMode) state.attackMode = false;
}

function saveCategoryEnabled() {
  writeJson(STORAGE_KEYS.categoryEnabled, state.categoryEnabled);
}

function saveFavorites() {
  writeJson(STORAGE_KEYS.favorites, Array.from(state.favorites));
}

function saveHiddenCards() {
  writeJson(STORAGE_KEYS.hidden, Array.from(state.hiddenCards));
}

function saveAdultMode() {
  writeBool(STORAGE_KEYS.adultMode, state.adultMode);
}

function saveAttackMode() {
  writeBool(STORAGE_KEYS.attackMode, state.attackMode);
}

function saveCardType() {
  writeString(STORAGE_KEYS.cardType, state.cardType);
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (_error) {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (_error) {
    // 保存できない環境でもアプリ自体は動かす
  }
}

function readBool(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === "true") return true;
    if (raw === "false") return false;
    return fallback;
  } catch (_error) {
    return fallback;
  }
}

function writeBool(key, value) {
  try {
    localStorage.setItem(key, value ? "true" : "false");
  } catch (_error) {}
}

function readString(key, fallback, allowedValues) {
  try {
    const raw = localStorage.getItem(key);
    return allowedValues.includes(raw) ? raw : fallback;
  } catch (_error) {
    return fallback;
  }
}

function writeString(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (_error) {}
}

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function shuffleArray(array) {
  const copied = array.slice();
  for (let i = copied.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    const temp = copied[i];
    copied[i] = copied[randomIndex];
    copied[randomIndex] = temp;
  }
  return copied;
}

function setBusy(isBusy) {
  state.isBusy = isBusy;
  document.querySelectorAll("button").forEach((button) => {
    button.disabled = isBusy;
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#039;");
}
