function PopularDestinations({ destinations, onDestinationClick }) {
  return (
    <section className="mb-7">
      <div className="px-5 md:px-10 mb-3.5">
        <h3 className="text-lg font-bold text-gray-900">
          Banyak dikunjungi dengan Tour Guide
        </h3>
      </div>

      {/* Mobile: 3-col grid */}
      <div className="grid grid-cols-3 gap-2.5 px-5 md:hidden">
        {destinations.slice(0, 6).map((dest) => (
          <div
            key={dest.id}
            className="cursor-pointer group"
            onClick={() => onDestinationClick?.(dest.name)}
          >
            <div className="overflow-hidden rounded-lg mb-1.5">
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full aspect-square object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="text-xs flex items-center gap-1.5 text-gray-700 font-medium">
              <img src={dest.flag} className="w-[12px]" alt={dest.name} />
              {dest.name}
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:flex overflow-x-auto px-10 pb-5 gap-4 scrollbar-hide">
        {destinations.map((dest) => (
          <div
            key={dest.id}
            className="shrink-0 cursor-pointer group"
            onClick={() => onDestinationClick?.(dest.name)}
          >
            <div className="w-[190px] h-[190px] overflow-hidden rounded-lg mb-1.5">
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="text-xs flex items-center gap-1.5 text-gray-700 font-medium">
              <img src={dest.flag} className="w-[12px]" alt={dest.name} />
              {dest.name}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PopularDestinations;
