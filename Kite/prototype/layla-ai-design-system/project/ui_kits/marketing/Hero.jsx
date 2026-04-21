const { useState: useStateHero } = React;

function Hero({ onChipClick }) {
  const chips = [
    { id: 'new', label: 'Create a new trip', primary: true },
    { id: 'inspire', label: 'Inspire me where to go' },
    { id: 'road', label: 'Plan a road trip' },
    { id: 'last', label: 'Plan a last-minute escape' },
  ];
  return (
    <section style={heroStyles.wrap}>
      <h1 style={heroStyles.h1}>Your trip.<br/><em style={heroStyles.em}>Planned in minutes.</em></h1>
      <p style={heroStyles.lead}>Tell me your style and budget, and I'll design a trip for you.</p>
      <div style={heroStyles.chips}>
        {chips.map(c => (
          <button key={c.id}
            style={{...heroStyles.chip, ...(c.primary ? heroStyles.chipPrimary : {})}}
            onClick={() => onChipClick && onChipClick(c.id)}>
            {c.label}
          </button>
        ))}
      </div>
      <div style={heroStyles.video}>
        <div style={heroStyles.videoInner}>
          <div style={heroStyles.play}>▶</div>
          <div style={heroStyles.vLabel}>See how I can help you</div>
        </div>
      </div>
    </section>
  );
}

const heroStyles = {
  wrap: { maxWidth: 960, margin: '0 auto', padding: '80px 24px 24px', textAlign: 'center' },
  h1: {
    fontFamily: 'var(--font-display)', fontWeight: 400,
    fontSize: 'clamp(48px, 7vw, 92px)', lineHeight: 1.02, letterSpacing: '-0.02em',
    margin: 0, color: 'var(--ink)',
  },
  em: { fontStyle: 'italic', color: 'var(--ink)' },
  lead: { fontSize: 20, color: 'var(--muted-ink)', marginTop: 20, marginBottom: 32 },
  chips: { display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 56 },
  chip: {
    background: '#fff', color: 'var(--ink)',
    border: '1.5px solid var(--line)', padding: '12px 22px',
    borderRadius: 9999, fontSize: 14, fontWeight: 600, cursor: 'pointer',
    fontFamily: 'var(--font-body)',
  },
  chipPrimary: { background: 'var(--ink)', color: '#fff', border: '1.5px solid var(--ink)' },
  video: {
    maxWidth: 720, margin: '0 auto',
    aspectRatio: '16/9', borderRadius: 28,
    background: 'linear-gradient(135deg, #E8DFD3 0%, #F4A88A 60%, #A8D8E8 100%)',
    boxShadow: 'var(--shadow-hero)',
    position: 'relative', overflow: 'hidden',
  },
  videoInner: {
    position: 'absolute', inset: 0,
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16,
  },
  play: {
    width: 72, height: 72, borderRadius: '50%',
    background: 'rgba(255,255,255,.9)', color: 'var(--ink)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 26, paddingLeft: 4, cursor: 'pointer',
    boxShadow: 'var(--shadow-lg)',
  },
  vLabel: { color: '#fff', fontFamily: 'var(--font-display)', fontSize: 22, fontStyle: 'italic', textShadow: '0 2px 8px rgba(0,0,0,.2)' },
};

window.Hero = Hero;
