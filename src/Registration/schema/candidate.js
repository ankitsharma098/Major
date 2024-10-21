import mongoose from "mongoose";

const disabilityCandidateSchema = new mongoose.Schema({
  personalInfo: {
    username:{type : String, required:true, unique:true},
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    address: {type: String},
    dateOfBirth: {type: Date}
  },
  
  disabilityDetails: {
    type: { type: String, required: true }, // Visual, Hearing, Physical, etc.
    percentage: {type:Number},
    certificateNumber: {type:String},
    certificateDoc: {type: String} // URL/Path to uploaded document
  },
  
  education: [{
    degree: {type:String},
    institution:  {type:String},
    year:  {type:Number},
    grade:  {type:String},
  }],
  
  skills: [String],
  
  workExperience: [{
    company: {type:String},
    position: {type:String},
    duration: {type:String},
    responsibilities: [String]
  }],
  
  jobPreferences: {
    industries: [{type:String}],
    roles: [{type:String}],
    expectedSalary: {type:Number},
    location: [{type:String}],
  },
  
  auth: {
    password: { type: String, required: true },
    // resetToken: String,
    // resetTokenExpiry: Date
  },
  
  // status: {
  //   type: {type:String},
  //   enum: ['active', 'inactive', 'pending'],
  //   default: 'pending'
  // },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export {disabilityCandidateSchema}

