import {useEffect } from 'react'
import axios from 'axios'
import './App.css'


function App() {
  console.log("App component rendered")
  useEffect(() => {
    try {
        axios.get('http://127.0.0.1:8000/api/v1/health-check/').then(
          res => console.log("res.data:", res.data)
        )
      } catch (error) {
        console.error('Error fetching data:', error)
      }
  }, [])
  return (
    <>
      <div className="App">
        <h1>Book of Accounts</h1>
      </div>
    </>
  )
}

export default App
