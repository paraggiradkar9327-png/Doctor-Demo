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

// Hardcoded hospital info (no longer editable from admin)
const HOSPITAL_NAME = "MediCare General Hospital";
const HOSPITAL_TAGLINE =
  "Compassionate care. Advanced medicine. Trusted by thousands.";

export default function Home() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: docData } = await supabase
        .from("doctors")
        .select("*")
        .limit(4);
      setDoctors(docData ?? []);
      setLoading(false);
    })();
  }, []);

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

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-150 flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-teal-700 via-cyan-700 to-teal-900" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <Star className="w-4 h-4 text-yellow-300" />
              <span className="text-white text-sm font-medium">
                Rated #1 Hospital in the Region
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              {HOSPITAL_NAME}
            </h1>
            <p className="text-lg text-teal-50 mb-8 leading-relaxed max-w-xl">
              {HOSPITAL_TAGLINE}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-white text-teal-700 font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                Book Appointment
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/doctors"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-all duration-200"
              >
                Meet Our Doctors
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 100"
            className="w-full h-auto"
            preserveAspectRatio="none"
          >
            <path
              d="M0,100 C480,0 960,0 1440,100 L1440,100 L0,100 Z"
              fill="white"
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
                <div key={i} className="text-center group">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-50 mb-3 group-hover:bg-teal-100 transition-colors duration-200">
                    <Icon className="w-7 h-7 text-teal-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-teal-600 font-semibold text-sm uppercase tracking-wider">
              What We Offer
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
              Our Medical Services
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {s.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Doctors preview */}
      {!loading && doctors.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10">
              <div>
                <span className="text-teal-600 font-semibold text-sm uppercase tracking-wider">
                  Meet the Team
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
                  Our Expert Doctors
                </h2>
              </div>
              <Link
                to="/doctors"
                className="inline-flex items-center gap-2 text-teal-600 font-semibold hover:gap-3 transition-all mt-4 sm:mt-0"
              >
                View All Doctors
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="aspect-3/4 overflow-hidden bg-gray-100">
                    {doctor.photo_url ? (
                      <img
                        src={doctor.photo_url}
                        alt={doctor.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-teal-50">
                        <Stethoscope className="w-12 h-12 text-teal-300" />
                      </div>
                    )}
                  </div>
                  <div className="p-5 text-center">
                    <h3 className="font-semibold text-gray-900">
                      {doctor.name}
                    </h3>
                    <p className="text-sm text-teal-600 mt-1">
                      {doctor.hospital_name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-r from-teal-600 to-cyan-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <CalendarCheck className="w-12 h-12 text-white mx-auto mb-4" />
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
        </div>
      </section>
    </div>
  );
}
