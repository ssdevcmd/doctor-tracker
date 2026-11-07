import Link from "next/link";
import {
  Stethoscope,
  Users,
  ArrowRight,
  Plus,
} from "lucide-react";

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
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Welcome section */}
      <section className="rounded-2xl bg-[#37BD83] p-6 text-white sm:p-8">
        <p className="mb-2 text-sm font-medium text-red-100">
          ADMINISTRATION
        </p>

        <h1 className="text-2xl font-bold sm:text-3xl">
          Welcome to Doctor Tracker
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-6 text-red-50">
          Manage doctors, organize patient records and monitor
          your healthcare management activities from one place.
        </p>

        <Link
          href="/dashboard/doctors/create"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#37BD83] transition hover:bg-red-50"
        >
          <Plus size={18} />
          Add New Doctor
        </Link>
      </section>

      {/* Quick actions */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-slate-800">
          Quick Access
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                href={action.href}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-red-200 hover:shadow-lg"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="rounded-xl bg-[#37BD83] p-3 text-white">
                    <Icon size={24} />
                  </div>

                  <ArrowRight
                    size={20}
                    className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-[#37BD83]"
                  />
                </div>

                <h3 className="text-lg font-semibold text-slate-800">
                  {action.title}
                </h3>

                <p className="mt-2 text-sm text-slate-500">
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