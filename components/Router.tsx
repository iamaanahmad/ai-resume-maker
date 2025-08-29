import React from 'react';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';

interface RouterProps {
  children: React.ReactNode;
}

const Router: React.FC<RouterProps> = ({ children }) => {
  const path = window.location.pathname;

  if (path === '/privacy') {
    return <PrivacyPolicy />;
  }

  if (path === '/terms') {
    return <TermsOfService />;
  }

  return <>{children}</>;
};

export default Router;