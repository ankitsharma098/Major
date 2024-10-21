import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiErrors.js";
import mongoose from "mongoose";
import { companySchema } from "../../Registration/schema/company.js";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../../utils/generateTokens.js";

const Company = mongoose.model("companies", companySchema);

const companyLogin = asyncHandler(async (req, res) => {
  try{

    // Get email and password from request body
  const { email, password } = req.body;

  // Validate required fields
  if (!email?.trim() || !password?.trim()) {
    throw new ApiError(400, "Email and password are required");
  }

  // Find company by email
  const company = await Company.findOne({
    "companyInfo.email": email.toLowerCase()
  }).lean(); // Explicitly select password field if it's marked as select: false

  // Check if company exists
  if (!company) {
    throw new ApiError(404, "Company not found");
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(
    password,
    company.auth.password
  );

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Convert to plain object and remove sensitive fields
  delete company.auth;
  delete company.updatedAt;
  delete company.createdAt;
  delete company.__v;

  // Generate tokens
  const accessToken = generateAccessToken(company._id);
  const refreshToken = generateRefreshToken(company._id);

  // Set cookie options
  const cookieOptions = {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production",
    // sameSite: 'strict',
    // maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  };

  // // Store refresh token in database (optional but recommended)
  // company.refreshToken = refreshToken;
  // await company.save({ validateBeforeSave: false });

  // Check verification status
  if (company.verificationStatus === 'rejected') {
    throw new ApiError(403, "Your company account has been rejected. Please contact support.");
  }

  // Add verification status warning in response if pending
  let message = "Logged in successfully";
  if (company.verificationStatus === 'pending') {
    message = "Logged in successfully. Your company verification is pending.";
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json({
      message,
        company: {
          ...company,
          verificationStatus: company.verificationStatus,
          subscriptionPlan: company.subscriptionPlan,
          jobPostingCredits: company.jobPostingCredits
        },
        tokens:{
          "accessToken":accessToken,
          "refreshToken":refreshToken,
        }
    }
  );
  }catch(e){
    console.log("Error",e);
    return res.status(500).json({"error":e.message.toString()})
  }
});




export { companyLogin};