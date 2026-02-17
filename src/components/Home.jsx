import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, MapPin, Package, Car, Users2, Plane, Search, ArrowLeft } from 'lucide-react'
import { useEffect } from 'react';
import axios from "../api/axios";

function Home() {
  const [showTourGuideSearch, setShowTourGuideSearch] = useState(false)

  const [countries, setCountries] = useState([])
  const [cities, setCities] = useState([])

  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const services = [
    {
      title: 'Tour Guides',
      icon: Users,
      available: true,
      link: '/guides'
    },
    {
      title: 'Local Experiences',
      icon: MapPin,
      available: false
    },
    {
      title: 'Package Tours',
      icon: Package,
      available: false
    },
  ]

  useEffect(() => {
    fetchCountries()
  }, [])

  const fetchCountries = async () => {
    try {
      const res = await axios.get('/api/available-countries')
      setCountries(res.data.data)
    } catch (err) {
      console.error('Failed to fetch countries', err)
    }
  }

  const fetchCities = async (countryId) => {
    try {
      const res = await axios.get(`/api/available-cities/${countryId}`)
      setCities(res.data.data)
    } catch (err) {
      console.error('Failed to fetch cities', err)
    }
  }

  const handleCountryChange = (e) => {
    const countryId = e.target.value
    setSelectedCountry(countryId)
    setSelectedCity('')
    setCities([])

    if (countryId) {
      fetchCities(countryId)
    }
  }

  const handleSearch = () => {
    const params = new URLSearchParams({
      country_id: selectedCountry,
      city_id: selectedCity,
      date: selectedDate
    }).toString()

    window.location.href = `/guides?${params}`
  }

  const handleTourGuideClick = (e) => {
    e.preventDefault()
    setShowTourGuideSearch(true)
  }

  const handleSeeOtherServices = () => {
    setShowTourGuideSearch(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">TourGuideIn Indonesia</h1>
          <p className="text-lg text-gray-600">Discover Indonesia with our services</p>
        </div>

        {/* Tour Guide Search Section */}
        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showTourGuideSearch ? 'max-h-96 opacity-100 mb-8' : 'max-h-0 opacity-0'
          }`}>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <button
                onClick={handleSeeOtherServices}
                className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                See other services
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <select
                  value={selectedCountry}
                  onChange={handleCountryChange}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  disabled={!selectedCountry}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className={`transition-all duration-500 ease-in-out ${showTourGuideSearch ? 'opacity-30 scale-95' : 'opacity-100 scale-100'
          }`}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {services.map((service, index) => {
              const IconComponent = service.icon
              const content = (
                <div className={`p-6 rounded-lg border-2 transition-all duration-200 aspect-square flex flex-col items-center justify-center ${service.available
                  ? showTourGuideSearch && service.title === 'Tour Guides'
                    ? 'bg-blue-50 border-blue-500 shadow-lg scale-105'
                    : 'bg-white border-blue-200 hover:border-blue-400 hover:shadow-lg cursor-pointer'
                  : 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-75'
                  } ${showTourGuideSearch && service.title !== 'Tour Guides' ? 'pointer-events-none' : ''}`}>
                  <IconComponent className={`w-8 h-8 mb-3 ${service.available
                    ? showTourGuideSearch && service.title === 'Tour Guides'
                      ? 'text-blue-700'
                      : 'text-blue-600'
                    : 'text-gray-400'
                    }`} />
                  <h3 className={`text-sm font-medium text-center ${showTourGuideSearch && service.title === 'Tour Guides'
                    ? 'text-blue-900'
                    : 'text-gray-900'
                    }`}>
                    {service.title}
                  </h3>
                  {!service.available && (
                    <span className="mt-2 px-2 py-1 bg-gray-200 text-gray-600 text-xs font-medium rounded-full">
                      Coming Soon
                    </span>
                  )}
                  {showTourGuideSearch && service.title === 'Tour Guides' && (
                    <span className="mt-2 px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                      Selected
                    </span>
                  )}
                </div>
              )

              return service.title === 'Tour Guides' ? (
                <div key={index} onClick={handleTourGuideClick}>
                  {content}
                </div>
              ) : service.available ? (
                <Link key={index} to={service.link}>
                  {content}
                </Link>
              ) : (
                <div key={index}>
                  {content}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
