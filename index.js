#!/usr/bin/env node
require('dotenv').config()
const entry = require('./src/entry')
const port= process.env.PORT || 3000;

entry.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
