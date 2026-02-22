import HomeHeader from "../components/HomeHeader";
import CategoryGrid from "../components/CategoryGrid";
import BannerCarousel from "../components/BannerCarousel";
import PopularGuides from "../components/PopularGuides";
import SignatureTours from "../components/SignatureTours";
import PopularDestinations from "../components/PopularDestinations";
import ReviewSection from "../components/ReviewSection";

import {
  categories,
  banners,
  cityFilters,
  popularGuides,
  signatureTours,
  popularDestinations,
  reviews,
} from "../../../data/mock/homeData";

function HomePage() {
  return (
    <div className="bg-gray-100 flex justify-center min-h-screen text-gray-800">
      <div className="w-full max-w-[414px] md:max-w-full bg-white min-h-screen relative pb-20 shadow-xl md:shadow-none overflow-x-hidden">
        <HomeHeader />

        {/* Desktop Hero Image */}
        <div className="hidden md:block w-full h-[350px] bg-gray-300 relative">
          <img
            src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&h=400&fit=crop"
            className="w-full h-full object-cover"
            alt="Hero Background"
          />
        </div>

        <CategoryGrid categories={categories} />
        <BannerCarousel banners={banners} />
        <PopularGuides guides={popularGuides} cityFilters={cityFilters} />
        <SignatureTours tours={signatureTours} />
        <PopularDestinations destinations={popularDestinations} />
        <ReviewSection reviews={reviews} />
      </div>
    </div>
  );
}

export default HomePage;
