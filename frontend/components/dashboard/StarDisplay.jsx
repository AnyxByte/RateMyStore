export default function StarDisplay({ value, size = "sm" }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          className={`${size === "sm" ? "text-sm" : "text-lg"} ${s <= Math.round(value) ? "text-amber-400" : "text-gray-200"}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}
