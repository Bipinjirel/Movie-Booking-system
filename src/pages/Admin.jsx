import Sidebar from "./Sidebar";

export default function Admin() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
        <p>Manage movies, users, and bookings here.</p>
      </div>
    </div>
  );
}
