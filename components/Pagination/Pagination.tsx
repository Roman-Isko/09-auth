"use client";

import css from "./Pagination.module.css";

type Props = {
  page: number;
  hasPrev: boolean;
  hasNext: boolean;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  page,
  hasPrev,
  hasNext,
  onPageChange,
}: Props) {
  if (!hasPrev && !hasNext && page <= 1) return null;

  const goTo = (next: number) => {
    if (next === page || next < 1) return;
    onPageChange(next);
  };

  const pages: number[] = [];
  const start = Math.max(1, page - 2);
  for (let p = start; p < start + 5; p += 1) {
    if (p >= 1) pages.push(p);
  }

  return (
    <div className={css.wrapper}>
      <button
        type="button"
        className={css.navButton}
        onClick={() => goTo(page - 1)}
        disabled={!hasPrev}
      >
        ‹
      </button>

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          className={`${css.page} ${p === page ? css.active : ""}`}
          onClick={() => goTo(p)}
        >
          {p}
        </button>
      ))}

      <button
        type="button"
        className={css.navButton}
        onClick={() => goTo(page + 1)}
        disabled={!hasNext}
      >
        ›
      </button>
    </div>
  );
}
