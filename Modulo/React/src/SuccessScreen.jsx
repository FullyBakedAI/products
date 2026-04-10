/**
 * SuccessScreen — animated transaction success state
 *
 * Design language: full-screen, primary-btn from shared.css.
 * Clean and premium — no excess chrome.
 *
 * Route: /success (modal slide-up)
 */

import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { motion as m } from './motion-tokens';
import { Button } from 'react-aria-components';
import iconNotif from './assets/icon-notification.svg';
import iconShare from './assets/icon-share.svg';
import './success.css';
import './swap.css';

const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

function SuccessCheck() {
  return (
    <div className="success-check-wrap" aria-hidden="true">
      <motion.svg width="88" height="88" viewBox="0 0 88 88" fill="none">
        <motion.circle
          cx="44" cy="44" r="40"
          stroke="var(--bk-brand-primary)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.55, ease: 'easeOut', delay: 0.15 }}
        />
        <motion.path
          d="M26 44l13 13 22-24"
          stroke="var(--bk-brand-primary)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.32, ease: 'easeOut', delay: 0.65 }}
        />
      </motion.svg>
      <motion.div
        className="success-glow"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: [0, 0.35, 0], scale: [0.5, 1.8, 2.2] }}
        transition={{ duration: 0.85, delay: 0.72, ease: 'easeOut' }}
      />
    </div>
  );
}

export default function SuccessScreen() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const action  = state?.action  || 'swap';
  const summary = state?.summary || '0.1 ETH for 324.10 USDC';

  const pastTense = { swap: 'swapped', send: 'sent', receive: 'received', trade: 'traded', lend: 'lent', borrow: 'borrowed', stake: 'staked' };

  return (
    <motion.div
      role="main"
      aria-label={`${capitalize(action)} complete`}
      className="success-screen swap-screen-inner"
      initial={{ opacity: 0, y: m.modal.offsetEnter }}
      animate={{ opacity: 1, y: 0, transition: m.modal.enter }}
      exit={{ opacity: 0, y: m.modal.offsetExit, transition: m.modal.exit }}
    >
      <div className="success-content">
        <SuccessCheck />

        <motion.div
          className="success-text"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { ...m.fade.enter, delay: 0.88 } }}
        >
          <h1 className="success-title">{capitalize(action)} complete</h1>
          <p className="success-sub">
            You {pastTense[action] || action + 'ed'} {summary}
          </p>
        </motion.div>

        <motion.div
          className="swap-card success-summary-card"
          role="region"
          aria-label="Transaction summary"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: { ...m.fade.enter, delay: 0.95 } }}
        >
          {[
            { label: 'Sent',         value: '0.1 ETH'       },
            { label: 'Received',     value: '324.10 USDC'   },
            { label: 'Rate',         value: '1 ETH = $3,241' },
            { label: 'Network fee',  value: '$0.34'          },
          ].map(({ label, value }) => (
            <div key={label} className="card-bottom" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '9px 0', margin: 0 }}>
              <span className="card-label" style={{ margin: 0 }}>{label}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--bk-text-secondary)' }}>{value}</span>
            </div>
          ))}
        </motion.div>

        <div className="success-actions">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...m.springTight, delay: 1.0 }}
            whileTap={{ scale: 0.97 }}
            style={{ width: '100%' }}
          >
            <Button className="primary-btn" style={{ margin: 0, width: '100%' }} aria-label="View in Activity" onPress={() => navigate('/activity')}>
              View in Activity
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...m.springTight, delay: 1.06 }}
            whileTap={{ scale: 0.97 }}
            style={{ width: '100%' }}
          >
            <Button className="success-secondary-btn" aria-label="Back to Portfolio" onPress={() => navigate('/')}>
              Back to Portfolio
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...m.springTight, delay: 1.12 }}
            whileTap={{ scale: 0.97 }}
            style={{ width: '100%' }}
          >
            <Button className="success-nudge-btn" aria-label={`Set a price alert for ${action === 'swap' ? 'this token' : action}`} onPress={() => navigate('/settings')}>
              <img src={iconNotif} width="14" height="14" aria-hidden="true" /> Set a price alert
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...m.springTight, delay: 1.18 }}
            whileTap={{ scale: 0.97 }}
            style={{ width: '100%' }}
          >
            <Button className="success-share-btn" aria-label="Share transaction" onPress={() => { if (navigator.share) navigator.share({ title: 'Modulo', text: `${action} complete` }).catch(() => {}); }}>
              <img src={iconShare} width="13" height="13" aria-hidden="true" /> Share
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
