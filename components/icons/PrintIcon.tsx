
import React from 'react';

const PrintIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6 3.189m0 10.64L6 3.189m0 0h12l-1.006 10.64M18 7.5h.008v.008H18V7.5Zm-12 0h.008v.008H6V7.5Z" />
  </svg>
);

export default PrintIcon;
