import { AnimatePresence, motion } from 'framer-motion';
import { motion as m } from './motion-tokens';
import SidebarNav from './SidebarNav';
import ActionsScreen from './ActionsScreen';
import UndoToast from './UndoToast';
import { useActions } from './ActionsContext';
import './desktop.css';

export default function DesktopLayout({ children }) {
  const { isOpen } = useActions();

  return (
    <div className="desktop-root">
      <SidebarNav />
      <main className="desktop-main">
        {children}
        <UndoToast />
      </main>
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            className="desktop-panel"
            initial={{ x: 340, opacity: 0 }}
            animate={{ x: 0, opacity: 1, transition: m.modal.enter }}
            exit={{ x: 340, opacity: 0, transition: { type: 'spring', stiffness: 280, damping: 26 } }}
          >
            <ActionsScreen variant="panel" />
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}