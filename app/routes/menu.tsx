import { useEffect, useState } from "react";
import type { Route } from "./+types/home";
import { Login } from "~/login/login";
import { Signup } from "~/signup/signup";
import { Home } from "~/home/home";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useAccount, useMsal } from "@azure/msal-react";
import { type AccountInfo } from "@azure/msal-browser";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Menu() {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState<AccountInfo | null>(null);
  const { instance, accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  
  useEffect(() => {
    if (account) {
        setUser(account);
        setCurrentPage('home');
      } else {
        setCurrentPage('login');
      }
  }, [account]);

  const handleNavigate = (page: string) => {
    console.log(`Navigating to: ${page}`);
    setCurrentPage(page);
  };

  const handleLogin = (username: string) => {
    instance.loginRedirect({
      scopes: ["openid", "offline_access"],
      loginHint: username
    });
  };

  const handleSignup = (username: string, email: string) => {
    // Redirect to reset password policy
    instance.loginRedirect({
      authority: "https://sxpoctest.b2clogin.com/sxpoctest.onmicrosoft.com/B2C_1_PWRESER",
      scopes: ["openid", "offline_access"],
      loginHint: username,
      prompt: "login",
      extraQueryParameters: {
        email_hint: email
      }
    });
  };

  return (
      <div>
        <UnauthenticatedTemplate>
          {currentPage === 'login' && <Login onNavigate={handleNavigate} onLogin={handleLogin} />}
          {currentPage === 'signup' && <Signup onNavigate={handleNavigate} onSignup={handleSignup} onLogin={handleLogin} />}
        </UnauthenticatedTemplate>
        <AuthenticatedTemplate>
          {currentPage === 'home' && <Home onNavigate={handleNavigate} user={user} />}
        </AuthenticatedTemplate>
      </div>
  );
}
