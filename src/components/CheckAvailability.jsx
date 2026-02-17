import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosPrivate from '../api/axiosPrivate';

export default function CheckAvailability() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [days, setDays] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState({});
  const [selectedDurations, setSelectedDurations] = useState({});
  const [availableStartDate, setAvailableStartDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchingOptions, setFetchingOptions] = useState(false);
  const [guide, setGuide] = useState(null);

  useEffect(() => {
    fetchGuide();
    fetchAvailableStartDate();
  }, [id]);

  const fetchGuide = async () => {
    try {
      const response = await axiosPrivate.get(`/api/local-guides/${id}`);
      setGuide(response.data);
    } catch (error) {
      console.error('Error fetching guide:', error);
    }
  };

  const fetchAvailableStartDate = async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.get(`/api/local-guides/${id}/available-start-date`);
      setAvailableStartDate(response.data.available_start_date);
    } catch (error) {
      console.error('Error fetching available start date:', error);
      const today = new Date();
      setAvailableStartDate(today.toISOString().split('T')[0]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingOptions = async (timesToSend = {}) => {
    if (!startDate || !endDate) {
      setDays([]);
      return;
    }

    try {
      setFetchingOptions(true);
      const response = await axiosPrivate.get(`/api/local-guides/${id}/available-times`, {
        params: {
          start_date: startDate,
          end_date: endDate,
          selected_times: timesToSend
        },
        paramsSerializer: {
          indexes: null,
        }
      });

      setDays(response.data.days);
    } catch (error) {
      console.error('Error fetching booking options:', error);
    } finally {
      setFetchingOptions(false);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchBookingOptions({});
    } else {
      setDays([]);
    }
  }, [startDate, endDate]);

  const handleStartDateChange = (newStartDate) => {
    setStartDate(newStartDate);
    setSelectedTimes({});
    setSelectedDurations({});

    if (endDate && endDate < newStartDate) {
      setEndDate('');
    }
  };

  const handleEndDateChange = (newEndDate) => {
    setEndDate(newEndDate);
    setSelectedTimes({});
    setSelectedDurations({});
  };

  const handleTimeChange = (date, time) => {
    const newSelectedTimes = { ...selectedTimes };
    if (time) {
      newSelectedTimes[date] = time;
    } else {
      delete newSelectedTimes[date];
    }
    setSelectedTimes(newSelectedTimes);

    setSelectedDurations(prev => {
      const newDurations = { ...prev };
      if (!time) {
        delete newDurations[date];
      } else {
        newDurations[date] = '';
      }
      return newDurations;
    });

    fetchBookingOptions(newSelectedTimes);
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
    return startDate || '';
  };

  const getMinStartDate = () => {
    if (availableStartDate) {
      return availableStartDate;
    }
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleProceedToBooking = () => {
    const scheduledDays = days
      .filter(day => day.is_available && selectedTimes[day.date] && selectedDurations[day.date])
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

    localStorage.setItem('bookingData', JSON.stringify(bookingData));
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
                onChange={(e) => handleStartDateChange(e.target.value)}
                className="w-full px-4 py-2.5 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                min={getMinStartDate()}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => handleEndDateChange(e.target.value)}
                className="w-full px-4 py-2.5 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                min={getMinEndDate()}
                disabled={!startDate}
              />
            </div>
          </div>

          {fetchingOptions && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading available times...</p>
            </div>
          )}

          {!fetchingOptions && days.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Booking Schedule</h2>
              <div className="space-y-4">
                {days.map((day) => (
                  <div 
                    key={day.date} 
                    className={`rounded-xl p-6 border ${
                      day.is_available 
                        ? 'bg-gray-50 border-gray-200' 
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                      {/* Day and Date */}
                      <div className="lg:col-span-4">
                        <div className="font-semibold text-gray-900 mb-1">{day.label}</div>
                        <div className="text-sm text-gray-600">{formatDate(day.date)}</div>
                        {!day.is_available && (
                          <div className="mt-2 flex items-start text-red-600 text-xs">
                            <svg className="w-4 h-4 mr-1 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span>{day.unavailable_reason}</span>
                          </div>
                        )}
                      </div>

                      {/* Time Selection */}
                      <div className="lg:col-span-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Start Time
                        </label>
                        <select
                          value={selectedTimes[day.date] || ''}
                          onChange={(e) => handleTimeChange(day.date, e.target.value)}
                          disabled={!day.is_available}
                          className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                            !day.is_available
                              ? 'border-red-200 bg-red-50 cursor-not-allowed text-gray-400'
                              : 'border-gray-300'
                          }`}
                        >
                          <option value="">
                            {day.is_available ? 'Select Time' : 'Not Available'}
                          </option>
                          {day.is_available && day.available_start_time.map((time) => (
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
                          disabled={!day.is_available || !selectedTimes[day.date]}
                          className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                            !day.is_available || !selectedTimes[day.date]
                              ? 'border-gray-200 bg-gray-100 cursor-not-allowed'
                              : 'border-gray-300'
                          }`}
                        >
                          <option value="">Select Duration</option>
                          {day.is_available && Object.entries(day.available_durations).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Status Indicator */}
                    {day.is_available && selectedTimes[day.date] && selectedDurations[day.date] && (
                      <div className="mt-4 flex items-center text-green-600 text-sm">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Scheduled for {selectedTimes[day.date]} ({day.available_durations[selectedDurations[day.date]]})
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!fetchingOptions && days.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">
                    {days.filter(day => day.is_available && selectedTimes[day.date] && selectedDurations[day.date]).length} of {days.filter(day => day.is_available).length} available days scheduled
                  </span>
                </div>
                <button
                  onClick={handleProceedToBooking}
                  className="w-full sm:w-auto bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  disabled={days.filter(day => day.is_available && selectedTimes[day.date] && selectedDurations[day.date]).length === 0}
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