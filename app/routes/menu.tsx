import { useState } from "react";
import type { Route } from "./+types/home";
import { Login } from "~/login/login";
import { Signup } from "~/signup/signup";
import { Home } from "~/home/home";
import { AuthenticatedTemplate, MsalProvider, UnauthenticatedTemplate, useIsAuthenticated } from "@azure/msal-react";
import { PublicClientApplication, type AccountInfo, type Configuration } from "@azure/msal-browser";

const msalConfig: Configuration = {
  auth: {
    clientId: "548f277e-8e2e-42be-9090-73089c48cf95",
    authority: "https://sxpoctest.b2clogin.com/sxpoctest.onmicrosoft.com/B2C_1_SIGNIN",
    redirectUri: "http://localhost:3000/",
    knownAuthorities: ["sxpoctest.b2clogin.com"]
  },
};

const msalInstance = new PublicClientApplication(msalConfig);

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Menu() {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState<AccountInfo | null>(null);
  if  ( useIsAuthenticated()) {
    setCurrentPage('home');
  }

  const handleNavigate = (page: string) => {
    console.log(`Navigating to: ${page}`);
    setCurrentPage(page);
  };

  const handleLogin = (username: string) => {
    msalInstance.loginRedirect({
      scopes: ["openid", "offline_access"],
      loginHint: username
    });
  };

  const handleSignup = (username: string, email: string) => {
    // Redirect to reset password policy
    msalInstance.loginRedirect({
      authority: "https://sxpoctest.b2clogin.com/sxpoctest.onmicrosoft.com/B2C_1_PWRESER",
      scopes: ["openid", "offline_access"],
      loginHint: username,
      prompt: "login",
      extraQueryParameters: {
        email_hint: email
      }
    });
  }

  return (
    <MsalProvider instance={msalInstance}>
      <div>
        <UnauthenticatedTemplate>
          {currentPage === 'login' && <Login onNavigate={handleNavigate} onLogin={handleLogin} />}
          {currentPage === 'signup' && <Signup onNavigate={handleNavigate} onSignup={handleSignup} onLogin={handleLogin} />}
        </UnauthenticatedTemplate>
        <AuthenticatedTemplate>
          Signed In
          {currentPage === 'home' && <Home onNavigate={handleNavigate} user={user} />}
        </AuthenticatedTemplate>
      </div>
    </MsalProvider>
  );
}
