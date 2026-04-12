import { useState } from 'react';
import './password-gate.css';

const SESSION_KEY = 'modulo-access';
const CORRECT = 'B4k3d-M0dul0!';

export function usePasswordGate() {
  return localStorage.getItem(SESSION_KEY) === '1';
}

export default function PasswordGate({ children }) {
  const [unlocked, setUnlocked] = useState(
    () => localStorage.getItem(SESSION_KEY) === '1'
  );
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (value === CORRECT) {
      localStorage.setItem(SESSION_KEY, '1');
      setUnlocked(true);
    } else {
      setError(true);
      setShake(true);
      setValue('');
      setTimeout(() => setShake(false), 500);
    }
  }

  if (unlocked) return children;

  return (
    <div className="pg-overlay">
      <div className={`pg-card${shake ? ' pg-shake' : ''}`}>
        <div className="pg-logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect x="6" y="14" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M10 14V10a6 6 0 0 1 12 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="16" cy="21" r="2" fill="currentColor"/>
          </svg>
        </div>
        <p className="pg-label">Enter access code</p>
        <form onSubmit={handleSubmit} className="pg-form">
          <input
            className={`pg-input${error ? ' pg-error' : ''}`}
            type="password"
            value={value}
            onChange={e => { setValue(e.target.value); setError(false); }}
            placeholder="••••••••••"
            autoFocus
            autoComplete="off"
          />
          <button className="pg-btn" type="submit">Enter</button>
        </form>
        {error && <p className="pg-err-msg">Incorrect code</p>}
        <p className="pg-footer">Modulo — private preview</p>
      </div>
    </div>
  );
}
