const stats = [
  { num: "3", label: "User Roles" },
  { num: "1–5", label: "Rating Scale" },
  { num: "∞", label: "Stores Supported" },
  { num: "1", label: "Login System" },
];

export const Stat = () => {
  return (
    <div className="bg-emerald-600 py-8 md:py-12 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4 text-center">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col justify-center">
            <div
              className="text-3xl sm:text-4xl text-white leading-none"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              {stat.num}
            </div>
            <div className="text-xs text-emerald-100 mt-1.5 px-1 font-medium wrap-break-word">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
