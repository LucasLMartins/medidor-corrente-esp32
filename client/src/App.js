import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';
import { useState, useEffect } from 'react'
import { api } from './api'
import './App.css'

const calculateAverage = (data) => {
  const total = data.reduce((acc, item) => acc + item.corrente, 0)
  return (total / data.length).toFixed(2)
}

// Função para agrupar dados por data, semana e mês
const groupByDate = (data) => {
  const grouped = {}
  data.forEach((item) => {
    const dateF = item.horario.split('T')[0].split('-')
    const date = `${dateF[2]}/${dateF[1]}/${dateF[0]}`
    if (!grouped[date]) grouped[date] = []
    grouped[date].push(item)
  })
  return grouped
}

const groupByMonth = (data) => {
  const grouped = {}
  data.forEach((item) => {
    const date = new Date(item.horario)
    const month = `${date.getMonth() + 1}/${date.getFullYear()}`
    if (!grouped[month]) grouped[month] = []
    grouped[month].push(item)
  })
  return grouped
}

function App() {
  const [realTime, setRealTime] = useState(null)
  // const [dailyAverage, setDailyAverage] = useState(0)
  // const [weeklyAverage, setWeeklyAverage] = useState(0)
  // const [monthlyAverage, setMonthlyAverage] = useState(0)
  const [dailyData, setDailyData] = useState([])
  const [monthlyData, setMonthlyData] = useState([])

  useEffect(() => {
    fetchRealTime()
    const interval = setInterval(fetchRealTime, 5000);
    return () => clearInterval(interval);
  }, [])

  useEffect(() => {
    //fetchStatistics()
    getData()
  }, [])

  async function fetchRealTime() {
    const response = await api.get('/realTime')
    setRealTime(response.data)
  }

  // const fetchStatistics = async () => {
  //   const response = await api.get('/statistics')
  //   setDailyAverage(response.data.dailyAverage)
  //   setWeeklyAverage(response.data.weeklyAverage)
  //   setMonthlyAverage(response.data.monthlyAverage)
  // }

  async function getData(){
    const response = await api.get('/getData')
    const data = response.data
    
    const dailyGrouped = groupByDate(data)
    const monthlyGrouped = groupByMonth(data)

    const dailyAverage = Object.keys(dailyGrouped).map((date) => ({
      name: date,
      Média: calculateAverage(dailyGrouped[date]),
    }))

    const monthlyAverage = Object.keys(monthlyGrouped).map((month) => ({
      name: month,
      Média: calculateAverage(monthlyGrouped[month]),
    }))

    setDailyData(dailyAverage)
    setMonthlyData(monthlyAverage)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0') // Janeiro é 0!
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  return (
    // <div style={{ padding: '20px', color: '#fff', backgroundColor: '#17181e' }}>
    //   <h1 style={{ color: '#1e90ff' }}>Dashboard de Consumo de Energia</h1>
    //   <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
    //     <div className='cardStyle'>
    //       <h2>Consumo em Tempo Real</h2>
    //       <p style={{ fontSize: '1.5em', color: '#32cd32' }}>
    //         {realTime ? `${realTime.corrente.toFixed(3)} A` : 'Carregando...'}
    //       </p>
    //     </div>
    //     <div className='cardStyle'>
    //       <h2>Consumo Médio Diário</h2>
    //       <p>{dailyAverage.toFixed(3)} A</p>
    //     </div>
    //     <div className='cardStyle'>
    //       <h2>Consumo Médio Semanal</h2>
    //       <p>{weeklyAverage.toFixed(3)} A</p>
    //     </div>
    //     <div className='cardStyle'>
    //       <h2>Consumo Médio Mensal</h2>
    //       <p>{monthlyAverage.toFixed(3)} A</p>
    //     </div>
    //   </div>

    //   <div style={{ marginTop: '30px' }}>
    //     <h2>Histórico de Consumo diário médio</h2>
    //     <div style={{ height: '300px', width: '100%', backgroundColor: '#282c34', borderRadius: '10px', padding: '20px' }}>
    //       {/* Aqui você pode incluir um gráfico de consumo usando uma biblioteca de gráficos */}
    //       {/* Exemplo de dados de histórico */}
    //       {consumptionHistory.map((dataPoint, index) => (
    //         <p key={index}>{`${formatDate(dataPoint.date)}: ${dataPoint.value.toFixed(3)} A`}</p>
    //       ))}
    //     </div>
    //   </div>
    // </div>

    <div className='page'>
      <p className='title'>Consumo de energia</p>
      <div className='page-boxes'>
        <div className='box-container'>
          <p>Consumo em</p>
          <p>tempo real</p>
          <p className='consumption'>{realTime ? `${realTime.corrente.toFixed(2)} A` : 'Carregando...'}</p>
        </div>
        <div className='box-container'>
          <p>Consumo</p>
          <p>diário médio</p>
          <p className='consumption'>72 A</p>
        </div>
        <div className='box-container'>
          <p>Consumo</p>
          <p>semanal médio</p>
          <p className='consumption'>504 A</p>
        </div>
        <div className='box-container'>
          <p>Consumo</p>
          <p>mensal médio</p>
          <p className='consumption'>2012 A</p>
        </div>
      </div>

      <div className='page-graphics'>
        <div className='graphic'>
          <div className='graphic-top'>
            <p>Consumo diário médio</p>
            <p className='consumption'>72 A</p>
          </div>
          <div className='graphic-bottom'>
            <ResponsiveContainer height={300} width='100%'>
              <AreaChart data={dailyData} margin={{ right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  interval={1}
                />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="Média" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className='graphic'>
          <div className='graphic-top'>
            <p>Consumo mensal médio</p>
            <p className='consumption'>2012 A</p>
          </div>
          <div className='graphic-bottom'>
            <ResponsiveContainer height={300} width='100%'>
              <AreaChart data={monthlyData} margin={{ right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tickFormatter={(month) => month.replace('-', '/')}
                />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="Média" stroke="#8884d8" fill="#8884d8"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
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
