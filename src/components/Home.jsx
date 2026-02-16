import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, MapPin, Package, Car, Users2, Plane, Search, ArrowLeft } from 'lucide-react'

function Home() {
  const [showTourGuideSearch, setShowTourGuideSearch] = useState(false)

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
        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
          showTourGuideSearch ? 'max-h-96 opacity-100 mb-8' : 'max-h-0 opacity-0'
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
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select Country</option>
                  <option value="indonesia">Indonesia</option>
                  <option value="malaysia">Malaysia</option>
                  <option value="thailand">Thailand</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select City</option>
                  <option value="jakarta">Jakarta</option>
                  <option value="bali">Bali</option>
                  <option value="yogyakarta">Yogyakarta</option>
                  <option value="bandung">Bandung</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-end">
                <Link to="/guides" className="w-full">
                  <button className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className={`transition-all duration-500 ease-in-out ${
          showTourGuideSearch ? 'opacity-30 scale-95' : 'opacity-100 scale-100'
        }`}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {services.map((service, index) => {
              const IconComponent = service.icon
              const content = (
                <div className={`p-6 rounded-lg border-2 transition-all duration-200 aspect-square flex flex-col items-center justify-center ${
                  service.available
                    ? showTourGuideSearch && service.title === 'Tour Guides'
                      ? 'bg-blue-50 border-blue-500 shadow-lg scale-105'
                      : 'bg-white border-blue-200 hover:border-blue-400 hover:shadow-lg cursor-pointer'
                    : 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-75'
                } ${showTourGuideSearch && service.title !== 'Tour Guides' ? 'pointer-events-none' : ''}`}>
                  <IconComponent className={`w-8 h-8 mb-3 ${
                    service.available 
                      ? showTourGuideSearch && service.title === 'Tour Guides'
                        ? 'text-blue-700'
                        : 'text-blue-600'
                      : 'text-gray-400'
                  }`} />
                  <h3 className={`text-sm font-medium text-center ${
                    showTourGuideSearch && service.title === 'Tour Guides'
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
