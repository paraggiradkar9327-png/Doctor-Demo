import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import type { Doctor } from "@/lib/types";
import {
  HeartPulse,
  Stethoscope,
  Ambulance,
  ShieldPlus,
  CalendarCheck,
  ArrowRight,
  Star,
  Clock,
  Award,
  Users,
} from "lucide-react";
import Reveal from "@/components/Reveal";

import type { SiteSettings } from "@/lib/types";

// Hardcoded hospital info (no longer editable from admin)
("Compassionate care. Advanced medicine. Trusted by thousands.");

export default function Home() {
  const [featuredDoctor, setFeaturedDoctor] = useState<Doctor | null>(null);
  const services = [
    {
      icon: HeartPulse,
      title: "Cardiology",
      desc: "Advanced heart care with state-of-the-art technology.",
    },
    {
      icon: Stethoscope,
      title: "General Medicine",
      desc: "Comprehensive primary care for all ages.",
    },
    {
      icon: Ambulance,
      title: "Emergency Care",
      desc: "24/7 emergency services with rapid response.",
    },
    {
      icon: ShieldPlus,
      title: "Preventive Health",
      desc: "Health screenings and wellness programs.",
    },
  ];

  const stats = [
    { icon: Users, value: "50K+", label: "Patients Served" },
    { icon: Award, value: "25+", label: "Years of Excellence" },
    { icon: Stethoscope, value: "30+", label: "Expert Doctors" },
    { icon: Clock, value: "24/7", label: "Emergency Service" },
  ];

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
    <div>
      {/* Hero Section */}
      <section className="relative min-h-150 flex items-center overflow-hidden">
        {featuredDoctor && (
          <div className="mb-8">
            <div className="absolute inset-0 bg-linear-to-br from-teal-700 via-cyan-700 to-teal-900" />
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${featuredDoctor.hospital_photo_url})`,
              }}
            />
          </div>
        )}

        {/* decorative floating blobs */}
        <div className="absolute -top-10 -right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-10 left-0 w-56 h-56 bg-cyan-300/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1.5s" }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <div
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6 animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              <Star className="w-4 h-4 text-yellow-300" />
              <span className="text-white text-sm font-medium">
                Rated #1 Hospital in the Region
              </span>
            </div>
            {featuredDoctor && (
              <div className="mb-8">
                <p
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animate-fade-in-up"
                  style={{ animationDelay: "0.25s" }}
                >
                  {featuredDoctor.hospital_name}
                </p>
              </div>
            )}
            <p
              className="text-lg text-teal-50 mb-8 leading-relaxed max-w-xl animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              Compassionate care. Advanced medicine. Trusted by thousands.
            </p>
            <div
              className="flex justify-center animate-fade-in-up"
              style={{ animationDelay: "0.55s" }}
            >
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-white text-teal-700 font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                Book Appointment
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 100"
            className="block w-full h-auto"
            preserveAspectRatio="none"
          >
            <path
              d="M0,102 C480,0 960,0 1440,102 L1440,102 L0,102 Z"
              fill="white"
              stroke="none"
            />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <Reveal key={i} delay={i * 100}>
                  <div className="text-center group">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-50 mb-3 group-hover:bg-teal-100 group-hover:scale-110 transition-all duration-300">
                      <Icon className="w-7 h-7 text-teal-600" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-12">
            <span className="text-teal-600 font-semibold text-sm uppercase tracking-wider">
              What We Offer
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
              Our Medical Services
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => {
              const Icon = s.icon;
              return (
                <Reveal key={i} delay={i * 120}>
                  <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2 border border-gray-100 h-full">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-teal-500 to-cyan-600 mb-4 transition-transform duration-300 hover:rotate-6">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {s.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-r from-teal-600 to-cyan-700">
        <Reveal className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <CalendarCheck className="w-12 h-12 text-white mx-auto mb-4 animate-float" />
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Book Your Appointment?
          </h2>
          <p className="text-teal-50 text-lg mb-8">
            Our team is here to provide you with the best possible care.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-white text-teal-700 font-semibold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            Contact Us Today
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
