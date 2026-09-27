import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex h-screen items-center justify-center bg-slate-100">
      <h1 className="text-3xl font-bold text-blue-600 underline">
        Tailwind CSS is Working!
      </h1>
    </div>
  )
}

export default App
