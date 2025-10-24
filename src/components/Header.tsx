// src/components/layout/Header.tsx

import { Avatar } from '@fluentui/react-components';
import { AlertUrgent24Regular, Settings24Regular } from '@fluentui/react-icons';
import './Header.css';

const logoUrl = '/qperform-logo.svg'; // Using the same logo from the public folder

export default function Header() {
  return (
    <header className="app-header">
      <div className="header-left">
        <img src={logoUrl} alt="QPerform Logo" className="header-logo" />
        <div className="header-title-group">
          <span className="header-title">QPerform</span>
          <span className="header-subtitle">Performance Management</span>
        </div>
      </div>
      <div className="header-right">
        <div className="notification-icon">
          <AlertUrgent24Regular />
          <div className="notification-badge">3</div> {/* Example badge */}
        </div>
        <Settings24Regular />
        <Avatar name="Pablo Aguirre" size={32} /> {/* Uses initials as a fallback */}
      </div>
    </header>
  );
}