import { Link } from "react-router-dom";
import { Star, BadgeCheck } from "lucide-react";

/**
 * GuideCard - Reusable card component for displaying tour guide information
 *
 * @param {Object} props
 * @param {Object} props.guide - Guide data object
 * @param {number} props.guide.id - Guide ID
 * @param {string} props.guide.name - Guide name
 * @param {string} props.guide.image - Guide image URL
 * @param {number} props.guide.price - Guide price per hour
 * @param {string} props.guide.priceLabel - Price label (e.g. "per jam")
 * @param {string} props.guide.currency - Currency symbol (e.g. "Rp")
 * @param {number} props.guide.rating - Guide rating
 * @param {string} props.guide.bookings - Number of bookings
 * @param {boolean} props.guide.isVerified - Whether guide is verified
 * @param {string} [props.className] - Additional class names
 */
function GuideCard({ guide, className = "" }) {
  const formattedPrice = new Intl.NumberFormat("id-ID").format(guide.price);

  return (
    <Link
      to={`/guides/${guide.id}`}
      className={`w-[160px] min-w-[160px] bg-white flex flex-col shrink-0 group ${guide.badge ? "mt-3" : ""} ${className}`}
    >
      {/* Image + Badge wrapper */}
      <div className="relative mb-2.5">
        {/* Badge ribbon - positioned above image */}
        {guide.badge && (
          <div className="absolute -top-3 -right-1.5 z-10">
            <div
              className={`px-3 py-1.5 rounded-t-md rounded-bl-md text-[11px] font-bold text-white ${guide.badge.color}`}
            >
              {guide.badge.label}
            </div>
            {/* Fold triangle */}
            <div
              className="absolute right-0 bottom-0 translate-y-full"
              style={{
                width: 0,
                height: 0,
                borderTop: `6px solid ${guide.badge.color === "bg-red-500" ? "#991b1b" : "#6b21a8"}`,
                borderRight: "6px solid transparent",
              }}
            />
          </div>
        )}
        {/* Image */}
        <div className="overflow-hidden rounded-2xl">
          <img
            src={guide.image}
            alt={guide.name}
            className="w-full h-[130px] md:h-[200px] rounded-2xl object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-0.5">
        {/* Name + verified badge */}
        <h4 className="text-[12px] font-semibold text-gray-900 flex items-center gap-1 truncate">
          {guide.name}
        </h4>

        {/* Price */}
        <div className="flex items-baseline gap-1 flex-wrap">
          {guide.originalPrice && (
            <span className="text-[11px] text-gray-400 line-through">
              {guide.currency}
              {new Intl.NumberFormat("id-ID").format(guide.originalPrice)}
            </span>
          )}
          <span className="text-[14px] font-bold text-gray-900">
            {guide.currency}
            {formattedPrice}
          </span>
          <span className="font-normal text-[11px] text-gray-500">
            {guide.priceLabel}
          </span>
        </div>

        {/* Optional verified organization */}
        {guide.verifiedLabel && (
          <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-0.5">
            <BadgeCheck className="w-3.5 h-3.5 text-white fill-green-500 shrink-0" />
            <span>verified</span>
            <span className="font-bold text-blue-600">
              {guide.verifiedLabel}
            </span>
          </div>
        )}

        {/* Rating & bookings - only shown if available */}
        {guide.rating ? (
          <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-0.5">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span>
              {guide.rating} ({guide.bookings} Bookings)
            </span>
          </div>
        ) : (
          <div className="text-[11px] text-gray-400 mt-0.5">
            Belum ada review
          </div>
        )}
      </div>
    </Link>
  );
}

export default GuideCard;
