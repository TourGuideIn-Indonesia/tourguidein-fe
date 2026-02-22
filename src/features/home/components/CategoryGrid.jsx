import { useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

function CategoryGrid({ categories }) {
  const [activeCategory, setActiveCategory] = useState("Tour Guide");
  return (
    <>
      {/* Mobile View */}
      <div className="grid grid-cols-3 md:hidden gap-5 px-5 py-2.5 mb-5">
        {categories.map((category) => {
          const content = (
            <div
              key={category.id}
              className="flex flex-col items-center text-center cursor-pointer group"
            >
              <div className="w-[55px] h-[55px] rounded-full flex justify-center items-center mb-1 transition-transform duration-200 group-hover:scale-110">
                <img
                  src={category.icon}
                  alt={category.title}
                  className="w-12 h-12 object-contain"
                />
              </div>
              <span className="text-xs font-semibold text-black">
                {category.title}
              </span>
            </div>
          );

          if (category.link) {
            return (
              <Link
                to={category.link}
                key={category.id}
                className="no-underline text-black"
              >
                {content}
              </Link>
            );
          }

          return <div key={category.id}>{content}</div>;
        })}
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
