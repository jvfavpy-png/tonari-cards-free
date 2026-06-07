
"use strict";

/* Tonari Cards Free v1.0.6 */

const CSV_FILE_NAME = "questions_free_30.csv";
const FREE_CSV_TEXT = String.raw`ID,カード種別,カテゴリ,危険度,攻め度,質問,メモ
Q001,質問,もしも,日中向け,soft,明日から1週間だけ仕事も予定も全部なくなったら\nまず何をする？,無料版
Q002,質問,もしも,日中向け,soft,宝くじで3億円当たったら\n誰にも言わずに最初に何を買う？,無料版
Q004,質問,もしも,日中向け,soft,これから一生タダになるなら\n外食・旅行・服・家電のどれがいい？,無料版
Q007,質問,もしも,日中向け,soft,相手と中身が1日入れ替わったら\nまず何を確認する？,無料版
Q031,質問,究極の二択,夜向け,NORMAL,一生ラーメン禁止か\n一生寿司禁止なら\nどっちがきつい？,無料版
Q034,質問,究極の二択,夜向け,NORMAL,一生旅行に行けない代わりに豪邸\n家は普通だけど毎月旅行\nどっちがいい？,無料版
Q035,質問,究極の二択,夜向け,NORMAL,どれだけ食べても太らない体\n毎日8時間ぐっすり眠れる体\nどっちがほしい？,無料版
Q040,質問,究極の二択,深夜向け,NORMAL,喧嘩してもすぐ仲直りできる関係\n喧嘩は少ないけど本音も少ない関係\nどっちがいい？,無料版
Q061,質問,暴露,深夜向け,NORMAL,今だから言える\n初対面の正直な印象は？,無料版
Q065,質問,暴露,夜向け,NORMAL,相手に言われて\n実はかなり嬉しかった一言は？,無料版
Q067,質問,暴露,深夜向け,NORMAL,付き合う前\n相手のどこをいちばん見ていた？,無料版
Q091,質問,黒歴史と学生時代,夜向け,NORMAL,学生時代の自分に\nキャッチコピーをつけるなら？,無料版
Q092,質問,黒歴史と学生時代,夜向け,NORMAL,今思うといちばん痛かった\n当時のファッションは？,無料版
Q096,質問,黒歴史と学生時代,夜向け,NORMAL,修学旅行や遠足で\nいちばん覚えている事件は？,無料版
Q121,質問,恋愛の本音,夜向け,NORMAL,付き合う前に\nいちばんドキッとした瞬間は？,無料版
Q122,質問,恋愛の本音,夜向け,NORMAL,相手のどんな仕草を見ると\n今でもいいなと思う？,無料版
Q123,質問,恋愛の本音,夜向け,NORMAL,「好き」と言葉で言われること\n行動で示されること\nどっちが刺さる？,無料版
Q124,質問,恋愛の本音,夜向け,NORMAL,恋人にされると\nいちばん安心することは？,無料版
Q130,質問,恋愛の本音,夜向け,NORMAL,デートでいちばん大事なのは\n場所・会話・雰囲気のどれ？,無料版
Q211,質問,デートと旅行,日中向け,soft,今すぐ行けるなら\n日帰りでどこに行きたい？,無料版
Q212,質問,デートと旅行,日中向け,soft,旅行でいちばん\nテンションが上がる瞬間は？,無料版
Q216,質問,デートと旅行,日中向け,soft,温泉旅行でいちばん\n楽しみにすることは？,無料版
Q217,質問,デートと旅行,日中向け,soft,旅行中\n相手のどんな行動を見ると嬉しい？,無料版
Q272,質問,推しとランキング,日中向け,soft,相手の好きなところで\nランキング1位にするなら？,無料版
Q273,質問,推しとランキング,日中向け,soft,今まで行った場所で\n楽しかったランキング1位は？,無料版
Q331,質問,相手当てクイズ,日中向け,soft,相手が今いちばん食べたいもの\n何だと思う？,無料版
M003,ミッション,恋愛の本音,夜向け,NORMAL,相手の好きなところを\n3つ言う,無料版
M028,ミッション,恋愛の本音,夜向け,NORMAL,相手の好きなところを\n外見以外で3つ言う,無料版
M034,ミッション,デートと旅行,日中向け,soft,今日の相手を\n一言で褒める,無料版
M035,ミッション,デートと旅行,日中向け,soft,次のカードまで\nスマホを置く,無料版`;
const RECENT_HISTORY_LIMIT = 20;
const STORAGE_KEY_PREFIX = "tonariCardsFree";
const STORAGE_KEYS = {
  categoryEnabled: `${STORAGE_KEY_PREFIX}.categoryEnabled.v3`,
  favorites: `${STORAGE_KEY_PREFIX}.favorites.v3`,
  hidden: `${STORAGE_KEY_PREFIX}.hidden.v3`,
  cardType: `${STORAGE_KEY_PREFIX}.cardType.v3`
};
const CARD_TYPE = { QUESTION: "質問", MISSION: "ミッション" };
const CARD_TYPE_LABELS = { all: "Mix", questions: "Question", missions: "Mission" };
const DANGER_META = {
  "日中向け": { label: "日中向け", dangerClass: "danger-light" },
  "夜向け": { label: "夜向け", dangerClass: "danger-normal" },
  "深夜向け": { label: "深夜向け", dangerClass: "danger-danger" },
  "明け方向け": { label: "明け方向け", dangerClass: "danger-night" },
  "軽め": { label: "日中向け", dangerClass: "danger-light" },
  "普通": { label: "夜向け", dangerClass: "danger-normal" },
  "危険": { label: "深夜向け", dangerClass: "danger-danger" },
  "深夜限定": { label: "明け方向け", dangerClass: "danger-night" }
};
const CATEGORY_META = {
  "もしも": { fallbackDanger: "日中向け", description: "ゆるく話せる" },
  "デートと旅行": { fallbackDanger: "日中向け", description: "次の行き先の話もできる" },
  "推しとランキング": { fallbackDanger: "日中向け", description: "好きなものが見えてくる" },
  "相手当てクイズ": { fallbackDanger: "日中向け", description: "どれだけ分かってるか試せる" },
  "究極の二択": { fallbackDanger: "夜向け", description: "選ぶだけで話が転がる" },
  "黒歴史と学生時代": { fallbackDanger: "夜向け", description: "昔の話でちょっと笑える" },
  "恋愛の本音": { fallbackDanger: "夜向け", description: "少し本音寄り" },
  "暴露": { fallbackDanger: "深夜向け", description: "少しだけ本音が出る" }
};
const PLAY_CONFIG = {
  temperature: {
    title: "温度で選ぶ",
    description: "今の空気に合わせて選ぶ。",
    modes: {
      light: { label: "日中用", description: "軽く話せるカード", categories: ["もしも", "デートと旅行", "推しとランキング", "相手当てクイズ"] },
      normal: { label: "夜用", description: "少し本音寄り", categories: ["究極の二択", "黒歴史と学生時代", "恋愛の本音", "暴露"] },
      deep: { label: "少し深め", description: "本音が出やすいカード", categories: ["恋愛の本音", "暴露", "究極の二択"] }
    }
  },
  fate: {
    title: "運命に任せる",
    description: "テーマだけ決めて、あとはカード任せ。",
    modes: {
      sweet: { label: "甘め", description: "少し照れるカード", categories: ["恋愛の本音", "デートと旅行"] },
      drink: { label: "盛り上がる", description: "笑いながらテンポよく", categories: ["究極の二択", "もしも", "黒歴史と学生時代", "推しとランキング"] },
      secret: { label: "小さな本音", description: "軽い暴露も少し", categories: ["暴露", "相手当てクイズ", "恋愛の本音"] }
    }
  },
  mood: {
    title: "気分で選ぶ",
    description: "今の気分で選ぶ。",
    modes: {
      laugh: { label: "笑いたい", description: "軽く笑いたいとき", categories: ["もしも", "究極の二択", "黒歴史と学生時代", "推しとランキング"] },
      closer: { label: "仲良くなりたい", description: "相手のことを少し知る", categories: ["恋愛の本音", "デートと旅行", "相手当てクイズ"] },
      trip: { label: "旅行の話をしたい", description: "次の予定にもつながる", categories: ["デートと旅行", "もしも", "推しとランキング"] }
    }
  }
};

const state = {
  allCards: [],
  cardsByCategory: new Map(),
  categoryEnabled: {},
  favorites: new Set(),
  hiddenCards: new Set(),
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
  elements.startButton.addEventListener("click", () => showScreen("topScreen"));
  document.querySelectorAll("[data-play-type]").forEach((button) => button.addEventListener("click", () => openModeSelect(button.dataset.playType)));
  elements.openSettingsButton.addEventListener("click", () => { renderCategorySettings(); showScreen("settingsScreen"); });
  elements.showFavoritesButton.addEventListener("click", () => { renderFavorites(); showScreen("favoriteScreen"); });
  elements.openHiddenCardsButton.addEventListener("click", () => { renderHiddenCards(); showScreen("hiddenScreen"); });
  elements.backToTopFromSettings.addEventListener("click", () => showScreen("topScreen"));
  elements.backToTopFromFavorites.addEventListener("click", () => showScreen("topScreen"));
  elements.backToSettingsFromHidden.addEventListener("click", () => { renderCategorySettings(); showScreen("settingsScreen"); });
  elements.backToSettingsFromHiddenBottom.addEventListener("click", () => { renderCategorySettings(); showScreen("settingsScreen"); });
  elements.backToTopFromMode.addEventListener("click", () => showScreen("topScreen"));
  elements.backToModeFromDrawChoice.addEventListener("click", () => showScreen("modeScreen"));
  elements.backToDrawChoiceFromCandidate.addEventListener("click", () => showScreen("drawChoiceScreen"));
  elements.backToModeFromQuestion.addEventListener("click", () => showScreen("modeScreen"));
  elements.enableAllCategories.addEventListener("click", enableAllCategories);
  elements.resetHiddenCards.addEventListener("click", resetHiddenCards);
  elements.restoreAllHiddenCards.addEventListener("click", resetHiddenCards);
  elements.resetSavedData.addEventListener("click", resetSavedData);
  elements.cardTypeInputs.forEach((input) => input.addEventListener("change", () => {
    if (!input.checked) return;
    state.cardType = input.value;
    saveCardType();
    refreshAvailableChoices();
    syncCardTypeHelp();
    refreshCurrentScreenAfterFilterChange("変更しました。");
  }));
  elements.quickDrawButton.addEventListener("click", () => { state.currentDrawType = "quick"; quickDrawCard("このカードはどう？"); });
  elements.candidateDrawButton.addEventListener("click", () => { state.currentDrawType = "candidate"; showCandidateCards("中身はまだ秘密。気になるカードを選ぶ。"); });
  elements.reshuffleCandidates.addEventListener("click", () => showCandidateCards("別の候補にしました。"));
  elements.nextCardButton.addEventListener("click", () => state.currentDrawType === "quick" ? quickDrawCard("もう1枚。") : showCandidateCards("次はどのカードにする？"));
  elements.passButton.addEventListener("click", () => state.currentDrawType === "quick" ? quickDrawCard("無理せずパス。別のカードへ。") : showCandidateCards("無理せずパス。別のカードへ。"));
  elements.favoriteButton.addEventListener("click", toggleFavoriteForCurrentCard);
  elements.hideQuestionButton.addEventListener("click", hideCurrentCard);
  elements.csvFileInput.addEventListener("change", handleCsvFileSelected);
  elements.cancelAdultMode.addEventListener("click", closeAdultModal);
  elements.confirmAdultMode.addEventListener("click", closeAdultModal);
  elements.cancelAttackMode.addEventListener("click", closeAttackModal);
  elements.confirmAttackMode.addEventListener("click", closeAttackModal);
}

async function fetchCsvText() {
  try {
    const response = await fetch(CSV_FILE_NAME, { cache: "no-store" });
    if (!response.ok) throw new Error("CSVが見つかりません。ファイル名を確認してください。");
    return await response.text();
  } catch (_error) {
    return FREE_CSV_TEXT;
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
      showScreen("titleScreen");
    } catch (error) { showCsvError(error); }
  };
  reader.onerror = () => showCsvError(new Error("そのCSVは読み込めませんでした。"));
  reader.readAsText(file, "UTF-8");
}

function loadCardsFromCsvText(csvText) {
  const rows = parseCsv(csvText);
  if (rows.length < 2) throw new Error("CSVにカードが入っていません。1行目を確認してください。");
  const header = rows[0].map(normalizeText);
  const idIndex = header.indexOf("ID");
  const typeIndex = header.indexOf("カード種別");
  const categoryIndex = header.indexOf("カテゴリ");
  const dangerIndex = header.indexOf("危険度");
  const questionIndex = header.indexOf("質問");
  if (categoryIndex === -1 || questionIndex === -1) throw new Error("CSVの1行目に「カテゴリ」と「質問」が必要です。");
  const cards = [];
  const seenIds = new Set();
  for (let i = 1; i < rows.length; i += 1) {
    const row = rows[i];
    if (!row || row.every((cell) => normalizeText(cell) === "")) continue;
    const category = normalizeText(row[categoryIndex]);
    const question = normalizeCardText(row[questionIndex]);
    if (!category || !question) continue;
    const type = normalizeCardType(typeIndex >= 0 ? row[typeIndex] : "");
    const danger = normalizeDanger(dangerIndex >= 0 ? row[dangerIndex] : getCategoryFallbackDanger(category));
    let id = idIndex >= 0 ? normalizeText(row[idIndex]) : `${type}-${i}`;
    if (!id) id = `${type}-${i}`;
    if (seenIds.has(id)) id = `${id}-${i}`;
    seenIds.add(id);
    cards.push({ id, type, category, danger, question });
  }
  if (cards.length === 0) throw new Error("使えるカードが見つかりません。CSVのカテゴリと質問を確認してください。");
  state.allCards = cards;
  state.cardsByCategory = buildCardMap(cards);
  setupDefaultCategoryEnabled();
  state.recentCardIds = [];
  state.recentCategories = [];
  state.lastCardId = null;
  state.currentCard = null;
}

function parseCsv(text) {
  const cleanText = String(text || "").replace(/^﻿/, "");
  const rows = [];
  let row = [];
  let value = "";
  let insideQuotes = false;
  for (let i = 0; i < cleanText.length; i += 1) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];
    if (char === '"') {
      if (insideQuotes && nextChar === '"') { value += '"'; i += 1; }
      else insideQuotes = !insideQuotes;
      continue;
    }
    if (char === "," && !insideQuotes) { row.push(value); value = ""; continue; }
    if ((char === "\n" || char === "\n") && !insideQuotes) {
      if (char === "\n" && nextChar === "\n") i += 1;
      row.push(value); rows.push(row); row = []; value = ""; continue;
    }
    value += char;
  }
  row.push(value); rows.push(row);
  return rows;
}

function buildCardMap(cards) {
  const map = new Map();
  cards.forEach((card) => {
    if (!map.has(card.category)) map.set(card.category, []);
    map.get(card.category).push(card);
  });
  return map;
}
function normalizeText(value) { return String(value || "").replace(/^﻿/, "").replace(/^[\s　]+|[\s　]+$/g, ""); }
function normalizeCardText(value) { return normalizeText(value).replace(/\\n/g, "\n").replace(/[\t ]+\n/g, "\n").replace(/\n[\t ]+/g, "\n").replace(/\n{3,}/g, "\n\n"); }
function normalizeDanger(value) { const text = normalizeText(value); return DANGER_META[text] ? text : "夜向け"; }
function normalizeCardType(value) { return normalizeText(value) === CARD_TYPE.MISSION ? CARD_TYPE.MISSION : CARD_TYPE.QUESTION; }
function getCategoryFallbackDanger(category) { return CATEGORY_META[category]?.fallbackDanger || "夜向け"; }
function getCategoryLabel(category) { return category; }

function showScreen(screenKey) {
  const screenMap = { loadingScreen: elements.loadingScreen, titleScreen: elements.titleScreen, errorScreen: elements.errorScreen, topScreen: elements.topScreen, settingsScreen: elements.settingsScreen, hiddenScreen: elements.hiddenScreen, favoriteScreen: elements.favoriteScreen, modeScreen: elements.modeScreen, drawChoiceScreen: elements.drawChoiceScreen, candidateScreen: elements.candidateScreen, questionScreen: elements.questionScreen };
  Object.values(screenMap).forEach((screen) => screen.classList.remove("active"));
  screenMap[screenKey].classList.add("active");
  document.body.classList.toggle("title-active", screenKey === "titleScreen" || screenKey === "loadingScreen");
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function showCsvError(error) { elements.errorMessage.textContent = error.message || "読み込めませんでした。"; showScreen("errorScreen"); }
function syncSettingsToUI() {
  elements.adultToggle.checked = false;
  elements.attackToggle.checked = false;
  elements.adultToggle.disabled = true;
  elements.attackToggle.disabled = true;
  elements.attackPanel.classList.add("visible");
  refreshCardTypeChoices();
  elements.cardTypeInputs.forEach((input) => input.checked = input.value === state.cardType);
  syncCardTypeHelp();
  refreshTopPlayChoices();
}
function syncCardTypeHelp() {
  const label = CARD_TYPE_LABELS[state.cardType] || CARD_TYPE_LABELS.all;
  const helpMap = { all: "QuestionとMissionが混ざります。", questions: "質問だけ出します。", missions: "ミッションだけ出します。" };
  elements.cardTypeHelp.textContent = `${label}：${helpMap[state.cardType] || helpMap.all}`;
}

function openModeSelect(playTypeKey) {
  const playType = PLAY_CONFIG[playTypeKey];
  if (!playType) return;
  state.currentPlayTypeKey = playTypeKey;
  state.currentModeKey = null;
  state.currentMode = null;
  elements.modeTitle.textContent = playType.title;
  elements.modeDescription.textContent = playType.description;
  elements.modeButtonList.innerHTML = "";
  const modes = getAvailableModesForPlayType(playTypeKey);
  if (modes.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-card";
    empty.textContent = "この組み合わせではカードが出ません。Mixにするか、出すカードを戻してください。";
    elements.modeButtonList.appendChild(empty);
  }
  modes.forEach(([modeKey, mode]) => {
    const button = document.createElement("button");
    button.className = "mode-button";
    button.type = "button";
    button.innerHTML = `<span>${escapeHtml(mode.label)}</span><small>${escapeHtml(mode.description)}</small>`;
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
  elements.drawChoiceDescription.textContent = "すぐ見るなら一発で。迷うなら候補から。";
  showScreen("drawChoiceScreen");
}
function getAvailableModesForPlayType(playTypeKey) {
  const playType = PLAY_CONFIG[playTypeKey];
  if (!playType) return [];
  return Object.entries(playType.modes).filter(([_modeKey, mode]) => mode.categories.some((category) => isCategoryAvailable(category)));
}
function hasAvailableMode(playTypeKey) { return getAvailableModesForPlayType(playTypeKey).length > 0; }
function refreshTopPlayChoices() {
  const buttons = document.querySelectorAll("[data-play-type]");
  let visibleCount = 0;
  buttons.forEach((button) => {
    const canUse = hasAvailableMode(button.dataset.playType);
    button.classList.toggle("is-hidden", !canUse);
    if (canUse) visibleCount += 1;
  });
  elements.topAvailabilityHelp.textContent = visibleCount === 0 ? "この組み合わせではカードが出ません。Mixにするか、出すカードを戻してください。" : "";
}
function refreshAvailableChoices() { refreshCardTypeChoices(); refreshTopPlayChoices(); syncCardTypeHelp(); }
function refreshCardTypeChoices() {
  const availableTypes = ["all", "questions", "missions"].filter((type) => hasAnyCardForType(type));
  if (!availableTypes.includes(state.cardType)) { state.cardType = availableTypes.includes("all") ? "all" : (availableTypes[0] || "all"); saveCardType(); }
  elements.cardTypeInputs.forEach((input) => {
    const label = input.closest("label");
    const canUse = availableTypes.includes(input.value);
    if (label) label.classList.toggle("is-hidden", !canUse);
    input.disabled = !canUse;
    input.checked = input.value === state.cardType;
  });
}
function hasAnyCardForType(cardType) { return state.allCards.some((card) => isCardAllowedForType(card, cardType)); }
function isCategoryAvailable(category) {
  if (state.categoryEnabled[category] === false) return false;
  const cards = state.cardsByCategory.get(category) || [];
  return cards.some((card) => isCardAllowed(card));
}
function isCardAllowed(card) { return isCardAllowedForType(card, state.cardType); }
function isCardAllowedForType(card, cardType) {
  if (!card || state.hiddenCards.has(card.id)) return false;
  if (cardType === "questions" && card.type !== CARD_TYPE.QUESTION) return false;
  if (cardType === "missions" && card.type !== CARD_TYPE.MISSION) return false;
  return true;
}
function getAvailableCategoriesForCurrentMode() {
  if (!state.currentMode) return [];
  return state.currentMode.categories.map(normalizeText).filter(isCategoryAvailable);
}
function showCandidateCards(message) {
  if (state.isBusy || !state.currentMode) return;
  setBusy(true);
  const categories = getAvailableCategoriesForCurrentMode();
  elements.candidateList.innerHTML = "";
  elements.candidateNotice.textContent = message || "";
  if (categories.length === 0) {
    elements.candidateNotice.textContent = "この組み合わせではカードが出ません。条件を少し戻してください。";
    showScreen("candidateScreen");
    setBusy(false);
    return;
  }
  pickCandidateCategories(categories).forEach((category) => elements.candidateList.appendChild(createCandidateButton(category)));
  showScreen("candidateScreen");
  window.setTimeout(() => setBusy(false), 180);
}
function pickCandidateCategories(categories) {
  const unique = Array.from(new Set(categories));
  const blocked = getBlockedCategoryByStreak();
  const pool = blocked && unique.length >= 2 ? unique.filter((category) => category !== blocked) : unique;
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
  const cards = (state.cardsByCategory.get(category) || []).filter(isCardAllowed);
  const hasMission = cards.some((card) => card.type === CARD_TYPE.MISSION);
  const button = document.createElement("button");
  button.type = "button";
  button.className = `candidate-card ${meta.dangerClass}${hasMission ? " candidate-card--mission" : ""}`;
  const typeLabel = hasMission && state.cardType !== "questions" ? "ミッションあり" : "質問";
  button.innerHTML = `<div class="candidate-meta"><span class="candidate-category">${escapeHtml(getCategoryLabel(category))}</span><span class="type-pill">${escapeHtml(typeLabel)}</span><span class="danger-pill">${escapeHtml(meta.dangerLabel)}</span></div><p class="candidate-desc">${escapeHtml(meta.description)}</p>`;
  button.addEventListener("click", () => selectCandidateCategory(category));
  return button;
}
function selectCandidateCategory(category) {
  if (state.isBusy) return;
  const card = pickCardFromCategory(category);
  if (!card) { elements.candidateNotice.textContent = "このカードは今出せません。"; return; }
  showCard(card, "このカードはどう？");
}
function quickDrawCard(message) {
  if (state.isBusy || !state.currentMode) return;
  const categories = getAvailableCategoriesForCurrentMode();
  if (categories.length === 0) { elements.candidateNotice.textContent = "この組み合わせではカードが出ません。条件を少し戻してください。"; showScreen("candidateScreen"); return; }
  const blocked = getBlockedCategoryByStreak();
  const pool = blocked && categories.length >= 2 ? categories.filter((category) => category !== blocked) : categories;
  for (const category of shuffleArray(pool)) {
    const card = pickCardFromCategory(category);
    if (card) { showCard(card, message || "このカードはどう？"); return; }
  }
  state.recentCardIds = [];
  const retry = pickCardFromCategory(randomItem(pool));
  retry ? showCard(retry, message || "このカードはどう？") : (elements.candidateNotice.textContent = "カードが見つかりません。外したカードを戻すと出る場合があります。", showScreen("candidateScreen"));
}
function pickCardFromCategory(category) {
  const cards = (state.cardsByCategory.get(category) || []).filter(isCardAllowed);
  if (cards.length === 0) return null;
  let pool = cards.filter((card) => !state.recentCardIds.includes(card.id) && card.id !== state.lastCardId);
  if (pool.length === 0) { state.recentCardIds = []; pool = cards.filter((card) => card.id !== state.lastCardId); }
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
  applyQuestionTextFit(card.question);
  elements.questionStatus.textContent = statusText || getDefaultStatus(card);
  elements.questionCard.className = `question-card ${meta.dangerClass}${card.type === CARD_TYPE.MISSION ? " question-card--mission" : ""}`;
  void elements.questionCard.offsetWidth;
  elements.questionCard.classList.add("flip");
  updateQuestionActionButtons();
  showScreen("questionScreen");
}
function applyQuestionTextFit(text) {
  const normalized = String(text || "");
  const plainLength = normalized.replace(/\s/g, "").length;
  const lineCount = normalized.split("\n").length;
  elements.questionText.classList.remove("text-medium", "text-long", "text-xlong");
  if (plainLength >= 54 || lineCount >= 4) elements.questionText.classList.add("text-xlong");
  else if (plainLength >= 42 || lineCount >= 3) elements.questionText.classList.add("text-long");
  else if (plainLength >= 32) elements.questionText.classList.add("text-medium");
}
function getDefaultStatus(card) { return card.type === CARD_TYPE.MISSION ? "無理なカードはパスでOK。進めるかどうかは、ふたりで決めて大丈夫。" : "無理なカードはパスでOK。今日は話さないのもアリ。"; }
function addRecentCard(cardId) { state.recentCardIds.push(cardId); while (state.recentCardIds.length > RECENT_HISTORY_LIMIT) state.recentCardIds.shift(); }
function addRecentCategory(category) { state.recentCategories.push(category); while (state.recentCategories.length > 10) state.recentCategories.shift(); }

function renderCategorySettings() {
  elements.categoryToggleList.innerHTML = "";
  showSettingsStatus(`外したカード：${state.hiddenCards.size}枚 / お気に入り：${state.favorites.size}枚`);
  getAllKnownCategories().forEach((category) => {
    const meta = getCategoryDisplayMeta(category);
    const count = (state.cardsByCategory.get(category) || []).length;
    const isEnabled = state.categoryEnabled[category] !== false;
    const item = document.createElement("label");
    item.className = `setting-row ${meta.dangerClass}`;
    item.innerHTML = `<span class="setting-row__main"><span class="setting-row__title">${escapeHtml(getCategoryLabel(category))}</span><span class="setting-row__desc">${escapeHtml(meta.description)} / ${count}枚</span></span><span class="setting-toggle"><input type="checkbox" ${isEnabled ? "checked" : ""} /><span></span></span>`;
    item.querySelector("input").addEventListener("change", (event) => { state.categoryEnabled[category] = event.target.checked; saveCategoryEnabled(); refreshAvailableChoices(); });
    elements.categoryToggleList.appendChild(item);
  });
}
function getAllKnownCategories() { return Array.from(state.cardsByCategory.keys()); }
function setupDefaultCategoryEnabled() { getAllKnownCategories().forEach((category) => { if (typeof state.categoryEnabled[category] !== "boolean") state.categoryEnabled[category] = true; }); saveCategoryEnabled(); }
function enableAllCategories() { getAllKnownCategories().forEach((category) => state.categoryEnabled[category] = true); saveCategoryEnabled(); refreshAvailableChoices(); renderCategorySettings(); }
function resetHiddenCards() {
  if (state.hiddenCards.size === 0) { showSettingsStatus("外したカードはまだありません。"); if (elements.hiddenScreen.classList.contains("active")) renderHiddenCards(); return; }
  if (!window.confirm("外したカードをすべて戻しますか？\nお気に入りはそのまま残ります。")) return;
  state.hiddenCards.clear();
  saveHiddenCards();
  state.recentCardIds = [];
  refreshAvailableChoices();
  showSettingsStatus("外したカードをすべて戻しました。");
  elements.hiddenScreen.classList.contains("active") ? renderHiddenCards() : renderCategorySettings();
}
function resetSavedData() {
  if (!window.confirm("お気に入り・外したカード・ON/OFFを初期状態に戻しますか？\nCSVのカード自体は消えません。")) return;
  state.categoryEnabled = {};
  state.favorites.clear();
  state.hiddenCards.clear();
  state.cardType = "all";
  state.recentCardIds = [];
  state.recentCategories = [];
  state.lastCardId = null;
  state.currentCard = null;
  setupDefaultCategoryEnabled();
  saveFavorites(); saveHiddenCards(); saveCardType(); syncSettingsToUI(); renderCategorySettings(); showSettingsStatus("初期状態に戻しました。");
}
function showSettingsStatus(message) { elements.settingsStatus.textContent = message || ""; }

function toggleFavoriteForCurrentCard() {
  if (!state.currentCard) return;
  if (state.favorites.has(state.currentCard.id)) { state.favorites.delete(state.currentCard.id); elements.questionStatus.textContent = "お気に入りから外しました。"; }
  else { state.favorites.add(state.currentCard.id); elements.questionStatus.textContent = "お気に入りに入れました。"; }
  saveFavorites(); updateQuestionActionButtons();
}
function hideCurrentCard() {
  if (!state.currentCard) return;
  if (state.pendingHideCardId !== state.currentCard.id) {
    state.pendingHideCardId = state.currentCard.id;
    elements.hideQuestionButton.textContent = "もう一度で外す";
    elements.questionStatus.textContent = "もう一度押すと、このカードは出なくなります。";
    window.clearTimeout(state.hideConfirmTimer);
    state.hideConfirmTimer = window.setTimeout(() => { state.pendingHideCardId = null; updateQuestionActionButtons(); }, 2500);
    return;
  }
  window.clearTimeout(state.hideConfirmTimer);
  state.pendingHideCardId = null;
  state.hiddenCards.add(state.currentCard.id);
  state.favorites.delete(state.currentCard.id);
  saveHiddenCards(); saveFavorites();
  state.currentDrawType === "quick" ? quickDrawCard("このカードは外しました。別のカードへ。") : showCandidateCards("このカードは外しました。別のカードへ。");
}
function updateQuestionActionButtons() { if (!state.currentCard) return; elements.favoriteButton.textContent = state.favorites.has(state.currentCard.id) ? "お気に入り済み" : "お気に入り"; elements.hideQuestionButton.textContent = "外す"; }
function renderFavorites() {
  const favoriteCards = state.allCards.filter((card) => state.favorites.has(card.id));
  elements.favoriteList.innerHTML = "";
  if (favoriteCards.length === 0) { const empty = document.createElement("div"); empty.className = "empty-card"; empty.textContent = "お気に入りはまだ空です。気に入ったカードはここに残ります。"; elements.favoriteList.appendChild(empty); return; }
  favoriteCards.forEach((card) => elements.favoriteList.appendChild(createSavedCardItem(card, "お気に入りから外す", () => { state.favorites.delete(card.id); saveFavorites(); renderFavorites(); })));
}
function renderHiddenCards() {
  const hiddenCards = state.allCards.filter((card) => state.hiddenCards.has(card.id));
  elements.hiddenList.innerHTML = "";
  if (hiddenCards.length === 0) { const empty = document.createElement("div"); empty.className = "empty-card"; empty.textContent = "外したカードはまだありません。"; elements.hiddenList.appendChild(empty); return; }
  hiddenCards.forEach((card) => elements.hiddenList.appendChild(createSavedCardItem(card, "また出す", () => { state.hiddenCards.delete(card.id); saveHiddenCards(); refreshAvailableChoices(); renderHiddenCards(); })));
}
function createSavedCardItem(card, buttonText, onClick) {
  const meta = getCardDisplayMeta(card);
  const item = document.createElement("div");
  item.className = `favorite-card ${meta.dangerClass}${card.type === CARD_TYPE.MISSION ? " favorite-card--mission" : ""}`;
  item.innerHTML = `<div class="candidate-meta"><span class="type-pill">${escapeHtml(card.type)}</span><span class="candidate-category">${escapeHtml(getCategoryLabel(card.category))}</span><span class="danger-pill">${escapeHtml(meta.dangerLabel)}</span></div><p>${escapeHtml(card.question)}</p><button class="ghost-button full-width" type="button">${escapeHtml(buttonText)}</button>`;
  item.querySelector("button").addEventListener("click", onClick);
  return item;
}
function getCategoryDisplayMeta(category) {
  const categoryMeta = CATEGORY_META[category] || { fallbackDanger: "夜向け", description: "カード" };
  const dangerMeta = DANGER_META[categoryMeta.fallbackDanger] || DANGER_META["夜向け"];
  return { description: categoryMeta.description, dangerLabel: dangerMeta.label, dangerClass: dangerMeta.dangerClass };
}
function getCardDisplayMeta(card) { const dangerMeta = DANGER_META[card.danger] || DANGER_META[getCategoryFallbackDanger(card.category)] || DANGER_META["夜向け"]; return { dangerLabel: dangerMeta.label, dangerClass: dangerMeta.dangerClass }; }
function refreshCurrentScreenAfterFilterChange(message) {
  refreshAvailableChoices();
  if (elements.settingsScreen.classList.contains("active")) renderCategorySettings();
  if (elements.modeScreen.classList.contains("active")) { openModeSelect(state.currentPlayTypeKey); return; }
  if (elements.candidateScreen.classList.contains("active")) showCandidateCards(message || "今の設定に合わせました。");
  if (elements.questionScreen.classList.contains("active") && state.currentCard && !isCardAllowed(state.currentCard)) { state.currentDrawType === "quick" ? quickDrawCard(message || "今の設定に合わせました。") : showCandidateCards(message || "今の設定に合わせました。"); }
}
function openAdultModal() { elements.adultModal.classList.add("active"); elements.adultModal.setAttribute("aria-hidden", "false"); }
function closeAdultModal() { elements.adultModal.classList.remove("active"); elements.adultModal.setAttribute("aria-hidden", "true"); }
function openAttackModal() { elements.attackModal.classList.add("active"); elements.attackModal.setAttribute("aria-hidden", "false"); }
function closeAttackModal() { elements.attackModal.classList.remove("active"); elements.attackModal.setAttribute("aria-hidden", "true"); }
function loadLocalSettings() { state.categoryEnabled = readJson(STORAGE_KEYS.categoryEnabled, {}); state.favorites = new Set(readJson(STORAGE_KEYS.favorites, [])); state.hiddenCards = new Set(readJson(STORAGE_KEYS.hidden, [])); state.cardType = readString(STORAGE_KEYS.cardType, "all", ["all", "questions", "missions"]); }
function saveCategoryEnabled() { writeJson(STORAGE_KEYS.categoryEnabled, state.categoryEnabled); }
function saveFavorites() { writeJson(STORAGE_KEYS.favorites, Array.from(state.favorites)); }
function saveHiddenCards() { writeJson(STORAGE_KEYS.hidden, Array.from(state.hiddenCards)); }
function saveCardType() { writeString(STORAGE_KEYS.cardType, state.cardType); }
function readJson(key, fallback) { try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch (_error) { return fallback; } }
function writeJson(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (_error) {} }
function readString(key, fallback, allowedValues) { try { const raw = localStorage.getItem(key); return allowedValues.includes(raw) ? raw : fallback; } catch (_error) { return fallback; } }
function writeString(key, value) { try { localStorage.setItem(key, value); } catch (_error) {} }
function randomItem(array) { return array[Math.floor(Math.random() * array.length)]; }
function shuffleArray(array) { const copied = array.slice(); for (let i = copied.length - 1; i > 0; i -= 1) { const randomIndex = Math.floor(Math.random() * (i + 1)); [copied[i], copied[randomIndex]] = [copied[randomIndex], copied[i]]; } return copied; }
function setBusy(isBusy) { state.isBusy = isBusy; document.querySelectorAll("button").forEach((button) => button.disabled = isBusy); }
function escapeHtml(value) { return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); }
