import { useState } from "react";
import StarRating from "./StarRating";

export default function StoreCard({ store }) {
  const [userRating, setUserRating] = useState(store.userRating);
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-3 shadow-sm hover:shadow-md hover:border-gray-400 transition-all duration-150">
      <div className="flex justify-between items-start mb-2.5">
        <div>
          <div className="font-semibold text-sm text-gray-900 mb-0.5">
            {store.name}
          </div>
          <div className="text-xs text-gray-500">{store.address}</div>
        </div>
        <div className="flex items-center gap-1.5">
          <StarRating value={Math.round(store.avgRating)} />
          <span className="text-xs font-semibold text-amber-600">
            {store.avgRating.toFixed(1)}
          </span>
        </div>
      </div>
      <div className="flex gap-1.5">
        <span className="text-xs bg-gray-100 rounded-md px-2 py-0.5 text-gray-500">
          {store.category}
        </span>
        <span className="text-xs bg-gray-100 rounded-md px-2 py-0.5 text-gray-500">
          {store.totalRatings} ratings
        </span>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2.5">
        <span className="text-xs text-gray-400">Your rating:</span>
        <StarRating
          value={userRating ?? 0}
          onChange={setUserRating}
          interactive
        />
        {userRating && (
          <span className="text-xs text-emerald-600 font-medium">
            {store.userRating ? "Updated!" : "Submitted!"}
          </span>
        )}
      </div>
    </div>
  );
}
