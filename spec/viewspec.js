const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const resemble = require("resemblejs");
// please write your target url to targets.js
const t = require('../targets.js');
const root = t.root;
const targets = t.targets;

for (let value of targets) {
  describe(`https://${value.host}/${value.page}`, function() {
      beforeAll(async function() {
        await page.setDefaultTimeout(60000);
        await page.goto(`https://${value.host}/${value.page}`, { waitUntil: 'networkidle0' });
      });

      afterAll(async function() {
        if (checkFileExists(`${root}/${value.host}/latest.png`)) {
          fs.rename(`${root}/${value.host}/latest.png`,
            `${root}/${value.host}/previous.png`, function (err) {});
        }
      });

      it("has similar screenshot as before", async function() {
        const DirName = `${root}/${value.host}/`;
  
        // 1 世代前のスクリーンショットファイル名を定義
        const previousFile = DirName + 'previous.png';
  
        // 1 世代前のスクリーンショットがファイルが存在していたら, 最新のスクリーンショット名を latest.png に設定
        // 1 世代前のスクリーンショットがファイルが存在していなかったら, 最新のスクリーンショット名を screenshot.png に設定
        let latestFile = '';
        if (checkFileExists(previousFile)) {
          latestFile = DirName + 'latest.png';
        } else {
          latestFile = previousFile;
        }

        // 最新のスクリーンショットを作成
        await page.screenshot({ path: latestFile, fullPage: true });
  
        // 最新と 1 つ前のスクリーンショットの内容を読み取る
        const imageBefore = fse.readFileSync(previousFile);
        const imageAfter  = fse.readFileSync(latestFile);
  
        // 1 つ前に取得したスクリーンショットと差分を比較する
        resemble(imageAfter).compareTo(imageBefore)
          .ignoreColors()
          .onComplete(function(data) {
              fse.writeFileSync(DirName + 'diff.png', data.getBuffer());
              // for debug
              // console.log(data);
              expect(data.misMatchPercentage).toBeLessThan(value.threshold);
          });
      });
  });
};

function checkFileExists(filePath){
  if (fs.existsSync(filePath)) {
    return true;
  } else {
    return false;
  }
}
