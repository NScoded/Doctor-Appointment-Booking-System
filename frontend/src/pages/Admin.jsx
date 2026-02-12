import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

const Admin = () => {
  const [view, setView] = useState("hospital");
  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
    website: "",
  });

  const [doctorData, setDoctorData] = useState({
    hid: "",
    name: "",
    email: "",
    pass: "",
    addr: "",
    dob: "",
    gender: "",
    specialisation: "",
    institute: "",
    degree: "",
    phone: "",
    fees: "",
  });

  /* ---------------- FETCH DATA ---------------- */

  useEffect(() => {
    fetchHospitals();
    fetchDoctors();
  }, []);

  const fetchHospitals = async () => {
    try {
      const res = await axios.get(`${API}/hospitals`);
      setHospitals(res.data);
    } catch (err) {
      console.error("Error fetching hospitals:", err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${API}/doctors`);
      setDoctors(res.data);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };

  /* ---------------- HANDLERS ---------------- */

  const handleHospitalChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleDoctorChange = (e) => {
    const { name, value } = e.target;

    setDoctorData((prev) => {
      const newData = { ...prev, [name]: value };

      // Auto-generate email from name
      if (name === "name" && (!prev.email || prev.email.endsWith("@gmail.com"))) {
        newData.email = value.replace(/\s+/g, "").toLowerCase() + "@gmail.com";
      }

      return newData;
    });
  };

  /* ---------------- CRUD ---------------- */

  const addHospital = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/hospitals`, formData);
      setFormData({
        name: "",
        address: "",
        email: "",
        phone: "",
        website: "",
      });
      fetchHospitals();
    } catch (err) {
      console.error("Error adding hospital:", err);
    }
  };

  const addDoctor = async (e) => {
    e.preventDefault();

    const payload = {
      ...doctorData,
      hid: Number(doctorData.hid),
    };

    try {
      await axios.post(`${API}/doctors`, payload);

      setDoctorData({
        hid: "",
        name: "",
        email: "",
        pass: "",
        addr: "",
        dob: "",
        gender: "",
        specialisation: "",
        institute: "",
        degree: "",
        phone: "",
        fees: "",
      });

      fetchDoctors();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add doctor");
    }
  };

  const deleteHospital = async (id) => {
    await axios.delete(`${API}/hospitals/${id}`);
    fetchHospitals();
  };

  const deleteDoctor = async (id) => {
    await axios.delete(`${API}/doctors/${id}`);
    fetchDoctors();
  };

  /* ---------------- UI ---------------- */

  return (
    <>
      <Header />
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <button
            onClick={() => {
              sessionStorage.clear();
              navigate("/");
            }}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Sign Out
          </button>
        </div>

        <div className="mb-4 flex gap-4">
          <button
            onClick={() => setView("hospital")}
            className={`px-4 py-2 rounded ${
              view === "hospital" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Hospital
          </button>
          <button
            onClick={() => setView("doctor")}
            className={`px-4 py-2 rounded ${
              view === "doctor" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Doctor
          </button>
        </div>

        {view === "hospital" ? (
          <>
            <h2 className="text-xl mb-2">Hospital List</h2>

            <table className="w-full border mb-4">
              <thead>
                <tr>
                  {["HID", "Name", "Address", "Email", "Phone", "Website", "Actions"].map(
                    (h) => (
                      <th key={h} className="border p-2">
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {hospitals.map((h) => (
                  <tr key={h.HID}>
                    <td className="border p-2">{h.HID}</td>
                    <td className="border p-2">{h.NAME}</td>
                    <td className="border p-2">{h.ADDR}</td>
                    <td className="border p-2">{h.EMAIL}</td>
                    <td className="border p-2">{h.PHONE}</td>
                    <td className="border p-2">{h.WEBSITE}</td>
                    <td className="border p-2">
                      <button
                        onClick={() => deleteHospital(h.HID)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h2 className="text-xl mb-2">Add Hospital</h2>
            <form onSubmit={addHospital} className="grid grid-cols-2 gap-4">
              {Object.entries(formData).map(([key, value]) => (
                <input
                  key={key}
                  name={key}
                  value={value}
                  onChange={handleHospitalChange}
                  placeholder={key}
                  className="border p-2"
                  required={["name", "phone"].includes(key)}
                />
              ))}
              <button className="bg-blue-500 text-white px-4 py-2 rounded col-span-2">
                Add Hospital
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-xl mb-2">Doctor List</h2>

            <table className="w-full border mb-4">
              <thead>
                <tr>
                  {["DID", "HID", "Name", "Email", "Specialisation", "Phone", "Fees", "Actions"].map(
                    (d) => (
                      <th key={d} className="border p-2">
                        {d}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {doctors.map((d) => (
                  <tr key={d.DID}>
                    <td className="border p-2">{d.DID}</td>
                    <td className="border p-2">{d.HID}</td>
                    <td className="border p-2">{d.NAME}</td>
                    <td className="border p-2">{d.EMAIL}</td>
                    <td className="border p-2">{d.SPECIALISATION}</td>
                    <td className="border p-2">{d.PHONE}</td>
                    <td className="border p-2">{d.FEES}</td>
                    <td className="border p-2">
                      <button
                        onClick={() => deleteDoctor(d.DID)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h2 className="text-xl mb-2">Add Doctor</h2>
            <form onSubmit={addDoctor} className="grid grid-cols-2 gap-4">
              {Object.entries(doctorData).map(([key, value]) => (
                <input
                  key={key}
                  name={key}
                  value={value}
                  onChange={handleDoctorChange}
                  placeholder={key.toUpperCase()}
                  className="border p-2"
                  required={["hid", "name", "specialisation", "phone"].includes(key)}
                />
              ))}
              <button className="bg-blue-500 text-white px-4 py-2 rounded col-span-2">
                Add Doctor
              </button>
            </form>
          </>
        )}
      </div>
    </>
  );
};

export default Admin;
