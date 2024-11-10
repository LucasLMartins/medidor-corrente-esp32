const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    const query = 'SELECT corrente, horario FROM corrente_db.medicao ORDER BY horario DESC LIMIT 1'
    db.query(query, (error, results) => {
      if (error) {
        console.error('Erro ao buscar medição em tempo real:', error)
        return res.status(500).json({ error: 'Erro ao buscar medição em tempo real' })
      }
      res.json(results[0])
    })
})

module.exports = router