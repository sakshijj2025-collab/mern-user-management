import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, deleteUser } from '../api/platziClient';
import toast from 'react-hot-toast';
import UserTableSkeleton from '../components/UserTableSkeleton';
import ConfirmModal from '../components/ConfirmModal';

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Sorting
  const [sortBy, setSortBy] = useState('name'); // name | email | role
  const [sortDirection, setSortDirection] = useState('asc'); // asc | desc

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState(null);

  const navigate = useNavigate();

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load users');
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openDeleteModal = (user) => {
    setDeleteTarget(user);
  };

  const closeDeleteModal = () => {
    setDeleteTarget(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteUser(deleteTarget.id);
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      toast.success('User deleted successfully 👌');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete user ❌');
    } finally {
      closeDeleteModal();
    }
  };

  // Filter + search
  const normalizedSearch = searchTerm.toLowerCase();

  let filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(normalizedSearch) ||
      user.email.toLowerCase().includes(normalizedSearch);
    const matchesRole =
      roleFilter === 'all' ? true : user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Sorting
  filteredUsers = filteredUsers.sort((a, b) => {
    const fieldA = (a[sortBy] || '').toString().toLowerCase();
    const fieldB = (b[sortBy] || '').toString().toLowerCase();

    if (fieldA < fieldB) return sortDirection === 'asc' ? -1 : 1;
    if (fieldA > fieldB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / pageSize) || 1;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + pageSize
  );

  const changeSort = (field) => {
    if (sortBy === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const sortIcon = (field) => {
    if (sortBy !== field) return '↕';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  if (loading) {
    return <UserTableSkeleton />;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Users
        </h1>
        <button
          onClick={() => navigate('/users/new')}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          + Add User
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg bg-white p-4 shadow dark:bg-gray-800">
        <div className="flex-1 min-w-[200px]">
          <label className="mb-1 block text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
            Search
          </label>
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
            Role
          </label>
          <select
            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
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

        <div className="ml-auto text-sm text-gray-500 dark:text-gray-400">
          Showing{' '}
          <span className="font-semibold">{paginatedUsers.length}</span> of{' '}
          <span className="font-semibold">{filteredUsers.length}</span> users
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-300">
          {error}
        </p>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl bg-white shadow dark:bg-gray-800">
        <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900/40">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-300">
                Avatar
              </th>
              <th
                className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-300 cursor-pointer select-none"
                onClick={() => changeSort('name')}
              >
                Name <span className="text-xs">{sortIcon('name')}</span>
              </th>
              <th
                className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-300 cursor-pointer select-none"
                onClick={() => changeSort('email')}
              >
                Email <span className="text-xs">{sortIcon('email')}</span>
              </th>
              <th
                className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-300 cursor-pointer select-none"
                onClick={() => changeSort('role')}
              >
                Role <span className="text-xs">{sortIcon('role')}</span>
              </th>
              <th className="px-4 py-2 text-right font-medium text-gray-600 dark:text-gray-300">
                Actions
              </th>
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
                <td className="px-4 py-2 font-medium text-gray-800 dark:text-gray-100">
                  {user.name}
                </td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-300">
                  {user.email}
                </td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-300 capitalize">
                  {user.role}
                </td>
                <td className="px-4 py-2 text-right space-x-2">
                  <button
                    onClick={() => navigate(`/users/${user.id}`)}
                    className="rounded-md border border-yellow-400 px-3 py-1 text-xs font-medium text-yellow-700 hover:bg-yellow-50 dark:border-yellow-500 dark:text-yellow-300 dark:hover:bg-yellow-900/30"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(user)}
                    className="rounded-md border border-red-500 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-500 dark:text-red-300 dark:hover:bg-red-900/30"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {paginatedUsers.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  No users match your search / filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="rounded-md border px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-40 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
          >
            ← Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`rounded-md px-3 py-1 text-sm border ${
                num === currentPage
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800 dark:text-gray-100'
              }`}
            >
              {num}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="rounded-md border px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-40 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
          >
            Next →
          </button>
        </div>
      )}

      {/* Delete confirmation modal */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete user"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`
            : ''
        }
        onCancel={closeDeleteModal}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default UserListPage;
