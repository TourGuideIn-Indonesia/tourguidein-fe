import { useState } from 'react';
import axios from '../api/axios';

export default function TravellerLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    login: '', // phone or email
    password: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.login.trim()) {
      newErrors.login = 'Phone number or email is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApiErrors = (response) => {
    const message = response?.data?.message || 'Login failed';
    setErrors({ login: message });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await axios.post('/api/login', {
        identifier: formData.login,
        password: formData.password
      });

      if (response.status === 200) {
        const { token } = response.data;

        // simpan token
        localStorage.setItem('token', token);

        // redirect
        window.location.href = '/traveller/dashboard';
      }

    } catch (error) {
      if (error.response) {
        handleApiErrors(error.response);
      } else {
        setErrors({ login: 'Network error. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">
              Sign in to continue your journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Phone or Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number or Email
              </label>
              <input
                type="text"
                name="login"
                value={formData.login}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                placeholder="+62812345678 or email@example.com"
                disabled={isLoading}
              />
              {errors.login && (
                <p className="text-sm text-red-600 mt-1.5">{errors.login}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  tabIndex="-1"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              {errors.password && (
                <p className="text-sm text-red-600 mt-1.5">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white font-bold text-base py-3 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>

          </form>

          {/* Register Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Don’t have an account?{' '}
              <a href="/" className="text-blue-600 font-semibold hover:underline">
                Create Account
              </a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
