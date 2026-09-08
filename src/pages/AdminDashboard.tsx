import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import type { Doctor, ContactSubmission, SiteSettings } from "@/lib/types";
import PhotoUpload from "@/components/PhotoUpload";
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
  Hospital,
  ChevronDown,
} from "lucide-react";

type Tab = "doctors" | "messages";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("doctors");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [settingsForm, setSettingsForm] = useState({
    hospital_photo_url: "",
    featured_doctor_id: "",
  });
  const [savingSettings, setSavingSettings] = useState(false);

  const [doctorModal, setDoctorModal] = useState<{
    open: boolean;
    doctor: Doctor | null;
  }>({ open: false, doctor: null });

  const checkAuth = () => {
    if (localStorage.getItem("admin_auth") !== "true") {
      navigate("/admin");
      return false;
    }
    return true;
  };

  const loadSiteSettings = useCallback(async () => {
    const { data } = await supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .maybeSingle();
    if (data) {
      setSiteSettings(data);
      setSettingsForm({
        hospital_photo_url: data.hospital_photo_url ?? "",
        featured_doctor_id: data.featured_doctor_id ?? "",
      });
    }
  }, []);

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    const payload = {
      hospital_photo_url: settingsForm.hospital_photo_url || null,
      featured_doctor_id: settingsForm.featured_doctor_id || null,
    };
    if (siteSettings?.id) {
      await supabase
        .from("site_settings")
        .update(payload)
        .eq("id", siteSettings.id);
    } else {
      await supabase.from("site_settings").insert(payload);
    }
    await loadSiteSettings();
    setSavingSettings(false);
  };

  const loadDoctors = useCallback(async () => {
    const { data } = await supabase
      .from("doctors")
      .select("*")
      .order("created_at", { ascending: false });
    setDoctors(data ?? []);
    setLoading(false);
  }, []);

  const loadSubmissions = useCallback(async () => {
    const { data } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    setSubmissions(data ?? []);
  }, []);

  useEffect(() => {
    if (!checkAuth()) return;
    loadDoctors();
    loadSiteSettings();
  }, [loadDoctors, loadSiteSettings]);

  useEffect(() => {
    if (activeTab === "messages") {
      loadSubmissions();
    }
  }, [activeTab, loadSubmissions]);

  const handleLogout = () => {
    localStorage.setItem("admin_auth", "true");
    navigate("/admin");
  };

  const handleSaveDoctor = async (doctor: Partial<Doctor>) => {
    if (doctor.id) {
      const { error } = await supabase
        .from("doctors")
        .update({
          name: doctor.name,
          photo_url: doctor.photo_url,
          hospital_name: doctor.hospital_name,
          hospital_photo_url: doctor.hospital_photo_url,
        })
        .eq("id", doctor.id);
      if (!error) loadDoctors();
    } else {
      const { error } = await supabase.from("doctors").insert({
        name: doctor.name,
        photo_url: doctor.photo_url,
        hospital_name: doctor.hospital_name,
        hospital_photo_url: doctor.hospital_photo_url,
      });
      if (!error) loadDoctors();
    }
    setDoctorModal({ open: false, doctor: null });
    setSelectedDoctorId("");
  };

  const handleDeleteDoctor = async (id: string) => {
    if (!confirm("Are you sure you want to delete this doctor?")) return;
    const { error } = await supabase.from("doctors").delete().eq("id", id);
    if (!error) {
      loadDoctors();
      if (selectedDoctorId === id) setSelectedDoctorId("");
    }
  };

  const handleDeleteSubmission = async (id: string) => {
    const { error } = await supabase
      .from("contact_submissions")
      .delete()
      .eq("id", id);
    if (!error) loadSubmissions();
  };

  // Dropdown selection -> opens the edit modal pre-filled with that doctor's data
  const handleSelectDoctorToEdit = (id: string) => {
    setSelectedDoctorId(id);
    if (!id) return;
    const doc = doctors.find((d) => d.id === id);
    if (doc) {
      setDoctorModal({ open: true, doctor: doc });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: typeof Stethoscope }[] = [
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
              <div className="bg-linear-to-br from-teal-500 to-cyan-600 p-2 rounded-xl">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-xs text-gray-500">
                  Manage your hospital website
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Live Website Button */}
              <button
                onClick={() => window.open("/", "_blank")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition"
              >
                🌐 Live Website
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors px-4 py-2 rounded-lg hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                    ? "bg-linear-to-r from-teal-500 to-cyan-600 text-white shadow-md"
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

        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-teal-600" />
            Page Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Featured Doctor
              </label>
              <div className="relative">
                <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={settingsForm.featured_doctor_id}
                  onChange={(e) =>
                    setSettingsForm((f) => ({
                      ...f,
                      featured_doctor_id: e.target.value,
                    }))
                  }
                  className="w-full pl-11 pr-9 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all text-gray-900 bg-white appearance-none"
                >
                  <option value="">— None —</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
          <button
            onClick={handleSaveSettings}
            disabled={savingSettings}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-teal-500 to-cyan-600 text-white font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {savingSettings ? "Saving..." : "Save About Page Settings"}
          </button>
        </div>

        {/* Doctors Tab */}
        {activeTab === "doctors" && (
          <div>
            {/* Select doctor to edit */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Doctor to Edit
              </label>
              <div className="relative max-w-md">
                <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedDoctorId}
                  onChange={(e) => handleSelectDoctorToEdit(e.target.value)}
                  disabled={doctors.length === 0}
                  className="w-full pl-11 pr-10 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all appearance-none bg-white text-gray-900 font-medium disabled:bg-gray-50 disabled:text-gray-400"
                >
                  <option value="">
                    {doctors.length === 0
                      ? "No doctors yet"
                      : "-- Choose a doctor --"}
                  </option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                      {d.hospital_name ? ` — ${d.hospital_name}` : ""}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Picking a doctor here opens their profile so you can update
                their name, photo, hospital name, and hospital photo — changes
                save straight to the website.
              </p>
            </div>

            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-teal-600" />
                Manage Doctors ({doctors.length})
              </h2>
              <button
                onClick={() => setDoctorModal({ open: true, doctor: null })}
                className="inline-flex items-center gap-2 bg-linear-to-r from-teal-500 to-cyan-600 text-white font-semibold px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
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
                    className={`bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-lg transition-all ${
                      selectedDoctorId === doc.id
                        ? "border-teal-400 ring-2 ring-teal-100"
                        : "border-gray-100"
                    }`}
                  >
                    <div className="aspect-3/2 overflow-hidden bg-gray-100">
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
                      <div className="flex items-center gap-2 mt-1">
                        {doc.hospital_photo_url ? (
                          <img
                            src={doc.hospital_photo_url}
                            alt={doc.hospital_name ?? ""}
                            className="w-5 h-5 rounded-full object-cover border border-gray-200"
                          />
                        ) : (
                          <Hospital className="w-4 h-4 text-teal-500" />
                        )}
                        <p className="text-sm text-teal-600">
                          {doc.hospital_name || "—"}
                        </p>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleSelectDoctorToEdit(doc.id)}
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
                        className="shrink-0 inline-flex items-center justify-center text-red-600 bg-red-50 p-2 rounded-lg hover:bg-red-100 transition-colors"
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
          onClose={() => {
            setDoctorModal({ open: false, doctor: null });
            setSelectedDoctorId("");
          }}
        />
      )}
    </div>
  );
}

// --- Doctor Modal: exactly 4 fields ---
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
    hospital_name: doctor?.hospital_name ?? "",
    hospital_photo_url: doctor?.hospital_photo_url ?? "",
  });

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
        <div className="sticky top-0 bg-linear-to-r from-teal-600 to-cyan-700 px-6 py-4 flex items-center justify-between z-10">
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

        {/* Body — only 4 fields */}
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Doctor Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Dr. John Smith"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all text-gray-900"
              />
            </div>
          </div>

          <PhotoUpload
            label="Doctor Photo"
            value={form.photo_url}
            onChange={(url) => setForm({ ...form, photo_url: url })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Hospital Name
            </label>
            <div className="relative">
              <Hospital className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={form.hospital_name}
                onChange={(e) =>
                  setForm({ ...form, hospital_name: e.target.value })
                }
                placeholder="MediCare General Hospital"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all text-gray-900"
              />
            </div>
          </div>

          <PhotoUpload
            label="Hospital Photo"
            value={form.hospital_photo_url}
            onChange={(url) => setForm({ ...form, hospital_photo_url: url })}
          />
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
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-linear-to-r from-teal-500 to-cyan-600 text-white font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {doctor ? "Update" : "Add Doctor"}
          </button>
        </div>
      </div>
    </div>
  );
}
