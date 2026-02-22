import { useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

function CategoryGrid({ categories }) {
  const [activeCategory, setActiveCategory] = useState("Tour Guide");
  const [isSearchMobileVisible, setIsSearchMobileVisible] = useState(false);

  return (
    <>
      {/* Mobile View */}
      <div className="md:hidden">
        {isSearchMobileVisible ? (
          // Mobile Hero + Search Form (Visible when category is clicked)
          <div className="relative w-full bg-white mb-5 animate-in fade-in duration-300">
            <div className="w-full h-[250px] relative">
              <img
                src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=400&fit=crop"
                className="w-full h-full object-cover"
                alt="Hero Background"
              />
              <div className="absolute inset-0 bg-black/20"></div>
              <h1 className="absolute bottom-[50px] left-5 text-white font-bold text-[20px] tracking-wide z-10 drop-shadow-md">
                Cari {activeCategory}
              </h1>
            </div>

            <div className="relative -mt-6 bg-white rounded-t-[24px] px-5 pt-8 pb-4 z-20 min-h-[150px]">
              <div className="animate-in slide-in-from-bottom-2 duration-300">
                <button
                  onClick={() => setIsSearchMobileVisible(false)}
                  className="mb-4 text-sm text-[#4a72d5] font-semibold flex items-center gap-1"
                >
                  &larr; Kembali ke Kategori
                </button>
                <div className="relative mb-3.5">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder={`Mau ke mana dengan ${activeCategory}?`}
                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#4a72d5] focus:ring-1 focus:ring-[#4a72d5] shadow-sm"
                  />
                </div>

                <button className="w-full bg-[#4a72d5] hover:bg-blue-600 active:bg-blue-700 text-white font-semibold text-[15px] py-3.5 rounded-xl transition-colors shadow-sm">
                  Cari Sekarang
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Basic Category Grid (Initial state)
          <div className="grid grid-cols-3 gap-y-6 gap-x-5 px-5 py-4 mb-3 animate-in fade-in duration-300">
            {categories.map((category) => {
              const content = (
                <div
                  key={category.id}
                  onClick={() => {
                    setActiveCategory(category.title);
                    setIsSearchMobileVisible(true);
                  }}
                  className="flex flex-col items-center text-center cursor-pointer group"
                >
                  <div className="w-[55px] h-[55px] rounded-full flex justify-center items-center mb-1 transition-transform duration-200 group-hover:scale-110">
                    <img
                      src={category.icon}
                      alt={category.title}
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-800">
                    {category.title}
                  </span>
                </div>
              );
              return <div key={category.id}>{content}</div>;
            })}
          </div>
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block relative w-[99%] mx-auto z-10 -mt-20 mb-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 pt-12 w-full relative">
          {/* Categories Pill Navigation */}
          <div className="absolute -top-[28px] left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.08)] flex items-center p-1.5 gap-1 w-max">
            {categories.map((category) => {
              const isActive = category.title === activeCategory;

              const content = (
                <div
                  onClick={() => setActiveCategory(category.title)}
                  className={`flex items-center gap-3 px-8 py-3 rounded-full cursor-pointer transition-colors border ${
                    isActive
                      ? "bg-[#DAE3F5] border-[#4874CF]"
                      : "border-transparent hover:bg-[#DAE3F5] hover:border-[#4874CF]"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50">
                    <img
                      src={category.icon}
                      alt={category.title}
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                  <span
                    className={`text-[13px] font-bold ${isActive ? "text-gray-900" : "text-gray-800"}`}
                  >
                    {category.title}
                  </span>
                </div>
              );

              if (category.link) {
                return (
                  <Link
                    to={category.link}
                    key={category.id}
                    className="no-underline"
                  >
                    {content}
                  </Link>
                );
              }

              return <div key={category.id}>{content}</div>;
            })}
          </div>

          {/* Search Bar */}
          <div className="w-full">
            <label className="block text-[13px] font-medium text-gray-600 mb-2">
              Mau pergi ke negara?
            </label>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Mau pergi ke negara?"
                  className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-800 placeholder-gray-400"
                />
              </div>
              <button className="bg-[#4a72d5] hover:bg-blue-700 text-white font-semibold text-sm px-8 py-3.5 rounded-lg transition-colors whitespace-nowrap">
                Cari Tour Guide
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CategoryGrid;
