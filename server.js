import express from 'express';
import dotenv from 'dotenv/config'
import { Connection } from './src/config/dbConnection.js';

const app = express();

const port= process.env.PORT;

Connection()

app.listen(port,()=>{
    console.log(`server running at port ${port}`);
})