const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    const dailyQuery = `
        SELECT AVG(corrente) AS dailyAverage 
        FROM corrente_db.medicao 
        WHERE DATE(horario) = CURDATE()
    `
  
    const weeklyQuery = `
        SELECT AVG(corrente) AS weeklyAverage 
        FROM corrente_db.medicao 
        WHERE WEEK(horario) = WEEK(CURDATE())
    `
  
    const monthlyQuery = `
        SELECT AVG(corrente) AS monthlyAverage 
        FROM corrente_db.medicao 
        WHERE MONTH(horario) = MONTH(CURDATE())
    `
  
    const historyQuery = `
        SELECT DATE(horario) AS date, AVG(corrente) AS value 
        FROM corrente_db.medicao 
        GROUP BY DATE(horario)
        ORDER BY DATE(horario) DESC
        LIMIT 30
    `
  
    const statistics = {}
  
    db.query(dailyQuery, (error, dailyResult) => {
        if (error) {
            console.error('Erro ao buscar consumo diário:', error)
            return res.status(500).json({ error: 'Erro ao buscar consumo diário' })
        }
        statistics.dailyAverage = dailyResult[0].dailyAverage || 0
    
        db.query(weeklyQuery, (error, weeklyResult) => {
            if (error) {
                console.error('Erro ao buscar consumo semanal:', error)
                return res.status(500).json({ error: 'Erro ao buscar consumo semanal' })
            }
            statistics.weeklyAverage = weeklyResult[0].weeklyAverage || 0
    
            db.query(monthlyQuery, (error, monthlyResult) => {
                if (error) {
                    console.error('Erro ao buscar consumo mensal:', error)
                    return res.status(500).json({ error: 'Erro ao buscar consumo mensal' })
                }
                statistics.monthlyAverage = monthlyResult[0].monthlyAverage || 0
        
                db.query(historyQuery, (error, historyResult) => {
                    if (error) {
                        console.error('Erro ao buscar histórico de consumo:', error)
                        return res.status(500).json({ error: 'Erro ao buscar histórico de consumo' })
                    }
                    statistics.history = historyResult
                    res.json(statistics)
                })
            })
        })
    })
  })

module.exports = router