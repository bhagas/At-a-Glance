const express = require('express')
const router = express.Router()
const fd = require('./modules/freshdesk/router')
// middleware that is specific to this router
router.use('/fd', fd)

router.get('/', (req,res)=>{
    res.json({status:'wrong endpoint!'})
})

module.exports = router