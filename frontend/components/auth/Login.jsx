import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router";
import InputField from "./InputField";
import API from "../../src/services/api";
import { toast } from "react-hot-toast";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const loginRules = {
  email: {
    required: "Email is required",
    pattern: { value: EMAIL_REGEX, message: "Enter a valid email address" },
  },
  password: {
    required: "Password is required",
  },
};

export default function LoginForm({ onSwitch }) {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onTouched" });

  const onSubmit = async (data) => {
    setApiError("");

    try {
      const response = await API.post("/auth/login", data);

      localStorage.setItem("user", JSON.stringify(response.data.user));

      const userRole = response.data.user.role;
      toast.success("Logged In");

      if (userRole === "Admin") {
        navigate("/dashboard");
      } else if (userRole === "StoreOwner") {
        navigate("/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error("Error");
      console.error("Login API Error:", err.response?.data);
      setApiError(
        err.response?.data?.error || "Invalid email or password execution.",
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-3"
    >
      {apiError && (
        <div className="p-2.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl leading-snug">
          {apiError}
        </div>
      )}

      <InputField
        label="Email address"
        id="login-email"
        type="email"
        placeholder="you@example.com"
        registration={register("email", loginRules.email)}
        error={errors.email}
      />

      <InputField
        label="Password"
        id="login-password"
        type="password"
        placeholder="Your password"
        registration={register("password", loginRules.password)}
        error={errors.password}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 rounded-xl bg-emerald-600 text-white font-medium text-sm
          hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-1"
      >
        {" "}
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
            Signing in…
          </span>
        ) : (
          "Sign in"
        )}
      </button>

      <p className="text-center text-xs text-gray-500">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="text-emerald-600 font-medium hover:underline"
        >
          Create one
        </button>
      </p>
    </form>
  );
}
