"use client";

import Link from "next/link";
import css from "./AuthNavigation.module.css";
import { useAuthStore } from "../../lib/store/authStore";
import { useRouter } from "next/navigation";

export default function AuthNavigation() {
  const { isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Вихід користувача через API
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        console.error("Logout failed with status:", res.status);
      }
    } catch (err) {
      console.error("Logout API failed:", err);
    } finally {
      // Очищаємо стан авторизації у store
      logout();

      // SPA редирект на сторінку входу
      router.push("/sign-in");
    }
  };

  return (
    <>
      {!isAuthenticated ? (
        <>
          <li className={css.navigationItem}>
            <Link href="/sign-up" className={css.navigationLink}>
              Register
            </Link>
          </li>
          <li className={css.navigationItem}>
            <Link href="/sign-in" className={css.navigationLink}>
              Login
            </Link>
          </li>
        </>
      ) : (
        <>
          <li className={css.navigationItem}>
            <Link href="/profile" className={css.navigationLink}>
              Profile
            </Link>
          </li>
          <li className={css.navigationItem}>
            <button onClick={handleLogout} className={css.navigationLink}>
              Logout
            </button>
          </li>
        </>
      )}
    </>
  );
}
