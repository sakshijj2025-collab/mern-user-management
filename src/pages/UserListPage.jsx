import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers, deleteUser } from "../api/platziClient";
import toast from "react-hot-toast";
import UserTableSkeleton from "../components/UserTableSkeleton";
import ConfirmModal from "../components/ConfirmModal";

const UserListPage = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [deleteTarget, setDeleteTarget] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to load users. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // 🔍 Search + Filter (fixed behaviour)
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredUsers = users.filter((user) => {
    const username = (user.name || "").toLowerCase();
    const email = (user.email || "").toLowerCase();
    const emailLocalPart = email.split("@")[0]; // only part before @

    // if search box empty → match everything
    const matchesSearch =
      !normalizedSearch ||
      username.startsWith(normalizedSearch) ||
      emailLocalPart.startsWith(normalizedSearch);

    const matchesRole =
      roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Pagination logic
  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / pageSize) || 1;

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + pageSize);

  // Delete modal
  const openDeleteModal = (user) => setDeleteTarget(user);
  const closeDeleteModal = () => setDeleteTarget(null);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteUser(deleteTarget.id);
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      toast.success("User deleted successfully");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to delete user. Try again."
      );
    } finally {
      closeDeleteModal();
    }
  };

  if (loading) return <UserTableSkeleton />;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">
          Users
        </h1>

        <button
          onClick={() => navigate("/users/new")}
          className="rounded-md bg-indigo-600 text-white px-4 py-2 text-sm shadow hover:bg-indigo-700"
        >
          + Add User
        </button>
      </div>

      {/* Search + Filter Bar */}
      <div className="bg-white dark:bg-gray-800 shadow p-4 rounded-lg flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
            Search
          </label>
          <input
            type="text"
            placeholder="Search by name or email"
            className="w-full border dark:border-gray-600 dark:bg-gray-900 dark:text-white rounded-md px-3 py-2 text-sm"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
            Role
          </label>
          <select
            className="border dark:border-gray-600 dark:bg-gray-900 dark:text-white rounded-md px-3 py-2 text-sm"
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All</option>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {/* TABLE (Desktop) */}
      <div className="hidden md:block overflow-x-auto rounded-xl shadow bg-white dark:bg-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900/40">
            <tr>
              <th className="px-4 py-2 text-left">Avatar</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {paginatedUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-2">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                </td>

                <td className="px-4 py-2 font-medium dark:text-gray-200">
                  {user.name}
                </td>

                <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                  {user.email}
                </td>

                <td className="px-4 py-2 text-gray-600 dark:text-gray-400 capitalize">
                  {user.role}
                </td>

                <td className="px-4 py-2 text-right">
                  <button
                    onClick={() => navigate(`/users/${user.id}`)}
                    className="border border-yellow-500 text-yellow-600 px-3 py-1 rounded-md text-xs mr-2 dark:text-yellow-400"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => openDeleteModal(user)}
                    className="border border-red-500 text-red-500 px-3 py-1 rounded-md text-xs dark:text-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {paginatedUsers.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARD VIEW */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {paginatedUsers.map((user) => (
          <div
            key={user.id}
            className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 flex items-center gap-4"
          >
            <img
              src={user.avatar}
              className="h-14 w-14 rounded-full object-cover border"
            />

            <div className="flex-1">
              <h2 className="font-semibold dark:text-white">{user.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user.email}
              </p>
              <p className="text-xs mt-1 capitalize text-gray-600 dark:text-gray-400">
                Role: {user.role}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => navigate(`/users/${user.id}`)}
                className="border border-yellow-500 text-yellow-600 text-xs px-2 py-1 rounded-md"
              >
                Edit
              </button>

              <button
                onClick={() => openDeleteModal(user)}
                className="border border-red-500 text-red-500 text-xs px-2 py-1 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 my-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="border px-3 py-1 rounded disabled:opacity-40 dark:border-gray-600 dark:text-gray-300"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`border px-3 py-1 rounded ${
                page === currentPage
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="border px-3 py-1 rounded disabled:opacity-40 dark:border-gray-600 dark:text-gray-300"
          >
            Next
          </button>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete User"
        message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        onCancel={closeDeleteModal}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default UserListPage;
