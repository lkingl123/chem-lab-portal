export const msalConfig = {
    auth: {
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID!,
      authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_TENANT_ID}`,
      redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI,
      postLogoutRedirectUri: process.env.NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI,
    },
    cache: {
        cacheLocation: "localStorage", // ✅ Ensures session sticks (or change to "sessionStorage" for session-only)
        storeAuthStateInCookie: false, // ✅ True if you have issues with IE
      },
  };
  
  export const loginRequest = {
    scopes: ["openid", "profile", "User.Read"],
  };
  