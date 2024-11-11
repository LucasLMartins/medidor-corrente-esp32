import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';
import { useState, useEffect } from 'react'
import { api } from './api'
import './App.css'

function App() {
  const [loading, setLoading] = useState(true)
  const [realTime, setRealTime] = useState(null)
  const [daily, setDaily] = useState(null)
  const [monthly, setMonthly] = useState(null)
  const [peak, setPeak] = useState(null)
  const [last24Hours, setLast24Hours] = useState(null)
  
  useEffect(() => {
    getStatistics()
  }, [])

  useEffect(() => {
    fetchRealTime()
    const interval = setInterval(fetchRealTime, 5000)
    return () => clearInterval(interval)
  }, [])

  async function getStatistics() {
    const response = await api.get('/statistics')
    const formatDaily = response.data.daily.map(i => {
      const formatDate = new Date(i.data).toLocaleDateString('pt-BR')
      return { ...i, data: formatDate }
    })

    setDaily(formatDaily)
    setMonthly(response.data.monthly)
    setLast24Hours(response.data.last)
    setPeak(response.data.peak)

    setLoading(false)
  }

  async function fetchRealTime() {
    const response = await api.get('/realTime')
    setRealTime(response.data.realTime.kWh)
  }

  function media(array){
    const total = array.reduce((acc, item) => acc + item.kWh, 0)
    const medio = total / array.length

    return medio
  }

  if (loading === false) return (
    <div className='page'>
      <p className='title'>Consumo de energia</p>
      <div className='page-boxes'>
        <div className='box-container'>
          <p>Consumo em</p>
          <p>tempo real</p>
          <p className='consumption'>{realTime ? `${realTime} kWh` : 'Carregando...'}</p>
        </div>
        <div className='box-container'>
          <p>Consumo diário</p>
          <p>mais alto</p>
          <p className='consumption'>{peak.kWh.toFixed(2)} kWh</p>
        </div>
        <div className='box-container'>
          <p>Consumo</p>
          <p>diário médio</p>
          <p className='consumption'>{media(daily).toFixed(2)} kWh</p>
        </div>
        <div className='box-container'>
          <p>Consumo</p>
          <p>mensal médio</p>
          <p className='consumption'>{media(monthly).toFixed(2)} kWh</p>
        </div>
      </div>

      <div className='page-graphics'>
        <div className='graphic'>
          <div className='graphic-top'>
            <p>Últimos 30 dias</p>
          </div>
          <div className='graphic-bottom'>
            <ResponsiveContainer height={300} width='100%'>
              <AreaChart data={daily} margin={{ right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="data"
                  interval={10}
                />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="kWh" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className='graphic'>
          <div className='graphic-top'>
            <p>Últimos 12 meses</p>
          </div>
          <div className='graphic-bottom'>
            <ResponsiveContainer height={300} width='100%'>
              <AreaChart data={monthly} margin={{ right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="data"
                  tickFormatter={(month) => month.replace('-', '/')}
                />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="kWh" stroke="#8884d8" fill="#8884d8"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className='page-graphics'>
        <div className='graphic-full'>
          <div className='graphic-top'>
            <p>Últimas 24 horas</p>
          </div>
          <div className='graphic-bottom'>
            <ResponsiveContainer height={400} width='100%'>
              <AreaChart data={last24Hours} margin={{ right: 55, left: 30 }}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis
                  dataKey="hora"
                  interval={2}
                />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="kWh" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <p>Carregando...</p>
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
