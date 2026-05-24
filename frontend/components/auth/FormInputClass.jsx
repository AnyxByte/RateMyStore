export const formInputClass = (err, accent = "blue") =>
  `w-full px-3 py-2 text-sm border rounded-xl outline-none focus:ring-2 transition-all ${
    err
      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
      : accent === "blue"
        ? "border-gray-200 focus:border-blue-400 focus:ring-blue-100"
        : "border-gray-200 focus:border-emerald-400 focus:ring-emerald-100"
  }`;
