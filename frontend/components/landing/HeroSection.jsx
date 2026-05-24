import { Link } from "react-router";
import StoreCard from "./StoreCard";

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

export default function HeroSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
      <div className="text-center md:text-left flex flex-col items-center md:items-start">
        <div className="inline-flex items-center gap-1.5 text-xs font-medium tracking-widest uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-4 md:mb-5">
          ⭐ Store Rating Platform
        </div>

        <h1
          className="text-3xl sm:text-4xl md:text-5xl leading-tight font-normal mb-4 md:mb-5 text-gray-900"
          style={{ fontFamily: "'DM Serif Display', serif" }}
        >
          Every store deserves an{" "}
          <em
            className="italic text-emerald-600"
            style={{ fontStyle: "italic" }}
          >
            honest
          </em>{" "}
          rating.
        </h1>

        <p className="text-sm sm:text-base leading-relaxed text-gray-500 max-w-sm mb-6 md:mb-8">
          A transparent platform where customers rate stores, owners track
          feedback, and administrators keep everything running smoothly.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link
            to="/auth"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-700 transition-colors text-center"
          >
            Get started free →
          </Link>
          <Link
            to="/auth"
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors text-center"
          >
            Browse stores
          </Link>
        </div>
      </div>

      <div className="space-y-4 w-full max-w-md mx-auto md:max-w-none md:mx-0 pt-4 md:pt-0">
        {stores.map((store) => (
          <StoreCard key={store.id} store={store} />
        ))}
      </div>
    </section>
  );
}
