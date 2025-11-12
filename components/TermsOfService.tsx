import React from 'react';
import Header from './Header';
import Footer from './Footer';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          <p className="text-sm text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using AI Resume Maker ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Description of Service</h2>
              <p className="text-gray-700 mb-4">
                AI Resume Maker is a free, web-based application that helps users create professional resumes using artificial intelligence. Our service includes:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>AI-powered resume content enhancement</li>
                <li>Professional resume templates</li>
                <li>PDF and DOCX export capabilities</li>
                <li>Job matching analysis</li>
                <li>Cover letter generation</li>
                <li>Interview preparation tools</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. User Responsibilities</h2>
              <p className="text-gray-700 mb-4">
                As a user of our service, you agree to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Provide accurate and truthful information in your resume</li>
                <li>Use the service for lawful purposes only</li>
                <li>Not attempt to reverse engineer or compromise the security of our service</li>
                <li>Not use the service to create misleading or fraudulent resumes</li>
                <li>Respect intellectual property rights</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Intellectual Property</h2>
              <p className="text-gray-700 mb-4">
                The Service and its original content, features, and functionality are and will remain the exclusive property of AI Resume Maker and its licensors. The service is protected by copyright, trademark, and other laws.
              </p>
              <p className="text-gray-700 mb-4">
                You retain ownership of the content you create using our service, including your resume data and generated documents.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. AI-Generated Content</h2>
              <p className="text-gray-700 mb-4">
                Our service uses artificial intelligence to enhance and generate content. Please note:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>AI-generated content is provided as suggestions and should be reviewed for accuracy</li>
                <li>You are responsible for verifying and validating all content in your final resume</li>
                <li>We do not guarantee the accuracy or appropriateness of AI-generated content</li>
                <li>AI suggestions are based on general best practices and may not be suitable for all situations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Disclaimer of Warranties</h2>
              <p className="text-gray-700 mb-4">
                The information on this service is provided on an "as is" basis. To the fullest extent permitted by law, we exclude:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>All representations, warranties, and conditions relating to this service</li>
                <li>All liability for damages arising out of or in connection with your use of this service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                AI Resume Maker will not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Free Service</h2>
              <p className="text-gray-700 mb-4">
                AI Resume Maker is provided free of charge. We reserve the right to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Modify or discontinue the service at any time</li>
                <li>Implement usage limits or restrictions</li>
                <li>Introduce premium features in the future</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Privacy</h2>
              <p className="text-gray-700 mb-4">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. Contact Information</h2>
              <p className="text-gray-700">
                If you have any questions about these Terms of Service, please contact us at:
                <br />
                Email: support@freeresumebuilderai.hindustan.site
                <br />
                Website: https://freeresumebuilderai.hindustan.site
              </p>
            </section>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfService;