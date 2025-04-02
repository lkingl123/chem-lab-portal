// /src/hooks/useCosmosRole.ts
"use client";

import { useEffect, useState } from "react";

export function useCosmosRole() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/me", {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("id_token")}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setRole(data.role);
        setLoading(false);
      })
      .catch(() => {
        setRole(null);
        setLoading(false);
      });
  }, []);

  return { role, loading };
}
