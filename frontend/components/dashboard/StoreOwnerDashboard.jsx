import { useState, useEffect } from "react";
import useSortableTable from "../../src/hooks/useSortableTable";
import API from "../../src/services/api";
import Layout from "./Layout";
import PasswordChangeForm from "./PasswordChangeForm";
import SortableHeader from "./SortableHeader";
import StarDisplay from "./StarDisplay";
import { StatCard } from "./StatCard";

export default function StoreOwnerDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  const [storeDetails, setStoreDetails] = useState({ name: "", address: "" });
  const [averageRating, setAverageRating] = useState(0);
  const [ratingsList, setRatingsList] = useState([]);

  useEffect(() => {
    const getDashboardData = async () => {
      try {
        setLoading(true);
        const response = await API.get("/store/owner-dashboard");

        const { storeDetails, averageRating, reviewers } = response.data;

        setStoreDetails(storeDetails);
        setAverageRating(averageRating);
        setRatingsList(reviewers);
      } catch (err) {
        console.error("Failed to load merchant dashboard metrics:", err);
      } finally {
        setLoading(false);
      }
    };

    getDashboardData();
  }, []);

  const {
    sorted: sortedRatings,
    sortConfig,
    toggle,
  } = useSortableTable(ratingsList, "reviewer_name");

  const tabs = [
    { id: "dashboard", label: "My Store", icon: "📊" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center font-sans px-4">
        <div className="animate-spin h-6 w-6 border-2 border-amber-500 border-t-transparent rounded-full mb-2"></div>
        <p className="text-xs text-gray-400 font-medium text-center">
          Loading store dashboard analytics...
        </p>
      </div>
    );
  }

  return (
    <Layout
      role="store_owner"
      onLogout={onLogout}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      tabs={tabs}
    >
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          <div className="px-1">
            <h1 className="text-xl font-semibold text-gray-900 break-words">
              {storeDetails.name}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5 wrap-break-word">
              {storeDetails.address}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard
              icon="⭐"
              label="Average Rating"
              value={averageRating.toFixed(1)}
              color="amber"
            />
            <StatCard
              icon="📝"
              label="Total Ratings"
              value={ratingsList.length}
              color="emerald"
            />
            <StatCard
              icon="👥"
              label="Unique Raters"
              value={ratingsList.length}
              color="purple"
            />
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
            <div className="text-center shrink-0 w-full lg:w-auto border-b lg:border-b-0 lg:border-r border-gray-100 pb-4 lg:pb-0 lg:pr-8">
              <div className="text-5xl font-bold text-amber-500">
                {averageRating.toFixed(1)}
              </div>
              <div className="text-xs text-gray-400 mt-1">out of 5</div>
              <div className="mt-2 flex justify-center">
                <StarDisplay value={averageRating} size="md" />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Based on {ratingsList.length} ratings
              </div>
            </div>

            <div className="flex-1 w-full space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratingsList.filter(
                  (r) => r.submitted_score === star,
                ).length;
                const pct = ratingsList.length
                  ? Math.round((count / ratingsList.length) * 100)
                  : 0;
                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-3">{star}</span>
                    <span className="text-xs text-amber-400">★</span>
                    <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-6 text-right font-medium">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-800 px-1">
              Users who rated your store
            </h2>
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <SortableHeader
                        label="User Name"
                        field="reviewer_name"
                        sortConfig={sortConfig}
                        onSort={toggle}
                      />
                      <SortableHeader
                        label="Rating"
                        field="submitted_score"
                        sortConfig={sortConfig}
                        onSort={toggle}
                      />
                      <SortableHeader
                        label="Date"
                        field="reviewed_at"
                        sortConfig={sortConfig}
                        onSort={toggle}
                      />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {sortedRatings.map((r, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {r.reviewer_name}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <StarDisplay value={r.submitted_score} />
                            <span className="text-xs font-semibold text-amber-600">
                              {r.submitted_score}
                            </span>
                            <span className="text-xs text-gray-400">/ 5</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {new Date(r.reviewed_at).toISOString().split("T")[0]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="block md:hidden divide-y divide-gray-100">
                {sortedRatings.map((r, idx) => (
                  <div key={idx} className="p-4 space-y-2.5 bg-white">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-gray-900 truncate">
                        {r.reviewer_name}
                      </span>
                      <span className="text-[10px] font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                        {new Date(r.reviewed_at).toISOString().split("T")[0]}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-gray-500">
                        Submitted Rating Matrix:
                      </span>
                      <div className="flex items-center gap-1">
                        <StarDisplay value={r.submitted_score} />
                        <span className="text-xs font-bold text-amber-600 ml-1">
                          {r.submitted_score}.0
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {sortedRatings.length === 0 && (
                <div className="text-center py-10 text-sm text-gray-400 px-4">
                  No ratings recorded yet for your storefront.
                </div>
              )}
            </div>
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
            <PasswordChangeForm accentColor="amber" />
          </div>
        </div>
      )}
    </Layout>
  );
}
