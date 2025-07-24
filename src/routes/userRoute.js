import express from 'express'
import { login, logout, register, reverifyUser, updateUser } from '../controllers/userController.js'
import { verification } from '../middleware/verifyToken.js'
// import { createTodo, getTodos } from '../controllers/todoController.js'

const route = express.Router()

route.post('/register', register)
route.get('/verify', verification)
route.post('/login', login)
route.post('/reverify', reverifyUser)
route.post('/logout', logout)
route.post('/update', updateUser)

//todo routes
// route.post('/todo', createTodo)
// route.get('/todo', getTodos)
export default route