import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { api } from './api'
import './App.css'

function App() {

  return (
    <div className="App">
      <p>Teste</p>
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
