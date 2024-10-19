import app from "./app.js"
import express from "express"
import { connectDB } from "./db/index.js";
import env from "../env.js";

const PORT=env.PORT || 8000;


const startServer=async()=>{
  try{
    console.log('Starting server...');
    connectDB().then(()=>{
      app.listen(()=>{
        console.log("App listen to Port",PORT);
      })
       app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
      });
      app.get('/', (req, res) => {
        res.send('Test route in index.js is working');
      });
  
    })

  }catch(e){
    console.error('Failed to start the server:', error);
  }


} 
startServer();

