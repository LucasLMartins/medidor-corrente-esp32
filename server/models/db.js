const mysql = require('mysql')
const dotenv = require('dotenv')
dotenv.config()

const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
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