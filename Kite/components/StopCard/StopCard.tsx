"use client";

import { useState, useRef } from "react";
import type { Stop, StopCustomisation, JournalPhoto } from "@/lib/types";
import ChoiceSelector from "@/components/ChoiceSelector/ChoiceSelector";
import styles from "./StopCard.module.css";

interface Props {
  stop: Stop;
  stopId: string;
  variant: "ant" | "lorena";
  custom?: StopCustomisation;
  onCustomChange?: (patch: Partial<StopCustomisation>) => void;
}

function typeLabel(type: Stop["type"]): string {
  const map: Record<string, string> = {
    food: "Food",
    sight: "Sightseeing",
    nature: "Nature",
    hike: "Hike",
    swim: "Swim",
    transit: "Transit",
    start: "Start",
    end: "End",
    stay: "Stay",
    drive: "Drive",
  };
  return map[type] ?? type;
}

function StarRating({
  rating,
  onChange,
}: {
  rating: number;
  onChange?: (n: number) => void;
}) {
  const labels = ["", "Disappointing", "Below average", "Good", "Really good", "Outstanding"];
  return (
    <div
      className={styles.stars}
      role="radiogroup"
      aria-label="Rating"
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={n === rating}
          className={`${styles.star} ${n <= rating ? styles.starFilled : ""}`}
          onClick={() => onChange?.(rating === n ? 0 : n)}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
        >
          ★
        </button>
      ))}
      {rating > 0 && (
        <span className={styles.starsLabel}>{labels[rating]}</span>
      )}
    </div>
  );
}

export default function StopCard({ stop, stopId, variant, custom = {}, onCustomChange }: Props) {
  const display = { ...stop, ...custom };
  const journalPhotos: JournalPhoto[] = custom.journalPhotos ?? [];
  const hasJournalPhotos = journalPhotos.length > 0;
  const headerPhoto = hasJournalPhotos ? journalPhotos[0].dataUrl : stop.photo;
  const hasImg = !!headerPhoto;
  const allChoices = [...(stop.choices ?? []), ...(custom.extraChoices ?? [])];
  const selectedChoice = custom.selectedChoice ?? null;

  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handlePhotoUpload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    try {
      const newPhotos: JournalPhoto[] = await Promise.all(
        Array.from(files).map(
          (file) =>
            new Promise<JournalPhoto>((resolve) => {
              const reader = new FileReader();
              reader.onload = (e) =>
                resolve({
                  id: `${Date.now()}-${Math.random()}`,
                  dataUrl: e.target?.result as string,
                  addedAt: new Date().toISOString(),
                });
              reader.readAsDataURL(file);
            })
        )
      );
      onCustomChange?.({ journalPhotos: [...journalPhotos, ...newPhotos] });
    } finally {
      setUploading(false);
    }
  }

  function removePhoto(photoId: string) {
    onCustomChange?.({
      journalPhotos: journalPhotos.filter((p) => p.id !== photoId),
    });
  }

  /* ── Lorena variant ── */
  if (variant === "lorena") {
    return (
      <article id={`stop-${stopId}`} className={styles.card} aria-label={stop.name} data-variant="lorena">
        {hasImg && (
          <div className={styles.heroWrap}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={headerPhoto!} alt={stop.name} className={styles.hero} loading="lazy" />
          </div>
        )}
        <div className={styles.body}>
          <div className={styles.typeEyebrow}>{typeLabel(stop.type)}</div>
          <h3 className={styles.name}>{stop.name}</h3>
          {display.time && (
            <div className={styles.timeProminent}>{display.time}</div>
          )}
          {stop.loc && <div className={styles.loc}>{stop.loc}</div>}
          {stop.desc && (
            <p className={`${styles.desc} ${styles.descClamped}`}>{stop.desc}</p>
          )}
          {stop.lat && stop.lng && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${stop.lat},${stop.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.directionsBtn}
            >
              <i className="ph-fill ph-compass" aria-hidden="true" />
              Directions
            </a>
          )}
        </div>
      </article>
    );
  }

  /* ── Ant variant ── */
  return (
    <article id={`stop-${stopId}`} className={styles.card} aria-label={stop.name} data-variant="ant">
      {/* Edit button */}
      {onCustomChange && (
        <button
          type="button"
          className={styles.editBtn}
          aria-label="Edit stop"
        >
          <i className="ph-fill ph-pencil-simple" aria-hidden="true" />
        </button>
      )}

      {/* Hero image */}
      {hasImg && (
        <div className={styles.heroWrap}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={headerPhoto!} alt={stop.name} className={styles.hero} loading="lazy" />
          {hasJournalPhotos && (
            <div className={styles.photoBadge}>
              <i className="ph-fill ph-camera" aria-hidden="true" />
              {journalPhotos.length} photo{journalPhotos.length !== 1 ? "s" : ""}
            </div>
          )}
          {stop.icon && !hasJournalPhotos && display.time && (
            <div className={styles.timeBadge}>{display.time}</div>
          )}
          {stop.icon && !hasJournalPhotos && (
            <div className={styles.iconBadge}>
              <i className={`ph-fill ${stop.icon}`} aria-hidden="true" />
            </div>
          )}
        </div>
      )}

      <div className={styles.body}>
        {/* Time + type header (no image) */}
        {!hasImg && (
          <div className={styles.inlineHeader}>
            {stop.icon && (
              <span className={styles.inlineIcon}>
                <i className={`ph-fill ${stop.icon}`} aria-hidden="true" />
              </span>
            )}
            {display.time && (
              <span className={styles.inlineTime}>{display.time}</span>
            )}
            <span className={styles.inlineType}>{typeLabel(stop.type)}</span>
          </div>
        )}

        {hasImg && (
          <div className={styles.metaRow}>
            {display.time && <span className={styles.metaTime}>{display.time}</span>}
            {display.time && <span className={styles.metaDot} aria-hidden="true">·</span>}
            <span className={styles.metaType}>{typeLabel(stop.type)}</span>
          </div>
        )}

        <h3 className={styles.name}>{stop.name}</h3>
        {stop.loc && <div className={styles.loc}>{stop.loc}</div>}

        {stop.hike && (
          <div className={styles.hikeInfo}>
            <i className="ph-fill ph-mountains" aria-hidden="true" />
            {stop.hike.distance} · {stop.hike.gain} gain · {stop.hike.time}
          </div>
        )}

        {stop.desc && <p className={styles.desc}>{stop.desc}</p>}

        {stop.swimInfo && (
          <p className={styles.swimInfo}>{stop.swimInfo}</p>
        )}

        {/* Choice selector */}
        {allChoices.length > 0 && (
          <ChoiceSelector
            stopName={stop.name}
            choices={stop.choices ?? []}
            extraChoices={custom.extraChoices}
            selected={selectedChoice}
            onSelect={(name) => onCustomChange?.({ selectedChoice: name ?? undefined })}
            onAddChoice={(c) =>
              onCustomChange?.({ extraChoices: [...(custom.extraChoices ?? []), c] })
            }
            onRemoveExtra={(name) =>
              onCustomChange?.({
                extraChoices: (custom.extraChoices ?? []).filter((c) => c.name !== name),
              })
            }
          />
        )}

        {/* Journal photos */}
        {(hasJournalPhotos || onCustomChange) && (
          <div className={styles.gallery}>
            {journalPhotos.map((p, idx) => (
              <div key={p.id} className={styles.galleryThumb}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.dataUrl}
                  alt={`Photo ${idx + 1}`}
                  onClick={() => setLightboxIdx(idx)}
                />
                {onCustomChange && (
                  <button
                    type="button"
                    className={styles.thumbDel}
                    onClick={() => removePhoto(p.id)}
                    aria-label="Remove photo"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            {onCustomChange && (
              <label
                className={`${styles.galleryAdd} ${uploading ? styles.uploading : ""}`}
              >
                <span className={styles.galleryAddIcon}>
                  {uploading ? (
                    <i className="ph-fill ph-spinner" aria-hidden="true" />
                  ) : (
                    <i className="ph-fill ph-camera" aria-hidden="true" />
                  )}
                </span>
                {uploading ? "Saving…" : "Add photos"}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: "none" }}
                  onChange={(e) => handlePhotoUpload(e.target.files)}
                />
              </label>
            )}
          </div>
        )}

        {/* Notes */}
        {onCustomChange && (
          <textarea
            className={styles.notes}
            placeholder="Add notes for this stop…"
            value={custom.notes ?? ""}
            rows={2}
            aria-label="Notes for this stop"
            onChange={(e) => onCustomChange({ notes: e.target.value })}
          />
        )}

        {/* Rating */}
        {(custom.rating !== undefined || onCustomChange) && (
          <StarRating
            rating={custom.rating ?? 0}
            onChange={(n) => onCustomChange?.({ rating: n })}
          />
        )}

        {/* Actions */}
        <div className={styles.actions}>
          {stop.lat && stop.lng && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${stop.lat},${stop.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.directionsBtn}
            >
              <i className="ph-fill ph-compass" aria-hidden="true" />
              Directions
            </a>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div
          className={styles.lightbox}
          onClick={() => setLightboxIdx(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
        >
          <button
            type="button"
            className={styles.lightboxClose}
            onClick={() => setLightboxIdx(null)}
            aria-label="Close photo"
          >
            ✕
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={journalPhotos[lightboxIdx]?.dataUrl}
            alt={`Photo ${lightboxIdx + 1}`}
            className={styles.lightboxImg}
            onClick={(e) => e.stopPropagation()}
          />
          {journalPhotos.length > 1 && (
            <div className={styles.lightboxNav} onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setLightboxIdx((i) => (i! > 0 ? i! - 1 : journalPhotos.length - 1))}
                aria-label="Previous photo"
              >
                ‹
              </button>
              <span>{lightboxIdx + 1} / {journalPhotos.length}</span>
              <button
                onClick={() => setLightboxIdx((i) => (i! < journalPhotos.length - 1 ? i! + 1 : 0))}
                aria-label="Next photo"
              >
                ›
              </button>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
