// app/(auth routes)/layout.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import AuthNavigation from "../../components/AuthNavigation/AuthNavigation";
import css from "./layout.module.css";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, [router]);

  return (
    <div className={css.container}>
      <header className={css.header}>
        <AuthNavigation />
      </header>
      <main className={css.main}>{children}</main>
    </div>
  );
}
