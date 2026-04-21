function FeaturePillars() {
  const items = [
    { title: 'Tailor-made', body: "I create a personalized itinerary aligned to your style and budget — every moment built around you." },
    { title: 'Cheaper', body: "I compare live prices for flights, hotels and activities so you spend less without sacrificing the good stuff." },
    { title: 'Hidden Gems', body: "I surface off-the-beaten-path spots — charming villages, local secrets, breathtaking landscapes." },
    { title: 'No Surprises', body: "From flights to stays, I keep everything running smoothly so you can focus on the trip itself." },
  ];
  return (
    <section style={fpStyles.wrap}>
      <div style={fpStyles.head}>
        <h2 style={fpStyles.h2}>I will be there for you in every step</h2>
        <p style={fpStyles.lead}>Curate, save and get notified about your trips on the go.</p>
      </div>
      <div style={fpStyles.grid}>
        {items.map((it, i) => (
          <div key={i} style={fpStyles.card}>
            <div style={{...fpStyles.num, background: ['var(--sky-soft)','var(--coral-soft)','var(--sand)','var(--warning-soft)'][i]}}>{i+1}</div>
            <h3 style={fpStyles.title}>{it.title}</h3>
            <p style={fpStyles.body}>{it.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const fpStyles = {
  wrap: { maxWidth: 1160, margin: '0 auto', padding: '96px 24px', background: 'var(--bone)' },
  head: { textAlign: 'center', marginBottom: 56 },
  h2: { fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 56, letterSpacing: '-0.02em', margin: 0, color: 'var(--ink)' },
  lead: { fontSize: 18, color: 'var(--muted-ink)', marginTop: 12 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 },
  card: { background: '#fff', borderRadius: 20, padding: 28, boxShadow: 'var(--shadow-md)' },
  num: { width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink)', marginBottom: 16 },
  title: { fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 24, margin: '0 0 8px', color: 'var(--ink)' },
  body: { fontSize: 14.5, lineHeight: 1.6, color: 'var(--muted-ink)', margin: 0 },
};

window.FeaturePillars = FeaturePillars;
