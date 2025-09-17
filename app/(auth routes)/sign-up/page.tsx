"use client";

import { useRouter } from "next/navigation";
import AuthForm from "../../../components/AuthForm/AuthForm";
import css from "./SignUpPage.module.css";
import { signUp } from "../../../lib/api/serverApi";

export default function SignUpPage() {
  const router = useRouter();

  const handleSignUp = async (email: string, password: string) => {
    try {
      await signUp({ email, password });
      router.push("/notes");
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
