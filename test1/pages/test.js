import { useMyContext } from "../src/context/state";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Test() {
  const router = useRouter();
  const { number, name, practise } = router.query;
  console.log(number, name, practise);
  const touchEvent = (e) => {
    // タッチイベント、ここで記録＆次の条件へ
    console.log(e);
    console.log({ type: e.type, x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY, time: e.timeStamp });
  };
  useEffect(() => {
    const canvas = document.getElementById("canvas");
    // canvasを画面いっぱいに広げる
    canvas.width = document.body.offsetWidth;
    canvas.height = document.body.offsetHeight;
    // タッチイベントを登録
    canvas.addEventListener("touchstart", touchEvent);
    canvas.addEventListener("touchend", touchEvent);
    canvas.addEventListener("touchcancel", touchEvent);
    canvas.addEventListener("touchmove", touchEvent);
    console.log("ok");

    const context = canvas.getContext("2d");
    context.beginPath();
    context.arc(50, 60, 40, 0, Math.PI * 2, true);
    context.lineWidth = 5;
    context.imageSmoothingEnabled = false;
    context.stroke();
  });

  return (
    <div id={"wrapper"}>
      <canvas id="canvas" width={0} height={0}></canvas>
    </div>
  );
}
