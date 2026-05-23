import { Link } from "react-router";

export const BottomSec = () => {
  return (
    <section className="max-w-6xl mx-auto px-8 py-20 flex items-center justify-between gap-8 flex-wrap">
      <h2
        className="text-4xl font-normal max-w-md leading-tight text-gray-900"
        style={{ fontFamily: "'DM Serif Display', serif" }}
      >
        Ready to build{" "}
        <em className="text-emerald-600" style={{ fontStyle: "italic" }}>
          trust
        </em>{" "}
        between stores and customers?
      </h2>
      <div className="flex gap-3 flex-wrap">
        <Link
          to="/signup"
          className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-700 transition-colors"
        >
          Create your account →
        </Link>
        <Link
          to="/login"
          className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
        >
          Log in
        </Link>
      </div>
    </section>
  );
};
