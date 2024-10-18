import express from "express"
import { connectDB } from "./db/index.js";
const app =express();
connectDB().then(()=>{
  app.listen(()=>{
    console.log("App listen");
  })
})
