import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import dotenv from "dotenv";
import Course from "../models/courseModel.js";
import Mistake from "../models/mistakeModel.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
dotenv.config({ path: path.join(__dirname, "../.env") });

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
                .map(m => m.name.replace(/^models\//, ''))
                .filter(name => !name.includes("tts") && !name.includes("clip") && !name.includes("robotics"));
            
            console.log("Dynamically discovered available Gemini models:", valid);
            if (valid.length > 0) {
                const priority = [
                    "gemini-3.5-flash",
                    "gemini-3.5-flash-lite",
                    "gemini-3.6-flash",
                    "gemini-3.7-flash",
                    "gemini-3.8-flash",
                    "gemini-2.5-flash",
                    "gemini-2.0-flash",
                    "gemini-1.5-flash"
                ];
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

    return ["gemini-3.5-flash", "gemini-3.5-flash-lite", "gemini-3.6-flash", "gemini-3.7-flash", "gemini-3.8-flash"];
};

const callGemini = async (prompt, isJson = false) => {
    return callGeminiMultimodal(prompt, null, isJson);
};

const callGeminiMultimodal = async (prompt, filePath = null, isJson = false) => {
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
            console.log("Attempting Gemini model:", modelName);
            const config = isJson ? { generationConfig: { responseMimeType: "application/json" } } : {};
            const model = genAI.getGenerativeModel({ model: modelName, ...config });
            const result = await model.generateContent(parts);
            const responseText = result.response.text();
            if (responseText) {
                console.log(`Model ${modelName} succeeded! Response length: ${responseText.length}`);
                return responseText;
            }
        } catch (error) {
            // If responseMimeType is rejected by an older model or variant, try without it
            if (isJson) {
                try {
                    const fallbackModel = genAI.getGenerativeModel({ model: modelName });
                    const fallbackResult = await fallbackModel.generateContent(parts);
                    const responseText = fallbackResult.response.text();
                    if (responseText) return responseText;
                } catch (retryErr) {
                    lastError = retryErr.message || retryErr;
                }
            } else {
                lastError = error.message || error;
            }
            console.warn(`Gemini Model ${modelName} failed, trying next:`, lastError);
        }
    }

    console.error("All Gemini Models Failed:", lastError);
    throw new Error(typeof lastError === 'object' ? JSON.stringify(lastError) : String(lastError));
};

const cleanJsonString = (str) => {
    return str
        .replace(/```(?:json)?/gi, "")
        .replace(/```/g, "")
        .replace(/,\s*([}\]])/g, "$1")
        .trim();
};

const extractResumeAnalysisFallback = (rawText) => {
    let score = 78;
    const scoreMatch = rawText.match(/(?:score|match|ats|rating)[\s"':]*(\d{1,3})/i) ||
                       rawText.match(/(\d{1,3})\s*(?:\/|\s*out of\s*)100/i);
    if (scoreMatch) {
        const parsed = parseInt(scoreMatch[1], 10);
        if (parsed >= 0 && parsed <= 100) score = parsed;
    }

    const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);

    const extractItemsForSection = (keywords, defaultItems) => {
        const items = [];
        let inSection = false;
        for (const line of lines) {
            const lower = line.toLowerCase();
            if (keywords.some(k => lower.includes(k) && (line.includes(':') || line.includes('#') || line.length < 50))) {
                inSection = true;
                continue;
            } else if (inSection && /^(#|[A-Z][a-z]+:)/.test(line) && !keywords.some(k => lower.includes(k))) {
                inSection = false;
            }

            if (inSection) {
                const bullet = line.replace(/^[-*•\d.)\]\s]+/, '').trim();
                if (bullet.length > 5 && !bullet.startsWith('{') && !bullet.startsWith('}')) {
                    items.push(bullet);
                }
            }
        }
        return items.length > 0 ? items.slice(0, 5) : defaultItems;
    };

    const strengths = extractItemsForSection(
        ['strength', 'highlight', 'positive', 'strong', 'good'],
        [
            'Clear structural layout with easily scannable sections',
            'Solid foundation in core technologies and problem solving',
            'Demonstrated hands-on experience and project implementation'
        ]
    );

    const weaknesses = extractItemsForSection(
        ['weakness', 'missing', 'gap', 'improve', 'area for'],
        [
            'Could include more quantified impact metrics (e.g. % performance gain, revenue)',
            'Add more targeted industry keywords aligned with ATS keyword filters',
            'Provide deeper technical context regarding architectural challenges solved'
        ]
    );

    const tips = extractItemsForSection(
        ['tip', 'recommendation', 'action', 'suggestion', 'next step'],
        [
            'Tailor your summary and skill list with exact keywords from the target job posting',
            'Begin each experience bullet point with high-impact action verbs (e.g., Architected, Optimized)',
            'Maintain clean, standard single-column formatting for optimal ATS scanner parsing'
        ]
    );

    return {
        score,
        strengths,
        weaknesses,
        tips
    };
};

const parseJsonFromAi = (text, defaultFallback = null) => {
    if (!text || typeof text !== "string") {
        if (typeof defaultFallback === "function") return defaultFallback("");
        if (defaultFallback !== null) return defaultFallback;
        throw new Error("Empty AI response");
    }

    const cleanText = cleanJsonString(text);

    // 1. Direct parse attempt
    try {
        return JSON.parse(cleanText);
    } catch (_) {}

    // 2. Extract JSON object substring
    const firstBrace = cleanText.indexOf('{');
    const lastBrace = cleanText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
        const potentialJson = cleanText.substring(firstBrace, lastBrace + 1).replace(/,\s*([}\]])/g, "$1");
        try {
            return JSON.parse(potentialJson);
        } catch (_) {}
    }

    // 3. Extract JSON array substring
    const firstBracket = cleanText.indexOf('[');
    const lastBracket = cleanText.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket > firstBracket) {
        const potentialJson = cleanText.substring(firstBracket, lastBracket + 1).replace(/,\s*([}\]])/g, "$1");
        try {
            return JSON.parse(potentialJson);
        } catch (_) {}
    }

    // 4. Use custom fallback handler if provided
    if (typeof defaultFallback === "function") {
        try {
            return defaultFallback(text);
        } catch (fbErr) {
            console.warn("Fallback extraction failed:", fbErr.message);
        }
    } else if (defaultFallback !== null) {
        return defaultFallback;
    }

    throw new Error("No valid JSON found in AI response");
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

        const aiText = await callGemini(prompt, true);
        const roadmapData = parseJsonFromAi(aiText, () => ({
            title: `Roadmap for ${topic}`,
            phases: [
                { name: "Phase 1: Fundamentals", items: [{ title: `${topic} Core Concepts`, description: `Learn the fundamentals and essential tools for ${topic}.` }] },
                { name: "Phase 2: Intermediate & Hands-on", items: [{ title: "Practical Application", description: "Build realistic projects and practice core patterns." }] },
                { name: "Phase 3: Advanced Mastery", items: [{ title: "Production & Optimization", description: "Architecture, performance tuning, and best practices." }] }
            ]
        }));
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

        const aiText = await callGemini(prompt, true);
        const data = parseJsonFromAi(aiText, () => ({
            questions: [
                { question: `What are the core architectural best practices and patterns you follow as a ${role}?`, keyPoints: ["Architecture", "Scalability", "Best practices"], difficulty: level || "Intermediate" },
                { question: `How do you diagnose and resolve performance bottlenecks in production applications?`, keyPoints: ["Profiling", "Monitoring", "Root cause analysis"], difficulty: level || "Intermediate" },
                { question: `Can you explain a complex project you built and the major challenges you solved?`, keyPoints: ["Problem solving", "Trade-offs", "Execution"], difficulty: level || "Intermediate" }
            ]
        }));
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

        const aiText = await callGemini(prompt, true);
        const data = parseJsonFromAi(aiText, () => ({
            accuracyScore: 8,
            confidenceScore: 8,
            communicationScore: 8,
            feedback: "Well structured answer addressing key concepts. Deepening the response with concrete examples and metrics would make it even stronger.",
            suggestions: ["Mention quantifiable impact", "Discuss architectural trade-offs"]
        }));
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

        const aiText = await callGemini(prompt, true);
        const data = parseJsonFromAi(aiText, () => ({
            plan: [
                { day: "Day 1-7", focus: "Foundations & Core Principles", tasks: ["Set up environment and tools", "Understand fundamental concepts", "Complete first guided project"] },
                { day: "Day 8-15", focus: "Intermediate Practical Building", tasks: ["Implement core workflows", "Practice design patterns", "Write unit tests"] },
                { day: "Day 16-23", focus: "Advanced Integration & Architecture", tasks: ["Build full-stack or end-to-end features", "Optimize performance", "Handle security edge cases"] },
                { day: "Day 24-30", focus: "Review, Deployment & Portfolio", tasks: ["Refactor code", "Deploy project to production", "Prepare documentation and presentation"] }
            ]
        }));
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

        const aiText = await callGemini(prompt, true);
        const data = parseJsonFromAi(aiText, () => ({
            quiz: [
                {
                    question: `Which of the following is considered a core engineering principle for ${topic}?`,
                    options: [
                        "Modular design & single responsibility",
                        "Performance profiling & optimization",
                        "Clean error handling and testing",
                        "All of the above"
                    ],
                    correctAnswerIndex: 3,
                    explanation: "In software engineering, modularity, performance profiling, and robust error handling are universal best practices."
                }
            ]
        }));

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

        const aiText = await callGemini(prompt, true);
        const data = parseJsonFromAi(aiText, () => ({
            patterns: ["Foundational conceptual clarity", "Attention to syntax and edge-case handling"],
            revisionPlan: [
                "Step 1: Review foundational theory and documentation for the missed concepts.",
                "Step 2: Solve 3-5 hands-on code challenges targeting those specific weaknesses.",
                "Step 3: Retake the assessment quiz to solidify your understanding."
            ],
            summary: "Consistent practice and targeted review will quickly turn these areas of confusion into your strengths!"
        }));
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

        const aiText = await callGeminiMultimodal(prompt, resumeFile?.path, true);
        
        if (resumeFile && fs.existsSync(resumeFile.path)) {
            try { fs.unlinkSync(resumeFile.path); } catch (e) {}
        }

        const data = parseJsonFromAi(aiText, extractResumeAnalysisFallback);
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
