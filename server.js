import express from 'express';
import dotenv from 'dotenv'
import { Connection } from './src/config/dbConnection.js';
import route from './src/routes/userRoute.js';
import { home } from './src/Home/home.js';
import todoRoute from './src/routes/todoRoute.js';
const app = express();
dotenv.config()

const port = process.env.PORT;

Connection()

app.get('/', home)

app.use(express.json())

app.use('/user', route)

app.use('/todo', todoRoute)

app.listen(port,()=>{
    console.log(`✅ Server is running at http://localhost:${process.env.PORT}`);
})