import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import UserHome from "./pages/UserHome";
import FindADoctor from "./pages/FindADoctor";
import Admin from "./pages/Admin";
import Doctors from "./pages/Doctors";
import Login from "./pages/Login";
import Appointment from "./pages/Appointment";
import Cart from "./pages/Cart";
import PatientProfile from "./pages/PatientProfile";
import DoctorProfile from "./pages/DoctorProfile";
import CreateNewUser from "./pages/CreateNewUser";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserHome />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<CreateNewUser />} />


        {/* Role-specific profiles */}
        <Route path="/patient-profile" element={<PatientProfile />} />
        <Route path="/doctor-profile" element={<DoctorProfile />} />

        {/* Other pages */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/findadoctor" element={<FindADoctor />} />
        <Route path="/doctors/:hid" element={<Doctors />} />
        <Route path="/appointment/:hid" element={<Appointment />} />

        {/* Redirect /profile to role-specific profile */}
        <Route
          path="/profile"
          element={
            sessionStorage.getItem("isLoggedIn") === "true"
              ? JSON.parse(sessionStorage.getItem("user")).role === "doctor"
                ? <Navigate to="/doctor-profile" />
                : <Navigate to="/patient-profile" />
              : <Navigate to="/login" />
          }
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
