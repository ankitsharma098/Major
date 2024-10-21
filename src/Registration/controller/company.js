import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { companySchema } from "../schema/company.js";
import { ApiError } from "../../utils/ApiErrors.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { validateEmail, validatePassword } from "../../utils/validators.js";

const Company =  mongoose.model("companies", companySchema);


const registerCompany = asyncHandler(async (req, res) => {
  const {
   // Company Info
   name,
   email,
   registrationNumber,
   industry,
   size,
   website,
   description,
   logo,

   // Contact Info
   contactPerson,
   phoneNumber,
   address,

   // Auth
   password,

   // Optional Documents
   documents
  } = req.body;

  // Validate required fields
  const requiredFields = [
    name,
    email,
    password,
    registrationNumber,
    industry,
    contactPerson,
    phoneNumber
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
      name: name.trim(),
      email: email.toLowerCase(),
      registrationNumber: registrationNumber.trim(),
      industry: industry.trim(),
      size: size?.trim(),
      website: website?.trim(),
      description: description?.trim(),
      logo: logo?.trim()
    },
    contactInfo: {
      personName: contactPerson.trim(),
      phoneNumber: phoneNumber.trim(),
      address: address?.trim()
    },
    auth: {
      password: hashedPassword
    },
    verificationStatus: "pending",
    subscriptionPlan: "basic",
    jobPostingCredits: 5,
    documents: documents?.map(doc => ({
      type: doc.type?.trim(),
      url: doc.url?.trim(),
      verified: false
    })) || [],
    postedJobs: []
  });

  if (!registeredCompany) {
    throw new ApiError(500, "Failed to register company");
  }

  // const companyResponse = registeredCompany.toObject();
  // delete companyResponse.auth;
  // delete companyResponse.updatedAt;
  // delete companyResponse.createdAt;

  // const authTokens = {
  //   accessToken: generateAccessToken(companyResponse._id),
  //   refreshToken: generateRefreshToken(companyResponse._id)
  // };

  // const cookieOptions = {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production"
  // };

  return res
    .status(201).json({
    message:"Company Registered Successfully"
    });
});

export { registerCompany };