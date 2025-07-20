import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.url

export async function Connection(){
    try {
        await mongoose.connect(url)
        console.log(`Database is Connected at cluster0.9taqa3o.mongodb.net https://www.mongodb.com/`)
    } catch (error) {
        console.log("not connected",error)
    }
}