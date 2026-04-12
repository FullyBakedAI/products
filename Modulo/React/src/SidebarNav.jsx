import { Button } from 'react-aria-components';
import { useNavigate, useLocation } from 'react-router-dom';

const IconHome = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M3 9.5L10 3L17 9.5V17H13V13H7V17H3V9.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);

const IconCompass = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M13.5 6.5L11.5 11.5L6.5 13.5L8.5 8.5L13.5 6.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
  </svg>
);

const IconGrid = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <rect x="3" y="3" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="11" y="3" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="3" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="11" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const IconSettings = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const NAV = [
  { path: '/',        label: 'Portfolio',  Icon: IconHome    },
  { path: '/explore', label: 'Markets',    Icon: IconCompass },
  { path: '/manage',  label: 'Manage',     Icon: IconGrid    },
];

export default function SidebarNav() {
  const navigate  = useNavigate();
  const { pathname } = useLocation();

  const isActive = (path) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path);

  return (
    <nav className="desktop-sidebar" aria-label="Main navigation">
      <div className="sidebar-logo" aria-label="Modulo">
        Modulo
      </div>

      <div className="sidebar-nav">
        {NAV.map(({ path, label, Icon }) => (
          <Button
            key={path}
            className={`sidebar-nav-item${isActive(path) ? ' active' : ''}`}
            aria-label={label}
            aria-current={isActive(path) ? 'page' : undefined}
            onPress={() => navigate(path)}
          >
            <Icon />
            <span>{label}</span>
          </Button>
        ))}
      </div>

      <div className="sidebar-divider" role="separator" />

      <div className="sidebar-footer">
        <span className="sidebar-wallet" title="0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b">
          0x1a2b…9a0b
        </span>
        <Button
          className="sidebar-settings-btn"
          aria-label="Settings"
          onPress={() => navigate('/settings')}
        >
          <IconSettings />
        </Button>
      </div>
    </nav>
  );
}
