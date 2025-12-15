import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const onLogout = () => {
    logout();
    navigate("/login");
    setIsMenuOpen(false);
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "PARENT": return "Parent";
      case "CLINIC": return "Clinic Staff";
      case "ADMIN": return "Administrator";
      default: return role;
    }
  };

  const getClinicLabel = (user) => {
    if (user?.role !== "CLINIC") return null;
    return user.name || user.clinicId;
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Home */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">K</span>
              </div>
              <span className="text-lg font-bold text-gray-800 hidden sm:block">KinderCare AI</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-700 font-medium transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition shadow"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                {user.role === "PARENT" && (
                  <Link
                    to="/parent"
                    className="text-gray-600 hover:text-blue-700 font-medium transition"
                  >
                    Parent Dashboard
                  </Link>
                )}
                {user.role === "CLINIC" && (
                  <Link
                    to="/clinic"
                    className="text-gray-600 hover:text-blue-700 font-medium transition"
                  >
                    Clinic Dashboard
                  </Link>
                )}
                {user.role === "ADMIN" && (
                  <Link
                    to="/admin"
                    className="text-gray-600 hover:text-blue-700 font-medium transition"
                  >
                    Admin Panel
                  </Link>
                )}

                {/* User Info & Logout */}
                <div className="flex items-center space-x-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-800">
                      {getRoleLabel(user.role)}
                    </p>
                    {getClinicLabel(user) && (
                      <p className="text-xs text-gray-500">{getClinicLabel(user)}</p>
                    )}
                  </div>
                  <button
                    onClick={onLogout}
                    className="text-sm text-red-600 hover:text-red-800 font-medium transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4">
          {!user ? (
            <div className="flex flex-col space-y-3">
              <Link
                to="/login"
                className="text-gray-700 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-center font-medium hover:from-blue-700 hover:to-indigo-700 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="flex flex-col space-y-3">
              {user.role === "PARENT" && (
                <Link
                  to="/parent"
                  className="text-gray-700 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Parent Dashboard
                </Link>
              )}
              {user.role === "CLINIC" && (
                <Link
                  to="/clinic"
                  className="text-gray-700 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Clinic Dashboard
                </Link>
              )}
              {user.role === "ADMIN" && (
                <Link
                  to="/admin"
                  className="text-gray-700 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Panel
                </Link>
              )}

              <div className="pt-2 border-t border-gray-100">
                <div className="text-sm mb-1">
                  <span className="font-medium">{getRoleLabel(user.role)}</span>
                  {getClinicLabel(user) && <span className="block text-gray-500">{getClinicLabel(user)}</span>}
                </div>
                <button
                  onClick={onLogout}
                  className="text-red-600 font-medium w-full text-left py-2"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
