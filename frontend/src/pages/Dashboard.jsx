import { useState } from "react";
import { useNavigate } from "react-router";
import AdminDashboard from "../../components/dashboard/AdminDashboard";
import UserDashboard from "../../components/dashboard/UserDashboard";
import StoreOwnerDashboard from "../../components/dashboard/StoreOwnerDashboard";
import API from "../../src/services/api";
import toast from "react-hot-toast";

export default function Dashboard() {
  const navigate = useNavigate();

  const [role, setRole] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [authError, setAuthError] = useState("");

  const handleRoleSelection = async (targetRole) => {
    setAuthError("");

    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setAuthError("No active login session discovered. Please sign in again.");
      setTimeout(() => navigate("/auth"), 1500);
      return;
    }

    try {
      setIsVerifying(true);

      const response = await API.post("/auth/verify-role", {
        desiredRole: targetRole,
      });

      setRole(response.data.role);
      toast.success(`${targetRole} role verified`);
    } catch (err) {
      console.error(
        "Role authorization mismatch verification failure:",
        err.response?.data,
      );
      setAuthError(
        err.response?.data?.error ||
          `Unauthorized: You do not have permissions for ${targetRole}.`,
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setRole(null);
    navigate("/auth");
  };

  if (!role) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center font-sans">
        <div className="bg-white border border-gray-200 rounded-2xl p-10 shadow-sm text-center max-w-sm w-full">
          <div className="text-3xl mb-2">⭐</div>
          <h1 className="text-lg font-semibold text-gray-900 mb-1">
            RateMyStore
          </h1>
          <p className="text-xs text-gray-400 mb-6">
            Select a role to preview the dashboard
          </p>

          {authError && (
            <div className="mb-4 p-2.5 text-left text-xs font-medium text-red-700 bg-red-50 border border-red-100 rounded-xl leading-snug">
              ⚠️ {authError}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              disabled={isVerifying}
              onClick={() => handleRoleSelection("Admin")}
              className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              🛡️ System Administrator
            </button>

            <button
              disabled={isVerifying}
              onClick={() => handleRoleSelection("User")}
              className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              👤 Normal User
            </button>

            <button
              disabled={isVerifying}
              onClick={() => handleRoleSelection("StoreOwner")}
              className="w-full py-2.5 rounded-xl bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              🏪 Store Owner
            </button>
          </div>

          {isVerifying && (
            <p className="text-[11px] text-gray-400 mt-4 animate-pulse">
              Querying database permissions node...
            </p>
          )}
        </div>
      </div>
    );
  }

  if (role === "Admin") return <AdminDashboard onLogout={handleLogout} />;
  if (role === "User") return <UserDashboard onLogout={handleLogout} />;
  if (role === "StoreOwner")
    return <StoreOwnerDashboard onLogout={handleLogout} />;

  return null;
}
