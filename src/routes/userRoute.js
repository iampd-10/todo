import express from 'express'
import { login, register, reverifyUser } from '../controllers/userController.js'
import { verification } from '../middleware/verifyToken.js'
import { createTodo, getTodos } from '../controllers/todoController.js'

const route = express.Router()

route.post('/register', register)
route.get('/verify', verification)
route.post('/login', login)
route.post('/reverify', reverifyUser)

//todo routes
route.post('/todo', createTodo)
route.get('/todo', getTodos)
export default route