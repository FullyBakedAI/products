import { Button } from 'react-aria-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { useActions } from './ActionsContext';
import { Home, BarChart3, Zap, Clock } from 'lucide-react';

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
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
        <Home size={20} strokeWidth={1.5} />
        <span className="nav-label">Home</span>
      </Button>

      <Button
        className={`nav-btn${isActive('/explore') ? ' active' : ''}`}
        aria-label="Markets"
        aria-current={isActive('/explore') ? 'page' : undefined}
        onPress={() => navigate('/explore')}
      >
        <BarChart3 size={20} strokeWidth={1.5} />
        <span className="nav-label">Markets</span>
      </Button>

      {/* Centre FAB — primary action */}
      <Button
        className="nav-btn nav-btn-swap"
        aria-label="Actions"
        onPress={() => openActions({})}
      >
        <Zap size={20} strokeWidth={2} />
      </Button>

      <Button
        className={`nav-btn${isActive('/activity') ? ' active' : ''}`}
        aria-label="Activity"
        aria-current={isActive('/activity') ? 'page' : undefined}
        onPress={() => navigate('/activity')}
      >
        <Clock size={20} strokeWidth={1.5} />
        <span className="nav-label">Activity</span>
      </Button>
    </nav>
  );
}
