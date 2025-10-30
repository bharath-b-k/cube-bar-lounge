"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const expected = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    if (!expected) {
      toast.error("Admin password is not configured.");
      return;
    }
    setLoading(true);
    try {
      if (password === expected) {
        localStorage.setItem("isAdmin", "true");
        toast.success("Welcome, admin!");
        router.replace("/admin/dashboard");
      } else {
        toast.error("Invalid password");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="mx-auto flex max-w-md flex-col px-6 py-24">
        <h1 className="text-center text-3xl font-bold">Cube Bar Lounge Admin</h1>
        <p className="mt-2 text-center text-white/70">Sign in to continue</p>
        <form
          onSubmit={onSubmit}
          className="mt-8 rounded-2xl bg-white p-6 text-black shadow-xl backdrop-blur-lg"
        >
          <label className="block text-sm font-medium text-gray-900">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter admin password"
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-purple-600 px-5 py-2.5 font-medium text-white shadow transition hover:bg-purple-500 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}


