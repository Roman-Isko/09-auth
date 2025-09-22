// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useAuthStore } from "@/lib/store/authStore";
// import { getCurrentUser } from "@/lib/api/clientApi";
// import type { User } from "@/types/user";

// interface AuthProviderProps {
//   children: React.ReactNode;
// }

// export default function AuthProvider({ children }: AuthProviderProps) {
//   const { setUser, logout } = useAuthStore();
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     async function checkSession() {
//       try {
//         const user: User = await getCurrentUser();
//         setUser(user);
//       } catch {
//         logout();
//         router.push("/sign-in");
//       } finally {
//         setLoading(false);
//       }
//     }

//     checkSession();
//   }, [router, setUser, logout]);

//   if (loading) return <p>Loading...</p>;

//   return <>{children}</>;
// }

// components/AuthProvider/AuthProvider.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { getCurrentUser } from "@/lib/api/clientApi";
import type { User } from "@/types/user";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      try {
        const user: User | null = await getCurrentUser();

        if (user) {
          setUser(user);
        } else {
          logout();
          router.push("/sign-in");
        }
      } catch {
        logout();
        router.push("/sign-in");
      } finally {
        setLoading(false);
      }
    }

    checkSession();
  }, [router, setUser, logout]);

  if (loading) return <p>Loading...</p>;

  return <>{children}</>;
}
