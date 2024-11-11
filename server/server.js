const express = require('express')
const cors = require('cors')
const database = require('./models/db.js')
const app = express()

app.use(express.json())
app.use(cors())

const port = 4000

const statistics = require('./routes/Statistics.js')
app.use('/statistics', statistics)

const realTime = require('./routes/RealTime.js')
app.use('/realTime', realTime)

const insertData = require('./routes/InsertData.js')
app.use('/insertData', insertData)

//const baseDir = `${__dirname}/build/`

//app.use(express.static(`${baseDir}`))

//app.get('*', (req,res) => res.sendFile('index.html' , { root : baseDir }))

// rodar o server
app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${port}`)
})