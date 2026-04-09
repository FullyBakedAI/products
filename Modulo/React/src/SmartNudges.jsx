/**
 * SmartNudges — horizontal scrollable nudge cards (Feature 4)
 * Rendered on HomeScreen between the optimise/autopilot cards and token list.
 * Each card is dismissable. Max 3 shown at once.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { motion as m } from './motion-tokens';
import { Button } from 'react-aria-components';
import { TrendingUp, AlertCircle, Lightbulb, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useActions } from './ActionsContext';

const NUDGES_DATA = [
  {
    id: 'eth-yield-up',
    Icon: TrendingUp,
    iconColor: 'var(--bk-success)',
    headline: 'ETH yield up +0.9% on Lido',
    detail: 'Better rate available now',
    cta: 'Move now',
    action: { type: 'actions', tab: 'lend', asset: 'eth' },
  },
  {
    id: 'sol-idle',
    Icon: AlertCircle,
    iconColor: 'var(--bk-brand-primary)',
    headline: 'SOL idle for 14 days',
    detail: "Could've earned $12 staking",
    cta: 'Stake',
    action: { type: 'actions', tab: 'lend', asset: 'sol' },
  },
  {
    id: 'btc-health',
    Icon: Lightbulb,
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
                  <X size={11} strokeWidth={2.5} />
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
