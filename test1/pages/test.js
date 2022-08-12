import { useRouter } from 'next/router'
import { useEffect } from 'react'

class vector2 {
  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }

  // xとyをセットする
  set(x, y) {
    this.x = x
    this.y = y
    return this
  }

  dist(vec) {
    return Math.sqrt((vec.x - this.x) ** 2 + (vec.y - this.y) ** 2)
  }

  scalar(c) {
    this.x *= c
    this.y *= c
    return this
  }

  add(vec) {
    this.x += vec.x
    this.y += vec.y
    return this
  }

  static rndPos(x, y) {
    return new vector2(Math.random() * x, Math.random() * y)
  }
}
const shuffle = ([...array]) => {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export default function Test() {
  // 変数の初期化
  const router = useRouter()
  const { number, name, bias } = router.query
  console.log(number, name, bias)
  /// / ターゲット直径{3,5,7}、障害物直径{3,5,7}、障害物配置{rl,ud,rlud},set{1-20}
  /// / set:1-2は練習、2セットごとに小休憩
  /// / trial{1-27}、3x3x3
  /// / 開始タ−ゲットは画面中心6mm
  const dd = [3, 5, 7]
  const dt = [3, 5, 7]
  const rd = [0, 1, 2]
  const MAXSET = 20
  let set = 0
  let trial = 0
  // // FIXME:debug
  // const dd = [7]
  // const dt = [7]
  // const rd = [0, 1, 2]
  // const MAXSET = 4
  // // ここまで
  const rds = ["左右", "上下", "上下左右"]
  const oneset = dd.length * dt.length * rd.length // 1セットの試行数
  let order = [...Array(oneset)].map((_, i) => i)
  // FIXME:実機に合わせて変更
  // const ppm = 414 / 68.5 // 仮の数字
  const ppm = 264 / 25.4// iPad Pro (12.9-Inch) (第2世代)
  const stWidth = 6 // 開始ターゲットの大きさ
  const A = 20 // ターゲット同氏の距離
  const dtw = 0.5 // ターゲットと障害物の幅
  const preTime = 200
  const margin = (dd[dd.length - 1] / 2 + dt[dt.length - 1] + dtw) * ppm + 2
  let data = [] // 実験結果
  let localData = []

  const tpos = new vector2()
  let ctx
  // state
  // 0：開始前・セット間、1：試行中、2：成功フィードバック中
  let width = 0
  let height = 0
  let state = 0

  // ターゲット描画
  const drawTarget = (pos, dx, dy, w) => {
    ctx.beginPath()
    ctx.arc(pos.x + dx, pos.y + dy, (w * ppm) / 2, 0, Math.PI * 2, true)
    ctx.fill()
  }

  // ターゲットの描画更新
  const drawNextTarget = (pos, st = -1) => {
    const tw = st > 0 ? st : dd[order[trial] % dd.length]
    const dw = dt[Math.floor(order[trial] / dd.length) % dt.length]
    const dr = rd[Math.floor(order[trial] / (dd.length * dt.length)) % rd.length]
    ctx.clearRect(0, 0, width, height)
    // 障害物を描画
    if (st < 0) {
      const d = ((tw + dw) / 2 + dtw) * ppm
      ctx.fillStyle = 'gray'
      switch (dr) {
        case 0: // 左右
          drawTarget(pos, d, 0, dw)
          drawTarget(pos, -d, 0, dw)
          break
        case 1: // 上下
          drawTarget(pos, 0, d, dw)
          drawTarget(pos, 0, -d, dw)
          break
        case 2: // 上下左右
          drawTarget(pos, d, 0, dw)
          drawTarget(pos, -d, 0, dw)
          drawTarget(pos, 0, d, dw)
          drawTarget(pos, 0, -d, dw)
          break

        default:
          break
      }
    }
    // ターゲット
    ctx.fillStyle = 'green'
    drawTarget(pos, 0, 0, tw)

    // FIXME:debug
    ctx.font = '10px メイリオ'
    ctx.fillText(`trial: ${trial} set: ${set} width: ${width}`, 10, 10)
  }

  // 次のターゲットの位置
  const nextTargetPos = (pos, theta) => {
    const delta = new vector2(Math.cos(theta), Math.sin(theta)).scalar(A * ppm)
    return delta.add(pos)
  }

  // 座標が画面内（マージンあり）か
  const inDisplay = (vec) => {
    return vec.x > margin && vec.y > margin && vec.x < width - margin && vec.y < height - margin
  }

  // 実験データを実機に保存
  const dataSave = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: 'application/json' }))
    const a = document.createElement('a')
    document.body.appendChild(a)
    a.download = Date.now() + '.json'
    a.href = url
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  // 次の試行へ
  const nextTrial = () => {
    let interval = false
    // 成功フィードバック、赤く＋音
    ctx.fillStyle = 'red'
    ctx.fill()
    // TODO:音を鳴らす

    // 次の試行へ
    window.setTimeout(() => {
      state = 1
      trial++
      // 1setが終わったら
      if (trial >= oneset) {
        trial = 0
        set++
        // 2setごとに休憩
        if (set % 2 === 0) {
          trial = -1
          state = 0
          // 開始ターゲット
          tpos.set(width / 2, height / 2)
          drawNextTarget(tpos, stWidth)
          interval = true
          ctx.fillStyle = 'black'
          ctx.font = '50px メイリオ'
          ctx.fillText('休憩です', width / 2 - 50, height / 2 - 50)
        }

        // データ保存
        if (set >= MAXSET) {
          console.log(JSON.stringify(data))
          dataSave()
          // 終了画面
          state = 3
          ctx.clearRect(0, 0, width, height)
          ctx.fillStyle = 'black'
          ctx.font = '50px メイリオ'
          ctx.fillText('終了です', width / 2, height / 2)
        }
      }
      if (interval) return

      // 次のターゲットが画面に収まるか判定
      let theta = 0
      do {
        theta = Math.random() * Math.PI * 2
        console.log(nextTargetPos(tpos, theta))
      } while (!inDisplay(nextTargetPos(tpos, theta)))
      tpos = nextTargetPos(tpos, theta)
      drawNextTarget(tpos)
      localData = { set, trial, order, tpos }
      window.localStorage.setItem(number + 'ldata', JSON.stringify(localData))
    }, preTime)
  }

  // タッチイベント、ここで記録＆次の条件へ
  const touchEvent = (e) => {
    const time = Date.now()
    if (e.type === 'touchmove') {
      e.preventDefault()
    }
    const mpos = new vector2(e.changedTouches[0].clientX, e.changedTouches[0].clientY)
    const tw = dd[order[trial] % dd.length]
    const dw = dt[Math.floor(order[trial] / dd.length) % dt.length]
    const dp = rd[Math.floor(order[trial] / (dd.length * dt.length)) % rd.length]
    // 記録
    if (state != 3)
      data.push({
        pnum: Number(number),
        bias,
        set,
        trial,
        type: e.type,
        mx: mpos.x,
        my: mpos.y,
        tx: tpos.x,
        ty: tpos.y,
        targetW: tw,
        distractorW: dw,
        distractorP: rds[dp],
        time,
      })
    window.localStorage.setItem(number + 'data', JSON.stringify(data))
    if (!(e.type === 'touchend' || e.type === 'touchcancel')) return
    switch (state) {
      case 0:
        // 開始ターゲットをクリック
        if (mpos.dist(tpos) < stWidth * ppm) {
          state = 2
          order = shuffle(order)
          nextTrial()
        }
        break
      case 1:
        // ターゲットをタッチ
        if (mpos.dist(tpos) < dd[order[trial] % dd.length] * ppm) {
          state = 2
          nextTrial()
        }
        // TODO:障害物をタッチ
        // beap音
        break

      case 3:
        dataSave()
        break

      default:
        break
    }
  }

  // 読み込み時
  useEffect(() => {
    history.pushState(null, null, location.href)
    window.addEventListener('popstate', (e) => {
      // alert('ブラウザバックを使わないでください。')
      history.go(1)
    })
    const c = document.getElementById('canvas')
    // canvasを画面いっぱいに広げる
    c.width = document.body.offsetWidth
    c.height = document.body.offsetHeight
    width = document.body.offsetWidth
    height = document.body.offsetHeight
    // タッチイベントを登録
    c.addEventListener('touchstart', touchEvent)
    c.addEventListener('touchend', touchEvent)
    c.addEventListener('touchcancel', touchEvent)
    c.addEventListener('touchmove', touchEvent, { passive: false })
    console.log('ok')

    // 開始ターゲット
    ctx = c.getContext('2d')
    tpos.set(width / 2, height / 2)
    drawNextTarget(tpos, stWidth)
    ctx.imageSmoothingEnabled = false
    trial = -1

    // リロードしたときに復元
    data = JSON.parse(window.localStorage.getItem(number + 'data'))
    if (data === null) data = []
    localData = JSON.parse(window.localStorage.getItem(number + 'ldata'))
    console.log('useEffect')
    console.log(localData)
    if (localData !== null) {
      set = localData.set
      trial = localData.trial
      order = localData.order
      tpos.set(localData.tpos.x, localData.tpos.y)
      drawNextTarget(tpos)
    }
  })

  return (
    <div id="wrapper">
      <canvas id="canvas" width={0} height={0} />
    </div>
  )
}
