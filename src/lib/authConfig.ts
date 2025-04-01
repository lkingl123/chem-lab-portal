export const msalConfig = {
    auth: {
      clientId: "YOUR_CLIENT_ID",
      authority: "https://login.microsoftonline.com/YOUR_TENANT_ID",
      redirectUri: "/",
    },
  };
  
  export const loginRequest = {
    scopes: ["openid", "profile", "User.Read"],
  };
  