
import React from 'react';

const ShareIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Zm0 0v4.5m0-4.5h4.5m-4.5 0a2.25 2.25 0 0 1-2.25-2.25V6.375m11.25 6.375a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Zm0 0v4.5m0-4.5h-4.5m4.5 0a2.25 2.25 0 0 0 2.25-2.25V6.375m-11.25 0a2.25 2.25 0 0 1 2.25-2.25h6.75a2.25 2.25 0 0 1 2.25 2.25" />
  </svg>
);

export default ShareIcon;
