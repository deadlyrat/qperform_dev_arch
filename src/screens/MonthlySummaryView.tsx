// src/screens/performance/monthly_summary/MonthlySummaryView.tsx

import {
  Card,
  CardHeader,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  TableColumnDefinition,
  createTableColumn,
} from '@fluentui/react-components';
import { 
  People24Regular, 
  Warning24Regular, 
  ChartMultiple24Regular, 
  ArrowTrendingLines24Regular 
} from '@fluentui/react-icons';
import './MonthlySummaryView.css';

// --- Types ---
interface SummaryItem {
  client: string;
  category: string;
  totalAFTEs: number;
  underperformers: number;
  weeksWithIssues: number;
  avgScore: number;
}

// --- Mock Data ---
// TODO: Replace with PostgreSQL data from API
const summaryItems: SummaryItem[] = [
  {
    client: 'Acme Corp',
    category: 'Customer Service',
    totalAFTEs: 45,
    underperformers: 8,
    weeksWithIssues: 4,
    avgScore: 72,
  },
  {
    client: 'TechStart Inc',
    category: 'Sales',
    totalAFTEs: 32,
    underperformers: 3,
    weeksWithIssues: 2,
    avgScore: 81,
  },
  {
    client: 'Global Solutions',
    category: 'Technical Support',
    totalAFTEs: 28,
    underperformers: 5,
    weeksWithIssues: 3,
    avgScore: 75,
  },
];

// --- Column Definitions for the DataGrid ---
const columns: TableColumnDefinition<SummaryItem>[] = [
  createTableColumn<SummaryItem>({
    columnId: 'client',
    compare: (a, b) => a.client.localeCompare(b.client),
    renderHeaderCell: () => 'Client',
    renderCell: (item) => item.client,
  }),
  createTableColumn<SummaryItem>({
    columnId: 'category',
    compare: (a, b) => a.category.localeCompare(b.category),
    renderHeaderCell: () => 'Category',
    renderCell: (item) => item.category,
  }),
  createTableColumn<SummaryItem>({
    columnId: 'totalAFTEs',
    compare: (a, b) => a.totalAFTEs - b.totalAFTEs,
    renderHeaderCell: () => 'Total AFTEs',
    renderCell: (item) => item.totalAFTEs,
  }),
  createTableColumn<SummaryItem>({
    columnId: 'underperformers',
    compare: (a, b) => a.underperformers - b.underperformers,
    renderHeaderCell: () => 'Underperformers',
    renderCell: (item) => item.underperformers,
  }),
  createTableColumn<SummaryItem>({
    columnId: 'weeksWithIssues',
    compare: (a, b) => a.weeksWithIssues - b.weeksWithIssues,
    renderHeaderCell: () => 'Weeks with Issues',
    renderCell: (item) => item.weeksWithIssues,
  }),
  createTableColumn<SummaryItem>({
    columnId: 'avgScore',
    compare: (a, b) => a.avgScore - b.avgScore,
    renderHeaderCell: () => 'Avg Score',
    renderCell: (item) => <strong>{item.avgScore}</strong>,
  }),
  createTableColumn<SummaryItem>({
    columnId: 'trend',
    renderHeaderCell: () => 'Trend',
    renderCell: () => <ArrowTrendingLines24Regular />,
  }),
];

export default function MonthlySummaryView() {
  return (
    <div className="summary-view-container">
      {/* KPI Cards Section */}
      <div className="kpi-cards-grid">
        <Card className="kpi-card">
          <CardHeader 
            header={
              <div className="card-title">
                Total AFTEs <People24Regular />
              </div>
            } 
          />
          <div className="kpi-value">143</div>
          <div className="kpi-description">Across all clients and categories</div>
        </Card>

        <Card className="kpi-card">
          <CardHeader 
            header={
              <div className="card-title">
                Underperformers <Warning24Regular />
              </div>
            } 
          />
          <div className="kpi-value">20</div>
          <div className="kpi-description">14.0% of total workforce</div>
        </Card>

        <Card className="kpi-card">
          <CardHeader 
            header={
              <div className="card-title">
                Average Score <ChartMultiple24Regular />
              </div>
            } 
          />
          <div className="kpi-value">76.5</div>
          <div className="kpi-description">Overall performance metric</div>
        </Card>
      </div>

      {/* DataGrid Section */}
      <Card className="data-grid-card">
        <h3>Performance by Client & Category</h3>
        <DataGrid 
          items={summaryItems} 
          columns={columns} 
          sortable
          getRowId={(item) => item.client}
        >
          <DataGridHeader>
            <DataGridRow>
              {({ renderHeaderCell }) => (
                <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
              )}
            </DataGridRow>
          </DataGridHeader>
          <DataGridBody<SummaryItem>>
            {({ item, rowId }) => (
              <DataGridRow<SummaryItem> key={rowId}>
                {({ renderCell }) => (
                  <DataGridCell>{renderCell(item)}</DataGridCell>
                )}
              </DataGridRow>
            )}
          </DataGridBody>
        </DataGrid>
      </Card>
    </div>
  );
}