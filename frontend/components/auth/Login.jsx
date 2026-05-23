import { useForm } from "react-hook-form";
import InputField from "./InputField";
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
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onTouched" });

  const onSubmit = async (data) => {
    // Replace with your API call: POST /api/auth/login
    await new Promise((r) => setTimeout(r, 1000));
    console.log("Login payload:", data);
    alert("Login successful! (wire up your API)");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-4"
    >
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

      <div className="flex items-center justify-between text-xs">
        <label className="flex items-center gap-2 text-gray-500 cursor-pointer select-none">
          <input
            type="checkbox"
            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            {...register("rememberMe")}
          />
          Remember me
        </label>
        <a
          href="/forgot-password"
          className="text-emerald-600 hover:underline font-medium"
        >
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-medium text-sm
          hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-1"
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
