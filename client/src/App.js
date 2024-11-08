import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { api } from './api'
import './App.css'

function App() {
  const [correntes, setCorrentes] = useState([])

  useEffect(() => {
    getCorrentes()
  }, [])

  async function getCorrentes() {
    const response = await api.get('/getData')
    setCorrentes(response.data.result)
  }


  return (
    <div className="App">
      <p>Teste</p>

      {correntes.map((corrente, i) => (
        <div key={i}>
          <p>{corrente.corrente}</p>
          <p>{corrente.horario}</p>
        </div>
      ))}
    </div>
  )
}

function AppWrapper() {
  return(
    <Router>
      <Routes>
        <Route path='/' element={<App />} />
      </Routes>
    </Router>
  )
}

export default AppWrapper
