import { Button } from 'react-aria-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIconOverride } from './IconOverrideContext';
import { useActions } from './ActionsContext';

import iconNavHome     from './assets/icon-nav-home.svg';
import iconNavSearch   from './assets/icon-nav-search.svg';
import iconNavSwap     from './assets/icon-nav-swap.svg';
import iconNavActivity from './assets/icon-nav-activity.svg';

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { getIcon } = useIconOverride(); // kept for DS page icon slot overrides
  const { openActions } = useActions();

  const isActive = (path) => pathname === path || pathname.startsWith(path + '/');

  return (
    <nav className="bottom-nav" data-bk-component="bottom-nav" aria-label="Main navigation">
      <Button
        className={`nav-btn${pathname === '/' ? ' active' : ''}`}
        aria-label="Home"
        aria-current={pathname === '/' ? 'page' : undefined}
        onPress={() => navigate('/')}
      >
        <img src={iconNavHome} alt="" width="22" height="22" aria-hidden="true" />
      </Button>

      <Button
        className={`nav-btn${isActive('/explore') ? ' active' : ''}`}
        aria-label="Markets"
        aria-current={isActive('/explore') ? 'page' : undefined}
        onPress={() => navigate('/explore')}
      >
        <img src={iconNavSearch} alt="" width="22" height="22" aria-hidden="true" />
      </Button>

      {/* FAB-style primary action button */}
      <Button
        className="nav-btn nav-btn-swap"
        aria-label="Actions"
        onPress={() => openActions({})}
      >
        <img src={iconNavSwap} alt="" width="22" height="22" aria-hidden="true" />
      </Button>

      <Button
        className={`nav-btn${isActive('/activity') ? ' active' : ''}`}
        aria-label="Activity"
        aria-current={isActive('/activity') ? 'page' : undefined}
        onPress={() => navigate('/activity')}
      >
        <img src={iconNavActivity} alt="" width="22" height="22" aria-hidden="true" />
      </Button>
      <span style={{ position: 'absolute', bottom: 2, left: 0, right: 0, textAlign: 'center', fontSize: 9, color: 'var(--bk-text-muted)', opacity: 0.4, pointerEvents: 'none' }}>v3.0</span>
    </nav>
  );
}
