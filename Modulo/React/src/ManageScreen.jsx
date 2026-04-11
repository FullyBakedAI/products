/**
 * ManageScreen — 2×2 action card grid for Deposit, Withdraw, Send, Receive.
 * All colours via --bk-* tokens. All interactive elements use react-aria Button.
 */

import { motion } from 'framer-motion';
import { motion as m } from './motion-tokens';
import { Button } from 'react-aria-components';
import { useNavigate } from 'react-router-dom';
import { useActions } from './ActionsContext';
const IconArrowDownToLine = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 4V13M10 13L7 10M10 13L13 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 16H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IconArrowUpFromLine = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 13V4M10 4L7 7M10 4L13 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 16H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IconSend = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M17 3L3 8.5L8.5 11L11 16.5L17 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M8.5 11L17 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IconDownload = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 4V13M10 13L7 10M10 13L13 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 16H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IconSettings = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 4V7M10 13V16M4 10H7M13 10H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
import BottomNav from './BottomNav';
import './manage.css';

const CARDS = [
  {
    id: 'deposit',
    label: 'Deposit',
    Icon: IconArrowDownToLine,
    ariaLabel: 'Deposit funds',
  },
  {
    id: 'withdraw',
    label: 'Withdraw',
    Icon: IconArrowUpFromLine,
    ariaLabel: 'Withdraw funds',
  },
  {
    id: 'send',
    label: 'Send',
    Icon: IconSend,
    ariaLabel: 'Send tokens',
  },
  {
    id: 'receive',
    label: 'Receive',
    Icon: IconDownload,
    ariaLabel: 'Receive tokens',
  },
];

const springStagger = {
  container: {
    animate: { transition: { staggerChildren: 0.06 } },
  },
  item: {
    initial: { opacity: 0, y: 16, scale: 0.94 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 340, damping: 26, mass: 0.8 },
    },
  },
};

export default function ManageScreen() {
  const navigate = useNavigate();
  const { openActions } = useActions();

  function handlePress(id) {
    if (id === 'deposit')  openActions({ tab: 'deposit' });
    else if (id === 'withdraw') openActions({ tab: 'withdraw' });
    else if (id === 'send')    navigate('/send');
    else if (id === 'receive') navigate('/receive');
  }

  return (
    <motion.main
      role="main"
      aria-label="Manage screen"
      className="manage-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: m.fade.enter }}
      exit={{ opacity: 0, transition: m.fade.exit }}
    >
      <header className="manage-header">
        <span className="manage-title">Manage</span>
        <Button
          className="manage-settings-btn"
          aria-label="Settings"
          onPress={() => navigate('/settings')}
        >
          <IconSettings size={20} />
        </Button>
      </header>

      <div className="manage-content">
        <motion.div
          className="manage-grid"
          variants={springStagger.container}
          initial="initial"
          animate="animate"
        >
          {CARDS.map(({ id, label, Icon, ariaLabel }) => (
            <motion.div key={id} variants={springStagger.item}>
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button
                  className="manage-card"
                  aria-label={ariaLabel}
                  onPress={() => handlePress(id)}
                >
                  <Icon size={24} strokeWidth={1.5} className="manage-card-icon" />
                  <span className="manage-card-label">{label}</span>
                </Button>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <BottomNav />
    </motion.main>
  );
}
