const ROLE_LABELS = {
  admin: "Admin",
  user: "User",
  store_owner: "Store Owner",
};
const ROLE_COLORS = {
  admin: "bg-blue-50 text-blue-700",
  user: "bg-emerald-50 text-emerald-700",
  store_owner: "bg-amber-50 text-amber-700",
};

export default function RoleBadge({ role }) {
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full ${ROLE_COLORS[role]}`}
    >
      {ROLE_LABELS[role]}
    </span>
  );
}
