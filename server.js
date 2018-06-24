const express = require('express')
const logger = require('morgan') 
const path = require('path')
const stylus =require('stylus')
const nib = require('nib')
const bodyParser = require('body-parser')
const firebase = require('firebase')
const admin = require('firebase-admin')

// Initiate App
const app = express()

//Compile Stylus

function compile(str, path){
	return stylus(str)
	.set('filename', path)
	.use(nib())
}

app.use(bodyParser())

// Load View Engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(express.static('static'))

// Routes
const router = require('./routers/router.js')
app.use(router)

//Use db-functions
const dbFunctions = require('./server-functions/db-functions.js')
app.use(dbFunctions)

//Use post-handlers
const postHandlers = require('./server-functions/post-handlers.js') 
app.use(postHandlers)

// Declaring Port
const port = process.env.PORT || 8000

// Start Server
app.listen(port, function(){
	console.log('Listening on port ' + port)
}) 