import { useState } from "react";

export default function InputField({
  label,
  id,
  type = "text",
  placeholder,
  registration,
  error,
  hint,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="text-xs font-medium text-gray-700 tracking-wide"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          autoComplete={isPassword ? "current-password" : undefined}
          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-gray-900 placeholder-gray-400
            outline-none transition-all bg-white
            ${
              error
                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                : "border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            }`}
          {...registration}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-medium"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-0.5">{error.message}</p>}
      {hint && !error && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
    </div>
  );
}
