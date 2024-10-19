
import express from "express";
import {registerDisabilityCandidate} from "../controller/candidate.js"
import {registerCompany} from "../controller/company.js"
const router=express.Router();

router.post("/candidate",registerDisabilityCandidate)
router.post("/company",registerCompany)

export {router as registration}