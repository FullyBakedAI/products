/**
 * AchievementsScreen — achievement gallery (Feature 6)
 * Route: /achievements (modal slide-up)
 * Grid of achievement cards. Earned ones highlighted, locked ones dimmed.
 */

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { motion as m, stagger } from './motion-tokens';
import { Button } from 'react-aria-components';
const IconChevronLeft = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconAward = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="8" r="5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M7 13.5L6 17H14L13 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M7 17H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IconZap = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M11 3L4 11H10L9 17L16 9H10L11 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);
const IconTrendingUp = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M3 14L8 9L11 12L17 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13 6H17V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconGlobe = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 3C10 3 7.5 6 7.5 10C7.5 14 10 17 10 17" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 3C10 3 12.5 6 12.5 10C12.5 14 10 17 10 17" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M3 10H17" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);
const IconClock = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 7V10.5L12.5 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconSparkles = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 3V5M10 15V17M3 10H5M15 10H17M5.5 5.5L7 7M13 13L14.5 14.5M5.5 14.5L7 13M13 7L14.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);
const IconCalendar = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <rect x="3" y="5" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M3 9H17M7 3V7M13 3V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
import './achievements.css';

const ACHIEVEMENTS = [
  {
    id: 'first-deposit',
    Icon: IconAward,
    title: 'First Deposit',
    desc: 'Moved crypto into Modulo',
    date: 'Jan 15, 2026',
    earned: true,
  },
  {
    id: 'yield-hunter',
    Icon: IconZap,
    title: 'Yield Hunter',
    desc: 'First $10 earned from yield',
    date: 'Jan 23, 2026',
    earned: true,
  },
  {
    id: 'century-club',
    Icon: IconTrendingUp,
    title: 'Century Club',
    desc: 'First $100 earned from yield',
    date: 'Feb 12, 2026',
    earned: true,
  },
  {
    id: 'cross-chain',
    Icon: IconGlobe,
    title: 'Cross-Chain Native',
    desc: 'Assets on 3+ chains',
    date: 'Feb 28, 2026',
    earned: true,
  },
  {
    id: 'set-forget',
    Icon: IconClock,
    title: 'Set & Forget',
    desc: 'Autopilot active for 7 days',
    date: null,
    earned: false,
  },
  {
    id: 'optimiser',
    Icon: IconSparkles,
    title: 'Optimiser',
    desc: 'Used Put It All To Work',
    date: null,
    earned: false,
  },
  {
    id: '30-day-streak',
    Icon: IconCalendar,
    title: '30-Day Streak',
    desc: 'Money working for 30 days',
    date: null,
    earned: false,
  },
];

export default function AchievementsScreen() {
  const navigate = useNavigate();
  const earnedCount = ACHIEVEMENTS.filter(a => a.earned).length;

  return (
    <motion.main
      role="main"
      aria-label="Achievements"
      className="achievements-screen"
      initial={{ opacity: 0, y: m.modal.offsetEnter }}
      animate={{ opacity: 1, y: 0, transition: m.modal.enter }}
      exit={{ opacity: 0, y: m.modal.offsetExit, transition: m.modal.exit }}
    >
      <header className="achievements-header">
        <Button className="icon-btn" aria-label="Go back" onPress={() => navigate('/')}>
          <IconChevronLeft />
        </Button>
        <h1 className="achievements-title">Achievements</h1>
        <div aria-hidden="true" style={{ width: 20 }} />
      </header>

      <div className="scroll-content">
        {/* Summary */}
        <div className="achievements-summary" aria-label={`${earnedCount} of ${ACHIEVEMENTS.length} achievements earned`}>
          <span className="achievements-count">{earnedCount} / {ACHIEVEMENTS.length}</span>
          <span className="achievements-count-label">earned</span>
        </div>

        {/* Grid */}
        <div className="achievements-grid" role="list" aria-label="All achievements">
          {ACHIEVEMENTS.map((a, i) => {
            const { Icon } = a;
            return (
              <motion.div
                key={a.id}
                className={`achievement-card${a.earned ? '' : ' locked'}`}
                role="listitem"
                aria-label={`${a.title}${a.earned ? `, earned ${a.date}` : ' — not yet earned'}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { ...m.fade.enter, delay: stagger.base + i * stagger.perItem } }}
              >
                <div className={`achievement-icon-wrap${a.earned ? ' earned' : ''}`} aria-hidden="true">
                  <Icon size={22} strokeWidth={1.5} />
                </div>
                <div className="achievement-card-title">{a.title}</div>
                <div className="achievement-card-desc">{a.desc}</div>
                {a.earned && a.date ? (
                  <div className="achievement-card-date">{a.date}</div>
                ) : !a.earned ? (
                  <div className="achievement-card-locked">Locked</div>
                ) : null}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.main>
  );
}
