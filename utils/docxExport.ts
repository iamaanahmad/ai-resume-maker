import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { ResumeData } from '../types';

export const exportToDocx = async (resumeData: ResumeData) => {
    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                // Header with name
                new Paragraph({
                    children: [
                        new TextRun({
                            text: resumeData.personalDetails.fullName,
                            bold: true,
                            size: 32,
                        }),
                    ],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 200 },
                }),

                // Contact information
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `${resumeData.personalDetails.email} | ${resumeData.personalDetails.phoneNumber}`,
                        }),
                    ],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 100 },
                }),

                new Paragraph({
                    children: [
                        new TextRun({
                            text: `${resumeData.personalDetails.address}`,
                        }),
                    ],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 100 },
                }),

                new Paragraph({
                    children: [
                        new TextRun({
                            text: `${resumeData.personalDetails.linkedin} | ${resumeData.personalDetails.website}`,
                        }),
                    ],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 300 },
                }),

                // Professional Summary
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "PROFESSIONAL SUMMARY",
                            bold: true,
                            size: 24,
                        }),
                    ],
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 100 },
                }),

                new Paragraph({
                    children: [
                        new TextRun({
                            text: resumeData.summary,
                        }),
                    ],
                    spacing: { after: 300 },
                }),

                // Work Experience - Only show if there's actual experience
                ...(resumeData.experience && resumeData.experience.length > 0 && resumeData.experience.some(exp => exp.jobTitle || exp.company) ? [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "PROFESSIONAL EXPERIENCE",
                                bold: true,
                                size: 24,
                            }),
                        ],
                        heading: HeadingLevel.HEADING_2,
                        spacing: { before: 200, after: 100 },
                    }),

                    ...resumeData.experience.flatMap(exp => 
                        (exp.jobTitle || exp.company) ? [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: exp.jobTitle,
                                        bold: true,
                                        size: 22,
                                    }),
                                    new TextRun({
                                        text: ` | ${exp.company}`,
                                        size: 22,
                                    }),
                                ],
                                spacing: { before: 100, after: 50 },
                            }),
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: `${exp.location} | ${exp.startDate} - ${exp.endDate}`,
                                        italics: true,
                                    }),
                                ],
                                spacing: { after: 100 },
                            }),
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: exp.description,
                                    }),
                                ],
                                spacing: { after: 200 },
                            }),
                        ] : []
                    ),
                ] : []),

                // Education
                ...(resumeData.education && resumeData.education.length > 0 ? [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "EDUCATION",
                                bold: true,
                                size: 24,
                            }),
                        ],
                        heading: HeadingLevel.HEADING_2,
                        spacing: { before: 200, after: 100 },
                    }),

                    ...resumeData.education.flatMap(edu => [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: edu.degree,
                                    bold: true,
                                    size: 22,
                                }),
                                new TextRun({
                                    text: ` | ${edu.school}`,
                                    size: 22,
                                }),
                            ],
                            spacing: { before: 100, after: 50 },
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: `${edu.location} | ${edu.graduationDate}`,
                                    italics: true,
                                }),
                            ],
                            spacing: { after: 200 },
                        }),
                    ]),
                ] : []),

                // Skills
                ...(resumeData.skills && resumeData.skills.trim() ? [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "SKILLS",
                                bold: true,
                                size: 24,
                            }),
                        ],
                        heading: HeadingLevel.HEADING_2,
                        spacing: { before: 200, after: 100 },
                    }),

                    new Paragraph({
                        children: [
                            new TextRun({
                                text: resumeData.skills,
                            }),
                        ],
                        spacing: { after: 200 },
                    }),
                ] : []),
            ],
        }],
    });

    const blob = await Packer.toBlob(doc);
    const fileName = `${resumeData.personalDetails.fullName.replace(/ /g, '_') || 'resume'}.docx`;
    saveAs(blob, fileName);
};