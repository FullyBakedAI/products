const { useState: useStateIt } = React;

function ItineraryPanel({ trip }) {
  return (
    <aside style={ipStyles.wrap}>
      <div style={ipStyles.header}>
        <div style={{flex: 1}}>
          <div style={ipStyles.eyebrow}>YOUR TRIP</div>
          <h2 style={ipStyles.title}>{trip.title}</h2>
          <div style={ipStyles.meta}>{trip.dates} · {trip.travelers}</div>
        </div>
        <button style={ipStyles.share}>Share</button>
      </div>

      <div style={ipStyles.summary}>
        <div style={ipStyles.stat}><div style={ipStyles.sv}>€{trip.total}</div><div style={ipStyles.sl}>Estimated total</div></div>
        <div style={ipStyles.stat}><div style={ipStyles.sv}>{trip.days}</div><div style={ipStyles.sl}>Days</div></div>
        <div style={ipStyles.stat}><div style={ipStyles.sv}>{trip.activities}</div><div style={ipStyles.sl}>Activities</div></div>
      </div>

      <div style={ipStyles.body}>
        {trip.cards}
      </div>
    </aside>
  );
}

const ipStyles = {
  wrap: { width: 460, background: 'var(--bone)', borderLeft: '1px solid var(--line)', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  header: { padding: '24px 24px 16px', display: 'flex', alignItems: 'flex-start', gap: 12 },
  eyebrow: { fontSize: 11, fontWeight: 600, letterSpacing: '.12em', color: 'var(--muted-ink)' },
  title: { fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--ink)', margin: '6px 0 4px', lineHeight: 1.1 },
  meta: { fontSize: 13, color: 'var(--muted-ink)' },
  share: { background: '#fff', border: '1.5px solid var(--ink)', color: 'var(--ink)', padding: '8px 16px', borderRadius: 9999, fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  summary: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, padding: '0 24px 20px' },
  stat: { background: '#fff', borderRadius: 12, padding: 14, border: '1px solid var(--line)' },
  sv: { fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)' },
  sl: { fontSize: 11, color: 'var(--muted-ink)', marginTop: 2 },
  body: { flex: 1, overflow: 'auto', padding: '8px 24px 24px' },
};

window.ItineraryPanel = ItineraryPanel;
