import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Doctor } from "@/lib/types";
import {
  Stethoscope,
  GraduationCap,
  Briefcase,
  UserCircle,
  Mail,
  Phone,
  X,
} from "lucide-react";

export default function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("doctors").select("*");
      setDoctors(data ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative py-24 bg-gradient-to-br from-teal-700 via-cyan-700 to-teal-800 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Our Doctors
          </h1>
          <p className="text-teal-50 text-lg max-w-2xl mx-auto">
            Meet our team of highly qualified and experienced medical
            professionals dedicated to your health.
          </p>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
              <p className="text-gray-500 mt-4">Loading doctors...</p>
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-20">
              <Stethoscope className="w-16 h-16 text-teal-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                No doctors have been added yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                >
                  {/* Photo */}
                  <div className="aspect-[3/4] overflow-hidden bg-gradient-to-br from-teal-50 to-cyan-50 relative">
                    {doctor.photo_url ? (
                      <img
                        src={doctor.photo_url}
                        alt={doctor.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <UserCircle className="w-20 h-20 text-teal-200" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <span className="inline-block bg-teal-500/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">
                        {doctor.specialization || "Doctor"}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {doctor.name}
                    </h3>
                    <p className="text-teal-600 text-sm font-medium mb-3">
                      {doctor.specialization || "Medical Professional"}
                    </p>
                    {doctor.bio && (
                      <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
                        {doctor.bio}
                      </p>
                    )}
                    <div className="space-y-2 mb-4">
                      {doctor.experience && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Briefcase className="w-4 h-4 text-teal-500" />
                          <span>{doctor.experience} experience</span>
                        </div>
                      )}
                      {doctor.education && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <GraduationCap className="w-4 h-4 text-teal-500" />
                          <span>{doctor.education}</span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedDoctor(doctor)}
                      className="w-full py-2.5 rounded-xl bg-teal-50 text-teal-700 font-semibold text-sm hover:bg-teal-100 transition-colors duration-200"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Doctor Detail Modal */}
      {selectedDoctor && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedDoctor(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <button
                onClick={() => setSelectedDoctor(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-md"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="aspect-[3/4] md:aspect-auto md:h-full overflow-hidden bg-gradient-to-br from-teal-50 to-cyan-50">
                  {selectedDoctor.photo_url ? (
                    <img
                      src={selectedDoctor.photo_url}
                      alt={selectedDoctor.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <UserCircle className="w-24 h-24 text-teal-200" />
                    </div>
                  )}
                </div>
                <div className="p-8">
                  <span className="inline-block bg-teal-50 text-teal-700 text-xs font-medium px-3 py-1 rounded-full mb-3">
                    {selectedDoctor.specialization || "Medical Professional"}
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    {selectedDoctor.name}
                  </h2>
                  {selectedDoctor.bio && (
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {selectedDoctor.bio}
                    </p>
                  )}
                  <div className="space-y-3">
                    {selectedDoctor.experience && (
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center">
                          <Briefcase className="w-4 h-4 text-teal-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wide">
                            Experience
                          </p>
                          <p className="text-sm text-gray-700 font-medium">
                            {selectedDoctor.experience}
                          </p>
                        </div>
                      </div>
                    )}
                    {selectedDoctor.education && (
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center">
                          <GraduationCap className="w-4 h-4 text-teal-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wide">
                            Education
                          </p>
                          <p className="text-sm text-gray-700 font-medium">
                            {selectedDoctor.education}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-100 flex gap-3">
                    <a
                      href="/contact"
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold py-2.5 rounded-xl text-sm hover:shadow-lg transition-all"
                    >
                      <Mail className="w-4 h-4" />
                      Book Appointment
                    </a>
                    <a
                      href="/contact"
                      className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-teal-50 text-teal-600 hover:bg-teal-100 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
