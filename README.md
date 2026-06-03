# Tonari Cards Free v1.0.4

無料公開用の30問版です。

## 修正内容

- 元の v2.1.0 UI を維持
- Question 26枚 / Mission 4枚
- Adult / Spice / HARD / veryHARD は無料版では出さない
- Adult / Spice はロック表示のみ
- `index.html` を直接開いてCSV fetchに失敗しても、内蔵CSVで起動
- v1.0.4で発生した「\n が実改行として解釈され、カード本文が途中で切れる問題」を修正

## ファイル

```text
index.html
style.css
script.js
questions_free_30.csv
README.md
free_selection_note.md
vercel.json
```

## Vercel公開

GitHubへZIPではなく中身をアップロードしてください。
Build Command / Output Directory は空欄でOKです。
