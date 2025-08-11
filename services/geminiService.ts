
import { GoogleGenAI, Type } from "@google/genai";
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
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const prompt = getPrompt(type, textToRefine, toneStyle);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.5,
        topP: 0.95,
        topK: 64,
      },
    });

    return response.text.trim();
  } catch (error) {
    logger.error("Error refining text with AI:", error);
    throw new Error("Failed to get a response from the AI. Please try again.");
  }
};

const resumeSchema = {
  type: Type.OBJECT,
  properties: {
    personalDetails: {
      type: Type.OBJECT,
      properties: {
        fullName: { type: Type.STRING },
        email: { type: Type.STRING },
        phoneNumber: { type: Type.STRING },
        address: { type: Type.STRING },
        linkedin: { type: Type.STRING },
        website: { type: Type.STRING },
      },
    },
    summary: {
      type: Type.STRING,
      description: "A compelling and concise professional summary, 3-4 sentences long.",
    },
    experience: {
      type: Type.ARRAY,
      description: "A list of professional experiences.",
      items: {
        type: Type.OBJECT,
        properties: {
          jobTitle: { type: Type.STRING },
          company: { type: Type.STRING },
          location: { type: Type.STRING },
          startDate: { type: Type.STRING },
          endDate: { type: Type.STRING },
          description: {
            type: Type.STRING,
            description: "A description of responsibilities and achievements, formatted as bullet points starting with an action verb. Each bullet point should be on a new line.",
          },
        },
        required: ['jobTitle', 'company', 'startDate', 'endDate', 'description']
      },
    },
    education: {
      type: Type.ARRAY,
      description: "A list of educational qualifications.",
      items: {
        type: Type.OBJECT,
        properties: {
          degree: { type: Type.STRING },
          school: { type: Type.STRING },
          location: { type: Type.STRING },
          graduationDate: { type: Type.STRING },
        },
        required: ['degree', 'school', 'graduationDate']
      },
    },
    skills: {
      type: Type.STRING,
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

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const prompt = `You are an expert resume assistant. A user has provided their resume details in a free-form text, potentially in a language other than English. Your task is to:
1. Parse this text to identify all relevant sections: Personal Details, Professional Summary, Work Experience, Education, and Skills.
2. If the text is not in English, translate the content to English.
3. Refine the content to be professional and ATS-friendly.
    - For the summary, create a compelling overview of the candidate.
    - For work experience descriptions, rewrite them using strong action verbs and focus on quantifiable achievements. Format as bullet points, with each bullet on a new line (using '\\n').
    - For skills, create a comma-separated list.
4. Structure your final output in the provided JSON schema.
5. If a piece of information (e.g., website, or an entire section like education) is not present in the input text, omit the corresponding field from the output JSON. Do not invent information.

Here is the user's input text:
"${text}"`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: resumeSchema,
      },
    });

    const jsonString = response.text.trim();
    return JSON.parse(jsonString);
  } catch (error) {
    logger.error("Error parsing and refining with AI:", error);
    throw new Error("The AI failed to process your resume text. It might be too complex or in an unexpected format. Please try simplifying it.");
  }
};

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    matchScore: { type: Type.NUMBER, description: "A score from 0-100 indicating how well the resume matches the job description." },
    overallFeedback: { type: Type.STRING, description: "A concise, encouraging summary of the resume's fit for the role." },
    strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 2-3 key strengths from the resume that align with the job." },
    areasForImprovement: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 2-3 specific, actionable suggestions for improving the resume's alignment." }
  },
  required: ['matchScore', 'overallFeedback', 'strengths', 'areasForImprovement']
};

export const analyzeResumeAgainstJob = async (resumeData: ResumeData, jobDescription: string): Promise<ResumeAnalysis> => {
  if (!API_KEY) throw new Error("VITE_API_KEY environment variable not set.");

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const prompt = `Analyze the provided resume against the job description and return a detailed analysis.
    
    Resume Data: ${JSON.stringify(resumeData)}
    
    Job Description: "${jobDescription}"

    Provide a concise analysis based on the JSON schema. The feedback should be constructive and professional. The match score should be a realistic assessment.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: analysisSchema,
    },
  });

  const jsonString = response.text.trim();
  return JSON.parse(jsonString);
};

export const generateCoverLetter = async (resumeData: ResumeData, jobDescription: string): Promise<string> => {
  if (!API_KEY) throw new Error("VITE_API_KEY environment variable not set.");

  const ai = new GoogleGenAI({ apiKey: API_KEY });
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

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      temperature: 0.7,
    },
  });

  return response.text.trim();
};

const questionsSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      question: { type: Type.STRING, description: "The interview question." },
      reasoning: { type: Type.STRING, description: "A brief explanation of why this question might be asked, based on the resume and job description." }
    },
    required: ['question', 'reasoning']
  }
};

export const generateInterviewQuestions = async (resumeData: ResumeData, jobDescription: string): Promise<InterviewQuestion[]> => {
  if (!API_KEY) throw new Error("VITE_API_KEY environment variable not set.");

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const prompt = `You are an experienced hiring manager. Based on the candidate's resume and the job description, generate a list of 5-7 likely interview questions.
    
    For each question, provide a brief reasoning for why it would be asked. The questions should cover a mix of behavioral, technical, and situational topics relevant to the role.
    
    Resume Data: ${JSON.stringify(resumeData)}
    
    Job Description: "${jobDescription}"
    
    Return the data in the specified JSON schema.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: questionsSchema,
    },
  });

  const jsonString = response.text.trim();
  return JSON.parse(jsonString);
};

const scorecardSchema = {
  type: Type.OBJECT,
  properties: {
    overallScore: { type: Type.NUMBER, description: "Overall resume score from 0-100." },
    atsCompatibility: { type: Type.NUMBER, description: "ATS compatibility score from 0-100." },
    keywordDensity: { type: Type.NUMBER, description: "Keyword density score from 0-100." },
    clarity: { type: Type.NUMBER, description: "Clarity and readability score from 0-100." },
    suggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3-5 specific suggestions for improvement." }
  },
  required: ['overallScore', 'atsCompatibility', 'keywordDensity', 'clarity', 'suggestions']
};

export const generateResumeScorecard = async (resumeData: ResumeData): Promise<ResumeScorecard> => {
  if (!API_KEY) throw new Error("VITE_API_KEY environment variable not set.");

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const prompt = `You are an expert ATS and resume evaluation specialist. Analyze the provided resume and generate a comprehensive scorecard.

    Evaluate the resume on:
    1. Overall Score: General quality and completeness
    2. ATS Compatibility: How well it will perform with Applicant Tracking Systems
    3. Keyword Density: Appropriate use of industry keywords
    4. Clarity: How clear and readable the content is

    Provide specific, actionable suggestions for improvement.
    
    Resume Data: ${JSON.stringify(resumeData)}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: scorecardSchema,
    },
  });

  const jsonString = response.text.trim();
  return JSON.parse(jsonString);
};
