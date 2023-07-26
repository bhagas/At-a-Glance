import express from'express'
const router = express.Router()
import fd from'./modules/freshdesk/router.js'
// middleware that is specific to this router
router.use('/fd', fd)

router.get('/', (req,res)=>{
    res.json({status:'wrong endpoint!'})
})

export default router