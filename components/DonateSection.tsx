import React from 'react';

const DonateSection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-red-50 via-pink-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Heart Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full mb-8 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        </div>

        {/* Main Message */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          Love Our Free Resume Builder?
        </h2>
        
        <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
          AI Resume Maker is completely free and always will be. If our tool helped you land your dream job or made your job search easier, consider supporting us with a small donation. Every contribution helps us keep the service free for everyone and continue improving our AI features.
        </p>

        {/* Benefits List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
              Share with Friends
            </button>
            <button className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium">
              Leave a Review
            </button>
            <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium">
              Follow Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonateSection;