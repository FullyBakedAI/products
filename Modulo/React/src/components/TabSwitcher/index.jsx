/**
 * TabSwitcher — White-Label Component
 *
 * Segmented tab control using React ARIA TabList + Tab.
 * Active state driven by data-selected attribute set automatically by React ARIA.
 * Parent manages selection state via activeTab + onChange props.
 *
 * Props:
 * - tabs: Array<{ id: string, label: string }> — tab definitions
 * - activeTab: string — id of currently selected tab
 * - onChange: (id: string) => void — called on tab change
 *
 * React ARIA: Tabs + TabList + Tab primitives
 * Token deps: --bk-text-muted, --bk-text-primary, --bk-brand-primary, --bk-border-subtle, --bk-font
 */

import { Tabs, TabList, Tab } from 'react-aria-components';
import './styles.css';

export function TabSwitcher({ tabs, activeTab, onChange }) {
  return (
    <Tabs
      selectedKey={activeTab}
      onSelectionChange={onChange}
      className="tab-switcher"
    >
      <TabList className="tab-switcher-list" aria-label="Tabs">
        {tabs.map(tab => (
          <Tab key={tab.id} id={tab.id} className="tab-switcher-tab">
            {tab.label}
          </Tab>
        ))}
      </TabList>
    </Tabs>
  );
}
