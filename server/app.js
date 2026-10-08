const express = require('express')
require('dotenv').config()
const customerRouter = require('./Routers/customersRouter.ts')
const authRouter = require('./Routers/authRouter.ts')
const cors = require('cors')
const cookiesParser = require("cookie-parser")
const {checkAuth} = require('./middlewares/checkAuth.ts')


const server = express()
server.use(express.json())
server.use(cookiesParser())
server.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}))

const PORT = process.env.PORT || 8000


server.use('/customers', checkAuth ,customerRouter)
server.use('/auth', authRouter)

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
