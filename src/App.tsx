// src/App.tsx

import { useState } from 'react';
import { FluentProvider, teamsLightTheme } from '@fluentui/react-components';
import WelcomeScreen from './screens/WelcomeScreen';
import PerformanceScreen from './screens/PerformanceScreen';
import './App.css'; // We'll keep the CSS file for now for global styles

function App() {
  // This state will control which screen is visible.
  // We start by showing the Welcome Screen (false).
  const [showDashboard, setShowDashboard] = useState(false);

  // This function will be passed to the Welcome Screen to allow it
  // to tell the App to switch to the dashboard.
  const handleEnterDashboard = () => {
    setShowDashboard(true);
  };

  return (
    // FluentProvider applies the Microsoft Fluent theme (like colors, fonts, etc.)
    // to all components inside it.
    <FluentProvider theme={teamsLightTheme}>
      {/* 
        This is a conditional render. 
        - If showDashboard is true, it renders PerformanceScreen.
        - If showDashboard is false, it renders WelcomeScreen.
      */}
      {showDashboard ? (
        <PerformanceScreen />
      ) : (
        <WelcomeScreen onEnter={handleEnterDashboard} />
      )}
    </FluentProvider>
  );
}

export default App;