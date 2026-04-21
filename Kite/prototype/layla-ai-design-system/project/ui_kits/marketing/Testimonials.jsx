function Testimonials() {
  const items = [
    { quote: "Layla.ai is hands down the best AI travel agent I've ever used; built a custom itinerary for our family vacation in minutes.", name: 'Scott', age: 54, initials: 'S5' },
    { quote: "We booked our dream honeymoon through Layla — flights, hotels and activities all handled better than any traditional travel agent.", name: 'Yesenia', age: 32, initials: 'Y3' },
    { quote: "As a busy parent, I loved that Layla acted like a personal travel agent. Saved hours of research and delivered amazing experiences.", name: 'Neil', age: 60, initials: 'N6' },
  ];
  return (
    <section style={tStyles.wrap}>
      <h2 style={tStyles.h2}>What travellers say about me</h2>
      <div style={tStyles.grid}>
        {items.map((it, i) => (
          <div key={i} style={tStyles.card}>
            <div style={tStyles.stars}>★★★★★</div>
            <p style={tStyles.quote}>"{it.quote}"</p>
            <div style={tStyles.by}>
              <div style={tStyles.av}>{it.initials}</div>
              <div style={{fontSize: 14, fontWeight: 600, color: 'var(--ink)'}}>{it.name}, {it.age}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const tStyles = {
  wrap: { maxWidth: 1160, margin: '0 auto', padding: '96px 24px' },
  h2: { fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 56, letterSpacing: '-0.02em', textAlign: 'center', marginBottom: 48, color: 'var(--ink)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 },
  card: { background: '#fff', borderRadius: 20, padding: 28, boxShadow: 'var(--shadow-md)' },
  stars: { color: 'var(--gold)', fontSize: 16, letterSpacing: 2, marginBottom: 14 },
  quote: { fontFamily: 'var(--font-display)', fontSize: 20, lineHeight: 1.4, color: 'var(--ink)', margin: '0 0 20px' },
  by: { display: 'flex', alignItems: 'center', gap: 12 },
  av: { width: 36, height: 36, borderRadius: '50%', background: 'var(--sand)', color: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600 },
};

window.Testimonials = Testimonials;
