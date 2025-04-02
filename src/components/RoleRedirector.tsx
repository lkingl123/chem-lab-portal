'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCosmosRole } from "@/hooks/useCosmosRole";

export default function RoleRedirector() {
  const router = useRouter();
  const { role, loading } = useCosmosRole();

  useEffect(() => {
    if (loading) return;

    if (role === "Manager") router.push("/manager");
    else if (role === "Technician") router.push("/technician");
    else if (role === "Chemist") router.push("/chemist");
    else router.push("/unauthorized");
  }, [role, loading]);

  return null;
}
