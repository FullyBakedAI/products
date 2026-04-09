/**
 * PhonePreview — reusable iPhone 17 Pro phone frame (402×874px, border-radius 44px).
 * Renders a product screen via an in-memory router. No V1, no dev inspect.
 */
import { useMemo } from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { SwapProvider } from '../SwapContext';
import HomeScreen from '../HomeScreen';
import SwapScreen from '../SwapScreen';
import SwapSelectScreen from '../SwapSelectScreen';
import ExploreScreen from '../ExploreScreen';
import SendScreen from '../SendScreen';
import ReceiveScreen from '../ReceiveScreen';

export const PREVIEW_SCREENS = [
  { label: 'Home',    path: '/' },
  { label: 'Swap',    path: '/swap' },
  { label: 'Explore', path: '/explore' },
  { label: 'Send',    path: '/send' },
  { label: 'Receive', path: '/receive' },
];

const PREVIEW_ROUTES = [
  { path: '/',                  element: <SwapProvider><HomeScreen /></SwapProvider> },
  { path: '/swap',              element: <SwapProvider><SwapScreen /></SwapProvider> },
  { path: '/swap/select/:side', element: <SwapProvider><SwapSelectScreen /></SwapProvider> },
  { path: '/explore',           element: <SwapProvider><ExploreScreen /></SwapProvider> },
  { path: '/send',              element: <SwapProvider><SendScreen /></SwapProvider> },
  { path: '/receive',           element: <SwapProvider><ReceiveScreen /></SwapProvider> },
];

/**
 * @param {string} screen  - Route path to display initially (e.g. '/', '/swap')
 * @param {'dark'|'light'} theme - Phone colour mode
 */
export default function PhonePreview({ screen = '/', theme = 'dark' }) {
  const router = useMemo(
    () => createMemoryRouter(PREVIEW_ROUTES, { initialEntries: [screen] }),
    [screen] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <div className={`ds-phone-outer${theme === 'light' ? ' theme-light' : ''}`}>
      <div className="phone ds-phone-frame">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}
