// Destinations page — filterable grid
function DestinationsPage() {
  const [filter, setFilter] = React.useState('all');
  const cats = [
    { id: 'all', label: 'All' },
    { id: 'Trending', label: 'Trending' },
    { id: 'City break', label: 'City breaks' },
    { id: 'Adventure', label: 'Adventure' },
    { id: 'Slow travel', label: 'Slow travel' },
    { id: 'Romance', label: 'Romance' },
    { id: 'Cultural', label: 'Cultural' },
  ];
  const list = window.KITE_DESTINATIONS.filter(d => filter === 'all' || d.tag === filter);
  return (
    <div data-screen-label="Destinations">
      <SiteNav current="destinations" />
      <section style={{padding:'72px 24px 32px', maxWidth:1040, margin:'0 auto', textAlign:'center'}}>
        <div className="eyebrow-pill" style={{marginBottom:16}}>190+ countries, endless possibilities</div>
        <h1 className="display">Go <em>anywhere.</em></h1>
        <p className="lead" style={{marginTop:20, maxWidth:560, marginLeft:'auto', marginRight:'auto'}}>
          Browse where our travelers are heading — or just tell Kite what kind of trip you want, and we'll pick for you.
        </p>
      </section>
      <section className="section-tight">
        <div className="container">
          <div style={{display:'flex', gap:8, flexWrap:'wrap', marginBottom:32, justifyContent:'center'}}>
            {cats.map(c => (
              <button key={c.id} onClick={() => setFilter(c.id)}
                className={'btn btn-sm ' + (filter===c.id ? 'btn-primary' : 'btn-ghost')}
                style={{background: filter===c.id ? 'var(--ink)' : '#fff'}}>
                {c.label}
              </button>
            ))}
          </div>
          <div className="grid grid-4">
            {list.map(d => (
              <div key={d.city} className="dest-card">
                <div className={'ph ' + d.cls}/>
                <div className="tag">{d.tag}</div>
                <div className="meta">
                  <h4>{d.city}</h4>
                  <div className="sub">{d.country} · {d.days}</div>
                </div>
              </div>
            ))}
          </div>
          {list.length === 0 && <p style={{textAlign:'center', padding:'48px 0', color:'var(--muted-ink)'}}>No destinations in this category yet.</p>}
        </div>
      </section>
      <SiteFooter/>
      <TweaksPanel/>
    </div>
  );
}
window.DestinationsPage = DestinationsPage;
