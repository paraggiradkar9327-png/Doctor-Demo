import { Award, ShieldCheck, Stethoscope, Heart, Users } from "lucide-react";

export default function InfoSection() {
  const HOSPITAL = {
    address: "Nagpur, Maharashtra",
    phone: "123-456-7890",
    email: "contact@hospital.com",
  };

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

  return (
    <>
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
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-br from-teal-500 to-cyan-600 mb-4">
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

      <section className="py-12 bg-linear-to-r from-teal-600 to-cyan-700">
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
    </>
  );
}
