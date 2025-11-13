import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(form.email, form.password);
      navigate("/users");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow p-8 rounded-xl">
        <h1 className="text-2xl font-bold text-center mb-6 text-indigo-600">
          Login
        </h1>

        {error && (
          <p className="bg-red-100 text-red-700 px-3 py-2 rounded mb-4">
            {error}
          </p>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-md"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-md"
          />

          <button
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-xs text-center mt-6 text-gray-500">
          Try: john@mail.com / changeme
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
