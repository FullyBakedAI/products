/**
 * SmartNudges — horizontal scrollable nudge cards (Feature 4)
 * Rendered on HomeScreen between the optimise/autopilot cards and token list.
 * Each card is dismissable. Max 3 shown at once.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { motion as m } from './motion-tokens';
import { Button } from 'react-aria-components';
const IconTrendingUp = () => (
  <svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M3 14L8 9L11 12L17 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13 6H17V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconAlertCircle = () => (
  <svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 7V10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="10" cy="13.5" r="0.75" fill="currentColor"/>
  </svg>
);
const IconLightbulb = () => (
  <svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 3C7.24 3 5 5.24 5 8C5 9.77 5.93 11.32 7.33 12.2C7.75 12.47 8 12.93 8 13.43V14H12V13.43C12 12.93 12.25 12.47 12.67 12.2C14.07 11.32 15 9.77 15 8C15 5.24 12.76 3 10 3Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 16H12M8.5 14H11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IconX = () => (
  <svg width="11" height="11" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
import { useNavigate } from 'react-router-dom';
import { useActions } from './ActionsContext';

const NUDGES_DATA = [
  {
    id: 'eth-yield-up',
    Icon: IconTrendingUp,
    iconColor: 'var(--bk-success)',
    headline: 'ETH yield up +0.9% on Lido',
    detail: 'Better rate available now',
    cta: 'Move now',
    action: { type: 'actions', tab: 'lend', asset: 'eth' },
  },
  {
    id: 'sol-idle',
    Icon: IconAlertCircle,
    iconColor: 'var(--bk-brand-primary)',
    headline: 'SOL idle for 14 days',
    detail: "Could've earned $12 staking",
    cta: 'Stake',
    action: { type: 'actions', tab: 'lend', asset: 'sol' },
  },
  {
    id: 'btc-health',
    Icon: IconLightbulb,
    iconColor: 'var(--bk-text-muted)',
    headline: 'BTC health factor: 3.2×',
    detail: "You're safe — no liquidation risk",
    cta: 'Details',
    action: { type: 'navigate', path: '/asset/btc' },
  },
];

export default function SmartNudges() {
  const navigate = useNavigate();
  const { openActions } = useActions();
  const [nudges, setNudges] = useState(NUDGES_DATA);

  function dismiss(id) {
    setNudges(prev => prev.filter(n => n.id !== id));
  }

  if (nudges.length === 0) return null;

  return (
    <section
      className="smart-nudges-row"
      aria-label="Smart suggestions"
    >
      <div className="smart-nudges-scroll">
        <AnimatePresence>
          {nudges.map(({ id, Icon, iconColor, headline, detail, cta, action }) => (
            <motion.article
              key={id}
              className="nudge-card"
              layout
              initial={{ opacity: 0, scale: 0.9, x: 16 }}
              animate={{ opacity: 1, scale: 1, x: 0, transition: m.springTight }}
              exit={{ opacity: 0, y: -16, scale: 0.88, transition: { duration: 0.16 } }}
              aria-label={headline}
            >
              <div className="nudge-card-top">
                <div className="nudge-icon-wrap" aria-hidden="true" style={{ color: iconColor }}>
                  <Icon size={15} strokeWidth={1.5} />
                </div>
                <Button
                  className="nudge-dismiss-btn"
                  aria-label={`Dismiss: ${headline}`}
                  onPress={() => dismiss(id)}
                >
                  <IconX />
                </Button>
              </div>
              <p className="nudge-headline">{headline}</p>
              <p className="nudge-detail">{detail}</p>
              <Button
                className="nudge-cta-btn"
                aria-label={`${cta} — ${headline}`}
                onPress={() => action.type === 'actions'
                  ? openActions({ tab: action.tab, asset: action.asset })
                  : navigate(action.path)
                }
              >
                {cta}
              </Button>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
