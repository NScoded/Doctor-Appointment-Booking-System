import React, { useState } from "react";
import axios from "axios";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

const styles = {
  body: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    fontFamily: "'Poppins', sans-serif",
    margin: 0,
    padding: 0,
  },
  container: {
    background: "#fff",
    padding: "40px 30px",
    borderRadius: "16px",
    boxShadow: "0 12px 25px rgba(0, 0, 0, 0.15)",
    width: "100%",
    maxWidth: "380px",
  },
  h2: {
    textAlign: "center",
    color: "#3F8EFC",
    marginBottom: "25px",
    fontSize: "28px",
    fontWeight: "700",
  },
  formGroup: { marginBottom: "18px" },
  label: { display: "block", fontSize: "14px", marginBottom: "6px", color: "#444" },
  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "15px",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#3F8EFC",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: "10px",
  },
  loginLink: { textAlign: "center", marginTop: "15px", fontSize: "14px" },
  link: { color: "#3F8EFC", cursor: "pointer", fontWeight: 500 },
  remember: { display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", marginTop: "5px" },
};

function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API}/login`, {
        email: formData.email,
        password: formData.password,
      });

      if (res.data.success) {
        const user = res.data.user;

        sessionStorage.setItem("user", JSON.stringify(user));
        sessionStorage.setItem("isLoggedIn", "true");

        alert(`✅ Logged in as ${user.role}`);

        if (user.role === "admin") navigate("/admin");
        else if (user.role === "doctor") navigate("/doctor-profile");
        else if (user.role === "patient") navigate("/patient-profile");
        else alert("⚠️ Unknown role");
      } else {
        alert("❌ Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      alert("⚠️ Server error. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <div style={styles.body}>
        <div style={styles.container}>
          <h2 style={styles.h2}>Login</h2>

          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input
                style={styles.input}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <input
                style={styles.input}
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div style={styles.remember}>
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
              />
              <label>Remember Me</label>
            </div>

            <button type="submit" style={styles.button}>
              Log In
            </button>
          </form>

          <div style={styles.loginLink}>
            Don’t have an account?{" "}
            <span style={styles.link} onClick={() => navigate("/signup")}>
              Sign Up
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
