'use client';

import { useMsal } from "@azure/msal-react";

export default function LogoutButton() {
  const { instance } = useMsal();

  const handleLogout = () => {
    instance.logoutRedirect(); // Or use logoutPopup() for SPA-style logout
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
