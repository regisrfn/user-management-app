// server.js
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
var serveStatic = require('serve-static')
var history = require('connect-history-api-fallback')

const app = express()

app.use(morgan('combine'))
app.use(bodyParser.json())
app.use(cors())
app.use(history())

/* eslint-disable*/
app.use(serveStatic(__dirname + '/dist/user-management'))

var port = process.env.PORT || 4200
app.listen(port)

console.log('server started ' + port)