function ActivityCard({ name, time, duration, price, type }) {
  const colors = {
    food: { bg: 'var(--coral-soft)', fg: '#8A3F25', icon: '🍝' },
    culture: { bg: 'var(--sky-soft)', fg: '#2A6A80', icon: '🎨' },
    nature: { bg: 'var(--success-soft)', fg: '#2E6940', icon: '🌿' },
    view: { bg: 'var(--warning-soft)', fg: '#8A6B1F', icon: '🌇' },
  };
  const c = colors[type] || colors.culture;
  return (
    <div style={acStyles.card}>
      <div style={{...acStyles.icon, background: c.bg, color: c.fg}}>{c.icon}</div>
      <div style={{flex: 1}}>
        <div style={acStyles.name}>{name}</div>
        <div style={acStyles.meta}>{time} · {duration}</div>
      </div>
      {price && <div style={acStyles.price}>€{price}</div>}
    </div>
  );
}

const acStyles = {
  card: { background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 12, padding: 12, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 },
  icon: { width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 },
  name: { fontSize: 14, fontWeight: 600, color: 'var(--ink)' },
  meta: { fontSize: 12, color: 'var(--muted-ink)', marginTop: 2 },
  price: { fontSize: 13, fontWeight: 600, color: 'var(--ink)' },
};

window.ActivityCard = ActivityCard;
