"use client";

import { useState } from "react";
import { RadioGroup, Radio } from "react-aria-components";
import type { Choice } from "@/lib/types";
import styles from "./ChoiceSelector.module.css";

interface Props {
  stopName: string;
  choices: Choice[];
  extraChoices?: Choice[];
  selected?: string | null;
  onSelect: (name: string | null) => void;
  onAddChoice?: (choice: Choice) => void;
  onRemoveExtra?: (name: string) => void;
}

export default function ChoiceSelector({
  stopName,
  choices,
  extraChoices = [],
  selected,
  onSelect,
  onAddChoice,
  onRemoveExtra,
}: Props) {
  const [adding, setAdding] = useState(false);
  const [newChoice, setNewChoice] = useState<Partial<Choice>>({});
  const allChoices = [...choices, ...extraChoices];

  function handleSelect(value: string) {
    onSelect(value === selected ? null : value);
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newChoice.name?.trim()) return;
    onAddChoice?.({ ...newChoice, name: newChoice.name.trim() } as Choice);
    setNewChoice({});
    setAdding(false);
  }

  return (
    <div className={styles.container}>
      <RadioGroup
        aria-label={`Choose an option for ${stopName}`}
        value={selected ?? ""}
        onChange={handleSelect}
        className={styles.group}
      >
        {allChoices.map((choice, idx) => {
          const isExtra = idx >= choices.length;
          return (
            <Radio
              key={choice.name}
              value={choice.name}
              className={({ isSelected }) =>
                `${styles.option} ${isSelected ? styles.optionSelected : ""}`
              }
            >
              <div className={styles.optionHeader}>
                <div className={styles.indicator} aria-hidden="true" />
                <span className={styles.optionName}>{choice.name}</span>
                {choice.price && (
                  <span className={styles.price}>{choice.price}</span>
                )}
                {isExtra && onRemoveExtra && (
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveExtra(choice.name);
                    }}
                    aria-label={`Remove ${choice.name}`}
                  >
                    ✕
                  </button>
                )}
              </div>
              {choice.loc && <div className={styles.loc}>{choice.loc}</div>}
              {choice.desc && <div className={styles.desc}>{choice.desc}</div>}
            </Radio>
          );
        })}
      </RadioGroup>

      {onAddChoice && (
        <div className={styles.addSection}>
          {!adding ? (
            <button
              type="button"
              className={styles.addBtn}
              onClick={() => setAdding(true)}
            >
              + Add your own option
            </button>
          ) : (
            <form onSubmit={handleAdd} className={styles.addForm}>
              <input
                className={styles.input}
                placeholder="Name *"
                value={newChoice.name ?? ""}
                onChange={(e) => setNewChoice((p) => ({ ...p, name: e.target.value }))}
                required
                autoFocus
              />
              <div className={styles.addFormRow}>
                <input
                  className={styles.input}
                  placeholder="Location"
                  value={newChoice.loc ?? ""}
                  onChange={(e) => setNewChoice((p) => ({ ...p, loc: e.target.value }))}
                />
                <input
                  className={styles.inputShort}
                  placeholder="Price ($$$)"
                  value={newChoice.price ?? ""}
                  onChange={(e) => setNewChoice((p) => ({ ...p, price: e.target.value }))}
                />
              </div>
              <textarea
                className={styles.textarea}
                placeholder="Description"
                rows={2}
                value={newChoice.desc ?? ""}
                onChange={(e) => setNewChoice((p) => ({ ...p, desc: e.target.value }))}
              />
              <div className={styles.addFormActions}>
                <button type="submit" className={styles.saveBtn}>Add</button>
                <button type="button" className={styles.cancelBtn} onClick={() => setAdding(false)}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
