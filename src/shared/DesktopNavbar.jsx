import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

function DesktopNavbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "My Bookings", path: "/bookings" },
    { label: "Partnerships", path: "/partnerships" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <nav className="hidden md:block bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo + Nav Links */}
          <div className="flex items-center gap-10">
            {/* Logo */}
            <Link to="/" className="shrink-0">
              <img src={logo} alt="TourGuideIn" className="h-8 w-auto" />
            </Link>

            {/* Nav Links */}
            <div className="flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-[14px] font-medium transition-colors duration-200 no-underline ${
                    isActive(link.path)
                      ? "text-gray-900 font-semibold"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Auth Buttons */}
          <div className="flex items-center gap-4">
            <Link
              to="/register"
              className="text-[14px] font-medium text-gray-700 hover:text-gray-900 transition-colors no-underline"
            >
              Sign up
            </Link>
            <Link
              to="/traveller/login"
              className="text-[14px] font-medium text-gray-900 px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors no-underline"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default DesktopNavbar;
