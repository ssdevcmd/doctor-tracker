"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, UserPlus, Users, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function PatientsListPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPatients();
    }, 400); // Debounce search
    return () => clearTimeout(timer);
  }, [search, page]);

  async function fetchPatients() {
    setLoading(true);
    try {
      const query = new URLSearchParams({ page: String(page), limit: '10' });
      if (search) query.set('search', search);

      const res = await apiFetch(`/api/patients?${query.toString()}`);
      setPatients(res.items || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch patients:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#101D35]">Patient Management</h1>
          <p className="text-sm text-slate-500">View and manage all registered patients.</p>
        </div>
        <Link
          href="/dashboard/patients/create"
          className="inline-flex items-center gap-2 rounded-xl bg-[#37BD83] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2da873] shadow-sm transition"
        >
          <UserPlus size={18} /> Add New Patient
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-2xl border border-slate-200">
        <div className="relative w-full sm:w-80">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#37BD83]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {loading ? (
          <div className="p-12 text-center text-sm text-slate-500">Loading patients...</div>
        ) : patients.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="mx-auto text-slate-300" size={36} />
            <h3 className="mt-3 font-semibold text-[#101D35]">No patients found</h3>
            <p className="mt-1 text-sm text-slate-500">Try adjusting your search query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Patient Name</th>
                  <th className="px-5 py-4 font-semibold">Age / Gender</th>
                  <th className="px-5 py-4 font-semibold">Phone</th>
                  <th className="px-5 py-4 font-semibold">Assigned Doctor</th>
                  <th className="px-5 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patients.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-[#101D35]">{p.name}</div>
                      <div className="text-xs text-slate-400">{p.email || "No email"}</div>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{p.age ? `${p.age} yrs` : "N/A"} / {p.gender || "N/A"}</td>
                    <td className="px-5 py-4 text-slate-600">{p.phone}</td>
                    <td className="px-5 py-4 text-slate-600">{p.doctorName || <span className="text-amber-600 italic">Unassigned</span>}</td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/dashboard/patients/${p._id}`}
                        className="inline-flex items-center gap-1 rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-[#37BD83] hover:bg-green-100 transition"
                      >
                        <Eye size={14} /> Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <span className="text-xs text-slate-500">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}