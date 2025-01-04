import express from "express";
import db from "./src/db/connectToDatabase";
const app = express();

app.use("/api/v1",mainRouter);

//before starting the app make sure database is connected
try {
    db.connect((err)=>{
        if(err){
            console.log("Error connecting to db");
        }
        app.listen(8000,()=>{
            console.log("App started at port 8000");    
        });
    })
} catch (error) {
    console.log("Error connecting to db");
}