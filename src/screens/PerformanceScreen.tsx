// src/screens/performance/PerformanceScreen.tsx

import { useState } from 'react';
import { Tab, TabList, type SelectTabData, type SelectTabEvent } from '@fluentui/react-components';

// Import the main layout components and its corresponding stylesheet
import Header from '../components/Header';
import './PerformanceScreen.css';

// Import the three view components that will be shown in the tabs
import MonthlySummaryView from './MonthlySummaryView';
import ActionLogView from './ActionLogView';
import UnderperformingView from './UnderperformingView';

// Define a TypeScript type for our possible views to prevent typos and errors
type View = 'underperforming' | 'summary' | 'actionlog';

export default function PerformanceScreen() {
  // State to keep track of the currently selected tab. Defaults to 'underperforming'.
  const [selectedView, setSelectedView] = useState<View>('underperforming');

  // This function is called when a user clicks on a different tab
  const onTabSelect = (_event: SelectTabEvent, data: SelectTabData) => {
    // We update the state to the value of the newly selected tab
    setSelectedView(data.value as View);
  };

  /**
   * A helper function to conditionally render the correct view component
   * based on the current state. This keeps the main return statement clean.
   */
  const renderContent = () => {
    switch (selectedView) {
      case 'underperforming':
        return <UnderperformingView />;
      case 'summary':
        return <MonthlySummaryView />;
      case 'actionlog':
        return <ActionLogView />;
      default:
        // It's good practice to return null as a fallback
        return null;
    }
  };

  // In a real application, you would fetch this user data from an API call
  const currentUser = {
    name: "Pablo Aguirre",
    notifications: 3,
  };

  return (
    // This is the root container that uses our Flexbox layout from the CSS file.
    // It is designed to fill the full height of its parent.
    <div className="performance-screen-container">
      
      {/* The Header component is always visible at the top. */}
      {/* We pass it dynamic data to make it reusable. */}
      <Header 
        userName={currentUser.name} 
        notificationCount={currentUser.notifications} 
      />
      
      {/* The <main> content area will grow and scroll independently from the header. */}
      <main className="performance-screen-content">
        
        {/* Screen Title and Description */}
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ margin: '0 0 4px 0' }}>Performance Review</h2>
          <p style={{ color: '#606060', margin: 0, fontSize: '14px' }}>
            Monitor and manage underperforming employees across all clients and categories
          </p>
        </div>

        {/* The Tab Navigation Component from Fluent UI */}
        <TabList selectedValue={selectedView} onTabSelect={onTabSelect}>
          <Tab value="underperforming">Underperforming Review</Tab>
          <Tab value="summary">Monthly Summary</Tab>
          <Tab value="actionlog">Action Log</Tab>
        </TabList>

        {/* The area where the selected view will be rendered */}
        <div style={{ marginTop: '20px' }}>
          {renderContent()}
        </div>

      </main>
    </div>
  );
}