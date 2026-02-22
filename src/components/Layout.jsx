import DesktopNavbar from "../shared/DesktopNavbar";
import BottomNav from "../shared/BottomNav";

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <DesktopNavbar />
      <main className="flex-1 w-full max-w-[1440px] mx-auto">{children}</main>
      <BottomNav />
    </div>
  );
}

export default Layout;
