export const msalConfig = {
    auth: {
      clientId: "ff623be8-fc5b-4348-965b-4cd2a59103ee",
      authority: "https://login.microsoftonline.com/a68f6642-b44d-47f5-b59a-bb5106142d86",
      redirectUri: "https://chem-lab-portal.vercel.app/",
      postLogoutRedirectUri: "https://chem-lab-portal.vercel.app/",
    },
  };
  
  export const loginRequest = {
    scopes: ["openid", "profile", "User.Read"],
  };
  