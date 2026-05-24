import { useState } from "react";
import { useForm } from "react-hook-form";
import API from "../../src/services/api";
import { formInputClass } from "../auth/FormInputClass";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,16}$/;

export default function AddNewStore({ setShowAddStore, onSuccess }) {
  const [apiError, setApiError] = useState("");

  const {
    register: regStore,
    handleSubmit: handleStore,
    reset: resetStore,
    formState: { errors: storeErrors, isSubmitting: storeSubmitting },
  } = useForm({ mode: "onTouched" });

  const onAddStore = async (data) => {
    setApiError("");

    try {
      await API.post("/admin/stores/create", data);

      onSuccess();
      resetStore();
      setShowAddStore(false);
    } catch (err) {
      console.error(
        "Storefront addition API transaction error:",
        err.response?.data,
      );
      setApiError(
        err.response?.data?.error ||
          "Failed to catalog new storefront register.",
      );
    }
  };

  return (
    <>
      <form onSubmit={handleStore(onAddStore)} noValidate className="space-y-3">
        {apiError && (
          <div className="p-2.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl leading-snug">
            ⚠️ {apiError}
          </div>
        )}

        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            Store Name
          </label>
          <input
            placeholder="Min 20 characters"
            className={formInputClass(storeErrors.name, "emerald")}
            {...regStore("name", {
              required: "Store name is required",
              minLength: { value: 20, message: "Min 20 characters" },
              maxLength: { value: 60, message: "Max 60 characters" },
            })}
          />
          {storeErrors.name && (
            <p className="text-xs text-red-500 mt-1">
              {storeErrors.name.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            Email
          </label>
          <input
            type="email"
            placeholder="store@example.com"
            className={formInputClass(storeErrors.email, "emerald")}
            {...regStore("email", {
              required: "Email is required",
              pattern: {
                value: EMAIL_REGEX,
                message: "Enter a valid email",
              },
            })}
          />
          {storeErrors.email && (
            <p className="text-xs text-red-500 mt-1">
              {storeErrors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            Owner Password
          </label>
          <input
            type="password"
            placeholder="8–16 chars, uppercase + special char"
            className={formInputClass(storeErrors.password, "emerald")}
            {...regStore("password", {
              required: "Password is required",
              pattern: {
                value: PASSWORD_REGEX,
                message: "8–16 chars, one uppercase, one special character",
              },
            })}
          />
          {storeErrors.password && (
            <p className="text-xs text-red-500 mt-1">
              {storeErrors.password.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            Store Address
          </label>
          <textarea
            rows={2}
            placeholder="Max 400 characters"
            className={`resize-none ${formInputClass(storeErrors.address, "emerald")}`}
            {...regStore("address", {
              required: "Store address is required",
              maxLength: { value: 400, message: "Max 400 characters" },
            })}
          />
          {storeErrors.address && (
            <p className="text-xs text-red-500 mt-1">
              {storeErrors.address.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={storeSubmitting}
          className="w-full py-2.5 bg-emerald-600 text-white text-sm rounded-xl font-medium hover:bg-emerald-700 transition-colors disabled:opacity-60 mt-1"
        >
          {storeSubmitting ? "Adding…" : "Add Store"}
        </button>
      </form>
    </>
  );
}
