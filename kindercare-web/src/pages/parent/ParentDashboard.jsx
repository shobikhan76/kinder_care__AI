import { NavLink, Outlet } from "react-router-dom";

// Helper to style active NavLink
const navLinkClasses = ({ isActive }) =>
  `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition ${
    isActive
      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
  }`;

export default function ParentDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
        <div className="p-5">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <h1 className="text-lg font-bold text-gray-800">KinderCare AI</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">Parent Portal</p>
        </div>

        <nav className="px-3">
          <ul className="space-y-1">
            <li>
              <NavLink to="/parent" end className={navLinkClasses}>
                🏠 Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/parent/children" className={navLinkClasses}>
                👶 My Children
              </NavLink>
            </li>
            <li>
              <NavLink to="/parent/cases" className={navLinkClasses}>
                🩺 My Cases
              </NavLink>
            </li>
            <li>
              <NavLink to="/parent/appointments" className={navLinkClasses}>
                📅 Appointments
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Safety Footer */}
        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-100 text-xs text-gray-500">
          <p>
            <em>Decision-support only. Not a substitute for professional care.</em>
          </p>
        </div>
      </aside>

      {/* Mobile Navigation (Bottom Bar) - Optional Enhancement */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <nav className="flex justify-around py-2">
          <NavLink to="/parent" className="flex flex-col items-center text-xs text-gray-600 hover:text-blue-600">
            <span>🏠</span>
            <span>Home</span>
          </NavLink>
          <NavLink to="/parent/children" className="flex flex-col items-center text-xs text-gray-600 hover:text-blue-600">
            <span>👶</span>
            <span>Children</span>
          </NavLink>
          <NavLink to="/parent/cases" className="flex flex-col items-center text-xs text-gray-600 hover:text-blue-600">
            <span>🩺</span>
            <span>Cases</span>
          </NavLink>
          <NavLink to="/parent/appointments" className="flex flex-col items-center text-xs text-gray-600 hover:text-blue-600">
            <span>📅</span>
            <span>Appointments</span>
          </NavLink>
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 pb-20 md:pb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
}