// Shared footer
function SiteFooter() {
  const cols = [
    { title: 'Product', links: ['Destinations', 'How it works', 'Pricing', 'Download'] },
    { title: 'Company', links: ['About', 'Careers', 'Press', 'Journal'] },
    { title: 'Support', links: ['Help center', 'Contact', 'Status', 'Feedback'] },
    { title: 'Legal', links: ['Privacy', 'Terms', 'Cookies', 'Imprint'] },
  ];
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand-wrap">
            <div className="footer-brand">kite</div>
            <p className="footer-tag">Your AI travel planner. Tell us your style and budget, and we'll design the trip.</p>
            <div className="footer-socials">
              <a href="#" aria-label="Instagram" style={{fontSize:13,fontWeight:600,color:'#fff'}}>IG</a>
              <a href="#" aria-label="Twitter" style={{fontSize:13,fontWeight:600,color:'#fff'}}>X</a>
              <a href="#" aria-label="TikTok" style={{fontSize:13,fontWeight:600,color:'#fff'}}>TT</a>
              <a href="#" aria-label="YouTube" style={{fontSize:13,fontWeight:600,color:'#fff'}}>YT</a>
            </div>
          </div>
          {cols.map(c => (
            <div className="footer-col" key={c.title}>
              <h5>{c.title}</h5>
              <ul>
                {c.links.map(l => <li key={l}><a href="#">{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <div>© 2026 Kite Technologies. Made with <span style={{color:'var(--sky)'}}>🩵</span> in Berlin.</div>
          <div>English (US) · EUR €</div>
        </div>
      </div>
    </footer>
  );
}
window.SiteFooter = SiteFooter;
