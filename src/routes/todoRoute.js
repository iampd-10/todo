import express from 'express';
import { hasToken } from '../middleware/hasToken.js';
import { addTodo, deleteTodo, getByIdTodo, getTodo, updateByIdTodo } from '../controllers/todoController.js';


const todoRoute = express.Router();

todoRoute.post('/createtodo', hasToken, addTodo)
todoRoute.get('/getall', hasToken, getTodo)
todoRoute.get('/getid/:id', hasToken, getByIdTodo)
todoRoute.put('/updateid/:id', hasToken, updateByIdTodo)
todoRoute.delete('/deletetodo/:id', hasToken, deleteTodo);

export default todoRoute;

