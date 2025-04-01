'use client';

import { useMsal } from "@azure/msal-react";

export default function LogoutButton() {
  const { instance, accounts } = useMsal();

  const handleLogout = () => {
    if (accounts.length > 0) {
      instance.logoutPopup({
        account: accounts[0],
        postLogoutRedirectUri: "/", // stays in your app only
        mainWindowRedirectUri: "/", // prevents full page reload fallback
      });
    }
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
