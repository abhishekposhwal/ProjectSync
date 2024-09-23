import dotenv from 'dotenv';
import connectDB from './db/index.js';
import {app}  from './app.js';

dotenv.config({
    path: './env'
})


connectDB()
.then( () => {
    app.listen(process.env.PORT || 3000, () => {
        console.log("SERVER is listening on port " + process.env.PORT);
    })
    app.on('error', () => {
        console.log("ERROR: ", error);
        throw error
    })
})
.catch( (error) => {
    console.log("MONGO DB CONNECTION FAILED !! ", error);
})












/*
import { Express } from "express";
const app = express();

( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        app.on('error', () => {
            console.log("ERROR: ", error);
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`App listening on ${process.env.PORT}`);
        })
        
    } catch (error) {
        console.error("ERROR:", error)
        throw error
    }
})()
*/