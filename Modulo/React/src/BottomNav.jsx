import { Button } from 'react-aria-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { useActions } from './ActionsContext';
import { useIsDesktop } from './hooks/useIsDesktop';
import { useFeatures } from './theme/FeatureConfig';
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
const IconFunds = () => (
  <svg width="20" height="20" viewBox="0 0 22 22" fill="none" aria-hidden="true">
    <path d="M3.67 7.33H17.42C18.43 7.33 19.25 8.16 19.25 9.17V17.42C19.25 18.43 18.43 19.25 17.42 19.25H4.58C3.57 19.25 2.75 18.43 2.75 17.42V9.17C2.75 8.16 3.57 7.33 4.58 7.33Z" stroke="currentColor" strokeWidth="1.83333" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.42 7.33V5.5C6.42 4.49 7.24 3.67 8.25 3.67H15.58C16.59 3.67 17.42 4.49 17.42 5.5V7.33" stroke="currentColor" strokeWidth="1.83333" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19.25 11H15.58C14.57 11 13.75 11.82 13.75 12.83C13.75 13.84 14.57 14.67 15.58 14.67H19.25" stroke="currentColor" strokeWidth="1.83333" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="15.58" cy="12.83" r="0.917" fill="currentColor"/>
  </svg>
);

export default function BottomNav() {
  const f = useFeatures();
  const isDesktop = useIsDesktop();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { openActions } = useActions();

  if (isDesktop) return null;

  const isActive = (path) => pathname === path || pathname.startsWith(path + '/');

  return (
    <nav className="bottom-nav" data-bk-component="bottom-nav" aria-label="Main navigation">
      {f.nav.home && (
      <Button
        className={`nav-btn${pathname === '/' ? ' active' : ''}`}
        aria-label="Home"
        aria-current={pathname === '/' ? 'page' : undefined}
        onPress={() => navigate('/')}
      >
        <IconHome />
        <span className="nav-label">Home</span>
      </Button>
      )}

      {f.nav.explore && (
      <Button
        className={`nav-btn${isActive('/explore') ? ' active' : ''}`}
        aria-label="Markets"
        aria-current={isActive('/explore') ? 'page' : undefined}
        onPress={() => navigate('/explore')}
      >
        <IconBarChart3 />
        <span className="nav-label">Markets</span>
      </Button>
      )}

      {/* Centre FAB — primary action */}
      {f.nav.fab && (
      <Button
        className="nav-btn nav-btn-swap"
        aria-label="Actions"
        onPress={() => openActions({})}
      >
        <IconZap />
      </Button>
      )}

      {f.nav.activity && (
      <Button
        className={`nav-btn${isActive('/activity') ? ' active' : ''}`}
        aria-label="Activity"
        aria-current={isActive('/activity') ? 'page' : undefined}
        onPress={() => navigate('/activity')}
      >
        <IconClock />
        <span className="nav-label">Activity</span>
      </Button>
      )}

      {(f.nav.manage ?? true) && (
      <Button
        className={`nav-btn${isActive('/manage') ? ' active' : ''}`}
        aria-label="Funds"
        aria-current={isActive('/manage') ? 'page' : undefined}
        onPress={() => navigate('/manage')}
      >
        <IconFunds />
        <span className="nav-label">Funds</span>
      </Button>
      )}
    </nav>
  );
}
