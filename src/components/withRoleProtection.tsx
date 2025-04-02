'use client';

import { JSX } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCosmosRole } from "@/hooks/useCosmosRole";

export function withRoleProtection<T extends JSX.IntrinsicAttributes>(
  Component: React.ComponentType<T>,
  allowedRoles: string[]
) {
  return function ProtectedComponent(props: T) {
    const router = useRouter();
    const { role, loading } = useCosmosRole();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
      if (loading) return;

      if (!allowedRoles.includes(role || "")) {
        router.push("/unauthorized");
      } else {
        setAuthorized(true);
      }
    }, [role, loading]);

    return authorized ? <Component {...props} /> : null;
  };
}
