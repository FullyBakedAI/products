// Tweaks panel — lets user toggle serif vs sans headlines
function TweaksPanel() {
  const [active, setActive] = React.useState(false);
  const [mode, setMode] = React.useState(() => localStorage.getItem('kite-type') || 'serif');

  React.useEffect(() => {
    document.body.classList.toggle('sans-mode', mode === 'sans');
    localStorage.setItem('kite-type', mode);
  }, [mode]);

  React.useEffect(() => {
    const onMsg = (e) => {
      if (e.data?.type === '__activate_edit_mode') setActive(true);
      if (e.data?.type === '__deactivate_edit_mode') setActive(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  if (!active) return null;
  const here = (window.location.pathname.split('/').pop() || 'index.html');
  return (
    <div className="tweaks-panel active">
      <h5>Tweaks</h5>
      <div style={{fontSize:13, marginBottom:6, color:'var(--muted-ink)'}}>Headline typeface</div>
      <div className="row">
        <button onClick={() => setMode('serif')} className={mode === 'serif' ? 'on' : ''}>Serif</button>
        <button onClick={() => setMode('sans')} className={mode === 'sans' ? 'on' : ''}>Sans</button>
      </div>
      <div style={{fontSize:13, margin:'10px 0 6px', color:'var(--muted-ink)'}}>Homepage variant</div>
      <div className="row">
        <a href="index.html" style={{flex:1}}><button className={here==='index.html'?'on':''} style={{width:'100%'}}>v1</button></a>
        <a href="index-v2.html" style={{flex:1}}><button className={here==='index-v2.html'?'on':''} style={{width:'100%'}}>v2</button></a>
        <a href="index-v3.html" style={{flex:1}}><button className={here==='index-v3.html'?'on':''} style={{width:'100%'}}>v3</button></a>
      </div>
    </div>
  );
}
window.TweaksPanel = TweaksPanel;
