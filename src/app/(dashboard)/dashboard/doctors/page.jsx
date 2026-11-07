// "use client";

// import { useCallback, useEffect, useState } from "react";
// import Link from "next/link";
// import {
//   Plus,
//   Search,
//   Eye,
//   Pencil,
//   Trash2,
//   Stethoscope,
//   RefreshCw,
// } from "lucide-react";
// import { apiFetch } from "@/lib/api";

// export default function DoctorsPage() {
//   const [doctors, setDoctors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [search, setSearch] = useState("");
//   const [status, setStatus] = useState("");
//   const [page, setPage] = useState(1);
//   const [pagination, setPagination] = useState({
//     total: 0,
//     totalPages: 1,
//   });

//   const fetchDoctors = useCallback(async () => {
//     setLoading(true);
//     setError("");

//     try {
//       const params = new URLSearchParams({
//         page: String(page),
//         limit: "10",
//       });

//       if (search.trim()) params.set("search", search.trim());
//       if (status) params.set("status", status);

//       const data = await apiFetch(`/api/doctors?${params.toString()}`);

//       setDoctors(data.items || []);
//       setPagination({
//         total: data.total || 0,
//         totalPages: data.totalPages || 1,
//       });
//     } catch (err) {
//       setError(err.message || "Could not load doctors.");
//     } finally {
//       setLoading(false);
//     }
//   }, [page, search, status]);

//   useEffect(() => {
//     fetchDoctors();
//   }, [fetchDoctors]);

//   const handleDelete = async (id) => {
//     const confirmed = window.confirm(
//       "Are you sure you want to delete this doctor? Their patients will remain in the system but become unassigned."
//     );

//     if (!confirmed) return;

//     try {
//       await apiFetch(`/api/doctors/${id}`, {
//         method: "DELETE",
//       });

//       if (doctors.length === 1 && page > 1) {
//         setPage((previous) => previous - 1);
//       } else {
//         fetchDoctors();
//       }
//     } catch (err) {
//       window.alert(err.message || "Failed to delete doctor.");
//     }
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     setPage(1);
//     fetchDoctors();
//   };

//   return (
//     <div className="mx-auto max-w-7xl space-y-6">
//       <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
//         <div>
//           <p className="text-sm font-medium text-[#37BD83]">
//             MANAGEMENT
//           </p>
//           <h1 className="mt-1 text-2xl font-bold text-[#101D35]">
//             Doctors
//           </h1>
//           <p className="mt-1 text-sm text-slate-500">
//             Manage your doctors and their information.
//           </p>
//         </div>

//         <Link
//           href="/dashboard/doctors/create"
//           className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#37BD83] px-5 py-3 text-sm font-semibold text-white hover:bg-[#2da873]"
//         >
//           <Plus size={18} />
//           Add Doctor
//         </Link>
//       </div>

//       <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row">
//         <form onSubmit={handleSearch} className="flex flex-1 gap-2">
//           <div className="relative flex-1">
//             <Search
//               size={18}
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//             />
//             <input
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search by name, email or specialization..."
//               className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-[#37BD83]"
//             />
//           </div>

//           <button
//             type="submit"
//             className="rounded-xl bg-[#101D35] px-4 text-sm font-medium text-white hover:bg-[#182944]"
//           >
//             Search
//           </button>
//         </form>

//         <select
//           value={status}
//           onChange={(e) => {
//             setStatus(e.target.value);
//             setPage(1);
//           }}
//           className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#37BD83]"
//         >
//           <option value="">All statuses</option>
//           <option value="active">Active</option>
//           <option value="inactive">Inactive</option>
//         </select>

//         <button
//           onClick={fetchDoctors}
//           title="Refresh"
//           className="flex items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-slate-600 hover:bg-slate-50"
//         >
//           <RefreshCw size={17} />
//         </button>
//       </div>

//       <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
//         <div className="border-b border-slate-100 px-5 py-4">
//           <h2 className="font-semibold text-[#101D35]">
//             All Doctors ({pagination.total})
//           </h2>
//         </div>

//         {error && (
//           <div className="m-5 rounded-lg bg-red-50 p-4 text-sm text-red-600">
//             {error}
//           </div>
//         )}

//         {loading ? (
//           <div className="p-12 text-center text-sm text-slate-500">
//             Loading doctors...
//           </div>
//         ) : doctors.length === 0 ? (
//           <div className="p-12 text-center">
//             <Stethoscope className="mx-auto text-slate-300" size={36} />
//             <h3 className="mt-3 font-semibold text-[#101D35]">
//               No doctors found
//             </h3>
//             <p className="mt-1 text-sm text-slate-500">
//               Add a doctor or try a different search.
//             </p>
//           </div>
//         ) : (
//           <>
//             <div className="overflow-x-auto">
//               <table className="w-full min-w-[750px] text-left text-sm">
//                 <thead className="bg-slate-50 text-xs uppercase text-slate-500">
//                   <tr>
//                     <th className="px-5 py-4 font-semibold">Doctor</th>
//                     <th className="px-5 py-4 font-semibold">Phone</th>
//                     <th className="px-5 py-4 font-semibold">Specialization</th>
//                     <th className="px-5 py-4 font-semibold">Status</th>
//                     <th className="px-5 py-4 text-right font-semibold">Actions</th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-slate-100">
//                   {doctors.map((doctor) => (
//                     <tr key={doctor._id} className="hover:bg-slate-50/70">
//                       <td className="px-5 py-4">
//                         <p className="font-semibold text-[#101D35]">
//                           {doctor.name}
//                         </p>
//                         <p className="mt-1 text-xs text-slate-500">
//                           {doctor.email}
//                         </p>
//                       </td>

//                       <td className="px-5 py-4 text-slate-600">
//                         {doctor.phone}
//                       </td>

//                       <td className="px-5 py-4 text-slate-600">
//                         {doctor.specialization}
//                       </td>

//                       <td className="px-5 py-4">
//                         <span
//                           className={`rounded-full px-3 py-1 text-xs font-medium ${
//                             doctor.status === "active"
//                               ? "bg-green-50 text-green-700"
//                               : "bg-slate-100 text-slate-600"
//                           }`}
//                         >
//                           {doctor.status}
//                         </span>
//                       </td>

//                       <td className="px-5 py-4">
//                         <div className="flex justify-end gap-2">
//                           <Link
//                             href={`/dashboard/doctors/${doctor._id}`}
//                             title="View doctor"
//                             className="rounded-lg p-2 text-slate-500 hover:bg-green-50 hover:text-[#37BD83]"
//                           >
//                             <Eye size={17} />
//                           </Link>

//                           <Link
//                             href={`/dashboard/doctors/${doctor._id}/edit`}
//                             title="Edit doctor"
//                             className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
//                           >
//                             <Pencil size={17} />
//                           </Link>

//                           <button
//                             onClick={() => handleDelete(doctor._id)}
//                             title="Delete doctor"
//                             className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
//                           >
//                             <Trash2 size={17} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
//               <p className="text-sm text-slate-500">
//                 Showing page {page} of {pagination.totalPages}
//               </p>

//               <div className="flex gap-2">
//                 <button
//                   disabled={page <= 1}
//                   onClick={() => setPage((previous) => previous - 1)}
//                   className="rounded-lg border border-slate-200 px-4 py-2 text-sm disabled:opacity-40"
//                 >
//                   Previous
//                 </button>

//                 <button
//                   disabled={page >= pagination.totalPages}
//                   onClick={() => setPage((previous) => previous + 1)}
//                   className="rounded-lg border border-slate-200 px-4 py-2 text-sm disabled:opacity-40"
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }


"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Stethoscope,
  Trash2,
  X,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

const PAGE_SIZE = 10;
const SEARCH_DELAY = 400;

const fieldClass =
  "rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#37BD83] focus:ring-2 focus:ring-[#37BD83]/20";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "-"
    : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** [1, "...", 4, 5, 6, "...", 12] */
function getPageNumbers(page, totalPages) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const sorted = [...new Set([1, totalPages, page - 1, page, page + 1])]
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);
  const result = [];
  sorted.forEach((p, index) => {
    if (index > 0 && p - sorted[index - 1] > 1) result.push("...");
    result.push(p);
  });
  return result;
}

/** Search, filters and page live in the URL: shareable, and the back button works. */
function useFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = {
    search: searchParams.get("search") ?? "",
    status: searchParams.get("status") ?? "",
    from: searchParams.get("from") ?? "",
    to: searchParams.get("to") ?? "",
    page: Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1),
  };

  const update = useCallback(
    (patch) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(patch)) {
        if (!value || (key === "page" && value === "1")) next.delete(key);
        else next.set(key, value);
      }
      if (!("page" in patch)) next.delete("page"); // any filter change goes back to page 1
      const query = next.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const clear = useCallback(() => router.replace(pathname, { scroll: false }), [router, pathname]);

  return { filters, update, clear };
}

/* ------------------------------------------------------------------ */
/* Small components                                                    */
/* ------------------------------------------------------------------ */

function StatusBadge({ status }) {
  const active = status === "active";
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${
        active ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-600"
      }`}
    >
      {status || "unknown"}
    </span>
  );
}

function RowActions({ doctor, onDelete }) {
  const buttonBase = "rounded-lg p-2 text-slate-500 transition";
  return (
    <div className="flex justify-end gap-1">
      <Link
        href={`/dashboard/doctors/${doctor._id}`}
        aria-label={`View ${doctor.name}`}
        title="View doctor"
        className={`${buttonBase} hover:bg-green-50 hover:text-[#37BD83]`}
      >
        <Eye size={17} aria-hidden="true" />
      </Link>
      <Link
        href={`/dashboard/doctors/${doctor._id}/edit`}
        aria-label={`Edit ${doctor.name}`}
        title="Edit doctor"
        className={`${buttonBase} hover:bg-blue-50 hover:text-blue-600`}
      >
        <Pencil size={17} aria-hidden="true" />
      </Link>
      <button
        type="button"
        onClick={() => onDelete(doctor)}
        aria-label={`Delete ${doctor.name}`}
        title="Delete doctor"
        className={`${buttonBase} hover:bg-red-50 hover:text-red-600`}
      >
        <Trash2 size={17} aria-hidden="true" />
      </button>
    </div>
  );
}

function Pagination({ page, totalPages, total, onPageChange }) {
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);
  const arrow = "flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row">
      <p className="text-sm text-slate-500">
        Showing <span className="font-semibold text-[#101D35]">{from}-{to}</span> of{" "}
        <span className="font-semibold text-[#101D35]">{total}</span>
      </p>

      {totalPages > 1 && (
        <nav aria-label="Pagination" className="flex items-center gap-1">
          <button type="button" aria-label="Previous page" disabled={page <= 1} onClick={() => onPageChange(page - 1)} className={arrow}>
            <ChevronLeft size={17} aria-hidden="true" />
          </button>

          {getPageNumbers(page, totalPages).map((item, index) =>
            item === "..." ? (
              <span key={`gap-${index}`} aria-hidden="true" className="px-1 text-slate-400">…</span>
            ) : (
              <button
                key={item}
                type="button"
                aria-label={`Page ${item}`}
                aria-current={item === page ? "page" : undefined}
                onClick={() => onPageChange(item)}
                className={`h-9 min-w-9 rounded-lg px-2 text-sm font-medium transition ${
                  item === page ? "bg-[#37BD83] text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {item}
              </button>
            )
          )}

          <button type="button" aria-label="Next page" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} className={arrow}>
            <ChevronRight size={17} aria-hidden="true" />
          </button>
        </nav>
      )}
    </div>
  );
}

/** Accessible confirmation modal built on the native <dialog> element. */
function ConfirmDialog({ open, title, description, confirmLabel, busy, onConfirm, onCancel }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onCancel}
      onClick={(event) => event.target === ref.current && !busy && onCancel()}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl p-0 shadow-xl backdrop:bg-slate-900/40"
    >
      <div className="p-6">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">
          <AlertTriangle size={22} aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-lg font-semibold text-[#101D35]">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onCancel} disabled={busy} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} disabled={busy} className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
            {busy ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

function DoctorsContent() {
  const { filters, update, clear } = useFilters();
  const { search, status, from, to, page } = filters;
  const hasFilters = Boolean(search || status || from || to);

  // ---- search box: typing is local, the URL updates after a short pause ----
  const [searchText, setSearchText] = useState(search);
  const searchTimer = useRef(null);
  const committedSearch = useRef(search);

  useEffect(() => () => clearTimeout(searchTimer.current), []);

  useEffect(() => {
    // Search changed from outside (Clear filters, back button): show it in the box
    if (search !== committedSearch.current) {
      committedSearch.current = search;
      setSearchText(search);
    }
  }, [search]);

  function handleSearchChange(event) {
    const value = event.target.value;
    setSearchText(value);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      committedSearch.current = value.trim();
      update({ search: value.trim() });
    }, SEARCH_DELAY);
  }

  // ---- data: the old rows stay visible while the next page loads ----
  const [reloadKey, setReloadKey] = useState(0);
  const [result, setResult] = useState({ key: null, items: [], total: 0, totalPages: 1, error: "" });
  const queryKey = JSON.stringify([search, status, from, to, page, reloadKey]);
  const loading = result.key !== queryKey;

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (from) params.set("from", from);
    if (to) params.set("to", to);

    apiFetch(`/api/doctors?${params.toString()}`, { signal: controller.signal })
      .then((data) => {
        if (controller.signal.aborted) return; // a newer request replaced this one
        setResult({
          key: queryKey,
          items: data.items ?? [],
          total: data.total ?? 0,
          totalPages: Math.max(1, data.totalPages ?? 1),
          error: "",
        });
      })
      .catch((error) => {
        if (controller.signal.aborted || error?.name === "AbortError") return;
        setResult((previous) => ({ ...previous, key: queryKey, error: error?.message || "Could not load doctors." }));
      });

    return () => controller.abort();
  }, [search, status, from, to, page, reloadKey, queryKey]);

  const { items: doctors, total, totalPages, error } = result;

  // The page no longer exists (e.g. filters narrowed the list): go to the last one
  useEffect(() => {
    if (!loading && !error && page > totalPages) update({ page: String(totalPages) });
  }, [loading, error, page, totalPages, update]);

  // ---- delete with a confirmation dialog and a success / error message ----
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [notice, setNotice] = useState(null);
  const noticeTimer = useRef(null);

  useEffect(() => () => clearTimeout(noticeTimer.current), []);

  function showNotice(type, message) {
    clearTimeout(noticeTimer.current);
    setNotice({ type, message });
    noticeTimer.current = setTimeout(() => setNotice(null), 4000);
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await apiFetch(`/api/doctors/${toDelete._id}`, { method: "DELETE" });
      showNotice("success", `${toDelete.name} was deleted.`);
      setToDelete(null);
      if (doctors.length === 1 && page > 1) update({ page: String(page - 1) });
      else setReloadKey((key) => key + 1);
    } catch (err) {
      setToDelete(null);
      showNotice("error", err?.message || "Failed to delete doctor.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-[#37BD83]">MANAGEMENT</p>
          <h1 className="mt-1 text-2xl font-bold text-[#101D35]">Doctors</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your doctors and their information.</p>
        </div>

        <Link
          href="/dashboard/doctors/create"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#37BD83] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2da873]"
        >
          <Plus size={18} aria-hidden="true" />
          Add Doctor
        </Link>
      </div>

      {/* Filters */}
      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-12">
        <div className="relative sm:col-span-2 lg:col-span-5">
          <Search size={18} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            aria-label="Search doctors"
            value={searchText}
            onChange={handleSearchChange}
            placeholder="Search by name, email or specialization..."
            className={`${fieldClass} w-full pl-10 [&::-webkit-search-cancel-button]:hidden`}
          />
        </div>

        <select
          aria-label="Filter by status"
          value={status}
          onChange={(event) => update({ status: event.target.value })}
          className={`${fieldClass} lg:col-span-2`}
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-4">
          <input type="date" aria-label="Added from" value={from} max={to || undefined} onChange={(event) => update({ from: event.target.value, to })} className={`${fieldClass} min-w-0 flex-1`} />
          <span className="text-sm text-slate-400">to</span>
          <input type="date" aria-label="Added until" value={to} min={from || undefined} onChange={(event) => update({ to: event.target.value, from })} className={`${fieldClass} min-w-0 flex-1`} />
        </div>

        <div className="flex gap-2 lg:col-span-1">
          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            aria-label="Refresh"
            title="Refresh"
            className="flex flex-1 items-center justify-center rounded-xl border border-slate-200 px-3 py-3 text-slate-600 hover:bg-slate-50"
          >
            <RefreshCw size={17} aria-hidden="true" className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {hasFilters && (
          <div className="sm:col-span-2 lg:col-span-12">
            <button type="button" onClick={clear} className="inline-flex items-center gap-1.5 text-sm font-medium text-[#37BD83] hover:underline">
              <X size={14} aria-hidden="true" />
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 aria-live="polite" className="font-semibold text-[#101D35]">
            All Doctors ({total})
          </h2>
        </div>

        {error && (
          <div role="alert" className="m-5 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-red-50 p-4 text-sm text-red-600">
            <span>{error}</span>
            <button type="button" onClick={() => setReloadKey((key) => key + 1)} className="rounded-lg bg-white px-3 py-1.5 font-semibold ring-1 ring-red-200 hover:bg-red-100">
              Try again
            </button>
          </div>
        )}

        {loading && doctors.length === 0 ? (
          <div className="space-y-3 p-5" aria-busy="true" aria-label="Loading doctors">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-14 animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
        ) : doctors.length === 0 && !error ? (
          <div className="p-12 text-center">
            <Stethoscope className="mx-auto text-slate-300" size={36} aria-hidden="true" />
            <h3 className="mt-3 font-semibold text-[#101D35]">{hasFilters ? "No doctors match your filters" : "No doctors found"}</h3>
            <p className="mt-1 text-sm text-slate-500">{hasFilters ? "Try changing or clearing the filters." : "Add a doctor to get started."}</p>
            {hasFilters && (
              <button type="button" onClick={clear} className="mt-4 text-sm font-semibold text-[#37BD83] hover:underline">
                Clear all filters
              </button>
            )}
          </div>
        ) : doctors.length > 0 ? (
          <div className={`transition-opacity ${loading ? "opacity-60" : ""}`}>
            {/* Tablet and desktop: table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[760px] text-left text-sm">
                <caption className="sr-only">List of doctors</caption>
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th scope="col" className="px-5 py-4 font-semibold">Doctor</th>
                    <th scope="col" className="px-5 py-4 font-semibold">Phone</th>
                    <th scope="col" className="px-5 py-4 font-semibold">Specialization</th>
                    <th scope="col" className="px-5 py-4 font-semibold">Status</th>
                    <th scope="col" className="px-5 py-4 font-semibold">Added</th>
                    <th scope="col" className="px-5 py-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {doctors.map((doctor) => (
                    <tr key={doctor._id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-[#101D35]">{doctor.name}</p>
                        <p className="mt-1 text-xs text-slate-500">{doctor.email}</p>
                      </td>
                      <td className="px-5 py-4 text-slate-600">{doctor.phone}</td>
                      <td className="px-5 py-4 text-slate-600">{doctor.specialization}</td>
                      <td className="px-5 py-4"><StatusBadge status={doctor.status} /></td>
                      <td className="px-5 py-4 text-slate-600">{formatDate(doctor.createdAt)}</td>
                      <td className="px-5 py-4"><RowActions doctor={doctor} onDelete={setToDelete} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile: cards */}
            <ul className="divide-y divide-slate-100 md:hidden">
              {doctors.map((doctor) => (
                <li key={doctor._id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-[#101D35]">{doctor.name}</p>
                      <p className="truncate text-xs text-slate-500">{doctor.email}</p>
                    </div>
                    <StatusBadge status={doctor.status} />
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{doctor.specialization} · {doctor.phone}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-xs text-slate-400">Added {formatDate(doctor.createdAt)}</p>
                    <RowActions doctor={doctor} onDelete={setToDelete} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {doctors.length > 0 && <Pagination page={page} totalPages={totalPages} total={total} onPageChange={(next) => update({ page: String(next) })} />}
      </div>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete this doctor?"
        description={toDelete ? `${toDelete.name} will be deleted. Their patients will remain in the system but become unassigned.` : ""}
        confirmLabel="Delete"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => !deleting && setToDelete(null)}
      />

      {/* Success / error message */}
      {notice && (
        <div
          role="status"
          className={`fixed right-4 top-4 z-50 flex max-w-sm items-start gap-3 rounded-xl px-4 py-3 text-sm shadow-lg ${
            notice.type === "success" ? "bg-[#101D35] text-white" : "bg-red-600 text-white"
          }`}
        >
          {notice.type === "success" ? <Check size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-[#37BD83]" /> : <AlertTriangle size={18} aria-hidden="true" className="mt-0.5 shrink-0" />}
          <span className="flex-1">{notice.message}</span>
          <button type="button" onClick={() => setNotice(null)} aria-label="Dismiss message" className="shrink-0 opacity-70 hover:opacity-100">
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}

// useSearchParams needs a Suspense boundary
export default function DoctorsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-slate-500">Loading doctors...</div>}>
      <DoctorsContent />
    </Suspense>
  );
}