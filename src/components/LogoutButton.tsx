'use client';

import { useMsal } from "@azure/msal-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const { instance, accounts } = useMsal();
  const router = useRouter();

  const handleLogout = async () => {
    console.log("🚪 Logout clicked");
    sessionStorage.removeItem("post_login");

    const account = accounts[0];
    if (!account) {
      console.log("⚠️ No account found — already logged out?");
      router.push("/"); // ✅ ensure we leave /manager
      return;
    }

    console.log("🧹 Clearing session and redirecting with logoutHint");

    // ✅ Force local page change before full MSAL redirect
    router.push("/");

    // Delay to allow local push to finish
    setTimeout(() => {
      instance.logoutRedirect({
        postLogoutRedirectUri: "/",
        logoutHint: account.username,
        onRedirectNavigate: () => false,
      });
    }, 100); // Short delay to allow router push to finish
  };

  useEffect(() => {
    console.log("👥 Current MSAL accounts:", accounts);
  }, [accounts]);

  return (
    <button
      onClick={handleLogout}
      className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition-all"
    >
      🚪 Logout
    </button>
  );
}
