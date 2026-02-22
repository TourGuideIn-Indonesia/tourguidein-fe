import { useState } from "react";
import { Search, X, XCircle } from "lucide-react";
import PopularDestinations from "./PopularDestinations";
import {
  popularDestinations,
  searchResultsMock,
} from "../../../data/mock/homeData";

function LocationSearchModal({ isOpen, onClose, onSelect }) {
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  // Render logic for when there is text
  const isSearching = searchQuery.trim().length > 0;

  // Filter mock results (simplified purely for matching display logic)
  const filteredResults = isSearching
    ? searchResultsMock.filter(
        (country) =>
          country.countryName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          country.cities.some((city) =>
            city.name.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      )
    : [];

  return (
    <>
      {/* Transparent overlay backdrop */}
      <div className="fixed inset-0 bg-transparent z-[90]" onClick={onClose} />

      {/* 90vh Bottom Sheet Modal */}
      <div className="fixed bottom-0 left-0 right-0 z-[100] h-[90vh] bg-white rounded-t-[20px] flex flex-col w-full md:max-w-[414px] md:left-1/2 md:-translate-x-1/2 md:shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-[#FAFAFA]">
          <h1 className="text-[17px] font-bold text-[#1a202c] tracking-tight">
            Pilih negara atau kota
          </h1>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition-colors"
          >
            <X className="w-[22px] h-[22px]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50/30">
          {/* Search Input */}
          <div className="px-5 pt-5 pb-2 bg-white">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="w-[18px] h-[18px] text-gray-400" />
              </div>
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-10 py-3 border rounded-[10px] text-[15px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#3b82f6] shadow-sm transition-shadow ${
                  isSearching
                    ? "border-[#3b82f6]"
                    : "border-gray-200 focus:border-[#3b82f6]"
                }`}
                placeholder="Ketik nama negara atau kota"
              />
              {isSearching && (
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
                  <button onClick={() => setSearchQuery("")}>
                    <XCircle className="w-[18px] h-[18px] text-gray-400 hover:text-gray-600 cursor-pointer" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {isSearching ? (
            /* Active Search View */
            <div className="px-5 mt-4 bg-white pb-10">
              {filteredResults.length > 0 ? (
                filteredResults.map((country) => (
                  <div key={country.id} className="mb-4">
                    <div className="flex items-center gap-3 py-2">
                      <img
                        src={country.flagUrl}
                        className="w-[18px] rounded-[2px] shadow-sm border border-gray-100"
                        alt={country.countryName}
                      />
                      <span className="text-[15px] font-bold text-gray-900">
                        {country.countryName}
                      </span>
                    </div>

                    <div className="flex flex-col mt-1">
                      {country.cities
                        .filter((city) =>
                          searchQuery
                            ? city.name
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase()) ||
                              country.countryName
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase())
                            : true,
                        )
                        .map((city) => (
                          <div
                            key={city.id}
                            onClick={() => onSelect(city.name)}
                            className="flex items-center justify-between py-3.5 pl-[30px] pr-2 cursor-pointer hover:bg-gray-50 transition-colors"
                          >
                            <span className="text-[14.5px] text-gray-800 font-medium">
                              {city.name}
                            </span>
                            <span className="text-[14px] text-gray-500">
                              {city.guideCount} Guide
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-gray-500 text-sm">
                  Pencarian tidak ditemukan.
                </div>
              )}
            </div>
          ) : (
            /* Default View */
            <>
              {/* Recent Searches */}
              <div className="px-5 pb-5 bg-white">
                <h2 className="text-[14px] font-bold text-[#2d3748] mb-3">
                  Pencarian terakhir
                </h2>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onSelect("Tokyo")}
                    className="flex items-center gap-2 px-4 py-1.5 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors bg-white"
                  >
                    <img
                      src="https://flagcdn.com/w20/jp.png"
                      className="w-[14px] h-auto rounded-[2px] shadow-sm"
                      alt="Japan"
                    />
                    <span className="text-[13px] font-medium text-gray-700">
                      Tokyo
                    </span>
                  </button>
                </div>
              </div>

              <div className="px-5 bg-white">
                <hr className="border-gray-100" />
              </div>

              {/* Popular Destinations */}
              <div className="pt-5 pb-8 bg-white">
                <div className="px-5 mb-1">
                  <h2 className="text-[14px] font-bold text-[#2d3748] mb-1">
                    Destinasi Populer
                  </h2>
                </div>
                <div className="[&>section>div>h3]:hidden [&>section]:mb-0 [&>.md\\:px-10]:px-5 [&>section>div.mb-3.5]:mb-0">
                  <PopularDestinations
                    destinations={popularDestinations}
                    onDestinationClick={onSelect}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default LocationSearchModal;
