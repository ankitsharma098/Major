import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { companySchema } from "../schema/company.js";
import { ApiError } from "../../utils/ApiErrors.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/generateTokens.js";
import { validateEmail, validatePassword } from "../../utils/validators.js";

const Company =  mongoose.model("companies", companySchema);


const registerCompany = asyncHandler(async (req, res) => {
  const {
    companyName,
    email,
    password,
    industry,
    contactPerson,
    phoneNumber,
    websiteUrl,
    companySize,
    registrationNumber,
    companyAddress,
    description
  } = req.body;

  // Validate required fields
  const requiredFields = [
    companyName,
    email,
    password,
    industry,
    contactPerson,
    phoneNumber,
    registrationNumber
  ];

  if (requiredFields.some((field) => !field?.trim())) {
    throw new ApiError(400, "All required fields must be provided");
  }

  // Validate email format
  if (!validateEmail(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  // Check for existing company
  const existingCompany = await Company.findOne({
    $or: [
      { "companyInfo.email": email.toLowerCase() },
      { "companyInfo.registrationNumber": registrationNumber }
    ]
  });

  if (existingCompany) {
    throw new ApiError(
      409,
      "Company with this email or registration number already exists"
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const registeredCompany = await Company.create({
    companyInfo: {
      name: companyName.trim(),
      email: email.toLowerCase(),
      registrationNumber: registrationNumber.trim(),
      industry: industry.trim(),
      size: companySize,
      website: websiteUrl?.trim(),
      description: description?.trim()
    },
    contactInfo: {
      personName: contactPerson.trim(),
      phoneNumber: phoneNumber.trim(),
      address: companyAddress?.trim()
    },
    auth: {
      password: hashedPassword
    },
    verificationStatus: "pending",
    subscriptionPlan: "basic",
    jobPostingCredits: 5 // Default free credits
  });

  if (!registeredCompany) {
    throw new ApiError(500, "Failed to register company");
  }

  const companyResponse = registeredCompany.toObject();
  delete companyResponse.auth;
  delete companyResponse.updatedAt;
  delete companyResponse.createdAt;

  const authTokens = {
    accessToken: generateAccessToken(companyResponse._id),
    refreshToken: generateRefreshToken(companyResponse._id)
  };

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production"
  };

  return res
    .status(201)
    .cookie("accessToken", authTokens.accessToken, cookieOptions)
    .json({
      company: companyResponse,
      tokens: authTokens
    });
});

export { registerCompany };