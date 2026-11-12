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
/* Helpers                                                            */
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
/* Small components                                                   */
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
/* Page                                                               */
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
        if (controller.signal.aborted) return;
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
          <h1 className="text-2xl font-bold text-[#101D35]">Doctors Management</h1>
          <p className="text-sm text-slate-500">Manage all registered doctors, schedules, and statuses.</p>
        </div>
        <Link
          href="/dashboard/doctors/create"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#37BD83] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2fa370]"
        >
          <Plus size={18} aria-hidden="true" />
          Add New Doctor
        </Link>
      </div>

      {/* Notice Banner */}
      {notice && (
        <div
          className={`flex items-center gap-3 rounded-xl p-4 text-sm font-medium ${
            notice.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
          }`}
        >
          {notice.type === "success" ? <Check size={18} /> : <AlertTriangle size={18} />}
          <span>{notice.message}</span>
        </div>
      )}

      {/* Filters Bar */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search doctors..."
            value={searchText}
            onChange={handleSearchChange}
            className={`${fieldClass} w-full pl-10`}
          />
        </div>

        <select
          value={status}
          onChange={(e) => update({ status: e.target.value })}
          className={fieldClass}
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <input
          type="date"
          value={from}
          onChange={(e) => update({ from: e.target.value })}
          className={fieldClass}
          placeholder="From Date"
        />

        <input
          type="date"
          value={to}
          onChange={(e) => update({ to: e.target.value })}
          className={fieldClass}
          placeholder="To Date"
        />
      </div>

      {hasFilters && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={clear}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            <X size={14} /> Clear filters
          </button>
        </div>
      )}

      {/* Main Table Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {error ? (
          <div className="p-12 text-center">
            <AlertTriangle className="mx-auto text-red-500" size={32} />
            <p className="mt-2 text-sm font-medium text-slate-800">{error}</p>
            <button
              type="button"
              onClick={() => setReloadKey((k) => k + 1)}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <RefreshCw size={14} /> Try again
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-3.5">Name & Email</th>
                  <th className="px-5 py-3.5">Specialization</th>
                  <th className="px-5 py-3.5">Chamber & Phone</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Joined</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {loading && doctors.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                      Loading doctors...
                    </td>
                  </tr>
                ) : doctors.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                      No doctors found.
                    </td>
                  </tr>
                ) : (
                  doctors.map((doctor) => (
                    <tr key={doctor._id} className="transition hover:bg-slate-50/50">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-[#101D35]">{doctor.name}</div>
                        <div className="text-xs text-slate-500">{doctor.email}</div>
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        <div className="font-medium">{doctor.specialization || "-"}</div>
                        <div className="text-xs text-slate-400">{doctor.qualification || ""}</div>
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        <div className="font-medium">{doctor.chamber || "-"}</div>
                        <div className="text-xs text-slate-400">{doctor.phone || "-"}</div>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={doctor.status} />
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-500">
                        {formatDate(doctor.createdAt)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <RowActions doctor={doctor} onDelete={setToDelete} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} total={total} onPageChange={(p) => update({ page: String(p) })} />
      </div>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete Doctor"
        description={`Are you sure you want to delete ${toDelete?.name}? This action cannot be undone.`}
        confirmLabel="Delete Doctor"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => !deleting && setToDelete(null)}
      />
    </div>
  );
}

export default function DoctorsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading...</div>}>
      <DoctorsContent />
    </Suspense>
  );
}