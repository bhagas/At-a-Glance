import express from 'express'
const router = express.Router()
import fd from'./controller.js'
// middleware that is specific to this router
router.post('/ticketupdate', fd.ticketUpdate)
router.post('/ticketcreate', fd.ticketCreate)


export default router