/**
 * NotificationsPanel — slide-up sheet from bell icon
 * All colours via --bk-* tokens. All data mocked.
 */

import { useState } from 'react';
import { Button } from 'react-aria-components';
import { motion, AnimatePresence } from 'framer-motion';
import { motion as m } from './motion-tokens';
import './notifications.css';

const IconX = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IconArrowUpRight = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M6 14L14 6M14 6H8M14 6V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconTrendingUp = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M3 14L8 9L11 12L17 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13 6H17V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconZap = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M11 3L4 11H10L9 17L16 9H10L11 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);
const IconRepeat = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M4 7H16M16 7L13 4M16 7L13 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 13H4M4 13L7 16M4 13L7 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconBell = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 2a6 6 0 0 0-6 6v3l-1.5 2.5h15L16 11V8a6 6 0 0 0-6-6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M8.5 17.5a1.5 1.5 0 0 0 3 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const NOTIFS = [
  {
    id: 1, group: 'Today', unread: true, type: 'swap',
    title: 'Swap confirmed',
    desc: '0.1 ETH → 324.10 USDC on Ethereum',
    time: '2h ago',
    Icon: IconRepeat,
    color: 'var(--bk-brand-primary)',
  },
  {
    id: 2, group: 'Today', unread: true, type: 'yield',
    title: 'Daily yield earned',
    desc: '+$2.65 across 4 protocols',
    time: '5h ago',
    Icon: IconTrendingUp,
    color: 'var(--bk-success)',
  },
  {
    id: 3, group: 'Today', unread: false, type: 'alert',
    title: 'Price alert: BTC',
    desc: 'Bitcoin dropped below $91,000',
    time: '8h ago',
    Icon: IconArrowUpRight,
    color: 'var(--bk-error)',
  },
  {
    id: 4, group: 'Yesterday', unread: false, type: 'autopilot',
    title: 'Autopilot rebalanced',
    desc: 'Moved 500 USDC to Aave v3 (5.2% APY)',
    time: 'Yesterday',
    Icon: IconZap,
    color: 'var(--bk-brand-primary)',
  },
  {
    id: 5, group: 'Yesterday', unread: false, type: 'system',
    title: 'New chain: zkSync Era',
    desc: 'Your assets are now bridgeable to zkSync Era',
    time: 'Yesterday',
    Icon: IconBell,
    color: 'var(--bk-text-muted)',
  },
];

export default function NotificationsPanel({ onClose }) {
  const [notifs, setNotifs] = useState(NOTIFS);
  const unreadCount = notifs.filter(n => n.unread).length;

  function markAllRead() {
    setNotifs(prev => prev.map(n => ({ ...n, unread: false })));
  }

  const groups = ['Today', 'Yesterday'];

  return (
    <AnimatePresence>
      <>
        {/* Backdrop */}
        <motion.div
          className="notif-backdrop"
          aria-label="Close notifications"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Panel */}
        <motion.div
          className="notif-panel"
          role="dialog"
          aria-label="Notifications"
          aria-modal="true"
          initial={{ y: '100%' }}
          animate={{ y: 0, transition: { ...m.modal.enter, duration: 0.28 } }}
          exit={{ y: '100%', transition: { duration: 0.22, ease: 'easeIn' } }}
        >
          <div className="drag-handle" aria-hidden="true">
            <div className="drag-handle-pill" />
          </div>

          <div className="notif-header">
            <span className="notif-title">
              Notifications
              {unreadCount > 0 && (
                <span className="notif-count" aria-label={`${unreadCount} unread`}>{unreadCount}</span>
              )}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {unreadCount > 0 && (
                <Button className="notif-mark-read" onPress={markAllRead} aria-label="Mark all as read">
                  Mark all read
                </Button>
              )}
              <Button className="close-btn-shared" aria-label="Close notifications" onPress={onClose}>
                <IconX />
              </Button>
            </div>
          </div>

          <div className="notif-list" role="list">
            {groups.map(group => {
              const items = notifs.filter(n => n.group === group);
              if (!items.length) return null;
              return (
                <div key={group}>
                  <div className="notif-group-label">{group}</div>
                  {items.map((n, i) => (
                    <motion.div
                      key={n.id}
                      role="listitem"
                      className={`notif-row${n.unread ? ' unread' : ''}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0, transition: { ...m.fade.enter, delay: 0.06 + i * 0.04 } }}
                    >
                      <div
                        className="notif-icon-wrap"
                        style={{ background: `color-mix(in srgb, ${n.color} 15%, transparent)` }}
                        aria-hidden="true"
                      >
                        <span style={{ color: n.color, display: 'flex' }}>
                          <n.Icon />
                        </span>
                      </div>
                      <div className="notif-text">
                        <div className="notif-row-title">{n.title}</div>
                        <div className="notif-row-desc">{n.desc}</div>
                      </div>
                      <div className="notif-meta">
                        <span className="notif-time">{n.time}</span>
                        {n.unread && <span className="notif-unread-dot" aria-hidden="true" />}
                      </div>
                    </motion.div>
                  ))}
                </div>
              );
            })}
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  );
}
