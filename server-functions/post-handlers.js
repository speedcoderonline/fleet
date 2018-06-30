//Handling post requests

const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')

const app = express()

router.post('/create-user/creator', function(req, res){
	const body = req.body
	const firstname = body.firstname
	const lastname = body.lastname
	const email = body.email
	const password = body.password

	admin.auth().createUserWithEmailAndPassword(email, password).catch(function(error){
		const errorCode = error.code
		const errorMessage = error.message
		constole.log(errorCode + ' ' + errorMessage)
	})

	var user = admin.auth().currentUser

	admin.database.ref('users/creators/' + user.uid).set({
		firstname: firstname,
		lastname: lastname,
		email: email
	})
})

module.exports = router