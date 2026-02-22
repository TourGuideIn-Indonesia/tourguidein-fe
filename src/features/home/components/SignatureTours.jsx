function SignatureTours({ tours }) {
  return (
    <section className="mb-7">
      <div className="px-5 md:px-10 mb-3.5">
        <h3 className="text-lg font-bold text-gray-900">Signature Tour</h3>
      </div>

      <div className="flex overflow-x-auto px-5 md:px-10 pb-5 gap-4 scrollbar-hide">
        {tours.map((tour) => (
          <div
            key={tour.id}
            className="min-w-[250px] md:min-w-[260px] bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col shrink-0 group cursor-pointer hover:shadow-md transition-shadow duration-200"
          >
            {/* Tour image */}
            <div className="w-full h-[150px] md:h-[180px] overflow-hidden">
              <img
                src={tour.image}
                alt={tour.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Tour info */}
            <div className="p-3.5 flex flex-col items-start">
              <span className="px-3 py-1 mb-2.5 border border-gray-200 rounded-full text-[12px] font-medium text-gray-800">
                {tour.tag}
              </span>
              <div className="text-[14px] font-semibold text-gray-900 mb-1">
                {tour.title}
              </div>
              <div className="text-[12px] text-gray-500">
                {tour.duration} • {tour.location}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SignatureTours;
