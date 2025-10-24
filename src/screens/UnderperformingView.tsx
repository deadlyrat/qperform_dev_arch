// src/screens/performance/underperforming/UnderperformingView.tsx

import {
  Avatar,
  Button,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  TableColumnDefinition,
  createTableColumn,
  Tab,
  TabList
} from '@fluentui/react-components';
import { Filter24Regular, CalendarMonth24Regular, Comment24Regular } from '@fluentui/react-icons';
import './UnderperformingView.css';

// --- Mock Data ---
const employeeData = [
    { id: '1', name: 'Agent A', week1_score: '98%', week1_action: 'Yes', week2_score: '98%', week2_action: 'Yes', week3_score: '98%', week3_action: 'Yes', week4_score: '98%', week4_action: 'Yes', week5_score: '98%', week5_action: 'Yes', monthly_score: '3/5', monthly_actions: '3/3' },
    { id: '2', name: 'Agent B', week1_score: '99%', week1_action: 'Yes', week2_score: '99%', week2_action: 'Yes', week3_score: '99%', week3_action: 'Yes', week4_score: '99%', week4_action: 'Yes', week5_score: '99%', week5_action: 'Yes', monthly_score: '3/5', monthly_actions: '3/3' },
    { id: '3', name: 'Agent C', week1_score: '99%', week1_action: 'Yes', week2_score: '99%', week2_action: 'Yes', week3_score: '99%', week3_action: 'Yes', week4_score: '99%', week4_action: 'Yes', week5_score: '99%', week5_action: 'Yes', monthly_score: '3/5', monthly_actions: '3/3' },
    { id: '4', name: 'Agent D', week1_score: '99%', week1_action: 'Yes', week2_score: '99%', week2_action: 'Yes', week3_score: '99%', week3_action: 'Yes', week4_score: '99%', week4_action: 'Yes', week5_score: '99%', week5_action: 'Yes', monthly_score: '3/5', monthly_actions: '3/3' },
];

type EmployeeData = typeof employeeData[0];

// --- Column Definitions for DataGrid ---
const columns: TableColumnDefinition<EmployeeData>[] = [
  createTableColumn<EmployeeData>({
    columnId: 'employeeList',
    renderHeaderCell: () => 'Employee List',
    renderCell: (item) => (
      <div className="employee-cell">
        <Avatar name={item.name} size={24} />
        <span>{item.name}</span>
      </div>
    ),
  }),
  createTableColumn<EmployeeData>({
    columnId: 'week1',
    renderHeaderCell: () => 'Week 1',
    renderCell: (item) => (
      <div className="week-cell">
        <span className="weekly-score">{item.week1_score}</span>
        <span className="action-taken-label">Action Taken</span>
        <span className="action-taken-value" style={{color: item.week1_action === 'Yes' ? 'green' : 'red'}}>{item.week1_action}</span>
      </div>
    ),
  }),
  createTableColumn<EmployeeData>({
    columnId: 'week2',
    renderHeaderCell: () => 'Week 2',
    renderCell: (item) => (
      <div className="week-cell">
        <span className="weekly-score">{item.week2_score}</span>
        <span className="action-taken-label">Action Taken</span>
        <span className="action-taken-value" style={{color: item.week2_action === 'Yes' ? 'green' : 'red'}}>{item.week2_action}</span>
      </div>
    ),
  }),
  createTableColumn<EmployeeData>({
    columnId: 'week3',
    renderHeaderCell: () => 'Week 3',
    renderCell: (item) => (
      <div className="week-cell">
        <span className="weekly-score">{item.week3_score}</span>
        <span className="action-taken-label">Action Taken</span>
        <span className="action-taken-value" style={{color: item.week3_action === 'Yes' ? 'green' : 'red'}}>{item.week3_action}</span>
      </div>
    ),
  }),
    createTableColumn<EmployeeData>({
    columnId: 'week4',
    renderHeaderCell: () => 'Week 4',
    renderCell: (item) => (
      <div className="week-cell">
        <span className="weekly-score">{item.week4_score}</span>
        <span className="action-taken-label">Action Taken</span>
        <span className="action-taken-value" style={{color: item.week4_action === 'Yes' ? 'green' : 'red'}}>{item.week4_action}</span>
      </div>
    ),
  }),
    createTableColumn<EmployeeData>({
    columnId: 'week5',
    renderHeaderCell: () => 'Week 5',
    renderCell: (item) => (
      <div className="week-cell">
        <span className="weekly-score">{item.week5_score}</span>
        <span className="action-taken-label">Action Taken</span>
        <span className="action-taken-value" style={{color: item.week5_action === 'Yes' ? 'green' : 'red'}}>{item.week5_action}</span>
      </div>
    ),
  }),
  createTableColumn<EmployeeData>({
    columnId: 'monthlyResults',
    renderHeaderCell: () => 'Monthly Results',
    renderCell: (item) => (
      <div className="monthly-results-cell">
        <span>Score: {item.monthly_score}</span>
        <span>Actions: {item.monthly_actions}</span>
        <Comment24Regular />
      </div>
    ),
  }),
];

export default function UnderperformingView() {
  return (
    <div className="underperforming-container">
      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="left-filters">
            <Button icon={<Filter24Regular />} appearance="outline">Multi Filter: Category, Client, & Task</Button>
            <Button icon={<CalendarMonth24Regular />} appearance="outline">Month filtering</Button>
        </div>
        <div className="right-filters">
            <TabList>
                <Tab value="navClient">Nav: Client/Category</Tab>
                <Tab value="navTakeAction">Nav: Take Action</Tab>
            </TabList>
        </div>
      </div>

      {/* Category Toggle */}
      <div className="category-toggle">
        <TabList>
            <Tab value="employee">Employee Category</Tab>
            <Tab value="client">Client Category</Tab>
        </TabList>
      </div>

      {/* Main Data Grid */}
      <DataGrid items={employeeData} columns={columns} getRowId={(item) => item.id} className="data-grid-underperforming">
          <DataGridHeader>
            <DataGridRow>
              {(column) => (
                <DataGridHeaderCell key={column.columnId} className="grid-header-cell">{column.renderHeaderCell()}</DataGridHeaderCell>
              )}
            </DataGridRow>
          </DataGridHeader>
          <DataGridBody<EmployeeData>>
            {({ item, rowId }) => (
              <DataGridRow key={rowId}>
                {(column) => (
                  <DataGridCell key={column.columnId} className="grid-body-cell">{column.renderCell(item)}</DataGridCell>
                )}
              </DataGridRow>
            )}
          </DataGridBody>
        </DataGrid>
    </div>
  );
}