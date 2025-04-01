'use client';

import { useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { useRouter } from "next/navigation";

export default function RoleRedirector() {
  const { accounts } = useMsal();
  const router = useRouter();

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
        // fallback or unauthorized screen
        router.push("/unauthorized");
      }
    }
  }, [accounts]);

  return null;
}
