// import AuthForm from "../../../components/AuthForm/AuthForm";

// export default function SignInPage() {
//   return <AuthForm mode="sign-in" />;
// }

"use client";

import { useRouter } from "next/navigation";
import AuthForm from "../../../components/AuthForm/AuthForm";
import css from "./SignInPage.module.css";
import { signIn } from "../../../lib/api/serverApi";

export default function SignInPage() {
  const router = useRouter();

  const handleSignIn = async (email: string, password: string) => {
    try {
      await signIn(email, password);
      router.push("/notes");
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

// "use client";

// import { useRouter } from "next/navigation";
// import AuthForm from "../../../components/AuthForm/AuthForm";
// import css from "./SignInPage.module.css";
// import { signIn } from "../../../lib/api/serverApi";

// export default function SignInPage() {
//   const router = useRouter();

//   const handleSignIn = async (data: { email: string; password: string }) => {
//     try {
//       await signIn(data.email, data.password);
//       router.push("/notes");
//     } catch (error: any) {
//       alert(error.message || "Sign in failed");
//     }
//   };

//   return (
//     <div className={css.mainContent}>
//       <AuthForm mode="signin" onSubmit={handleSignIn} />
//     </div>
//   );
// }
