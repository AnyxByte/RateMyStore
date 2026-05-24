import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-hot-toast";
import API from "../../src/services/api";

const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,16}$/;

export default function PasswordChangeForm({ accentColor = "emerald" }) {
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({ mode: "onTouched" });

  const accent = {
    emerald: {
      ring: "focus:border-emerald-400 focus:ring-emerald-100",
      btn: "bg-emerald-600 hover:bg-emerald-700",
    },
    amber: {
      ring: "focus:border-amber-400 focus:ring-amber-100",
      btn: "bg-amber-500 hover:bg-amber-600",
    },
    blue: {
      ring: "focus:border-blue-400 focus:ring-blue-100",
      btn: "bg-blue-600 hover:bg-blue-700",
    },
  }[accentColor];

  const onSubmit = async (data) => {
    setApiError("");

    const payload = {
      oldPassword: data.current,
      newPassword: data.next,
    };

    try {
      await API.post("/user/change-password", payload);
      toast.success("Password changed");
      reset();
    } catch (err) {
      toast.error("Error");
      console.error("Password Update API Error:", err.response?.data);
      setApiError(
        err.response?.data?.error || "Failed to alter password statement.",
      );
    }
  };

  const fields = [
    {
      label: "Current Password",
      id: "current",
      rules: { required: "Current password is required" },
    },
    {
      label: "New Password",
      id: "next",
      rules: {
        required: "New password is required",
        pattern: {
          value: PASSWORD_REGEX,
          message:
            "8–16 chars, at least one uppercase letter and one special character",
        },
      },
    },
    {
      label: "Confirm New Password",
      id: "confirm",
      rules: {
        required: "Please confirm your new password",
        validate: (val) =>
          val === getValues("next") || "Passwords do not match",
      },
    },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {apiError && (
        <div className="p-2.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl leading-snug">
          {apiError}
        </div>
      )}

      {fields.map(({ label, id, rules }) => (
        <div key={id}>
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            {label}
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className={`w-full px-3.5 py-2.5 text-sm border rounded-xl outline-none focus:ring-2 transition-all
              ${
                errors[id]
                  ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                  : `border-gray-200 ${accent.ring}`
              }`}
            {...register(id, rules)}
          />
          {errors[id] && (
            <p className="text-xs text-red-500 mt-1">{errors[id].message}</p>
          )}
        </div>
      ))}

      <p className="text-xs text-gray-400">
        8–16 chars, one uppercase letter, one special character
      </p>

      {isSubmitSuccessful && !apiError && (
        <div className="text-xs text-emerald-600 font-medium bg-emerald-50 px-3 py-2 rounded-lg">
          ✓ Password updated successfully
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-2.5 text-white text-sm rounded-xl font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${accent.btn}`}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            Updating…
          </span>
        ) : (
          "Update Password"
        )}
      </button>
    </form>
  );
}
