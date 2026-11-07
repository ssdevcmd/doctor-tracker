"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const defaultData = [
  { doctorName: "Dr. Sarah", totalPatients: 42 },
  { doctorName: "Dr. Michael", totalPatients: 35 },
  { doctorName: "Dr. Emily", totalPatients: 28 },
  { doctorName: "Dr. James", totalPatients: 20 },
  { doctorName: "Dr. David", totalPatients: 15 },
];

export default function DoctorChart({ data = defaultData }) {
  const chartData = data.length > 0 ? data : [];

  return (
    <div className="rounded-2xl border border-[#E8EDF3] bg-white p-5 sm:p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[#101D35]">
          Patients per Doctor
        </h2>

        <p className="mt-1 text-sm text-[#94A3B8]">
          Patient distribution among doctors
        </p>
      </div>

      {chartData.length === 0 ? (
        <div className="flex h-[280px] items-center justify-center text-sm text-[#94A3B8]">
          No doctor statistics available.
        </div>
      ) : (
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 0, right: 15, left: 5, bottom: 0 }}
            >
              <CartesianGrid
                stroke="#EEF2F6"
                strokeDasharray="4 4"
                horizontal={false}
              />

              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94A3B8", fontSize: 12 }}
              />

              <YAxis
                type="category"
                dataKey="doctorName"
                width={95}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748B", fontSize: 11 }}
              />

              <Tooltip
                cursor={{ fill: "#F4F7FB" }}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #E8EDF3",
                }}
              />

              <Bar
                dataKey="totalPatients"
                fill="#37BD83"
                radius={[0, 6, 6, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}