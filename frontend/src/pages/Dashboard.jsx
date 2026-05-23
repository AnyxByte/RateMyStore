import { useState } from "react";
import AdminDashboard from "../../components/dashboard/AdminDashboard";

import UserDashboard from "../../components/dashboard/UserDashboard";
import StoreOwnerDashboard from "../../components/dashboard/StoreOwnerDashboard";

export default function Dashboard() {
  const [role, setRole] = useState(null);

  if (!role) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center font-sans">
        <div className="bg-white border border-gray-200 rounded-2xl p-10 shadow-sm text-center max-w-sm w-full">
          <div className="text-3xl mb-2">⭐</div>
          <h1 className="text-lg font-semibold text-gray-900 mb-1">
            RateMyStore
          </h1>
          <p className="text-xs text-gray-400 mb-7">
            Select a role to preview the dashboard
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setRole("admin")}
              className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              🛡️ System Administrator
            </button>
            <button
              onClick={() => setRole("user")}
              className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
            >
              👤 Normal User
            </button>
            <button
              onClick={() => setRole("store_owner")}
              className="w-full py-2.5 rounded-xl bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-colors"
            >
              🏪 Store Owner
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = () => setRole(null);
  if (role === "admin") return <AdminDashboard onLogout={handleLogout} />;
  if (role === "user") return <UserDashboard onLogout={handleLogout} />;
  if (role === "store_owner")
    return <StoreOwnerDashboard onLogout={handleLogout} />;
}
