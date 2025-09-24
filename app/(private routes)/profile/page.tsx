// // import { redirect } from "next/navigation";
// import Image from "next/image";
// import Link from "next/link";
// import { getUserServer } from "../../../lib/api/serverApi";
// import type { Metadata } from "next";
// import type { User } from "../../../types/user";

// export const metadata: Metadata = {
//   title: "Profile",
//   description: "Перегляд профілю користувача NoteHub",
// };

// export default async function ProfilePage() {
//   const user: User | null = await getUserServer();
//   console.log("user in ProfilePage:", user);

//   if (!user) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <div className="max-w-xl mx-auto mt-10 text-center">
//       <Image
//         src={user.avatar || "/default-avatar.png"}
//         alt="Avatar"
//         width={128}
//         height={128}
//         className="rounded-full mx-auto"
//       />
//       <h1 className="text-2xl font-bold mt-4">{user.username}</h1>
//       <p className="text-gray-600">{user.email}</p>
//       <Link
//         href="/profile/edit"
//         className="mt-4 inline-block text-blue-600 hover:underline"
//       >
//         Edit Profile
//       </Link>
//     </div>
//   );
// }

// app/(private routes)/profile/page.tsx
import Image from "next/image";
import Link from "next/link";
import { getUserServer } from "../../../lib/api/serverApi";
import { cookies } from "next/headers";
import type { Metadata } from "next";
import type { User } from "../../../types/user";
import css from "./ProfilePage.module.css"; // 👈 імпорт стилів

export const metadata: Metadata = {
  title: "Profile",
  description: "Перегляд профілю користувача NoteHub",
};

export default async function ProfilePage() {
  // --- 1. Отримуємо cookies через Next.js ---
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value ?? null;
  const refreshToken = cookieStore.get("refreshToken")?.value ?? null;

  // --- 2. Формуємо Cookie header ---
  const cookieHeader = [
    accessToken ? `accessToken=${accessToken}` : "",
    refreshToken ? `refreshToken=${refreshToken}` : "",
  ]
    .filter(Boolean)
    .join("; ");

  // --- 3. Отримуємо користувача з серверу ---
  const user: User | null = await getUserServer(cookieHeader);
  console.log("user in ProfilePage:", user);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <main className={css.mainContent}>
      <section className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar || "/default-avatar.png"}
            alt="Avatar"
            width={128}
            height={128}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <div className={css.usernameWrapper}>
            <span>{user.username}</span>
          </div>
          <p>{user.email}</p>
        </div>
      </section>
    </main>
  );
}

// app/(private routes)/profile/page.tsx
// import Image from "next/image";
// import Link from "next/link";
// import { getUserServer } from "../../../lib/api/serverApi";
// import { cookies } from "next/headers"; // використовується для отримання cookies
// import type { Metadata } from "next";
// import type { User } from "../../../types/user";

// export const metadata: Metadata = {
//   title: "Profile",
//   description: "Перегляд профілю користувача NoteHub",
// };

// export default async function ProfilePage() {
//   // --- 1. Отримуємо cookies через Next.js ---
//   const cookieStore = await cookies(); // 👈 додано await
//   const accessToken = cookieStore.get("accessToken")?.value ?? null;
//   const refreshToken = cookieStore.get("refreshToken")?.value ?? null;

//   // --- 2. Формуємо Cookie header ---
//   const cookieHeader = [
//     accessToken ? `accessToken=${accessToken}` : "",
//     refreshToken ? `refreshToken=${refreshToken}` : "",
//   ]
//     .filter(Boolean)
//     .join("; ");

//   // --- 3. Отримуємо користувача з серверу ---
//   const user: User | null = await getUserServer(cookieHeader);
//   console.log("user in ProfilePage:", user);

//   if (!user) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <div className="max-w-xl mx-auto mt-10 text-center">
//       <Image
//         src={user.avatar || "/default-avatar.png"}
//         alt="Avatar"
//         width={128}
//         height={128}
//         className="rounded-full mx-auto"
//       />
//       <h1 className="text-2xl font-bold mt-4">{user.username}</h1>
//       <p className="text-gray-600">{user.email}</p>
//       <Link
//         href="/profile/edit"
//         className="mt-4 inline-block text-blue-600 hover:underline"
//       >
//         Edit Profile
//       </Link>
//     </div>
//   );
// }
