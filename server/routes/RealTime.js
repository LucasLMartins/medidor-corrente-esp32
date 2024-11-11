const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  const realTimeQuery = `
    SELECT 
      ROUND((220 * corrente) / 1000, 4) AS kWh
    FROM corrente_db.medicao
    ORDER BY horario DESC
    LIMIT 1
  `
  db.query(realTimeQuery, (error, result) => {
    if (error) {
      console.error('Erro ao buscar medição em tempo real:', error)
      return res.status(500).json({ error: 'Erro ao buscar medição em tempo real' })
    }
    
    res.json({
      realTime: result[0]
    })
  })
})

module.exports = router