// client/src/app/(portal)/patients/create/page.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, UserPlus } from "lucide-react";
import { apiFetch } from "@/lib/api";

const fieldClass = "rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#37BD83] focus:ring-2 focus:ring-[#37BD83]/20 w-full";

export default function CreatePatientPage() {
  const router = useRouter();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    bloodGroup: "",
    address: "",
    doctorId: "",
  });

  useEffect(() => {
    apiFetch("/api/doctors?limit=100")
      .then((res) => setDoctors(res.items || []))
      .catch((err) => console.error("Failed to load doctors:", err));
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await apiFetch("/api/patients", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          age: Number(formData.age) || null,
        }),
      });

      router.push("/dashboard/patients");
      router.refresh();
    } catch (err) {
      setError(err?.message || "Failed to create patient.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link href="/dashboard/patients" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-[#37BD83]">
          <ArrowLeft size={16} /> Back to Patients
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-[#101D35]">Add New Patient</h1>
        <p className="text-sm text-slate-500">Register a new patient and assign to a doctor.</p>
      </div>

      {error && <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-200">{error}</div>}

      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Patient Name *</label>
            <input name="name" required value={formData.name} onChange={handleChange} placeholder="Alex Morgan" className={fieldClass} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Phone Number *</label>
            <input name="phone" required value={formData.phone} onChange={handleChange} placeholder="01812345678" className={fieldClass} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Email Address</label>
            <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="alex@example.com" className={fieldClass} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Age</label>
            <input name="age" type="number" value={formData.age} onChange={handleChange} placeholder="30" className={fieldClass} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} className={fieldClass}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Blood Group</label>
            <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className={fieldClass}>
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option><option value="A-">A-</option>
              <option value="B+">B+</option><option value="B-">B-</option>
              <option value="O+">O+</option><option value="O-">O-</option>
              <option value="AB+">AB+</option><option value="AB-">AB-</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Assign Doctor</label>
            <select name="doctorId" value={formData.doctorId} onChange={handleChange} className={fieldClass}>
              <option value="">Select Doctor (Optional)</option>
              {doctors.map((doc) => (
                <option key={doc._id} value={doc._id}>{doc.name} ({doc.specialization})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Address</label>
            <input name="address" value={formData.address} onChange={handleChange} placeholder="Dhanmondi, Dhaka" className={fieldClass} />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Link href="/dashboard/patients" className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</Link>
          <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-[#37BD83] px-6 py-3 text-sm font-semibold text-white hover:bg-[#2da873] disabled:opacity-50">
            <UserPlus size={18} /> {loading ? "Saving..." : "Save Patient"}
          </button>
        </div>
      </form>
    </div>
  );
}