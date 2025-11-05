import { useMsal } from "@azure/msal-react";

// Home Component
export const Home = ({ onNavigate, user }: { onNavigate: (route: string) => void; user: any }) => {
  const { instance } = useMsal();
  
  const handleLogout = async () => {
    await instance.logout();
    onNavigate('login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-12 w-full max-w-3xl text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">Welcome!</h1>
        {user && (
          <p className="text-2xl text-gray-700 mb-4">
            Hello, <span className="font-semibold text-teal-600">{user.name || user.username}</span>!
          </p>
        )}
        <p className="text-xl text-gray-600 mb-8">
          You have successfully logged in to your account.
        </p>
        <button
          onClick={handleLogout}
          className="bg-teal-600 text-white py-2 px-6 rounded-md hover:bg-teal-700 transition-colors font-medium"
        >
          Logout
        </button>
      </div>
    </div>
  );
};