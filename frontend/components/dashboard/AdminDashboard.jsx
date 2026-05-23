import { useState } from "react";
import { useForm } from "react-hook-form";
import useSortableTable from "../../src/hooks/useSortableTable";
import { StatCard } from "./StatCard";
import SortableHeader from "./SortableHeader";
import PasswordChangeForm from "./PasswordChangeForm";
import Modal from "./Model";
import Layout from "./Layout";
import RoleBadge from "./RoleBadge";
import StarDisplay from "./StarDisplay";

const MOCK_USERS = [
  {
    id: 1,
    name: "Alexandra Johnson Whitfield",
    email: "alex@example.com",
    address: "12 Green Park Lane, New Delhi",
    role: "admin",
  },
  {
    id: 2,
    name: "Marcus Benjamin Thornton",
    email: "marcus@example.com",
    address: "45 Connaught Place, Delhi",
    role: "user",
  },
  {
    id: 3,
    name: "Priya Suresh Nair Krishnamurthy",
    email: "priya@example.com",
    address: "7 Marine Drive, Mumbai",
    role: "user",
  },
  {
    id: 4,
    name: "Jonathan Edward Silverstone",
    email: "jon@example.com",
    address: "99 Brigade Road, Bangalore",
    role: "store_owner",
  },
  {
    id: 5,
    name: "Fatima Zahra Al-Rashid Hasan",
    email: "fatima@example.com",
    address: "22 Park Street, Kolkata",
    role: "store_owner",
  },
  {
    id: 6,
    name: "Rohan Vikram Desai Patwardhan",
    email: "rohan@example.com",
    address: "3 MG Road, Pune",
    role: "user",
  },
];

const MOCK_STORES = [
  {
    id: 1,
    name: "The Artisan Bakehouse Mumbai",
    email: "bakehouse@example.com",
    address: "12 Green Park Lane, Mumbai",
    avgRating: 4.2,
    totalRatings: 128,
  },
  {
    id: 2,
    name: "Sunrise Electronics Trading Hub",
    email: "sunrise@example.com",
    address: "45 Connaught Place, Delhi",
    avgRating: 4.8,
    totalRatings: 87,
  },
  {
    id: 3,
    name: "Himalayan Organic Food Store",
    email: "himalayan@example.com",
    address: "7 Brigade Road, Bangalore",
    avgRating: 3.9,
    totalRatings: 54,
  },
  {
    id: 4,
    name: "Metro Fashion Apparel Boutique",
    email: "metro@example.com",
    address: "99 Park Street, Kolkata",
    avgRating: 4.5,
    totalRatings: 210,
  },
];

const MOCK_RATINGS = [
  {
    id: 1,
    userId: 2,
    storeId: 1,
    rating: 4,
    userName: "Marcus Benjamin Thornton",
    date: "2025-05-10",
  },
  {
    id: 2,
    userId: 3,
    storeId: 1,
    rating: 5,
    userName: "Priya Suresh Nair Krishnamurthy",
    date: "2025-05-15",
  },
  {
    id: 3,
    userId: 6,
    storeId: 1,
    rating: 3,
    userName: "Rohan Vikram Desai Patwardhan",
    date: "2025-05-18",
  },
  {
    id: 4,
    userId: 2,
    storeId: 2,
    rating: 5,
    userName: "Marcus Benjamin Thornton",
    date: "2025-05-12",
  },
];

const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,16}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("overview");
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
  const [users, setUsers] = useState(MOCK_USERS);
  const [stores, setStores] = useState(MOCK_STORES);

  const {
    register: regUser,
    handleSubmit: handleUser,
    reset: resetUser,
    formState: { errors: userErrors, isSubmitting: userSubmitting },
  } = useForm({ mode: "onTouched" });

  // RHF for Add Store
  const {
    register: regStore,
    handleSubmit: handleStore,
    reset: resetStore,
    formState: { errors: storeErrors, isSubmitting: storeSubmitting },
  } = useForm({ mode: "onTouched" });

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userFilter.name.toLowerCase()) &&
      u.email.toLowerCase().includes(userFilter.email.toLowerCase()) &&
      u.address.toLowerCase().includes(userFilter.address.toLowerCase()) &&
      (userFilter.role === "" || u.role === userFilter.role),
  );

  const filteredStores = stores.filter(
    (s) =>
      s.name.toLowerCase().includes(storeFilter.name.toLowerCase()) &&
      s.email.toLowerCase().includes(storeFilter.email.toLowerCase()) &&
      s.address.toLowerCase().includes(storeFilter.address.toLowerCase()),
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
  } = useSortableTable(filteredStores, "name");

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "users", label: "Users", icon: "👥" },
    { id: "stores", label: "Stores", icon: "🏪" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  const onAddUser = async (data) => {
    await new Promise((r) => setTimeout(r, 600));
    setUsers((prev) => [...prev, { ...data, id: Date.now() }]);
    resetUser();
    setShowAddUser(false);
  };

  const onAddStore = async (data) => {
    await new Promise((r) => setTimeout(r, 600));
    setStores((prev) => [
      ...prev,
      { ...data, id: Date.now(), avgRating: 0, totalRatings: 0 },
    ]);
    resetStore();
    setShowAddStore(false);
  };

  const formInputClass = (err, accent = "blue") =>
    `w-full px-3 py-2 text-sm border rounded-xl outline-none focus:ring-2 transition-all ${
      err
        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
        : accent === "blue"
          ? "border-gray-200 focus:border-blue-400 focus:ring-blue-100"
          : "border-gray-200 focus:border-emerald-400 focus:ring-emerald-100"
    }`;

  return (
    <Layout
      role="admin"
      onLogout={onLogout}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      tabs={tabs}
    >
      {/* OVERVIEW */}
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
          <div className="grid grid-cols-3 gap-4">
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
            <StatCard
              icon="⭐"
              label="Total Ratings"
              value={MOCK_RATINGS.length}
              color="amber"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setActiveTab("users");
                setShowAddUser(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              + Add User
            </button>
            <button
              onClick={() => {
                setActiveTab("stores");
                setShowAddStore(true);
              }}
              className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-xl font-medium hover:bg-emerald-700 transition-colors"
            >
              + Add Store
            </button>
          </div>
        </div>
      )}

      {/* USERS */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Users</h1>
            <button
              onClick={() => setShowAddUser(true)}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              + Add User
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-4 gap-3">
            {["name", "email", "address"].map((f) => (
              <input
                key={f}
                placeholder={`Filter by ${f}`}
                value={userFilter[f]}
                onChange={(e) =>
                  setUserFilter((p) => ({ ...p, [f]: e.target.value }))
                }
                className="px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white"
              />
            ))}
            <select
              value={userFilter.role}
              onChange={(e) =>
                setUserFilter((p) => ({ ...p, role: e.target.value }))
              }
              className="px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-blue-400 bg-white text-gray-700"
            >
              <option value="">All roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="store_owner">Store Owner</option>
            </select>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
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
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
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
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedUser(u)}
                        className="text-xs text-blue-600 hover:underline font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {sortedUsers.length === 0 && (
              <div className="text-center py-10 text-sm text-gray-400">
                No users found
              </div>
            )}
          </div>
        </div>
      )}

      {/* STORES */}
      {activeTab === "stores" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Stores</h1>
            <button
              onClick={() => setShowAddStore(true)}
              className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-xl font-medium hover:bg-emerald-700 transition-colors"
            >
              + Add Store
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {["name", "email", "address"].map((f) => (
              <input
                key={f}
                placeholder={`Filter by ${f}`}
                value={storeFilter[f]}
                onChange={(e) =>
                  setStoreFilter((p) => ({ ...p, [f]: e.target.value }))
                }
                className="px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 bg-white"
              />
            ))}
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <SortableHeader
                    label="Name"
                    field="name"
                    sortConfig={sSort}
                    onSort={sToggle}
                  />
                  <SortableHeader
                    label="Email"
                    field="email"
                    sortConfig={sSort}
                    onSort={sToggle}
                  />
                  <SortableHeader
                    label="Address"
                    field="address"
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
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {s.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {s.email}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
                      {s.address}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <StarDisplay value={s.avgRating} />
                        <span className="text-xs font-semibold text-amber-600">
                          {s.avgRating.toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-400">
                          ({s.totalRatings})
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {sortedStores.length === 0 && (
              <div className="text-center py-10 text-sm text-gray-400">
                No stores found
              </div>
            )}
          </div>
        </div>
      )}

      {/* SETTINGS */}
      {activeTab === "settings" && (
        <div className="max-w-md space-y-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Account Settings
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">Update your password</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-800 mb-4">
              Change Password
            </h2>
            <PasswordChangeForm accentColor="blue" />
          </div>
        </div>
      )}

      {/* Modal: View User Details */}
      {selectedUser && (
        <Modal onClose={() => setSelectedUser(null)} title="User Details">
          <div className="space-y-4">
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
                <div className="text-sm text-gray-800 font-medium">{v}</div>
              </div>
            ))}
            <div className="border-b border-gray-100 pb-3">
              <div className="text-xs text-gray-400 font-medium mb-1">Role</div>
              <RoleBadge role={selectedUser.role} />
            </div>
            {selectedUser.role === "store_owner" && (
              <div>
                <div className="text-xs text-gray-400 font-medium mb-1">
                  Store Rating
                </div>
                <div className="flex items-center gap-2">
                  <StarDisplay value={4.2} size="md" />
                  <span className="text-sm font-semibold text-amber-600">
                    4.2
                  </span>
                  <span className="text-xs text-gray-400">(128 ratings)</span>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Modal: Add User (RHF) */}
      {showAddUser && (
        <Modal
          onClose={() => {
            setShowAddUser(false);
            resetUser();
          }}
          title="Add New User"
        >
          <form
            onSubmit={handleUser(onAddUser)}
            noValidate
            className="space-y-3"
          >
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                Full Name
              </label>
              <input
                placeholder="Min 20 characters"
                className={formInputClass(userErrors.name)}
                {...regUser("name", {
                  required: "Name is required",
                  minLength: { value: 20, message: "Min 20 characters" },
                  maxLength: { value: 60, message: "Max 60 characters" },
                })}
              />
              {userErrors.name && (
                <p className="text-xs text-red-500 mt-1">
                  {userErrors.name.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                Email
              </label>
              <input
                type="email"
                placeholder="user@example.com"
                className={formInputClass(userErrors.email)}
                {...regUser("email", {
                  required: "Email is required",
                  pattern: {
                    value: EMAIL_REGEX,
                    message: "Enter a valid email",
                  },
                })}
              />
              {userErrors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {userErrors.email.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                Password
              </label>
              <input
                type="password"
                placeholder="8–16 chars, uppercase + special char"
                className={formInputClass(userErrors.password)}
                {...regUser("password", {
                  required: "Password is required",
                  pattern: {
                    value: PASSWORD_REGEX,
                    message: "8–16 chars, one uppercase, one special character",
                  },
                })}
              />
              {userErrors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {userErrors.password.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                Address
              </label>
              <textarea
                rows={2}
                placeholder="Max 400 characters"
                className={`resize-none ${formInputClass(userErrors.address)}`}
                {...regUser("address", {
                  required: "Address is required",
                  maxLength: { value: 400, message: "Max 400 characters" },
                })}
              />
              {userErrors.address && (
                <p className="text-xs text-red-500 mt-1">
                  {userErrors.address.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                Role
              </label>
              <select
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-blue-400 bg-white"
                {...regUser("role")}
                defaultValue="user"
              >
                <option value="user">Normal User</option>
                <option value="admin">Admin</option>
                <option value="store_owner">Store Owner</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={userSubmitting}
              className="w-full py-2.5 bg-blue-600 text-white text-sm rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-60 mt-1"
            >
              {userSubmitting ? "Adding…" : "Add User"}
            </button>
          </form>
        </Modal>
      )}

      {/* Modal: Add Store (RHF) */}
      {showAddStore && (
        <Modal
          onClose={() => {
            setShowAddStore(false);
            resetStore();
          }}
          title="Add New Store"
        >
          <form
            onSubmit={handleStore(onAddStore)}
            noValidate
            className="space-y-3"
          >
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                Store Name
              </label>
              <input
                placeholder="Min 20 characters"
                className={formInputClass(storeErrors.name, "emerald")}
                {...regStore("name", {
                  required: "Store name is required",
                  minLength: { value: 20, message: "Min 20 characters" },
                  maxLength: { value: 60, message: "Max 60 characters" },
                })}
              />
              {storeErrors.name && (
                <p className="text-xs text-red-500 mt-1">
                  {storeErrors.name.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                Email
              </label>
              <input
                type="email"
                placeholder="store@example.com"
                className={formInputClass(storeErrors.email, "emerald")}
                {...regStore("email", {
                  required: "Email is required",
                  pattern: {
                    value: EMAIL_REGEX,
                    message: "Enter a valid email",
                  },
                })}
              />
              {storeErrors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {storeErrors.email.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                Address
              </label>
              <textarea
                rows={2}
                placeholder="Max 400 characters"
                className={`resize-none ${formInputClass(storeErrors.address, "emerald")}`}
                {...regStore("address", {
                  required: "Address is required",
                  maxLength: { value: 400, message: "Max 400 characters" },
                })}
              />
              {storeErrors.address && (
                <p className="text-xs text-red-500 mt-1">
                  {storeErrors.address.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={storeSubmitting}
              className="w-full py-2.5 bg-emerald-600 text-white text-sm rounded-xl font-medium hover:bg-emerald-700 transition-colors disabled:opacity-60 mt-1"
            >
              {storeSubmitting ? "Adding…" : "Add Store"}
            </button>
          </form>
        </Modal>
      )}
    </Layout>
  );
}
