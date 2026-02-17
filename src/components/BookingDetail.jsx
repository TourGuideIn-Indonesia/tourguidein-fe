import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosPrivate from "../api/axiosPrivate";

function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [activeTab, setActiveTab] = useState("payment");

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axiosPrivate.get(`/api/booking/${id}`);
        console.log(res);
        setBooking(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBooking();
  }, [id]);

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading booking...
      </div>
    );
  }

  const steps = [
    "Waiting for Guide",
    "Accepted",
    "Order Paid",
    "On Going",
    "Completed",
    "Review Given",
  ];

  const getCurrentStep = () => {
    const orderStatus = booking.status.order_status;
    const transactionStatus = booking.status.transaction_status;

    if (orderStatus === "pending") return 0;
    if (orderStatus === "accepted" && transactionStatus !== "paid") return 1;
    if (transactionStatus === "paid" && orderStatus !== "ongoing") return 2;
    if (orderStatus === "ongoing") return 3;
    if (orderStatus === "completed" && booking.reviews.length === 0) return 4;
    if (booking.reviews.length > 0) return 5;

    return 0;
  };

  const currentStep = getCurrentStep();

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* ===== Progress Timeline ===== */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex-1 text-center">
                <div
                  className={`h-8 w-8 mx-auto rounded-full flex items-center justify-center text-sm font-semibold
                    ${index <= currentStep ? "bg-black text-white" : "bg-gray-200 text-gray-500"}
                  `}
                >
                  {index + 1}
                </div>
                <p className="mt-2 text-xs">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ===== Order Summary ===== */}
        <div className="bg-white p-6 rounded-2xl shadow space-y-4">
          <h2 className="text-xl font-bold">Order Summary</h2>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Country</p>
              <p className="font-semibold">{booking.location.country}</p>
            </div>

            <div>
              <p className="text-gray-500">City</p>
              <p className="font-semibold">{booking.location.city}</p>
            </div>

            <div>
              <p className="text-gray-500">Period</p>
              <p className="font-semibold">
                {booking.schedule.start_date} - {booking.schedule.end_date}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Duration</p>
              <p className="font-semibold">
                {booking.schedule.duration} hours
              </p>
            </div>

            <div>
              <p className="text-gray-500">Order Code</p>
              <p className="font-semibold">{booking.order_number}</p>
            </div>

            <div>
              <p className="text-gray-500">Total Paid</p>
              <p className="font-semibold">
                Rp {booking.price.amount_paid_by_traveller}
              </p>
            </div>
          </div>
        </div>

        {/* ===== Chat Button ===== */}
        {booking.status.order_status !== "completed" && (
          <div className="text-right">
            <button
              onClick={() => navigate(`/chat/${booking.id}`)}
              className="bg-black text-white px-6 py-3 rounded-xl hover:opacity-90"
            >
              Chat Say Hi!
            </button>
          </div>
        )}

        {/* ===== Tabs ===== */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex gap-6 border-b pb-4 mb-6">
            {["payment", "detail", "extra"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`capitalize ${
                  activeTab === tab
                    ? "font-bold border-b-2 border-black pb-2"
                    : "text-gray-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ===== Payment Tab ===== */}
          {activeTab === "payment" && (
            <div className="space-y-3 text-sm">
              <p>Total: Rp {booking.price.amount_paid_by_traveller}</p>
              <p>Application Fee: Rp {booking.price.application_fee}</p>
              <p>Marketplace Fee: Rp {booking.price.marketplace_fee}</p>
              <p>Status: {booking.status.transaction_status}</p>
            </div>
          )}

          {/* ===== Detail Tab ===== */}
          {activeTab === "detail" && (
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-gray-500">Starting Location</p>
                <p>{booking.route.starting_location}</p>
              </div>

              <div>
                <p className="text-gray-500">End Location</p>
                <p>{booking.route.end_location}</p>
              </div>

              <div>
                <p className="text-gray-500">Tour Guide</p>
                <p className="font-semibold">{booking.tour_guide.name}</p>
                <p>Languages: {booking.tour_guide.languages?.join(", ")}</p>
              </div>
            </div>
          )}

          {/* ===== Extra Tab ===== */}
          {activeTab === "extra" && (
            <div className="space-y-4 text-sm">
              {booking.extra_orders?.length === 0 && (
                <p>No extra services added</p>
              )}

              {booking.extra_orders?.map((extra) => (
                <div
                  key={extra.id}
                  className="border p-4 rounded-xl space-y-2"
                >
                  <p className="font-semibold">{extra.type}</p>
                  <p>{extra.detail.description}</p>
                  <p>Qty: {extra.detail.qty}</p>
                  <p>Total: Rp {extra.price.amount_paid_by_traveller}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default BookingDetail;
