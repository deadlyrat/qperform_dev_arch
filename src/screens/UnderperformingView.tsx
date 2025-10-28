// src/screens/performance/underperforming/UnderperformingView.tsx

import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Avatar,
  Button,
  Tab,
  TabList,
  type SelectTabData,
  type SelectTabEvent,
  Spinner,
  Dropdown,
  Option,
} from '@fluentui/react-components';
import { Filter24Regular, CalendarMonth24Regular, Comment24Regular } from '@fluentui/react-icons';
import './UnderperformingView.css';
import TakeActionDialog from './TakeActionDialog';
// CORRECTED IMPORT PATHS
import FilterPopover from '../components/ui/FilterPopover';
import RecommendationsDialog from './RecommendationsDialog'; 
import { useUserRole } from '../services/useUserRole'; 

import {
  fetchPerformanceData,
  groupByWeek,
  fetchFilters,
  calculateAgentMonthlyResults,
  generateRecommendation,
  fetchActionLog, 
  type PerformanceData,
  type FilterOptions,
  type PerformanceFilters,
  type ActionLog, 
  type AgentMonthlyResults, 
  type Recommendation,
} from '../services/api';

// Map structure: AgentID/Email -> WeekRange -> PerformanceData[]
type GroupedPerformance = Map<string, Map<string, PerformanceData[]>>;

// --- Define state for the Recommendations Dialog ---
interface DialogState {
    isOpen: boolean;
    agentName: string;
    monthlyResults: AgentMonthlyResults;
    recommendation: Recommendation;
}

// --- MOCK clientData for the client view (to be replaced later) ---
const clientData = [
  { id: 'c1', name: 'Client A', category: 'Category 1', w1_aftes: 17, w1_actions: 2, w1_added: 1, w2_aftes: 11, w2_actions: 4, w2_added: 0, w3_aftes: 15, w3_actions: 3, w3_added: 2, w4_aftes: 19, w4_actions: 3, w4_added: 2, w5_aftes: 12, w5_actions: 5, w5_added: 1 },
  { id: 'c2', name: 'Client B', category: 'Category 2', w1_aftes: 16, w1_actions: 4, w1_added: 0, w2_aftes: 13, w2_actions: 3, w2_added: 0, w3_aftes: 14, w3_actions: 3, w3_added: 1, w4_aftes: 14, w4_actions: 4, w4_added: 0, w5_aftes: 14, w5_actions: 1, w5_added: 2 },
];

export default function UnderperformingView() {
  const [viewMode, setViewMode] = useState<'employee' | 'client'>('employee');
  const [isTakeActionOpen, setIsTakeActionOpen] = useState(false);
    
  // --- MISSING STATE DECLARATIONS ADDED HERE ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rawData, setRawData] = useState<PerformanceData[]>([]);
  const [groupedData, setGroupedData] = useState<GroupedPerformance>(new Map());
  const [actionLogData, setActionLogData] = useState<ActionLog[]>([]);
  const [filters, setFilters] = useState<PerformanceFilters>({}); // <-- CRITICAL MISSING STATE
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
      categories: [], clients: [], tasks: [], months: [], years: [],
  });

  const [recommendationDialog, setRecommendationDialog] = useState<DialogState>({
    isOpen: false,
    agentName: '',
    monthlyResults: { compliantWeeks: 0, totalWeeks: 0, actionCount: 0 },
    recommendation: { action: '', isCritical: false, notes: '' },
  });
  
  const { canTakeAction } = useUserRole();
  const [refreshKey, setRefreshKey] = useState(0); 
  
  // Helper to construct the employee list for the Take Action Dialog
  const employeeList = Array.from(groupedData.keys()).map(key => {
      const firstWeekData = Array.from(groupedData.get(key)!.values())[0];
      const name = firstWeekData[0].agent_email.split('@')[0] || 'Unknown Agent';
      return { id: key, name: name };
  });

  // Combined data fetching function (Requires 'currentFilters' argument)
  const loadData = async (currentFilters: PerformanceFilters) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch both data sets concurrently
      const [performanceData, logData] = await Promise.all([
          fetchPerformanceData(currentFilters),
          fetchActionLog() // Fetch the log to count actions taken
      ]);
      
      const grouped = groupByWeek(performanceData);

      setRawData(performanceData);
      setGroupedData(grouped);
      setActionLogData(logData);
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError("Failed to load performance data. Check API server and network.");
    } finally {
      setLoading(false);
    }
  };

  // Handler for successful action submission
  const handleActionSuccess = () => {
      // Trigger a refresh of the views that depend on the Action Log
      setRefreshKey(prev => prev + 1);
  };
  
  // EFFECT 1: Load Filter Options on mount (corrected to initialize filters)
  useEffect(() => {
    const loadFiltersData = async () => {
        try {
            const options = await fetchFilters();
            options.years = options.years.sort((a, b) => b - a);
            setFilterOptions(options);
            
            // Initialize filters to ensure data load on mount
            if (options.months.length > 0 && options.years.length > 0) {
                setFilters({ 
                    month: options.months[0], 
                    year: String(options.years[0]) 
                });
            }
        } catch (e) {
            console.error("Failed to load filter options", e);
        }
    };
    loadFiltersData();
  }, []);

  // EFFECT 2: Load Data whenever filters OR refreshKey changes
  useEffect(() => {
    // Check if filters is defined and has necessary values before calling loadData
    if (filters && filters.month && filters.year) {
        loadData(filters); 
    }
  }, [filters, refreshKey]); 

  // Handler for Month/Year dropdowns
  const handleTimeFilterChange = (filterName: 'month' | 'year') => 
    (_e: React.SyntheticEvent<HTMLElement, Event>, data: { optionValue: string | undefined }) => {
      setFilters(prev => ({
        ...prev,
        [filterName]: data.optionValue === '' ? undefined : data.optionValue,
      }));
    };


  // Function to show the Recommendations Dialog
  const handleShowRecommendation = (agentKey: string, agentName: string, weeksMap: Map<string, PerformanceData[]>) => {
    // 1. Calculate Monthly Results
    const monthlyResults = calculateAgentMonthlyResults(weeksMap, agentKey, actionLogData);
    
    // 2. Generate Recommendation
    const recommendation = generateRecommendation(monthlyResults);

    // 3. Open Dialog
    setRecommendationDialog({
        isOpen: true,
        agentName,
        monthlyResults,
        recommendation,
    });
  };

  // Helper function to determine the status/flag color for a week
  const getFlagColor = (weekData: PerformanceData[]): string => {
    // Priority: Critical > Low > Normal > Good/Great
    if (weekData.some(d => d.flag_qa === 'Critical' || d.flag_prod === 'Critical')) {
        return 'red';
    }
    if (weekData.some(d => d.flag_qa === 'Low' || d.flag_prod === 'Low')) {
        return 'orange';
    }
    if (weekData.some(d => d.flag_qa === 'Normal' || d.flag_prod === 'Normal')) {
        return 'yellowgreen';
    }
    return 'green';
  };
  
  // Helper function to render a single week's data
  const renderWeekCell = (weekData: PerformanceData[] | undefined) => {
    if (!weekData || weekData.length === 0) {
      return (
        <div className="grid-card week-cell-card">
            <span className="weekly-score" style={{color: 'grey'}}>N/A</span>
            <span className="action-taken-label">Data Missing</span>
        </div>
      );
    }
    
    // Calculate average KPI for display
    const avgKpi = (weekData.reduce((sum, d) => sum + d.kpi_qa, 0) / weekData.length) * 100;
    const flagColor = getFlagColor(weekData);

    // TODO: This should be derived from the ActionLog API data
    const actionTaken = 'No'; 
    
    return (
      <div className="grid-card week-cell-card">
        <span className="weekly-score" style={{ color: flagColor }}>{avgKpi.toFixed(1)}%</span>
        <span className="action-taken-label">Action Taken</span>
        <span 
            className="action-taken-value" 
            style={{ color: actionTaken === 'Yes' ? 'green' : 'red' }}
        >
            {actionTaken}
        </span>
      </div>
    );
  };
  
  // Function to render the Employee grid with live data
  const renderEmployeeGrid = () => {
    if (groupedData.size === 0 && !loading) {
        return <div style={{padding: '20px', textAlign: 'center'}}>No underperforming data found for the selected filters.</div>;
    }

    const allWeeks = Array.from(new Set(rawData.map(d => d.week_range))).sort(); 
    const headers = ["Employee List", ...allWeeks, "Monthly Results"];
    
    const gridColumnsStyle = { gridTemplateColumns: `1.5fr repeat(${allWeeks.length}, 1fr) 1fr` };

    return (
      <div className="custom-grid-container" style={gridColumnsStyle}>
        {/* Render Headers */}
        <div className="grid-header-row">
          {headers.map(header => <div key={header} className="grid-header-cell">{header}</div>)}
        </div>

        {/* Render Data Rows */}
        {Array.from(groupedData.entries()).map(([agentKey, weeksMap]) => {
          const firstRecord = Array.from(weeksMap.values())[0][0];
          const employeeName = firstRecord.agent_email.split('@')[0];
          
          // CALCULATE REAL MONTHLY METRICS
          const monthlyResults = calculateAgentMonthlyResults(weeksMap, agentKey, actionLogData);
          const scoreText = `${monthlyResults.compliantWeeks} / ${monthlyResults.totalWeeks}`;
          const actionText = monthlyResults.actionCount;

          return (
            <div key={agentKey} className="grid-body-row">
              <div className="grid-card employee-cell-card">
                <Avatar name={employeeName} color="colorful" />
                <span>{employeeName}</span>
              </div>
              
              {/* Render Week Cells dynamically */}
              {allWeeks.map(week => (
                <div key={`${agentKey}-${week}`} className="grid-cell">
                    {renderWeekCell(weeksMap.get(week))} 
                </div>
              ))}
              
              {/* Monthly Results Cell (UPDATED) */}
              <div className="grid-card monthly-results-card">
                <div className="result-item">
                    <span>Compliant Weeks: {scoreText}</span>
                    <span>Actions Taken: {actionText}</span>
                </div>
                {/* Button to show the recommendation dialog */}
                <Comment24Regular 
                    onClick={() => handleShowRecommendation(agentKey, employeeName, weeksMap)}
                    style={{ cursor: 'pointer', color: '#0078d4' }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  // Simplified Mock Render for Client View
  const renderClientGrid = () => {
      const headers = ["Client List", "Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];
      return (
        <div className="custom-grid-container" style={{ gridTemplateColumns: `repeat(${headers.length}, 1fr)` }}>
          <div className="grid-header-row">
            {headers.map(header => <div key={header} className="grid-header-cell">{header}</div>)}
          </div>
          {clientData.map(item => (
            <div key={item.id} className="grid-body-row">
              <div className="grid-card">
                  <strong>{item.name}</strong>
                  <span>{item.category}</span>
              </div>
              <div className="grid-card"><div>AFTEs: {item.w1_aftes}</div><div>Actions: {item.w1_actions}</div><div>Agents Added: {item.w1_added}</div></div>
              <div className="grid-card"><div>AFTEs: {item.w2_aftes}</div><div>Actions: {item.w2_actions}</div><div>Agents Added: {item.w2_added}</div></div>
              <div className="grid-card">AFTEs, Actions, Added...</div>
              <div className="grid-card">AFTEs, Actions, Added...</div>
              <div className="grid-card">AFTEs, Actions, Added...</div>
            </div>
          ))}
        </div>
      );
  };

  const onViewModeSelect = (_event: SelectTabEvent, data: SelectTabData) => {
    setViewMode(data.value as 'employee' | 'client');
  };
  
  // --- Loading/Error Handlers ---
  if (loading && groupedData.size === 0) {
    return <Spinner label="Loading performance data..." />;
  }
  
  if (error && groupedData.size === 0) {
    return <div style={{ color: 'red', padding: '20px' }}>{error}</div>;
  }

  // --- Main Render ---
  return (
    <div className="underperforming-container">
      {/* Action Dialog */}
      <TakeActionDialog 
        isOpen={isTakeActionOpen} 
        onDismiss={() => setIsTakeActionOpen(false)}
        employees={employeeList}
        onActionSuccess={handleActionSuccess} 
      />
      
      {/* Recommendations Dialog (NEW) */}
      <RecommendationsDialog
        isOpen={recommendationDialog.isOpen}
        onDismiss={() => setRecommendationDialog(prev => ({ ...prev, isOpen: false }))}
        agentName={recommendationDialog.agentName}
        monthlyResults={recommendationDialog.monthlyResults}
        recommendation={recommendationDialog.recommendation}
      />
      
      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="left-filters">
            <FilterPopover 
                filterOptions={filterOptions}
                currentFilters={filters}
                setFilters={setFilters}
            />
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <CalendarMonth24Regular style={{ color: '#0078d4' }} />
                <Dropdown
                    placeholder="Month"
                    selectedOptions={filters.month ? [filters.month] : []}
                    onOptionSelect={handleTimeFilterChange('month')}
                    style={{ minWidth: '120px' }}
                >
                    {filterOptions.months.map(month => (
                        <Option key={month} value={month}>{month}</Option>
                    ))}
                </Dropdown>
                <Dropdown
                    placeholder="Year"
                    selectedOptions={filters.year ? [filters.year] : []}
                    onOptionSelect={handleTimeFilterChange('year')}
                    style={{ minWidth: '80px' }}
                >
                    {filterOptions.years.map(year => (
                        <Option key={year} value={String(year)}>{year}</Option>
                    ))}
                </Dropdown>
            </div>
        </div>
        
        <div className="right-filters">
            {canTakeAction ? (
                <Button appearance="primary" onClick={() => setIsTakeActionOpen(true)}>Nav: Take Action</Button>
            ) : (
                 <Button appearance="primary" disabled title="Only authorized leadership (Directors, AVPs) can take action.">Nav: Take Action</Button>
            )}
        </div>
      </div>

      <div className="category-toggle">
        <TabList selectedValue={viewMode} onTabSelect={onViewModeSelect}>
            <Tab value="employee">Employee Category</Tab>
            <Tab value="client">Client Category</Tab>
        </TabList>
      </div>
      
      {/* Conditionally render the correct grid based on the viewMode state */}
      {viewMode === 'employee' ? renderEmployeeGrid() : renderClientGrid()}
      
      {/* Show loading spinner while filtering/re-fetching */}
      {loading && groupedData.size > 0 && 
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <Spinner size="small" label="Updating data..." />
        </div>
      }
    </div>
  );
}