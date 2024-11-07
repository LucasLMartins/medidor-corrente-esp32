const express = require('express')
const cors = require('cors')
const database = require('./models/db.js')
const app = express()

app.use(express.json())
app.use(cors())

const port = 4000

// rodar o server
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
})