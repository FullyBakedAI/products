const { useState: useStateFAQ } = React;

function FAQ() {
  const [open, setOpen] = useStateFAQ(0);
  const items = [
    { q: 'What is Layla.ai?', a: "I'm Layla, your AI travel agent and trip planner. I create complete, personalized itineraries that cover everything: flights, hotels, activities, best dining, and tailored recommendations. In just minutes, I can design trips that are ready to book." },
    { q: 'How does Layla.ai work?', a: "You just share your travel dates, destinations, budget and style, and I instantly build a day-by-day plan. I use live pricing and availability to keep your itinerary accurate and always up to date." },
    { q: 'Can Layla.ai save me money on trips?', a: "Yes. I compare live prices for flights, hotels, trains and activities to find the best deals. By optimizing your itinerary, I help you avoid unnecessary costs while maximizing experiences." },
    { q: 'Is Layla.ai free to use?', a: "I offer free trip planning tools with optional upgrades. For $49/year, you'll unlock unlimited access to all premium planning features." },
  ];
  return (
    <section style={faqStyles.wrap}>
      <h2 style={faqStyles.h2}>Frequently asked questions</h2>
      <div style={faqStyles.list}>
        {items.map((it, i) => (
          <div key={i} style={faqStyles.item}>
            <button style={faqStyles.q} onClick={() => setOpen(open === i ? -1 : i)}>
              <span>{it.q}</span>
              <span style={{transform: open === i ? 'rotate(45deg)' : '', transition: 'transform .2s', fontSize: 22, fontWeight: 300, color: 'var(--muted-ink)'}}>+</span>
            </button>
            {open === i && <p style={faqStyles.a}>{it.a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

const faqStyles = {
  wrap: { maxWidth: 820, margin: '0 auto', padding: '96px 24px' },
  h2: { fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 48, letterSpacing: '-0.02em', textAlign: 'center', marginBottom: 48, color: 'var(--ink)' },
  list: { display: 'flex', flexDirection: 'column' },
  item: { borderBottom: '1px solid var(--line)', padding: '4px 0' },
  q: { width: '100%', background: 'transparent', border: 0, padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 18, fontWeight: 600, color: 'var(--ink)', textAlign: 'left' },
  a: { margin: '0 0 20px', fontSize: 15.5, lineHeight: 1.7, color: 'var(--muted-ink)' },
};

window.FAQ = FAQ;
