import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getUserServer } from "../../../lib/api/serverApi";
import type { Metadata } from "next";
import type { User } from "../../../types/user";

export const metadata: Metadata = {
  title: "Profile",
  description: "Перегляд профілю користувача NoteHub",
};

export default async function ProfilePage() {
  const user: User | null = await getUserServer();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="max-w-xl mx-auto mt-10 text-center">
      <Image
        src={user.avatar || "/default-avatar.png"}
        alt="Avatar"
        width={128}
        height={128}
        className="rounded-full mx-auto"
      />
      <h1 className="text-2xl font-bold mt-4">{user.username}</h1>
      <p className="text-gray-600">{user.email}</p>
      <Link
        href="/profile/edit"
        className="mt-4 inline-block text-blue-600 hover:underline"
      >
        Edit Profile
      </Link>
    </div>
  );
}
