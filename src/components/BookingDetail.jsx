import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosPrivate from "../api/axiosPrivate";
import { loadMidtransSnap } from "../utils/loadMidtrans";

function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [activeTab, setActiveTab] = useState("payment");
  const [reviewForm, setReviewForm] = useState({
    stars: 5,
    review_text: "",
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
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

    if (orderStatus === "accepted") return 1;

    if (orderStatus !== "completed" && transactionStatus === "settlement") return 2;

    if (orderStatus === "on_going") return 3;

    if (orderStatus === "completed" && booking.is_traveller_complete == false) return 4;
    if (booking.is_traveller_complete == true) return 5;

    return 0;
  };

  const currentStep = getCurrentStep();

  const handleCancelBooking = async () => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await axiosPrivate.patch(`/api/booking/${id}`, {
        action: "cancel",
      });

      alert("Booking cancelled");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to cancel booking");
    }
  };

  const handleMakePayment = async () => {
    try {
      // 1. Pastikan Snap JS sudah ada
      await loadMidtransSnap();

      // 2. Request ke backend
      const res = await axiosPrivate.post("/api/booking", {
        order_id: booking.id,
      });

      const snap = res.data.data.snap;

      if (!snap?.snap_token) {
        throw new Error("Snap token not found");
      }

      // 3. Open Snap popup
      window.snap.pay(snap.snap_token, {
        onSuccess: function (result) {
          console.log("Payment success", result);
          window.location.reload();
        },
        onPending: function (result) {
          console.log("Payment pending", result);
          alert("Waiting for payment");
        },
        onError: function (result) {
          console.error("Payment error", result);
          alert("Payment failed");
        },
        onClose: function () {
          console.log("Snap closed");
        },
      });
    } catch (error) {
      console.error(error);
      alert("Failed to initiate payment");
    }
  };

  const handleCompleteOrder = async () => {
    if (!window.confirm("Are you sure you want to complete this order?")) return;

    try {
      await axiosPrivate.patch(`/api/booking/${id}`, {
        action: "complete",
      });

      alert("Order completed successfully");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to complete order");
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewForm.stars) {
      alert("Rating wajib diisi");
      return;
    }

    setIsSubmittingReview(true);

    try {
      await axiosPrivate.post("/api/post-reviews", {
        object_id: booking.id,
        object_type: "App\\Models\\Order", // SESUAI BACKEND
        stars: reviewForm.stars,
        review_text: reviewForm.review_text,
      });

      alert("Review berhasil dikirim");

      // refresh booking biar step jadi "Review Given"
      const res = await axiosPrivate.get(`/api/booking/${id}`);
      setBooking(res.data.data);

      setActiveTab("detail");
    } catch (err) {
      console.error(err);
      alert("Gagal mengirim review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

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
        <div className="flex justify-end gap-3">
          {/* Chat */}
          <button
            onClick={() => navigate(`/chat/${booking.id}`)}
            className="bg-black text-white px-6 py-3 rounded-xl hover:opacity-90"
          >
            Chat Say Hi!
          </button>

          {/* Complete Order */}
          {booking.status.order_status === "completed" && (
            <button
              onClick={handleCompleteOrder}
              className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700"
            >
              Selesaikan Order
            </button>
          )}
        </div>

        {/* ===== Tabs ===== */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex gap-6 border-b pb-4 mb-6">
            {["payment", "detail", "extra", "review"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`capitalize ${activeTab === tab
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
            <div className="space-y-4 text-sm">

              <div className="space-y-1">
                <p>Total: Rp {booking.price.amount_paid_by_traveller}</p>
                <p>Application Fee: Rp {booking.price.application_fee}</p>
                <p>Marketplace Fee: Rp {booking.price.marketplace_fee}</p>
                <p>Status: {booking.status.transaction_status}</p>
              </div>

              {/* ===== Action Buttons ===== */}
              <div className="flex gap-3 pt-4">

                {/* Cancel Booking */}
                {["pending", "accepted", "paid"].includes(booking.status.order_status) && (
                  <button
                    onClick={handleCancelBooking}
                    className="px-5 py-2 rounded-xl border border-red-500 text-red-500 hover:bg-red-50"
                  >
                    Cancel Booking
                  </button>
                )}

                {/* Make Payment */}
                {booking.status.transaction_status !== "settlement" &&
                  booking.status.order_status === "accepted" && (
                    <button
                      onClick={handleMakePayment}
                      className="px-5 py-2 rounded-xl bg-black text-white hover:opacity-90"
                    >
                      Make a Payment
                    </button>
                  )}
              </div>
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
          {/* ===== Extra Tab ===== */}
          {activeTab === "extra" && (
            <div className="space-y-4 text-sm">

              {(!booking.extra_orders || booking.extra_orders.length === 0) && (
                <p className="text-gray-500">No extra services added</p>
              )}

              {booking.extra_orders?.map((extra) => (
                <div
                  key={extra.id}
                  onClick={() => navigate(`/bookings/extras/${extra.id}`)}
                  className="border p-4 rounded-xl cursor-pointer hover:bg-gray-50 transition"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">
                        {extra.type.replace("_", " ").toUpperCase()}
                      </p>

                      <p className="text-xs text-gray-500">
                        {extra.detail?.description ?? "-"}
                      </p>
                    </div>

                    <span className="text-sm font-semibold">
                      Rp {extra.price.amount_paid_by_traveller}
                    </span>
                  </div>

                  <p className="text-xs mt-2 text-gray-500">
                    Status: {extra.status.transaction_status}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "review" && (
            <div className="space-y-6 max-w-md">

              {/* Rating */}
              <div>
                <p className="font-semibold mb-2">Rating</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() =>
                        setReviewForm({ ...reviewForm, stars: star })
                      }
                      className={`w-10 h-10 rounded-full border
              ${reviewForm.stars >= star
                          ? "bg-yellow-400 border-yellow-400"
                          : "bg-white"
                        }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div>
                <p className="font-semibold mb-2">Comment (optional)</p>
                <textarea
                  rows={4}
                  value={reviewForm.review_text}
                  onChange={(e) =>
                    setReviewForm({
                      ...reviewForm,
                      review_text: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg p-3"
                  placeholder="Share your experience..."
                />
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmitReview}
                disabled={isSubmittingReview}
                className="bg-black text-white px-6 py-3 rounded-xl disabled:opacity-50"
              >
                {isSubmittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default BookingDetail;
