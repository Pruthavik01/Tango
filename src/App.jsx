import { useState } from 'react'
import './App.css'
import Game from './Components/Game'
import Timer from './Components/Timer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Timer />
      <Game n={6} />
    </>
  )
}

export default App
