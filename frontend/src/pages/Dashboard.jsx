import React from "react";
import doctorImg from "../assets/images/doctor.png";

const Dashboard = () => {
  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-[#F4F6F8] to-[#E0F7FA] px-4 py-10 sm:px-10 flex flex-col lg:flex-row items-center justify-between relative overflow-hidden">
      
      {/* Left Content */}
      <div className="max-w-xl text-center lg:text-left z-10">
        <p className="text-sm text-[#30C48D] font-medium uppercase mb-3 tracking-wide">
          Welcome to Book My Appointment Services
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-[#333333] leading-tight mb-4">
          No Compromise <br /> When It Comes to <br /> Your Well-being
        </h1>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Connecting you to Trusted Doctors, Empowering <br /> Your Health Choices.
        </p>

      </div>

      {/* Right Image and Floating Cards */}
      <div className="relative mt-10 lg:mt-0 z-10">
        <div className="w-80 h-80 mx-auto rounded-full overflow-hidden border-4 border-white shadow-2xl hover:scale-105 transition-transform duration-500">
          <img
            src={doctorImg}
            alt="Doctor"
            className="w-full h-full object-cover object-top"
          />
        </div>

        {/* Floating Badge */}
        <div className="absolute top-4 right-[-30px] animate-bounce bg-white border border-[#E2E8F0] rounded-full px-4 py-1 shadow-md">
          <p className="text-sm font-semibold text-[#30C48D]">Skyler Ruby</p>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white/90 shadow-lg backdrop-blur-md rounded-xl p-6 z-0">
        {[
          { label: "Best Doctor", value: 90 },
          { label: "Patient Capacity", value: "1500+" },
          { label: "Availability", value: "24 Hours" },
          { label: "Clinic Location", value: 15 },
        ].map(({ label, value }) => (
          <div key={label} className="text-center">
            <p className="text-2xl font-bold text-[#333333]">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Dashboard;
