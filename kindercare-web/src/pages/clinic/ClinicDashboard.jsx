import { NavLink, Outlet } from "react-router-dom";

// Active link styling
const navLinkClasses = ({ isActive }) =>
  `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition ${
    isActive
      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
  }`;

export default function ClinicDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
        <div className="p-5">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">KinderCare AI</h1>
              <p className="text-xs text-gray-500">Clinic Portal</p>
            </div>
          </div>
        </div>

        <nav className="px-3 mt-2">
          <ul className="space-y-1">
            <li>
              <NavLink to="/clinic" end className={navLinkClasses}>
                🏠 Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/clinic/cases" className={navLinkClasses}>
                🩺 Cases
              </NavLink>
            </li>
            <li>
              <NavLink to="/clinic/appointments" className={navLinkClasses}>
                📅 Appointments
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Safety Footer */}
        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-100 text-xs text-gray-500">
          <p>
            <em>AI-assisted triage. Final decisions by clinicians.</em>
          </p>
        </div>
      </aside>

      {/* Mobile Bottom Nav (Optional Enhancement) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <nav className="flex justify-around py-2">
          <NavLink
            to="/clinic"
            className={({ isActive }) =>
              `flex flex-col items-center text-xs ${isActive ? "text-blue-600" : "text-gray-600"}`
            }
          >
            <span>🏠</span>
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/clinic/cases"
            className={({ isActive }) =>
              `flex flex-col items-center text-xs ${isActive ? "text-blue-600" : "text-gray-600"}`
            }
          >
            <span>🩺</span>
            <span>Cases</span>
          </NavLink>
          <NavLink
            to="/clinic/appointments"
            className={({ isActive }) =>
              `flex flex-col items-center text-xs ${isActive ? "text-blue-600" : "text-gray-600"}`
            }
          >
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