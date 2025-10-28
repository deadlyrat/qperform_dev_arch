// src/App.tsx

import { useState } from 'react';
import { FluentProvider, teamsLightTheme } from '@fluentui/react-components';
import WelcomeScreen from './screens/WelcomeScreen';
import PerformanceScreen from './screens/PerformanceScreen';
import OrientationLock from './components/ui/OrientationLock'; // Assuming you have this
import './App.css'; 

function App() {
  const [showDashboard, setShowDashboard] = useState(false);

  const handleEnterDashboard = () => {
    setShowDashboard(true);
  };

  return (
    // This container now uses our full-screen styles from App.css
    <div className="app-container">
      <OrientationLock />

      <FluentProvider theme={teamsLightTheme}>
        {showDashboard ? (
          <PerformanceScreen />
        ) : (
          <WelcomeScreen onEnter={handleEnterDashboard} />
        )}
      </FluentProvider>
    </div>
  );
}

export default App;