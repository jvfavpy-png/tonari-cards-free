# Tonari Cards Free v1.0.6

無料公開用の30問版です。

## 修正内容

- UI全体の日本語表記を再精査
- 助詞、語順、文末の違和感を調整
- スマホ表示で質問文が変に割れにくいように調整
- 長いカード文は自動で少し小さく表示
- Question 26枚 / Mission 4枚
- Adult / Spice / HARD / veryHARD は無料版では出さない
- Adult / Spice はロック表示のみ
- `index.html` を直接開いてCSV fetchに失敗しても、内蔵CSVで起動

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

## v1.0.6修正

- 無料版では報告ボタンを削除
- お気に入り / 外す の2ボタン構成に戻しました
