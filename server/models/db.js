const mysql = require('mysql')
const dotenv = require('dotenv')
dotenv.config()

const connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE
})

connection.connect(function(erro){
    if (erro){
        console.log('Erro ao conectar ao mySQL, erro: ' + erro)
    }
    if (!erro){
       console.log('Conectado ao mySQL com sucesso')
    }
})

global.db = connection
module.exports = connection