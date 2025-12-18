"use client";

import Link from "next/link";
import css from "./SidebarNotes.module.css";
import { TAGS_UI } from "@/types/note";

export default function SidebarNotes() {
  return (
    <ul className={css.menuList}>
      {TAGS_UI.map((tag) => {
        const isAll = tag === "All";
        const href = isAll ? "/notes" : `/notes?tag=${encodeURIComponent(tag)}`;

        return (
          <li className={css.menuItem} key={tag}>
            <Link href={href} className={css.menuLink}>
              {tag}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
