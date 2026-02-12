import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import logo from "../assets/images/logo.png";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

const FindADoctor = () => {
  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [searchType, setSearchType] = useState("hospital");
  const [doctorSearchField, setDoctorSearchField] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchHospitals();
    fetchDoctors();
  }, []);

  const fetchHospitals = async () => {
    try {
      const res = await axios.get(`${API}/hospitals`);
      setHospitals(res.data || []);
    } catch (error) {
      console.error("Error fetching hospitals", error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${API}/doctors`);
      setDoctors(res.data || []);
    } catch (error) {
      console.error("Error fetching doctors", error);
    }
  };

  /* 🔍 Filters */
  const filteredHospitals = hospitals.filter((h) =>
    (h?.NAME || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDoctors = doctors.filter((d) => {
    if (doctorSearchField === "name") {
      return (d?.NAME || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    }
    if (doctorSearchField === "specialisation") {
      return (d?.SPECIALISATION || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    }
    return true;
  });

  /* 🏥 Hospital name by HID */
  const getHospitalName = (hid) => {
    const hospital = hospitals.find(
      (h) => Number(h.HID) === Number(hid)
    );
    return hospital ? hospital.NAME : "Unknown Hospital";
  };

  const goToHospitalDoctors = (hid) => {
    if (!hid) return;
    navigate(`/doctors/${hid}`);
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gradient-to-br from-[#F4F6F8] to-[#E0F7FA] px-4 py-10">
        <h2 className="text-3xl font-bold text-center mb-8 text-[#333]">
          {searchType === "hospital" ? "Find a Hospital" : "Find a Doctor"}
        </h2>

        {/* Toggle */}
        <div className="flex flex-wrap gap-4 justify-center sm:justify-end items-center mb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setSearchType("hospital")}
              className={`px-3 py-1 rounded ${
                searchType === "hospital"
                  ? "bg-[#3F8EFC] text-white"
                  : "bg-gray-200"
              }`}
            >
              Hospital
            </button>
            <button
              onClick={() => setSearchType("doctor")}
              className={`px-3 py-1 rounded ${
                searchType === "doctor"
                  ? "bg-[#3F8EFC] text-white"
                  : "bg-gray-200"
              }`}
            >
              Doctor
            </button>
          </div>

          {searchType === "doctor" && (
            <div className="flex gap-2">
              <button
                onClick={() => setDoctorSearchField("name")}
                className={`px-2 py-1 text-sm rounded ${
                  doctorSearchField === "name"
                    ? "bg-[#30C48D] text-white"
                    : "bg-gray-200"
                }`}
              >
                Name
              </button>
              <button
                onClick={() => setDoctorSearchField("specialisation")}
                className={`px-2 py-1 text-sm rounded ${
                  doctorSearchField === "specialisation"
                    ? "bg-[#30C48D] text-white"
                    : "bg-gray-200"
                }`}
              >
                Specialisation
              </button>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="flex justify-end mb-6">
          <input
            type="text"
            placeholder={`Search ${
              searchType === "hospital" ? "hospital" : doctorSearchField
            }`}
            className="px-4 py-2 border rounded-md w-full sm:w-80"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchType === "hospital" ? (
            filteredHospitals.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">
                No hospitals found.
              </p>
            ) : (
              filteredHospitals.map((h) => (
                <div
                  key={h.HID}
                  className="bg-white shadow-md rounded-xl p-4 flex flex-col items-center text-center relative"
                >
                  <span className="absolute top-2 left-2 bg-gray-200 text-sm px-2 py-1 rounded">
                    {h.HID}
                  </span>

                  <img src={logo} alt={h.NAME} className="w-24 h-24 mb-4" />
                  <h3 className="text-xl font-semibold">{h.NAME}</h3>
                  <p className="text-sm text-gray-500">{h.ADDR}</p>
                  <p className="text-sm text-gray-500">{h.PHONE}</p>

                  <button
                    onClick={() => goToHospitalDoctors(h.HID)}
                    className="mt-4 px-4 py-2 bg-[#30C48D] text-white rounded-lg"
                  >
                    View Details
                  </button>
                </div>
              ))
            )
          ) : filteredDoctors.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              No doctors found.
            </p>
          ) : (
            filteredDoctors.map((d) => (
              <div
                key={d.DID}
                className="bg-white shadow-md rounded-xl p-4 flex flex-col items-center text-center relative"
              >
                <span className="absolute top-2 left-2 bg-green-200 text-sm px-2 py-1 rounded">
                  {d.DID}
                </span>

                <img src={logo} alt={d.NAME} className="w-24 h-24 mb-4" />

                <h3 className="text-xl font-bold">{d.NAME}</h3>
                <p className="text-gray-600">{d.SPECIALISATION}</p>

                <button
                  onClick={() => goToHospitalDoctors(d.HID)}
                  className="text-sm underline mt-2"
                >
                  Hospital: {getHospitalName(d.HID)}
                </button>

                <button
                  onClick={() => goToHospitalDoctors(d.HID)}
                  className="mt-4 px-4 py-2 bg-[#3F8EFC] text-white rounded-lg"
                >
                  View Details
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default FindADoctor;
