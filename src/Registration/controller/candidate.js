import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { disabilityCandidateSchema } from "../schema/candidate.js";
import { ApiError } from "../../utils/ApiErrors.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/generateTokens.js";
import { validateEmail, validatePassword } from "../../utils/validators.js";

const DisabilityPerson = mongoose.model("disability_candidates", disabilityCandidateSchema);

const registerDisabilityCandidate = asyncHandler(async (req, res) => {
  const {
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
    birthDate,
    residentialAddress,
    disabilityCategory
  } = req.body;

  const requiredFields = [
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
    disabilityCategory
  ];

  if (requiredFields.some((field) => !field?.trim())) {
    throw new ApiError(400, "All required fields must be provided");
  }

  if (!validateEmail(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  const existingCandidate = await DisabilityPerson.findOne({
    "personalInfo.email": email.toLowerCase()
  });

  if (existingCandidate) {
    throw new ApiError(409, "Account with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const registeredCandidate = await DisabilityPerson.create({
    personalInfo: {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase(),
      phoneNumber: phoneNumber.trim(),
      address: residentialAddress?.trim(),
      dateOfBirth: birthDate ? new Date(birthDate) : undefined
    },
    disabilityDetails: {
      type: disabilityCategory.trim()
    },
    auth: {
      password: hashedPassword
    }
  });

  if (!registeredCandidate) {
    throw new ApiError(500, "Failed to register candidate");
  }

  const candidateResponse = registeredCandidate.toObject();
  delete candidateResponse.auth;
  delete candidateResponse.updatedAt;
  delete candidateResponse.createdAt;

  const authTokens = {
    accessToken: generateAccessToken(candidateResponse._id),
    refreshToken: generateRefreshToken(candidateResponse._id)
  };

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production"
  };

  return res
    .status(201)
    .cookie("accessToken", authTokens.accessToken, cookieOptions)
    .json({
      user: candidateResponse,
      tokens: authTokens
    });
});


export { registerDisabilityCandidate };