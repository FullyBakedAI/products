// Shared navigation for the Kite site
function SiteNav({ current }) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const links = [
    { href: 'destinations.html', label: 'Destinations', id: 'destinations' },
    { href: 'blog.html', label: 'Journal', id: 'blog' },
    { href: 'pricing.html', label: 'Pricing', id: 'pricing' },
    { href: 'about.html', label: 'About', id: 'about' },
  ];
  return (
    <nav className={'site-nav' + (scrolled ? ' scrolled' : '')}>
      <div className="site-nav-inner">
        <a className="nav-brand" href="index.html">
          <span className="nav-brand-mark">k</span>
          <span>kite</span>
        </a>
        <ul className="nav-links">
          {links.map(l => (
            <li key={l.id}>
              <a href={l.href} className={current === l.id ? 'active' : ''}>{l.label}</a>
            </li>
          ))}
        </ul>
        <div className="nav-right">
          <a href="app.html" className="btn btn-ghost btn-sm">Open app</a>
          <a href="download.html" className="btn btn-primary btn-sm">Get the app</a>
        </div>
      </div>
    </nav>
  );
}
window.SiteNav = SiteNav;
