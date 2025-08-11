import React from 'react';

const TargetIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m0 13.5v2.25M4.5 12H2.25m19.5 0h-2.25M5.625 5.625l-1.5 1.5m15.375 12.75-1.5-1.5M18.375 5.625l-1.5 1.5m-12.75 12.75 1.5-1.5" />
  </svg>
);

export default TargetIcon;
