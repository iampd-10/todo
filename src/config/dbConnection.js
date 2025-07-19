import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.url

export async function Connection(){
    try {
        await mongoose.connect(url)
        console.log("mongodb connected")
    } catch (error) {
        console.log("not connected",error)
    }
}