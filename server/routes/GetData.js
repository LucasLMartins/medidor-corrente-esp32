const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    const query = 'SELECT corrente, horario FROM corrente_db.medicao ORDER BY horario ASC'
    db.query(query, (error, results) => {
      if (error) {
        console.error('Erro ao buscar medição: ', error)
        return res.status(500).json({ error: 'Erro ao buscar medição' })
      }
      res.json(results)
    })
})

module.exports = router