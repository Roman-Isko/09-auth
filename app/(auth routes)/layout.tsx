// app/(auth routes)/layout.tsx
import type { ReactNode } from "react";
import AuthNavigation from "../../components/AuthNavigation/AuthNavigation";
import css from "./layout.module.css";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className={css.container}>
      <header className={css.header}>
        <AuthNavigation />
      </header>
      <main className={css.main}>{children}</main>
    </div>
  );
}
