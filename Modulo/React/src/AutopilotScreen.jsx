/**
 * AutopilotScreen — autopilot settings detail (Feature 3)
 * Route: /autopilot (modal slide-up)
 * Risk tolerance selector, activity feed, notifications toggle, pause button.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { motion as m } from './motion-tokens';
import { Button, Switch } from 'react-aria-components';

const MotionButton = motion.create(Button);
import { Zap, ChevronLeft, Bell, Pause } from 'lucide-react';
import './autopilot.css';

const RISK_LEVELS = [
  { id: 'conservative', label: 'Conservative', desc: 'Low risk, stable yields. Max 5% APY protocols.' },
  { id: 'balanced',     label: 'Balanced',     desc: 'Moderate risk/reward. Mix of stable and DeFi.' },
  { id: 'aggressive',   label: 'Aggressive',   desc: 'High yield, higher risk. Full DeFi exposure.'  },
];

const ACTIVITY = [
  { id: 1, text: 'Moved 2,000 USDC to Compound', detail: '+0.7% APY gain', time: '2 days ago' },
  { id: 2, text: 'Rebalanced ETH → Lido',        detail: '+0.3% APY gain', time: '5 days ago' },
  { id: 3, text: 'Moved SOL to Marinade staking', detail: '+1.2% APY gain', time: '8 days ago' },
  { id: 4, text: 'Compounded USDT yield',         detail: '$12.40 earned',  time: '12 days ago' },
];

export default function AutopilotScreen() {
  const navigate = useNavigate();
  const [risk, setRisk]     = useState('balanced');
  const [notifs, setNotifs] = useState(true);
  const [active, setActive] = useState(true);

  return (
    <motion.main
      role="main"
      aria-label="Autopilot settings"
      className="autopilot-screen"
      initial={{ opacity: 0, y: m.modal.offsetEnter }}
      animate={{ opacity: 1, y: 0, transition: m.modal.enter }}
      exit={{ opacity: 0, y: m.modal.offsetExit, transition: m.modal.exit }}
    >
      <header className="autopilot-header">
        <Button className="icon-btn" aria-label="Go back" onPress={() => navigate('/')}>
          <ChevronLeft size={20} color="var(--bk-text-primary)" strokeWidth={1.5} />
        </Button>
        <div className="autopilot-header-title">
          <Zap size={16} color="var(--bk-brand-primary)" strokeWidth={1.5} aria-hidden="true" />
          <h1 className="autopilot-title">Autopilot</h1>
        </div>
        <div aria-hidden="true" style={{ width: 20 }} />
      </header>

      <div className="scroll-content">
        {/* Status card with animated glow border when active */}
        <motion.div
          className={`autopilot-status-card${active ? ' active' : ''}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: { ...m.fade.enter, delay: 0.04 } }}
        >
          <div>
            <div className="autopilot-status-label">
              {active ? 'Autopilot is active' : 'Autopilot is paused'}
            </div>
            <div className="autopilot-status-sub">Last rebalance: 2 days ago</div>
          </div>
          <Switch
            isSelected={active}
            onChange={setActive}
            aria-label="Toggle autopilot"
            className="ap-switch"
          >
            <div className="ap-switch-indicator" aria-hidden="true">
              <div className="ap-switch-thumb" />
            </div>
          </Switch>
        </motion.div>

        {/* Risk tolerance */}
        <motion.section
          className="autopilot-section"
          aria-labelledby="risk-heading"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: { ...m.fade.enter, delay: 0.08 } }}
        >
          <div className="autopilot-section-title" id="risk-heading">Risk tolerance</div>
          <div className="autopilot-risk-pills" role="group" aria-label="Select risk level">
            {RISK_LEVELS.map(level => (
              <MotionButton
                key={level.id}
                className={`autopilot-risk-pill${risk === level.id ? ' active' : ''}`}
                aria-pressed={risk === level.id}
                whileTap={{ scale: 0.92 }}
                onPress={() => setRisk(level.id)}
              >
                {level.label}
              </MotionButton>
            ))}
          </div>
          <div className="autopilot-risk-desc" role="status" aria-live="polite">
            {RISK_LEVELS.find(l => l.id === risk)?.desc}
          </div>
        </motion.section>

        {/* Notifications toggle */}
        <motion.div
          className="autopilot-notif-row"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: { ...m.fade.enter, delay: 0.12 } }}
        >
          <div className="autopilot-notif-left">
            <Bell size={16} color="var(--bk-text-secondary)" strokeWidth={1.5} aria-hidden="true" />
            <span className="autopilot-notif-label">Rebalance notifications</span>
          </div>
          <Switch
            isSelected={notifs}
            onChange={setNotifs}
            aria-label="Toggle rebalance notifications"
            className="ap-switch"
          >
            <div className="ap-switch-indicator" aria-hidden="true">
              <div className="ap-switch-thumb" />
            </div>
          </Switch>
        </motion.div>

        {/* Activity feed */}
        <motion.section
          className="autopilot-section"
          aria-labelledby="activity-heading"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: { ...m.fade.enter, delay: 0.16 } }}
        >
          <div className="autopilot-section-title" id="activity-heading">Autopilot activity</div>
          <div className="autopilot-activity-list" role="list">
            {ACTIVITY.map((item, i) => (
              <motion.div
                key={item.id}
                className="autopilot-activity-row"
                role="listitem"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0, transition: { ...m.fade.enter, delay: 0.20 + i * 0.04 } }}
              >
                <div className="autopilot-activity-dot" aria-hidden="true" />
                <div className="autopilot-activity-content">
                  <div className="autopilot-activity-text">{item.text}</div>
                  <div className="autopilot-activity-meta">
                    <span className="autopilot-activity-detail">{item.detail}</span>
                    <span className="autopilot-activity-time">{item.time}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Pause button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { ...m.fade.enter, delay: 0.40 } }}
        >
          <Button
            className="autopilot-pause-btn"
            aria-label="Pause autopilot"
            onPress={() => setActive(false)}
          >
            <Pause size={16} strokeWidth={1.5} aria-hidden="true" />
            Pause Autopilot
          </Button>
        </motion.div>
      </div>
    </motion.main>
  );
}
