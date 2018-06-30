//Server functions with db-interaction

const express = require('express')
const router = express.Router()
const firebase = require('firebase')
const admin = require('firebase-admin')
const app = express()

//säger att sebbe hade lite fel och lite rätt
router.get('/serverfunctiontest', function(req, res){

	console.log('sebbe hade lite rätt')
})



module.exports = router