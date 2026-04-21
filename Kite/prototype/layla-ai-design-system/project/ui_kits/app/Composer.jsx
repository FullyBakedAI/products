const { useState: useStateComposer } = React;

function Composer({ onSend, suggestions = [] }) {
  const [value, setValue] = useStateComposer('');
  const submit = () => {
    if (!value.trim()) return;
    onSend && onSend(value.trim());
    setValue('');
  };
  return (
    <div style={compStyles.wrap}>
      {suggestions.length > 0 && (
        <div style={compStyles.sugs}>
          {suggestions.map((s, i) => (
            <button key={i} style={compStyles.sug} onClick={() => onSend && onSend(s)}>{s}</button>
          ))}
        </div>
      )}
      <div style={compStyles.bar}>
        <input
          style={compStyles.input}
          placeholder="Ask Layla anything about your trip…"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
        />
        <button style={compStyles.send} onClick={submit} aria-label="Send">↑</button>
      </div>
    </div>
  );
}

const compStyles = {
  wrap: { padding: 16, background: 'var(--paper)', borderTop: '1px solid var(--line)' },
  sugs: { display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' },
  sug: { background: 'var(--bone)', border: '1px solid var(--line)', color: 'var(--ink)', padding: '6px 14px', borderRadius: 9999, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-body)' },
  bar: { display: 'flex', gap: 8, background: 'var(--paper)', border: '1.5px solid var(--line)', borderRadius: 9999, padding: '6px 6px 6px 20px', alignItems: 'center', boxShadow: 'var(--shadow-sm)' },
  input: { flex: 1, border: 0, outline: 0, fontSize: 15, fontFamily: 'var(--font-body)', background: 'transparent', color: 'var(--ink)' },
  send: { background: 'var(--ink)', color: '#fff', border: 0, width: 40, height: 40, borderRadius: '50%', cursor: 'pointer', fontSize: 18 },
};

window.Composer = Composer;
