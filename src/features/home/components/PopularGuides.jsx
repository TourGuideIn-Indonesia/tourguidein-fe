import { useState } from "react";
import GuideCard from "../../../shared/GuideCard";

function PopularGuides({ guides, cityFilters }) {
  const [activeCity, setActiveCity] = useState(null);

  return (
    <section className="mb-7">
      {/* Section title */}
      <div className="px-5 md:px-10 mb-3.5">
        <h3 className="text-lg font-bold text-gray-900">Guide Populer</h3>
      </div>

      {/* City filter chips */}
      <div className="flex gap-2.5 px-5 md:px-10 mb-4 overflow-x-auto scrollbar-hide">
        {cityFilters.map((city) => (
          <button
            key={city.id}
            onClick={() =>
              setActiveCity(activeCity === city.id ? null : city.id)
            }
            className={`px-4 py-2 rounded-full border text-[13px] font-medium whitespace-nowrap flex items-center gap-1.5 transition-all duration-200 shrink-0 cursor-pointer ${
              activeCity === city.id
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 bg-white text-gray-800 hover:border-gray-300"
            }`}
          >
            <img
              src={city.flag}
              className="w-4 h-auto"
              alt={city.countryCode.toUpperCase()}
            />
            {city.name}
          </button>
        ))}
      </div>

      {/* Mobile: horizontal scroll / Desktop: 4-col grid */}
      <div className="flex overflow-x-auto md:hidden px-5 pb-5 gap-4 scrollbar-hide">
        {guides.map((guide) => (
          <GuideCard key={guide.id} guide={guide} />
        ))}
      </div>

      <div className="hidden md:grid md:grid-cols-4 px-10 pb-5 gap-5">
        {guides.map((guide) => (
          <GuideCard
            key={guide.id}
            guide={guide}
            className="!w-full !min-w-0"
          />
        ))}
      </div>
    </section>
  );
}

export default PopularGuides;
