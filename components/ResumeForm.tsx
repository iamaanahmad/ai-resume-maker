import React from 'react';
import { ResumeData, AiRefineType, WorkExperience, Education } from '../types';
import SparklesIcon from './icons/SparklesIcon';
import AddIcon from './icons/AddIcon';
import TrashIcon from './icons/TrashIcon';
import { AiTools } from './AiTools';
import VoiceInput from './VoiceInput';
import Tooltip from './Tooltip';

interface ResumeFormProps {
    resumeData: ResumeData;
    onDataChange: <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => void;
    onExperienceChange: (index: number, field: keyof WorkExperience, value: string) => void;
    addExperience: () => void;
    removeExperience: (id: string) => void;
    onEducationChange: (index: number, field: keyof Education, value: string) => void;
    addEducation: () => void;
    removeEducation: (id: string) => void;
    handleAiRefine: (type: AiRefineType, text: string, index?: number) => void;
    isRefining: { status: boolean, type: AiRefineType | null, index: number | null };
    rawResumeText: string;
    onRawResumeTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onAutoFill: () => void;
    isAutoFilling: boolean;
    // AI Power-up Props
    jobDescription: string;
    onJobDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onAnalyze: () => void;
    onGenerateCoverLetter: () => void;
    onGenerateInterviewPrep: () => void;
    isGeneratingTool: boolean;
    // New Props
    isBeginnerMode: boolean;
    isDarkMode: boolean;
    onVoiceInput: (transcript: string) => void;
    isListening: boolean;
    onListeningChange: (listening: boolean) => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode; isDarkMode?: boolean }> = ({ title, children, isDarkMode }) => (
    <div className="mb-10">
        <div className="flex items-center gap-3 mb-6">
            <div className={`h-8 w-1 rounded-full ${isDarkMode ? 'bg-gradient-to-b from-blue-400 to-purple-400' : 'bg-gradient-to-b from-blue-500 to-purple-500'}`}></div>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} tracking-tight`}>{title}</h2>
        </div>
        {children}
    </div>
);

const InputField: React.FC<{ 
    label: string; 
    value: string; 
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
    placeholder?: string; 
    type?: string; 
    name?: string;
    tooltip?: string;
    example?: string;
    isBeginnerMode?: boolean;
}> = ({ label, value, onChange, placeholder, type = "text", name, tooltip, example, isBeginnerMode }) => (
    <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            {isBeginnerMode && tooltip && (
                <Tooltip content={tooltip}>
                    <span className="text-blue-500 cursor-help">ℹ️</span>
                </Tooltip>
            )}
        </div>
        <input 
            type={type} 
            name={name} 
            value={value} 
            onChange={onChange} 
            placeholder={isBeginnerMode && example ? example : placeholder} 
            className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-gray-900 placeholder-gray-400 hover:shadow-md" 
        />
    </div>
);

const TextAreaField: React.FC<{ 
    label: string; 
    value: string; 
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; 
    placeholder?: string; 
    rows?: number; 
    onAiRefine?: () => void; 
    isRefining?: boolean;
    tooltip?: string;
    example?: string;
    isBeginnerMode?: boolean;
    onVoiceInput?: (transcript: string) => void;
    isListening?: boolean;
    onListeningChange?: (listening: boolean) => void;
}> = ({ 
    label, 
    value, 
    onChange, 
    placeholder, 
    rows = 4, 
    onAiRefine, 
    isRefining = false, 
    tooltip, 
    example, 
    isBeginnerMode,
    onVoiceInput,
    isListening = false,
    onListeningChange
}) => (
    <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-2">
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                {isBeginnerMode && tooltip && (
                    <Tooltip content={tooltip}>
                        <span className="text-blue-500 cursor-help">ℹ️</span>
                    </Tooltip>
                )}
            </div>
            <div className="flex items-center gap-2">
                {onVoiceInput && onListeningChange && (
                    <VoiceInput
                        onTranscript={(transcript) => {
                            onChange({ target: { value: value + ' ' + transcript } } as React.ChangeEvent<HTMLTextAreaElement>);
                        }}
                        isListening={isListening}
                        onListeningChange={onListeningChange}
                        placeholder="Voice input"
                    />
                )}
                {onAiRefine && (
                    <button
                        onClick={onAiRefine}
                        disabled={isRefining}
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-wait transition-colors"
                    >
                        {isRefining ? 'Refining...' : 'AI Refine'}
                        <SparklesIcon className="w-4 h-4 ml-1" />
                    </button>
                )}
            </div>
        </div>
        <textarea 
            value={value} 
            onChange={onChange} 
            placeholder={isBeginnerMode && example ? example : placeholder} 
            rows={rows} 
            className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-gray-900 placeholder-gray-400 hover:shadow-md resize-none" 
        />
    </div>
);


export const ResumeForm: React.FC<ResumeFormProps> = ({
    resumeData,
    onDataChange,
    onExperienceChange,
    addExperience,
    removeExperience,
    onEducationChange,
    addEducation,
    removeEducation,
    handleAiRefine,
    isRefining,
    rawResumeText,
    onRawResumeTextChange,
    onAutoFill,
    isAutoFilling,
    jobDescription,
    onJobDescriptionChange,
    onAnalyze,
    onGenerateCoverLetter,
    onGenerateInterviewPrep,
    isGeneratingTool,
    isBeginnerMode,
    isDarkMode,
    onVoiceInput,
    isListening,
    onListeningChange
}) => {

    const handlePersonalDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onDataChange('personalDetails', { ...resumeData.personalDetails, [e.target.name]: e.target.value });
    };

    return (
        <div className={`p-8 ${isDarkMode ? 'bg-gray-800/80 border-gray-700 text-gray-100' : 'bg-white/80 border-gray-200'} backdrop-blur-md border shadow-2xl rounded-2xl transition-all duration-500`}>
            <div className={`mb-6 ${isDarkMode ? 'bg-gradient-to-r from-green-900/20 to-blue-900/20 border-green-700' : 'bg-gradient-to-r from-green-50 to-blue-50 border-green-300'} border rounded-2xl shadow-lg transition-all duration-500`}>
                <details className="group">
                    <summary className={`p-6 font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'} cursor-pointer list-none flex justify-between items-center hover:${isDarkMode ? 'bg-gray-700/30' : 'bg-white/30'} rounded-2xl transition-all duration-300`}>
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-gradient-to-r from-green-600 to-blue-600' : 'bg-gradient-to-r from-green-500 to-blue-500'} shadow-lg`}>
                                <SparklesIcon className="w-5 h-5 text-white" />
                            </div>
                            <span>Quick Fill with AI</span>
                        </div>
                        <span className="transition-transform transform group-open:rotate-180 duration-300">
                            <svg className={`w-6 h-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </span>
                    </summary>
                    <div className="px-6 pb-6">
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4 leading-relaxed`}>
                            🚀 No time? Let our AI resume builder do the work! Just paste your existing resume or LinkedIn profile below. Our intelligent system will analyze, refine, and auto-fill everything for you.
                        </p>
                        <div className="space-y-4">
                            <textarea 
                                className={`w-full p-4 border ${isDarkMode ? 'border-gray-600 bg-gray-700/50 text-gray-100' : 'border-gray-300 bg-white text-gray-900'} rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder-gray-500 hover:shadow-md resize-none`}
                                rows={8}
                                placeholder="Paste your resume details here in any format or language..."
                                value={rawResumeText}
                                onChange={onRawResumeTextChange}
                                aria-label="Paste resume details for AI processing"
                            />
                            <VoiceInput
                                onTranscript={onVoiceInput}
                                isListening={isListening}
                                onListeningChange={onListeningChange}
                                placeholder="Use voice input to add resume details"
                            />
                        </div>
                        <button
                            onClick={onAutoFill}
                            disabled={isAutoFilling || isGeneratingTool}
                            className={`w-full mt-4 flex items-center justify-center gap-3 p-4 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg ${
                                isAutoFilling || isGeneratingTool 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 hover:shadow-xl'
                            }`}
                        >
                            <SparklesIcon className={`w-5 h-5 ${isAutoFilling ? 'animate-spin' : 'animate-pulse'}`}/>
                            {isAutoFilling ? 'Analyzing & Generating...' : 'Generate & Fill Form'}
                        </button>
                    </div>
                </details>
            </div>
            
            <AiTools
                jobDescription={jobDescription}
                onJobDescriptionChange={onJobDescriptionChange}
                onAnalyze={onAnalyze}
                onGenerateCoverLetter={onGenerateCoverLetter}
                onGenerateInterviewPrep={onGenerateInterviewPrep}
                isGenerating={isGeneratingTool}
                isDisabled={isAutoFilling}
                isDarkMode={isDarkMode}
            />

            <Section title="Personal Details" isDarkMode={isDarkMode}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField 
                        label="Full Name" 
                        name="fullName" 
                        value={resumeData.personalDetails.fullName} 
                        onChange={handlePersonalDetailsChange} 
                        placeholder="e.g. Jane Doe"
                        tooltip="Your full legal name as it appears on official documents"
                        example="John Smith"
                        isBeginnerMode={isBeginnerMode}
                    />
                    <InputField 
                        label="Email" 
                        name="email" 
                        type="email" 
                        value={resumeData.personalDetails.email} 
                        onChange={handlePersonalDetailsChange} 
                        placeholder="e.g. jane.doe@email.com"
                        tooltip="Use a professional email address, avoid nicknames or numbers"
                        example="john.smith@gmail.com"
                        isBeginnerMode={isBeginnerMode}
                    />
                    <InputField 
                        label="Phone Number" 
                        name="phoneNumber" 
                        value={resumeData.personalDetails.phoneNumber} 
                        onChange={handlePersonalDetailsChange} 
                        placeholder="e.g. (123) 456-7890"
                        tooltip="Include country code if applying internationally"
                        example="+1 (555) 123-4567"
                        isBeginnerMode={isBeginnerMode}
                    />
                    <InputField 
                        label="Address" 
                        name="address" 
                        value={resumeData.personalDetails.address} 
                        onChange={handlePersonalDetailsChange} 
                        placeholder="e.g. City, State"
                        tooltip="City and state/country are usually sufficient for privacy"
                        example="San Francisco, CA"
                        isBeginnerMode={isBeginnerMode}
                    />
                    <InputField 
                        label="LinkedIn Profile" 
                        name="linkedin" 
                        value={resumeData.personalDetails.linkedin} 
                        onChange={handlePersonalDetailsChange} 
                        placeholder="e.g. linkedin.com/in/janedoe"
                        tooltip="Make sure your LinkedIn profile is up-to-date and matches your resume"
                        example="linkedin.com/in/johnsmith"
                        isBeginnerMode={isBeginnerMode}
                    />
                    <InputField 
                        label="Personal Website / Portfolio" 
                        name="website" 
                        value={resumeData.personalDetails.website} 
                        onChange={handlePersonalDetailsChange} 
                        placeholder="e.g. janedoe.com"
                        tooltip="Include if you have a professional portfolio, GitHub, or personal website"
                        example="johnsmith.dev"
                        isBeginnerMode={isBeginnerMode}
                    />
                </div>
            </Section>

            <Section title="Professional Summary" isDarkMode={isDarkMode}>
                <TextAreaField 
                    label="Summary" 
                    value={resumeData.summary} 
                    onChange={(e) => onDataChange('summary', e.target.value)}
                    placeholder="Write a brief summary of your career objectives and qualifications."
                    rows={5}
                    onAiRefine={() => handleAiRefine(AiRefineType.SUMMARY, resumeData.summary)}
                    isRefining={isRefining.status && isRefining.type === AiRefineType.SUMMARY}
                    tooltip="A 3-4 sentence overview highlighting your experience, skills, and career goals"
                    example="Experienced software engineer with 5+ years developing web applications. Skilled in React, Node.js, and cloud technologies. Passionate about creating user-friendly solutions and leading development teams."
                    isBeginnerMode={isBeginnerMode}
                    onVoiceInput={onVoiceInput}
                    isListening={isListening}
                    onListeningChange={onListeningChange}
                />
            </Section>

            <Section title="Work Experience" isDarkMode={isDarkMode}>
                {resumeData.experience.map((exp, index) => (
                    <div key={exp.id} className={`p-6 border ${isDarkMode ? 'border-gray-600 bg-gray-700/30' : 'border-gray-200 bg-gray-50/50'} rounded-2xl mb-6 relative shadow-lg hover:shadow-xl transition-all duration-300`}>
                         <button onClick={() => removeExperience(exp.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors" aria-label={`Remove ${exp.jobTitle} experience`}>
                            <TrashIcon className="w-5 h-5"/>
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField label="Job Title" value={exp.jobTitle} onChange={(e) => onExperienceChange(index, 'jobTitle', e.target.value)} placeholder="e.g. Software Engineer" />
                            <InputField label="Company" value={exp.company} onChange={(e) => onExperienceChange(index, 'company', e.target.value)} placeholder="e.g. Tech Solutions Inc." />
                            <InputField label="Location" value={exp.location} onChange={(e) => onExperienceChange(index, 'location', e.target.value)} placeholder="e.g. San Francisco, CA" />
                            <div className="grid grid-cols-2 gap-2">
                                <InputField label="Start Date" value={exp.startDate} onChange={(e) => onExperienceChange(index, 'startDate', e.target.value)} placeholder="e.g. Jan 2020" />
                                <InputField label="End Date" value={exp.endDate} onChange={(e) => onExperienceChange(index, 'endDate', e.target.value)} placeholder="e.g. Present" />
                            </div>
                        </div>
                        <TextAreaField 
                            label="Description" 
                            value={exp.description} 
                            onChange={(e) => onExperienceChange(index, 'description', e.target.value)}
                            placeholder="Describe your responsibilities and achievements. Use bullet points for clarity."
                            rows={6}
                            onAiRefine={() => handleAiRefine(AiRefineType.EXPERIENCE, exp.description, index)}
                            isRefining={isRefining.status && isRefining.type === AiRefineType.EXPERIENCE && isRefining.index === index}
                        />
                    </div>
                ))}
                <button onClick={addExperience} className="flex items-center justify-center w-full mt-2 p-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md font-semibold transition-colors">
                    <AddIcon className="w-5 h-5 mr-2" /> Add Experience
                </button>
            </Section>

            <Section title="Education" isDarkMode={isDarkMode}>
                {resumeData.education.map((edu, index) => (
                    <div key={edu.id} className={`p-6 border ${isDarkMode ? 'border-gray-600 bg-gray-700/30' : 'border-gray-200 bg-gray-50/50'} rounded-2xl mb-6 relative shadow-lg hover:shadow-xl transition-all duration-300`}>
                        <button onClick={() => removeEducation(edu.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors" aria-label={`Remove ${edu.degree} education`}>
                            <TrashIcon className="w-5 h-5"/>
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField label="Degree / Certificate" value={edu.degree} onChange={(e) => onEducationChange(index, 'degree', e.target.value)} placeholder="e.g. B.S. in Computer Science" />
                            <InputField label="School / University" value={edu.school} onChange={(e) => onEducationChange(index, 'school', e.target.value)} placeholder="e.g. University of Example" />
                            <InputField label="Location" value={edu.location} onChange={(e) => onEducationChange(index, 'location', e.target.value)} placeholder="e.g. City, State" />
                            <InputField label="Graduation Date" value={edu.graduationDate} onChange={(e) => onEducationChange(index, 'graduationDate', e.target.value)} placeholder="e.g. May 2019" />
                        </div>
                    </div>
                ))}
                <button onClick={addEducation} className="flex items-center justify-center w-full mt-2 p-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md font-semibold transition-colors">
                    <AddIcon className="w-5 h-5 mr-2" /> Add Education
                </button>
            </Section>

            <Section title="Skills" isDarkMode={isDarkMode}>
                <TextAreaField 
                    label="Skills" 
                    value={resumeData.skills} 
                    onChange={(e) => onDataChange('skills', e.target.value)}
                    placeholder="Enter skills separated by commas, e.g., JavaScript, React, Node.js, Agile Methodologies"
                    rows={4}
                />
            </Section>
        </div>
    );
};

export default ResumeForm;