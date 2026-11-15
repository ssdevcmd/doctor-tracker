"use client";

import { useState } from "react";
import { Save } from "lucide-react";

const initialFormData = {
  name: "",
  email: "",
  phone: "",
  specialization: "",
  qualification: "",
  experience: "",
  consultationFee: "",
  address: "",
};

export default function DoctorForm({
  initialData,
  onSubmit,
  submitLabel = "Save Doctor",
}) {
  const [formData, setFormData] = useState(() => ({
    ...initialFormData,
    ...initialData,
    experience: initialData?.experience ?? "",
    consultationFee: initialData?.consultationFee ?? "",
  }));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await onSubmit({
        ...formData,
        experience: Number(formData.experience) || 0,
        consultationFee: Number(formData.consultationFee) || 0,
      });
    } catch (err) {
      setError(err.message || "Failed to save doctor.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "name", label: "Full Name", placeholder: "Dr. Sarah Ahmed", required: true },
    { name: "email", label: "Email Address", placeholder: "doctor@example.com", type: "email", required: true },
    { name: "phone", label: "Phone Number", placeholder: "01712345678", required: true },
    { name: "specialization", label: "Specialization", placeholder: "Cardiology", required: true },
    { name: "qualification", label: "Qualification", placeholder: "MBBS, FCPS" },
    { name: "experience", label: "Experience (years)", placeholder: "8", type: "number" },
    { name: "consultationFee", label: "Consultation Fee", placeholder: "1000", type: "number" },
    { name: "schedule", label: "Visiting Hours / Schedule", placeholder: "Sat - Thu: 4:00 PM - 9:00 PM" },
    { name: "address", label: "Address", placeholder: "Dhaka, Bangladesh" },
    { name: "chamber", label: "Chamber", placeholder: "Dhaka Medical Center" },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map((field) => (
          <div
            key={field.name}
            className={field.name === "address" ? "sm:col-span-2" : ""}
          >
            <label
              htmlFor={field.name}
              className="mb-2 block text-sm font-medium text-[#101D35]"
            >
              {field.label}
              {field.required && <span className="ml-1 text-red-500">*</span>}
            </label>

            <input
              id={field.name}
              name={field.name}
              type={field.type || "text"}
              value={formData[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              required={field.required}
              min={field.type === "number" ? "0" : undefined}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#101D35] outline-none transition placeholder:text-slate-400 focus:border-[#37BD83] focus:ring-2 focus:ring-[#8DE5B1]/30"
            />
          </div>
        ))}
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-[#37BD83] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2da873] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={17} />
          {loading ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}