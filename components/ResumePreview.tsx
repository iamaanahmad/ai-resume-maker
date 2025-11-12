
import React from 'react';
import { ResumeData } from '../types';

interface ResumePreviewProps {
    resumeData: ResumeData;
    isDarkMode?: boolean;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ resumeData }) => {
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
        <div id="resume-preview" className="bg-white text-gray-800 shadow-2xl h-full w-full rounded-lg overflow-hidden border border-gray-200" role="article" aria-label="Resume preview">
            <div id="resume-preview-container" className="p-6 md:p-8 lg:p-10 max-w-4xl mx-auto">
                {/* Professional Header - ATS Friendly */}
                <header className="text-center mb-6 md:mb-8 pb-4 md:pb-6 border-b-2 border-gray-200">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4 tracking-wide">
                        {personalDetails.fullName || "Your Name"}
                    </h1>
                    <div className="flex justify-center items-center gap-x-3 md:gap-x-4 gap-y-2 text-xs md:text-sm text-gray-700 flex-wrap" role="list">
                        {personalDetails.email && (
                            <span>{personalDetails.email}</span>
                        )}
                        {personalDetails.phoneNumber && (
                            <span>•</span>
                        )}
                        {personalDetails.phoneNumber && (
                            <span>{personalDetails.phoneNumber}</span>
                        )}
                        {personalDetails.address && (
                            <span>•</span>
                        )}
                        {personalDetails.address && (
                            <span>{personalDetails.address}</span>
                        )}
                        {personalDetails.linkedin && (
                            <span>•</span>
                        )}
                        {personalDetails.linkedin && (
                            <span>{personalDetails.linkedin}</span>
                        )}
                        {personalDetails.website && (
                            <span>•</span>
                        )}
                        {personalDetails.website && (
                            <span>{personalDetails.website}</span>
                        )}
                    </div>
                </header>

                <main className="space-y-8 md:space-y-10">
                    {/* Professional Summary */}
                    {summary && (
                        <section className="mb-6 md:mb-8">
                            <h2 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 pb-2 border-b border-gray-300 uppercase tracking-wide">
                                Professional Summary
                            </h2>
                            <div className="ml-2 md:ml-4">
                                <p className="text-sm md:text-base text-gray-800 leading-relaxed text-justify">
                                    {summary}
                                </p>
                            </div>
                        </section>
                    )}

                    {/* Work Experience - Handle empty experience for freshers */}
                    {experience && experience.length > 0 && experience.some(exp => exp.jobTitle || exp.company) ? (
                        <section className="mb-6 md:mb-8">
                            <h2 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 pb-2 border-b border-gray-300 uppercase tracking-wide">
                                Professional Experience
                            </h2>
                            <div className="space-y-4 md:space-y-6 ml-2 md:ml-4">
                                {experience.map((exp, index) => (
                                    exp.jobTitle || exp.company ? (
                                        <article key={exp.id} className="mb-4 md:mb-6">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                                                <div className="flex-1">
                                                    <h3 className="text-sm md:text-base font-bold text-gray-900 mb-1">
                                                        {exp.jobTitle}
                                                    </h3>
                                                    <p className="text-sm md:text-base font-semibold text-gray-800 mb-1">
                                                        {exp.company}
                                                    </p>
                                                    {exp.location && (
                                                        <p className="text-xs md:text-sm text-gray-600">
                                                            {exp.location}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="text-left sm:text-right">
                                                    <div className="text-xs md:text-sm font-medium text-gray-700">
                                                        {exp.startDate} - {exp.endDate}
                                                    </div>
                                                </div>
                                            </div>
                                            {exp.description && (
                                                <div className="mt-2 md:mt-3">
                                                    <ul className="space-y-1 list-disc list-outside ml-4 md:ml-5 text-xs md:text-sm text-gray-800">
                                                        {renderDescription(exp.description)}
                                                    </ul>
                                                </div>
                                            )}
                                        </article>
                                    ) : null
                                ))}
                            </div>
                        </section>
                    ) : null}

                    {/* Education */}
                    {education && education.length > 0 && (
                        <section className="mb-6 md:mb-8">
                            <h2 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 pb-2 border-b border-gray-300 uppercase tracking-wide">
                                Education
                            </h2>
                            <div className="space-y-3 md:space-y-4 ml-2 md:ml-4">
                                {education.map((edu) => (
                                    <article key={edu.id} className="mb-3 md:mb-4">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                            <div className="flex-1">
                                                <h3 className="text-sm md:text-base font-bold text-gray-900 mb-1">
                                                    {edu.degree}
                                                </h3>
                                                <p className="text-sm md:text-base font-semibold text-gray-800 mb-1">
                                                    {edu.school}
                                                </p>
                                                {edu.location && (
                                                    <p className="text-xs md:text-sm text-gray-600">
                                                        {edu.location}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-left sm:text-right">
                                                <div className="text-xs md:text-sm font-medium text-gray-700">
                                                    {edu.graduationDate}
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Skills */}
                    {skills && skills.trim() && (
                        <section className="mb-6 md:mb-8">
                            <h2 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 pb-2 border-b border-gray-300 uppercase tracking-wide">
                                Skills
                            </h2>
                            <div className="ml-2 md:ml-4">
                                <div className="flex flex-wrap gap-2" role="list">
                                    {skills.split(',').map((skill, index) => (
                                        skill.trim() && (
                                            <span 
                                                key={index} 
                                                className="text-gray-800 text-xs md:text-sm font-medium px-2 md:px-3 py-1 bg-gray-100 rounded border"
                                                role="listitem"
                                            >
                                                {skill.trim()}
                                            </span>
                                        )
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ResumePreview;
