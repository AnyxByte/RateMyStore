import { useState } from "react";

export default function StarRating({ value, onChange, interactive = false }) {
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
