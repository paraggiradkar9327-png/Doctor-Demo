import { useEffect, useState } from "react";
import { Stethoscope, UserCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Doctor, SiteSettings } from "@/lib/types";
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
            Doctor
          </h1>
          {featuredDoctor && (
            <p className="text-teal-50 text-lg max-w-2xl mx-auto">
              {featuredDoctor.hospital_name} — A legacy of healing, a commitment
              to excellence.
            </p>
          )}
        </div>
      </section>

      {/* Featured Doctor — only the one doctor admin picked, never the full list */}
      {featuredDoctor && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-teal-600 font-semibold text-sm uppercase tracking-wider">
                Meet Our Doctor
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
                Trusted Care, Trusted Hands
              </h2>
            </div>
            <div className="max-w-4xl mx-auto bg-gray-50 rounded-3xl overflow-hidden shadow-sm border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="aspect-4/3 md:aspect-auto md:h-full overflow-hidden bg-linear-to-br from-teal-50 to-cyan-50">
                  {featuredDoctor.photo_url ? (
                    <img
                      src={featuredDoctor.photo_url}
                      alt={featuredDoctor.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <UserCircle className="w-20 h-20 text-teal-200" />
                    </div>
                  )}
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 mb-3">
                    <Stethoscope className="w-5 h-5 text-teal-600" />
                    <span className="text-xs font-semibold text-teal-600 uppercase tracking-wide">
                      Featured Doctor
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {featuredDoctor.name}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    We are dedicated to providing compassionate, reliable, and
                    high-quality healthcare focused on the individual needs of
                    every patient. Our goal is to offer professional medical
                    care in a comfortable and supportive environment, helping
                    patients make informed decisions about their health and
                    well-being.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <InfoSection />
    </div>
  );
}
