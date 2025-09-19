"use client";

import { useRouter } from "next/navigation";
import AuthForm from "../../../components/AuthForm/AuthForm";
import css from "./SignUpPage.module.css";
import { signUp } from "../../../lib/api/clientApi";
import { useAuthStore } from "../../../lib/store/authStore";

export default function SignUpPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  const handleSignUp = async (email: string, password: string) => {
    try {
      const user = await signUp(email, password);
      setUser(user);
      router.push("/profile");
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Sign up failed");
      }
    }
  };

  return (
    <div className={css.mainContent}>
      <h1 className={css.formTitle}>Sign Up</h1>
      <AuthForm mode="sign-up" onSubmit={handleSignUp} />
    </div>
  );
}
