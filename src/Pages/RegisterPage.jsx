import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE from "../config";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!name.trim()) {
      formErrors.name = "Name is required";
      isValid = false;
    }
    if (!email.trim()) {
      formErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      formErrors.email = "Invalid email format";
      isValid = false;
    }
    if (!password.trim()) {
      formErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 3) {
      formErrors.password = "Password must be at least 3 characters";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch(`${API_BASE}/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.message && data.message.includes("Email")) {
          setErrors((prev) => ({ ...prev, email: data.message }));
        } else {
          alert(data.message || "Registration failed");
        }
        return;
      }

      setName("");
      setEmail("");
      setPassword("");
      setErrors({});
      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (error) {
      console.error("Error:", error);
      alert("Server error, please try again later");
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden fixed top-0 left-0">
      {/* Left Section */}
      <div className="w-full md:w-1/2 flex flex-col bg-white">
        {/* Top - Logo */}
        <div className="p-6 md:p-10">
          <h1 className="text-purple-700 font-bold text-lg">FOREIGN JAO</h1>
        </div>

        {/* Middle - Form */}
        <div className="flex-1 flex items-center justify-center px-6 md:px-16">
          <div className="w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-2">Sign up</h2>
            <p className="text-gray-500 mb-8">Fill in the following details</p>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 text-white rounded-lg py-2 font-semibold mt-2 hover:bg-purple-700 transition"
              >
                Get started
              </button>
            </form>
            <div className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-purple-600 font-semibold hover:underline"
              >
                Log in
              </button>
            </div>
          </div>
        </div>

        {/* Bottom - Footer */}
        <div className="p-4 text-xs text-gray-400">© Foreign Jao</div>
      </div>

      {/* Right Section */}
      <div className="hidden md:flex w-1/2 h-full">
        <img
          src="/assets/Register.png"
          alt="Register"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
};

export default RegisterPage;
