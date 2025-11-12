import React from 'react';

const DonateSection: React.FC = () => {
  return (
    <section className="relative z-0 py-16 md:py-20 bg-gradient-to-br from-red-50 via-pink-50 to-purple-50" aria-label="Support and donate section">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Heart Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full mb-6 md:mb-8 shadow-lg" aria-hidden="true">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        </div>

        {/* Main Message */}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
          Love Our Free Resume Builder?
        </h2>
        
        <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
          AI Resume Maker is completely free and always will be. If our tool helped you land your dream job or made your job search easier, consider supporting us with a small donation. Every contribution helps us keep the service free for everyone and continue improving our AI features.
        </p>

        {/* Benefits List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4" aria-hidden="true">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Keep It Free</h3>
            <p className="text-gray-600 text-sm">Your donations help us maintain free access for job seekers worldwide</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Better AI Features</h3>
            <p className="text-gray-600 text-sm">Fund advanced AI capabilities and new resume enhancement tools</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Help Others</h3>
            <p className="text-gray-600 text-sm">Support job seekers around the world in their career journey</p>
          </div>
        </div>

        {/* Donation Amounts */}
        <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Support Level</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <a 
              href="https://www.paypal.me/iamaanahmad/5" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-6 border-2 border-gray-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-center group hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="text-2xl font-bold text-gray-900 group-hover:text-blue-600">$5</div>
              <div className="text-sm text-gray-600">Coffee ☕</div>
            </a>
            <a 
              href="https://www.paypal.me/iamaanahmad/10" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-6 border-2 border-gray-200 rounded-2xl hover:border-green-500 hover:bg-green-50 transition-all duration-200 text-center group hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="text-2xl font-bold text-gray-900 group-hover:text-green-600">$10</div>
              <div className="text-sm text-gray-600">Lunch 🍕</div>
            </a>
            <a 
              href="https://www.paypal.me/iamaanahmad/25" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-6 border-2 border-gray-200 rounded-2xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 text-center group hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="text-2xl font-bold text-gray-900 group-hover:text-purple-600">$25</div>
              <div className="text-sm text-gray-600">Generous 🎉</div>
            </a>
            <a 
              href="https://www.paypal.me/iamaanahmad/50" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-6 border-2 border-gray-200 rounded-2xl hover:border-yellow-500 hover:bg-yellow-50 transition-all duration-200 text-center group hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="text-2xl font-bold text-gray-900 group-hover:text-yellow-600">$50</div>
              <div className="text-sm text-gray-600">Amazing 🌟</div>
            </a>
          </div>
          
          {/* Custom Amount */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">Or choose your own amount:</p>
            <a 
              href="https://www.paypal.me/iamaanahmad" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white text-lg font-semibold rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              Donate via PayPal
            </a>
          </div>
        </div>

        {/* Thank You Message */}
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-6 border border-blue-200">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You! 🙏</h3>
          <p className="text-gray-700">
            Every donation, no matter the size, makes a huge difference. Your support helps us continue providing this free tool to job seekers worldwide and keeps us motivated to build even better features.
          </p>
        </div>

        {/* Alternative Support */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Can't donate? You can still help us!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              type="button"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'Free AI Resume Builder - Create Professional Resumes',
                    text: 'Create ATS-friendly resumes with AI assistance! Free resume builder with smart optimization.',
                    url: window.location.href
                  }).catch(console.error);
                } else {
                  const shareText = `Check out this amazing free AI resume builder! Create professional, ATS-friendly resumes in minutes: ${window.location.href}`;
                  navigator.clipboard.writeText(shareText).then(() => {
                    alert('Share link copied to clipboard!');
                  }).catch(() => {
                    alert('Unable to copy to clipboard. Please share manually.');
                  });
                }
              }}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Share with friends"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
              </svg>
              Share with Friends
            </button>
            <a 
              href="https://www.linkedin.com/in/iamaanshaikh/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"/>
              </svg>
              Connect with Developer
            </a>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            Connect with the developer on LinkedIn or share this tool with friends who need professional resumes!
          </p>
        </div>
      </div>
    </section>
  );
};

export default DonateSection;