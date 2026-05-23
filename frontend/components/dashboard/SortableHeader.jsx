export default function SortableHeader({ label, field, sortConfig, onSort }) {
  const active = sortConfig.field === field;
  return (
    <th
      onClick={() => onSort(field)}
      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-gray-800 transition-colors"
    >
      <div className="flex items-center gap-1">
        {label}
        <span
          className={`text-xs ${active ? "text-emerald-600" : "text-gray-300"}`}
        >
          {active ? (sortConfig.dir === "asc" ? "↑" : "↓") : "↕"}
        </span>
      </div>
    </th>
  );
}
