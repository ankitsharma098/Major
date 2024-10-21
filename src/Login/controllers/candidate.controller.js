import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiErrors.js";
import mongoose from "mongoose";
import { disabilityCandidateSchema } from "../../Registration/schema/candidate.js";
import bcrypt from "bcrypt"
import { generateAccessToken, generateRefreshToken } from "../../utils/generateTokens.js";

const DisabilityPersonModel= new mongoose.model("disability_candidates",disabilityCandidateSchema)

const candidateLogin=asyncHandler(async(req,res)=>{
  try{
    const username=req.body?.username ?? "";
    const email=req.body?.email ?? "";
    const password=req.body?.password ?? "";
   console.log("username",username);
   console.log("email",email);

  if (!username.trim() && !email.trim()) {
    throw new ApiError(400, "Username or email are required");
  }

  if(!password?.trim()){
throw new ApiError(400,"Password is required")
  }

  const candidate =await DisabilityPersonModel.findOne(
    username!="" ?{"personalInfo.username": username.toLowerCase()}:{"personalInfo.email": email.toLowerCase()}).lean()
  

  console.log("candidate",candidate);
  
  if(!candidate){
    throw new ApiError(400,"Username is not Exist");
  }
 
   const isPasswordValid = await bcrypt.compare(password,candidate.auth.password);

   if(!isPasswordValid){
    throw new ApiError(401,"Invalid Credentials");
   }

  //  const candidateObject = candidate.toObject();
  delete candidate.auth;
  delete candidate.updatedAt;
  delete candidate.createdAt;
  delete candidate.__v;

   
  const accessToken = generateAccessToken(candidate._id);
  const refreshToken = generateRefreshToken(candidate._id);

  const cookieOptions = {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production"
  };

  return res.status(200).cookie("accessToken",accessToken,cookieOptions).cookie("refreshToken",refreshToken,cookieOptions).json({
    user:candidate,
    tokens:{
      "accessToken":accessToken,
      "refreshToken":refreshToken
    },
  })
  }catch(e){
    console.log("Error",e);
    return res.status(500).json({"error":e.toString()})
  }

})

export {candidateLogin}