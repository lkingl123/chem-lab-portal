'use client';

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-red-100 via-white to-red-50 flex flex-col items-center justify-center px-6 text-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full border border-red-200">
        <h1 className="text-3xl font-bold text-red-600 mb-4">❓ Page Not Found</h1>
        <p className="text-gray-600 mb-6">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <Link
          href="/"
          className="cursor-pointer bg-blue-600 hover:bg-blue-700 transition-all text-white font-semibold px-6 py-2 rounded-lg shadow"
        >
          🏠 Return to Home
        </Link>
      </div>

      <p className="mt-8 text-xs text-gray-400">
        If you typed the address manually, please double-check the spelling.
      </p>
    </main>
  );
}
