"use client";

import { useEffect, useRef, useState } from "react";
import css from "./TagsMenu.module.css";

type Props = {
  items: string[]; // ["all", ...ALLOWED_TAGS]
  value: string; // 'all' або один із items
  onSelect: (v: string) => void;
  label?: string;
};

export default function TagsMenu({
  items,
  value,
  onSelect,
  label = "Notes",
}: Props) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  return (
    <div className={css.menuContainer} ref={menuRef}>
      <button
        type="button"
        className={css.menuButton}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {label} ▾
      </button>

      {open && (
        <ul className={css.menuList} role="menu">
          {items.map((tag) => (
            <li className={css.menuItem} key={tag} role="none">
              <button
                type="button"
                className={`${css.menuLink} ${value === tag ? css.active : ""}`}
                role="menuitem"
                onClick={() => {
                  onSelect(tag);
                  setOpen(false);
                }}
              >
                {tag}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
