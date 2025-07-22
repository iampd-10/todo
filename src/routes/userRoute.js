import express from 'express'
import { login, register, reverifyUser } from '../controllers/userController.js'
import { verification } from '../middleware/verifyToken.js'

const route = express.Router()

route.post('/register', register)
route.get('/verify', verification)
route.post('/login', login)
route.post('/reverify', reverifyUser)

export default route