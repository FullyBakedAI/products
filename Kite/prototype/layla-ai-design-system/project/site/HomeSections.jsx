// Homepage v1 — faithful to Layla: centered chat-input hero, chips, video placeholder
function HomeHero() {
  const [input, setInput] = React.useState('');
  const chips = [
    { id: 'new', label: 'Create a new trip', primary: true, icon: 'sparkles' },
    { id: 'inspire', label: 'Inspire me where to go', icon: 'compass' },
    { id: 'road', label: 'Plan a road trip', icon: 'car' },
    { id: 'last', label: 'Last-minute escape', icon: 'plane' },
  ];
  return (
    <section style={{padding:'72px 24px 48px', maxWidth:1040, margin:'0 auto', textAlign:'center'}}>
      <div className="eyebrow-pill" style={{marginBottom:24}}>
        <span>Now live in 190+ countries</span>
      </div>
      <h1 className="display">
        Your trip.<br/>
        <em>Planned in minutes.</em>
      </h1>
      <p className="lead" style={{marginTop:20, maxWidth:560, marginLeft:'auto', marginRight:'auto'}}>
        Tell Kite your style, dates, and budget — and get a complete itinerary with flights, stays, and the good restaurants locals actually go to.
      </p>

      {/* Chat input */}
      <div style={{
        maxWidth: 640, margin: '40px auto 0',
        background: '#fff', border: '1.5px solid var(--line)',
        borderRadius: 24, padding: 8,
        boxShadow: 'var(--shadow-md)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask Kite anything — e.g. 5 days in Lisbon, foodie, mid-range"
          style={{
            flex: 1, border: 'none', outline: 'none',
            fontSize: 16, padding: '14px 16px', background: 'transparent',
            fontFamily: 'var(--font-body)', color: 'var(--ink)',
          }}
        />
        <button className="btn btn-primary" style={{borderRadius:18}}>
          <i data-lucide="arrow-up" style={{width:18,height:18}}/>
        </button>
      </div>

      <div style={{display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap', marginTop:20}}>
        {chips.map(c => (
          <button key={c.id} className="btn btn-ghost btn-sm" style={{background:'#fff'}}>
            <i data-lucide={c.icon} style={{width:14,height:14}}/>
            {c.label}
          </button>
        ))}
      </div>

      {/* Trust row */}
      <div style={{marginTop:64, display:'flex', justifyContent:'center', gap:40, flexWrap:'wrap', opacity:0.55, fontSize:13, color:'var(--muted-ink)'}}>
        <span>★★★★★ 4.9 · App Store</span>
        <span>2M+ trips planned</span>
        <span>Featured in Condé Nast Traveler</span>
        <span>Forbes 30 Under 30</span>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: '01', t: 'Tell Kite your vibe', d: 'Dates, budget, who you\'re with, the kind of trip you want. Conversationally — not a form.', icon: 'message-circle' },
    { n: '02', t: 'Get a full itinerary', d: 'Flights, stays, activities, restaurants, transit — all day-by-day, tuned to you.', icon: 'map' },
    { n: '03', t: 'Book or tweak', d: 'Swap a hotel, slow down day 3, add a cooking class. Kite re-plans around your edits in real time.', icon: 'check-circle-2' },
  ];
  return (
    <section className="section" style={{background:'var(--bone)'}}>
      <div className="container">
        <div style={{textAlign:'center', maxWidth:640, margin:'0 auto 64px'}}>
          <div className="eyebrow-pill" style={{marginBottom:16}}>How it works</div>
          <h2>Planning that feels like <em className="display-italic">a conversation,</em> not a spreadsheet.</h2>
        </div>
        <div className="grid grid-3">
          {steps.map(s => (
            <div key={s.n} className="card" style={{padding:32}}>
              <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:20}}>
                <div style={{
                  width:44, height:44, borderRadius:14,
                  background:'var(--sand)', display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  <i data-lucide={s.icon} style={{width:20,height:20,color:'var(--ink)'}}/>
                </div>
                <div style={{fontFamily:'var(--font-display)', fontStyle:'italic', fontSize:22, color:'var(--muted-ink)'}}>{s.n}</div>
              </div>
              <h3 style={{fontSize:26, margin:'0 0 10px'}}>{s.t}</h3>
              <p style={{margin:0}}>{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedDests() {
  const list = window.KITE_DESTINATIONS.slice(0, 8);
  return (
    <section className="section">
      <div className="container">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'end', marginBottom:40, flexWrap:'wrap', gap:16}}>
          <div>
            <div className="eyebrow-pill" style={{marginBottom:12}}>Popular right now</div>
            <h2 style={{margin:0, maxWidth:640}}>Where Kite's travelers are <em className="display-italic">heading this month.</em></h2>
          </div>
          <a href="destinations.html" className="btn btn-ghost">See all destinations <i data-lucide="arrow-right" style={{width:16,height:16}}/></a>
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
      </div>
    </section>
  );
}

function AppPreview() {
  return (
    <section className="section" style={{background:'var(--ink)', color:'#fff', borderRadius:0, overflow:'hidden', position:'relative'}}>
      <div className="container">
        <div style={{display:'grid', gridTemplateColumns:'1.2fr 1fr', gap:64, alignItems:'center'}}>
          <div>
            <div className="eyebrow-pill" style={{background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', color:'#fff', marginBottom:16}}>In your pocket</div>
            <h2 style={{color:'#fff', margin:0}}>A <em className="display-italic" style={{color:'var(--sky)'}}>travel companion,</em> not just a planner.</h2>
            <p style={{color:'rgba(255,255,255,0.7)', fontSize:18, maxWidth:480, marginTop:20}}>
              Offline maps, real-time re-routing when a flight gets canceled, a 24/7 chat that knows your whole trip context. Travel day-of, not just before.
            </p>
            <div style={{display:'flex', gap:12, marginTop:28}}>
              <a href="#" className="btn btn-white">
                <i data-lucide="apple" style={{width:18,height:18}}/> App Store
              </a>
              <a href="#" className="btn btn-white">
                <i data-lucide="play" style={{width:18,height:18}}/> Google Play
              </a>
            </div>
          </div>
          <PhoneMock/>
        </div>
      </div>
    </section>
  );
}

function PhoneMock() {
  return (
    <div style={{
      position:'relative', width: 320, height: 640, margin:'0 auto',
      borderRadius: 44, background:'#0C0610', padding:10,
      boxShadow:'0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)',
    }}>
      <div style={{
        background: 'var(--bone)', borderRadius: 36, height:'100%', overflow:'hidden',
        display:'flex', flexDirection:'column',
      }}>
        <div style={{padding:'52px 20px 12px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <div style={{fontFamily:'var(--font-display)', fontStyle:'italic', fontSize:22, color:'var(--ink)'}}>Tokyo</div>
          <div style={{fontSize:12, color:'var(--muted-ink)'}}>Day 3 of 10</div>
        </div>
        <div style={{flex:1, overflow:'hidden', padding:'8px 16px', display:'flex', flexDirection:'column', gap:10}}>
          <div className="bubble bubble-ai" style={{fontSize:13, maxWidth:'92%'}}>
            Morning in Shibuya, then we'll train to Kyoto at 14:30. Want ramen for lunch near the station?
          </div>
          <div className="bubble bubble-user" style={{fontSize:13, maxWidth:'70%'}}>yes please 🍜</div>
          <div className="bubble bubble-ai" style={{fontSize:13, maxWidth:'92%'}}>
            Booked: Ichiran Shibuya 12:30. Also added Nezu Shrine detour — ~20 min.
          </div>
          <div style={{
            background:'#fff', border:'1px solid var(--line)', borderRadius:16, padding:12,
            display:'flex', gap:10, alignItems:'center', fontSize:12,
          }}>
            <div style={{width:36, height:36, borderRadius:10, background:'var(--coral-soft)', display:'flex', alignItems:'center', justifyContent:'center'}}>
              <i data-lucide="train-front" style={{width:16,height:16,color:'var(--coral-strong)'}}/>
            </div>
            <div style={{flex:1}}>
              <div style={{fontWeight:600, color:'var(--ink)'}}>Nozomi 225 · Kyoto</div>
              <div style={{color:'var(--muted-ink)'}}>14:30 → 16:42 · Car 8, Seat 3A</div>
            </div>
          </div>
        </div>
        <div style={{padding:12, borderTop:'1px solid var(--line)', display:'flex', alignItems:'center', gap:8, background:'#fff'}}>
          <div style={{flex:1, padding:'10px 14px', background:'var(--bg-sunken)', borderRadius:20, fontSize:13, color:'var(--faint-ink)'}}>Ask Kite…</div>
          <div style={{width:36, height:36, borderRadius:'50%', background:'var(--ink)', display:'flex', alignItems:'center', justifyContent:'center'}}>
            <i data-lucide="arrow-up" style={{width:16,height:16,color:'#fff'}}/>
          </div>
        </div>
      </div>
    </div>
  );
}

function Testimonials() {
  return (
    <section className="section" style={{background:'var(--bone)'}}>
      <div className="container">
        <div style={{textAlign:'center', marginBottom:56}}>
          <div className="eyebrow-pill" style={{marginBottom:16}}>Loved by 2M+ travelers</div>
          <h2 style={{margin:0}}>Not another <em className="display-italic">spreadsheet.</em></h2>
        </div>
        <div className="grid grid-3">
          {window.KITE_TESTIMONIALS.map((t, i) => (
            <div key={i} className="card" style={{padding:32, background:'#fff'}}>
              <div style={{color:'var(--gold)', fontSize:18, marginBottom:12}}>★★★★★</div>
              <p style={{fontSize:18, lineHeight:1.5, color:'var(--ink)', marginTop:0}}>"{t.quote}"</p>
              <div style={{marginTop:20, display:'flex', alignItems:'center', gap:12}}>
                <div style={{width:40, height:40, borderRadius:'50%', background:'var(--sand)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-display)', fontStyle:'italic', color:'var(--ink)'}}>
                  {t.author[0]}
                </div>
                <div>
                  <div style={{fontWeight:600, fontSize:14}}>{t.author}</div>
                  <div style={{color:'var(--muted-ink)', fontSize:13}}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const qs = [
    { q: 'Is Kite free to use?', a: 'Planning your first trip is on us. After that, Kite Plus (€9/mo) unlocks unlimited trips, offline maps, and priority booking support.' },
    { q: 'Does Kite book things for me?', a: 'Yes — flights, hotels, trains, activities. Payment goes through Stripe. You can also export the itinerary and book yourself if you have loyalty points you\'d rather use.' },
    { q: 'Will it work for my weird trip?', a: 'Probably. Kite has planned elopements in Iceland, 30-day Vanlife loops, and a bachelor party in Osaka. Try it.' },
    { q: 'What happens if a flight gets canceled?', a: 'Kite detects disruptions and re-routes the rest of your trip automatically. You\'ll get a push notification with options before the airline finishes rebooking.' },
    { q: 'Can I use Kite for business travel?', a: 'Kite for Teams is in private beta — reply to our onboarding email if you want in.' },
  ];
  const [open, setOpen] = React.useState(0);
  return (
    <section className="section">
      <div className="container" style={{maxWidth:880}}>
        <div style={{textAlign:'center', marginBottom:48}}>
          <div className="eyebrow-pill" style={{marginBottom:16}}>Questions</div>
          <h2 style={{margin:0}}>Before you <em className="display-italic">ask.</em></h2>
        </div>
        {qs.map((item, i) => (
          <div key={i} style={{borderBottom:'1px solid var(--line)'}}>
            <button
              onClick={() => setOpen(open === i ? -1 : i)}
              style={{
                width:'100%', textAlign:'left', padding:'24px 0',
                background:'none', border:'none', cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'space-between',
                fontFamily:'var(--font-display)', fontSize:24, color:'var(--ink)',
              }}>
              {item.q}
              <span style={{fontSize:24, transition:'transform 0.3s', transform: open===i ? 'rotate(45deg)' : 'none'}}>+</span>
            </button>
            {open === i && <div style={{paddingBottom:24, fontSize:16, color:'var(--muted-ink)', lineHeight:1.6, maxWidth:720}}>{item.a}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section style={{padding:'120px 24px', textAlign:'center', background:'linear-gradient(180deg, var(--bone) 0%, var(--sand) 100%)'}}>
      <div className="container-sm">
        <h2 style={{margin:0, fontSize:'clamp(40px, 5vw, 64px)'}}>
          Where to, <em className="display-italic">next?</em>
        </h2>
        <p className="lead" style={{marginTop:16}}>The best trip you've ever had is a message away.</p>
        <div style={{marginTop:32, display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap'}}>
          <a href="app.html" className="btn btn-primary btn-lg">Plan a trip — free</a>
          <a href="download.html" className="btn btn-ghost btn-lg">Get the app</a>
        </div>
      </div>
    </section>
  );
}

window.HomeHero = HomeHero;
window.HowItWorks = HowItWorks;
window.FeaturedDests = FeaturedDests;
window.AppPreview = AppPreview;
window.Testimonials = Testimonials;
window.FAQ = FAQ;
window.FinalCTA = FinalCTA;
