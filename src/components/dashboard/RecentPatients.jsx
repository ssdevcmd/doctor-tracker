import Link from "next/link";
import { ArrowRight, UserRound } from "lucide-react";

export default function RecentPatients({ patients = [] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E8EDF3] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E8EDF3] p-5 sm:px-6">
        <div>
          <h2 className="text-lg font-semibold text-[#101D35]">
            Recent Patients
          </h2>

          <p className="mt-1 text-sm text-[#94A3B8]">
            Recently added patients
          </p>
        </div>

        <Link
          href="/dashboard/patients"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#269B68] transition hover:text-[#187A50]"
        >
          View All
          <ArrowRight size={16} />
        </Link>
      </div>

      {patients.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
          <div className="mb-3 rounded-full bg-[#E8F8EF] p-4">
            <UserRound size={25} className="text-[#37BD83]" />
          </div>

          <h3 className="font-semibold text-[#101D35]">
            No patients found
          </h3>

          <p className="mt-1 text-sm text-[#94A3B8]">
            Newly registered patients will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[550px] text-left">
            <thead>
              <tr className="bg-[#F8FAFC] text-xs uppercase tracking-wider text-[#94A3B8]">
                <th className="px-6 py-4 font-semibold">Patient</th>
                <th className="px-6 py-4 font-semibold">Doctor</th>
                <th className="px-6 py-4 font-semibold">Date Added</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E8EDF3]">
              {patients.map((patient) => (
                <tr
                  key={patient._id || patient.id}
                  className="transition hover:bg-[#F8FAFC]"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8F8EF]">
                        <UserRound size={18} className="text-[#269B68]" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-[#101D35]">
                          {patient.name || "Unnamed Patient"}
                        </p>

                        <p className="mt-1 text-xs text-[#94A3B8]">
                          {patient.email || "No email"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-[#64748B]">
                    {patient.doctorName || "Not assigned"}
                  </td>

                  <td className="px-6 py-4 text-sm text-[#64748B]">
                    {patient.createdAt
                      ? new Date(patient.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full bg-[#E8F8EF] px-3 py-1 text-xs font-medium capitalize text-[#269B68]">
                      {patient.status || "Active"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}