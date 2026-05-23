import { useState, useMemo } from "react";

export default function useSortableTable(data, defaultField) {
  const [sortConfig, setSortConfig] = useState({
    field: defaultField,
    dir: "asc",
  });

  const sorted = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    
    return [...data].sort((a, b) => {
      const av = (a[sortConfig.field] ?? "").toString().toLowerCase();
      const bv = (b[sortConfig.field] ?? "").toString().toLowerCase();
      return sortConfig.dir === "asc"
        ? av.localeCompare(bv)
        : bv.localeCompare(av);
    });
  }, [data, sortConfig]);

  const toggle = (field) =>
    setSortConfig((prev) => ({
      field,
      dir: prev.field === field && prev.dir === "asc" ? "desc" : "asc",
    }));

  return { sorted, sortConfig, toggle };
}