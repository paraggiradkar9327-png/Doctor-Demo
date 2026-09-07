import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import type { Hospital, Doctor, ContactSubmission } from "@/lib/types";
import {
  LogOut,
  Building2,
  Stethoscope,
  Inbox,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Image as ImageIcon,
  Briefcase,
  GraduationCap,
  FileText,
  CheckCircle,
  AlertCircle,
  ChevronDown,
} from "lucide-react";

type Tab = "hospital" | "doctors" | "messages";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("hospital");
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>("");
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");

  // Doctor modal state
  const [doctorModal, setDoctorModal] = useState<{
    open: boolean;
    doctor: Doctor | null;
  }>({ open: false, doctor: null });

  const checkAuth = () => {
    if (sessionStorage.getItem("admin_auth") !== "true") {
      navigate("/admin");
      return false;
    }
    return true;
  };

  const loadHospitals = useCallback(async () => {
    const { data } = await supabase.from("hospitals").select("*");
    if (data && data.length > 0) {
      setHospitals(data);
      if (!selectedHospitalId) {
        setSelectedHospitalId(data[0].id);
      }
    }
    setLoading(false);
  }, [selectedHospitalId]);

  const loadHospitalData = useCallback(async () => {
    if (!selectedHospitalId) return;
    const { data: hospData } = await supabase
      .from("hospitals")
      .select("*")
      .eq("id", selectedHospitalId)
      .maybeSingle();
    setHospital(hospData);

    const { data: docData } = await supabase
      .from("doctors")
      .select("*")
      .eq("hospital_id", selectedHospitalId);
    setDoctors(docData ?? []);
  }, [selectedHospitalId]);

  const loadSubmissions = useCallback(async () => {
    const { data } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    setSubmissions(data ?? []);
  }, []);

  useEffect(() => {
    if (!checkAuth()) return;
    loadHospitals();
  }, [loadHospitals]);

  useEffect(() => {
    if (selectedHospitalId) {
      loadHospitalData();
    }
  }, [selectedHospitalId, loadHospitalData]);

  useEffect(() => {
    if (activeTab === "messages") {
      loadSubmissions();
    }
  }, [activeTab, loadSubmissions]);

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    navigate("/admin");
  };

  const handleSaveHospital = async () => {
    if (!hospital) return;
    setSaveStatus("saving");
    const { error } = await supabase
      .from("hospitals")
      .update({
        name: hospital.name,
        photo_url: hospital.photo_url,
        description: hospital.description,
        about: hospital.about,
        address: hospital.address,
        phone: hospital.phone,
        email: hospital.email,
      })
      .eq("id", hospital.id);
    if (error) {
      setSaveStatus("error");
    } else {
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  const handleSaveDoctor = async (doctor: Partial<Doctor>) => {
    if (doctor.id) {
      const { error } = await supabase
        .from("doctors")
        .update({
          name: doctor.name,
          photo_url: doctor.photo_url,
          specialization: doctor.specialization,
          bio: doctor.bio,
          experience: doctor.experience,
          education: doctor.education,
        })
        .eq("id", doctor.id);
      if (!error) loadHospitalData();
    } else {
      const { error } = await supabase.from("doctors").insert({
        hospital_id: selectedHospitalId || null,
        name: doctor.name,
        photo_url: doctor.photo_url,
        specialization: doctor.specialization,
        bio: doctor.bio,
        experience: doctor.experience,
        education: doctor.education,
      });
      if (!error) loadHospitalData();
    }
    setDoctorModal({ open: false, doctor: null });
  };

  const handleDeleteDoctor = async (id: string) => {
    if (!confirm("Are you sure you want to delete this doctor?")) return;
    const { error } = await supabase.from("doctors").delete().eq("id", id);
    if (!error) loadHospitalData();
  };

  const handleDeleteSubmission = async (id: string) => {
    const { error } = await supabase
      .from("contact_submissions")
      .delete()
      .eq("id", id);
    if (!error) loadSubmissions();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: typeof Building2 }[] = [
    { id: "hospital", label: "Hospital Info", icon: Building2 },
    { id: "doctors", label: "Doctors", icon: Stethoscope },
    { id: "messages", label: "Messages", icon: Inbox },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-teal-500 to-cyan-600 p-2 rounded-xl">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-xs text-gray-500">
                  Manage your hospital website
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors px-4 py-2 rounded-lg hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hospital selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Hospital
          </label>
          <div className="relative max-w-md">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={selectedHospitalId}
              onChange={(e) => setSelectedHospitalId(e.target.value)}
              className="w-full pl-11 pr-10 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all appearance-none bg-white text-gray-900 font-medium"
            >
              {hospitals.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white rounded-xl p-1.5 shadow-sm border border-gray-100 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.id === "messages" && submissions.length > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      activeTab === tab.id
                        ? "bg-white/20 text-white"
                        : "bg-teal-100 text-teal-700"
                    }`}
                  >
                    {submissions.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Hospital Tab */}
        {activeTab === "hospital" && hospital && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-teal-600" />
                Edit Hospital Information
              </h2>
              {saveStatus === "success" && (
                <span className="inline-flex items-center gap-1.5 text-sm text-green-600 font-medium">
                  <CheckCircle className="w-4 h-4" />
                  Saved!
                </span>
              )}
              {saveStatus === "error" && (
                <span className="inline-flex items-center gap-1.5 text-sm text-red-600 font-medium">
                  <AlertCircle className="w-4 h-4" />
                  Error saving
                </span>
              )}
            </div>
            <div className="p-6 space-y-5">
              {/* Photo preview */}
              {hospital.photo_url && (
                <div className="mb-4">
                  <img
                    src={hospital.photo_url}
                    alt={hospital.name}
                    className="w-full h-48 object-cover rounded-xl border border-gray-200"
                  />
                </div>
              )}

              <FormField
                icon={Building2}
                label="Hospital Name"
                value={hospital.name}
                onChange={(v) => setHospital({ ...hospital, name: v })}
              />
              <FormField
                icon={ImageIcon}
                label="Hospital Photo URL"
                value={hospital.photo_url ?? ""}
                onChange={(v) => setHospital({ ...hospital, photo_url: v })}
                placeholder="https://..."
              />
              <FormField
                icon={FileText}
                label="Short Description (Home page)"
                value={hospital.description ?? ""}
                onChange={(v) => setHospital({ ...hospital, description: v })}
                textarea
              />
              <FormField
                icon={FileText}
                label="About Text (About Us page)"
                value={hospital.about ?? ""}
                onChange={(v) => setHospital({ ...hospital, about: v })}
                textarea
                rows={5}
              />
              <FormField
                icon={MapPin}
                label="Address"
                value={hospital.address ?? ""}
                onChange={(v) => setHospital({ ...hospital, address: v })}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField
                  icon={Phone}
                  label="Phone"
                  value={hospital.phone ?? ""}
                  onChange={(v) => setHospital({ ...hospital, phone: v })}
                />
                <FormField
                  icon={Mail}
                  label="Email"
                  value={hospital.email ?? ""}
                  onChange={(v) => setHospital({ ...hospital, email: v })}
                />
              </div>

              <button
                onClick={handleSaveHospital}
                disabled={saveStatus === "saving"}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 disabled:opacity-60"
              >
                {saveStatus === "saving" ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Doctors Tab */}
        {activeTab === "doctors" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-teal-600" />
                Manage Doctors ({doctors.length})
              </h2>
              <button
                onClick={() => setDoctorModal({ open: true, doctor: null })}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                Add Doctor
              </button>
            </div>

            {doctors.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <Stethoscope className="w-12 h-12 text-teal-200 mx-auto mb-3" />
                <p className="text-gray-500">
                  No doctors yet. Click "Add Doctor" to create one.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {doctors.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all"
                  >
                    <div className="aspect-[3/2] overflow-hidden bg-gray-100">
                      {doc.photo_url ? (
                        <img
                          src={doc.photo_url}
                          alt={doc.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-teal-50">
                          <User className="w-10 h-10 text-teal-200" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900">
                        {doc.name}
                      </h3>
                      <p className="text-sm text-teal-600">
                        {doc.specialization}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() =>
                            setDoctorModal({ open: true, doctor: doc })
                          }
                          className="flex-1 inline-flex items-center justify-center gap-1.5 text-sm font-medium text-teal-700 bg-teal-50 py-2 rounded-lg hover:bg-teal-100 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteDoctor(doc.id)}
                          className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-red-600 bg-red-50 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === "messages" && (
          <div>
            <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <Inbox className="w-5 h-5 text-teal-600" />
              Contact Form Submissions ({submissions.length})
            </h2>
            {submissions.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <Inbox className="w-12 h-12 text-teal-200 mx-auto mb-3" />
                <p className="text-gray-500">No messages yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {submissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="w-4 h-4 text-teal-500" />
                          <h3 className="font-semibold text-gray-900">
                            {sub.name}
                          </h3>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                          <span className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5" />
                            {sub.email}
                          </span>
                          {sub.phone && (
                            <span className="flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5" />
                              {sub.phone}
                            </span>
                          )}
                          <span className="text-xs text-gray-400">
                            {new Date(sub.created_at).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 leading-relaxed">
                          {sub.message}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteSubmission(sub.id)}
                        className="flex-shrink-0 inline-flex items-center justify-center text-red-600 bg-red-50 p-2 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Doctor Modal */}
      {doctorModal.open && (
        <DoctorModal
          doctor={doctorModal.doctor}
          onSave={handleSaveDoctor}
          onClose={() => setDoctorModal({ open: false, doctor: null })}
        />
      )}
    </div>
  );
}

// --- Form Field Component ---
function FormField({
  icon: Icon,
  label,
  value,
  onChange,
  placeholder,
  textarea,
  rows = 3,
}: {
  icon: typeof User;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  textarea?: boolean;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        {textarea ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all text-gray-900 resize-none"
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all text-gray-900"
          />
        )}
      </div>
    </div>
  );
}

// --- Doctor Modal ---
function DoctorModal({
  doctor,
  onSave,
  onClose,
}: {
  doctor: Doctor | null;
  onSave: (d: Partial<Doctor>) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: doctor?.name ?? "",
    photo_url: doctor?.photo_url ?? "",
    specialization: doctor?.specialization ?? "",
    bio: doctor?.bio ?? "",
    experience: doctor?.experience ?? "",
    education: doctor?.education ?? "",
  });

  const fields: {
    key: keyof typeof form;
    label: string;
    icon: typeof User;
    textarea?: boolean;
    placeholder?: string;
  }[] = [
    {
      key: "name",
      label: "Doctor Name",
      icon: User,
      placeholder: "Dr. John Smith",
    },
    {
      key: "photo_url",
      label: "Photo URL",
      icon: ImageIcon,
      placeholder: "https://...",
    },
    {
      key: "specialization",
      label: "Specialization",
      icon: Stethoscope,
      placeholder: "Cardiologist",
    },
    {
      key: "experience",
      label: "Experience",
      icon: Briefcase,
      placeholder: "15+ years",
    },
    {
      key: "education",
      label: "Education",
      icon: GraduationCap,
      placeholder: "MD, Harvard",
    },
    {
      key: "bio",
      label: "Biography",
      icon: FileText,
      textarea: true,
      placeholder: "About the doctor...",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-teal-600 to-cyan-700 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Stethoscope className="w-5 h-5" />
            {doctor ? "Edit Doctor" : "Add New Doctor"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {form.photo_url && (
            <div className="mb-2">
              <img
                src={form.photo_url}
                alt="Preview"
                className="w-24 h-24 rounded-xl object-cover border border-gray-200 mx-auto"
              />
            </div>
          )}
          {fields.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {f.label}
                </label>
                <div className="relative">
                  <Icon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  {f.textarea ? (
                    <textarea
                      value={form[f.key]}
                      onChange={(e) =>
                        setForm({ ...form, [f.key]: e.target.value })
                      }
                      placeholder={f.placeholder}
                      rows={4}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all text-gray-900 resize-none"
                    />
                  ) : (
                    <input
                      type="text"
                      value={form[f.key]}
                      onChange={(e) =>
                        setForm({ ...form, [f.key]: e.target.value })
                      }
                      placeholder={f.placeholder}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all text-gray-900"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave({ ...form, id: doctor?.id })}
            disabled={!form.name}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {doctor ? "Update" : "Add Doctor"}
          </button>
        </div>
      </div>
    </div>
  );
}
