"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import { useAuthStore } from "../../lib/store/authStore";
import { useRouter } from "next/navigation";

export default function AuthProvider({ children }: PropsWithChildren) {
  const { setAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/users/me", { credentials: "include" });
        if (res.ok) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
          router.push("/sign-in");
        }
      } catch {
        setAuthenticated(false);
        router.push("/sign-in");
      } finally {
        setLoading(false);
      }
    }

    checkSession();
  }, [router, setAuthenticated]);

  if (loading) return <p>Loading...</p>;

  return <>{children}</>;
}
