'use client';

import { useMsal } from "@azure/msal-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LogoutButton() {
  const { instance } = useMsal();
  const router = useRouter();

  const handleLogout = () => {
    // Clear MSAL session only (no annoying popup)
    instance.setActiveAccount(null);
    instance.logoutRedirect({
      onRedirectNavigate: () => false, // prevent full nav if needed
      postLogoutRedirectUri: "/",
    });
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition-all"
    >
      🚪 Logout
    </button>
  );
}
