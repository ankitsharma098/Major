import express from "express"
import { companyLogin } from "../controllers/company.controller.js"
import { candidateLogin } from "../controllers/candidate.controller.js"

const router = express.Router()


router.post("/company",companyLogin),
router.post("/candidate",candidateLogin)

export {router as login}