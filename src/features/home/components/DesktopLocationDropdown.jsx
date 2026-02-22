import { XCircle } from "lucide-react";
import PopularDestinations from "./PopularDestinations";
import {
  popularDestinations,
  searchResultsMock,
} from "../../../data/mock/homeData";

function DesktopLocationDropdown({ searchQuery, onSelect }) {
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
    <div className="absolute top-full left-0 mt-3 w-full bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 z-50 overflow-hidden max-h-[500px] flex flex-col">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-gray-200 bg-[#FAFAFA]">
        <h1 className="text-[16px] font-bold text-[#1a202c] tracking-tight">
          Pilih negara atau kota
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {isSearching ? (
          /* Active Search View */
          <div>
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
                          onMouseDown={() => onSelect(city.name)}
                          className="flex items-center justify-between py-2.5 pl-[30px] pr-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <span className="text-[14px] text-gray-800 font-medium">
                            {city.name}
                          </span>
                          <span className="text-[13px] text-gray-500">
                            {city.guideCount} Guide
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500 text-sm">
                Pencarian tidak ditemukan.
              </div>
            )}
          </div>
        ) : (
          /* Default View */
          <>
            {/* Recent Searches */}
            <div className="mb-6">
              <h2 className="text-[14px] font-bold text-[#2d3748] mb-3">
                Pencarian terakhir
              </h2>
              <div className="flex flex-wrap gap-2">
                <button
                  onMouseDown={() => onSelect("Tokyo")}
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

            <hr className="border-gray-100 mb-5" />

            {/* Popular Destinations */}
            <div>
              <div className="mb-3">
                <h2 className="text-[14px] font-bold text-[#2d3748]">
                  Destinasi Populer
                </h2>
              </div>
              <div className="[&>section>div>h3]:hidden [&>section]:mb-0 [&>.md\\:px-10]:px-0 [&>section>div.mb-3.5]:mb-0 [&>.md\\:flex]:grid [&>.md\\:flex]:grid-cols-2 [&>.md\\:flex]:gap-4 [&>.md\\:flex>.shrink-0]:w-full [&>.md\\:flex>.shrink-0_img]:h-[120px] [&>.md\\:flex]:px-0">
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
  );
}

export default DesktopLocationDropdown;
