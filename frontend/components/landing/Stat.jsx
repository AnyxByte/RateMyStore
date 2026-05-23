const stats = [
  { num: "3", label: "User Roles" },
  { num: "1–5", label: "Rating Scale" },
  { num: "∞", label: "Stores Supported" },
  { num: "1", label: "Login System" },
];
export const Stat = () => {
  return (
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
  );
};
