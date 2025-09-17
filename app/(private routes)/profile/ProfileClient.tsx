"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { User } from "../../../types/user";
import css from "./ProfilePage.module.css";

type Props = {
  initialUser: User;
};

export default function ProfileClient({ initialUser }: Props) {
  const [user] = useState<User>(initialUser);

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar || "/default-avatar.png"}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}
