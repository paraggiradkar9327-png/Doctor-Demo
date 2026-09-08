import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, HeartPulse } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Doctor, SiteSettings } from "@/lib/types";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const [featuredDoctor, setFeaturedDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    (async () => {
      const { data: settings } = await supabase
        .from("site_settings")
        .select("*")
        .limit(1)
        .maybeSingle<SiteSettings>();

      if (settings?.featured_doctor_id) {
        const { data: doctor } = await supabase
          .from("doctors")
          .select("*")
          .eq("id", settings.featured_doctor_id)
          .maybeSingle<Doctor>();
        setFeaturedDoctor(doctor ?? null);
      }
    })();
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Doctors", path: "/doctors" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg py-3"
          : "bg-white/80 backdrop-blur-sm py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-linear-to-br from-teal-500 to-cyan-600 p-2 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            {featuredDoctor && (
              <span className="text-xl font-bold bg-linear-to-r from-teal-700 to-cyan-700 bg-clip-text text-transparent">
                {featuredDoctor.hospital_name}
              </span>
            )}
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                    isActive
                      ? "text-teal-700"
                      : "text-gray-600 hover:text-teal-600"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-teal-500 rounded-full" />
                  )}
                </Link>
              );
            })}
            <Link
              to="/admin"
              className="ml-2 px-5 py-2 rounded-lg text-sm font-semibold bg-linear-to-r from-teal-500 to-cyan-600 text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              Admin
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile nav */}
        {isOpen && (
          <div className="md:hidden mt-3 pb-3 space-y-1 border-t border-gray-100 pt-3 animate-fade-in-down">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-teal-50 text-teal-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <Link
              to="/admin"
              className="block px-4 py-2.5 rounded-lg text-sm font-semibold bg-linear-to-r from-teal-500 to-cyan-600 text-white text-center mt-2"
            >
              Admin Panel
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
