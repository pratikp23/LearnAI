import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import dotenv from "dotenv";
import Course from "../models/courseModel.js";
import Mistake from "../models/mistakeModel.js";
import fs from 'fs';
dotenv.config();

const getApiKey = () => {
    const rawKey = process.env.GEMINI_API_KEY || "";
    const cleanKey = rawKey.trim().replace(/^["']|["']$/g, '');
    if (!cleanKey) {
        throw new Error("GEMINI_API_KEY is missing. Please set GEMINI_API_KEY in your environment variables.");
    }
    return cleanKey;
};

let cachedModels = null;
let lastModelFetch = 0;

const getAvailableModels = async (apiKey) => {
    if (cachedModels && (Date.now() - lastModelFetch < 10 * 60 * 1000)) {
        return cachedModels;
    }
    
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const response = await axios.get(url, { timeout: 8000 });
        if (response.data && response.data.models) {
            const valid = response.data.models
                .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent"))
                .map(m => m.name.replace(/^models\//, ''));
            
            console.log("Dynamically discovered available Gemini models:", valid);
            if (valid.length > 0) {
                const priority = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-2.0-flash", "gemini-1.5-pro", "gemini-pro"];
                const sorted = [
                    ...priority.filter(p => valid.includes(p)),
                    ...valid.filter(v => !priority.includes(v))
                ];
                cachedModels = sorted;
                lastModelFetch = Date.now();
                return sorted;
            }
        }
    } catch (err) {
        console.warn("Could not list models dynamically:", err.response?.data?.error?.message || err.message);
    }

    return ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-2.0-flash", "gemini-pro", "gemini-1.5-pro"];
};

const callGemini = async (prompt) => {
    return callGeminiMultimodal(prompt);
};

const callGeminiMultimodal = async (prompt, filePath = null) => {
    const apiKey = getApiKey();
    const genAI = new GoogleGenerativeAI(apiKey);
    const availableModels = await getAvailableModels(apiKey);

    const parts = [prompt];

    if (filePath && fs.existsSync(filePath)) {
        const fileBuffer = fs.readFileSync(filePath);
        const lower = filePath.toLowerCase();
        let mimeType = 'image/jpeg';
        if (lower.endsWith('.png')) mimeType = 'image/png';
        else if (lower.endsWith('.pdf')) mimeType = 'application/pdf';
        else if (lower.endsWith('.webp')) mimeType = 'image/webp';

        parts.push({
            inlineData: {
                data: fileBuffer.toString('base64'),
                mimeType: mimeType
            }
        });
    }

    let lastError = null;
    for (const modelName of availableModels) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(parts);
            const responseText = result.response.text();
            if (responseText) {
                return responseText;
            }
        } catch (error) {
            lastError = error.message || error;
            console.warn(`Gemini Model ${modelName} failed, trying next:`, lastError);
        }
    }

    console.error("All Gemini Models Failed:", lastError);
    throw new Error(typeof lastError === 'object' ? JSON.stringify(lastError) : String(lastError));
};

const parseJsonFromAi = (text) => {
    let cleanText = text.trim();
    cleanText = cleanText.replace(/```json/gi, "").replace(/```/g, "").trim();
    
    try {
        return JSON.parse(cleanText);
    } catch (e) {
        const jsonMatch = cleanText.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
        if (jsonMatch) {
            try {
                return JSON.parse(jsonMatch[0]);
            } catch (err2) {
                console.error("JSON parsing fallback failed:", err2.message);
            }
        }
        throw new Error("No valid JSON found in AI response");
    }
};

export const searchWithAi = async (req, res) => {
    try {
        const { input } = req.body;
        if (!input) return res.status(400).json({ message: "Search query is required" });

        const prompt = `
        You are SkillUp AI, a friendly learning assistant. A user is asking for course recommendations.
        User Query: "${input}"
        Available Course Categories: [App Development, AI/ML, AI Tools, Data Science, Data Analytics, Ethical Hacking, UI UX Designing, Web Development, Others]
        
        Analyze what the user is interested in learning.
        Return ONLY a JSON object with this exact format:
        { "message": "friendly encouraging 1-2 sentence response", "keywords": ["keyword1", "keyword2", "category"] }
        `;

        let aiData = null;
        try {
            const aiText = await callGemini(prompt);
            aiData = parseJsonFromAi(aiText);
        } catch (aiErr) {
            console.warn("Gemini parse failed in searchWithAi, continuing with text input:", aiErr.message);
        }

        const inputWords = input.split(/\s+/).filter(w => w.length > 2);
        const searchTerms = [...new Set([...(aiData?.keywords || []), ...inputWords, input])];

        let courses = await Course.find({
            isPublished: true,
            $or: searchTerms.map(term => ({
                $or: [
                    { title: { $regex: term, $options: 'i' } },
                    { category: { $regex: term, $options: 'i' } },
                    { description: { $regex: term, $options: 'i' } }
                ]
            }))
        }).populate("creator", "name photoUrl");

        if (!courses || courses.length === 0) {
            courses = await Course.find({ isPublished: true }).limit(6).populate("creator", "name photoUrl");
        }

        return res.status(200).json({
            message: aiData?.message || `Here are the top courses matching "${input}" for you!`,
            courses: courses
        });

    } catch (error) {
        console.error("AI Search Fallback:", error);
        const { input } = req.body;
        let fallbackCourses = await Course.find({
            isPublished: true,
            $or: [
                { title: { $regex: input || '', $options: 'i' } },
                { category: { $regex: input || '', $options: 'i' } }
            ]
        }).populate("creator", "name photoUrl");

        if (!fallbackCourses || fallbackCourses.length === 0) {
            fallbackCourses = await Course.find({ isPublished: true }).limit(6).populate("creator", "name photoUrl");
        }

        return res.status(200).json({
            message: `I found these courses for you!`,
            courses: fallbackCourses
        });
    }
};

export const generateRoadmap = async (req, res) => {
    try {
        const { topic } = req.body;
        if (!topic) return res.status(400).json({ message: "Topic is required" });

        const prompt = `
        Generate a detailed learning roadmap for: "${topic}".
        Logical progression of 3-5 phases.
        2-4 topics per phase with brief descriptions.
        Return ONLY valid JSON:
        {
          "title": "Roadmap for ${topic}",
          "phases": [
            { "name": "Phase Name", "items": [{ "title": "...", "description": "..." }] }
          ]
        }
        `;

        const aiText = await callGemini(prompt);
        const roadmapData = parseJsonFromAi(aiText);
        return res.status(200).json({
            ...roadmapData,
            roadmap: roadmapData
        });

    } catch (error) {
        console.error("AI Roadmap Error:", error);
        return res.status(500).json({ message: "Failed to generate roadmap. Please try again." });
    }
};

export const generateInterviewQuestions = async (req, res) => {
    try {
        const { role, level } = req.body;
        if (!role) return res.status(400).json({ message: "Role is required" });

        const prompt = `
        Expert interviewer for: ${role} (${level || 'Intermediate'}).
        Generate 5 technical questions with keyPoints and difficulty.
        Return ONLY JSON:
        { "questions": [{ "question": "...", "keyPoints": ["..."], "difficulty": "..." }] }
        `;

        const aiText = await callGemini(prompt);
        const data = parseJsonFromAi(aiText);
        return res.status(200).json(data);
    } catch (error) {
        console.error("AI Interview Error:", error);
        return res.status(500).json({ message: "Failed to generate interview questions" });
    }
};

export const evaluateResponse = async (req, res) => {
    try {
        const { question, answer, role } = req.body;
        const prompt = `
        Interviewer: ${role}
        Question: ${question}
        Answer: ${answer}
        Evaluate accuracy, confidence, communication (0-10) and feedback.
        Return ONLY JSON:
        { "accuracyScore": 8, "confidenceScore": 7, "communicationScore": 9, "feedback": "...", "suggestions": ["..."] }
        `;

        const aiText = await callGemini(prompt);
        const data = parseJsonFromAi(aiText);
        return res.status(200).json(data);
    } catch (error) {
        console.error("AI Evaluation Error:", error);
        return res.status(500).json({ message: "Failed to evaluate response" });
    }
};

export const generateStudyPlan = async (req, res) => {
    try {
        const { goal, days } = req.body;
        if (!goal) return res.status(400).json({ message: "Goal is required" });

        const prompt = `
        Generate a daily study plan for: "${goal}" to be completed in ${days || 30} days.
        Divide the time into 4 main phases.
        For each phase, provide a focus and a list of specific tasks.
        Return ONLY valid JSON:
        {
          "plan": [
            { "day": "1-7", "focus": "...", "tasks": ["...", "..."] }
          ]
        }
        `;

        const aiText = await callGemini(prompt);
        const data = parseJsonFromAi(aiText);
        const planList = Array.isArray(data) ? data : (data.plan || []);
        return res.status(200).json({
            plan: planList
        });
    } catch (error) {
        console.error("AI Study Plan Error:", error);
        return res.status(500).json({ message: "Failed to generate study plan" });
    }
};

export const generateQuiz = async (req, res) => {
    try {
        const { topic, count } = req.body;
        
        const prompt = `
        You are a Technical Interviewer and CS Professor. 
        A student wants a quiz on the topic: "${topic}".

        CRITICAL RULE:
        - ONLY generate questions if the topic is TECHNICAL (Programming, Web Dev, AI, Data Science, CS fundamentals, DevOps, etc.).
        - If the topic is non-technical (Physics, Biology, History, Maths, Arts, etc.), return a JSON object with an error message.

        Required Output Format:
        If technical:
        {
          "quiz": [
            { "question": "...", "options": ["...", "...", "...", "..."], "correctAnswerIndex": 0, "explanation": "..." }
          ]
        }
        
        If non-technical:
        {
          "error": "This platform only supports technical quizzes (Programming, IT, CS). Please enter a technical topic."
        }

        Return ONLY the JSON object.
        `;

        const aiText = await callGemini(prompt);
        const data = parseJsonFromAi(aiText);

        if (data.error) {
            return res.status(400).json({ message: data.error });
        }

        const quizQuestions = data.quiz || (Array.isArray(data) ? data : []);
        return res.status(200).json(quizQuestions);
    } catch (error) {
        console.error("AI Quiz Error:", error);
        return res.status(500).json({ message: "Failed to generate quiz. Please try a different technical topic." });
    }
};

export const trackMistake = async (req, res) => {
    try {
        const { topic, question, wrongAnswer, correctAnswer, explanation } = req.body;
        const userId = req.userId;

        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        let mistake = await Mistake.findOne({ userId, question });

        if (mistake) {
            mistake.count += 1;
            await mistake.save();
        } else {
            mistake = await Mistake.create({
                userId, topic, question, wrongAnswer, correctAnswer, explanation
            });
        }

        return res.status(200).json({ message: "Mistake tracked successfully" });
    } catch (error) {
        console.error("Track Mistake Error:", error);
        return res.status(500).json({ message: "Failed to track mistake" });
    }
};

export const analyzeMistakes = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const mistakes = await Mistake.find({ userId });
        if (mistakes.length === 0) return res.status(200).json({ message: "No mistakes tracked yet. Keep learning!" });

        const mistakeContext = mistakes.map(m => `Topic: ${m.topic}, Question: ${m.question}, Times Missed: ${m.count}`).join("\n");

        const prompt = `
        A student has made the following mistakes in their quizzes:
        ${mistakeContext}

        Task:
        1. Identify the core patterns or knowledge gaps (e.g., "Weakness in JavaScript Closures").
        2. Provide a 3-step Revision Plan to overcome these gaps.
        3. Give a motivational summary.

        Return ONLY valid JSON:
        {
          "patterns": ["...", "..."],
          "revisionPlan": ["Step 1: ...", "Step 2: ...", "Step 3: ..."],
          "summary": "..."
        }
        `;

        const aiText = await callGemini(prompt);
        const data = parseJsonFromAi(aiText);
        return res.status(200).json({
            ...data,
            analysis: data
        });
    } catch (error) {
        console.error("Analyze Mistakes Error:", error);
        return res.status(500).json({ message: "Failed to analyze mistakes" });
    }
};

export const analyzeResume = async (req, res) => {
    try {
        const { resumeText, jobDescription } = req.body;
        const resumeFile = req.file;

        if (!resumeText && !resumeFile) {
            return res.status(400).json({ message: "Please provide resume text, a PDF, or an image file." });
        }

        const isPdf = resumeFile && resumeFile.path.toLowerCase().endsWith('.pdf');
        const fileTypeDesc = isPdf ? "a PDF document" : (resumeFile ? "an image" : "plain text");

        const prompt = `
        You are an expert Technical Recruiter and ATS (Applicant Tracking System) software.
        I am providing you with a candidate's resume (as ${fileTypeDesc})${jobDescription ? " and a target Job Description" : ""}.
        
        ${resumeText ? `Resume Text:\n"""${resumeText}"""` : `Please analyze the uploaded resume ${isPdf ? "PDF file" : "document"}.`}
        ${jobDescription ? `\nTarget Job Description:\n"""${jobDescription}"""` : ""}

        Task:
        1. Calculate an ATS Match Score from 0 to 100 based on how well the resume matches the job description (or general tech industry standards if no JD is provided).
        2. Identify 3-5 key Strengths of the resume.
        3. Identify 3-5 Weaknesses or Missing Keywords.
        4. Provide 3 actionable Tips for improvement.

        Return ONLY valid JSON in this exact format:
        {
          "score": 85,
          "strengths": ["...", "..."],
          "weaknesses": ["...", "..."],
          "tips": ["...", "..."]
        }
        `;

        const aiText = await callGeminiMultimodal(prompt, resumeFile?.path);
        
        if (resumeFile && fs.existsSync(resumeFile.path)) {
            try { fs.unlinkSync(resumeFile.path); } catch (e) {}
        }

        const data = parseJsonFromAi(aiText);
        return res.status(200).json(data);
    } catch (error) {
        console.error("AI Resume Analyzer Error:", error);
        
        if (req.file && fs.existsSync(req.file.path)) {
            try { fs.unlinkSync(req.file.path); } catch (e) {}
        }
        
        return res.status(500).json({ message: error.message ? `Resume analysis failed: ${error.message}` : "Failed to analyze resume" });
    }
};

export const askAiAssistant = async (req, res) => {
    try {
        const { query } = req.body;
        if (!query || !query.trim()) {
            return res.status(400).json({ message: "Please enter a question or topic." });
        }

        const prompt = `
        You are the LearnAI Intelligent Learning Assistant.
        A student or developer is asking you this question:
        "${query.trim()}"

        Task:
        1. Provide a comprehensive, accurate, and easy-to-understand response.
        2. Include code examples, key architectural concepts, or step-by-step guidance where helpful.
        3. Add a practical takeaway or pro tip at the end.

        Format your response cleanly in readable Markdown with bold headers and code blocks.
        `;

        const responseText = await callGemini(prompt);
        return res.status(200).json({ answer: responseText });
    } catch (error) {
        console.error("AI Assistant Error:", error);
        return res.status(500).json({ message: error.message ? `AI Assistant error: ${error.message}` : "Failed to generate answer" });
    }
};
