'use client';

import { useMsal } from "@azure/msal-react";
import { loginRequest } from "@/lib/authConfig";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { instance, accounts } = useMsal();
  const router = useRouter();

  const handleLogin = () => {
    instance.loginRedirect(loginRequest);
  };

  useEffect(() => {
    if (accounts.length > 0) {
      const email = accounts[0].username.toLowerCase();

      if (email.includes("chemist")) router.push("/chemist");
      else if (email.includes("tech")) router.push("/technician");
      else if (email.includes("manager")) router.push("/manager");
    }
  }, [accounts]);

  return (
    <main className="min-h-screen bg-gradient-to-tr from-[#e1efff] via-white to-[#f9f9f9] flex items-center justify-center">
      <div className="max-w-xl w-full bg-white shadow-xl rounded-3xl p-10 border border-gray-100">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex items-center space-x-3">
            <div className="text-5xl">🧫</div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight">
              Chem Lab Portal
            </h1>
          </div>

          <p className="text-gray-500 text-center text-sm md:text-base max-w-md">
            Manage formulas, batch records, and team workflows in a unified lab dashboard.
          </p>

          <button
            onClick={handleLogin}
            className="mt-4 w-full md:w-auto bg-blue-600 hover:bg-blue-700 transition-all text-white font-medium py-3 px-8 rounded-lg shadow-lg"
          >
            🔐 Sign in with Microsoft
          </button>

          <div className="text-xs text-gray-400 pt-6 text-center">
            Built for lab teams • Powered by Azure
          </div>
        </div>
      </div>
    </main>
  );
}
