import React, { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import API_BASE from "../config";
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        // keep data null if parsing fails
      }

      if (res.status !== 200 && res.status !== 201) {
        const msg =
          data?.message ||
          data?.error ||
          (res.status === 401 ? "Invalid email or password" : "Login failed");
        throw new Error(msg);
      }

      // 🔑 extract user id
      const userId =
        data?.user?._id ||
        data?.user?.id ||
        data?._id ||
        data?.id ||
        data?.data?._id;

      if (!userId) {
        throw new Error("Login succeeded but no user id was returned.");
      }

      // ✅ Save IDs consistently
      localStorage.setItem("studentID", userId); // required by TestDetailPage
      localStorage.setItem("userId", userId); // compatibility
      if (data?.token) localStorage.setItem("token", data.token);

      // ✅ Redirect
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden fixed top-0 left-0">
      {/* Left Section */}
      <div className="w-full md:w-1/2 flex flex-col bg-white">
        {/* Top - Logo */}
        <div className="p-6 md:p-10">
          <h1 className="text-purple-700 font-bold text-lg">FOREIGN JAOO</h1>
        </div>
        <div className="flex-1 flex items-center justify-center px-6 md:px-16">
          <div className="max-w-md w-full mx-auto">
            <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
            <p className="text-gray-500 mb-8">
              Welcome back! Please enter your details.
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="******"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm">
                  <input type="checkbox" className="mr-2 rounded" /> Remember Me
                </label>
                <a href="#" className="text-xs text-purple-600 hover:underline">
                  Forgot password
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white rounded-lg py-2 font-semibold mt-2 hover:bg-purple-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

              {/* ✅ Fixed Google Icon Path */}
              <button
                type="button"
                className="w-full flex items-center justify-center border border-gray-300 rounded-lg py-2 mt-2 font-semibold text-gray-700 bg-white hover:bg-gray-50 transition"
              >
                <img
                  src="/assets/google-icon.png"
                  alt="Google"
                  className="w-5 h-5 mr-2"
                />
                Sign in with Google
              </button>
            </form>

            <div className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-purple-600 font-semibold hover:underline"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-1 left-0 pl-6 pb-2 text-xs text-gray-400">
          © Foreign Jao
        </div>
      </div>

      {/* Right Side - Testimonial */}
      <div className="hidden md:flex w-1/2 relative items-stretch bg-gray-100">
        {/* ✅ Fixed Login Image Path */}
        <img
          src="/assets/Login.png"
          alt="Testimonial"
          className="object-cover w-full h-dvh"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-start pl-16 pr-10">
          <div className="flex-1 flex flex-col justify-center items-start w-full">
            <div
              className="text-white text-3xl font-bold text-left mb-8"
              style={{ lineHeight: "1.2" }}
            >
              "Thanks to Foreign Jao for
              <br />
              changing my future"
            </div>
          </div>
          <div className="mt-auto w-full flex flex-col items-start mb-10">
            <div className="text-white text-lg font-semibold">Vikas Raj</div>
            <div className="text-white text-sm">
              Masters in Aeronautical Engineering
            </div>
            <div className="text-white text-sm opacity-80">
              Harvard University
            </div>
          </div>
          <div className="absolute bottom-8 right-10 flex gap-4">
            <button className="group w-10 h-10 flex items-center justify-center rounded-full border border-white transition hover:bg-gray-200">
              <ArrowLeft className="text-white w-5 h-5 group-hover:text-purple-600 transition-colors" />
            </button>
            <button className="group w-10 h-10 flex items-center justify-center rounded-full border border-white transition hover:bg-gray-200">
              <ArrowRight className="text-white w-5 h-5 group-hover:text-purple-600 transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
