
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

export default function CreateNewUser() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    NAME: "",
    DOB: "",
    PHONE: "",
    EMAIL: "",
    PASS: "",
    GENDER: "",
    ADDR: "",
    JOB: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.NAME || !formData.PHONE || !formData.PASS) {
      alert("Name, Phone, and Password are required.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/patients", formData);
      if (res.data.success) {
        alert("Account created successfully! Please login.");
        navigate("/login");
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to create account. " + (err.response?.data?.message || ""));
    }
  };

  return (
    <>
    <Header/>
    <div className="min-h-screen pt-16 pb-8 flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-200">

      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create New Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="NAME" placeholder="Full Name" value={formData.NAME} onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="date" name="DOB" placeholder="Date of Birth" value={formData.DOB} onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="text" name="GENDER" placeholder="Gender" value={formData.GENDER} onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="text" name="PHONE" placeholder="Phone" value={formData.PHONE} onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="email" name="EMAIL" placeholder="Email" value={formData.EMAIL} onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="password" name="PASS" placeholder="Password" value={formData.PASS} onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="text" name="ADDR" placeholder="Address" value={formData.ADDR} onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="text" name="JOB" placeholder="Job / Profession" value={formData.JOB} onChange={handleChange} className="w-full p-2 border rounded" />
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded mt-4">Sign Up</button>
        </form>
        <p className="text-center mt-4 text-gray-500">
          Already have an account?{" "}
          <span className="text-blue-500 cursor-pointer" onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </div>
    </div>
    </>
  );
}
