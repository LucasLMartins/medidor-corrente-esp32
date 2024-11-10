const express = require('express')
const router = express.Router()

function insert(corrente) {
    function formatDateTime(date) {
        return date.toISOString().slice(0, 19).replace("T", " ")
    }

    const timestamp = new Date().setHours(new Date().getHours() - 3)

    const obj = {
        corrente: corrente,
        timestamp: formatDateTime(new Date(timestamp))
    }

    database.query(
        'INSERT INTO corrente_db.medicao (corrente, horario) VALUES (?,?)',
        [obj.corrente, obj.timestamp],
        (err) => {
            if (err) {
                console.log(err)
            }
        }
    )
}

router.post('/', (req, res) => {
    const corrente = req.body.corrente

    insert(corrente)

    res.status(200)
})

module.exports = router