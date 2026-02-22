import { Star } from "lucide-react";

function ReviewSection({ reviews }) {
  return (
    <section className="mb-7">
      <div className="px-5 md:px-10 mb-3.5">
        <h3 className="text-lg font-bold text-gray-900">Review TourGuideIn</h3>
      </div>

      <div className="flex overflow-x-auto px-5 md:px-10 pb-5 gap-4 scrollbar-hide">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="w-[280px] min-w-[280px] md:min-w-[300px] bg-white border border-gray-100 rounded-xl p-4 shadow-sm shrink-0"
          >
            {/* Stars */}
            <div className="flex gap-0.5 mb-2">
              {Array.from({ length: review.rating }).map((_, i) => (
                <Star
                  key={i}
                  className="w-3 h-3 text-yellow-400 fill-yellow-400"
                />
              ))}
            </div>

            {/* Reviewer name */}
            <div className="text-[13px] font-bold text-gray-900 mb-1.5">
              {review.name}
            </div>

            {/* Review text */}
            <div className="text-[11px] text-gray-500 leading-relaxed">
              {review.text}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ReviewSection;
