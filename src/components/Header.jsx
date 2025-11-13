import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3">

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

          {/* LEFT SIDE */}
          <div className="flex items-center justify-between md:justify-start gap-4">
            <h1
              onClick={() => navigate("/users")}
              className="text-2xl font-bold text-indigo-600 cursor-pointer leading-5"
            >
              User<br />Management
            </h1>

            {/* DARK MODE TOGGLE */}
            <button
              onClick={() =>
                document.documentElement.classList.toggle("dark")
              }
              className="flex items-center gap-2 px-3 py-1 border rounded-full text-gray-600 dark:text-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              🌙 <span className="text-sm">Dark</span>
            </button>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center justify-between md:justify-end gap-4">
            <img
              src={user?.avatar}
              className="h-10 w-10 rounded-full object-cover border"
              alt="avatar"
            />

            <div className="text-sm">
              <p className="font-medium text-gray-700 dark:text-gray-200">
                {user?.name}
              </p>
              <p className="text-gray-500 text-xs dark:text-gray-400">
                {user?.email}
              </p>
            </div>

            <button
              onClick={logout}
              className="px-3 py-1 text-sm border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-300 dark:hover:bg-gray-800"
            >
              Logout
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
