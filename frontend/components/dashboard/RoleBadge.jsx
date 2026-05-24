export default function RoleBadge({ role }) {
  const normalizedRole = role
    ? role.toLowerCase().replace("owner", "_owner")
    : "user";

  const config = {
    admin: {
      bg: "bg-blue-50 text-blue-700 border-blue-200",
      label: "System Admin",
    },
    store_owner: {
      bg: "bg-amber-50 text-amber-700 border-amber-200",
      label: "Store Owner",
    },
    user: {
      bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      label: "Normal User",
    },
  }[normalizedRole] || {
    bg: "bg-gray-50 text-gray-700 border-gray-200",
    label: "User",
  };

  return (
    <span
      className={`px-2.5 py-1 text-xs font-semibold rounded-full border leading-none tracking-wide inline-block ${config.bg}`}
    >
      {config.label}
    </span>
  );
}
