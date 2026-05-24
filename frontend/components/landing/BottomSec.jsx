import { Link } from "react-router";

export const BottomSec = () => {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-20 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 text-center md:text-left">
      <h2
        className="text-3xl sm:text-4xl font-normal max-w-md leading-tight text-gray-900"
        style={{ fontFamily: "'DM Serif Display', serif" }}
      >
        Ready to build{" "}
        <em className="text-emerald-600" style={{ fontStyle: "italic" }}>
          trust
        </em>{" "}
        between stores and customers?
      </h2>

      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <Link
          to="/auth"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-700 transition-colors text-center"
        >
          Create your account →
        </Link>
        <Link
          to="/auth"
          className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors text-center"
        >
          Log in
        </Link>
      </div>
    </section>
  );
};
