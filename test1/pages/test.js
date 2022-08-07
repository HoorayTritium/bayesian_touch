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
}

export default function Test() {
  const router = useRouter();
  const { number, name, practise } = router.query;
  console.log(number, name, practise);
  // ターゲット直径{3,5,7}、障害物直径{3,5,7}、障害物配置{rl,ud,rlud},set{1-20}
  // set:1-2は練習、2セットごとに小休憩
  // trial{1-27}、3x3x3
  // 初期位置は画面中心6mm
  const dd = [3, 5, 7], dt = [3, 5, 7], rd = [0, 1, 2], set = 0, trial = 0;
  const array提示順序 = Array();
  const ppm = 400 / 40//仮の数字
  const tpos = new vector2()
  // state
  // 0：開始前・セット間、1：試行中、2：成功フィードバック中
  let width = 0, height = 0, state = 0
  const touchEvent = (e) => {
    // タッチイベント、ここで記録＆次の条件へ
    console.log(e);
    console.log({ type: e.type, x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY, time: e.timeStamp });
    const mpos = new vector2(e.changedTouches[0].clientX, e.changedTouches[0].clientY)
    switch (state) {
      case 0:
        if()
        break;

      default:
        break;
    }
  };
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
    const ctx = c.getContext("2d");
    ctx.beginPath();
    // void ctx.arc(x, y, radius, startAngle, endAngle [, counterclockwise]);
    ctx.arc(width / 2, height / 2, 6 * ppm, 0, Math.PI * 2, true);
    ctx.fillStyle = 'green';
    ctx.fill()
    ctx.imageSmoothingEnabled = false;
  });

  return (
    <div id={"wrapper"}>
      <canvas id="canvas" width={0} height={0}></canvas>
    </div>
  );
}
