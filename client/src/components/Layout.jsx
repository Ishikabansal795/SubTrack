import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";

export default function Layout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="page">
        <Outlet />
      </main>
      <footer className="footer">SubTrack reads only the files and receipts you share. It never touches your bank account.</footer>
    </div>
  );
}
