
export interface PersonalDetails {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  linkedin: string;
  website: string;
}

export interface WorkExperience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  location: string;
  graduationDate: string;
}

export interface ResumeData {
  personalDetails: PersonalDetails;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: string;
}

export enum AiRefineType {
  SUMMARY = 'SUMMARY',
  EXPERIENCE = 'EXPERIENCE'
}

export enum ToneStyle {
  FORMAL = 'FORMAL',
  CREATIVE = 'CREATIVE',
  ACADEMIC = 'ACADEMIC',
  TECHNICAL = 'TECHNICAL'
}

export interface ResumeScorecard {
  overallScore: number;
  atsCompatibility: number;
  keywordDensity: number;
  clarity: number;
  suggestions: string[];
}

export interface ResumeAnalysis {
  matchScore: number;
  overallFeedback: string;
  strengths: string[];
  areasForImprovement: string[];
}

export interface InterviewQuestion {
    question: string;
    reasoning: string;
}
