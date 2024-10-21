import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { disabilityCandidateSchema } from "../schema/candidate.js";
import { ApiError } from "../../utils/ApiErrors.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { validateEmail, validatePassword } from "../../utils/validators.js";

const DisabilityPerson = mongoose.model("disability_candidates", disabilityCandidateSchema);

const registerDisabilityCandidate = asyncHandler(async (req, res) => {
  const {
    username,
    name,
    email,
    password,
    phoneNumber,
    address,
    dateOfBirth,

    disabilityType,
    disabilityPercentage,
    certificateNumber,
    certificateDoc,
    // Education
    education,

    // Skills
    skills,

    // Work Experience
    workExperience,

    // Job Preferences
    jobPreferences

  } = req.body;

  const requiredFields = [
    username,
    name,
    email,
    password,
    phoneNumber,
    disabilityType
  ];


  if (requiredFields.some((field) => !field?.trim())) {
    throw new ApiError(400, "All required fields must be provided");
  }

  if (!validateEmail(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  const existingCandidate = await DisabilityPerson.findOne({
    $or: [
      { "personalInfo.email": email.toLowerCase() },
      { "personalInfo.username": username.toLowerCase() }
    ]
  });

  if (existingCandidate) {
    throw new ApiError(409, "Account with this email or username already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const registeredCandidate = await DisabilityPerson.create({
    personalInfo: {
      username: username.toLowerCase().trim(),
      name: name.trim(),
      email: email.toLowerCase(),
      phoneNumber: phoneNumber.trim(),
      address: address?.trim(),
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined
    },
    disabilityDetails: {
      type: disabilityType.trim(),
      percentage: disabilityPercentage,
      certificateNumber: certificateNumber?.trim(),
      certificateDoc: certificateDoc
    },
    education: education?.map(edu => ({
      degree: edu.degree?.trim(),
      institution: edu.institution?.trim(),
      year: edu.year,
      grade: edu.grade?.trim()
    })) || [],
    skills: skills?.map(skill => skill.trim()) || [],
    workExperience: workExperience?.map(exp => ({
      company: exp.company?.trim(),
      position: exp.position?.trim(),
      duration: exp.duration?.trim(),
      responsibilities: exp.responsibilities?.map(resp => resp.trim()) || []
    })) || [],
    jobPreferences: {
      industries: jobPreferences?.industries?.map(ind => ind.trim()) || [],
      roles: jobPreferences?.roles?.map(role => role.trim()) || [],
      expectedSalary: jobPreferences?.expectedSalary,
      location: jobPreferences?.location?.map(loc => loc.trim()) || []
    },
    auth: {
      password: hashedPassword
    }
  });

  if (!registeredCandidate) {
    throw new ApiError(500, "Failed to register candidate");
  }

  // const candidateResponse = registeredCandidate.toObject();
  // delete candidateResponse.auth;
  // delete candidateResponse.updatedAt;
  // delete candidateResponse.createdAt;

  // const authTokens = {
  //   accessToken: generateAccessToken(candidateResponse._id),
  //   refreshToken: generateRefreshToken(candidateResponse._id)
  // };

  // const cookieOptions = {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production"
  // };

  return res
    .status(201).json({
      message : "User is Registered Successfully"
    });
});


export { registerDisabilityCandidate };