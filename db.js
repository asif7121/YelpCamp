import MongoStore from "connect-mongo";
import mongoose from "mongoose";

const dbURL = process.env.MONGODB_STRING;

export const db = async() => {
    await mongoose.connect( dbURL ).then( () => {

        console.log("Database connected successfully!");
    } ).catch( (e) => {
        
        console.log(`connection error: ${e}`);
    })
 }


 export const store = MongoStore.create({
   mongoUrl: dbURL,
   touchAfter: 24 * 60 * 60,
   crypto: {
     secret: "thisshouldbeabettersecret!",
   },
 });
 store.on("error", function (e) {
   console.log("Session Store Error", e);
 });

