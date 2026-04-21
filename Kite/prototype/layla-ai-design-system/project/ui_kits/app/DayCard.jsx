function DayCard({ day, date, title, children }) {
  return (
    <div style={dcStyles.card}>
      <div style={dcStyles.head}>
        <div style={dcStyles.num}>{day}</div>
        <div>
          <div style={dcStyles.title}>{title}</div>
          <div style={dcStyles.date}>{date}</div>
        </div>
      </div>
      <div style={dcStyles.body}>{children}</div>
    </div>
  );
}

const dcStyles = {
  card: { background: 'var(--paper)', borderRadius: 20, boxShadow: 'var(--shadow-sm)', padding: 20, marginBottom: 16, border: '1px solid var(--line)' },
  head: { display: 'flex', gap: 14, alignItems: 'center', marginBottom: 16 },
  num: { width: 40, height: 40, borderRadius: '50%', background: 'var(--ink)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 18 },
  title: { fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)' },
  date: { fontSize: 12.5, color: 'var(--muted-ink)', marginTop: 2 },
  body: {},
};

window.DayCard = DayCard;
