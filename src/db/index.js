import mongoose  from "mongoose";
import env from "../../env.js";

const connectDB= async()=>{

try{
 const MONGODB_URI=env.MONGODB_URI
 console.log(MONGODB_URI);
 if(!MONGODB_URI){
  throw new Error("MONGODB_URI is not defined in environment variables");
 }

 const connectionInstance = await mongoose.connect(`${MONGODB_URI}`);
 console.log(connectionInstance.connection.host);



}catch(error){
 console.error("MongoDB connection error ", error);
    throw error; 
}

}
export {connectDB}
