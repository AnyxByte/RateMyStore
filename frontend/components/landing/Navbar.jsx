import { Link } from "react-router";

export default function Navbar() {
  return (
    <>
      <nav className="flex items-center justify-between px-4 sm:px-8 h-15 bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center gap-1.5 sm:gap-2 select-none">
          <span className="text-lg sm:text-xl">⭐</span>
          <span className="font-semibold text-sm sm:text-base text-gray-900 tracking-tight">
            RateMyStore
          </span>
        </div>

        <div className="flex gap-1.5 sm:gap-2">
          <Link
            to="/auth"
            className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-gray-300 text-xs sm:text-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Log in
          </Link>
          <Link
            to="/auth"
            className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-emerald-600 text-xs sm:text-sm text-white font-medium hover:bg-emerald-700 transition-colors"
          >
            Sign up
          </Link>
        </div>
      </nav>
    </>
  );
}
