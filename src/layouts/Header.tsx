import { useState } from "react";
import { Link } from "react-router-dom";
const logo = "/tydline-sqaurlogo.png";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="w-full flex items-center justify-center h-16 relative border-b border-[#052698]/25">
      {/* Hamburger — mobile + tablet */}
      <button
        className="absolute left-4 lg:hidden flex flex-col justify-center gap-[5px] w-7 h-7 cursor-pointer"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Toggle menu"
      >
        <span
          className={`block h-[2px] w-full bg-[#052698] transition-transform duration-200 ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`}
        />
        <span
          className={`block h-[2px] w-full bg-[#052698] transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`}
        />
        <span
          className={`block h-[2px] w-full bg-[#052698] transition-transform duration-200 ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
        />
      </button>

      {/* Logo — centered on mobile + tablet */}
      <Link to="/" className="lg:hidden">
        <img src={logo} className="w-12" alt="Tydline Logo" />
      </Link>

      {/* Desktop nav */}
      <div className="hidden lg:flex items-center justify-between w-[60%] text-sm">
        {/* Left — Logo */}
        <Link to="/">
          <img src={logo} className="w-14" alt="Tydline Logo" />
        </Link>

        {/* Center — nav links */}
        <div className="flex items-center gap-10">
          <Link to="/solutions">Solutions</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/about">About Us</Link>
          <Link to="/pricing">Pricing</Link>
        </div>

        {/* Right — Login */}
        <Link
          to="/track?step=auth"
          className="text-sm font-medium px-4 py-2 border border-[#052698] bg-white ring-1 ring-[#052698]/30 ring-offset-2"
        >
          Login
        </Link>
      </div>

      {/* Mobile + tablet dropdown */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-[#052698]/15 z-50 lg:hidden">
          <nav className="flex flex-col items-center gap-0 divide-y divide-[#052698]/8 w-full">
            <Link to="/solutions" onClick={() => setMenuOpen(false)} className="w-full text-center py-3 text-sm">Solutions</Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)} className="w-full text-center py-3 text-sm">Contact Us</Link>
            <Link to="/about" onClick={() => setMenuOpen(false)} className="w-full text-center py-3 text-sm">About Us</Link>
            <Link to="/pricing" onClick={() => setMenuOpen(false)} className="w-full text-center py-3 text-sm">Pricing</Link>
            <div className="flex items-center justify-center gap-3 py-4 px-4 w-full">
              <Link
                to="/track?step=auth"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center text-sm text-[#052698] font-medium py-2.5 border border-[#052698]/30 hover:bg-[#052698]/5 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/pricing"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center text-sm text-white font-medium py-2.5 bg-[#052698] hover:bg-[#052698]/90 transition-colors"
              >
                Get started
              </Link>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}

export default Header;
