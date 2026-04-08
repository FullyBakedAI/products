import { Button } from 'react-aria-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIconOverride } from './IconOverrideContext';

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { getIcon } = useIconOverride();

  const NavHome     = getIcon('nav-home');
  const NavExplore  = getIcon('nav-explore');
  const NavActivity = getIcon('nav-activity');
  const NavSwap     = getIcon('nav-swap');

  return (
    <nav className="bottom-nav" data-bk-component="bottom-nav" aria-label="Main navigation">
      <Button
        className={`nav-btn${pathname === '/' ? ' active' : ''}`}
        aria-label="Home"
        aria-current={pathname === '/' ? 'page' : undefined}
        onPress={() => navigate('/')}
      >
        <NavHome size={22} strokeWidth={1.5} aria-hidden="true" />
      </Button>

      <Button
        className={`nav-btn${pathname === '/explore' ? ' active' : ''}`}
        aria-label="Explore"
        aria-current={pathname === '/explore' ? 'page' : undefined}
        onPress={() => navigate('/explore')}
      >
        <NavExplore size={22} strokeWidth={1.5} aria-hidden="true" />
      </Button>

      <Button
        className="nav-btn"
        aria-label="Activity"
        onPress={() => {/* placeholder */}}
      >
        <NavActivity size={22} strokeWidth={1.5} aria-hidden="true" />
      </Button>

      <Button
        className="nav-btn nav-btn-swap"
        aria-label="Swap"
        onPress={() => navigate('/swap')}
      >
        <NavSwap size={22} strokeWidth={1.5} aria-hidden="true" />
      </Button>
    </nav>
  );
}
