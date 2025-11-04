import { useState } from 'react';
import { AlertCircle } from 'lucide-react';


// Login Component
interface LoginPageProps {
  onNavigate: (page: string) => void;
  onLogin: (username: string) => void;
}

export const Login = ({ onNavigate, onLogin }: LoginPageProps) => {
  const [username, setUsername] = useState('');
  const [loading] = useState(false);
  const [error] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Login</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
            <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter your username"
              disabled={loading}
            />
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={() => {
                if (username.trim()) {
                  onLogin(username.trim());
                }
              }}
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Login
            </button>
            <button
              onClick={() => onNavigate('signup')}
              disabled={loading}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Sign Up
            </button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-xs text-yellow-800">
            <strong>Configuration Required:</strong> Update the msalConfig object with your Azure AD B2C credentials:
          </p>
          <ul className="text-xs text-yellow-700 mt-2 space-y-1 ml-4 list-disc">
            <li>clientId: Your Application (client) ID</li>
            <li>authority: Your B2C policy URL</li>
            <li>knownAuthorities: Your tenant name</li>
          </ul>
        </div>
      </div>
    </div>
  );
};