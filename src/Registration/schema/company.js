import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  companyInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    registrationNumber: { type: String, required: true, unique: true },
    industry: { type: String, required: true },
    size: { 
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-500', '500+']
    },
    website: String,
    description: String,
    logo: String // URL to uploaded logo
  },

  contactInfo: {
    personName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: String
  },

  auth: {
    password: { type: String, required: true },
    // resetToken: String,
    // resetTokenExpiry: Date
  },

  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },

  subscriptionPlan: {
    type: String,
    enum: ['basic', 'premium', 'enterprise'],
    default: 'basic'
  },

  jobPostingCredits: {
    type: Number,
    default: 5
  },

  documents: [{
    type: { type: String }, // registration certificate, tax documents, etc.
    url: String,
    verified: { type: Boolean, default: false }
  }],

  postedJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  }],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export { companySchema };