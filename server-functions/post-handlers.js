//Handling post requests

const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const firebase = require('firebase')

const app = express()

router.post('/create-user/creator', function(req, res){
	const body = req.body
	const firstname = body.firstname
	const lastname = body.lastname
	const password = body.password

	firebase.auth().createUserWithEmailAndPassword(email, password).catch(error){
		const errorCode = error.code
		const errorMessage = error.message
		constole.log(errorCode + ' ' + errorMessage)
	}

	var user = firebase.auth().currentUser

	firebase.database.ref('users/creators/' + user.uid).set({
		firstname: firstname,
		lastname: lastname,
		email: email
	})
})

module.exports = router