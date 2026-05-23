import { useState } from "react";
import PasswordChangeForm from "./PasswordChangeForm";
import SortableHeader from "./SortableHeader";
import StarDisplay from "./StarDisplay";
import Layout from "./Layout";
import { StatCard } from "./StatCard";
import useSortableTable from "../../src/hooks/useSortableTable";

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

export default function StoreOwnerDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("dashboard");

  const myStore = MOCK_STORES[0];
  const myRatings = MOCK_RATINGS.filter((r) => r.storeId === myStore.id);
  const {
    sorted: sortedRatings,
    sortConfig,
    toggle,
  } = useSortableTable(myRatings, "userName");

  const tabs = [
    { id: "dashboard", label: "My Store", icon: "📊" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <Layout
      role="store_owner"
      onLogout={onLogout}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      tabs={tabs}
    >
      {/* DASHBOARD */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {myStore.name}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">{myStore.address}</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <StatCard
              icon="⭐"
              label="Average Rating"
              value={myStore.avgRating.toFixed(1)}
              color="amber"
            />
            <StatCard
              icon="📝"
              label="Total Ratings"
              value={myStore.totalRatings}
              color="emerald"
            />
            <StatCard
              icon="👥"
              label="Unique Raters"
              value={myRatings.length}
              color="purple"
            />
          </div>

          {/* Rating breakdown */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center gap-8">
            <div className="text-center shrink-0">
              <div className="text-5xl font-bold text-amber-500">
                {myStore.avgRating.toFixed(1)}
              </div>
              <div className="text-xs text-gray-400 mt-1">out of 5</div>
              <div className="mt-2">
                <StarDisplay value={myStore.avgRating} size="md" />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Based on {myStore.totalRatings} ratings
              </div>
            </div>
            <div className="flex-1 space-y-1.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = myRatings.filter((r) => r.rating === star).length;
                const pct = myRatings.length
                  ? Math.round((count / myRatings.length) * 100)
                  : 0;
                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-3">{star}</span>
                    <span className="text-xs text-amber-400">★</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-4 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Raters table */}
          <div>
            <h2 className="text-sm font-semibold text-gray-800 mb-3">
              Users who rated your store
            </h2>
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <SortableHeader
                      label="User Name"
                      field="userName"
                      sortConfig={sortConfig}
                      onSort={toggle}
                    />
                    <SortableHeader
                      label="Rating"
                      field="rating"
                      sortConfig={sortConfig}
                      onSort={toggle}
                    />
                    <SortableHeader
                      label="Date"
                      field="date"
                      sortConfig={sortConfig}
                      onSort={toggle}
                    />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {sortedRatings.map((r) => (
                    <tr
                      key={r.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {r.userName}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <StarDisplay value={r.rating} />
                          <span className="text-xs font-semibold text-amber-600">
                            {r.rating}
                          </span>
                          <span className="text-xs text-gray-400">/ 5</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {r.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {sortedRatings.length === 0 && (
                <div className="text-center py-10 text-sm text-gray-400">
                  No ratings yet
                </div>
              )}
            </div>
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
            <PasswordChangeForm accentColor="amber" />
          </div>
        </div>
      )}
    </Layout>
  );
}
