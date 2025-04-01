'use client';

import { useMsal } from "@azure/msal-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoggingLoadingSpinner from "@/components/LoggingLoadingSpinner"; // ✅ import

export default function LogoutButton() {
  const { instance } = useMsal();
  const router = useRouter();
  const [loading, setLoading] = useState(false); // ✅ track spinner state

  const handleLogout = () => {
    setLoading(true); // ✅ show spinner on click
    // Clear MSAL session only (no annoying popup)
    instance.setActiveAccount(null);
    instance.logoutRedirect({
      onRedirectNavigate: () => false, // prevent full nav if needed
      postLogoutRedirectUri: "/",
    });
  };

  return (
    <>
      {loading && <LoggingLoadingSpinner />}
      <button
        onClick={handleLogout}
        className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition-all"
      >
        🚪 Logout
      </button>
    </>
  );
}
