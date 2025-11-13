import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createUser, getUserById, updateUser } from "../api/platziClient";
import toast from "react-hot-toast";

const initialState = {
  name: "",
  email: "",
  password: "",
  avatar: "",
  role: "customer",
};

const UserFormPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await getUserById(id);
        setForm({
          name: res.data.name,
          email: res.data.email,
          password: "",
          avatar: res.data.avatar,
          role: res.data.role,
        });
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (isEdit) loadUser();
  }, [id, isEdit]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isEdit) {
        const updated = { ...form };
        if (!updated.password) delete updated.password;

        await updateUser(id, updated);
        toast.success("User updated");
      } else {
        await createUser(form);
        toast.success("User created");
      }
      navigate("/users");

    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  if (loading) return <p className="text-center">Loading user…</p>;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow">

      <h1 className="text-xl font-bold text-indigo-600 mb-4">
        {isEdit ? "Edit User" : "Add User"}
      </h1>

      {error && (
        <p className="mb-3 bg-red-100 text-red-700 px-3 py-2 rounded-md">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="text-sm font-medium">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-md"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-md"
          />
        </div>

        <div>
          <label className="text-sm font-medium">
            Password {isEdit && "(leave blank to keep old)"}
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required={!isEdit}
            className="w-full border px-3 py-2 rounded-md"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Avatar URL</label>
          <input
            name="avatar"
            value={form.avatar}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-md"
          />

          {form.avatar && (
            <img
              src={form.avatar}
              alt="Avatar"
              className="h-16 w-16 mt-2 rounded-full object-cover"
            />
          )}
        </div>

        <div>
          <label className="text-sm font-medium">Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate("/users")}
            className="border px-4 py-2 rounded-md"
          >
            Cancel
          </button>

          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md">
            Save
          </button>
        </div>

      </form>
    </div>
  );
};

export default UserFormPage;
