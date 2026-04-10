/**
 * AchievementsScreen — achievement gallery (Feature 6)
 * Route: /achievements (modal slide-up)
 * Grid of achievement cards. Earned ones highlighted, locked ones dimmed.
 */

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { motion as m } from './motion-tokens';
import { Button } from 'react-aria-components';
import { ChevronLeft, Award, Zap, TrendingUp, Globe, Clock, Sparkles, Calendar } from 'lucide-react';
import './achievements.css';

const ACHIEVEMENTS = [
  {
    id: 'first-deposit',
    Icon: Award,
    title: 'First Deposit',
    desc: 'Moved crypto into Modulo',
    date: 'Jan 15, 2026',
    earned: true,
  },
  {
    id: 'yield-hunter',
    Icon: Zap,
    title: 'Yield Hunter',
    desc: 'First $10 earned from yield',
    date: 'Jan 23, 2026',
    earned: true,
  },
  {
    id: 'century-club',
    Icon: TrendingUp,
    title: 'Century Club',
    desc: 'First $100 earned from yield',
    date: 'Feb 12, 2026',
    earned: true,
  },
  {
    id: 'cross-chain',
    Icon: Globe,
    title: 'Cross-Chain Native',
    desc: 'Assets on 3+ chains',
    date: 'Feb 28, 2026',
    earned: true,
  },
  {
    id: 'set-forget',
    Icon: Clock,
    title: 'Set & Forget',
    desc: 'Autopilot active for 7 days',
    date: null,
    earned: false,
  },
  {
    id: 'optimiser',
    Icon: Sparkles,
    title: 'Optimiser',
    desc: 'Used Put It All To Work',
    date: null,
    earned: false,
  },
  {
    id: '30-day-streak',
    Icon: Calendar,
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
          <ChevronLeft size={20} color="var(--bk-text-primary)" strokeWidth={1.5} />
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
                animate={{ opacity: 1, y: 0, transition: { ...m.fade.enter, delay: 0.04 + i * 0.04 } }}
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
