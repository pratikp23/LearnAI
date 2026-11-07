import express from "express"
import isAuth from "../middlewares/isAuth.js"
import upload from "../middlewares/multer.js"
import { 
    searchWithAi, 
    generateRoadmap, 
    generateInterviewQuestions, 
    evaluateResponse, 
    generateStudyPlan,
    generateQuiz,
    trackMistake,
    analyzeMistakes,
    analyzeResume,
    askAiAssistant
} from "../controllers/aiController.js"

let aiRouter = express.Router()

aiRouter.post("/search", searchWithAi)
aiRouter.post("/generate-roadmap", generateRoadmap)
aiRouter.post("/generate-questions", generateInterviewQuestions)
aiRouter.post("/evaluate-response", evaluateResponse)
aiRouter.post("/generate-study-plan", generateStudyPlan)
aiRouter.post("/generate-quiz", generateQuiz)
aiRouter.post("/track-mistake", isAuth, trackMistake)
aiRouter.get("/analyze-mistakes", isAuth, analyzeMistakes)

// Support both path names for resume analysis
aiRouter.post("/resume-analyzer", upload.single('resumeImage'), analyzeResume)
aiRouter.post("/analyze-resume", upload.single('resumeImage'), analyzeResume)

// Direct AI Assistant query for the AI Hub
aiRouter.post("/ask", askAiAssistant)

export default aiRouter
