
import React from 'react';
import { ResumeData } from '../types';

interface ResumePreviewProps {
    resumeData: ResumeData;
    isDarkMode?: boolean;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ resumeData, isDarkMode = false }) => {
    const { personalDetails, summary, experience, education, skills } = resumeData;

    const renderDescription = (text: string) => {
        return text.split('\n').map((line, index) => {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('*') || trimmedLine.startsWith('-')) {
                return (
                    <li key={index} className="text-gray-700 mb-2 ml-4 leading-relaxed">{trimmedLine.substring(1).trim()}</li>
                );
            }
            return <p key={index} className="text-gray-700 mb-2 leading-relaxed">{line}</p>;
        });
    };

    return (
        <div id="resume-preview" className="bg-white text-gray-800 shadow-2xl h-full w-full rounded-lg overflow-hidden border border-gray-200">
            <div id="resume-preview-container" className="p-10 md:p-12">
                {/* Header with gradient background */}
                <header className="text-center mb-10 pb-8 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-2xl -m-4"></div>
                    <div className="relative">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-3">
                            {personalDetails.fullName || "Your Name"}
                        </h1>
                        <div className="flex justify-center items-center gap-x-3 gap-y-2 mt-4 text-sm text-gray-600 flex-wrap">
                            {personalDetails.email && (
                                <span className="flex items-center gap-1">
                                    <span className="text-blue-500">📧</span>
                                    {personalDetails.email}
                                </span>
                            )}
                            {personalDetails.phoneNumber && (
                                <span className="flex items-center gap-1">
                                    <span className="text-green-500">📱</span>
                                    {personalDetails.phoneNumber}
                                </span>
                            )}
                            {personalDetails.address && (
                                <span className="flex items-center gap-1">
                                    <span className="text-red-500">📍</span>
                                    {personalDetails.address}
                                </span>
                            )}
                            {personalDetails.linkedin && (
                                <span className="flex items-center gap-1">
                                    <span className="text-blue-600">💼</span>
                                    {personalDetails.linkedin}
                                </span>
                            )}
                            {personalDetails.website && (
                                <span className="flex items-center gap-1">
                                    <span className="text-purple-500">🌐</span>
                                    {personalDetails.website}
                                </span>
                            )}
                        </div>
                    </div>
                </header>

                <main className="space-y-8">
                    {/* Professional Summary */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                <span className="text-white text-sm font-bold">📝</span>
                            </div>
                            <h2 className="text-xl font-bold text-gray-800 tracking-wide">PROFESSIONAL SUMMARY</h2>
                            <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent"></div>
                        </div>
                        <div className="bg-gray-50/80 rounded-xl p-6 border-l-4 border-blue-500">
                            <p className="text-gray-700 leading-relaxed text-justify">
                                {summary || "A brief summary of your skills and experience will appear here."}
                            </p>
                        </div>
                    </section>

                    {/* Work Experience */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                                <span className="text-white text-sm font-bold">💼</span>
                            </div>
                            <h2 className="text-xl font-bold text-gray-800 tracking-wide">WORK EXPERIENCE</h2>
                            <div className="flex-1 h-px bg-gradient-to-r from-green-200 to-transparent"></div>
                        </div>
                        <div className="space-y-6">
                            {experience.map((exp, index) => (
                                <div key={exp.id} className="relative">
                                    {index > 0 && <div className="absolute -top-3 left-4 w-px h-3 bg-gray-300"></div>}
                                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-gray-800 mb-1">
                                                    {exp.jobTitle || "Job Title"}
                                                </h3>
                                                <p className="text-md font-semibold text-blue-600 mb-1">
                                                    {exp.company || "Company Name"}
                                                </p>
                                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                                    <span>📍</span>
                                                    {exp.location || "Location"}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                                    {exp.startDate} - {exp.endDate}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="border-t border-gray-100 pt-4">
                                            <ul className="space-y-2 list-disc list-outside ml-4">
                                                {renderDescription(exp.description || "Your responsibilities and achievements will be listed here.")}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Education */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                <span className="text-white text-sm font-bold">🎓</span>
                            </div>
                            <h2 className="text-xl font-bold text-gray-800 tracking-wide">EDUCATION</h2>
                            <div className="flex-1 h-px bg-gradient-to-r from-purple-200 to-transparent"></div>
                        </div>
                        <div className="space-y-4">
                            {education.map((edu) => (
                                <div key={edu.id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-gray-800 mb-1">
                                                {edu.degree || "Degree"}
                                            </h3>
                                            <p className="text-md font-semibold text-purple-600 mb-1">
                                                {edu.school || "School / University"}
                                            </p>
                                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                                <span>📍</span>
                                                {edu.location || "Location"}
                                            </p>
                                        </div>
                                        <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                                            {edu.graduationDate || "Graduation Date"}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Skills */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                                <span className="text-white text-sm font-bold">⚡</span>
                            </div>
                            <h2 className="text-xl font-bold text-gray-800 tracking-wide">SKILLS</h2>
                            <div className="flex-1 h-px bg-gradient-to-r from-orange-200 to-transparent"></div>
                        </div>
                        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100">
                            <div className="flex flex-wrap gap-3">
                                {skills ? skills.split(',').map((skill, index) => (
                                    skill.trim() && (
                                        <span 
                                            key={index} 
                                            className="bg-white text-gray-800 text-sm font-medium px-4 py-2 rounded-full shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200"
                                        >
                                            {skill.trim()}
                                        </span>
                                    )
                                )) : (
                                    <p className="text-gray-500 italic">Your skills will appear here.</p>
                                )}
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default ResumePreview;
