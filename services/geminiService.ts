
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AiRefineType, ResumeData, WorkExperience, Education, ResumeAnalysis, InterviewQuestion, ResumeScorecard } from '../types';
import { logger } from '../utils/logger';

// Use Vite's env variable handling
const API_KEY = import.meta.env.VITE_API_KEY;

const getPrompt = (type: AiRefineType, text: string, toneStyle?: string): string => {
  const toneInstructions = getToneInstructions(toneStyle);

  switch (type) {
    case AiRefineType.SUMMARY:
      return `You are an expert ATS-friendly resume writer. Rewrite the following professional summary to be a compelling and concise overview of a candidate's skills and experience. It should be about 3-4 sentences long. ${toneInstructions} Do not add any extra text, headings, or introductions like 'Here is the rewritten summary:'. Just return the rewritten summary. The original summary is:\n\n"${text}"`;
    case AiRefineType.EXPERIENCE:
      return `You are an expert ATS-friendly resume writer. Rewrite the following job description to be more impactful. Use strong action verbs, focus on achievements, and quantify results where possible. Use 3-5 bullet points, each starting with an action verb. ${toneInstructions} Do not add any extra text, headings, or introductions like 'Here is the rewritten description:'. Just return the rewritten bullet points. The original description is:\n\n"${text}"`;
    default:
      return text;
  }
};

const getToneInstructions = (toneStyle?: string): string => {
  switch (toneStyle) {
    case 'CREATIVE':
      return 'Use creative and engaging language while maintaining professionalism. Show personality and innovation.';
    case 'ACADEMIC':
      return 'Use formal academic language with emphasis on research, publications, and scholarly achievements.';
    case 'TECHNICAL':
      return 'Use precise technical terminology and focus on technical skills, methodologies, and quantifiable results.';
    case 'FORMAL':
    default:
      return 'Maintain a formal, professional tone suitable for corporate environments.';
  }
};

export const refineWithAI = async (type: AiRefineType, textToRefine: string, toneStyle?: string): Promise<string> => {
  if (!API_KEY) {
    throw new Error("VITE_API_KEY environment variable not set. Please create a .env.local file.");
  }

  if (!textToRefine.trim()) {
    return "";
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = getPrompt(type, textToRefine, toneStyle);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    logger.error("Error refining text with AI:", error);
    throw new Error("Failed to get a response from the AI. Please try again.");
  }
};

// Schema definitions for structured responses
const resumeSchema = {
  type: "object",
  properties: {
    personalDetails: {
      type: "object",
      properties: {
        fullName: { type: "string" },
        email: { type: "string" },
        phoneNumber: { type: "string" },
        address: { type: "string" },
        linkedin: { type: "string" },
        website: { type: "string" },
      },
    },
    summary: {
      type: "string",
      description: "A compelling and concise professional summary, 3-4 sentences long.",
    },
    experience: {
      type: "array",
      description: "A list of professional experiences.",
      items: {
        type: "object",
        properties: {
          jobTitle: { type: "string" },
          company: { type: "string" },
          location: { type: "string" },
          startDate: { type: "string" },
          endDate: { type: "string" },
          description: {
            type: "string",
            description: "A description of responsibilities and achievements, formatted as bullet points starting with an action verb. Each bullet point should be on a new line.",
          },
        },
        required: ['jobTitle', 'company', 'startDate', 'endDate', 'description']
      },
    },
    education: {
      type: "array",
      description: "A list of educational qualifications.",
      items: {
        type: "object",
        properties: {
          degree: { type: "string" },
          school: { type: "string" },
          location: { type: "string" },
          graduationDate: { type: "string" },
        },
        required: ['degree', 'school', 'graduationDate']
      },
    },
    skills: {
      type: "string",
      description: "A comma-separated list of relevant skills.",
    },
  },
};

export const parseAndRefineWithAI = async (text: string): Promise<Partial<Omit<ResumeData, 'experience' | 'education'>> & { experience?: Omit<WorkExperience, 'id'>[], education?: Omit<Education, 'id'>[] }> => {
  if (!API_KEY) {
    throw new Error("VITE_API_KEY environment variable not set. Please create a .env.local file.");
  }
  if (!text.trim()) {
    return {};
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const prompt = `You are an expert resume assistant. A user has provided their resume details in a free-form text, potentially in a language other than English. Your task is to:
1. Parse this text to identify all relevant sections: Personal Details, Professional Summary, Work Experience, Education, and Skills.
2. If the text is not in English, translate the content to English.
3. Refine the content to be professional and ATS-friendly.
    - For the summary, create a compelling overview of the candidate.
    - For work experience descriptions, rewrite them using strong action verbs and focus on quantifiable achievements. Format as bullet points, with each bullet on a new line (using '\\n').
    - For skills, create a comma-separated list.
4. Structure your final output as a JSON object with the following structure:
{
  "personalDetails": {
    "fullName": "string",
    "email": "string", 
    "phoneNumber": "string",
    "address": "string",
    "linkedin": "string (optional)",
    "website": "string (optional)"
  },
  "summary": "string",
  "experience": [
    {
      "jobTitle": "string",
      "company": "string", 
      "location": "string",
      "startDate": "string",
      "endDate": "string",
      "description": "string with bullet points separated by \\n"
    }
  ],
  "education": [
    {
      "degree": "string",
      "school": "string",
      "location": "string", 
      "graduationDate": "string"
    }
  ],
  "skills": "comma-separated string"
}
5. If a piece of information is not present in the input text, omit the corresponding field from the output JSON. Do not invent information.

Here is the user's input text:
"${text}"

Return only the JSON object, no additional text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonString = response.text().trim();

    // Clean up the response to ensure it's valid JSON
    const cleanedJson = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleanedJson);
  } catch (error) {
    logger.error("Error parsing and refining with AI:", error);
    throw new Error("The AI failed to process your resume text. It might be too complex or in an unexpected format. Please try simplifying it.");
  }
};

const analysisSchema = {
  type: "object",
  properties: {
    matchScore: { type: "number", description: "A score from 0-100 indicating how well the resume matches the job description." },
    overallFeedback: { type: "string", description: "A concise, encouraging summary of the resume's fit for the role." },
    strengths: { type: "array", items: { type: "string" }, description: "A list of 2-3 key strengths from the resume that align with the job." },
    areasForImprovement: { type: "array", items: { type: "string" }, description: "A list of 2-3 specific, actionable suggestions for improving the resume's alignment." }
  },
  required: ['matchScore', 'overallFeedback', 'strengths', 'areasForImprovement']
};

export const analyzeResumeAgainstJob = async (resumeData: ResumeData, jobDescription: string): Promise<ResumeAnalysis> => {
  if (!API_KEY) throw new Error("VITE_API_KEY environment variable not set.");

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const prompt = `Analyze the provided resume against the job description and return a detailed analysis in JSON format.
    
    Resume Data: ${JSON.stringify(resumeData)}
    
    Job Description: "${jobDescription}"

    Return a JSON object with this structure:
    {
      "matchScore": number (0-100),
      "overallFeedback": "string - concise, encouraging summary",
      "strengths": ["string", "string", "string"] - 2-3 key strengths,
      "areasForImprovement": ["string", "string", "string"] - 2-3 actionable suggestions
    }

    The feedback should be constructive and professional. The match score should be a realistic assessment.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonString = response.text().trim();
    const cleanedJson = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleanedJson);
  } catch (error) {
    logger.error("Error analyzing resume:", error);
    throw new Error("Failed to analyze resume. Please try again.");
  }
};

export const generateCoverLetter = async (resumeData: ResumeData, jobDescription: string): Promise<string> => {
  if (!API_KEY) throw new Error("VITE_API_KEY environment variable not set.");

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
      }
    });

    const prompt = `You are a professional career coach. Write a compelling and professional cover letter based on the candidate's resume and the provided job description.
    
    The cover letter should:
    1. Be addressed to a "Hiring Manager" if no specific name is available.
    2. Start with a strong opening paragraph that grabs attention.
    3. Highlight 2-3 key experiences or skills from the resume that directly match the requirements in the job description.
    4. Maintain a professional and enthusiastic tone.
    5. End with a strong closing and call to action.
    6. Be formatted cleanly, with paragraphs separated by newlines. Do not use markdown.
    
    Resume Data: ${JSON.stringify(resumeData)}
    
    Job Description: "${jobDescription}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    logger.error("Error generating cover letter:", error);
    throw new Error("Failed to generate cover letter. Please try again.");
  }
};

const questionsSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      question: { type: "string", description: "The interview question." },
      reasoning: { type: "string", description: "A brief explanation of why this question might be asked, based on the resume and job description." }
    },
    required: ['question', 'reasoning']
  }
};

export const generateInterviewQuestions = async (resumeData: ResumeData, jobDescription: string): Promise<InterviewQuestion[]> => {
  if (!API_KEY) throw new Error("VITE_API_KEY environment variable not set.");

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const prompt = `You are an experienced hiring manager. Based on the candidate's resume and the job description, generate a list of 5-7 likely interview questions.
    
    For each question, provide a brief reasoning for why it would be asked. The questions should cover a mix of behavioral, technical, and situational topics relevant to the role.
    
    Resume Data: ${JSON.stringify(resumeData)}
    
    Job Description: "${jobDescription}"
    
    Return a JSON array with this structure:
    [
      {
        "question": "string - the interview question",
        "reasoning": "string - brief explanation why this would be asked"
      }
    ]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonString = response.text().trim();
    const cleanedJson = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleanedJson);
  } catch (error) {
    logger.error("Error generating interview questions:", error);
    throw new Error("Failed to generate interview questions. Please try again.");
  }
};

const scorecardSchema = {
  type: "object",
  properties: {
    overallScore: { type: "number", description: "Overall resume score from 0-100." },
    atsCompatibility: { type: "number", description: "ATS compatibility score from 0-100." },
    keywordDensity: { type: "number", description: "Keyword density score from 0-100." },
    clarity: { type: "number", description: "Clarity and readability score from 0-100." },
    suggestions: { type: "array", items: { type: "string" }, description: "3-5 specific suggestions for improvement." }
  },
  required: ['overallScore', 'atsCompatibility', 'keywordDensity', 'clarity', 'suggestions']
};

export const generateResumeScorecard = async (resumeData: ResumeData): Promise<ResumeScorecard> => {
  if (!API_KEY) throw new Error("VITE_API_KEY environment variable not set.");

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const prompt = `You are an expert ATS and resume evaluation specialist. Analyze the provided resume and generate a comprehensive scorecard.

    Evaluate the resume on:
    1. Overall Score: General quality and completeness
    2. ATS Compatibility: How well it will perform with Applicant Tracking Systems
    3. Keyword Density: Appropriate use of industry keywords
    4. Clarity: How clear and readable the content is

    Return a JSON object with this structure:
    {
      "overallScore": number (0-100),
      "atsCompatibility": number (0-100),
      "keywordDensity": number (0-100),
      "clarity": number (0-100),
      "suggestions": ["string", "string", "string"] - 3-5 specific suggestions
    }

    Provide specific, actionable suggestions for improvement.
    
    Resume Data: ${JSON.stringify(resumeData)}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonString = response.text().trim();
    const cleanedJson = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleanedJson);
  } catch (error) {
    logger.error("Error generating scorecard:", error);
    throw new Error("Failed to generate resume scorecard. Please try again.");
  }
};
