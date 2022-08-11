const fs = require("fs");
const libpath = require("path");
const _ = require("lodash");
const { time } = require("console");

const tmp = {};
const dir = libpath.join(process.cwd(), "data");
const files = fs.readdirSync(dir);
let ptime = 0
let err = 0
const interval = 200
const eventtype = "touchend"
const dist = (x1, y1, x2, y2) => {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
}

for (const file of files) {
  const dataArray = JSON.parse(fs.readFileSync(libpath.join(dir, file), "utf-8"))
  // console.log(dataArray.length);
  for (const data of dataArray) {
    with (data) {
      if (type != eventtype || trial == -1) continue
      err = (dist(mx, my, tx, ty) < targetW) ? 0 : 1
      if (!err) {
        console.log(time - ptime);
        ptime = time
      }
    }
    console.log(data);
  }
}
