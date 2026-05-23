import { useState } from "react";
import useSortableTable from "../../src/hooks/useSortableTable";
import Layout from "./Layout";
import PasswordChangeForm from "./PasswordChangeForm";
import SortableHeader from "./SortableHeader";
import StarDisplay from "./StarDisplay";

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

function StarInput({ value, onChange }) {
  const [hovered, setHovered] = useState(null);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          onClick={() => onChange(s)}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(null)}
          className={`text-xl cursor-pointer select-none transition-colors ${
            s <= (hovered ?? value ?? 0) ? "text-amber-400" : "text-gray-200"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function UserDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("stores");
  const [search, setSearch] = useState({ name: "", address: "" });
  const [ratings, setRatings] = useState({ 1: 4 }); // storeId -> userRating

  const filteredStores = MOCK_STORES.filter(
    (s) =>
      s.name.toLowerCase().includes(search.name.toLowerCase()) &&
      s.address.toLowerCase().includes(search.address.toLowerCase()),
  );
  const {
    sorted: sortedStores,
    sortConfig,
    toggle,
  } = useSortableTable(filteredStores, "name");

  const tabs = [
    { id: "stores", label: "Browse Stores", icon: "🏪" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <Layout
      role="user"
      onLogout={onLogout}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      tabs={tabs}
    >
      {/* STORES */}
      {activeTab === "stores" && (
        <div className="space-y-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Browse Stores
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Search, rate, and update your ratings
            </p>
          </div>

          <div className="flex gap-3">
            <input
              placeholder="Search by store name…"
              value={search.name}
              onChange={(e) =>
                setSearch((p) => ({ ...p, name: e.target.value }))
              }
              className="flex-1 px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 bg-white"
            />
            <input
              placeholder="Search by address…"
              value={search.address}
              onChange={(e) =>
                setSearch((p) => ({ ...p, address: e.target.value }))
              }
              className="flex-1 px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 bg-white"
            />
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <SortableHeader
                    label="Store Name"
                    field="name"
                    sortConfig={sortConfig}
                    onSort={toggle}
                  />
                  <SortableHeader
                    label="Address"
                    field="address"
                    sortConfig={sortConfig}
                    onSort={toggle}
                  />
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Overall Rating
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Your Rating
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Submit / Modify
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sortedStores.map((store) => {
                  const userRating = ratings[store.id] ?? null;
                  return (
                    <tr
                      key={store.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {store.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {store.address}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <StarDisplay value={store.avgRating} />
                          <span className="text-xs font-semibold text-amber-600">
                            {store.avgRating.toFixed(1)}
                          </span>
                          <span className="text-xs text-gray-400">
                            ({store.totalRatings})
                          </span>
                        </div>
                      </td>
                      {/* ── Your Rating column: stars + numeric value ── */}
                      <td className="px-4 py-3">
                        {userRating ? (
                          <div className="flex items-center gap-1.5">
                            <StarDisplay value={userRating} />
                            <span className="text-xs font-semibold text-amber-600">
                              {userRating}
                            </span>
                            <span className="text-xs text-gray-400">/ 5</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">
                            Not rated yet
                          </span>
                        )}
                      </td>
                      {/* ── Submit / Modify: reusable StarInput ── */}
                      <td className="px-4 py-3">
                        <StarInput
                          value={userRating}
                          onChange={(val) =>
                            setRatings((p) => ({ ...p, [store.id]: val }))
                          }
                        />
                        {userRating && (
                          <div className="text-xs text-emerald-600 mt-0.5 font-medium">
                            {ratings[store.id] !== undefined
                              ? "✓ Click to modify"
                              : "Submitted!"}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {sortedStores.length === 0 && (
              <div className="text-center py-10 text-sm text-gray-400">
                No stores match your search
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
            <PasswordChangeForm accentColor="emerald" />
          </div>
        </div>
      )}
    </Layout>
  );
}
