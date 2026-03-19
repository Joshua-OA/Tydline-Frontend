import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/tydline-sqaurlogo.png";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="w-full flex items-center justify-center h-16 relative border-b border-[#052698]/25">
      {/* Hamburger — mobile only */}
      <button
        className="absolute left-4 md:hidden flex flex-col justify-center gap-[5px] w-7 h-7 cursor-pointer"
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

      {/* Logo — always visible, centered on mobile */}
      <Link to="/" className="md:hidden">
        <img src={logo} className="w-12" alt="Tydline Logo" />
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-10 text-sm">
        <Link to="/solutions">Solutions</Link>
        <Link to="/contact">Contact Us</Link>
        <Link to="/">
          <img src={logo} className="w-14" alt="Tydline Logo" />
        </Link>
        <Link to="/about">About Us</Link>
        <Link to="/track?step=packages">Pricing</Link>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-sm border-b border-[#052698]/15 z-50 md:hidden">
          <nav className="flex items-center justify-center gap-6 py-3 px-4 flex-wrap">
            <Link to="/solutions" onClick={() => setMenuOpen(false)}>Solutions</Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact Us</Link>
            <Link to="/about" onClick={() => setMenuOpen(false)}>About Us</Link>
            <Link to="/track?step=packages" onClick={() => setMenuOpen(false)}>Pricing</Link>
          </nav>
        </div>
      )}
    </div>
  );
}

export default Header;
