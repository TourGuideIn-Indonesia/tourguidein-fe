import React, { useEffect, useState } from "react";
import axiosPrivate from "../api/axiosPrivate";
import { useNavigate } from "react-router-dom";

function Bookings() {
  const token = localStorage.getItem("token");
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    const fetchBookings = async () => {
      try {
        const res = await axiosPrivate.get("/api/booking");
        setBookings(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBookings();
  }, [token]);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Bookings</h1>
          <p className="text-gray-600">
            Your tour bookings will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

      {bookings.length === 0 && (
        <p className="text-gray-500">No bookings yet.</p>
      )}

      <div className="space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            onClick={() => navigate(`/bookings/${booking.id}`)}
            className="bg-white p-4 rounded-xl shadow cursor-pointer hover:bg-gray-100"
          >
            <p className="font-semibold">
              {booking.country} - {booking.city}
            </p>

            <p className="text-sm text-gray-600">
              {booking.period.start_date} - {booking.period.end_date}
            </p>

            <p className="text-sm">
              Guide: {booking.tour_guide?.name}
            </p>

            <p className="text-sm font-semibold capitalize">
              Status: {booking.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Bookings;
