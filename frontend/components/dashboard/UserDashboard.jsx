import { useState } from "react";
import useSortableTable from "../../src/hooks/useSortableTable";
import Layout from "./Layout";
import PasswordChangeForm from "./PasswordChangeForm";
import SortableHeader from "./SortableHeader";
import StarDisplay from "./StarDisplay";
import { useStores } from "../../src/context/StoreContext";

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

  const {
    stores,
    loading,
    searchName,
    setSearchName,
    searchAddress,
    setSearchAddress,
    submitStoreRating,
  } = useStores();

  const {
    sorted: sortedStores,
    sortConfig,
    toggle,
  } = useSortableTable(stores, "store_name");

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
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="flex-1 px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 bg-white"
            />
            <input
              placeholder="Search by address…"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              className="flex-1 px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 bg-white"
            />
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm relative">
            {loading && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
                <div className="animate-spin h-5 w-5 border-2 border-emerald-500 border-t-transparent rounded-full"></div>
              </div>
            )}

            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <SortableHeader
                    label="Store Name"
                    field="store_name"
                    sortConfig={sortConfig}
                    onSort={toggle}
                  />
                  <SortableHeader
                    label="Address"
                    field="store_address"
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
                  const userRating =
                    store.user_submitted_rating > 0
                      ? store.user_submitted_rating
                      : null;

                  return (
                    <tr
                      key={store.store_id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {store.store_name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {store.store_address}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <StarDisplay value={store.overall_rating} />
                          <span className="text-xs font-semibold text-amber-600">
                            {store.overall_rating.toFixed(1)}
                          </span>
                          <span className="text-xs text-gray-400">
                            ({store.total_ratings_count})
                          </span>
                        </div>
                      </td>

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

                      <td className="px-4 py-3">
                        <StarInput
                          value={userRating}
                          onChange={(val) =>
                            submitStoreRating(store.store_id, val)
                          }
                        />
                        {userRating && (
                          <div className="text-xs text-emerald-600 mt-0.5 font-medium">
                            ✓ Click to modify
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {sortedStores.length === 0 && !loading && (
              <div className="text-center py-10 text-sm text-gray-400">
                No stores match your search criteria
              </div>
            )}
          </div>
        </div>
      )}

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
