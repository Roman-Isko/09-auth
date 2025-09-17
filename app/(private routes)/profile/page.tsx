import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";
import { getUserServer } from "../../../lib/api/serverApi";
import type { Metadata } from "next";
import type { User } from "../../../types/user";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  const user: User | null = await getUserServer();

  if (!user) {
    redirect("/sign-in");
  }

  return <ProfileClient user={user} />;
}
