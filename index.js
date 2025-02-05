#!/usr/bin/env node
import "./src/config/sentry.js";
import 'dotenv/config'
import entry from './src/entry/entry.js'
const port = process.env.PORT || 3000

entry.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
