import styles from "./DriveSegment.module.css";

interface Props {
  time?: string;
  text: string;
}

export default function DriveSegment({ time, text }: Props) {
  return (
    <div className={styles.drive} role="listitem" aria-label={`Drive: ${text}`}>
      <span className={styles.line} aria-hidden="true" />
      <span className={styles.content}>
        {time && <span className={styles.time}>{time}</span>}
        <i className="ph-fill ph-road-horizon" aria-hidden="true" />
        <span className={styles.text}>{text}</span>
      </span>
      <span className={styles.line} aria-hidden="true" />
    </div>
  );
}
