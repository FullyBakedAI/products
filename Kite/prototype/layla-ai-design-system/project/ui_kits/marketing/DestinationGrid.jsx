function DestinationGrid() {
  const items = [
    { title: 'Family · Europe Trip', img: '../../assets/photos/tuscany.svg', meta: '7 days · Italy & France' },
    { title: 'Couples · Honeymoon in Jordan', img: '../../assets/photos/paris.svg', meta: '10 days · Amman · Petra' },
    { title: 'Road Trip Highway 1', img: '../../assets/photos/roadtrip.svg', meta: '9 days · USA' },
  ];
  return (
    <section style={dgStyles.wrap}>
      <h2 style={dgStyles.h2}>Where to go next</h2>
      <div style={dgStyles.grid}>
        {items.map((it, i) => (
          <div key={i} style={dgStyles.card} onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform=''}>
            <div style={{...dgStyles.img, backgroundImage: `url(${it.img})`}} />
            <div style={dgStyles.body}>
              <h3 style={dgStyles.title}>{it.title}</h3>
              <p style={dgStyles.meta}>{it.meta}</p>
              <a style={dgStyles.link}>Start planning →</a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const dgStyles = {
  wrap: { maxWidth: 1160, margin: '0 auto', padding: '96px 24px' },
  h2: { fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 56, letterSpacing: '-0.02em', textAlign: 'center', marginBottom: 48, color: 'var(--ink)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 },
  card: { background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: 'var(--shadow-md)', transition: 'transform .25s var(--ease-out)', cursor: 'pointer' },
  img: { aspectRatio: '4/3', backgroundSize: 'cover', backgroundPosition: 'center' },
  body: { padding: 20 },
  title: { fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 22, margin: 0, color: 'var(--ink)' },
  meta: { fontSize: 14, color: 'var(--muted-ink)', margin: '6px 0 14px' },
  link: { color: 'var(--ink)', fontSize: 14, fontWeight: 600, textDecoration: 'underline', textDecorationColor: 'var(--sky-strong)', textUnderlineOffset: 3 },
};

window.DestinationGrid = DestinationGrid;
