import { Link } from "react-router-dom";
import {
  FiHome,
  FiUser,
  FiLogOut,
  FiBell,
  FiMessageCircle,
} from "react-icons/fi";
import useAuth from "../hooks/useAuth";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <FiHome className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              NeighborhoodHelp
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                {/* User Menu */}
                <div className="flex items-center space-x-4">
                  <NotificationBell />

                  <Link
                    to="/my-chats"
                    className="text-gray-600 hover:text-blue-600 font-medium px-3 py-2 rounded-lg hover:bg-blue-50 transition-all duration-200 flex items-center space-x-2"
                  >
                    <FiMessageCircle className="w-4 h-4" />
                    <span>My Chats</span>
                  </Link>

                  <div className="flex items-center space-x-3 bg-gray-50 rounded-full px-4 py-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <FiUser className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium">
                      Hello, {user.name}
                    </span>
                  </div>

                  <button
                    onClick={logout}
                    className="px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
                  >
                    <FiLogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary flex items-center space-x-2"
                >
                  <FiUser className="w-4 h-4" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
