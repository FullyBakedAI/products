function FlightCard({ airline, code, from, to, depart, arrive, duration, stops, price }) {
  return (
    <div style={fcStyles.card}>
      <div style={fcStyles.header}>
        <div style={fcStyles.airline}>{code}</div>
        <div style={{fontSize: 13, color: 'var(--muted-ink)'}}>{airline}</div>
        <div style={{marginLeft: 'auto', fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--ink)'}}>€{price}</div>
      </div>
      <div style={fcStyles.route}>
        <div><div style={fcStyles.time}>{depart}</div><div style={fcStyles.loc}>{from}</div></div>
        <div style={fcStyles.line}>
          <div style={{height: 1, background: 'var(--line)', flex: 1}}></div>
          <span style={{fontSize: 14}}>✈</span>
          <div style={{height: 1, background: 'var(--line)', flex: 1}}></div>
        </div>
        <div style={{textAlign: 'right'}}><div style={fcStyles.time}>{arrive}</div><div style={fcStyles.loc}>{to}</div></div>
      </div>
      <div style={fcStyles.meta}>{duration} · {stops === 0 ? 'direct' : `${stops} stop${stops > 1 ? 's' : ''}`}</div>
    </div>
  );
}

const fcStyles = {
  card: { background: '#fff', border: '1px solid var(--line)', borderRadius: 16, padding: 16, marginBottom: 10 },
  header: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 },
  airline: { width: 32, height: 32, borderRadius: '50%', background: 'var(--ink)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 },
  route: { display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', alignItems: 'center', gap: 12 },
  time: { fontSize: 18, fontWeight: 600, color: 'var(--ink)' },
  loc: { fontSize: 11, color: 'var(--muted-ink)', fontFamily: 'var(--font-mono)', letterSpacing: '.04em' },
  line: { display: 'flex', alignItems: 'center', gap: 8 },
  meta: { fontSize: 12, color: 'var(--muted-ink)', textAlign: 'center', marginTop: 10 },
};

window.FlightCard = FlightCard;
