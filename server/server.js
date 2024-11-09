const express = require('express')
const cors = require('cors')
const database = require('./models/db.js')
const app = express()


app.use(express.json())
app.use(cors())

const port = 4000

//const baseDir = `${__dirname}/build/`

//app.use(express.static(`${baseDir}`))

//app.get('*', (req,res) => res.sendFile('index.html' , { root : baseDir }))

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

app.post('/insertData', (req, res) => {
    const corrente = req.body.corrente

    insert(corrente)

    res.status(200)
})

app.get('/getData', (req, res) => {
    database.query(
        'SELECT * FROM corrente_db.medicao', (err, result) => {
            if (err) {
                console.log(`Erro ao solicitar os dados, erro: ${err}`)
                res.status(400).json({ result: "Erro ao solicitar os dados"})
            }

            res.status(200).json({
                result: result
            })
        }
    )
})

// rodar o server
app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${port}`)
})