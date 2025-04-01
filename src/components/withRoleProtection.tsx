'use client';
import { JSX } from "react";
import { useMsal } from "@azure/msal-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function withRoleProtection<T extends JSX.IntrinsicAttributes>(
    Component: React.ComponentType<T>,
    allowedRoles: string[]
  ) {
    return function ProtectedComponent(props: T) {
      const { accounts } = useMsal();
      const router = useRouter();
      const [authorized, setAuthorized] = useState(false);
  
      useEffect(() => {
        if (accounts.length === 0) {
          router.push("/");
          return;
        }
  
        const account = accounts[0];
        const roles: string[] = account?.idTokenClaims?.roles || [];
  
        const hasAccess = allowedRoles.some(role => roles.includes(role));
        if (!hasAccess) {
          router.push("/unauthorized");
        } else {
          setAuthorized(true);
        }
      }, [accounts]);
  
      return authorized ? <Component {...props} /> : null;
    };
  }
  
