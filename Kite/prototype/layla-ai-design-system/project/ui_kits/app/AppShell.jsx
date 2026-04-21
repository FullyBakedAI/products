const { useState: useStateShell, useEffect: useEffShell } = React;

function AppShell() {
  const [messages, setMessages] = useStateShell([
    { from: 'layla', text: "Hey! I'm Layla, your AI travel agent ✈️ Tell me where you'd like to go and I'll build a day-by-day plan in minutes." },
  ]);
  const [stage, setStage] = useStateShell(0); // 0 = greeting, 1 = planning, 2 = ready

  const tripReady = stage >= 1;

  const trip = {
    title: '5 days in Lisbon',
    dates: 'May 7 — May 11, 2026',
    travelers: 'Couple',
    total: '1,240',
    days: 5,
    activities: 11,
  };

  const handleSend = (text) => {
    setMessages(m => [...m, { from: 'user', text }]);
    setTimeout(() => {
      if (stage === 0) {
        setMessages(m => [...m, { from: 'layla', text: "Perfect choice 🙌 I'll pair boutique stays with sunset viewpoints. Give me a moment to put this together…" }]);
        setStage(1);
        setTimeout(() => {
          setMessages(m => [...m, { from: 'layla', text: "Done ✨ Your 5-day Lisbon plan is on the right. I've included a flight from Berlin, 4 nights at Memmo Alfama, and a mix of Alfama walks, Belém pastries and a Sintra day trip." }]);
          setStage(2);
        }, 1400);
      } else {
        setMessages(m => [...m, { from: 'layla', text: "Got it — I'll update your itinerary. Anything else to tweak? 🌴" }]);
      }
    }, 500);
  };

  return (
    <div style={shellStyles.wrap}>
      <header style={shellStyles.topbar}>
        <img src="../../assets/layla-logo.svg" style={{height: 20}} />
        <div style={shellStyles.tabs}>
          <span style={{...shellStyles.tab, ...shellStyles.tabActive}}>Chat</span>
          <span style={shellStyles.tab}>Saved trips</span>
          <span style={shellStyles.tab}>Inspiration</span>
        </div>
        <button style={shellStyles.primeBtn}>Upgrade to Prime</button>
      </header>
      <div style={shellStyles.body}>
        <ChatRail messages={messages} onSend={handleSend} stage={stage} />
        {tripReady && (
          <>
          <ItineraryPanel trip={{
            ...trip,
            cards: (
              <>
                <DayCard day={1} date="Wed, May 7" title="Arrival & Alfama">
                  <FlightCard code="LH" airline="Lufthansa" from="BER" to="LIS" depart="08:40" arrive="10:55" duration="2h 15m" stops={0} price="124" />
                  <HotelCard name="Memmo Alfama" area="Alfama · Lisbon" rating="4.8" nights="4" price="780" img="../../assets/photos/paris.svg" />
                  <ActivityCard name="Sunset at Miradouro" time="19:30" duration="1h" type="view" />
                  <ActivityCard name="Dinner · Cervejaria Ramiro" time="21:00" duration="2h" price="45" type="food" />
                </DayCard>
                <DayCard day={2} date="Thu, May 8" title="Belém & pastries">
                  <ActivityCard name="Jerónimos Monastery" time="10:00" duration="1h 30m" price="12" type="culture" />
                  <ActivityCard name="Pastéis de Belém" time="12:00" duration="45m" type="food" />
                  <ActivityCard name="MAAT museum" time="14:30" duration="2h" price="11" type="culture" />
                </DayCard>
                <DayCard day={3} date="Fri, May 9" title="Sintra day trip">
                  <ActivityCard name="Train to Sintra" time="09:15" duration="40m" price="5" type="view" />
                  <ActivityCard name="Pena Palace" time="10:30" duration="2h" price="14" type="culture" />
                  <ActivityCard name="Quinta da Regaleira" time="13:30" duration="2h" price="12" type="nature" />
                </DayCard>
              </>
            ),
          }} />
          <MapPanel />
          </>
        )}
      </div>
    </div>
  );
}

const shellStyles = {
  wrap: { height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bone)' },
  topbar: { display: 'flex', alignItems: 'center', gap: 24, padding: '14px 24px', borderBottom: '1px solid var(--line)', background: 'rgba(255,255,255,.85)', backdropFilter: 'blur(16px)' },
  tabs: { display: 'flex', gap: 20, marginLeft: 20, flex: 1 },
  tab: { fontSize: 14, color: 'var(--muted-ink)', cursor: 'pointer', padding: '4px 0', fontWeight: 500 },
  tabActive: { color: 'var(--ink)', borderBottom: '2px solid var(--ink)', fontWeight: 600 },
  primeBtn: { background: 'var(--coral)', color: 'var(--ink)', border: 0, padding: '8px 16px', borderRadius: 9999, fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  body: { flex: 1, display: 'flex', overflow: 'hidden' },
};

window.AppShell = AppShell;
