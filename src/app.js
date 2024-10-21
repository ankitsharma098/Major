import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app=express();


app.use(cors(
  {
    origin:"*",
    credentials:true,
    optionsSuccessStatus:200
  }
))

app.use(express.json({
  limit:"16kb",
}))

app.use(cookieParser())



import { registration } from "./Registration/routes/index.js";
import { login } from "./Login/routes/index.js";

app.use("/register",registration)
app.use("/login",login)

export default app;