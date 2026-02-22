import { Link, useLocation } from "react-router-dom";
import { Home, CalendarDots, Profile } from "./Icons";

function BottomNav() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { label: "Home", path: "/", icon: Home },
    { label: "Bookings", path: "/bookings", icon: CalendarDots },
    { label: "Profile", path: "/profile", icon: Profile },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[414px] bg-white border-t border-gray-200 flex justify-around items-center py-3 z-50">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);

        return (
          <Link
            to={item.path}
            key={item.path}
            className={`flex flex-col items-center gap-1 no-underline transition-colors duration-200 ${
              active ? "text-[#4a72d5]" : "text-gray-400 hover:text-[#4a72d5]"
            }`}
          >
            <Icon className="w-6 h-6" strokeWidth={active ? 2.5 : 1.5} />
            <span
              className={`text-[14px] ${active ? "font-bold" : "font-medium"}`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

export default BottomNav;
