// client/src/app/(portal)/patients/[id]/edit/page.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { apiFetch } from "@/lib/api";

const fieldClass =
  "rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#37BD83] focus:ring-2 focus:ring-[#37BD83]/20 w-full";

export default function EditPatientPage() {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    bloodGroup: "",
    address: "",
    status: "active",
  });

  useEffect(() => {
    if (!id) return;

    apiFetch(`/api/patients/${id}`)
      .then((res) => {
        const p = res.patient;
        if (p) {
          setFormData({
            name: p.name || "",
            email: p.email || "",
            phone: p.phone || "",
            age: p.age !== null && p.age !== undefined ? String(p.age) : "",
            gender: p.gender || "",
            bloodGroup: p.bloodGroup || "",
            address: p.address || "",
            status: p.status || "active",
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err?.message || "Failed to load patient details.");
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
      await apiFetch(`/api/patients/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          ...formData,
          age: formData.age ? Number(formData.age) : null,
        }),
      });

      router.push(`/dashboard/patients/${id}`);
      router.refresh();
    } catch (err) {
      setError(err?.message || "Failed to update patient.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl p-12 text-center text-sm text-slate-500">
        Loading patient data...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          href={`/dashboard/patients/${id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-[#37BD83]"
        >
          <ArrowLeft size={16} /> Back to Patient Details
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-[#101D35]">Edit Patient</h1>
        <p className="text-sm text-slate-500">Update patient medical and contact information.</p>
      </div>

      {error && (
        <div role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Patient Name *</label>
            <input
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className={fieldClass}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Phone Number *</label>
            <input
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className={fieldClass}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Email Address</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={fieldClass}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Age</label>
            <input
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              className={fieldClass}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={fieldClass}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Blood Group</label>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              className={fieldClass}
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={fieldClass}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Address</label>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={fieldClass}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Link
            href={`/dashboard/patients/${id}`}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#37BD83] px-6 py-3 text-sm font-semibold text-white hover:bg-[#2da873] disabled:opacity-50"
          >
            <Save size={18} /> {saving ? "Saving..." : "Update Patient"}
          </button>
        </div>
      </form>
    </div>
  );
}