
import React, { useState, useCallback } from 'react';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import { refineWithAI, parseAndRefineWithAI, analyzeResumeAgainstJob, generateCoverLetter, generateInterviewQuestions, generateResumeScorecard } from './services/geminiService';
import { ResumeData, WorkExperience, Education, AiRefineType, ResumeAnalysis, InterviewQuestion, ToneStyle, ResumeScorecard } from './types';
import { exportToDocx } from './utils/docxExport';
import PrintIcon from './components/icons/PrintIcon';
import DownloadIcon from './components/icons/DownloadIcon';
import ShareIcon from './components/icons/ShareIcon';
import SparklesIcon from './components/icons/SparklesIcon';
import Modal from './components/Modal';
import SettingsPanel from './components/SettingsPanel';
import VoiceInput from './components/VoiceInput';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { logger } from './utils/logger';

const initialResumeData: ResumeData = {
  personalDetails: {
    fullName: 'Jane Doe',
    email: 'jane.doe@example.com',
    phoneNumber: '123-456-7890',
    address: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/janedoe',
    website: 'janedoe.dev'
  },
  summary: 'A highly motivated and results-oriented Software Engineer with 5+ years of experience in developing and scaling web applications. Proficient in JavaScript, React, and Node.js. Passionate about creating clean, efficient code and user-friendly interfaces.',
  experience: [
    {
      id: `exp-${Date.now()}`,
      jobTitle: 'Senior Software Engineer',
      company: 'Innovatech',
      location: 'San Francisco, CA',
      startDate: 'Jan 2022',
      endDate: 'Present',
      description: '- Led the development of a new customer-facing analytics dashboard, resulting in a 20% increase in user engagement.\n- Mentored junior engineers, improving team productivity by 15%.\n- Optimized application performance, reducing page load times by 30%.'
    }
  ],
  education: [
    {
      id: `edu-${Date.now()}`,
      degree: 'B.S. in Computer Science',
      school: 'State University',
      location: 'Anytown, USA',
      graduationDate: 'May 2017'
    }
  ],
  skills: 'React, TypeScript, Node.js, Express, PostgreSQL, Docker, AWS'
};

const formatResumeAsText = (data: ResumeData) => {
    let text = `Name: ${data.personalDetails.fullName}\n`;
    text += `Contact: ${data.personalDetails.email} | ${data.personalDetails.phoneNumber}\n\n`;
    text += `SUMMARY\n${data.summary}\n\n`;
    text += `EXPERIENCE\n`;
    data.experience.forEach(exp => {
        text += `${exp.jobTitle} at ${exp.company} (${exp.startDate} - ${exp.endDate})\n${exp.description}\n\n`;
    });
    text += `EDUCATION\n`;
    data.education.forEach(edu => {
        text += `${edu.degree}, ${edu.school} (${edu.graduationDate})\n\n`;
    });
    text += `SKILLS\n${data.skills}`;
    return text;
};

type ModalType = 'ANALYSIS' | 'COVER_LETTER' | 'INTERVIEW_PREP' | 'SCORECARD';

const App: React.FC = () => {
    const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
    const [isRefining, setIsRefining] = useState<{ status: boolean, type: AiRefineType | null, index: number | null }>({ status: false, type: null, index: null });
    const [toast, setToast] = useState<{ message: string, visible: boolean }>({ message: '', visible: false });
    const [rawResumeText, setRawResumeText] = useState('');
    const [isAutoFilling, setIsAutoFilling] = useState(false);
    
    // State for AI Power-Ups
    const [jobDescription, setJobDescription] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [modalState, setModalState] = useState<{ isOpen: boolean; type: ModalType | null; content: any }>({ isOpen: false, type: null, content: null });
    const [toneStyle, setToneStyle] = useState<ToneStyle>(ToneStyle.FORMAL);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isBeginnerMode, setIsBeginnerMode] = useState(false);
    const [isListening, setIsListening] = useState(false);


    const showToast = (message: string) => {
        setToast({ message, visible: true });
        setTimeout(() => setToast({ message: '', visible: false }), 4000);
    };

    const handleDataChange = useCallback(<K extends keyof ResumeData>(key: K, value: ResumeData[K]) => {
        setResumeData(prev => ({ ...prev, [key]: value }));
    }, []);

    const handleExperienceChange = useCallback((index: number, field: keyof WorkExperience, value: string) => {
        const newExperience = [...resumeData.experience];
        newExperience[index] = { ...newExperience[index], [field]: value };
        setResumeData(prev => ({ ...prev, experience: newExperience }));
    }, [resumeData.experience]);

    const addExperience = useCallback(() => {
        const newExperience: WorkExperience = { id: `exp-${Date.now()}`, jobTitle: '', company: '', location: '', startDate: '', endDate: '', description: '' };
        setResumeData(prev => ({ ...prev, experience: [...prev.experience, newExperience] }));
    }, []);

    const removeExperience = useCallback((id: string) => {
        setResumeData(prev => ({ ...prev, experience: prev.experience.filter(exp => exp.id !== id) }));
    }, []);

    const handleEducationChange = useCallback((index: number, field: keyof Education, value: string) => {
        const newEducation = [...resumeData.education];
        newEducation[index] = { ...newEducation[index], [field]: value };
        setResumeData(prev => ({ ...prev, education: newEducation }));
    }, [resumeData.education]);

    const addEducation = useCallback(() => {
        const newEducation: Education = { id: `edu-${Date.now()}`, degree: '', school: '', location: '', graduationDate: '' };
        setResumeData(prev => ({ ...prev, education: [...prev.education, newEducation] }));
    }, []);

    const removeEducation = useCallback((id: string) => {
        setResumeData(prev => ({ ...prev, education: prev.education.filter(edu => edu.id !== id) }));
    }, []);

    const handleAiRefine = async (type: AiRefineType, text: string, index?: number) => {
        setIsRefining({ status: true, type, index: index ?? null });
        try {
            const refinedText = await refineWithAI(type, text, toneStyle);
            if (type === AiRefineType.SUMMARY) {
                handleDataChange('summary', refinedText);
            } else if (type === AiRefineType.EXPERIENCE && index !== undefined) {
                handleExperienceChange(index, 'description', refinedText);
            }
            showToast("AI refinement successful!");
        } catch (error) {
            logger.error("AI refinement error:", error);
            showToast(error instanceof Error ? error.message : "An unknown error occurred.");
        } finally {
            setIsRefining({ status: false, type: null, index: null });
        }
    };

    const handleVoiceInput = (transcript: string) => {
        setRawResumeText(prev => prev + ' ' + transcript);
        showToast("Voice input added to resume text!");
    };

    const handleAutoFillAI = async () => {
        if (!rawResumeText.trim()) {
            showToast("Please paste your resume details first.");
            return;
        }
        setIsAutoFilling(true);
        try {
            const parsedData = await parseAndRefineWithAI(rawResumeText);
            
            setResumeData(prev => ({
                ...prev,
                personalDetails: { ...prev.personalDetails, ...parsedData.personalDetails },
                summary: parsedData.summary || prev.summary,
                skills: parsedData.skills || prev.skills,
                experience: parsedData.experience?.map((exp, i) => ({
                    ...exp,
                    id: `exp-${Date.now()}-${i}`,
                })) || prev.experience,
                education: parsedData.education?.map((edu, i) => ({
                    ...edu,
                    id: `edu-${Date.now()}-${i}`,
                })) || prev.education,
            }));

            showToast("Your resume has been generated and filled!");
        } catch (error) {
            logger.error("Error with AI auto-fill:", error);
            showToast(error instanceof Error ? error.message : "Failed to parse resume. Please check the text and try again.");
        } finally {
            setIsAutoFilling(false);
        }
    };

    const runAiTool = async (tool: 'analyze' | 'coverLetter' | 'interviewPrep' | 'scorecard') => {
        if (tool !== 'scorecard' && !jobDescription.trim()) {
            showToast("Please paste a job description first.");
            return;
        }
        setIsGenerating(true);
        try {
            let content;
            let type: ModalType | null = null;
            if (tool === 'analyze') {
                content = await analyzeResumeAgainstJob(resumeData, jobDescription);
                type = 'ANALYSIS';
            } else if (tool === 'coverLetter') {
                content = await generateCoverLetter(resumeData, jobDescription);
                type = 'COVER_LETTER';
            } else if (tool === 'interviewPrep') {
                content = await generateInterviewQuestions(resumeData, jobDescription);
                type = 'INTERVIEW_PREP';
            } else if (tool === 'scorecard') {
                content = await generateResumeScorecard(resumeData);
                type = 'SCORECARD';
            }
            setModalState({ isOpen: true, type, content });
        } catch (error) {
            logger.error(`Error with AI tool (${tool}):`, error);
            showToast(error instanceof Error ? error.message : "An AI tool failed. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePrint = () => { window.print(); };

    const handleDownloadPdf = () => {
        // PDF libraries are now bundled with the application
        
        const resumeElement = document.getElementById('resume-preview-container');
        if (!resumeElement) {
            showToast("Could not find resume content to download.");
            return;
        }

        showToast('Generating PDF, please wait...');

        html2canvas(resumeElement, {
            scale: 2,
            useCORS: true,
            logging: false,
        } as any).then((canvas: any) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const ratio = canvasWidth / canvasHeight;
            const imgHeight = pdfWidth / ratio;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
            pdf.save(`${resumeData.personalDetails.fullName.replace(/ /g, '_') || 'resume'}.pdf`);
        }).catch((err: any) => {
            logger.error("Error generating PDF:", err);
            showToast("Could not generate PDF.");
        });
    };

    const handleDownloadDocx = async () => {
        try {
            showToast('Generating DOCX, please wait...');
            await exportToDocx(resumeData);
            showToast('DOCX downloaded successfully!');
        } catch (error) {
            logger.error("Error generating DOCX:", error);
            showToast("Could not generate DOCX.");
        }
    };
    
    const handleShare = async () => {
        const resumeText = formatResumeAsText(resumeData);
        const shareTitle = `${resumeData.personalDetails.fullName}'s Resume`;
        const shareText = `Check out my professional resume created with the free AI Resume Maker at freeresumebuilderai.hindustan.site!`;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: shareTitle,
                    text: shareText,
                    url: 'https://freeresumebuilderai.hindustan.site',
                });
            } else {
                await navigator.clipboard.writeText(resumeText);
                showToast('Resume content copied to clipboard!');
            }
        } catch (error) {
            logger.error('Share failed:', error);
            try {
                await navigator.clipboard.writeText(resumeText);
                showToast('Sharing failed. Resume content copied to clipboard instead!');
            } catch (copyError) {
                showToast('Sharing and copying both failed.');
            }
        }
    };

    const renderModalContent = () => {
        if (!modalState.content) return null;

        switch (modalState.type) {
            case 'ANALYSIS':
                const analysis = modalState.content as ResumeAnalysis;
                return (
                    <div>
                        <div className="text-center mb-4">
                            <p className="text-lg font-semibold">Match Score</p>
                            <p className={`text-5xl font-bold ${analysis.matchScore > 75 ? 'text-green-500' : analysis.matchScore > 50 ? 'text-yellow-500' : 'text-red-500'}`}>{analysis.matchScore}%</p>
                            <p className="text-gray-600 mt-2">{analysis.overallFeedback}</p>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-green-600">✅ Strengths</h4>
                                <ul className="list-disc list-inside text-gray-700 space-y-1 mt-1">
                                    {analysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-yellow-600">🔍 Areas for Improvement</h4>
                                 <ul className="list-disc list-inside text-gray-700 space-y-1 mt-1">
                                    {analysis.areasForImprovement.map((a, i) => <li key={i}>{a}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                );
            case 'COVER_LETTER':
                 return (
                    <div>
                        <p className="whitespace-pre-wrap font-serif text-gray-800">{modalState.content}</p>
                        <button onClick={() => { navigator.clipboard.writeText(modalState.content); showToast('Copied to clipboard!'); }} className="mt-4 w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Copy Text</button>
                    </div>
                 );
            case 'INTERVIEW_PREP':
                const questions = modalState.content as InterviewQuestion[];
                return (
                    <div className="space-y-4">
                        {questions.map((q, i) => (
                            <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <p className="font-semibold text-gray-800">{q.question}</p>
                                <p className="text-sm text-gray-600 mt-1 italic"><strong>Why this might be asked:</strong> {q.reasoning}</p>
                            </div>
                        ))}
                    </div>
                );
            case 'SCORECARD':
                const scorecard = modalState.content as ResumeScorecard;
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm text-gray-600">Overall Score</p>
                                <p className={`text-2xl font-bold ${scorecard.overallScore > 75 ? 'text-green-500' : scorecard.overallScore > 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                                    {scorecard.overallScore}/100
                                </p>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                                <p className="text-sm text-gray-600">ATS Compatible</p>
                                <p className={`text-2xl font-bold ${scorecard.atsCompatibility > 75 ? 'text-green-500' : scorecard.atsCompatibility > 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                                    {scorecard.atsCompatibility}/100
                                </p>
                            </div>
                            <div className="text-center p-3 bg-purple-50 rounded-lg">
                                <p className="text-sm text-gray-600">Keywords</p>
                                <p className={`text-2xl font-bold ${scorecard.keywordDensity > 75 ? 'text-green-500' : scorecard.keywordDensity > 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                                    {scorecard.keywordDensity}/100
                                </p>
                            </div>
                            <div className="text-center p-3 bg-yellow-50 rounded-lg">
                                <p className="text-sm text-gray-600">Clarity</p>
                                <p className={`text-2xl font-bold ${scorecard.clarity > 75 ? 'text-green-500' : scorecard.clarity > 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                                    {scorecard.clarity}/100
                                </p>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-blue-600 mb-2">💡 Suggestions for Improvement</h4>
                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                                {scorecard.suggestions.map((suggestion, i) => <li key={i}>{suggestion}</li>)}
                            </ul>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };


    return (
        <div className={`${isDarkMode ? 'dark bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50 text-slate-800'} min-h-screen font-sans flex flex-col transition-all duration-500`}>
            <header className={`${isDarkMode ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-gray-200'} backdrop-blur-md shadow-lg border-b p-4 sticky top-0 z-20 transition-all duration-500`}>
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'} shadow-lg`}>
                            <SparklesIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} tracking-tight`}>
                                AI Resume Maker
                            </h1>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Professional CV Builder
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => runAiTool('scorecard')} 
                            className={`group flex items-center gap-2 px-3 py-2 text-sm font-medium ${isDarkMode ? 'text-gray-300 bg-gray-700/80 hover:bg-gray-600 border-gray-600' : 'text-gray-700 bg-white/80 hover:bg-gray-50 border-gray-300'} border rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-md`}
                        >
                            <span className="text-lg">📊</span> 
                            <span className="hidden sm:inline">Score</span>
                        </button>
                        <button 
                            onClick={handlePrint} 
                            className={`group flex items-center gap-2 px-3 py-2 text-sm font-medium ${isDarkMode ? 'text-gray-300 bg-gray-700/80 hover:bg-gray-600 border-gray-600' : 'text-gray-700 bg-white/80 hover:bg-gray-50 border-gray-300'} border rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-md`}
                        >
                            <PrintIcon className="w-4 h-4 group-hover:scale-110 transition-transform"/> 
                            <span className="hidden sm:inline">Print</span>
                        </button>
                        <div className="relative group">
                            <button className={`flex items-center gap-2 px-3 py-2 text-sm font-medium ${isDarkMode ? 'text-gray-300 bg-gray-700/80 hover:bg-gray-600 border-gray-600' : 'text-gray-700 bg-white/80 hover:bg-gray-50 border-gray-300'} border rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-md`}>
                                <DownloadIcon className="w-4 h-4 group-hover:scale-110 transition-transform"/> 
                                <span className="hidden sm:inline">Export</span>
                                <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                            <div className={`absolute right-0 mt-2 w-32 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-30`}>
                                <button onClick={handleDownloadPdf} className={`w-full text-left px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'} rounded-t-xl transition-colors`}>
                                    📄 PDF
                                </button>
                                <button onClick={handleDownloadDocx} className={`w-full text-left px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'} rounded-b-xl transition-colors`}>
                                    📝 DOCX
                                </button>
                            </div>
                        </div>
                        <button 
                            onClick={handleShare} 
                            className={`group flex items-center gap-2 px-3 py-2 text-sm font-medium ${isDarkMode ? 'text-gray-300 bg-gray-700/80 hover:bg-gray-600 border-gray-600' : 'text-gray-700 bg-white/80 hover:bg-gray-50 border-gray-300'} border rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-md`}
                        >
                            <ShareIcon className="w-4 h-4 group-hover:scale-110 transition-transform"/> 
                            <span className="hidden sm:inline">Share</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto p-4 md:p-8 grid grid-cols-1 xl:grid-cols-5 gap-8 items-start flex-grow">
                <div className="xl:col-span-2 lg:sticky lg:top-28 space-y-6">
                    <SettingsPanel
                        toneStyle={toneStyle}
                        onToneStyleChange={setToneStyle}
                        isDarkMode={isDarkMode}
                        onDarkModeToggle={() => setIsDarkMode(!isDarkMode)}
                        isBeginnerMode={isBeginnerMode}
                        onBeginnerModeToggle={() => setIsBeginnerMode(!isBeginnerMode)}
                    />
                     <ResumeForm 
                        resumeData={resumeData}
                        onDataChange={handleDataChange}
                        onExperienceChange={handleExperienceChange}
                        addExperience={addExperience}
                        removeExperience={removeExperience}
                        onEducationChange={handleEducationChange}
                        addEducation={addEducation}
                        removeEducation={removeEducation}
                        handleAiRefine={handleAiRefine}
                        isRefining={isRefining}
                        rawResumeText={rawResumeText}
                        onRawResumeTextChange={(e) => setRawResumeText(e.target.value)}
                        onAutoFill={handleAutoFillAI}
                        isAutoFilling={isAutoFilling}
                        // AI Power-up Props
                        jobDescription={jobDescription}
                        onJobDescriptionChange={(e) => setJobDescription(e.target.value)}
                        onAnalyze={() => runAiTool('analyze')}
                        onGenerateCoverLetter={() => runAiTool('coverLetter')}
                        onGenerateInterviewPrep={() => runAiTool('interviewPrep')}
                        isGeneratingTool={isGenerating}
                        // New Props
                        isBeginnerMode={isBeginnerMode}
                        isDarkMode={isDarkMode}
                        onVoiceInput={handleVoiceInput}
                        isListening={isListening}
                        onListeningChange={setIsListening}
                    />
                </div>
                <div className="xl:col-span-3 h-full">
                    <div className={`sticky top-28 ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm rounded-2xl p-6 shadow-2xl border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                Live Preview
                            </h2>
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${isDarkMode ? 'bg-green-400' : 'bg-green-500'} animate-pulse`}></div>
                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Auto-updating
                                </span>
                            </div>
                        </div>
                        <div id="resume-preview-container-wrapper" className="w-full transform scale-90 origin-top transition-all duration-500 hover:scale-95">
                          <ResumePreview resumeData={resumeData} isDarkMode={isDarkMode} />
                        </div>
                    </div>
                </div>
            </main>
            
            <Modal
                isOpen={modalState.isOpen}
                onClose={() => setModalState({ ...modalState, isOpen: false })}
                title={
                    modalState.type === 'ANALYSIS' ? '🎯 Resume Analysis' :
                    modalState.type === 'COVER_LETTER' ? '📝 Generated Cover Letter' :
                    modalState.type === 'INTERVIEW_PREP' ? '❓ Interview Prep Questions' :
                    modalState.type === 'SCORECARD' ? '📊 Resume Scorecard' : ''
                }
                isDarkMode={isDarkMode}
            >
                {renderModalContent()}
            </Modal>

            {toast.visible && (
                <div className={`fixed bottom-6 right-6 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} border text-gray-800 dark:text-white py-4 px-6 rounded-2xl shadow-2xl animate-fade-in-out z-50 backdrop-blur-md max-w-sm`}>
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="font-medium">{toast.message}</span>
                    </div>
                </div>
            )}
             <footer className={`${isDarkMode ? 'bg-gray-900/95 border-gray-700' : 'bg-white/95 border-gray-200'} backdrop-blur-md border-t mt-16 py-12 transition-all duration-500`}>
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'} shadow-lg`}>
                                    <SparklesIcon className="w-5 h-5 text-white" />
                                </div>
                                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                    AI Resume Maker
                                </h3>
                            </div>
                            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4 max-w-md`}>
                                Create professional, ATS-friendly resumes with the power of AI. Get hired faster with our intelligent resume builder.
                            </p>
                            <div className="flex items-center gap-4">
                                <div className={`px-3 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-green-900/50 text-green-400 border border-green-800' : 'bg-green-100 text-green-800 border border-green-200'}`}>
                                    ✨ AI-Powered
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-blue-900/50 text-blue-400 border border-blue-800' : 'bg-blue-100 text-blue-800 border border-blue-200'}`}>
                                    🔒 Privacy-First
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-purple-900/50 text-purple-400 border border-purple-800' : 'bg-purple-100 text-purple-800 border border-purple-200'}`}>
                                    📱 Mobile-Ready
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>Features</h4>
                            <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span> AI Content Enhancement
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span> ATS Optimization
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span> Multiple Export Formats
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span> Voice Input Support
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span> Dark Mode
                                </li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>AI Tools</h4>
                            <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                <li className="flex items-center gap-2">
                                    <span className="text-blue-500">🎯</span> Job Match Analysis
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-purple-500">📝</span> Cover Letter Generator
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-orange-500">❓</span> Interview Prep
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">📊</span> Resume Scorecard
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-pink-500">🎨</span> Tone Customization
                                </li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} mt-8 pt-8 flex flex-col md:flex-row justify-between items-center`}>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            &copy; {new Date().getFullYear()} freeresumebuilderai.hindustan.site. All Rights Reserved.
                        </p>
                        <div className="flex items-center gap-6 mt-4 md:mt-0">
                            <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                Made with ❤️ for job seekers worldwide
                            </span>
                        </div>
                    </div>
                </div>
            </footer>

            <style>{`
                @media print {
                    #resume-preview-container-wrapper {
                        transform: scale(1) !important;
                    }
                }
                @keyframes fade-in-out {
                    0% { opacity: 0; transform: translateY(10px); }
                    10% { opacity: 1; transform: translateY(0); }
                    90% { opacity: 1; transform: translateY(0); }
                    100% { opacity: 0; transform: translateY(10px); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { 
                        opacity: 0; 
                        transform: translateY(20px) scale(0.95); 
                    }
                    to { 
                        opacity: 1; 
                        transform: translateY(0) scale(1); 
                    }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                .animate-fade-in-out {
                    animation: fade-in-out 4s ease-in-out forwards;
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
                .animate-slideUp {
                    animation: slideUp 0.3s ease-out;
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                .glass-effect {
                    backdrop-filter: blur(10px);
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }
                .dark .glass-effect {
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
            `}</style>
        </div>
    );
};

export default App;
