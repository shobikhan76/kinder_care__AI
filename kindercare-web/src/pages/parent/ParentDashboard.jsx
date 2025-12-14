import { NavLink, Outlet } from "react-router-dom";

export default function ParentDashboard() {
  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 50px)" }}>
      <aside style={{ width: 220, borderRight: "1px solid #ddd", padding: 16 }}>
        <h3>Parent</h3>
        <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <NavLink to="/parent" end>Dashboard</NavLink>
          <NavLink to="/parent/children">Children</NavLink>
          <NavLink to="/parent/cases">Cases</NavLink>
          <NavLink to="/parent/appointments">Appointments</NavLink>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: 20 }}>
        <Outlet />
      </main>
    </div>
  );
}
