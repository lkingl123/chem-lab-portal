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
      const account = accounts[0];
      const roles: string[] | undefined = account.idTokenClaims?.roles;

      if (roles?.includes("Manager")) {
        router.push("/manager");
      } else if (roles?.includes("Technician")) {
        router.push("/technician");
      } else if (roles?.includes("Chemist")) {
        router.push("/chemist");
      } else {
        router.push("/unauthorized"); // fallback if user has no role assigned
      }
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
            className="cursor-pointer mt-4 w-full md:w-auto bg-blue-600 hover:bg-blue-700 transition-all text-white font-medium py-3 px-8 rounded-lg shadow-lg"
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
