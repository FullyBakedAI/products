function ChatRail({ messages, onSend, stage }) {
  const suggestions = stage === 0
    ? ['5 days in Lisbon for a couple', 'Road trip through Scotland', 'Family-friendly Tokyo for 7 days']
    : ['Swap the museum for a wine tour', 'Make day 2 more relaxed', 'Find cheaper flights'];

  return (
    <div style={crStyles.wrap}>
      <div style={crStyles.stream}>
        {messages.map((m, i) => <ChatMessage key={i} from={m.from} text={m.text} />)}
        {stage === 1 && (
          <div style={crStyles.typing}>
            <div style={{width: 32, height: 32, borderRadius: '50%', background: 'var(--ink)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 15}}>L</div>
            <div style={crStyles.dots}><span style={crStyles.dot}></span><span style={crStyles.dot}></span><span style={crStyles.dot}></span></div>
          </div>
        )}
      </div>
      <Composer onSend={onSend} suggestions={suggestions} />
    </div>
  );
}

const crStyles = {
  wrap: { flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--paper)', maxWidth: 640 },
  stream: { flex: 1, overflow: 'auto', padding: '24px 28px' },
  typing: { display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14 },
  dots: { background: 'var(--bone)', padding: '14px 18px', borderRadius: '18px 18px 18px 4px', display: 'flex', gap: 4 },
  dot: { width: 6, height: 6, borderRadius: '50%', background: 'var(--faint-ink)', animation: 'pulse 1.2s infinite' },
};

// Inject animation
if (typeof document !== 'undefined' && !document.getElementById('chat-rail-anim')) {
  const s = document.createElement('style');
  s.id = 'chat-rail-anim';
  s.textContent = '@keyframes pulse{0%,100%{opacity:.3}50%{opacity:1}}';
  document.head.appendChild(s);
}

window.ChatRail = ChatRail;
