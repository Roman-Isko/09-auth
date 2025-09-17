"use client";

import { useState, FormEvent } from "react";
import clsx from "clsx";
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Authentication error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={clsx(css.input)}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={clsx(css.input)}
        />
      </div>

      {mode === "sign-up" && (
        <div className={css.formGroup}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={clsx(css.input)}
          />
        </div>
      )}

      <div className={css.actions}>
        <button
          type="submit"
          className={clsx(css.submitButton)}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Processing..."
            : mode === "sign-in"
              ? "Sign In"
              : "Sign Up"}
        </button>
      </div>
    </form>
  );
}

// "use client";

// import { useState } from "react";
// import clsx from "clsx";
// import styles from "./AuthForm.module.css";
// import signInStyles from "../SignInPage/SignInPage.module.css";
// import signUpStyles from "../SignUpPage/SignUpPage.module.css";

// interface AuthFormProps {
//   mode: "signin" | "signup";
//   onSubmit: (data: { email: string; password: string }) => Promise<void>;
// }

// export default function AuthForm({ mode, onSubmit }: AuthFormProps) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);
//     try {
//       await onSubmit({ email, password });
//     } catch (err) {
//       setError("Invalid credentials or server error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Спільні стилі для сторінок
//   const pageStyles = mode === "signin" ? signInStyles : signUpStyles;

//   return (
//     <div className={pageStyles.mainContent}>
//       <form
//         onSubmit={handleSubmit}
//         className={clsx(pageStyles.form, styles.wrapper)}
//       >
//         <h2 className={clsx(pageStyles.formTitle, styles.title)}>
//           {mode === "signin" ? "Sign In" : "Sign Up"}
//         </h2>

//         <div className={pageStyles.formGroup}>
//           <label>Email</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             className={clsx(pageStyles.input, styles.input)}
//           />
//         </div>

//         <div className={pageStyles.formGroup}>
//           <label>Password</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             className={clsx(pageStyles.input, styles.input)}
//           />
//         </div>

//         {error && <p className={pageStyles.error}>{error}</p>}

//         <div className={pageStyles.actions}>
//           <button
//             type="submit"
//             disabled={loading}
//             className={clsx(pageStyles.submitButton, styles.button)}
//           >
//             {loading
//               ? mode === "signin"
//                 ? "Signing In..."
//                 : "Signing Up..."
//               : mode === "signin"
//                 ? "Sign In"
//                 : "Sign Up"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }
