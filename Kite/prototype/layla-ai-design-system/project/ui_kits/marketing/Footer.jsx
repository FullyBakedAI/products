function Footer() {
  return (
    <footer style={fStyles.wrap}>
      <div style={fStyles.inner}>
        <div style={fStyles.brand}>
          <img src="../../assets/layla-logo-white.svg" style={{height: 28}} />
          <p style={fStyles.tag}>Your AI travel agent, from chat to checkout.</p>
        </div>
        <div style={fStyles.cols}>
          <div><h5 style={fStyles.ch}>Company</h5><a style={fStyles.cl}>Home</a><a style={fStyles.cl}>About</a><a style={fStyles.cl}>Blog</a><a style={fStyles.cl}>Contact</a></div>
          <div><h5 style={fStyles.ch}>Product</h5><a style={fStyles.cl}>Roam Around</a><a style={fStyles.cl}>Itineraries</a><a style={fStyles.cl}>FAQ</a></div>
          <div><h5 style={fStyles.ch}>Legal</h5><a style={fStyles.cl}>Privacy</a><a style={fStyles.cl}>Terms</a><a style={fStyles.cl}>Imprint</a></div>
        </div>
      </div>
      <div style={fStyles.bottom}>
        <span>Made with 🩵 in Berlin</span>
        <span>© 2026 Layla GmbH</span>
      </div>
    </footer>
  );
}

const fStyles = {
  wrap: { background: 'var(--ink)', color: '#fff', marginTop: 80 },
  inner: { maxWidth: 1160, margin: '0 auto', padding: '72px 24px 40px', display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: 40 },
  brand: {},
  tag: { color: 'rgba(255,255,255,.7)', fontSize: 15, marginTop: 16, maxWidth: 300 },
  cols: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 },
  ch: { fontSize: 13, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)', margin: '0 0 16px' },
  cl: { display: 'block', color: '#fff', textDecoration: 'none', fontSize: 14, marginBottom: 10, opacity: .85 },
  bottom: { maxWidth: 1160, margin: '0 auto', padding: '24px', borderTop: '1px solid rgba(255,255,255,.12)', display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'rgba(255,255,255,.6)' },
};

window.Footer = Footer;
