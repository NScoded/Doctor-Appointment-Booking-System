import React, { useEffect, useState } from "react";
import Header from "./Header";
import axios from "axios";
const API=import.meta.env.VITE_API_URL;

const Cart = ({ showHeader = true }) => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user || !user.pid) return;

    try {
      const res = await axios.get(`${API}/cart/${user.pid}`);
      setCart(res.data);

      const sum = res.data.reduce((acc, doc) => acc + (Number(doc.FEES) || 0), 0);
      setTotal(sum);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const handleRemove = async (cid) => {
    try {
      await axios.delete(`${API}/cart/${cid}`);
      loadCart(); // refresh cart
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

 const handleCheckout = async () => {
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  const user = JSON.parse(sessionStorage.getItem("user"));

  if (!user || !user.pid) {
    alert("You must be logged in as a patient to book appointments.");
    return;
  }

  setLoading(true);

  try {
    const today = new Date().toISOString().split("T")[0];

    for (let doc of cart) {
      await axios.post(`${API}/appointments`, {
        pid: user.pid,
        did: doc.DID,
        hid: doc.HID,
        appointment_date: today,
      });
    }

    await axios.delete(`${API}/cart/clear/${user.pid}`);

    alert("✅ Your appointments have been confirmed!");
    setCart([]);
    setTotal(0);

  } catch (error) {
    console.error("Error booking appointments:", error);
    alert("❌ Something went wrong while booking.");
  }

  setLoading(false);
};


  return (
    <>
      {showHeader && <Header />}
      <div className="min-h-screen bg-[#F4F6F8] px-4 py-10">
        <h2 className="text-2xl font-bold text-[#333] mb-6">Appointment Cart</h2>

        {cart.length === 0 ? (
          <p className="text-gray-600 italic">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cart.map((doc) => (
              <div
                key={doc.DID}
                className="p-4 border rounded-md shadow-sm bg-white flex justify-between items-center"
              >
                <div>
                  <h4 className="text-lg font-semibold text-[#333]">{doc.NAME}</h4>
                  <p className="text-sm text-gray-600">
                    Specialisation: <span className="text-red-600">{doc.SPECIALISATION}</span>
                  </p>
                  <p className="text-sm text-gray-600">Degree: {doc.DEGREE}</p>
                  <p className="text-sm text-gray-600">Institute: {doc.INSTITUTE}</p>
                  <p className="text-sm text-gray-600">Phone: {doc.PHONE}</p>
                  <p className="text-sm text-gray-600">Fees: ₹{doc.FEES}</p>
                </div>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                  onClick={() => handleRemove(doc.CID)}
                >
                  Remove
                </button>
              </div>
            ))}

            <div className="bg-white p-4 rounded-md shadow-md mt-6">
              <h3 className="text-lg font-bold text-[#333]">Total Fees: ₹{total}</h3>
              <button
                className="mt-4 bg-[#30C48D] hover:bg-[#2aad7d] text-white px-6 py-2 rounded-lg"
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? "Booking..." : "Confirm Your Appointment"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
