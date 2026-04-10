import wifiIcon from './assets/icon-wifi.svg';

export default function StatusBar() {
  return (
    <div className="status-bar" aria-hidden="true">
      <span className="status-time">9:41</span>
      <div className="status-right">
        <div className="signal-bars">
          <div className="signal-bar" />
          <div className="signal-bar" />
          <div className="signal-bar" />
          <div className="signal-bar" />
        </div>
        <img src={wifiIcon} alt="" width="16" height="12" />
        <div className="battery">
          <div className="battery-fill" />
        </div>
      </div>
    </div>
  );
}
