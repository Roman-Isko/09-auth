import Link from "next/link";
import AuthNavigation from "@/components/AuthNavigation/AuthNavigation";
import css from "./Header.module.css";

export default function Header() {
  return (
    <header className={css.header}>
      <div className={css.container}>
        <Link href="/" className={css.logo}>
          NoteHub
        </Link>

        <nav className={css.nav}>
          <ul className={css.leftNav}>
            <li className={css.navigationItem}>
              <Link
                href="/about"
                prefetch={false}
                className={css.navigationLink}
              >
                About
              </Link>
            </li>
            <li className={css.navigationItem}>
              <Link
                href="/notes"
                prefetch={false}
                className={css.navigationLink}
              >
                Notes
              </Link>
            </li>
          </ul>

          <ul className={css.rightNav}>
            <AuthNavigation />
          </ul>
        </nav>
      </div>
    </header>
  );
}
