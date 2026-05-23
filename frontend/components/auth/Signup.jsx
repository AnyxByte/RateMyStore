import { useForm } from "react-hook-form";
import InputField from "./InputField";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,16}$/;

const signupRules = {
  name: {
    required: "Name is required",
    minLength: { value: 20, message: "Name must be at least 20 characters" },
    maxLength: { value: 60, message: "Name must be at most 60 characters" },
  },
  email: {
    required: "Email is required",
    pattern: { value: EMAIL_REGEX, message: "Enter a valid email address" },
  },
  address: {
    required: "Address is required",
    maxLength: {
      value: 400,
      message: "Address must be at most 400 characters",
    },
  },
  password: {
    required: "Password is required",
    pattern: {
      value: PASSWORD_REGEX,
      message:
        "8–16 chars, at least one uppercase letter and one special character",
    },
  },
  confirmPassword: (getValues) => ({
    required: "Please confirm your password",
    validate: (val) =>
      val === getValues("password") || "Passwords do not match",
  }),
};

export default function SignupForm({ onSwitch }) {
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onTouched" });

  const passwordValue = watch("password", "");

  const onSubmit = async (data) => {
    // Replace with your API call: POST /api/auth/register
    const { confirmPassword, ...payload } = data;
    await new Promise((r) => setTimeout(r, 1000));
    console.log("Signup payload:", payload);
    alert("Account created! (wire up your API)");
  };

  const getStrength = (pwd) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[!@#$%^&*()_+\-=[]{};':"\\|,.<>\/\?]/.test(pwd)) score++;
    return score;
  };

  const strength = getStrength(passwordValue);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = [
    "",
    "bg-red-400",
    "bg-amber-400",
    "bg-yellow-400",
    "bg-emerald-500",
  ][strength];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-4"
    >
      <InputField
        label="Full name"
        id="signup-name"
        placeholder="Enter your full name (min 20 chars)"
        registration={register("name", signupRules.name)}
        error={errors.name}
        hint="Between 20 and 60 characters"
      />
      <InputField
        label="Email address"
        id="signup-email"
        type="email"
        placeholder="you@example.com"
        registration={register("email", signupRules.email)}
        error={errors.email}
      />
      <div className="flex flex-col gap-1">
        <label
          htmlFor="signup-address"
          className="text-xs font-medium text-gray-700 tracking-wide"
        >
          Address
        </label>
        <textarea
          id="signup-address"
          rows={2}
          placeholder="Your full address"
          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-gray-900 placeholder-gray-400
            outline-none transition-all bg-white resize-none
            ${
              errors.address
                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                : "border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            }`}
          {...register("address", signupRules.address)}
        />
        {errors.address ? (
          <p className="text-xs text-red-500">{errors.address.message}</p>
        ) : (
          <p className="text-xs text-gray-400">Max 400 characters</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <InputField
          label="Password"
          id="signup-password"
          type="password"
          placeholder="Create a strong password"
          registration={register("password", signupRules.password)}
          error={errors.password}
          hint="8–16 chars, one uppercase letter, one special character"
        />
        {passwordValue && (
          <div className="flex items-center gap-2 mt-1">
            <div className="flex gap-1 flex-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    i <= strength ? strengthColor : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
            <span
              className={`text-xs font-medium ${
                strength <= 1
                  ? "text-red-500"
                  : strength === 2
                    ? "text-amber-500"
                    : strength === 3
                      ? "text-yellow-500"
                      : "text-emerald-600"
              }`}
            >
              {strengthLabel}
            </span>
          </div>
        )}
      </div>

      <InputField
        label="Confirm password"
        id="signup-confirm"
        type="password"
        placeholder="Re-enter your password"
        registration={register(
          "confirmPassword",
          signupRules.confirmPassword(getValues),
        )}
        error={errors.confirmPassword}
      />

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
            Creating account…
          </span>
        ) : (
          "Create account"
        )}
      </button>

      <p className="text-center text-xs text-gray-500">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="text-emerald-600 font-medium hover:underline"
        >
          Sign in
        </button>
      </p>
    </form>
  );
}
