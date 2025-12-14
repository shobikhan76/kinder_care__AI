import { NavLink, Outlet } from "react-router-dom";

export default function ClinicDashboard() {
  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 50px)" }}>
      <aside style={{ width: 220, borderRight: "1px solid #ddd", padding: 16 }}>
        <h3>Clinic</h3>
        <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <NavLink to="/clinic" end>Dashboard</NavLink>
          <NavLink to="/clinic/cases">Cases</NavLink>
          <NavLink to="/clinic/appointments">Appointments</NavLink>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: 20 }}>
        <Outlet />
      </main>
    </div>
  );
}
