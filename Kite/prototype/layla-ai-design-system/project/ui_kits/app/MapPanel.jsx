// MapPanel — stylized static map with pinned stops
function MapPanel({ stops }) {
  const defaultStops = stops || [
    { day: 1, name: 'Memmo Alfama', x: 42, y: 58 },
    { day: 1, name: 'Miradouro', x: 48, y: 52 },
    { day: 2, name: 'Jerónimos', x: 18, y: 72 },
    { day: 2, name: 'MAAT', x: 15, y: 76 },
    { day: 3, name: 'Sintra', x: 8, y: 34 },
    { day: 3, name: 'Pena Palace', x: 12, y: 28 },
  ];
  const dayColor = {
    1: 'var(--ink)', 2: 'var(--coral)', 3: 'var(--sky-strong)', 4: 'var(--success)', 5: 'var(--gold)',
  };

  return (
    <aside style={mapStyles.wrap}>
      <div style={mapStyles.head}>
        <div>
          <div style={mapStyles.eyebrow}>Trip map</div>
          <div style={mapStyles.title}>Lisbon & Sintra</div>
        </div>
        <div style={mapStyles.segment}>
          <button style={{...mapStyles.segBtn, ...mapStyles.segBtnOn}}>Map</button>
          <button style={mapStyles.segBtn}>Satellite</button>
        </div>
      </div>

      <div style={mapStyles.mapBox}>
        {/* Stylized base map */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" style={mapStyles.svg}>
          {/* Land */}
          <rect width="100" height="100" fill="#EDE7DD"/>
          {/* Water — Tagus + Atlantic */}
          <path d="M0 82 L22 78 L38 84 L55 82 L72 88 L100 86 L100 100 L0 100 Z" fill="#A8D8E8" opacity="0.6"/>
          <path d="M0 0 L24 0 L20 20 L4 28 L0 24 Z" fill="#A8D8E8" opacity="0.35"/>
          {/* Parks */}
          <ellipse cx="30" cy="42" rx="10" ry="6" fill="#5FA574" opacity="0.18"/>
          <ellipse cx="62" cy="38" rx="8" ry="5" fill="#5FA574" opacity="0.15"/>
          {/* Roads */}
          <g stroke="#FAF7F2" strokeWidth="0.6" fill="none" opacity="0.9">
            <path d="M2 50 Q 30 48, 50 55 T 98 60"/>
            <path d="M8 22 Q 25 38, 45 44 T 85 52"/>
            <path d="M20 80 Q 40 70, 60 72 T 95 75"/>
            <path d="M50 10 Q 52 40, 55 60 T 58 92"/>
          </g>
          <g stroke="#E8DFD3" strokeWidth="0.3" fill="none" opacity="0.9">
            <path d="M0 35 L100 38"/>
            <path d="M0 65 L100 62"/>
            <path d="M25 0 L28 100"/>
            <path d="M75 0 L72 100"/>
          </g>
          {/* Route dashed line connecting stops in order */}
          <polyline
            points={defaultStops.map(s => `${s.x},${s.y}`).join(' ')}
            fill="none"
            stroke="#2A182E"
            strokeWidth="0.5"
            strokeDasharray="1.2 1.2"
            opacity="0.6"
          />
        </svg>

        {/* Pins */}
        {defaultStops.map((s, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${s.x}%`, top: `${s.y}%`,
            transform: 'translate(-50%, -100%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
          }}>
            <div style={{
              background: dayColor[s.day] || 'var(--ink)',
              color: s.day >= 3 ? 'var(--ink)' : '#fff',
              fontSize: 10, fontWeight: 700,
              padding: '3px 8px', borderRadius: 9999,
              whiteSpace: 'nowrap', boxShadow: 'var(--shadow-sm)',
              border: '1.5px solid #fff',
            }}>D{s.day} · {s.name}</div>
            <div style={{
              width: 10, height: 10, borderRadius: '50%',
              background: dayColor[s.day] || 'var(--ink)',
              border: '2px solid #fff',
              boxShadow: 'var(--shadow-sm)',
            }}/>
          </div>
        ))}

        {/* Map controls */}
        <div style={mapStyles.zoom}>
          <button style={mapStyles.zoomBtn}>+</button>
          <div style={{height:1, background:'var(--line)'}}/>
          <button style={mapStyles.zoomBtn}>−</button>
        </div>

        {/* Legend */}
        <div style={mapStyles.legend}>
          {[1,2,3].map(d => (
            <div key={d} style={{display:'flex', alignItems:'center', gap:6}}>
              <span style={{width:8, height:8, borderRadius:'50%', background: dayColor[d]}}/>
              <span style={{fontSize:11, color:'var(--ink)', fontWeight:500}}>Day {d}</span>
            </div>
          ))}
        </div>

        {/* Scale */}
        <div style={mapStyles.scale}>
          <div style={{width:40, height:3, background:'var(--ink)'}}/>
          <div style={{fontSize:10, color:'var(--muted-ink)', marginTop:2}}>2 km</div>
        </div>
      </div>

      <div style={mapStyles.statRow}>
        <div style={mapStyles.stat}>
          <div style={mapStyles.statLabel}>Distance</div>
          <div style={mapStyles.statValue}>42 km</div>
        </div>
        <div style={mapStyles.stat}>
          <div style={mapStyles.statLabel}>Walking</div>
          <div style={mapStyles.statValue}>8.4 km</div>
        </div>
        <div style={mapStyles.stat}>
          <div style={mapStyles.statLabel}>Transit</div>
          <div style={mapStyles.statValue}>3 rides</div>
        </div>
      </div>
    </aside>
  );
}

const mapStyles = {
  wrap: {
    width: 380, flexShrink: 0,
    borderLeft: '1px solid var(--line)',
    background: '#fff',
    display: 'flex', flexDirection: 'column',
  },
  head: {
    padding: '16px 20px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    borderBottom: '1px solid var(--line)',
  },
  eyebrow: { fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted-ink)', fontWeight: 600 },
  title: { fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 22, color: 'var(--ink)', marginTop: 2 },
  segment: { display: 'flex', background: 'var(--bg-sunken)', padding: 3, borderRadius: 9999 },
  segBtn: {
    padding: '6px 12px', border: 'none', background: 'transparent',
    fontSize: 12, fontWeight: 600, color: 'var(--muted-ink)',
    borderRadius: 9999, cursor: 'pointer', fontFamily: 'var(--font-body)',
  },
  segBtnOn: { background: '#fff', color: 'var(--ink)', boxShadow: 'var(--shadow-sm)' },
  mapBox: {
    flex: 1, position: 'relative', overflow: 'hidden',
  },
  svg: { width: '100%', height: '100%', display: 'block' },
  zoom: {
    position: 'absolute', right: 12, top: 12,
    background: '#fff', borderRadius: 10,
    boxShadow: 'var(--shadow-md)', border: '1px solid var(--line)',
    display: 'flex', flexDirection: 'column',
  },
  zoomBtn: {
    width: 32, height: 32, border: 'none', background: 'transparent',
    fontSize: 18, fontWeight: 400, cursor: 'pointer', color: 'var(--ink)',
  },
  legend: {
    position: 'absolute', left: 12, top: 12,
    background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(6px)',
    padding: '8px 12px', borderRadius: 10,
    display: 'flex', flexDirection: 'column', gap: 6,
    border: '1px solid var(--line)',
  },
  scale: {
    position: 'absolute', right: 12, bottom: 12,
    background: 'rgba(255,255,255,0.85)', padding: '4px 8px', borderRadius: 6,
  },
  statRow: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
    borderTop: '1px solid var(--line)',
  },
  stat: {
    padding: '14px 16px',
    borderRight: '1px solid var(--line)',
  },
  statLabel: {
    fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
    color: 'var(--muted-ink)', fontWeight: 600,
  },
  statValue: {
    fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)', marginTop: 2,
  },
};

window.MapPanel = MapPanel;
