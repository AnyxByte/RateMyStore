
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



export const Roles = () => {
  return (
    <section className="bg-gray-100 py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-1">
            User Roles
          </p>
          <h2
            className="text-3xl font-normal mb-10 text-gray-900"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Built for everyone
          </h2>
          <div className="grid grid-cols-3 gap-5">
            {roles.map((role) => (
              <div
                key={role.label}
                className="bg-white border border-gray-200 rounded-2xl p-6"
              >
                <span
                  className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full mb-3 ${role.badgeClass}`}
                >
                  {role.icon} {role.label}
                </span>
                <h3 className="text-sm font-semibold mb-3 text-gray-900">
                  {role.title}
                </h3>
                <ul className="space-y-0">
                  {role.perks.map((perk) => (
                    <li
                      key={perk}
                      className="flex items-center gap-2 text-xs text-gray-500 py-1.5 border-b border-gray-100 last:border-0"
                    >
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
  )
}
