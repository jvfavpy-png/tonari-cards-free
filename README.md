# Tonari Cards Free

カップル向け質問カードWebアプリ「Tonari Cards」の無料版です。

## 入っているもの

```text
index.html
style.css
script.js
questions_free_30.csv
vercel.json
free_selection_note.md
```

## 無料版の仕様

- 30枚収録
  - Question：26枚
  - Mission：4枚
- Adult / Spice はロック表示のみ
- Mix / Question / Mission 切り替え
- 1枚引き
- 3枚候補から選択
- カテゴリON/OFF
- お気に入り保存
- もう出さない
- 外したカードの個別復元
- 外したカードの一括復元
- localStorage保存
- スマホファーストUI

## フル版URLの設定

`script.js` の上部にある以下を書き換えてください。

```js
const FULL_VERSION_URL = "#";
```

例：

```js
const FULL_VERSION_URL = "https://example.com/tonari-cards-full";
```

## ローカル確認

`index.html` を直接開いても動きます。
ブラウザがCSV読み込みをブロックした場合でも、`script.js` 内の内蔵データで動きます。

## Vercel公開

1. このフォルダをGitHubにアップロード
2. VercelでNew Project
3. 該当リポジトリを選択
4. Framework PresetはOther
5. Deploy

## 注意

無料版なのでAdult / Spiceの実カードは入れていません。
有料版への誘導は画面下のFull版カードで行います。
