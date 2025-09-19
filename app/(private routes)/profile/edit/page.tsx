"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getCurrentUser, updateUsername } from "../../../../lib/api/clientApi";
import { useAuthStore } from "../../../../lib/store/authStore";

export default function EditProfilePage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");

  useEffect(() => {
    async function fetchUser() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        setUsername(currentUser.username);
      } catch {
        router.push("/sign-in");
      } finally {
        setLoading(false);
      }
    }

    if (!user) fetchUser();
    else setLoading(false);
  }, [user, router, setUser]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const updatedUser = await updateUsername(username);
      setUser(updatedUser);
      router.push("/profile");
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Failed to update profile");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={user.email}
            readOnly
            className="w-full border p-2 rounded bg-gray-100"
          />
        </div>

        <div>
          <label className="block mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="flex items-center gap-4">
          <Image
            src={user.avatar || "/default-avatar.png"}
            alt="avatar preview"
            width={64}
            height={64}
            className="rounded-full border"
          />
          <span>{username || user.email}</span>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
          <button
            type="button"
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            onClick={() => router.push("/profile")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
