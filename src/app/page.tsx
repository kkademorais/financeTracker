"use client";

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

import { Dashboard } from "@/components/templates/dashboard";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center">
      <p className="text-lg">Loading user session...</p>
    </div>;
  }

  // Debug: Se a sessão existe mas não tem os dados do usuário
  if (status === "authenticated" && !session?.user) {
    return <div className="flex min-h-screen items-center justify-center flex-col gap-4">
      <p className="text-lg text-red-500">Session exists but no user data found</p>
      <pre className="bg-gray-100 p-4 rounded text-sm">
        {JSON.stringify({ status, session }, null, 2)}
      </pre>
      <button 
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => window.location.href = "/login"}
      >
        Go to Login
      </button>
    </div>;
  }

  if (status === "unauthenticated") {
    redirect("/login");
  }

  return <Dashboard />;
} 