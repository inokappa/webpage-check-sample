# webpage-check-sample

## これは

* Web サイトの任意のページにアクセスしてスクリーンショットを撮影し, 基準となるスクリーンショットと差分を比較して違いを検知する仕組みです
* デプロイ後の正常性チェックに利用することを想定しています

## Setup

### targets.js

チェックしたい Web サイトの URL と, どの程度 (N %) の違いまでを許容するかを targets.js に記述します.

```javascript
module.exports = Object.freeze({
  root: 'webpage-check.inokara.com',
  targets: [
    { 'host': 'test.example.com', 'page': 'path/to/page', 'threshold': 1 },
    { 'host': 'mypage.example.com', 'page': '', 'threshold': 1 }
  ]
});
```

* root: 画像を保存するルートディレクトリを指定します
* targets: チェックしたい Web サイトの URL と, 差異の許容範囲を % で指定します (上記の例では 1% までを許容 = 異常ではない) 

### .circleci/config.yml

CircleCI 上で実行する場合, 以下の項目を環境変数に設定します.

* `AWS_REGION` ... AWS のリージョンを指定 (例: ap-norhteast-1)
* `ROOT_PATH` ... 画像を保存するルートディレクトリを指定 (例: webpage-check.inokara.com) これは, S3 バケット名としても要求されます = この名前で S3 バケットを作成します
* `SLACK_MEMBER_IDS` ... Slack 通知でメンションする対象メンバーの ID, 複数人に送る場合にはカンマ区切りで指定 (xxxx1,xxxx2)
* `SLACK_WEBHOOK` ... Slack の Incomming Webhook の URL

## これを仕込んだ目的

* https://inokara.hateblo.jp/entry/2019/12/25/221936

