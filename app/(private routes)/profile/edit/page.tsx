"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface User {
  id: string;
  email: string;
  username?: string | null;
  avatar?: string | null;
}

export default function EditProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [username, setUsername] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/users/me`, {
          withCredentials: true,
        });
        setUser(res.data);

        setUsername(res.data.username ?? "");
        setAvatar(res.data.avatar ?? "");
      } catch (err) {
        console.error(err);
        router.push("/sign-in");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.patch(
        `${BASE_URL}/users/me`,
        { username, avatar },
        { withCredentials: true },
      );
      router.push("/profile");
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Avatar URL</label>
          <input
            type="text"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="flex items-center gap-4">
          <Image
            src={avatar || "/default-avatar.png"}
            alt="avatar preview"
            width={64}
            height={64}
            className="rounded-full border"
          />
          <span>{username || user.email}</span>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
