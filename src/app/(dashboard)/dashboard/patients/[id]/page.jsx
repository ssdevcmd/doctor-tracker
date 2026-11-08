// client/src/app/(portal)/patients/[id]/page.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, User, Mail, Phone, MapPin, Activity, Stethoscope } from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function PatientDetailPage() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      apiFetch(`/api/patients/${id}`),
      apiFetch("/api/doctors?limit=100"),
    ])
      .then(([patientRes, doctorRes]) => {
        setPatient(patientRes.patient);
        setSelectedDoctor(patientRes.patient.doctorId || "");
        setDoctors(doctorRes.items || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load patient details:", err);
        setLoading(false);
      });
  }, [id]);

  async function handleUpdateDoctor(e) {
    e.preventDefault();
    try {
      await apiFetch(`/api/patients/${id}/doctor`, {
        method: "PATCH",
        body: JSON.stringify({ doctorId: selectedDoctor || null }),
      });
      alert("Doctor assignment updated successfully!");
    } catch (err) {
      alert(err.message || "Failed to update doctor assignment");
    }
  }

  if (loading) return <div className="mx-auto max-w-5xl p-12 text-center text-sm text-slate-500">Loading patient details...</div>;
  if (!patient) return <div className="mx-auto max-w-5xl p-12 text-center text-red-600">Patient not found.</div>;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <Link href="/dashboard/patients" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-[#37BD83]">
          <ArrowLeft size={16} /> Back to Patients
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-[#101D35]">{patient.name}</h1>
        <p className="text-sm text-slate-500">Patient Medical Profile</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 md:col-span-1">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <User size={32} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#101D35]">{patient.name}</h2>
            <p className="text-sm text-slate-500">{patient.age ? `${patient.age} yrs` : ""} {patient.gender ? `• ${patient.gender}` : ""}</p>
          </div>
          <div className="space-y-2 pt-2 text-sm text-slate-600 border-t border-slate-100">
            <p className="flex items-center gap-2"><Phone size={16} className="text-slate-400" /> {patient.phone}</p>
            <p className="flex items-center gap-2"><Mail size={16} className="text-slate-400" /> {patient.email || "No email"}</p>
            <p className="flex items-center gap-2"><MapPin size={16} className="text-slate-400" /> {patient.address || "No address"}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-6 md:col-span-2">
          <div>
            <h3 className="text-base font-bold text-[#101D35] mb-4">Medical Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-slate-50 p-4">
                <span className="text-xs uppercase text-slate-400 font-semibold">Blood Group</span>
                <p className="mt-1 font-bold text-[#101D35] text-lg">{patient.bloodGroup || "N/A"}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <span className="text-xs uppercase text-slate-400 font-semibold">Status</span>
                <p className="mt-1 font-bold text-green-600 text-lg capitalize">{patient.status || "Active"}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h3 className="text-base font-bold text-[#101D35] mb-2 flex items-center gap-2">
              <Stethoscope size={18} className="text-[#37BD83]" /> Assigned Doctor
            </h3>
            <form onSubmit={handleUpdateDoctor} className="flex gap-3 items-center mt-3">
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#37BD83]"
              >
                <option value="">-- Unassigned --</option>
                {doctors.map((doc) => (
                  <option key={doc._id} value={doc._id}>{doc.name} ({doc.specialization})</option>
                ))}
              </select>
              <button type="submit" className="rounded-xl bg-[#101D35] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#182944] transition">
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}