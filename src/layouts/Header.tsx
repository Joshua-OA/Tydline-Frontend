import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/tydline-sqaurlogo.png";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="w-full flex items-center justify-center h-24 relative">
      {/* Hamburger — mobile only */}
      <button
        className="absolute left-4 md:hidden flex flex-col justify-center gap-[5px] w-8 h-8 cursor-pointer"
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
        <img src={logo} className="w-16" alt="Tydline Logo" />
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-14">
        <Link to="/solutions">Solutions</Link>
        <Link to="/contact">Contact Us</Link>
        <Link to="/">
          <img src={logo} className="w-20" alt="Tydline Logo" />
        </Link>
        <Link to="/about">About Us</Link>
        <Link to="/pricing">Pricing</Link>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-sm border-b border-[#052698]/15 z-50 md:hidden">
          <nav className="flex items-center justify-center gap-6 py-3 px-4 flex-wrap">
            <Link to="/solutions" onClick={() => setMenuOpen(false)}>Solutions</Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact Us</Link>
            <Link to="/about" onClick={() => setMenuOpen(false)}>About Us</Link>
            <Link to="/pricing" onClick={() => setMenuOpen(false)}>Pricing</Link>
          </nav>
        </div>
      )}
    </div>
  );
}

export default Header;
