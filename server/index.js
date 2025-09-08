import express from 'express'
import priceApprox from './priceApprox.js'

const app = express()
app.use(express.json())
app.use(priceApprox)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Price API listening on port ${PORT}`)
})
