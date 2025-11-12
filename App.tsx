
import React, { useState, useCallback } from 'react';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import { refineWithAI, parseAndRefineWithAI, analyzeResumeAgainstJob, generateCoverLetter, generateInterviewQuestions, generateResumeScorecard } from './services/geminiService';
import { ResumeData, WorkExperience, Education, AiRefineType, ResumeAnalysis, InterviewQuestion, ToneStyle, ResumeScorecard } from './types';
import { exportToDocx } from './utils/docxExport';
import { captureElementAsCanvas, exportCanvasToPDF, exportCanvasToImage } from './utils/exportHelpers';
import PrintIcon from './components/icons/PrintIcon';
import DownloadIcon from './components/icons/DownloadIcon';
import ShareIcon from './components/icons/ShareIcon';
import SparklesIcon from './components/icons/SparklesIcon';
import ImageIcon from './components/icons/ImageIcon';
import Modal from './components/Modal';
import VoiceInput from './components/VoiceInput';
import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import DonateSection from './components/DonateSection';
import Router from './components/Router';
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

    const handleDownloadPdf = async () => {
        const resumeElement = document.getElementById('resume-preview-container');
        if (!resumeElement) {
            showToast("Could not find resume content to download.");
            return;
        }

        showToast('Generating PDF, please wait...');

        try {
            const canvas = await captureElementAsCanvas(resumeElement);
            const fileName = `${resumeData.personalDetails.fullName.replace(/ /g, '_') || 'resume'}.pdf`;
            exportCanvasToPDF(canvas, fileName);
            showToast('PDF downloaded successfully!');
        } catch (err) {
            logger.error("Error generating PDF:", err);
            showToast("Could not generate PDF. Please try again.");
        }
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

    const handleDownloadImage = async () => {
        const resumeElement = document.getElementById('resume-preview-container');
        if (!resumeElement) {
            showToast("Could not find resume content to download.");
            return;
        }

        showToast('Generating image, please wait...');

        try {
            const canvas = await captureElementAsCanvas(resumeElement);
            const fileName = `${resumeData.personalDetails.fullName.replace(/ /g, '_') || 'resume'}.png`;
            exportCanvasToImage(canvas, fileName);
            showToast('Image downloaded successfully!');
        } catch (err) {
            logger.error("Error generating image:", err);
            showToast("Could not generate image. Please try again.");
        }
    };

    const handleDownloadJson = () => {
        try {
            const dataStr = JSON.stringify(resumeData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${resumeData.personalDetails.fullName.replace(/ /g, '_') || 'resume'}_data.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            showToast('Resume data saved successfully!');
        } catch (error) {
            logger.error("Error downloading JSON:", error);
            showToast("Could not save resume data.");
        }
    };

    const handleLoadJson = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target?.result as string);
                        setResumeData(data);
                        showToast('Resume data loaded successfully!');
                    } catch (error) {
                        logger.error("Error loading JSON:", error);
                        showToast("Could not load resume data. Please check the file format.");
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    };
    
    const handleShare = async () => {
        const shareTitle = 'Free AI Resume Builder - Create Professional Resumes';
        const shareText = `Create ATS-friendly resumes with AI assistance! Free resume builder with smart optimization and export options.`;
        const shareUrl = window.location.href;

        try {
            // Try native sharing first (works on mobile and some desktop browsers)
            if (navigator.share) {
                await navigator.share({
                    title: shareTitle,
                    text: shareText,
                    url: shareUrl,
                });
                showToast('✅ Shared successfully!');
            } else {
                // Fallback: Copy share text to clipboard
                const shareContent = `${shareTitle}\n\n${shareText}\n\n🔗 ${shareUrl}`;
                await navigator.clipboard.writeText(shareContent);
                showToast('📋 Share content copied to clipboard!');
            }
        } catch (error) {
            logger.error('Share failed:', error);
            // Final fallback: Show manual share message
            showToast('❌ Unable to share automatically. Please copy the URL manually.');
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
        <Router>
            <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <Header />

            {/* Hero Section */}
            <HeroSection />

            {/* Toast Notification */}
            {toast.visible && (
                <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
                    {toast.message}
                </div>
            )}

            {/* Main Resume Builder Section */}
            <section id="builder" className="py-16 md:py-20 lg:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 md:mb-16">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-6">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                            </svg>
                            <span>Resume Builder</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Build Your Resume</h2>
                        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                            Create a professional, ATS-friendly resume with our intelligent AI assistant. 
                            Fill out the form on the left and see your resume come to life on the right.
                        </p>
                    </div>

                    {/* Resume Builder Interface */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
                        {/* Left Column - Form */}
                        <div className="space-y-6">
                            <ResumeForm
                                resumeData={resumeData}
                                onDataChange={handleDataChange}
                                onExperienceChange={handleExperienceChange}
                                onEducationChange={handleEducationChange}
                                addExperience={addExperience}
                                addEducation={addEducation}
                                removeExperience={removeExperience}
                                removeEducation={removeEducation}
                                handleAiRefine={handleAiRefine}
                                isRefining={isRefining}
                                rawResumeText={rawResumeText}
                                onRawResumeTextChange={(e) => setRawResumeText(e.target.value)}
                                onAutoFill={handleAutoFillAI}
                                isAutoFilling={isAutoFilling}
                                jobDescription={jobDescription}
                                onJobDescriptionChange={(e) => setJobDescription(e.target.value)}
                                onAnalyze={() => runAiTool('analyze')}
                                onGenerateCoverLetter={() => runAiTool('coverLetter')}
                                onGenerateInterviewPrep={() => runAiTool('interviewPrep')}
                                isGeneratingTool={isGenerating}
                                isBeginnerMode={isBeginnerMode}
                                isDarkMode={isDarkMode}
                                onVoiceInput={handleVoiceInput}
                                isListening={isListening}
                                onListeningChange={setIsListening}
                            />
                        </div>

                        {/* Right Column - Preview */}
                        <div className="lg:sticky lg:top-24 lg:self-start">
                            <ResumePreview
                                resumeData={resumeData}
                                isDarkMode={isDarkMode}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Export & Share Section - Dedicated Section */}
            <section className="py-16 md:py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-xl">
                            <DownloadIcon className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Export & Share Your Resume</h2>
                        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                            Download your resume in multiple formats or share it with potential employers
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-white/50">
                        {/* Download Options */}
                        <div className="mb-12">
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 flex items-center justify-center">
                                <span className="mr-3 text-3xl md:text-4xl">📥</span>
                                Download Resume
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                                <button
                                    onClick={handleDownloadPdf}
                                    className="group flex flex-col items-center justify-center gap-3 p-6 md:p-8 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl hover:from-red-600 hover:to-red-700 transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-2 min-h-[160px] md:min-h-[180px]"
                                    style={{ backgroundColor: '#ef4444' }}
                                >
                                    <DownloadIcon className="w-10 h-10 md:w-12 md:h-12 text-white group-hover:scale-110 transition-transform" />
                                    <span className="text-lg md:text-xl font-bold text-white">PDF</span>
                                    <span className="text-xs md:text-sm text-white">Best for applications</span>
                                </button>
                                <button
                                    onClick={handleDownloadDocx}
                                    className="group flex flex-col items-center justify-center gap-3 p-6 md:p-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-2 min-h-[160px] md:min-h-[180px]"
                                    style={{ backgroundColor: '#3b82f6' }}
                                >
                                    <DownloadIcon className="w-10 h-10 md:w-12 md:h-12 text-white group-hover:scale-110 transition-transform" />
                                    <span className="text-lg md:text-xl font-bold text-white">DOCX</span>
                                    <span className="text-xs md:text-sm text-white">Editable format</span>
                                </button>
                                <button
                                    onClick={handleDownloadImage}
                                    className="group flex flex-col items-center justify-center gap-3 p-6 md:p-8 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-2 min-h-[160px] md:min-h-[180px]"
                                    style={{ backgroundColor: '#22c55e' }}
                                >
                                    <ImageIcon className="w-10 h-10 md:w-12 md:h-12 text-white group-hover:scale-110 transition-transform" />
                                    <span className="text-lg md:text-xl font-bold text-white">Image</span>
                                    <span className="text-xs md:text-sm text-white">For social media</span>
                                </button>
                                <button
                                    onClick={handlePrint}
                                    className="group flex flex-col items-center justify-center gap-3 p-6 md:p-8 bg-gradient-to-br from-slate-700 to-slate-800 text-white rounded-2xl hover:from-slate-800 hover:to-slate-900 transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-2 min-h-[160px] md:min-h-[180px]"
                                    style={{ backgroundColor: '#475569' }}
                                >
                                    <PrintIcon className="w-10 h-10 md:w-12 md:h-12 text-white group-hover:scale-110 transition-transform" />
                                    <span className="text-lg md:text-xl font-bold text-white">Print</span>
                                    <span className="text-xs md:text-sm text-white">Physical copy</span>
                                </button>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="relative my-12">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t-2 border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-white px-8 py-2 text-gray-600 font-bold text-lg rounded-full border-2 border-gray-300">OR</span>
                            </div>
                        </div>

                        {/* Share & Data Management */}
                        <div className="mb-12">
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 flex items-center justify-center">
                                <span className="mr-3 text-3xl md:text-4xl">🔗</span>
                                Share & Manage Data
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                                <button
                                    onClick={handleShare}
                                    className="group flex flex-col items-center justify-center gap-3 p-6 md:p-8 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-2 min-h-[160px] md:min-h-[180px]"
                                    style={{ backgroundColor: '#6366f1' }}
                                >
                                    <ShareIcon className="w-10 h-10 md:w-12 md:h-12 text-white group-hover:scale-110 transition-transform" />
                                    <span className="text-lg md:text-xl font-bold text-white">Share Resume</span>
                                    <span className="text-xs md:text-sm text-white">Send to others</span>
                                </button>
                                <button
                                    onClick={handleDownloadJson}
                                    className="group flex flex-col items-center justify-center gap-3 p-6 md:p-8 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-2 min-h-[160px] md:min-h-[180px]"
                                    style={{ backgroundColor: '#a855f7' }}
                                >
                                    <DownloadIcon className="w-10 h-10 md:w-12 md:h-12 text-white group-hover:scale-110 transition-transform" />
                                    <span className="text-lg md:text-xl font-bold text-white">Save Data</span>
                                    <span className="text-xs md:text-sm text-white">Backup your work</span>
                                </button>
                                <button
                                    onClick={handleLoadJson}
                                    className="group flex flex-col items-center justify-center gap-3 p-6 md:p-8 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-2 min-h-[160px] md:min-h-[180px]"
                                    style={{ backgroundColor: '#f97316' }}
                                >
                                    <svg className="w-10 h-10 md:w-12 md:h-12 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-lg md:text-xl font-bold text-white">Load Data</span>
                                    <span className="text-xs md:text-sm text-white">Continue editing</span>
                                </button>
                            </div>
                        </div>

                        {/* Tips Section */}
                        <div className="p-6 md:p-8 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-2xl border-2 border-blue-300 shadow-lg">
                            <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
                                <div className="flex-shrink-0">
                                    <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <span className="text-3xl md:text-4xl">💡</span>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Quick Tips</h4>
                                    <ul className="space-y-3 text-sm md:text-base text-gray-800">
                                        <li className="flex items-center gap-2">
                                            <span className="text-red-600">●</span>
                                            <span><strong>PDF:</strong> Best for job applications and ATS systems</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-blue-600">●</span>
                                            <span><strong>DOCX:</strong> Perfect for further editing in Microsoft Word</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-green-600">●</span>
                                            <span><strong>Image:</strong> Great for sharing on LinkedIn or social media</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-purple-600">●</span>
                                            <span><strong>Save Data:</strong> Keep your progress and continue editing later</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Donate Section */}
            <DonateSection />

            {/* Footer */}
            <Footer />

            {/* Modal */}
            <Modal
                isOpen={modalState.isOpen}
                onClose={() => setModalState({ isOpen: false, type: null, content: null })}
                title={modalState.type === 'ANALYSIS' ? 'Job Match Analysis' : 
                       modalState.type === 'COVER_LETTER' ? 'Cover Letter' : 
                       modalState.type === 'INTERVIEW_PREP' ? 'Interview Questions' : 
                       modalState.type === 'SCORECARD' ? 'Resume Scorecard' : 'AI Tool Result'}
            >
                {renderModalContent()}
            </Modal>
            </div>
        </Router>
    );
};

export default App;
