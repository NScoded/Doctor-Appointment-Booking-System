import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import Cart from "./Cart"; // Booking List component
import { useNavigate } from "react-router-dom";
const API = import.meta.env.VITE_API_URL;


export default function PatientProfile() {
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));

  const [formData, setFormData] = useState({
    NAME: "",
    DOB: "",
    PHONE: "",
    EMAIL: "",
    GENDER: "",
    ADDR: "",
    JOB: "",
  });

  useEffect(() => {
  if (!user || !user.pid) return;

  const fetchData = async () => {
    try {
      const apptRes = await axios.get(`${API}/appointments/patient/${user.pid}`);
      setAppointments(apptRes.data?.appointments || []);

      const patientRes = await axios.get(`${API}/patients/${user.pid}`);

      const data = patientRes.data?.patient || patientRes.data;

      console.log("Patient data response:", data); // 🔍 check keys in console

        setFormData({
          NAME: data?.NAME ?? data?.name ?? "",
          DOB: data?.DOB ?? data?.dob ?? "",
          PHONE: data?.PHONE ?? data?.phone ?? "",
          EMAIL: data?.EMAIL ?? data?.email ?? "",
          GENDER: data?.GENDER ?? data?.gender ?? "",
          ADDR: data?.ADDR ?? data?.addr ?? "",
          JOB: data?.JOB ?? data?.job ?? "",
        });

    } catch (err) {
      console.error("Error loading patient data:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (appointmentId) => {
  if (!window.confirm("Are you sure you want to delete this appointment?")) return;

  try {
    await axios.delete(`${API}/appointments/${appointmentId}`);
    setAppointments((prev) => prev.filter((appt) => appt.AID !== appointmentId));
    alert("Appointment deleted successfully!");
  } catch (err) {
    console.error("Delete error:", err.response?.data || err.message);
    alert("Failed to delete appointment!");
  }
};


  const handleUpdate = async () => {
    try {
      await axios.put(`${API}/appointments/patients/${user.pid}`, formData);
      alert("Profile updated successfully!");
      sessionStorage.setItem("user", JSON.stringify({ ...user, ...formData }));
      setActiveTab("profile");
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      alert("Failed to update profile!");
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="p-6 text-gray-500">Loading profile...</div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-gray-100 p-6">
          <h2 className="text-xl font-bold mb-6">Dashboard</h2>
          <ul className="space-y-3">
            <li>
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full text-left p-2 rounded ${
                  activeTab === "profile" ? "bg-blue-500 text-white" : "hover:bg-gray-200"
                }`}
              >
                Profile
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("edit")}
                className={`w-full text-left p-2 rounded ${
                  activeTab === "edit" ? "bg-blue-500 text-white" : "hover:bg-gray-200"
                }`}
              >
                Edit Profile
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("appointments")}
                className={`w-full text-left p-2 rounded ${
                  activeTab === "appointments" ? "bg-blue-500 text-white" : "hover:bg-gray-200"
                }`}
              >
                My Appointments
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("bookingList")}
                className={`w-full text-left p-2 rounded ${
                  activeTab === "bookingList" ? "bg-blue-500 text-white" : "hover:bg-gray-200"
                }`}
              >
                Booking List
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  sessionStorage.removeItem("user");
                  sessionStorage.setItem("isLoggedIn", "false");
                  alert("You have been signed out successfully.");
                  navigate("/");
                }}
                className="w-full text-left p-2 rounded hover:bg-gray-200 text-red-600 font-semibold"
              >
                Sign Out
              </button>
            </li>
          </ul>
        </div>

        {/* Right Content */}
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-4">Patient Profile</h1>

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="bg-white shadow rounded-xl p-6 max-w-2xl">
              <h2 className="text-xl font-semibold mb-4">Patient Information</h2>
              <div className="grid grid-cols-2 gap-4 text-gray-700">
                <p><strong>Name:</strong> {formData.NAME}</p>
                <p><strong>DOB:</strong> {formData.DOB}</p>
                <p><strong>Gender:</strong> {formData.GENDER}</p>
                <p><strong>Phone:</strong> {formData.PHONE}</p>
                <p><strong>Email:</strong> {formData.EMAIL}</p>
                <p><strong>Job:</strong> {formData.JOB}</p>
                <p className="col-span-2"><strong>Address:</strong> {formData.ADDR}</p>
              </div>
            </div>
          )}

          {/* Edit Tab */}
          {activeTab === "edit" && (
            <div className="bg-white shadow rounded-xl p-6 max-w-2xl">
              <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" name="NAME" value={formData.NAME} onChange={handleChange} placeholder="Full Name" className="border p-2 rounded" />
                <input type="date" name="DOB" value={formData.DOB} onChange={handleChange} className="border p-2 rounded" />
                <input type="text" name="GENDER" value={formData.GENDER} onChange={handleChange} placeholder="Gender" className="border p-2 rounded" />
                <input type="text" name="PHONE" value={formData.PHONE} onChange={handleChange} placeholder="Phone" className="border p-2 rounded" />
                <input type="email" name="EMAIL" value={formData.EMAIL} onChange={handleChange} placeholder="Email" className="border p-2 rounded" />
                <input type="text" name="JOB" value={formData.JOB} onChange={handleChange} placeholder="Job" className="border p-2 rounded" />
                <textarea name="ADDR" value={formData.ADDR} onChange={handleChange} placeholder="Address" className="border p-2 rounded col-span-2" />
              </div>
              <button onClick={handleUpdate} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Save Changes
              </button>
            </div>
          )}

          {/* Appointments */}
          {activeTab === "appointments" && (
            <div>
              <h2 className="text-xl font-semibold mt-6 mb-2">My Appointments</h2>
              {appointments.length > 0 ? (
                <table className="w-full border">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border px-4 py-2">Doctor</th>
                      <th className="border px-4 py-2">Hospital</th>
                      <th className="border px-4 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appt, index) => (
                      <tr key={index}>
                        <td className="border px-4 py-2">{appt?.doctor_name}</td>
                        <td className="border px-4 py-2">{appt?.hospital_name}</td>
<td className="border px-4 py-2 flex items-center space-x-2">
  <span
    className={`inline-block px-2 py-1 text-sm rounded ${
      appt.STATUS === "Confirmed"
        ? "bg-green-100 text-green-700"
        : appt.STATUS === "Rejected"
        ? "bg-red-100 text-red-700"
        : "bg-yellow-100 text-yellow-700"
    }`}
  >
    {appt.STATUS}
  </span>

  {/* Extra info + delete buttons */}
  {(appt.STATUS === "Rejected" || appt.STATUS === "Confirmed") && (
    <div className="flex items-center space-x-2">
      {/* Info icon (only for rejected) */}
      {appt.STATUS === "Rejected" && (
        <div className="relative group">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-blue-500 cursor-pointer"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M12 12h.01"
            />
          </svg>
          <div className="absolute bottom-full mb-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-sm rounded px-3 py-1 whitespace-nowrap z-10">
            Your refund is initiated
          </div>
        </div>
      )}

      {/* 🗑️ Delete (dustbin) button */}
      <button
        onClick={() => handleDelete(appt.AID)}
        className="text-red-500 hover:text-red-700"
        title="Delete appointment"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9 3a1 1 0 011-1h4a1 1 0 011 1v1h5a1 1 0 110 2h-1v13a2 2 0 01-2 2H7a2 2 0 01-2-2V6H4a1 1 0 110-2h5V3zm2 5a1 1 0 10-2 0v9a1 1 0 102 0V8zm4 0a1 1 0 10-2 0v9a1 1 0 102 0V8z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  )}
</td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500">No appointments found.</p>
              )}
            </div>
          )}

          {/* Booking List */}
          {activeTab === "bookingList" && <Cart showHeader={false} />}
        </div>
      </div>
    </>
  );
}
