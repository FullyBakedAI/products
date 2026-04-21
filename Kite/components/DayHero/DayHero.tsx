import type { Day } from "@/lib/types";
import styles from "./DayHero.module.css";

interface Props {
  day: Day;
}

export default function DayHero({ day }: Props) {
  return (
    <section className={styles.hero} aria-labelledby={`day-title-${day.id}`}>
      <div className={styles.photoWrap}>
        {day.heroPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={day.heroPhoto}
            alt={day.sub}
            className={styles.photo}
            loading="lazy"
          />
        ) : (
          <div className={styles.gradientBand} aria-hidden="true" />
        )}
        <div className={styles.overlay} aria-hidden="true" />
        <div className={styles.meta}>
          {day.num && (
            <div className={styles.eyebrow}>Day {day.num}</div>
          )}
          <h2 id={`day-title-${day.id}`} className={styles.title}>
            {day.sub}
          </h2>
          <div className={styles.label}>{day.label}</div>
        </div>
      </div>
    </section>
  );
}
