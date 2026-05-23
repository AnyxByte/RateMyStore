import RoleBadge from "./RoleBadge";

export default function Layout({
  role,
  onLogout,
  children,
  activeTab,
  setActiveTab,
  tabs,
}) {
  const navColors = {
    admin: "bg-blue-700",
    user: "bg-emerald-600",
    store_owner: "bg-amber-600",
  };
  return (
    <div className="min-h-screen bg-stone-50 font-sans flex flex-col">
      <nav
        className={`${navColors[role]} px-6 h-14 flex items-center justify-between sticky top-0 z-50`}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">⭐</span>
          <span className="text-white font-semibold text-sm tracking-tight">
            RateMyStore
          </span>
          <span className="text-white/40 mx-2">·</span>
          <RoleBadge role={role} />
        </div>
        <button
          onClick={onLogout}
          className="text-white/80 hover:text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          Sign out →
        </button>
      </nav>

      {/* Tab bar */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3.5 text-sm font-medium border-b-2 transition-colors
                ${
                  activeTab === tab.id
                    ? "border-emerald-600 text-emerald-700"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">{children}</main>
    </div>
  );
}
