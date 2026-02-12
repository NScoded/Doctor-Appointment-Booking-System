import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import Cart from "./Cart";
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
    if (!user || !user.pid) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        // 🔹 Appointments
        const apptRes = await axios.get(
          `${API}/appointments/patient/${user.pid}`
        );
        setAppointments(apptRes.data?.appointments || []);

        // 🔹 Patient profile
        const patientRes = await axios.get(
          `${API}/patients/${user.pid}`
        );
        const data = patientRes.data?.patient || patientRes.data;

        setFormData({
          NAME: data?.NAME || "",
          DOB: data?.DOB || "",
          PHONE: data?.PHONE || "",
          EMAIL: data?.EMAIL || "",
          GENDER: data?.GENDER || "",
          ADDR: data?.ADDR || "",
          JOB: data?.JOB || "",
        });
      } catch (err) {
        console.error(
          "Error loading patient data:",
          err.response?.data || err.message
        );
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

  const handleUpdate = async () => {
    try {
      await axios.put(
        `${API}/patients/${user.pid}`,
        formData
      );
      alert("✅ Profile updated successfully");
      sessionStorage.setItem(
        "user",
        JSON.stringify({ ...user, ...formData })
      );
      setActiveTab("profile");
    } catch (err) {
      console.error(
        "Update error:",
        err.response?.data || err.message
      );
      alert("❌ Failed to update profile");
    }
  };

  const handleDelete = async (aid) => {
    if (!window.confirm("Delete this appointment?")) return;

    try {
      await axios.delete(`${API}/appointments/${aid}`);
      setAppointments((prev) =>
        prev.filter((a) => a.AID !== aid)
      );
      alert("✅ Appointment deleted");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete appointment");
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
            {["profile", "edit", "appointments", "bookingList"].map((tab) => (
              <li key={tab}>
                <button
                  onClick={() => setActiveTab(tab)}
                  className={`w-full text-left p-2 rounded ${
                    activeTab === tab
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-200"
                  }`}
                >
                  {tab === "profile"
                    ? "Profile"
                    : tab === "edit"
                    ? "Edit Profile"
                    : tab === "appointments"
                    ? "My Appointments"
                    : "Booking List"}
                </button>
              </li>
            ))}

            <li>
              <button
                onClick={() => {
                  sessionStorage.clear();
                  navigate("/");
                }}
                className="w-full text-left p-2 rounded hover:bg-gray-200 text-red-600 font-semibold"
              >
                Sign Out
              </button>
            </li>
          </ul>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-4">Patient Profile</h1>

          {/* Profile */}
          {activeTab === "profile" && (
            <div className="bg-white shadow rounded-xl p-6 max-w-2xl grid grid-cols-2 gap-4">
              <p><strong>Name:</strong> {formData.NAME}</p>
              <p><strong>DOB:</strong> {formData.DOB}</p>
              <p><strong>Gender:</strong> {formData.GENDER}</p>
              <p><strong>Phone:</strong> {formData.PHONE}</p>
              <p><strong>Email:</strong> {formData.EMAIL}</p>
              <p><strong>Job:</strong> {formData.JOB}</p>
              <p className="col-span-2"><strong>Address:</strong> {formData.ADDR}</p>
            </div>
          )}

          {/* Edit */}
          {activeTab === "edit" && (
            <div className="bg-white shadow rounded-xl p-6 max-w-2xl">
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(formData).map(([k, v]) => (
                  <input
                    key={k}
                    name={k}
                    value={v}
                    onChange={handleChange}
                    placeholder={k}
                    className="border p-2 rounded"
                  />
                ))}
              </div>
              <button
                onClick={handleUpdate}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save Changes
              </button>
            </div>
          )}

          {/* Appointments */}
          {activeTab === "appointments" && (
            <>
              {appointments.length === 0 ? (
                <p className="text-gray-500">No appointments found.</p>
              ) : (
                <table className="w-full border">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="border p-2">Doctor</th>
                      <th className="border p-2">Hospital</th>
                      <th className="border p-2">Status</th>
                      <th className="border p-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((a) => (
                      <tr key={a.AID}>
                        <td className="border p-2">{a.doctor_name}</td>
                        <td className="border p-2">{a.hospital_name}</td>
                        <td className="border p-2">{a.STATUS}</td>
                        <td className="border p-2">
                          {(a.STATUS === "Confirmed" ||
                            a.STATUS === "Rejected") && (
                            <button
                              onClick={() => handleDelete(a.AID)}
                              className="text-red-500"
                            >
                              🗑 Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}

          {/* Booking List */}
          {activeTab === "bookingList" && <Cart showHeader={false} />}
        </div>
      </div>
    </>
  );
}
