import {
  Heart,
  Target,
  Eye,
  Award,
  Users,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

// Hardcoded hospital info
const HOSPITAL = {
  name: "MediCare General Hospital",
  about:
    "MediCare General Hospital has been a cornerstone of healthcare excellence for over 25 years. Our state-of-the-art facility brings together world-class medical professionals, cutting-edge technology, and a patient-first philosophy.",
  address: "123 Wellness Avenue, Springfield",
  phone: "+1 (555) 123-4567",
  email: "contact@medicare-hospital.com",
};

export default function About() {
  const values = [
    {
      icon: Heart,
      title: "Compassion",
      desc: "We treat every patient with empathy, kindness, and respect.",
    },
    {
      icon: Award,
      title: "Excellence",
      desc: "We strive for the highest standards in everything we do.",
    },
    {
      icon: ShieldCheck,
      title: "Integrity",
      desc: "We act ethically and honestly in all our interactions.",
    },
    {
      icon: Users,
      title: "Teamwork",
      desc: "We collaborate to deliver the best possible care.",
    },
  ];

  const milestones = [
    {
      year: "1999",
      title: "Founded",
      desc: "MediCare opened its doors with a vision for better healthcare.",
    },
    {
      year: "2005",
      title: "Expansion",
      desc: "Added new specialized departments and doubled our capacity.",
    },
    {
      year: "2015",
      title: "Innovation",
      desc: "Introduced cutting-edge medical technology and treatments.",
    },
    {
      year: "2024",
      title: "Today",
      desc: "Serving over 50,000 patients annually with excellence.",
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative py-24 bg-gradient-to-br from-teal-700 via-cyan-700 to-teal-800 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            About Us
          </h1>
          <p className="text-teal-50 text-lg max-w-2xl mx-auto">
            {HOSPITAL.name} — A legacy of healing, a commitment to excellence.
          </p>
        </div>
      </section>

      {/* Main About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-teal-600 font-semibold text-sm uppercase tracking-wider">
                Our Story
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-6">
                {HOSPITAL.name}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {HOSPITAL.about}
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
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
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
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
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-teal-600 font-semibold text-sm uppercase tracking-wider">
              Our Core Values
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
              What Drives Us Every Day
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 mb-4">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {value.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-teal-600 font-semibold text-sm uppercase tracking-wider">
              Our Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
              Milestones Through the Years
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-teal-200 hidden md:block" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <div
                  key={i}
                  className={`flex flex-col md:flex-row items-center gap-6 ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className="flex-1">
                    <div
                      className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow ${
                        i % 2 === 0 ? "md:text-right" : "md:text-left"
                      }`}
                    >
                      <span className="text-2xl font-bold text-teal-600">
                        {m.year}
                      </span>
                      <h3 className="font-semibold text-gray-900 mt-1">
                        {m.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-2">{m.desc}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-4 h-4 rounded-full bg-teal-500 ring-4 ring-teal-100 z-10" />
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact info bar */}
      <section className="py-12 bg-gradient-to-r from-teal-600 to-cyan-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="text-white">
              <Stethoscope className="w-8 h-8 mx-auto mb-2 opacity-80" />
              <p className="text-sm text-teal-50">Address</p>
              <p className="font-semibold">{HOSPITAL.address}</p>
            </div>
            <div className="text-white">
              <ShieldCheck className="w-8 h-8 mx-auto mb-2 opacity-80" />
              <p className="text-sm text-teal-50">Phone</p>
              <p className="font-semibold">{HOSPITAL.phone}</p>
            </div>
            <div className="text-white">
              <Award className="w-8 h-8 mx-auto mb-2 opacity-80" />
              <p className="text-sm text-teal-50">Email</p>
              <p className="font-semibold">{HOSPITAL.email}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
