"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Users,
  Stethoscope,
  Building,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function DoctorDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [doctor, setDoctor] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDoctor = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError("");

    try {
      const data = await apiFetch(`/api/doctors/${id}`);

      setDoctor(data.doctor);
      setPatients(data.patients || []);
    } catch (err) {
      setError(err.message || "Could not load doctor details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDoctor();
  }, [fetchDoctor]);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Delete this doctor? Their patients will remain but become unassigned."
    );

    if (!confirmed) return;

    try {
      await apiFetch(`/api/doctors/${id}`, {
        method: "DELETE",
      });

      router.push("/dashboard/doctors");
    } catch (err) {
      window.alert(err.message || "Could not delete doctor.");
    }
  };

  if (loading) {
    return <p className="p-8 text-sm text-slate-500">Loading doctor...</p>;
  }

  if (error || !doctor) {
    return (
      <div className="rounded-xl bg-red-50 p-5 text-sm text-red-600">
        {error || "Doctor not found."}
        <Link
          href="/dashboard/doctors"
          className="ml-2 font-semibold underline"
        >
          Back to doctors
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Link
        href="/dashboard/doctors"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#37BD83]"
      >
        <ArrowLeft size={17} />
        Back to doctors
      </Link>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#8DE5B1]/30 text-[#101D35]">
              <Stethoscope size={30} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#101D35]">
                {doctor.name}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {doctor.specialization}
              </p>
              <span className="mt-2 inline-block rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                {doctor.status}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              href={`/dashboard/doctors/${id}/edit`}
              className="inline-flex items-center gap-2 rounded-xl bg-[#101D35] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#182944]"
            >
              <Pencil size={16} />
              Edit
            </Link>

            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-5 border-t border-slate-100 pt-6 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem icon={Mail} label="Email" value={doctor.email} />
          <InfoItem icon={Phone} label="Phone" value={doctor.phone} />
          <InfoItem icon={MapPin} label="Address" value={doctor.address} />
          <InfoItem icon={Building} label="Chamber" value={doctor.chamber} />
          <InfoItem
            icon={GraduationCap}
            label="Qualification"
            value={doctor.qualification}
          />
          <InfoItem
            icon={Stethoscope}
            label="Experience"
            value={`${doctor.experience || 0} years`}
          />
          <InfoItem
            icon={Users}
            label="Consultation Fee"
            value={`৳${doctor.consultationFee || 0}`}
          />
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="font-semibold text-[#101D35]">
              Assigned Patients
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {patients.length} patients assigned to this doctor
            </p>
          </div>
        </div>

        {patients.length === 0 ? (
          <div className="p-10 text-center">
            <Users className="mx-auto text-slate-300" size={32} />
            <p className="mt-3 text-sm text-slate-500">
              No patients assigned to this doctor yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[550px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3">Patient</th>
                  <th className="px-5 py-3">Phone</th>
                  <th className="px-5 py-3">Blood Group</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {patients.map((patient) => (
                  <tr key={patient._id}>
                    <td className="px-5 py-4 font-medium text-[#101D35]">
                      {patient.name}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {patient.phone}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {patient.bloodGroup || "—"}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {patient.status || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#8DE5B1]/25 text-[#2da873]">
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="mt-1 break-words text-sm font-medium text-[#101D35]">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
}