// app/(auth routes)/layout.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
  const router = useRouter();

  useEffect(() => {
    // оновлюємо дані при вході/реєстрації,
    // щоб хедер / AuthNavigation одразу підхопили новий стан
    router.refresh();
  }, [router]);

  return <>{children}</>;
}
