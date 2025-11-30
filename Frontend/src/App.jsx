import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SearchResults from './pages/SearchResults/SearchResults'

function App() {
  const [count, setCount] = useState(0)

  return (
      <SearchResults query={"game"}></SearchResults>
  )
}

export default App
