import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Users, MapPin, Package, ArrowLeft, Globe, Building2 } from 'lucide-react'
import axios from "../api/axios";

function Home() {
  const [showTourGuideSearch, setShowTourGuideSearch] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const debounceRef = useRef(null)
  const dropdownRef = useRef(null)

  const services = [
    { title: 'Tour Guides', icon: Users, available: true, link: '/guides' },
    { title: 'Local Experiences', icon: MapPin, available: false },
    { title: 'Package Tours', icon: Package, available: false },
  ]

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      setShowDropdown(false)
      return
    }

    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setIsSearching(true)
      try {
        const res = await axios.get('/api/locations', { params: { search: query } })
        setResults(res.data)
        setShowDropdown(true)
      } catch (err) {
        console.error('Failed to fetch locations', err)
      } finally {
        setIsSearching(false)
      }
    }, 300)

    return () => clearTimeout(debounceRef.current)
  }, [query])

  const handleSelectLocation = (location) => {
    setSelectedLocation(location)
    setQuery(location.value)
    setShowDropdown(false)
    setResults([])
  }

  const handleSearch = () => {
    if (!selectedLocation) return

    const params = new URLSearchParams({
      ...(selectedLocation.type === 'country' && { country_id: selectedLocation.id }),
      ...(selectedLocation.type === 'city' && { city_id: selectedLocation.id }),
    }).toString()

    window.location.href = `/guides?${params}`
  }

  const handleTourGuideClick = (e) => {
    e.preventDefault()
    setShowTourGuideSearch(true)
  }

  const handleSeeOtherServices = () => {
    setShowTourGuideSearch(false)
    setQuery('')
    setSelectedLocation(null)
    setResults([])
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">TourGuideIn Indonesia</h1>
          <p className="text-lg text-gray-600">Discover Indonesia with our services</p>
        </div>

        {/* Tour Guide Search Section */}
        <div className={`transition-all duration-500 ease-in-out ${showTourGuideSearch ? 'max-h-96 opacity-100 mb-8' : 'max-h-0 opacity-0 overflow-hidden'}`}>          <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-4">
            <button
              onClick={handleSeeOtherServices}
              className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              See other services
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Location Search */}
            <div className="md:col-span-1 relative" ref={dropdownRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country or City
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setSelectedLocation(null)
                  }}
                  placeholder="e.g. Indonesia, Jakarta..."
                  className="w-full px-4 py-2 border rounded-lg pr-8 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {isSearching && (
                  <div className="absolute right-3 top-2.5">
                    <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              {/* Dropdown */}
              {showDropdown && results.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-y-auto">
                  {results.map((item, index) => (
                    <li
                      key={`${item.type}-${item.id}`}
                      onClick={() => handleSelectLocation(item)}
                      className={`flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-blue-50 text-sm ${index !== results.length - 1 ? 'border-b border-gray-100' : ''}`}
                    >
                      {item.type === 'country' ? (
                        <Globe className="w-4 h-4 text-blue-500 shrink-0" />
                      ) : (
                        <Building2 className="w-4 h-4 text-green-500 shrink-0" />
                      )}
                      <span className="text-gray-800">{item.value}</span>
                      <span className="ml-auto text-xs text-gray-400 capitalize">{item.type}</span>
                    </li>
                  ))}
                </ul>
              )}

              {showDropdown && query.length >= 2 && results.length === 0 && !isSearching && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow px-4 py-3 text-sm text-gray-500">
                  No locations found for "{query}"
                </div>
              )}
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                disabled={!selectedLocation}
                className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </div>
        </div>

        {/* Services Grid */}
        <div className={`transition-all duration-500 ease-in-out ${showTourGuideSearch ? 'opacity-30 scale-95' : 'opacity-100 scale-100'}`}>
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
                  <h3 className={`text-sm font-medium text-center ${showTourGuideSearch && service.title === 'Tour Guides' ? 'text-blue-900' : 'text-gray-900'}`}>
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
                <div key={index} onClick={handleTourGuideClick}>{content}</div>
              ) : service.available ? (
                <Link key={index} to={service.link}>{content}</Link>
              ) : (
                <div key={index}>{content}</div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home