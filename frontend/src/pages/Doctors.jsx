import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";

const API = import.meta.env.VITE_API_URL;

const Doctor = () => {
  const { hid } = useParams(); // Hospital ID from URL
  const [hospital, setHospital] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHospital();
    fetchDoctors();
  }, [hid]);

  const fetchHospital = async () => {
    try {
      const res = await axios.get(`${API}/hospitals`);
      const selected = res.data.find(
        (h) => Number(h.HID) === Number(hid)
      );
      setHospital(selected || null);
    } catch (error) {
      console.error("Error fetching hospital", error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(
        `${API}/doctors/hospital/${hid}`
      );
      setDoctors(res.data);
    } catch (error) {
      console.error("Error fetching doctors", error);
    }
  };

  const handleBook = async (doc) => {
    const user = JSON.parse(sessionStorage.getItem("user"));

    if (!user || !user.pid) {
      alert("You must be logged in as a patient to book.");
      navigate("/login");
      return;
    }

    try {
      await axios.post(`${API}/cart`, {
        pid: user.pid,
        did: doc.DID,
        hid: doc.HID,
      });

      alert(`✅ ${doc.NAME} added to appointment cart`);
      navigate("/cart");
    } catch (error) {
      console.error("Error adding to cart:", error.response?.data || error.message);
      alert("❌ Failed to add to cart");
    }
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-[#F4F6F8] px-4 py-10">
        <Link
          to="/findadoctor"
          className="text-[#3F8EFC] underline mb-4 inline-block"
        >
          ← Back to Find a Doctor
        </Link>

        {hospital && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-[#333] mb-2">
              {hospital.NAME}
            </h2>
            <p className="text-gray-600">Hospital ID: {hospital.HID}</p>
            <p className="text-gray-600">{hospital.ADDR}</p>
            <p className="text-gray-600">{hospital.EMAIL}</p>
            <p className="text-gray-600">{hospital.PHONE}</p>

            {hospital.WEBSITE && (
              <a
                href={hospital.WEBSITE}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#3F8EFC] underline"
              >
                Visit Website
              </a>
            )}
          </div>
        )}

        <h3 className="text-xl font-semibold mb-4 text-[#30C48D]">
          Doctors
        </h3>

        <div className="grid gap-4">
          {doctors.length === 0 ? (
            <p className="text-gray-500 italic">
              No doctors listed for this hospital.
            </p>
          ) : (
            doctors.map((doc) => (
              <div
                key={doc.DID}
                className="p-4 border rounded-md shadow-sm bg-white flex justify-between items-center"
              >
                <div>
                  <h4 className="text-lg font-semibold text-[#333]">
                    {doc.NAME}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Specialisation:{" "}
                    <span className="text-red-600">
                      {doc.SPECIALISATION}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Degree: {doc.DEGREE}
                  </p>
                  <p className="text-sm text-gray-600">
                    Institute: {doc.INSTITUTE}
                  </p>
                  <p className="text-sm text-gray-600">
                    Phone: {doc.PHONE}
                  </p>
                  <p className="text-sm text-gray-600">
                    Fees: ₹{doc.FEES}
                  </p>
                </div>

                <button
                  onClick={() => handleBook(doc)}
                  className="bg-[#30C48D] hover:bg-[#2aad7d] text-white px-4 py-2 rounded-lg"
                >
                  Book Appointment
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Doctor;
