function HotelCard({ name, area, rating, nights, price, img }) {
  return (
    <div style={hcStyles.card}>
      <div style={{...hcStyles.img, backgroundImage: `url(${img})`}}></div>
      <div style={hcStyles.body}>
        <div style={hcStyles.name}>{name}</div>
        <div style={hcStyles.area}>{area}</div>
        <div style={hcStyles.row}>
          <span style={hcStyles.rate}>★ {rating}</span>
          <span style={{color: 'var(--muted-ink)', fontSize: 12}}>{nights} nights</span>
          <span style={hcStyles.price}>€{price}</span>
        </div>
      </div>
    </div>
  );
}

const hcStyles = {
  card: { background: '#fff', border: '1px solid var(--line)', borderRadius: 16, overflow: 'hidden', display: 'flex', marginBottom: 10 },
  img: { width: 100, flexShrink: 0, backgroundSize: 'cover', backgroundPosition: 'center' },
  body: { padding: 14, flex: 1 },
  name: { fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--ink)' },
  area: { fontSize: 12.5, color: 'var(--muted-ink)', margin: '2px 0 10px' },
  row: { display: 'flex', alignItems: 'center', gap: 12 },
  rate: { background: 'var(--warning-soft)', color: '#8A6B1F', padding: '2px 8px', borderRadius: 9999, fontSize: 12, fontWeight: 600 },
  price: { marginLeft: 'auto', fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink)' },
};

window.HotelCard = HotelCard;
