import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import ConfirmModal from "./ConfirmModal";

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">

      {/* NAVBAR */}
      <div className="bg-white dark:bg-gray-800 shadow px-4 py-3 flex items-center justify-between">

        <h1 className="text-xl font-bold text-indigo-600">
          User Management
        </h1>

        <div className="flex items-center gap-4">

          {/* USER SECTION */}
          <div className="flex items-center gap-2">
            <img
              src={user?.avatar}
              className="h-9 w-9 rounded-full border object-cover"
              alt="profile"
            />
            <div className="hidden sm:block leading-tight">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>

          {/* LOGOUT BUTTON */}
          <button
            onClick={handleLogout}
            className="border border-indigo-600 text-indigo-600 px-3 py-1.5 rounded-md hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-300"
          >
            Logout
          </button>
        </div>
      </div>

      {/* PAGE CONTENT */}
      <div className="p-4">
        <Outlet />
      </div>

      {/* LOGOUT POPUP */}
      <ConfirmModal
        open={showLogoutModal}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        confirmColor="indigo"
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
      />
    </div>
  );
};

export default Layout;
