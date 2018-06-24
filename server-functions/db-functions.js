//Server functions with db-interaction

const express = require('express')
const firebase = require('firebase')
const admin = require('firebase-admin')
const app = express()
const router = express.Router()



module.exports = router