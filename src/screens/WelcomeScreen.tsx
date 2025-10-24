// src/screens/welcome/WelcomeScreen.tsx

import { Button } from '@fluentui/react-components';
import { ArrowRight16Filled } from '@fluentui/react-icons';
import './WelcomeScreen.css'; // Import the stylesheet

// This defines the props (properties) that our component expects.
// It needs one function called 'onEnter' that takes no arguments and returns nothing.
type WelcomeScreenProps = {
  onEnter: () => void;
};

// We use the 'logo.svg' from the public folder.
// You can replace this with your actual logo file.
const logoUrl = '/qperform-logo.svg'; // Make sure you have a logo file here in your `public` folder

export default function WelcomeScreen({ onEnter }: WelcomeScreenProps) {
  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <img src={logoUrl} alt="QPerform Logo" className="welcome-logo" />
        
        <h1 className="welcome-title">QPerform</h1>
        <p className="welcome-subtitle">Performance Management System</p>
        
        <span className="welcome-version">Version 1.0.0</span>

        <p className="welcome-description">
          Monitor employee performance, track weekly scores, and take
          action on underperforming team members with real-time
          insights and analytics.
        </p>

        <Button 
          appearance="primary" 
          icon={<ArrowRight16Filled />} 
          iconPosition="after" 
          onClick={onEnter} // When this button is clicked, it calls the function passed down from App.tsx
          size="large"
        >
          Enter Dashboard
        </Button>
      </div>

      <p className="welcome-footer">Powered by Performance Analytics</p>
    </div>
  );
}