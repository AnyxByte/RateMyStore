import { useState } from "react";

const stores = [
  {
    id: 1,
    name: "The Artisan Bakehouse",
    address: "12 Green Park Lane, Delhi",
    category: "Bakery",
    totalRatings: 128,
    avgRating: 4.2,
    userRating: 3,
  },
  {
    id: 2,
    name: "Sunrise Electronics Hub",
    address: "45 Connaught Place, Delhi",
    category: "Electronics",
    totalRatings: 87,
    avgRating: 4.8,
    userRating: null,
  },
];

const roles = [
  {
    label: "Administrator",
    badgeClass: "bg-blue-50 text-blue-700",
    icon: "🛡️",
    title: "Full platform control",
    perks: [
      "Add stores, users & admins",
      "View platform-wide stats",
      "Filter & sort all listings",
      "View any user's profile",
    ],
  },
  {
    label: "Normal User",
    badgeClass: "bg-emerald-50 text-emerald-700",
    icon: "👤",
    title: "Rate your experience",
    perks: [
      "Sign up & log in",
      "Browse all stores",
      "Submit & modify ratings",
      "Update password",
    ],
  },
  {
    label: "Store Owner",
    badgeClass: "bg-amber-50 text-amber-700",
    icon: "⭐",
    title: "Track your reputation",
    perks: [
      "View who rated your store",
      "See average rating live",
      "Update password",
      "Dedicated dashboard",
    ],
  },
];

const features = [
  {
    icon: "🏪",
    iconBg: "bg-emerald-50",
    title: "Browse & rate stores",
    desc: "Discover all registered stores, search by name or address, and submit or update your rating at any time.",
  },
  {
    icon: "📊",
    iconBg: "bg-amber-50",
    title: "Owner analytics",
    desc: "Store owners get a live dashboard showing who rated their store and their current average score.",
  },
  {
    icon: "🛡️",
    iconBg: "bg-blue-50",
    title: "Admin control",
    desc: "System administrators manage users and stores, with full visibility across the entire platform.",
  },
];

const stats = [
  { num: "3", label: "User Roles" },
  { num: "1–5", label: "Rating Scale" },
  { num: "∞", label: "Stores Supported" },
  { num: "1", label: "Login System" },
];

function StarRating({ value, onChange, interactive = false }) {
  const [hovered, setHovered] = useState(null);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => interactive && onChange?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(null)}
          className={`transition-colors select-none
            ${interactive ? "text-xl cursor-pointer" : "text-sm cursor-default"}
            ${star <= (hovered ?? value) ? "text-amber-400" : "text-gray-200"}
          `}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function StoreCard({ store }) {
  const [userRating, setUserRating] = useState(store.userRating);
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-3 shadow-sm hover:shadow-md hover:border-gray-400 transition-all duration-150">
      <div className="flex justify-between items-start mb-2.5">
        <div>
          <div className="font-semibold text-sm text-gray-900 mb-0.5">{store.name}</div>
          <div className="text-xs text-gray-500">{store.address}</div>
        </div>
        <div className="flex items-center gap-1.5">
          <StarRating value={Math.round(store.avgRating)} />
          <span className="text-xs font-semibold text-amber-600">{store.avgRating.toFixed(1)}</span>
        </div>
      </div>
      <div className="flex gap-1.5">
        <span className="text-xs bg-gray-100 rounded-md px-2 py-0.5 text-gray-500">{store.category}</span>
        <span className="text-xs bg-gray-100 rounded-md px-2 py-0.5 text-gray-500">{store.totalRatings} ratings</span>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2.5">
        <span className="text-xs text-gray-400">Your rating:</span>
        <StarRating value={userRating ?? 0} onChange={setUserRating} interactive />
        {userRating && (
          <span className="text-xs text-emerald-600 font-medium">
            {store.userRating ? "Updated!" : "Submitted!"}
          </span>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="font-sans bg-stone-50 text-gray-900 min-h-screen">
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 h-15 bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="text-xl">⭐</span>
          <span className="font-semibold text-base text-gray-900 tracking-tight">RateMyStore</span>
        </div>
        <div className="flex gap-2">
          <a
            href="/login"
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Log in
          </a>
          <a
            href="/signup"
            className="px-4 py-2 rounded-lg bg-emerald-600 text-sm text-white font-medium hover:bg-emerald-700 transition-colors"
          >
            Sign up
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-8 py-20 grid grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-medium tracking-widest uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-5">
            ⭐ Store Rating Platform
          </div>
          <h1
            className="text-5xl leading-tight font-normal mb-5 text-gray-900"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Every store deserves an{" "}
            <em className="italic text-emerald-600 not-italic" style={{ fontStyle: "italic" }}>honest</em> rating.
          </h1>
          <p className="text-base leading-relaxed text-gray-500 max-w-sm mb-8">
            A transparent platform where customers rate stores, owners track feedback, and administrators keep everything running smoothly.
          </p>
          <div className="flex gap-3">
            <a
              href="/signup"
              className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-700 transition-colors"
            >
              Get started free →
            </a>
            <a
              href="/stores"
              className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
            >
              Browse stores
            </a>
          </div>
        </div>

        <div>
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-emerald-600 py-10 px-8">
        <div className="max-w-3xl mx-auto grid grid-cols-4 gap-4 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div
                className="text-4xl text-white leading-none"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                {stat.num}
              </div>
              <div className="text-xs text-emerald-100 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-8 py-16">
        <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-1">Features</p>
        <h2
          className="text-3xl font-normal mb-10 text-gray-900"
          style={{ fontFamily: "'DM Serif Display', serif" }}
        >
          Everything you need
        </h2>
        <div className="grid grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className={`w-10 h-10 rounded-xl ${f.iconBg} flex items-center justify-center text-xl mb-4`}>
                {f.icon}
              </div>
              <h3 className="text-sm font-semibold mb-1.5 text-gray-900">{f.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section className="bg-gray-100 py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-1">User Roles</p>
          <h2
            className="text-3xl font-normal mb-10 text-gray-900"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Built for everyone
          </h2>
          <div className="grid grid-cols-3 gap-5">
            {roles.map((role) => (
              <div key={role.label} className="bg-white border border-gray-200 rounded-2xl p-6">
                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full mb-3 ${role.badgeClass}`}>
                  {role.icon} {role.label}
                </span>
                <h3 className="text-sm font-semibold mb-3 text-gray-900">{role.title}</h3>
                <ul className="space-y-0">
                  {role.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2 text-xs text-gray-500 py-1.5 border-b border-gray-100 last:border-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-6xl mx-auto px-8 py-20 flex items-center justify-between gap-8 flex-wrap">
        <h2
          className="text-4xl font-normal max-w-md leading-tight text-gray-900"
          style={{ fontFamily: "'DM Serif Display', serif" }}
        >
          Ready to build{" "}
          <em className="text-emerald-600" style={{ fontStyle: "italic" }}>trust</em>{" "}
          between stores and customers?
        </h2>
        <div className="flex gap-3 flex-wrap">
          <a
            href="/signup"
            className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-700 transition-colors"
          >
            Create your account →
          </a>
          <a
            href="/login"
            className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
          >
            Log in
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-5 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} RateMyStore.
      </footer>
    </div>
  );
}