"use client";

import { useState, FormEvent } from "react";
import css from "./AuthForm.module.css";

type AuthFormProps = {
  mode: "sign-in" | "sign-up";
  onSubmit: (email: string, password: string) => Promise<void>;
};

export default function AuthForm({ mode, onSubmit }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (mode === "sign-up" && password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(email, password);
    } catch (error) {
      if (error instanceof Error) alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={css.wrapper} onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={css.input}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={css.input}
        required
      />
      {mode === "sign-up" && (
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={css.input}
          required
        />
      )}
      <button type="submit" className={css.button} disabled={isSubmitting}>
        {isSubmitting
          ? "Processing..."
          : mode === "sign-in"
            ? "Sign In"
            : "Sign Up"}
      </button>
    </form>
  );
}
