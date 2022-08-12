import styles from '../styles/Home.module.css'
import { useMyContext } from '../src/context/state'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()
  const context = useMyContext()
  const num = 0
  const pName = ''
  const bias = 'バランス'
  const onChange = (e) => {
    // console.log(e.target);
    if (e.target.name === 'number') {
      num = e.target.value
    } else if (e.target.name === 'name') {
      pName = e.target.value
    } else if (e.target.name === 'bias') {
      bias = e.target.value
    }
    console.log(num, pName, bias)
  }
  const onSubmit = () => {
    if (!pName) {
      return
    }
    storageClear()
    router.push({
      pathname: '/test',
      query: { number: num, name: pName, bias: bias }
    })
  }
  const storageClear = () => {
    window.localStorage.clear()
  }

  return (
    <div className={styles.container}>
      <div>test1 ホーム画面</div>
      <div>名前入力や実験条件の選択</div>

      {/* <label>
          練習：
          <input type="checkbox" onChange={onChange} name="practise" />
        </label>
        <br /> */}
      <label>
        参加者番号：
        <input type='number' onChange={onChange} name='number' />
      </label>
      <br />
      <label>
        名前：
        <input type='text' onChange={onChange} name='name' />
      </label>
      <br />
      <label>
        提示順序：
        <select onChange={onChange} name='bias'>
          <option>バランス</option>
          <option>速さ重視</option>
          <option>正確重視</option>
        </select>
      </label>
      <br />
      <button onClick={onSubmit}>開始</button>
      <br />
      {/* <button onClick={storageClear}>クリア</button> */}

      {/* <Link href={{ pathname: "/test", query: { number: num, name: pName, practise: prac } }}>
        <button>開始</button>
      </Link> */}
    </div>
  )
}
