const { useState } = React;

function Nav() {
  return (
    <nav style={navStyles.wrap}>
      <div style={navStyles.inner}>
        <img src="../../assets/layla-logo.svg" style={{height: 22}} alt="Layla" />
        <div style={navStyles.links}>
          <a style={navStyles.link}>Itineraries</a>
          <a style={navStyles.link}>Road trips</a>
          <a style={navStyles.link}>Blog</a>
          <a style={navStyles.link}>About</a>
        </div>
        <button style={navStyles.cta}>Plan my trip</button>
      </div>
    </nav>
  );
}

const navStyles = {
  wrap: {
    position: 'sticky', top: 16, zIndex: 10,
    padding: '0 24px',
  },
  inner: {
    maxWidth: 1160, margin: '0 auto',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '10px 16px 10px 24px',
    background: 'rgba(255,255,255,.85)',
    backdropFilter: 'blur(16px)',
    border: '1px solid var(--line)',
    borderRadius: 9999,
    boxShadow: 'var(--shadow-sm)',
  },
  links: { display: 'flex', gap: 28, fontSize: 14, fontWeight: 500 },
  link: { color: 'var(--ink)', textDecoration: 'none', cursor: 'pointer' },
  cta: {
    background: 'var(--ink)', color: '#fff', border: 0,
    padding: '10px 20px', borderRadius: 9999,
    fontSize: 14, fontWeight: 600, cursor: 'pointer',
    fontFamily: 'var(--font-body)',
  },
};

window.Nav = Nav;
