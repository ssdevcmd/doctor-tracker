"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import DoctorForm from "@/components/doctors/DoctorForm";
import { apiFetch } from "@/lib/api";

export default function CreateDoctorPage() {
  const router = useRouter();

  const handleCreateDoctor = async (formData) => {
    const data = await apiFetch("/api/doctors", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    router.push(`/dashboard/doctors/${data.doctor._id}`);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          href="/dashboard/doctors"
          className="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#37BD83]"
        >
          <ArrowLeft size={17} />
          Back to doctors
        </Link>

        <h1 className="text-2xl font-bold text-[#101D35]">
          Add New Doctor
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Enter the doctor's information below.
        </p>
      </div>

      <DoctorForm
        onSubmit={handleCreateDoctor}
        submitLabel="Create Doctor"
      />
    </div>
  );
}