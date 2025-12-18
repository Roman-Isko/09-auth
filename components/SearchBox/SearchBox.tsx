"use client";

import { ChangeEvent } from "react";
import css from "./SearchBox.module.css";

type Props = {
  value: string;
  onChange: (v: string) => void;
};

export default function SearchBox({ value, onChange }: Props) {
  const handle = (e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value);

  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes..."
      value={value}
      onChange={handle}
    />
  );
}
