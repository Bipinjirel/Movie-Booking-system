import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white p-6">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <ul className="space-y-4">
        <li><Link to="/admin/dashboard" className="hover:text-yellow-400">Movies</Link></li>
        <li><Link to="/admin/users" className="hover:text-yellow-400">Users</Link></li>
      </ul>
    </div>
  );
}
