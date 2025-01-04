import express from "express";

const app = express();

app.use("/api/v1",mainRouter);

//before starting the app make sure database is connected.
app.listen(8000,()=>{
    console.log("App started at port 8000");    
})