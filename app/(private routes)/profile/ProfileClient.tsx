"use client";

import React from "react";
import css from "./ProfileClient.module.css";
import type { User } from "../../../types/user";
import Image from "next/image";

type ProfileClientProps = {
  user: User;
};

export default function ProfileClient({ user }: ProfileClientProps) {
  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile</h1>

          <button className={css.editProfileButton}>Edit Profile</button>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar || "/default-avatar.png"}
            alt="Avatar"
            width={100}
            height={100}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <p>
            <strong>Name:</strong> {user.username || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>ID:</strong> {user.id}
          </p>
        </div>
      </div>
    </main>
  );
}
