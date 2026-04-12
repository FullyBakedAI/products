import { Button } from 'react-aria-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { useActions } from './ActionsContext';
import { useIsDesktop } from './hooks/useIsDesktop';
const IconHome = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M3 9.5L10 3L17 9.5V17H13V13H7V17H3V9.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);
const IconBarChart3 = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M4 16V10M8 16V6M12 16V12M16 16V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IconZap = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M11 3L4 11H10L9 17L16 9H10L11 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);
const IconClock = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 7V10.5L12.5 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconSlidersHorizontal = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M3 6H17M3 10H17M3 14H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="7" cy="6" r="2" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="13" cy="10" r="2" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="8" cy="14" r="2" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

export default function BottomNav() {
  const isDesktop = useIsDesktop();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { openActions } = useActions();

  if (isDesktop) return null;

  const isActive = (path) => pathname === path || pathname.startsWith(path + '/');

  return (
    <nav className="bottom-nav" data-bk-component="bottom-nav" aria-label="Main navigation">
      <Button
        className={`nav-btn${pathname === '/' ? ' active' : ''}`}
        aria-label="Home"
        aria-current={pathname === '/' ? 'page' : undefined}
        onPress={() => navigate('/')}
      >
        <IconHome />
        <span className="nav-label">Home</span>
      </Button>

      <Button
        className={`nav-btn${isActive('/explore') ? ' active' : ''}`}
        aria-label="Markets"
        aria-current={isActive('/explore') ? 'page' : undefined}
        onPress={() => navigate('/explore')}
      >
        <IconBarChart3 />
        <span className="nav-label">Markets</span>
      </Button>

      {/* Centre FAB — primary action */}
      <Button
        className="nav-btn nav-btn-swap"
        aria-label="Actions"
        onPress={() => openActions({})}
      >
        <IconZap />
      </Button>

      <Button
        className={`nav-btn${isActive('/activity') ? ' active' : ''}`}
        aria-label="Activity"
        aria-current={isActive('/activity') ? 'page' : undefined}
        onPress={() => navigate('/activity')}
      >
        <IconClock />
        <span className="nav-label">Activity</span>
      </Button>

      <Button
        className={`nav-btn${isActive('/manage') ? ' active' : ''}`}
        aria-label="Manage"
        aria-current={isActive('/manage') ? 'page' : undefined}
        onPress={() => navigate('/manage')}
      >
        <IconSlidersHorizontal />
        <span className="nav-label">Manage</span>
      </Button>
    </nav>
  );
}
