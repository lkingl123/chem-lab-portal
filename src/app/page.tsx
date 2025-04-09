'use client';

import { useMsal } from "@azure/msal-react";
import { loginRequest } from "@/lib/authConfig";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoggingLoadingSpinner from "@/components/LoggingLoadingSpinner";

export default function Home() {
  const { instance, accounts } = useMsal();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    console.log("🔐 Login initiated");
    sessionStorage.setItem("post_login", "true");
    setLoading(true);
    instance.loginRedirect(loginRequest);
  };

  useEffect(() => {
    const checkRoleAndRedirect = async () => {
      console.log("👀 Checking for account...");
      setLoading(true);

      const account = accounts[0];
      if (!account) {
        console.log("✅ No MSAL account found, stopping spinner");
        setLoading(false);
        return;
      }

      console.log("👤 Account found:", account);

      const token = account.idToken;
      if (!token) {
        console.warn("❌ No ID token found, redirecting to /unauthorized");
        setLoading(false);
        router.push("/unauthorized");
        return;
      }

      const postLoginFlag = sessionStorage.getItem("post_login");
      console.log("🔁 post_login flag:", postLoginFlag);

      if (!postLoginFlag) {
        console.log("🚫 No post-login flag, skipping redirect");
        setLoading(false);
        return;
      }

      sessionStorage.removeItem("post_login");
      sessionStorage.setItem("id_token", token);

      console.log("📡 Fetching role from /api/me");

      try {
        const res = await fetch("/api/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log("✅ Role data received:", data);

        setTimeout(() => {
          if (data.role === "Manager") {
            console.log("➡️ Redirecting to /manager");
            router.push("/manager");
          } else if (data.role === "Technician") {
            console.log("➡️ Redirecting to /technician");
            router.push("/technician");
          } else if (data.role === "Chemist") {
            console.log("➡️ Redirecting to /chemist");
            router.push("/chemist");
          } else {
            console.warn("❓ Role not recognized, redirecting to /unauthorized");
            router.push("/unauthorized");
          }
        }, 1000);
      } catch (err) {
        console.error("❌ Role check failed:", err);
        setLoading(false);
        router.push("/unauthorized");
      }
    };

    console.log("📦 MSAL accounts on load:", accounts);
    checkRoleAndRedirect();
  }, [accounts]);

  return (
    <>
      {loading && <LoggingLoadingSpinner />}
      <main className="min-h-screen bg-gradient-to-tr from-[#e1efff] via-white to-[#f9f9f9] flex items-center justify-center">
        <div className="max-w-xl w-full bg-white shadow-xl rounded-3xl p-10 border border-gray-100">
          <div className="flex flex-col items-center space-y-6">
            <div className="flex items-center space-x-3">
              <div className="text-5xl">🧫</div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight">
                Chem Lab Portal Dev
              </h1>
            </div>

            <p className="text-gray-500 text-center text-sm md:text-base max-w-md">
              Accountability, Logging, and Transparency for Chem Lab Teams.
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
    </>
  );
}
