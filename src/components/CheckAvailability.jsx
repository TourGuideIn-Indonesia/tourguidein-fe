import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

// Dummy guide data
const guideData = {
  1: { name: "Budi Santoso", timezone: "Asia/Jakarta" },
  2: { name: "Sarah Johnson", timezone: "America/New_York" },
  3: { name: "Yuki Tanaka", timezone: "Asia/Tokyo" },
  4: { name: "Maria Rodriguez", timezone: "Europe/Madrid" },
  5: { name: "Ahmed Hassan", timezone: "Africa/Cairo" },
  6: { name: "Emma Wilson", timezone: "Europe/London" }
};

// Dummy available times
const generateAvailableTimes = () => {
  const times = [];
  for (let hour = 8; hour <= 18; hour++) {
    times.push(`${hour.toString().padStart(2, '0')}:00`);
    times.push(`${hour.toString().padStart(2, '0')}:30`);
  }
  return times;
};

const availableTimes = generateAvailableTimes();

const durationOptions = {
  1: "1 hour",
  2: "2 hours",
  3: "3 hours",
  4: "4 hours",
  6: "6 hours",
  8: "Full day (8 hours)"
};

export default function CheckAvailability() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [days, setDays] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState({});
  const [selectedDurations, setSelectedDurations] = useState({});

  const guide = guideData[id];

  useEffect(() => {
    if (startDate && endDate) {
      generateDays();
    } else {
      setDays([]);
      setSelectedTimes({});
      setSelectedDurations({});
    }
  }, [startDate, endDate]);

  const generateDays = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const daysArray = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      daysArray.push({
        date: dateStr,
        label: `Day ${daysArray.length + 1}`,
        available_start_time: availableTimes,
        available_durations: durationOptions
      });
    }

    setDays(daysArray);
  };

  const handleTimeChange = (date, time) => {
    setSelectedTimes(prev => ({
      ...prev,
      [date]: time
    }));
    
    // Reset duration when time changes
    setSelectedDurations(prev => ({
      ...prev,
      [date]: ''
    }));
  };

  const handleDurationChange = (date, duration) => {
    setSelectedDurations(prev => ({
      ...prev,
      [date]: duration
    }));
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getMinEndDate = () => {
    if (!startDate) return '';
    const start = new Date(startDate);
    return start.toISOString().split('T')[0]; // Allow same day selection
  };

  const getMinStartDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleProceedToBooking = () => {
    // Prepare booking data
    const scheduledDays = days
      .filter(day => selectedTimes[day.date] && selectedDurations[day.date])
      .map(day => ({
        date: day.date,
        startTime: selectedTimes[day.date],
        duration: selectedDurations[day.date]
      }));

    const bookingData = {
      guideId: id,
      guideName: guide.name,
      startDate,
      endDate,
      scheduledDays,
      createdAt: new Date().toISOString()
    };

    // Store booking data in localStorage
    localStorage.setItem('bookingData', JSON.stringify(bookingData));

    // Navigate to checkout
    navigate(`/guides/${id}/checkout`);
  };

  if (!guide) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Guide Not Found</h2>
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
            <Link to={`/guides/${id}`} className="flex items-center text-gray-600 hover:text-gray-900">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Guide Details
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <div className="mb-8">
            <Link 
              to={`/guides/${id}`} 
              className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Guide Details
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Check Availability</h1>
            <p className="text-gray-600 mt-2">Select your preferred dates and times to book {guide.name}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                min={getMinStartDate()}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                End Date <span className="text-red-500">*</span>
              </label>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2.5 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                min={getMinEndDate()}
                disabled={!startDate}
              />
            </div>
          </div>

          {days.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Booking Schedule</h2>
              <div className="space-y-4">
                {days.map((day, index) => (
                  <div key={day.date} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                      {/* Day and Date */}
                      <div className="lg:col-span-4">
                        <div className="font-semibold text-gray-900 mb-1">{day.label}</div>
                        <div className="text-sm text-gray-600">{formatDate(day.date)}</div>
                      </div>

                      {/* Time Selection */}
                      <div className="lg:col-span-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Start Time
                        </label>
                        <select 
                          value={selectedTimes[day.date] || ''}
                          onChange={(e) => handleTimeChange(day.date, e.target.value)}
                          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        >
                          <option value="">Select Time</option>
                          {day.available_start_time.map((time) => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>

                      {/* Duration Selection */}
                      <div className="lg:col-span-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Duration
                        </label>
                        <select 
                          value={selectedDurations[day.date] || ''}
                          onChange={(e) => handleDurationChange(day.date, e.target.value)}
                          disabled={!selectedTimes[day.date]}
                          className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                            !selectedTimes[day.date] 
                              ? 'border-gray-200 bg-gray-100 cursor-not-allowed' 
                              : 'border-gray-300'
                          }`}
                        >
                          <option value="">Select Duration</option>
                          {Object.entries(day.available_durations).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Status Indicator */}
                    {selectedTimes[day.date] && selectedDurations[day.date] && (
                      <div className="mt-4 flex items-center text-green-600 text-sm">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Scheduled for {selectedTimes[day.date]} ({durationOptions[selectedDurations[day.date]]})
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {days.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">
                    {Object.keys(selectedTimes).filter(date => selectedTimes[date] && selectedDurations[date]).length} of {days.length} days scheduled
                  </span>
                </div>
                <button 
                  onClick={handleProceedToBooking}
                  className="w-full sm:w-auto bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  disabled={Object.keys(selectedTimes).filter(date => selectedTimes[date] && selectedDurations[date]).length === 0}
                >
                  Proceed to Booking
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
