const fs = require("fs");
const libpath = require("path");

const tmp = {};
const dir = libpath.join(process.cwd(), "data");
const files = fs.readdirSync(dir);
let ptime = 0
let err = 0
let ptrial = 0

// FIXME:実験のときの数値に合わせる
const interval = 200// 成功フィードバック時間
const eventtype = "touchend"
const stWidth = 6
const ppm = 264 / 25.4
// ここまで

const dist = (x1, y1, x2, y2) => {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
}
let s = "\ufeff" + "participant,bias,set,trial,targetW,distractorW,distractorP,MT,Error"

for (const file of files) {
  const fileName = libpath.join(dir, file)
  if (file.charAt(0) === ".") {
    continue
  }
  const dataArray = JSON.parse(fs.readFileSync(fileName, "utf-8"))
  // console.log(dataArray.length);
  for (const data of dataArray) {
    with (data) {
      if (type != "touchcancel" && type != eventtype) continue
      if (trial === -1)
        targetW = stWidth
      err = (dist(mx, my, tx, ty) < targetW / 2 * ppm) ? 0 : 1
      if (trial !== -1 && ptrial != trial) {
        const MT = time - ptime - interval
        s += "\n" + pnum + "," + bias + "," + set + "," + trial + "," + targetW + "," + distractorW + "," + distractorP + "," + MT + "," + err
      }
      if (!err) {
        ptime = time

      }
      ptrial = trial

      // TODO:bayesian touch分析
    }
    // console.log(data);
  }
}
console.log(s)
fs.writeFileSync("output/alldata" + Date.now() + ".csv", s, "utf8")
