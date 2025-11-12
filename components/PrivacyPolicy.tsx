import React from 'react';
import Header from './Header';
import Footer from './Footer';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          <p className="text-sm text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Information We Collect</h2>
              <p className="text-gray-700 mb-4">
                AI Resume Maker is designed with privacy in mind. We collect minimal information to provide our services:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Resume Data:</strong> The information you enter into our resume builder (personal details, work experience, education, skills) is processed locally in your browser and is not stored on our servers.</li>
                <li><strong>Usage Analytics:</strong> We may collect anonymous usage statistics to improve our service, such as which features are most popular.</li>
                <li><strong>Technical Data:</strong> Basic technical information like your browser type, device type, and IP address for security and performance purposes.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. How We Use Your Information</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>To provide and improve our AI-powered resume building services</li>
                <li>To process your resume data through Google's Gemini AI API for content enhancement</li>
                <li>To analyze usage patterns and improve user experience</li>
                <li>To ensure the security and proper functioning of our service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Data Storage and Security</h2>
              <p className="text-gray-700 mb-4">
                Your privacy is our priority:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Local Processing:</strong> Your resume data is processed locally in your browser whenever possible</li>
                <li><strong>AI Processing:</strong> When using AI features, your data is sent to Google's Gemini API for processing but is not stored by Google or us</li>
                <li><strong>No Permanent Storage:</strong> We do not permanently store your personal resume data on our servers</li>
                <li><strong>Secure Transmission:</strong> All data transmission is encrypted using industry-standard SSL/TLS protocols</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Third-Party Services</h2>
              <p className="text-gray-700 mb-4">
                We use the following third-party services:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Google Gemini AI:</strong> For AI-powered content enhancement and analysis</li>
                <li><strong>Analytics Services:</strong> For understanding how users interact with our service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Your Rights</h2>
              <p className="text-gray-700 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Access and control your data at any time</li>
                <li>Delete your data from your browser's local storage</li>
                <li>Opt out of analytics tracking</li>
                <li>Request information about how your data is processed</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Contact Us</h2>
              <p className="text-gray-700">
                If you have any questions about this Privacy Policy, please contact us at:
                <br />
                Email: support@freeresumebuilderai.hindustan.site
                <br />
                Website: https://freeresumebuilderai.hindustan.site
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Changes to This Policy</h2>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
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

export default PrivacyPolicy;