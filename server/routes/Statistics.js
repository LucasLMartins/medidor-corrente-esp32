const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    const dailyQuery = `
        SELECT 
            DATE_FORMAT(horario, '%Y-%m-%d') AS data,
            ROUND(SUM((220 * corrente / 1000) * (5.0 / 3600)), 2) AS kWh
        FROM corrente_db.medicao
        WHERE horario BETWEEN CURDATE() - INTERVAL 30 DAY AND CURDATE()
        GROUP BY data
        ORDER BY data
    `
  
    const monthlyQuery = `
        SELECT 
            CONCAT(MONTH(horario), '/', YEAR(horario)) AS data,
            ROUND(SUM((220 * corrente / 1000) * (5.0 / 3600)), 2) AS kWh
        FROM corrente_db.medicao
        GROUP BY YEAR(horario), MONTH(horario), data
        ORDER BY YEAR(horario) ASC, MONTH(horario) ASC
    `

    const last = `
        SELECT 
            DATE_FORMAT(horario, '%d/%m/%Y %H:00:00') AS hora,
            SUM((220 * corrente * 5) / 3600000) AS kWh
        FROM corrente_db.medicao
        WHERE horario >= NOW() - INTERVAL 24 HOUR 
        GROUP BY hora
        ORDER BY hora ASC
    `
    
    const peak = `
        SELECT 
            DATE(horario) AS data,
            SUM((220 * corrente * 5) / 3600000) AS kWh
        FROM corrente_db.medicao
        GROUP BY data
        ORDER BY kWh DESC
        LIMIT 1;
    `

    db.query(dailyQuery, (error, dailyResult) => {
        if (error) {
            console.error('Erro ao buscar consumo diário:', error)
            return res.status(500).json({ error: 'Erro ao buscar consumo diário' })
        }
        db.query(monthlyQuery, (error, monthlyResult) => {
            if (error) {
                console.error('Erro ao buscar consumo mensal:', error)
                return res.status(500).json({ error: 'Erro ao buscar consumo mensal' })
            }
            db.query(last, (error, lastHoursResult) => {
                if (error) {
                    console.error('Erro ao buscar consumo das últimas 24h:', error)
                    return res.status(500).json({ error: 'Erro ao buscar consumo das últimas 24 horas' })
                }
                db.query(peak, (error, peakResult) => {
                    if (error) {
                        console.error('Erro ao buscar o pico de consumo diário:', error)
                        return res.status(500).json({ error: 'Erro ao buscar o pico de consumo diário' })
                    }
                    res.json({
                        daily: dailyResult || null,
                        monthly: monthlyResult || null,
                        last: lastHoursResult || null,
                        peak: peakResult[0] || null
                    })
                })
            })
        })
    })
})

module.exports = router