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

app.post('/insertData', (req, res) => {
    // const correntes = req.body.correntes

    // if (!Array.isArray(correntes) || correntes.length !== 5) {
    //     return res.status(400).json({ error: "Expected array of 5 corrente readings" });
    // }

    // const endTime = new Date()

    // function formatDateTime(date) {
    //     return date.toISOString().slice(0, 19).replace("T", " ");
    // }

    // const dataWithTimestamps = correntes.map((corrente, i) => {
    //     const timestamp = new Date(endTime.getTime() - (4 - i) * 1000)

    //     return {
    //         corrente: corrente.corrente,
    //         timestamp: formatDateTime(timestamp)
    //     }
    // })

    // let completed = 0
    // let errors = []

    // dataWithTimestamps.forEach((e) => {
    //     database.query(
    //         'INSERT INTO corrente_db.medicao (corrente, horario) VALUES (?,?)',
    //         [e.corrente, e.timestamp],
    //         (err) => {
    //             if (err) {
    //                 errors.push(err)
    //             }
    //             completed++

    //             if (completed === dataWithTimestamps.length) {
    //                 if (errors.length > 0) {
    //                     res.status(400).json({ error: "Some inserts failed", details: errors })
    //                 } else {
    //                     res.status(200).send('Sucesso')
    //                 }
    //             }
    //         }
    //     )
    // })
    console.log('chama fi')
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