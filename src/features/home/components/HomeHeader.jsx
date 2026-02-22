import logo from "../../../assets/logo.png";

function HomeHeader() {
  return (
    <header className="px-5 py-4 flex items-center md:hidden">
      <div className="flex items-center gap-2">
        <img src={logo} alt="TourGuideIn" className="h-8 w-auto" />
      </div>
    </header>
  );
}

export default HomeHeader;
