'use client';

import { JSX, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCosmosRole } from "@/hooks/useCosmosRole";
import { useMsal } from "@azure/msal-react";
import LoggingLoadingSpinner from "@/components/LoggingLoadingSpinner"; // Optional

export function withRoleProtection<T extends JSX.IntrinsicAttributes>(
  Component: React.ComponentType<T>,
  allowedRoles: string[]
) {
  return function ProtectedComponent(props: T) {
    const { accounts } = useMsal();
    const { role, loading } = useCosmosRole();
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
      if (loading) return;

      // ✅ User is not logged in — redirect to home
      if (accounts.length === 0) {
        console.log("🚫 No MSAL account, redirecting to home");
        router.push("/");
        return;
      }

      // ✅ Logged in but role is not allowed
      if (!allowedRoles.includes(role || "")) {
        console.log("⛔ Not authorized, redirecting to /unauthorized");
        router.push("/unauthorized");
      } else {
        setAuthorized(true);
      }
    }, [loading, role, accounts]);

    // ✅ While checking role/account, show spinner or fallback
    if (loading || accounts.length === 0 || !authorized) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <LoggingLoadingSpinner />
        </div>
      );
    }

    return <Component {...props} />;
  };
}
