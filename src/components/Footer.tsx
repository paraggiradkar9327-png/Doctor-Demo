import { Link } from "react-router-dom";
import { HeartPulse, Phone, Mail, MapPin } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Doctor, SiteSettings } from "@/lib/types";

export default function Footer() {
  const [featuredDoctor, setFeaturedDoctor] = useState<Doctor | null>(null);

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

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-linear-to-br from-teal-500 to-cyan-600 p-2 rounded-xl">
                <HeartPulse className="w-6 h-6 text-white" />
              </div>

              {featuredDoctor && (
                <span className="text-xl font-bold text-white">
                  {featuredDoctor.hospital_name}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400 max-w-md leading-relaxed">
              Providing exceptional healthcare services with compassion and
              excellence. Your health and well-being are our top priorities.
            </p>
            <div className="flex gap-3 mt-6">
              {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map(
                (Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-teal-600 transition-colors duration-200"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ),
              )}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { name: "Home", path: "/" },
                { name: "About Us", path: "/about" },
                { name: "Doctors", path: "/doctors" },
                { name: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-teal-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
                <span className="text-gray-400">
                  123 Healthcare Ave, Medical City
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span className="text-gray-400">info@medicare.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} MediCare. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
