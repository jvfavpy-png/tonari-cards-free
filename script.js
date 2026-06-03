"use strict";

const CSV_PATH = "questions_free_30.csv";
const FULL_VERSION_URL = "#"; // Full版の販売URLを入れる。例: "https://example.com/tonari-cards-full"
const FALLBACK_CSV = "ID,カード種別,カテゴリ,危険度,攻め度,質問,メモ\nQ001,質問,もしも,日中向け,soft,明日から1週間だけ仕事も予定も全部なくなったら\\nまず何をする？,無料版\nQ002,質問,もしも,日中向け,soft,宝くじで3億円当たったら\\n誰にも言わずに最初に買うものは？,無料版\nQ004,質問,もしも,日中向け,soft,これから一生タダになるなら\\n外食・旅行・服・家電のどれがいい？,無料版\nQ007,質問,もしも,日中向け,soft,相手と中身が1日入れ替わったら\\nまず何を確認する？,無料版\nQ031,質問,究極の二択,夜向け,NORMAL,一生ラーメン禁止か一生寿司禁止なら\\nどっちがきつい？,無料版\nQ034,質問,究極の二択,夜向け,NORMAL,一生旅行に行けない代わりに豪邸か\\n家は普通だけど毎月旅行なら\\nどっちがいい？,無料版\nQ035,質問,究極の二択,夜向け,NORMAL,どれだけ食べても太らない体か\\n毎日8時間ぐっすり眠れる体なら\\nどっちがほしい？,無料版\nQ040,質問,究極の二択,夜向け,NORMAL,喧嘩してもすぐ仲直りする関係か\\n喧嘩は少ないけど本音も少ない関係なら\\nどっちがいい？,無料版\nQ061,質問,暴露,夜向け,NORMAL,今だから言える\\n初対面のときの正直な印象は？,無料版\nQ065,質問,暴露,夜向け,NORMAL,相手に言われて実はけっこう嬉しかった一言は？,無料版\nQ067,質問,暴露,夜向け,NORMAL,付き合う前\\n相手のどこを一番見ていた？,無料版\nQ091,質問,黒歴史と学生時代,夜向け,NORMAL,学生時代の自分にキャッチコピーをつけるなら何にする？,無料版\nQ092,質問,黒歴史と学生時代,夜向け,NORMAL,今思うと一番痛かったファッションは？,無料版\nQ096,質問,黒歴史と学生時代,夜向け,NORMAL,修学旅行や遠足で一番覚えている事件は？,無料版\nQ121,質問,恋愛の本音,夜向け,NORMAL,付き合う前に一番ドキッとした瞬間は？,無料版\nQ122,質問,恋愛の本音,夜向け,NORMAL,相手のどんな仕草を見ると\\n今でもいいなと思う？,無料版\nQ123,質問,恋愛の本音,夜向け,NORMAL,「好き」って言葉で言われるのと行動で示されるの\\nどっちが刺さる？,無料版\nQ124,質問,恋愛の本音,夜向け,NORMAL,恋人にされると一番安心することは？,無料版\nQ130,質問,恋愛の本音,夜向け,NORMAL,デートで一番大事なのは場所・会話・雰囲気のどれ？,無料版\nQ211,質問,デートと旅行,日中向け,soft,今すぐ行けるなら\\n日帰りでどこに行きたい？,無料版\nQ212,質問,デートと旅行,日中向け,soft,旅行で一番テンションが上がる瞬間は？,無料版\nQ216,質問,デートと旅行,日中向け,soft,温泉旅行で一番楽しみにすることは？,無料版\nQ217,質問,デートと旅行,日中向け,soft,旅行中に相手のどんな行動を見ると嬉しい？,無料版\nQ272,質問,推しとランキング,日中向け,soft,相手の好きなところランキングを作るなら\\n1位は？,無料版\nQ273,質問,推しとランキング,日中向け,soft,今まで行った場所で楽しかったランキング1位は？,無料版\nQ331,質問,相手当てクイズ,日中向け,soft,相手が今一番食べたいもの\\n何だと思う？,無料版\nM003,ミッション,Mission,夜向け,NORMAL,相手の好きなところを3つ言う,無料版\nM028,ミッション,Mission,夜向け,NORMAL,相手の好きなところを\\n外見以外で3つ言う,無料版\nM034,ミッション,Mission,夜向け,NORMAL,今日の相手を一言で褒める,無料版\nM035,ミッション,Mission,夜向け,NORMAL,次のカードまで\\nスマホを置く,無料版\n";

const STORAGE = {
  favorites: "tonariCardsFree:favorites",
  removed: "tonariCardsFree:removed",
  categories: "tonariCardsFree:categories",
};

const state = {
  cards: [],
  mode: "mix",
  currentCard: null,
  lastCardId: null,
  favorites: new Set(),
  removed: new Set(),
  activeCategories: new Set(),
};

const el = {
  startScreen: document.getElementById("startScreen"),
  mainScreen: document.getElementById("mainScreen"),
  startButton: document.getElementById("startButton"),
  backToStartButton: document.getElementById("backToStartButton"),
  card: document.getElementById("card"),
  cardType: document.getElementById("cardType"),
  cardLevel: document.getElementById("cardLevel"),
  cardText: document.getElementById("cardText"),
  cardCategory: document.getElementById("cardCategory"),
  drawButton: document.getElementById("drawButton"),
  threeButton: document.getElementById("threeButton"),
  favoriteButton: document.getElementById("favoriteButton"),
  removeButton: document.getElementById("removeButton"),
  modeChips: Array.from(document.querySelectorAll(".mode-chip")),
  choiceArea: document.getElementById("choiceArea"),
  choiceList: document.getElementById("choiceList"),
  toggleFilterButton: document.getElementById("toggleFilterButton"),
  filterPanel: document.getElementById("filterPanel"),
  categoryChips: document.getElementById("categoryChips"),
  resetCategoryButton: document.getElementById("resetCategoryButton"),
  openPanelButton: document.getElementById("openPanelButton"),
  closePanelButton: document.getElementById("closePanelButton"),
  sidePanel: document.getElementById("sidePanel"),
  favoriteList: document.getElementById("favoriteList"),
  favoriteCount: document.getElementById("favoriteCount"),
  removedList: document.getElementById("removedList"),
  removedCount: document.getElementById("removedCount"),
  restoreAllButton: document.getElementById("restoreAllButton"),
  toast: document.getElementById("toast"),
  fullLink: document.getElementById("fullLink"),
};

init();

async function init() {
  loadStorage();
  el.fullLink.href = FULL_VERSION_URL;
  el.fullLink.addEventListener("click", (event) => {
    if (FULL_VERSION_URL === "#") {
      event.preventDefault();
      showToast("Full版URLは script.js で設定");
    }
  });

  bindEvents();
  const csvText = await loadCsvText();
  state.cards = parseCsv(csvText);
  if (state.cards.length !== 30) {
    console.warn(`Free版CSVは30枚想定です。現在: ${state.cards.length}枚`);
  }
  initCategories();
  renderCategoryChips();
  renderPanel();
}

function bindEvents() {
  el.startButton.addEventListener("click", () => {
    showMainScreen();
    drawRandomCard();
  });

  el.backToStartButton.addEventListener("click", () => {
    el.mainScreen.classList.remove("is-active");
    el.startScreen.classList.add("is-active");
  });

  el.drawButton.addEventListener("click", drawRandomCard);
  el.threeButton.addEventListener("click", showThreeChoices);
  el.favoriteButton.addEventListener("click", toggleFavoriteCurrent);
  el.removeButton.addEventListener("click", removeCurrentCard);
  el.toggleFilterButton.addEventListener("click", () => {
    el.filterPanel.hidden = !el.filterPanel.hidden;
  });
  el.resetCategoryButton.addEventListener("click", () => {
    state.activeCategories = new Set(getAllCategories());
    saveSet(STORAGE.categories, state.activeCategories);
    renderCategoryChips();
    showToast("カテゴリを戻した");
  });
  el.openPanelButton.addEventListener("click", openPanel);
  el.closePanelButton.addEventListener("click", closePanel);
  el.sidePanel.addEventListener("click", (event) => {
    if (event.target === el.sidePanel) closePanel();
  });
  el.restoreAllButton.addEventListener("click", () => {
    state.removed.clear();
    saveSet(STORAGE.removed, state.removed);
    renderPanel();
    showToast("外したカードを戻した");
  });

  el.modeChips.forEach((button) => {
    button.addEventListener("click", () => {
      state.mode = button.dataset.mode;
      el.modeChips.forEach((chip) => chip.classList.toggle("is-active", chip === button));
      hideChoices();
      drawRandomCard();
    });
  });
}

async function loadCsvText() {
  try {
    const response = await fetch(CSV_PATH, { cache: "no-store" });
    if (!response.ok) throw new Error(`CSV load failed: ${response.status}`);
    return await response.text();
  } catch (error) {
    console.info("CSVの読み込みに失敗したため内蔵データを使用します。", error);
    return FALLBACK_CSV;
  }
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  const normalized = text.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  for (let i = 0; i < normalized.length; i += 1) {
    const char = normalized[i];
    const next = normalized[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        cell += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(cell);
      cell = "";
      continue;
    }

    if (char === "
" && !inQuotes) {
      row.push(cell);
      if (row.some((value) => value.trim() !== "")) rows.push(row);
      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    if (row.some((value) => value.trim() !== "")) rows.push(row);
  }

  const header = rows.shift();
  if (!header) return [];

  return rows.map((values) => {
    const item = {};
    header.forEach((key, index) => {
      item[key] = (values[index] || "").replace(/\n/g, "
").trim();
    });
    return {
      id: item.ID,
      type: item["カード種別"],
      category: item["カテゴリ"],
      risk: item["危険度"],
      level: item["攻め度"],
      text: item["質問"],
      note: item["メモ"],
    };
  }).filter((card) => card.id && card.text);
}

function loadStorage() {
  state.favorites = readSet(STORAGE.favorites);
  state.removed = readSet(STORAGE.removed);
  state.activeCategories = readSet(STORAGE.categories);
}

function readSet(key) {
  try {
    const raw = localStorage.getItem(key);
    const values = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(values) ? values : []);
  } catch {
    return new Set();
  }
}

function saveSet(key, set) {
  localStorage.setItem(key, JSON.stringify(Array.from(set)));
}

function initCategories() {
  const categories = getAllCategories();
  if (state.activeCategories.size === 0) {
    state.activeCategories = new Set(categories);
    saveSet(STORAGE.categories, state.activeCategories);
  } else {
    state.activeCategories = new Set(Array.from(state.activeCategories).filter((category) => categories.includes(category)));
    if (state.activeCategories.size === 0) state.activeCategories = new Set(categories);
  }
}

function getAllCategories() {
  return Array.from(new Set(state.cards.map((card) => card.category))).filter(Boolean);
}

function renderCategoryChips() {
  el.categoryChips.innerHTML = "";
  getAllCategories().forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "category-chip";
    button.textContent = category;
    button.classList.toggle("is-active", state.activeCategories.has(category));
    button.addEventListener("click", () => {
      if (state.activeCategories.has(category)) {
        if (state.activeCategories.size === 1) {
          showToast("最低1カテゴリは残す");
          return;
        }
        state.activeCategories.delete(category);
      } else {
        state.activeCategories.add(category);
      }
      saveSet(STORAGE.categories, state.activeCategories);
      renderCategoryChips();
    });
    el.categoryChips.appendChild(button);
  });
}

function showMainScreen() {
  el.startScreen.classList.remove("is-active");
  el.mainScreen.classList.add("is-active");
}

function getAvailableCards() {
  return state.cards.filter((card) => {
    if (state.removed.has(card.id)) return false;
    if (!state.activeCategories.has(card.category)) return false;
    if (state.mode === "question" && card.type !== "質問") return false;
    if (state.mode === "mission" && card.type !== "ミッション") return false;
    return true;
  });
}

function drawRandomCard() {
  hideChoices();
  const available = getAvailableCards();
  if (available.length === 0) {
    showEmptyCard();
    return;
  }

  let pool = available;
  if (available.length > 1 && state.lastCardId) {
    pool = available.filter((card) => card.id !== state.lastCardId);
  }

  const card = pool[Math.floor(Math.random() * pool.length)];
  showCard(card);
}

function showThreeChoices() {
  const available = shuffle(getAvailableCards()).slice(0, 3);
  if (available.length === 0) {
    showEmptyCard();
    return;
  }

  el.choiceList.innerHTML = "";
  available.forEach((card) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button";
    button.textContent = card.text;
    button.addEventListener("click", () => {
      showCard(card);
      hideChoices();
    });
    el.choiceList.appendChild(button);
  });
  el.choiceArea.hidden = false;
}

function hideChoices() {
  el.choiceArea.hidden = true;
  el.choiceList.innerHTML = "";
}

function showCard(card) {
  state.currentCard = card;
  state.lastCardId = card.id;
  el.cardType.textContent = card.type === "ミッション" ? "Mission" : "Question";
  el.cardLevel.textContent = displayLevel(card.level);
  el.cardText.textContent = card.text;
  el.cardCategory.textContent = `${card.category} / ${card.risk} / ${card.id}`;
  el.favoriteButton.textContent = state.favorites.has(card.id) ? "お気に入り済み" : "お気に入り";
  el.card.classList.remove("is-flipping");
  void el.card.offsetWidth;
  el.card.classList.add("is-flipping");
}

function showEmptyCard() {
  state.currentCard = null;
  el.cardType.textContent = "Empty";
  el.cardLevel.textContent = "Free";
  el.cardText.textContent = "出せるカードがない";
  el.cardCategory.textContent = "カテゴリか外したカードを戻す。";
  el.favoriteButton.textContent = "お気に入り";
}

function displayLevel(level) {
  if (level === "soft") return "Soft";
  if (level === "NORMAL") return "Normal";
  if (level === "HARD") return "Hard";
  if (level === "veryHARD") return "Very Hard";
  return level || "Free";
}

function toggleFavoriteCurrent() {
  if (!state.currentCard) {
    showToast("先にカードを引く");
    return;
  }
  const id = state.currentCard.id;
  if (state.favorites.has(id)) {
    state.favorites.delete(id);
    showToast("お気に入りから外した");
  } else {
    state.favorites.add(id);
    showToast("お気に入りに入れた");
  }
  saveSet(STORAGE.favorites, state.favorites);
  showCard(state.currentCard);
  renderPanel();
}

function removeCurrentCard() {
  if (!state.currentCard) {
    showToast("先にカードを引く");
    return;
  }
  state.removed.add(state.currentCard.id);
  saveSet(STORAGE.removed, state.removed);
  renderPanel();
  showToast("このカードを外した");
  drawRandomCard();
}

function renderPanel() {
  const favoriteCards = state.cards.filter((card) => state.favorites.has(card.id));
  const removedCards = state.cards.filter((card) => state.removed.has(card.id));
  el.favoriteCount.textContent = String(favoriteCards.length);
  el.removedCount.textContent = String(removedCards.length);
  renderMiniList(el.favoriteList, favoriteCards, "まだなし", "外す", (card) => {
    state.favorites.delete(card.id);
    saveSet(STORAGE.favorites, state.favorites);
    renderPanel();
    if (state.currentCard?.id === card.id) showCard(card);
  });
  renderMiniList(el.removedList, removedCards, "まだなし", "戻す", (card) => {
    state.removed.delete(card.id);
    saveSet(STORAGE.removed, state.removed);
    renderPanel();
  });
}

function renderMiniList(target, cards, emptyText, buttonText, onClick) {
  target.innerHTML = "";
  target.classList.toggle("empty", cards.length === 0);
  if (cards.length === 0) {
    target.textContent = emptyText;
    return;
  }

  cards.forEach((card) => {
    const item = document.createElement("div");
    item.className = "mini-item";
    const text = document.createElement("p");
    text.textContent = card.text;
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = buttonText;
    button.addEventListener("click", () => onClick(card));
    item.append(text, button);
    target.appendChild(item);
  });
}

function openPanel() {
  renderPanel();
  el.sidePanel.classList.add("is-open");
  el.sidePanel.setAttribute("aria-hidden", "false");
}

function closePanel() {
  el.sidePanel.classList.remove("is-open");
  el.sidePanel.setAttribute("aria-hidden", "true");
}

function shuffle(array) {
  const copied = [...array];
  for (let i = copied.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }
  return copied;
}

let toastTimer = null;
function showToast(message) {
  el.toast.textContent = message;
  el.toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    el.toast.classList.remove("is-visible");
  }, 1800);
}
