import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axiosPrivate from "../api/axiosPrivate";

export default function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bookingData, setBookingData] = useState(null);
  const [checkoutData, setCheckoutData] = useState(null);
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("bookingData");

    if (!stored) {
      navigate(`/guides/${id}/availability`);
      return;
    }

    const parsed = JSON.parse(stored);

    if (parsed.guideId !== id) {
      navigate(`/guides/${id}/availability`);
      return;
    }

    setBookingData(parsed);

    fetchGuide();
    calculateCheckout(parsed);
  }, [id]);

  const fetchGuide = async () => {
    try {
      const res = await axiosPrivate.get(`/api/local-guides/${id}`);
      setGuide(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const calculateCheckout = async (data) => {
    try {
      const response = await axiosPrivate.post(
        "/api/checkout/calculate",
        {
          guide_id: data.guideId,
          start_date: data.startDate,
          end_date: data.endDate,
          apply_same_hour: false,
          same_hour: null,
          daily_hours: Object.fromEntries(
            data.scheduledDays.map((d) => [
              d.date,
              parseInt(d.duration)
            ])
          ),
          starting_location: data.startingLocation ?? "Meeting Point",
          end_location: data.endingLocation ?? "City Center",
          promo_code: null,
        }
      );

      console.log(response.data)

      setCheckoutData(response.data);
    } catch (err) {
      console.error(err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const [submitting, setSubmitting] = useState(false);

  const handleSendMessage = async () => {
    if (submitting) return;

    try {
      setSubmitting(true);

      const response = await axiosPrivate.post("/api/checkout", {
        guide_id: bookingData.guideId,
        start_date: bookingData.startDate,
        end_date: bookingData.endDate,

        apply_same_hour: false,
        same_hour: null,

        daily_hours: Object.fromEntries(
          bookingData.scheduledDays.map((d) => [
            d.date,
            {
              duration: parseInt(d.duration),
              start_time: d.startTime,
            },
          ])
        ),


        starting_location:
          bookingData.startingLocation ?? "Meeting Point",

        end_location:
          bookingData.endingLocation ?? "City Center",

        promo_code: null,
      });

      console.log("Checkout success:", response.data);

      localStorage.removeItem("bookingData");

      // Redirect ke chat atau booking detail
      navigate(`/bookings/${response.data.order_id}`);

    } catch (err) {
      console.error(err.response?.data);
    } finally {
      setSubmitting(false);
    }
  };


  const formatPrice = (price) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading || !guide || !checkoutData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading booking details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center">
          <Link
            to={`/guides/${id}/availability`}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back to Availability
          </Link>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">

          {/* GUIDE INFO */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
            <div className="flex items-center gap-4">
              <img
                src={guide.profile_photo_url}
                alt={guide.name}
                className="w-16 h-16 rounded-full object-cover border-4 border-white/20"
              />
              <div>
                <h1 className="text-2xl font-bold">{guide.name}</h1>
                <p className="text-blue-100">{guide.country?.name}</p>
              </div>
            </div>
          </div>

          <div className="p-8">

            <h2 className="text-xl font-bold mb-6">Booking Summary</h2>

            {/* BREAKDOWN */}
            <div className="space-y-4 mb-8">
              {checkoutData.breakdown.map((day, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl p-6 border"
                >
                  <div className="flex justify-between">
                    <div>
                      <div className="font-semibold">
                        {formatDate(day.date)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {day.hours} hours
                      </div>
                    </div>

                    <div className="text-lg font-bold">
                      {formatPrice(day.amount)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* PRICE DETAILS */}
            <div className="border-t pt-6 space-y-3">

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(checkoutData.summary.subtotal)}</span>
              </div>

              <div className="flex justify-between text-green-600">
                <span>Guide Discount</span>
                <span>- {formatPrice(checkoutData.summary.guide_discount)}</span>
              </div>

              <div className="flex justify-between text-green-600">
                <span>Promo Discount</span>
                <span>- {formatPrice(checkoutData.summary.promo_discount)}</span>
              </div>

              <div className="flex justify-between">
                <span>Application Fee</span>
                <span>{formatPrice(checkoutData.pricing.application_fee)}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatPrice(checkoutData.pricing.amount_for_tax)}</span>
              </div>

              <div className="border-t pt-3 flex justify-between text-xl font-bold text-blue-600">
                <span>Total</span>
                <span>{formatPrice(checkoutData.pricing.amount_paid_by_traveller)}</span>
              </div>

            </div>

            {/* NOTICE */}
            <div className="mt-6 p-4 bg-yellow-50 border rounded-xl text-sm">
              You won’t be charged yet. The guide will review your booking
              request first.
            </div>

            {/* Action Button (TETAP SAMA) */}
            <div className="mt-8">
              <button
                onClick={handleSendMessage}
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl text-lg"
              >
                Send a Message
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                By sending a message, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
