import { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";

export function useCosmosRole() {
  const { accounts } = useMsal();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (accounts.length === 0) {
        console.log("🚫 No MSAL account, skipping role fetch");
        setLoading(false);
        setRole(null);
        return;
      }

      const token = accounts[0].idToken;
      if (!token) {
        console.warn("⚠️ No ID token found");
        setLoading(false);
        setRole(null);
        return;
      }

      try {
        const res = await fetch("/api/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log("🔑 Fetched role in useCosmosRole:", data);
        setRole(data.role || null);
      } catch (err) {
        console.error("❌ Failed to fetch role:", err);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [accounts]);

  return { role, loading };
}
