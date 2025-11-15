import { useEffect, useState } from "react";
import type { Route } from "./+types/menu";
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

  const handleLogin = async (username: string) => {
    // TODO: Migrate existing user to B2C, then redirect to reset password

    const params = new URLSearchParams();
    params.append("username", username);

    const response = await fetch(`https://verify-user-g2b9gtgwcjgcafh0.australiasoutheast-01.azurewebsites.net/api/authMethod?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.status === 404) {
      // User not found, navigate to signup
      return;
    }

    // Redirect to login policy, if user exists
    if (response.status === 200) {
      const data = await response.json();
      if (data.method === 'sms') {
        instance.loginRedirect({
          authority: "https://sxpoctest.b2clogin.com/sxpoctest.onmicrosoft.com/B2C_1_SIGNINSMS",
          scopes: ["openid", "offline_access"],
          loginHint: username
        });
      } else {
        instance.loginRedirect({
          scopes: ["openid", "offline_access"],
          loginHint: username
        });
      }
    }
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
