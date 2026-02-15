import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

// Dummy guide data
const guideData = {
  1: { 
    name: "Budi Santoso", 
    country: "Indonesia",
    pricePerHour: 150000,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
  },
  2: { 
    name: "Sarah Johnson", 
    country: "United States",
    pricePerHour: 250000,
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face"
  },
  3: { 
    name: "Yuki Tanaka", 
    country: "Japan",
    pricePerHour: 200000,
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face"
  },
  4: { 
    name: "Maria Rodriguez", 
    country: "Spain",
    pricePerHour: 180000,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
  },
  5: { 
    name: "Ahmed Hassan", 
    country: "Egypt",
    pricePerHour: 120000,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face"
  },
  6: { 
    name: "Emma Wilson", 
    country: "United Kingdom",
    pricePerHour: 220000,
    image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop&crop=face"
  }
};

const durationOptions = {
  1: "1 hour",
  2: "2 hours", 
  3: "3 hours",
  4: "4 hours",
  6: "6 hours",
  8: "Full day (8 hours)"
};

export default function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);

  const guide = guideData[id];

  useEffect(() => {
    // Get booking data from localStorage or state management
    const storedBookingData = localStorage.getItem('bookingData');
    if (storedBookingData) {
      const data = JSON.parse(storedBookingData);
      if (data.guideId === id) {
        setBookingData(data);
      } else {
        // Redirect back if data doesn't match
        navigate(`/guides/${id}/availability`);
      }
    } else {
      // Redirect back if no booking data
      navigate(`/guides/${id}/availability`);
    }
    setLoading(false);
  }, [id, navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const calculateDayPrice = (duration) => {
    return guide.pricePerHour * parseInt(duration);
  };

  const calculateSubtotal = () => {
    if (!bookingData?.scheduledDays) return 0;
    return bookingData.scheduledDays.reduce((total, day) => {
      return total + calculateDayPrice(day.duration);
    }, 0);
  };

  const calculateApplicationFee = () => {
    return Math.round(calculateSubtotal() * 0.1); // 10% application fee
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateApplicationFee();
  };

  const handleSendMessage = () => {
    // Here you would typically open a message modal or navigate to messaging
    alert('Message functionality would be implemented here');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!guide || !bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h2>
          <Link to="/guides" className="text-blue-600 hover:text-blue-700 font-medium">
            Back to Guides
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to={`/guides/${id}/availability`} className="flex items-center text-gray-600 hover:text-gray-900">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Availability
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Guide Info */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
            <div className="flex items-center gap-4">
              <img
                src={guide.image}
                alt={guide.name}
                className="w-16 h-16 rounded-full object-cover border-4 border-white/20"
              />
              <div>
                <h1 className="text-2xl font-bold">{guide.name}</h1>
                <p className="text-blue-100">{guide.country}</p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Booking Summary</h2>

            {/* Daily Breakdown */}
            <div className="space-y-4 mb-8">
              {bookingData.scheduledDays.map((day, index) => (
                <div key={day.date} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-grow">
                      <div className="font-semibold text-gray-900 mb-1">
                        {formatDate(day.date)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {day.startTime} • {durationOptions[day.duration]}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {formatPrice(calculateDayPrice(day.duration))}
                      </div>
                      <div className="text-sm text-gray-500">
                        {guide.pricePerHour.toLocaleString('id-ID')} × {day.duration} hours
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Details</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(calculateSubtotal())}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Application Fee</span>
                  <span className="font-medium">{formatPrice(calculateApplicationFee())}</span>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total Amount</span>
                    <span className="text-xl font-bold text-blue-600">{formatPrice(calculateTotal())}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Notice */}
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-yellow-800">Important Notice</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    You won't be charged yet. The guide will review your booking request and confirm availability before any payment is processed.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
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
