
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Stethoscope,
  Users,
  UserPlus,
  Activity,
  ArrowRight,
  Plus,
} from "lucide-react";

import StatCard from "@/components/dashboard/StatCard";
import PatientChart from "@/components/dashboard/PatientChart";
import DoctorChart from "@/components/dashboard/DoctorChart";
import RecentPatients from "@/components/dashboard/RecentPatients";

const quickActions = [
  {
    title: "Manage Doctors",
    description: "Add, update and manage doctor information.",
    href: "/dashboard/doctors",
    icon: Stethoscope,
  },
  {
    title: "Manage Patients",
    description: "View and manage all registered patients.",
    href: "/dashboard/patients",
    icon: Users,
  },
];

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    newPatients: 0,
    activePatients: 0,
  });

  const [monthlyPatients, setMonthlyPatients] = useState([]);
  const [patientsPerDoctor, setPatientsPerDoctor] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

        const [statsRes, chartRes, doctorRes, patientsRes] =
          await Promise.all([
            fetch(`${API_URL}/api/dashboard/stats`),
            fetch(`${API_URL}/api/dashboard/monthly-patients`),
            fetch(`${API_URL}/api/dashboard/patients-per-doctor`),
            fetch(`${API_URL}/api/patients?limit=5&page=1`),
          ]);

        if (statsRes.ok) {
          const data = await statsRes.json();
          setStats(data);
        }

        if (chartRes.ok) {
          const data = await chartRes.json();
          setMonthlyPatients(data);
        }

        if (doctorRes.ok) {
          const data = await doctorRes.json();
          setPatientsPerDoctor(data);
        }

        if (patientsRes.ok) {
          const data = await patientsRes.json();
          setRecentPatients(
            data.items || data.patients || data.data || []
          );
        }
      } catch (error) {
        console.error("Dashboard data loading failed:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-8">

      {/* Welcome section */}
      <section className="rounded-2xl bg-[#37BD83] p-6 text-white sm:p-8">
        <p className="mb-2 text-sm font-medium text-white/80">
          ADMINISTRATION
        </p>

        <h1 className="text-2xl font-bold sm:text-3xl">
          Welcome to Doctor Tracker
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-6 text-white/90">
          Manage doctors, organize patient records and monitor
          your healthcare management activities from one place.
        </p>

        <Link
          href="/dashboard/doctors/create"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#269B68] transition hover:bg-[#E8F8EF]"
        >
          <Plus size={18} />
          Add New Doctor
        </Link>
      </section>

      {/* Statistics */}
      <section>
        <div className="mb-5">
          <h2 className="text-xl font-bold text-[#101D35]">
            Overview
          </h2>
          <p className="mt-1 text-sm text-[#64748B]">
            Your healthcare management statistics.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Doctors"
            value={stats.totalDoctors}
            icon={Stethoscope}
          />

          <StatCard
            title="Total Patients"
            value={stats.totalPatients}
            icon={Users}
          />

          <StatCard
            title="New Patients"
            value={stats.newPatients}
            icon={UserPlus}
          />

          <StatCard
            title="Active Patients"
            value={stats.activePatients}
            icon={Activity}
          />
        </div>
      </section>

      {/* Charts */}
      <section>
        <div className="mb-5">
          <h2 className="text-xl font-bold text-[#101D35]">
            Analytics
          </h2>
          <p className="mt-1 text-sm text-[#64748B]">
            Monitor patient growth and doctor workloads.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <PatientChart data={monthlyPatients} />
          <DoctorChart data={patientsPerDoctor} />
        </div>
      </section>

      {/* Recent patients */}
      <section>
        <RecentPatients patients={recentPatients} />
      </section>

      {/* Quick actions */}
      <section>
        <div className="mb-5">
          <h2 className="text-xl font-bold text-[#101D35]">
            Quick Access
          </h2>
          <p className="mt-1 text-sm text-[#64748B]">
            Quickly access your management pages.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                href={action.href}
                className="group rounded-2xl border border-[#E8EDF3] bg-white p-6 transition hover:border-[#8DE5B1] hover:shadow-md"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="rounded-xl bg-[#E8F8EF] p-3 text-[#269B68]">
                    <Icon size={24} />
                  </div>

                  <ArrowRight
                    size={20}
                    className="text-[#94A3B8] transition group-hover:translate-x-1 group-hover:text-[#37BD83]"
                  />
                </div>

                <h3 className="text-lg font-semibold text-[#101D35]">
                  {action.title}
                </h3>

                <p className="mt-2 text-sm text-[#64748B]">
                  {action.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

    </div>
  );
}
