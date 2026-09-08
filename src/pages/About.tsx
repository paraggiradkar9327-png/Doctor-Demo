import { Target, Eye } from "lucide-react";

import { useEffect, useState } from "react";
import type { Doctor, SiteSettings } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import InfoSection from "@/components/InfoSection";

export default function About() {
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
    <div>
      {/* Hero */}
      <section className="relative py-24 bg-linear-to-br from-teal-700 via-cyan-700 to-teal-800 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            About Us
          </h1>
          {featuredDoctor && (
            <p className="text-teal-50 text-lg max-w-2xl mx-auto">
              {featuredDoctor.hospital_name} — A legacy of healing, a commitment
              to excellence.
            </p>
          )}
        </div>
      </section>

      {/* Main About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="mb-1">
              <span className="text-teal-600 font-semibold text-sm uppercase tracking-wider">
                Our Story
              </span>
              {featuredDoctor && (
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-6">
                  {featuredDoctor.hospital_name}
                </h2>
              )}
              <p className="text-gray-600 leading-relaxed mb-6">
                Our hospital is dedicated to delivering quality healthcare with
                compassion and professionalism. From routine consultations to
                advanced medical care, our experienced team works together to
                provide trusted healthcare services tailored to every patient's
                needs.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
                    <Target className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Our Mission</h4>
                    <p className="text-sm text-gray-600">
                      To improve the health and well-being of every patient
                      through compassionate, quality care.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Our Vision</h4>
                    <p className="text-sm text-gray-600">
                      To be the most trusted healthcare provider, recognized for
                      clinical excellence and innovation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              {featuredDoctor?.hospital_photo_url && (
                <img
                  src={featuredDoctor.hospital_photo_url}
                  alt="About Us"
                  className="rounded-2xl shadow-lg h-120 w-lg object-cover"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <InfoSection />
    </div>
  );
}
