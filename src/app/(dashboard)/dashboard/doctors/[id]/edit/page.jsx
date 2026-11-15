// client/src/app/(portal)/doctors/[id]/edit/page.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Stethoscope } from "lucide-react";
import { apiFetch } from "@/lib/api";

const fieldClass =
  "rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#37BD83] focus:ring-2 focus:ring-[#37BD83]/20 w-full";

export default function EditDoctorPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    qualification: "",
    experience: "",
    consultationFee: "",
    address: "",
    chamber: "",
    schedule: "",
    status: "active",
  });

  useEffect(() => {
    if (!id) return;
    apiFetch(`/api/doctors/${id}`)
      .then((res) => {
        const doc = res.doctor;
        if (doc) {
          setFormData({
            name: doc.name || "",
            email: doc.email || "",
            phone: doc.phone || "",
            specialization: doc.specialization || "",
            qualification: doc.qualification || "",
            experience: doc.experience || "",
            consultationFee: doc.consultationFee || "",
            address: doc.address || "",
            chamber: doc.chamber || "",
            schedule: doc.schedule || "",
            status: doc.status || "active",
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err?.message || "Failed to load doctor details.");
        setLoading(false);
      });
  }, [id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await apiFetch(`/api/doctors/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          ...formData,
          experience: Number(formData.experience) || 0,
          consultationFee: Number(formData.consultationFee) || 0,
        }),
      });

      router.push(`/dashboard/doctors/${id}`);
      router.refresh();
    } catch (err) {
      setError(err?.message || "Failed to update doctor.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="mx-auto max-w-4xl p-12 text-center text-sm text-slate-500">Loading doctor data...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link href={`/dashboard/doctors/${id}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-[#37BD83]">
          <ArrowLeft size={16} /> Back to Doctor Details
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-[#101D35]">Edit Doctor</h1>
        <p className="text-sm text-slate-500">Update professional information and schedule.</p>
      </div>

      {error && (
        <div role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Full Name *</label>
            <input name="name" required value={formData.name} onChange={handleChange} className={fieldClass} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Email Address *</label>
            <input name="email" type="email" required value={formData.email} onChange={handleChange} className={fieldClass} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Phone Number *</label>
            <input name="phone" required value={formData.phone} onChange={handleChange} className={fieldClass} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Specialization *</label>
            <input name="specialization" required value={formData.specialization} onChange={handleChange} className={fieldClass} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Qualification</label>
            <input name="qualification" value={formData.qualification} onChange={handleChange} className={fieldClass} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Experience (Years)</label>
            <input name="experience" type="number" value={formData.experience} onChange={handleChange} className={fieldClass} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Consultation Fee (BDT)</label>
            <input name="consultationFee" type="number" value={formData.consultationFee} onChange={handleChange} className={fieldClass} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className={fieldClass}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Visiting Hours / Schedule</label>
            <input name="schedule" value={formData.schedule} onChange={handleChange} placeholder="Sat - Thu: 4:00 PM - 9:00 PM" className={fieldClass} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Address</label>
            <input name="address" value={formData.address} onChange={handleChange} className={fieldClass} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Chamber</label>
            <input name="chamber" value={formData.chamber} onChange={handleChange} className={fieldClass} />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Link href={`/dashboard/doctors/${id}`} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Cancel
          </Link>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-[#37BD83] px-6 py-3 text-sm font-semibold text-white hover:bg-[#2da873] disabled:opacity-50">
            <Save size={18} /> {saving ? "Saving..." : "Update Doctor"}
          </button>
        </div>
      </form>
    </div>
  );
}