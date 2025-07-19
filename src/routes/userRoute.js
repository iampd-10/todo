import express from 'express'
import { register } from '../controllers/userController.js'

const route = express.Router()

route.post('/register', register)

export default route