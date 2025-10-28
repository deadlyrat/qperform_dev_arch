// src/components/layout/Header.tsx

import { Avatar } from '@fluentui/react-components';
import { AlertUrgent24Regular, Settings24Regular } from '@fluentui/react-icons';
import './Header.css';

const logoUrl = '/qperform-logo.svg';

// Define the type for the props
type HeaderProps = {
  userName: string;
  notificationCount: number;
};

// Accept the props as an argument
export default function Header({ userName, notificationCount }: HeaderProps) {
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
          {/* Only show the badge if the count is greater than 0 */}
          {notificationCount > 0 && (
            <div className="notification-badge">{notificationCount}</div>
          )}
        </div>
        <Settings24Regular />
        {/* Use the dynamic userName prop for the Avatar */}
        <Avatar name={userName} size={32} />
      </div>
    </header>
  );
}