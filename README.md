# meshido-desktop

## 開発環境
### プロジェクト構成

★印・・・Gitの管理対象外

```
(project root)
├── README.md
├── app.js (アプリのエントリーポイントスクリプト)
├── bower.json
├── bower_components/ ★
├── css/
│   ├── index.css
│   └── lib/ (bower管理外のサードパーティーライブラリ)
├── dist/ (ビルド成果物(実行バイナリ)) ★
├── index.html
├── js/
│   ├── index.js
│   └── lib/ (bower管理外のサードパーティーライブラリ)
├── node_modules/ ★
└── package.json
```

### 依存ライブラリのインストール

```bash
npm install
```

### アプリの起動

```bash
npm start
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
