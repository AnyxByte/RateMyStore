import { useState, useEffect } from "react";
import useSortableTable from "../../src/hooks/useSortableTable";
import API from "../../src/services/api";
import { StatCard } from "./StatCard";
import SortableHeader from "./SortableHeader";
import PasswordChangeForm from "./PasswordChangeForm";
import Modal from "./Model";
import Layout from "./Layout";
import RoleBadge from "./RoleBadge";
import StarDisplay from "./StarDisplay";
import AddNewUser from "./AddNewUser";
import AddNewStore from "./AddNewStore";

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  const [userFilter, setUserFilter] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
  });
  const [storeFilter, setStoreFilter] = useState({
    name: "",
    email: "",
    address: "",
  });

  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddStore, setShowAddStore] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);

  const refreshDashboardData = async () => {
    try {
      setLoading(true);
      const response = await API.get("/admin/dashboard-extended");
      setUsers(response.data.users);
      setStores(response.data.stores);
    } catch (err) {
      console.error("Administrative data initialization error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshDashboardData();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userFilter.name.toLowerCase()) &&
      u.email.toLowerCase().includes(userFilter.email.toLowerCase()) &&
      u.address.toLowerCase().includes(userFilter.address.toLowerCase()) &&
      (userFilter.role === "" ||
        u.role.toLowerCase() === userFilter.role.toLowerCase()),
  );

  const filteredStores = stores.filter(
    (s) =>
      s.store_name.toLowerCase().includes(storeFilter.name.toLowerCase()) &&
      s.store_email.toLowerCase().includes(storeFilter.email.toLowerCase()) &&
      s.store_address.toLowerCase().includes(storeFilter.address.toLowerCase()),
  );

  const {
    sorted: sortedUsers,
    sortConfig: uSort,
    toggle: uToggle,
  } = useSortableTable(filteredUsers, "name");

  const {
    sorted: sortedStores,
    sortConfig: sSort,
    toggle: sToggle,
  } = useSortableTable(filteredStores, "store_name");

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "users", label: "Users", icon: "👥" },
    { id: "stores", label: "Stores", icon: "🏪" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center font-sans px-4">
        <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full mb-2"></div>
        <p className="text-xs text-gray-400 font-medium text-center">
          Aggregating platform system metrics...
        </p>
      </div>
    );
  }

  return (
    <Layout
      role="admin"
      onLogout={onLogout}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      tabs={tabs}
    >
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Admin Overview
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Platform-wide summary
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard
              icon="👥"
              label="Total Users"
              value={users.length}
              color="blue"
            />
            <StatCard
              icon="🏪"
              label="Total Stores"
              value={stores.length}
              color="emerald"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                setActiveTab("users");
                setShowAddUser(true);
              }}
              className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 text-white text-sm rounded-xl font-medium hover:bg-blue-700 transition-colors text-center"
            >
              + Add User
            </button>
            <button
              onClick={() => {
                setActiveTab("stores");
                setShowAddStore(true);
              }}
              className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 text-white text-sm rounded-xl font-medium hover:bg-emerald-700 transition-colors text-center"
            >
              + Add Store
            </button>
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h1 className="text-xl font-semibold text-gray-900">Users</h1>
            <button
              onClick={() => setShowAddUser(true)}
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white text-sm rounded-xl font-medium hover:bg-blue-700 transition-colors text-center"
            >
              + Add User
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {["name", "email", "address"].map((f) => (
              <input
                key={f}
                placeholder={`Filter by ${f}`}
                value={userFilter[f]}
                onChange={(e) =>
                  setUserFilter((p) => ({ ...p, [f]: e.target.value }))
                }
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white"
              />
            ))}
            <select
              value={userFilter.role}
              onChange={(e) =>
                setUserFilter((p) => ({ ...p, role: e.target.value }))
              }
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-blue-400 bg-white text-gray-700"
            >
              <option value="">All roles</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
              <option value="StoreOwner">Store Owner</option>
            </select>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <SortableHeader
                      label="Name"
                      field="name"
                      sortConfig={uSort}
                      onSort={uToggle}
                    />
                    <SortableHeader
                      label="Email"
                      field="email"
                      sortConfig={uSort}
                      onSort={uToggle}
                    />
                    <SortableHeader
                      label="Address"
                      field="address"
                      sortConfig={uSort}
                      onSort={uToggle}
                    />
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {sortedUsers.map((u) => (
                    <tr
                      key={u.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {u.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {u.email}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
                        {u.address}
                      </td>
                      <td className="px-4 py-3">
                        <RoleBadge
                          role={
                            u.role
                              ? u.role.toLowerCase().replace("owner", "_owner")
                              : "user"
                          }
                        />
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => {
                            const ownerStore = stores.find(
                              (s) => s.owner_id === u.id,
                            );
                            setSelectedUser({ ...u, linkedStore: ownerStore });
                          }}
                          className="text-xs text-blue-600 hover:underline font-medium"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View: High-contrast card elements instead of squished rows */}
            <div className="block md:hidden divide-y divide-gray-100">
              {sortedUsers.map((u) => (
                <div key={u.id} className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-semibold text-gray-900 truncate">
                      {u.name}
                    </div>
                    <RoleBadge
                      role={
                        u.role
                          ? u.role.toLowerCase().replace("owner", "_owner")
                          : "user"
                      }
                    />
                  </div>
                  <div className="text-xs text-gray-500 break-all">
                    {u.email}
                  </div>
                  <div className="text-xs text-gray-400 line-clamp-2">
                    {u.address}
                  </div>
                  <div className="pt-1 flex justify-end">
                    <button
                      onClick={() => {
                        const ownerStore = stores.find(
                          (s) => s.owner_id === u.id,
                        );
                        setSelectedUser({ ...u, linkedStore: ownerStore });
                      }}
                      className="text-xs text-blue-600 font-medium px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      View Profile Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {sortedUsers.length === 0 && (
              <div className="text-center py-10 text-sm text-gray-400 px-4">
                No users match active filter bounds
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "stores" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h1 className="text-xl font-semibold text-gray-900">Stores</h1>
            <button
              onClick={() => setShowAddStore(true)}
              className="w-full sm:w-auto px-4 py-2 bg-emerald-600 text-white text-sm rounded-xl font-medium hover:bg-emerald-700 transition-colors text-center"
            >
              + Add Store
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {["name", "email", "address"].map((f) => (
              <input
                key={f}
                placeholder={`Filter by ${f}`}
                value={storeFilter[f]}
                onChange={(e) =>
                  setStoreFilter((p) => ({ ...p, [f]: e.target.value }))
                }
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 bg-white"
              />
            ))}
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <SortableHeader
                      label="Name"
                      field="store_name"
                      sortConfig={sSort}
                      onSort={sToggle}
                    />
                    <SortableHeader
                      label="Email"
                      field="store_email"
                      sortConfig={sSort}
                      onSort={sToggle}
                    />
                    <SortableHeader
                      label="Address"
                      field="store_address"
                      sortConfig={sSort}
                      onSort={sToggle}
                    />
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Rating
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {sortedStores.map((s) => (
                    <tr
                      key={s.store_id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {s.store_name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {s.store_email}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
                        {s.store_address}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <StarDisplay value={s.overall_rating} />
                          <span className="text-xs font-semibold text-amber-600">
                            {s.overall_rating.toFixed(1)}
                          </span>
                          <span className="text-xs text-gray-400">
                            ({s.total_ratings_count})
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="block md:hidden divide-y divide-gray-100">
              {sortedStores.map((s) => (
                <div key={s.store_id} className="p-4 space-y-2">
                  <div className="text-sm font-semibold text-gray-900">
                    {s.store_name}
                  </div>
                  <div className="text-xs text-gray-500 break-all">
                    {s.store_email}
                  </div>
                  <div className="text-xs text-gray-400 line-clamp-2">
                    {s.store_address}
                  </div>
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-gray-50 p-2.5 rounded-xl">
                    <span className="text-xs font-medium text-gray-500">
                      Overall Matrix Score:
                    </span>
                    <div className="flex items-center gap-1.5">
                      <StarDisplay value={s.overall_rating} />
                      <span className="text-xs font-bold text-amber-600">
                        {s.overall_rating.toFixed(1)}
                      </span>
                      <span className="text-xs text-gray-400">
                        ({s.total_ratings_count})
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {sortedStores.length === 0 && (
              <div className="text-center py-10 text-sm text-gray-400 px-4">
                No stores discovered in database subset
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="max-w-md mx-auto md:mx-0 space-y-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Account Settings
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">Update your password</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-800 mb-4">
              Change Password
            </h2>
            <PasswordChangeForm accentColor="blue" />
          </div>
        </div>
      )}

      {selectedUser && (
        <Modal onClose={() => setSelectedUser(null)} title="User Details">
          <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
            {[
              ["Name", selectedUser.name],
              ["Email", selectedUser.email],
              ["Address", selectedUser.address],
            ].map(([k, v]) => (
              <div
                key={k}
                className="border-b border-gray-100 pb-3 last:border-0"
              >
                <div className="text-xs text-gray-400 font-medium mb-0.5">
                  {k}
                </div>
                <div className="text-sm text-gray-800 font-medium wrap-break-word">
                  {v}
                </div>
              </div>
            ))}
            <div className="border-b border-gray-100 pb-3">
              <div className="text-xs text-gray-400 font-medium mb-1">Role</div>
              <RoleBadge role={selectedUser.role} />
            </div>

            {selectedUser.linkedStore ? (
              <div className="pt-1">
                <div className="text-xs text-gray-400 font-medium mb-1 wrap-break-word">
                  Owned Store Profile: {selectedUser.linkedStore.store_name}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <StarDisplay
                    value={selectedUser.linkedStore.overall_rating}
                    size="md"
                  />
                  <span className="text-sm font-semibold text-amber-600">
                    {selectedUser.linkedStore.overall_rating.toFixed(1)}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({selectedUser.linkedStore.total_ratings_count} ratings)
                  </span>
                </div>
              </div>
            ) : (
              selectedUser.role === "store_owner" && (
                <div className="text-xs text-gray-400 italic">
                  No storefront entry linked to this merchant yet.
                </div>
              )
            )}
          </div>
        </Modal>
      )}

      {showAddUser && (
        <Modal onClose={() => setShowAddUser(false)} title="Add New User">
          <AddNewUser
            setShowAddUser={setShowAddUser}
            onSuccess={refreshDashboardData}
          />
        </Modal>
      )}

      {showAddStore && (
        <Modal onClose={() => setShowAddStore(false)} title="Add New Store">
          <AddNewStore
            setShowAddStore={setShowAddStore}
            onSuccess={refreshDashboardData}
          />
        </Modal>
      )}
    </Layout>
  );
}
