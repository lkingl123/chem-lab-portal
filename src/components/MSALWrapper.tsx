'use client';

import { ReactNode, useEffect, useState } from "react";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "@/lib/authConfig";

// ✅ Create MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

export default function MSALWrapper({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // ✅ Ensure MSAL is initialized before rendering anything that uses it
    msalInstance.initialize().then(() => {
      console.log("✅ MSAL initialized");
      setIsInitialized(true);
    }).catch((err) => {
      console.error("❌ MSAL initialization failed:", err);
    });
  }, []);

  // ✅ Prevent early render before MSAL is ready
  if (!isInitialized) return null;

  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
}
