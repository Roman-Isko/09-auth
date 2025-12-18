"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { checkSession, getMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

type Props = {
  children: React.ReactNode;
};

export default function AuthProvider({ children }: Props) {
  const pathname = usePathname();
  const { setUser, clearIsAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function sync() {
      setLoading(true);
      try {
        const hasSession = await checkSession();

        if (!hasSession) {
          if (!cancelled) clearIsAuthenticated();
          return;
        }

        const me = await getMe();

        if (!cancelled) {
          if (me) setUser(me);
          else clearIsAuthenticated();
        }
      } catch {
        if (!cancelled) clearIsAuthenticated();
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void sync();

    return () => {
      cancelled = true;
    };
  }, [pathname, setUser, clearIsAuthenticated]);

  if (loading) {
    return <div style={{ padding: 24 }}>Loading...</div>;
  }

  return <>{children}</>;
}
