function ChatMessage({ from, text, children }) {
  const isLayla = from === 'layla';
  return (
    <div style={{display: 'flex', gap: 10, marginBottom: 14, justifyContent: isLayla ? 'flex-start' : 'flex-end'}}>
      {isLayla && <div style={cmStyles.av}>L</div>}
      <div style={{...cmStyles.msg, ...(isLayla ? cmStyles.laylaBubble : cmStyles.userBubble)}}>
        {text && <div>{text}</div>}
        {children}
      </div>
      {!isLayla && <div style={{...cmStyles.av, background: 'var(--sky)', color: 'var(--ink)'}}>Y</div>}
    </div>
  );
}

const cmStyles = {
  av: { width: 32, height: 32, borderRadius: '50%', background: 'var(--ink)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 15, flexShrink: 0 },
  msg: { maxWidth: '78%', padding: '12px 16px', fontSize: 14.5, lineHeight: 1.55 },
  laylaBubble: { background: 'var(--bone)', color: 'var(--ink)', borderRadius: '18px 18px 18px 4px' },
  userBubble: { background: 'var(--ink)', color: '#fff', borderRadius: '18px 18px 4px 18px' },
};

window.ChatMessage = ChatMessage;
