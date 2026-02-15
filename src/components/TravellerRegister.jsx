import { useState } from 'react';
import axios from '../api/axios';

export default function TravellerRegister() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Step 1 fields
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    email: '',
    password: '',
    password_confirmation: ''
  });

  const [errors, setErrors] = useState({});

  // Step 2 fields
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form locally
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Phone number is required';
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Invalid phone number format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle API errors
  const handleApiErrors = (response) => {
    const data = response.data;
    const apiErrors = data?.errors || {};
    const message = data?.message;

    if (Object.keys(apiErrors).length > 0) {
      const mappedErrors = {};
      Object.keys(apiErrors).forEach(field => {
        // Map API field 'phone' to form field 'phone_number'
        const key = field === 'phone' ? 'phone_number' : field;
        mappedErrors[key] = apiErrors[field][0];
      });
      setErrors(mappedErrors);
    } else if (message) {
      setErrors({ phone_number: message });
    } else {
      setErrors({ phone_number: 'Server error. Please try again later.' });
    }
  };

  // Submit Step 1
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await axios.post('/api/register-request', {
        phone: formData.phone_number,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation
      });

      if (response.status === 200 || response.status === 201) {
        setCurrentStep(2);
        setOtpError('');
      }
    } catch (error) {
      if (error.response) {
        handleApiErrors(error.response);
      } else {
        setErrors({ phone_number: 'Network error. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // OTP Input handling
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError('');

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }

    // Auto-submit when all filled
    if (index === 5 && value) {
      const otpCode = newOtp.join('');
      if (otpCode.length === 6) {
        setTimeout(() => verifyOTP(otpCode), 100);
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pasteData)) return;

    const newOtp = [...otp];
    for (let i = 0; i < pasteData.length && i < 6; i++) {
      newOtp[i] = pasteData[i];
    }
    setOtp(newOtp);

    const lastIndex = Math.min(pasteData.length, 5);
    const lastInput = document.getElementById(`otp-${lastIndex}`);
    if (lastInput) lastInput.focus();

    if (pasteData.length === 6) {
      setTimeout(() => verifyOTP(pasteData), 100);
    }
  };

  // Verify OTP
  const verifyOTP = async (otpCode = null) => {
    const code = otpCode || otp.join('');
    
    if (code.length < 6) {
      setOtpError('Please enter the full 6-digit code.');
      return;
    }

    setIsLoading(true);
    setOtpError('');

    try {
      const response = await axios.post('/api/register-confirm', {
        phone: formData.phone_number,
        otp: code
      });

      if (response.status === 200 || response.status === 201) {
        // Redirect to dashboard
        window.location.href = '/traveller/dashboard';
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Invalid verification code.';
      setOtpError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const resendOTP = async () => {
    setIsLoading(true);
    setOtpError('');

    try {
      await axios.post('/api/register-request', {
        phone: formData.phone_number,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation
      });
      
      // Show success message
      setOtpError('');
      alert('Verification code resent!');
    } catch (error) {
      setOtpError('Failed to resend code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Go back to Step 1
  const goBack = () => {
    setCurrentStep(1);
    setOtp(['', '', '', '', '', '']);
    setOtpError('');
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        
        {/* Step 1: Registration Form */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
              <p className="text-gray-600">Join our community of travelers</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                  placeholder="John Doe"
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1.5">{errors.name}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                  placeholder="+62812345678"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-1.5">
                  We'll send a verification code to this number
                </p>
                {errors.phone_number && (
                  <p className="text-sm text-red-600 mt-1.5">{errors.phone_number}</p>
                )}
              </div>

              {/* Email (Optional) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address <span className="text-gray-500 text-xs">(Optional)</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                  placeholder="john@example.com"
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1.5">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 pr-12 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    tabIndex="-1"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 mt-1.5">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                {errors.password_confirmation && (
                  <p className="text-sm text-red-600 mt-1.5">{errors.password_confirmation}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white font-bold text-base py-3 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </form>

            {/* Sign In Link */}
            <div className="text-center mt-6">
              <p className="text-gray-600">
                Already have an account?{' '}
                <a href="/traveller/login" className="text-blue-600 font-semibold hover:underline">
                  Sign in
                </a>
              </p>
            </div>
          </div>
        )}

        {/* Step 2: OTP Verification */}
        {currentStep === 2 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Number</h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Enter the 6-digit code sent to<br />
                <span className="font-semibold text-gray-900">{formData.phone_number}</span>
              </p>
            </div>

            {/* OTP Inputs */}
            <div className="flex justify-center gap-1.5 sm:gap-2 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onPaste={index === 0 ? handleOtpPaste : undefined}
                  className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                    otpError ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                  }`}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  disabled={isLoading}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {/* OTP Error */}
            {otpError && (
              <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-3 flex items-start gap-2">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-700 font-medium">{otpError}</p>
              </div>
            )}

            {/* Verify Button */}
            <button
              onClick={() => verifyOTP()}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-bold text-base py-3 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-6 shadow-lg hover:shadow-xl"
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </button>

            {/* Actions */}
            <div className="text-center space-y-3">
              <button
                onClick={resendOTP}
                disabled={isLoading}
                className="text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors disabled:opacity-50"
              >
                Resend Code
              </button>
              <div className="border-t border-gray-200 pt-3">
                <button
                  onClick={goBack}
                  disabled={isLoading}
                  className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors"
                >
                  Change Phone Number
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}