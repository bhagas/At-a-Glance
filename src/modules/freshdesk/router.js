const express = require('express')
const router = express.Router()
const fd = require('./controller')
// middleware that is specific to this router
router.post('/ticketupdate', fd.ticketUpdate)
router.post('/ticketcreate', fd.ticketCreate)


module.exports = router