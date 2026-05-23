import { useState } from "react";
import SignupForm from "../../components/auth/Signup";
import LoginForm from "../../components/auth/Login";
import { Link } from "react-router";

export default function Auth() {
  const [mode, setMode] = useState("login"); 

  return (
    <div className="min-h-screen bg-stone-50 flex font-sans">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-[42%] bg-emerald-600 px-12 py-10 text-white">
        <div>
          <Link
            to="/"
            className="flex items-center gap-2 text-white no-underline"
          >
            <span className="text-2xl">⭐</span>
            <span className="font-semibold text-lg tracking-tight">
              RateMyStore
            </span>
          </Link>
        </div>

        <div>
          <h2
            className="text-4xl font-normal leading-tight mb-4"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            {mode === "login"
              ? "Welcome back. Your ratings matter."
              : "Join thousands of honest reviewers."}
          </h2>
          <p className="text-emerald-100 text-sm leading-relaxed max-w-xs">
            {mode === "login"
              ? "Log in to browse stores, submit ratings, and help your community make better choices."
              : "Create your free account to start rating stores, tracking your reviews, and contributing to a transparent marketplace."}
          </p>

          {/* Feature pills */}
          <div className="flex flex-col gap-2 mt-8">
            {[
              { icon: "🏪", text: "Browse all registered stores" },
              { icon: "⭐", text: "Rate stores from 1 to 5" },
              { icon: "✏️", text: "Update your ratings anytime" },
            ].map((f) => (
              <div
                key={f.text}
                className="flex items-center gap-3 bg-emerald-700/40 rounded-xl px-4 py-2.5"
              >
                <span className="text-base">{f.icon}</span>
                <span className="text-sm text-emerald-50">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-emerald-200 text-xs">
          © {new Date().getFullYear()} RateMyStore 
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <span className="text-xl">⭐</span>
            <span className="font-semibold text-base text-gray-900 tracking-tight">
              RateMyStore
            </span>
          </div>

          {/* Tab switcher */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-7">
            {["login", "signup"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setMode(tab)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all capitalize
                  ${
                    mode === tab
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                {tab === "login" ? "Sign in" : "Sign up"}
              </button>
            ))}
          </div>

          <div className="mb-6">
            <h1 className="text-xl font-semibold text-gray-900">
              {mode === "login"
                ? "Sign in to your account"
                : "Create your account"}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              {mode === "login"
                ? "Enter your credentials to continue"
                : "Fill in the details below to get started"}
            </p>
          </div>

          <div key={mode}>
            {mode === "login" ? (
              <LoginForm onSwitch={() => setMode("signup")} />
            ) : (
              <SignupForm onSwitch={() => setMode("login")} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
