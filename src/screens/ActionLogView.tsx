// src/screens/performance/action_log/ActionLogView.tsx

import { Card, Input } from '@fluentui/react-components';
import { Search24Regular } from '@fluentui/react-icons';
import './ActionLogView.css';

// --- Mock Data ---
const actionLogItems = [
  {
    type: 'Final Warning',
    employeeName: 'Robert Wilson',
    details: 'Consistent underperformance for 4 consecutive weeks. Final warning issued before termination consideration.',
    takenBy: 'Director Smith',
    date: 'December 17, 2024',
  },
  {
    type: 'Written Warning',
    employeeName: 'John Doe',
    details: 'Performance dropped to critical levels in weeks 3-4. Written warning provided with 30-day improvement plan.',
    takenBy: 'Manager Johnson',
    date: 'December 14, 2024',
  },
  // Add more items as needed
];

export default function ActionLogView() {
  return (
    <div className="action-log-container">
      <div className="action-log-header">
        <h3>Action History</h3>
        <Input
          contentAfter={<Search24Regular />}
          placeholder="Search actions..."
        />
      </div>

      <div className="action-log-list">
        {actionLogItems.map((item, index) => (
          <Card key={index} className="action-log-card">
            <div className="card-main-header">
              <span className="action-type">{item.type}</span>
              <span className="employee-name">{item.employeeName}</span>
            </div>
            <p className="action-details">{item.details}</p>
            <div className="card-footer">
              <span>Taken by: {item.takenBy}</span>
              <span>•</span>
              <span>{item.date}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}