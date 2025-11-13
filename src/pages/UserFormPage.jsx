import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createUser, getUserById, updateUser } from '../api/platziClient';
import toast from 'react-hot-toast';

const initialState = {
  name: '',
  email: '',
  password: '',
  avatar: '',
  role: 'customer',
};

const UserFormPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await getUserById(id);
        const user = res.data;
        setForm({
          name: user.name || '',
          email: user.email || '',
          password: '',
          avatar: user.avatar || '',
          role: user.role || 'customer',
        });
      } catch (err) {
        console.error(err);
        setError('Failed to load user');
        toast.error('Failed to load user');
      } finally {
        setLoading(false);
      }
    };

    if (isEdit) {
      loadUser();
    }
  }, [id, isEdit]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isEdit) {
        const body = { ...form };
        if (!body.password) {
          delete body.password;
        }
        await updateUser(id, body);
        toast.success('User updated successfully ✅');
      } else {
        await createUser(form);
        toast.success('User created successfully 🎉');
      }
      navigate('/users');
    } catch (err) {
      console.error(err);
      setError('Failed to save user. Please check fields.');
      toast.error('Failed to save user ❌');
    }
  };

  if (loading) {
    return <p className="text-center text-gray-600">Loading user…</p>;
  }

  return (
    <div className="mx-auto max-w-xl rounded-lg bg-white p-6 shadow">
      <h1 className="mb-4 text-xl font-bold text-indigo-600">
        {isEdit ? 'Edit User' : 'Add User'}
      </h1>

      {error && (
        <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            name="name"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Password {isEdit && '(leave blank to keep current)'}
          </label>
          <input
            type="password"
            name="password"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            value={form.password}
            onChange={handleChange}
            required={!isEdit}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Avatar URL
          </label>
          <input
            name="avatar"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            value={form.avatar}
            onChange={handleChange}
            required
          />
          {form.avatar && (
            <img
              src={form.avatar}
              alt="Avatar preview"
              className="mt-2 h-16 w-16 rounded-full object-cover"
            />
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            name="role"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            value={form.role}
            onChange={handleChange}
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate('/users')}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserFormPage;
