import React from 'react';
import SparklesIcon from './icons/SparklesIcon';
import TargetIcon from './icons/TargetIcon';
import DocumentTextIcon from './icons/DocumentTextIcon';
import QuestionMarkCircleIcon from './icons/QuestionMarkCircleIcon';

interface AiToolsProps {
    jobDescription: string;
    onJobDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onAnalyze: () => void;
    onGenerateCoverLetter: () => void;
    onGenerateInterviewPrep: () => void;
    isGenerating: boolean;
    isDisabled: boolean;
    isDarkMode?: boolean;
}

const ToolButton: React.FC<{ 
    onClick: () => void, 
    disabled: boolean, 
    children: React.ReactNode, 
    'aria-label': string,
    gradient: string,
    isDarkMode?: boolean
}> = ({ onClick, disabled, children, 'aria-label': ariaLabel, gradient, isDarkMode }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
        className={`group flex-1 flex items-center justify-center gap-2 md:gap-3 p-3 md:p-4 text-sm font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            disabled 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed focus:ring-gray-400' 
                : `${gradient} text-white hover:shadow-2xl focus:ring-blue-400`
        }`}
    >
        {children}
    </button>
);


export const AiTools: React.FC<AiToolsProps> = ({
    jobDescription,
    onJobDescriptionChange,
    onAnalyze,
    onGenerateCoverLetter,
    onGenerateInterviewPrep,
    isGenerating,
    isDisabled,
    isDarkMode = false
}) => {
    return (
        <div className={`mb-6 md:mb-8 ${isDarkMode ? 'bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-700' : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300'} border rounded-2xl shadow-lg transition-all duration-500`}>
            <details className="group">
                <summary className={`p-4 md:p-6 font-semibold text-base md:text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'} cursor-pointer list-none flex justify-between items-center hover:${isDarkMode ? 'bg-gray-700/30' : 'bg-white/30'} rounded-2xl transition-all duration-300`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'} shadow-lg`}>
                            <span className="text-white text-lg">🚀</span>
                        </div>
                        <span>AI Power-Ups</span>
                    </div>
                    <span className="transition-transform transform group-open:rotate-180 duration-300">
                        <svg className={`w-6 h-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </span>
                </summary>
                <div className="px-6 pb-6 space-y-6">
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                        🎯 Supercharge your application! Paste the job description below and let our AI tailor your resume, generate a compelling cover letter, and prepare you for the interview.
                    </p>
                    <textarea
                        id="job-description"
                        className={`w-full p-4 border ${isDarkMode ? 'border-gray-600 bg-gray-700/50 text-gray-100' : 'border-gray-300 bg-white text-gray-900'} rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-300 placeholder-gray-500 hover:shadow-md resize-none disabled:opacity-60 disabled:cursor-not-allowed`}
                        rows={6}
                        placeholder="Paste the full job description here..."
                        value={jobDescription}
                        onChange={onJobDescriptionChange}
                        aria-label="Paste job description for AI power-ups"
                        disabled={isGenerating || isDisabled}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                        {isGenerating ? (
                            <div className="sm:col-span-3 flex items-center justify-center gap-3 p-6 text-base md:text-lg font-medium text-blue-600 bg-blue-50 rounded-xl border border-blue-200" role="status" aria-live="polite">
                                <SparklesIcon className="w-6 h-6 animate-spin" aria-hidden="true" />
                                <span>AI is working its magic...</span>
                            </div>
                        ) : (
                           <>
                             <ToolButton 
                                onClick={onAnalyze} 
                                disabled={isDisabled || !jobDescription} 
                                aria-label="Analyze resume against job description"
                                gradient="bg-gradient-to-r from-blue-500 to-cyan-500"
                                isDarkMode={isDarkMode}
                             >
                                <TargetIcon className="w-5 h-5 group-hover:scale-110 transition-transform" aria-hidden="true" />
                                <span>Analyze</span>
                             </ToolButton>
                             <ToolButton 
                                onClick={onGenerateCoverLetter} 
                                disabled={isDisabled || !jobDescription} 
                                aria-label="Generate cover letter"
                                gradient="bg-gradient-to-r from-purple-500 to-pink-500"
                                isDarkMode={isDarkMode}
                             >
                                <DocumentTextIcon className="w-5 h-5 group-hover:scale-110 transition-transform" aria-hidden="true" />
                                <span>Cover Letter</span>
                             </ToolButton>
                             <ToolButton 
                                onClick={onGenerateInterviewPrep} 
                                disabled={isDisabled || !jobDescription} 
                                aria-label="Generate interview prep questions"
                                gradient="bg-gradient-to-r from-green-500 to-teal-500"
                                isDarkMode={isDarkMode}
                             >
                                <QuestionMarkCircleIcon className="w-5 h-5 group-hover:scale-110 transition-transform" aria-hidden="true" />
                                <span>Interview Prep</span>
                             </ToolButton>
                           </>
                        )}
                    </div>
                </div>
            </details>
        </div>
    );
};