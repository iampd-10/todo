import express from 'express';
import dotenv from 'dotenv/config'
import { Connection } from './src/config/dbConnection.js';
import route from './src/routes/userRoute.js';

const app = express();

const port= process.env.PORT;

Connection()
app.use(express.json())
app.use('/user', route)

app.listen(port,()=>{
    console.log(`server running at port ${port}`);
})