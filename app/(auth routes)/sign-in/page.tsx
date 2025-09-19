"use client";

import { useRouter } from "next/navigation";
import AuthForm from "../../../components/AuthForm/AuthForm";
import css from "./SignInPage.module.css";
import { signIn } from "../../../lib/api/clientApi";
import { useAuthStore } from "../../../lib/store/authStore";

export default function SignInPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  const handleSignIn = async (email: string, password: string) => {
    try {
      const user = await signIn(email, password);
      setUser(user);
      router.push("/profile");
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Sign in failed");
      }
    }
  };

  return (
    <div className={css.mainContent}>
      <h1 className={css.formTitle}>Sign In</h1>
      <AuthForm mode="sign-in" onSubmit={handleSignIn} />
    </div>
  );
}
