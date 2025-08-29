
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
import ImageIcon from './components/icons/ImageIcon';
import TargetIcon from './components/icons/TargetIcon';
import DocumentTextIcon from './components/icons/DocumentTextIcon';
import QuestionMarkCircleIcon from './components/icons/QuestionMarkCircleIcon';
import Modal from './components/Modal';
import SettingsPanel from './components/SettingsPanel';
import VoiceInput from './components/VoiceInput';
import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import DonateSection from './components/DonateSection';
import Router from './components/Router';
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

    const handleDownloadImage = () => {
        const resumeElement = document.getElementById('resume-preview-container');
        if (!resumeElement) {
            showToast("Could not find resume content to download.");
            return;
        }

        showToast('Generating image, please wait...');

        html2canvas(resumeElement, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
        } as any).then((canvas: any) => {
            const link = document.createElement('a');
            link.download = `${resumeData.personalDetails.fullName.replace(/ /g, '_') || 'resume'}.png`;
            link.href = canvas.toDataURL('image/png');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showToast('Image downloaded successfully!');
        }).catch((err: any) => {
            logger.error("Error generating image:", err);
            showToast("Could not generate image.");
        });
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
        const shareTitle = `${resumeData.personalDetails.fullName}'s Professional Resume`;
        const shareText = `Check out my professional resume created with AI Resume Maker - a free, ATS-friendly resume builder!`;
        const shareUrl = 'https://freeresumebuilderai.hindustan.site';

        try {
            // Try native sharing first (works on mobile and some desktop browsers)
            if (navigator.share) {
                await navigator.share({
                    title: shareTitle,
                    text: shareText,
                    url: shareUrl,
                });
                showToast('Shared successfully!');
            } else {
                // Fallback: Copy share text to clipboard
                const shareContent = `${shareTitle}\n\n${shareText}\n\n${shareUrl}`;
                await navigator.clipboard.writeText(shareContent);
                showToast('Share content copied to clipboard!');
            }
        } catch (error) {
            logger.error('Share failed:', error);
            // Final fallback: Copy resume text
            try {
                const resumeText = formatResumeAsText(resumeData);
                await navigator.clipboard.writeText(resumeText);
                showToast('Resume content copied to clipboard instead!');
            } catch (copyError) {
                showToast('Sharing failed. Please try again.');
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
            <section id="builder" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Build Your Resume</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Create a professional, ATS-friendly resume with our intelligent AI assistant. 
                            Fill out the form on the left and see your resume come to life on the right.
                        </p>
                    </div>

                    {/* Resume Builder Interface */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
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
                        <div className="space-y-6">
                            {/* Export & Share Options */}
                            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Export & Share</h3>
                                
                                {/* Export Options */}
                                <div className="mb-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">Download Resume</h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                        <button
                                            onClick={handleDownloadPdf}
                                            className="flex items-center justify-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium text-xs"
                                        >
                                            <DownloadIcon className="w-3 h-3" />
                                            PDF
                                        </button>
                                        <button
                                            onClick={handleDownloadDocx}
                                            className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-xs"
                                        >
                                            <DownloadIcon className="w-3 h-3" />
                                            DOCX
                                        </button>
                                        <button
                                            onClick={handleDownloadImage}
                                            className="flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium text-xs"
                                        >
                                            <ImageIcon className="w-3 h-3" />
                                            IMG
                                        </button>
                                        <button
                                            onClick={handlePrint}
                                            className="flex items-center justify-center gap-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium text-xs"
                                        >
                                            <PrintIcon className="w-3 h-3" />
                                            Print
                                        </button>
                                    </div>
                                </div>

                                {/* Share & Data Options */}
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">Share & Data</h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        <button
                                            onClick={handleShare}
                                            className="flex items-center justify-center gap-1 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium text-xs"
                                        >
                                            <ShareIcon className="w-3 h-3" />
                                            Share
                                        </button>
                                        <button
                                            onClick={handleDownloadJson}
                                            className="flex items-center justify-center gap-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium text-xs"
                                        >
                                            <DownloadIcon className="w-3 h-3" />
                                            Save Data
                                        </button>
                                        <button
                                            onClick={handleLoadJson}
                                            className="flex items-center justify-center gap-1 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 font-medium text-xs"
                                        >
                                            📁
                                            Load Data
                                        </button>
                                    </div>
                                </div>

                                <p className="text-xs text-gray-500 mt-4">
                                    <strong>Download:</strong> PDF (applications), DOCX (editing), IMG (social media), Print (hard copy)<br/>
                                    <strong>Share:</strong> Native sharing or copy to clipboard • <strong>Data:</strong> Save/load for later editing
                                </p>
                            </div>

                            <ResumePreview
                                resumeData={resumeData}
                                isDarkMode={isDarkMode}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* AI Power-Ups Section */}
            <section id="ai-features" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">AI Power-Ups</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Supercharge your resume with intelligent AI tools that give you the competitive edge
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* AI Quick Fill */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <SparklesIcon className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Quick Fill</h3>
                                <p className="text-gray-600 mb-4">Paste your resume and let AI organize it perfectly</p>
                                <textarea
                                    value={rawResumeText}
                                    onChange={(e) => setRawResumeText(e.target.value)}
                                    placeholder="Paste your resume text here..."
                                    className="w-full p-3 border border-gray-300 rounded-lg mb-4 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows={4}
                                />
                                <button
                                    onClick={handleAutoFillAI}
                                    disabled={isAutoFilling}
                                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all duration-200 font-medium"
                                >
                                    {isAutoFilling ? 'Processing...' : 'Auto-Fill with AI'}
                                </button>
                            </div>
                        </div>

                        {/* Job Match Analysis */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <TargetIcon className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Job Match Analysis</h3>
                                <p className="text-gray-600 mb-4">See how well your resume matches a job description</p>
                                <textarea
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    placeholder="Paste job description here..."
                                    className="w-full p-3 border border-gray-300 rounded-lg mb-4 resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    rows={4}
                                />
                                <button
                                    onClick={() => runAiTool('analyze')}
                                    disabled={isGenerating}
                                    className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 transition-all duration-200 font-medium"
                                >
                                    {isGenerating ? 'Analyzing...' : 'Analyze Match'}
                                </button>
                            </div>
                        </div>

                        {/* Cover Letter Generator */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <DocumentTextIcon className="w-8 h-8 text-purple-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Cover Letter</h3>
                                <p className="text-gray-600 mb-4">Generate a compelling, personalized cover letter</p>
                                <button
                                    onClick={() => runAiTool('coverLetter')}
                                    disabled={isGenerating || !jobDescription.trim()}
                                    className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 transition-all duration-200 font-medium"
                                >
                                    {isGenerating ? 'Generating...' : 'Generate Cover Letter'}
                                </button>
                            </div>
                        </div>

                        {/* Interview Prep */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <QuestionMarkCircleIcon className="w-8 h-8 text-orange-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Interview Prep</h3>
                                <p className="text-gray-600 mb-4">Get likely interview questions for your role</p>
                                <button
                                    onClick={() => runAiTool('interviewPrep')}
                                    disabled={isGenerating || !jobDescription.trim()}
                                    className="w-full px-4 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 disabled:opacity-50 transition-all duration-200 font-medium"
                                >
                                    {isGenerating ? 'Preparing...' : 'Get Questions'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Second Row - Resume Scorecard */}
                    <div className="mt-8 flex justify-center">
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 max-w-md w-full">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Resume Scorecard</h3>
                                <p className="text-gray-600 mb-4">Get an AI-powered evaluation of your resume with improvement suggestions</p>
                                <button
                                    onClick={() => runAiTool('scorecard')}
                                    disabled={isGenerating}
                                    className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-50 transition-all duration-200 font-medium"
                                >
                                    {isGenerating ? 'Analyzing...' : 'Get Scorecard'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Settings Panel */}
            <section className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <SettingsPanel
                        toneStyle={toneStyle}
                        onToneStyleChange={setToneStyle}
                        isDarkMode={isDarkMode}
                        onDarkModeToggle={() => setIsDarkMode(!isDarkMode)}
                        isBeginnerMode={isBeginnerMode}
                        onBeginnerModeToggle={() => setIsBeginnerMode(!isBeginnerMode)}
                    />
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
