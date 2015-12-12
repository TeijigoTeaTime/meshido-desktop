# meshido-desktop

[![Build Status](https://travis-ci.org/TeijigoTeaTime/meshido-desktop.svg?branch=master)](https://travis-ci.org/TeijigoTeaTime/meshido-desktop)

## 開発環境

### 構築手順

```bash
git clone https://github.com/TeijigoTeaTime/meshido-desktop.git
cd meshido-desktop
npm install
```

### アプリの起動

```bash
npm start
```

### ソースコードの静的解析

```bash
npm run lint
```
以下のツールによるソースコードの静的解析が実行される

* [HTMLHint](https://github.com/yaniswang/HTMLHint)
* [CSSLint](https://github.com/CSSLint/csslint)
* [ESLint](https://github.com/eslint/eslint)

### プロジェクト構成

★印・・・Gitの管理対象外

```
(project root)
├── README.md
├── app.js (アプリのエントリーポイントスクリプト)
├── bower.json
├── dist/ (ビルド成果物(実行バイナリ)) ★
├── gulpfile.js
├── node_modules/ ★
├── package.json
└── src/
    ├── bower_components/ ★
    ├── css/
    ├── index.html
    └── js/
```

## アプリのビルド

### for Mac

```bash
npm run build:mac
ls dist/Meshido-darwin-x64
```

### for Windows

```bash
npm run build:win
ls dist/Meshido-win32-x64
```

## License

UNLICENSED
