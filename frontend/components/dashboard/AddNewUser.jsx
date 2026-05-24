import { useState } from "react";
import { useForm } from "react-hook-form";
import API from "../../src/services/api";
import { formInputClass } from "../auth/FormInputClass";
import { toast } from "react-hot-toast";

const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,16}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AddNewUser({ setShowAddUser, onSuccess }) {
  const [apiError, setApiError] = useState("");
  const {
    register: regUser,
    handleSubmit: handleUser,
    reset: resetUser,
    formState: { errors: userErrors, isSubmitting: userSubmitting },
  } = useForm({ mode: "onTouched" });

  const onAddUser = async (data) => {
    setApiError("");

    try {
      await API.post("/admin/users/create", data);

      onSuccess();
      resetUser();
      toast.success("User Added");
      setShowAddUser(false);
    } catch (err) {
      toast.error("Error");
      console.error("Admin user generation failure:", err.response?.data);
      setApiError(
        err.response?.data?.error ||
          "Failed to finalize account registry record.",
      );
    }
  };

  return (
    <>
      <form onSubmit={handleUser(onAddUser)} noValidate className="space-y-3">
        {apiError && (
          <div className="p-2.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl leading-snug">
            ⚠️ {apiError}
          </div>
        )}

        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            Full Name
          </label>
          <input
            placeholder="Min 20 characters"
            className={formInputClass(userErrors.name)}
            {...regUser("name", {
              required: "Name is required",
              minLength: { value: 20, message: "Min 20 characters" },
              maxLength: { value: 60, message: "Max 60 characters" },
            })}
          />
          {userErrors.name && (
            <p className="text-xs text-red-500 mt-1">
              {userErrors.name.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            Email
          </label>
          <input
            type="email"
            placeholder="user@example.com"
            className={formInputClass(userErrors.email)}
            {...regUser("email", {
              required: "Email is required",
              pattern: {
                value: EMAIL_REGEX,
                message: "Enter a valid email",
              },
            })}
          />
          {userErrors.email && (
            <p className="text-xs text-red-500 mt-1">
              {userErrors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            Password
          </label>
          <input
            type="password"
            placeholder="8–16 chars, uppercase + special char"
            className={formInputClass(userErrors.password)}
            {...regUser("password", {
              required: "Password is required",
              pattern: {
                value: PASSWORD_REGEX,
                message: "8–16 chars, one uppercase, one special character",
              },
            })}
          />
          {userErrors.password && (
            <p className="text-xs text-red-500 mt-1">
              {userErrors.password.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            Address
          </label>
          <textarea
            rows={2}
            placeholder="Max 400 characters"
            className={`resize-none ${formInputClass(userErrors.address)}`}
            {...regUser("address", {
              required: "Address is required",
              maxLength: { value: 400, message: "Max 400 characters" },
            })}
          />
          {userErrors.address && (
            <p className="text-xs text-red-500 mt-1">
              {userErrors.address.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            Role
          </label>
          <select
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-blue-400 bg-white"
            {...regUser("role")}
            defaultValue="user"
          >
            <option value="user">Normal User</option>
            <option value="admin">Admin</option>
            <option value="store_owner">Store Owner</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={userSubmitting}
          className="w-full py-2.5 bg-blue-600 text-white text-sm rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-60 mt-1"
        >
          {userSubmitting ? "Adding…" : "Add User"}
        </button>
      </form>
    </>
  );
}
