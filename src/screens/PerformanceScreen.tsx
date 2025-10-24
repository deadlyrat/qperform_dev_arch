// src/screens/performance/PerformanceScreen.tsx

import { useState } from 'react';
import { Tab, TabList, SelectTabData, SelectTabEvent } from '@fluentui/react-components';
import Header from '../components/Header';
import MonthlySummaryView from './MonthlySummaryView';
import ActionLogView from './ActionLogView';
import UnderperformingView from './UnderperformingView';


// Define the possible views/tabs
type View = 'underperforming' | 'summary' | 'actionlog';

export default function PerformanceScreen() {
  // State to keep track of the currently selected tab
  const [selectedView, setSelectedView] = useState<View>('underperforming');

  const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
    setSelectedView(data.value as View);
  };

  // A simple function to render the correct content based on the selected tab
      const renderContent = () => {
        switch (selectedView) {
          case 'underperforming':
            return <UnderperformingView />; // <-- REPLACE THE DIV HERE
          case 'summary':
            return <MonthlySummaryView />;
          case 'actionlog':
            return <ActionLogView />;
          default:
            return null;
        }
      };

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Header />
      <main style={{ padding: '24px' }}>
        <h2>Performance Review</h2>
        <p style={{ color: '#606060', marginTop: '-8px' }}>
          Monitor and manage underperforming employees across all clients and categories
        </p>

        <TabList selectedValue={selectedView} onTabSelect={onTabSelect}>
          <Tab value="underperforming">Underperforming Review</Tab>
          <Tab value="summary">Monthly Summary</Tab>
          <Tab value="actionlog">Action Log</Tab>
        </TabList>

        <div style={{ marginTop: '20px' }}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}