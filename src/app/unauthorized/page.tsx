'use client';

import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-100 via-white to-red-50 flex flex-col items-center justify-center px-6 text-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full border border-red-200">
        <h1 className="text-3xl font-bold text-red-600 mb-4">🚫 Unauthorized Access</h1>
        <p className="text-gray-600 mb-6">
          You’re signed in, but your account does not have a valid lab role assigned.
        </p>
        <button
          onClick={() => router.push("/")}
          className="cursor-pointer bg-blue-600 hover:bg-blue-700 transition-all text-white font-semibold px-6 py-2 rounded-lg shadow"
        >
          🔐 Return to your Dashboard
        </button>
      </div>

      <p className="mt-8 text-xs text-gray-400">
        If you believe this is a mistake, please contact your Lab Administrator.
      </p>
    </main>
  );
}
