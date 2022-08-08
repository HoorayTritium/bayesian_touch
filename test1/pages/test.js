import { useMyContext } from "../src/context/state";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import { useEffect } from "react";

class vector2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  // xとyをセットする
  set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }
  dist(x1, y1) {
    return Math.sqrt((x1 - this.x) ** 2 + (y1 - this.y) ** 2);
  }
  static rndPos(x, y) {
    return new vector2(Math.random() * x, Math.random() * y);
  }
}
const shuffle = ([...array]) => {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export default function Test() {
  // 変数の初期化
  const router = useRouter();
  const { number, name, practise } = router.query;
  console.log(number, name, practise);
  // ターゲット直径{3,5,7}、障害物直径{3,5,7}、障害物配置{rl,ud,rlud},set{1-20}
  // set:1-2は練習、2セットごとに小休憩
  // trial{1-27}、3x3x3
  // 初期位置は画面中心6mm
  const dd = [3, 5, 7],
    dt = [3, 5, 7],
    rd = [0, 1, 2],
    set = 0,
    trial = 0;
  const oneset = dd.length * dt.length * rd.length;
  const order = [...Array(oneset)].map((_, i) => i);
  const ppm = 400 / 40; //仮の数字
  const stWidth = 6; // 開始ターゲットの大きさ
  const A = 2; // ターゲット同氏の距離
  const tpos = new vector2();
  let ctx;
  // state
  // 0：開始前・セット間、1：試行中、2：成功フィードバック中
  let width = 0,
    height = 0,
    state = 0;

  // ターゲットの描画更新
  const drawNextTarget = (x, y, st = -1) => {
    const tw = st > 0 ? st : dd[order[trial] % 3];
    const dw = dt[(order[trial] / 3) % 3];
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.arc(x, y, tw * ppm, 0, Math.PI * 2, true);
    ctx.fillStyle = "green";
    ctx.fill();
    // TODO:障害物を描画
  };

  // 次のターゲットの位置
  const nextTargetPos=(pos, theta)=>{
    
  }

  // 次の試行へ
  const nextTrial = () => {
    // TODO:記録
    // 成功フィードバック、赤く＋音
    ctx.fillStyle = "red";
    ctx.fill();
    // TODO:音を鳴らす

    // 次の試行へ
    window.setTimeout(() => {
      state = 1;
      const theta = Math.random(Math.PI * 2);
      drawNextTarget(tpos.x + Math.cos(theta), tpos.y + Math.sin(theta));
    }, 200);
  };

  // タッチイベント、ここで記録＆次の条件へ
  const touchEvent = (e) => {
    // console.log(e);
    // console.log({ type: e.type, x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY, time: e.timeStamp });
    const mpos = new vector2(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    switch (state) {
      case 0:
        // 開始ターゲットをクリック
        if (mpos.dist(width / 2, height / 2) < stWidth * ppm) {
          state = 1;
          order = shuffle(order);
          nextTrial();
        }
        break;
      case 1:
        // ターゲットをタッチ
        // 障害物をタッチ
        // TODO:beap音
        break;

      default:
        break;
    }
  };

  // 読み込み時
  useEffect(() => {
    const c = document.getElementById("canvas");
    // canvasを画面いっぱいに広げる
    c.width = document.body.offsetWidth;
    c.height = document.body.offsetHeight;
    width = document.body.offsetWidth;
    height = document.body.offsetHeight;
    // タッチイベントを登録
    c.addEventListener("touchstart", touchEvent);
    c.addEventListener("touchend", touchEvent);
    c.addEventListener("touchcancel", touchEvent);
    c.addEventListener("touchmove", touchEvent);
    console.log("ok");

    // 開始ターゲット
    ctx = c.getContext("2d");
    drawNextTarget(width / 2, height / 2, stWidth);
    tpos.set(width / 2, height / 2);
    ctx.imageSmoothingEnabled = false;
  });

  return (
    <div id={"wrapper"}>
      <canvas id="canvas" width={0} height={0}></canvas>
    </div>
  );
}
