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

export default function Features() {
  return (
    <>
      <section className="max-w-6xl mx-auto px-8 py-16">
        <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-1">
          Features
        </p>
        <h2
          className="text-3xl font-normal mb-10 text-gray-900"
          style={{ fontFamily: "'DM Serif Display', serif" }}
        >
          Everything you need
        </h2>
        <div className="grid grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white border border-gray-200 rounded-2xl p-6"
            >
              <div
                className={`w-10 h-10 rounded-xl ${f.iconBg} flex items-center justify-center text-xl mb-4`}
              >
                {f.icon}
              </div>
              <h3 className="text-sm font-semibold mb-1.5 text-gray-900">
                {f.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
