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


//force ssl

env = process.env.NODE_ENV || 'development';

var forceSsl = function (req, res, next) {
	if (req.headers['x-forwarded-proto'] !== 'https') {
		return res.redirect(['https://', req.get('Host'), req.url].join(''));
	}
	return next();
};

if (env === 'production') {
	app.use(forceSsl);
}

// Firebase
var serviceAccount = require("./fleet-7cb48-firebase-adminsdk-73xdg-45db96141a.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://fleet-7cb48.firebaseio.com"
});

admin.database().ref('/users/userx').set({
    username: "test",
    email: "test@mail.com"
});

//ses

var ses = require('node-ses')
  , sesClient = ses.createClient({ key: 'AKIAIYYQKFSZHBJ3OODA', secret: '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', amazon:'https://email.eu-west-1.amazonaws.com' });
 
// Give SES the details and let it construct the message for you. 

function sendEmail(emailAddress, subject, content){
	sesClient.sendEmail({
		to: emailAddress
	 , from: 'Fleet <info@fleetofcreators.com>'
	 , subject: subject
	 , message: content
	}, function (err, data, res) {
		if(err){
			console.log(err)
		}
		if(data){
			console.log(data)
		}
	})
}

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

app.get('/sendEmail/:info', sendFrontendEmail)

function sendFrontendEmail(req, res) {
	var params = req.params
	var infoObj = params.info
	var info = JSON.parse(infoObj)

	var receiver = info.receiver
	var subject = info.subject
	var content = info.content + '<br><br><a href="www.fleetofcreators.com">Go to Fleet</a>'

	sendEmail(receiver, subject, content)

	res.send(true)
}

// Declaring Port
const port = process.env.PORT || 8000

// Start Server
app.listen(port, function(){
	console.log('Listening on port ' + port)
}) 

//sendEmail("sebastian@thunman.se", "subject", "YAY")