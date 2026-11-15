"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const defaultData = [
  { month: "Jan", patients: 25 },
  { month: "Feb", patients: 38 },
  { month: "Mar", patients: 32 },
  { month: "Apr", patients: 52 },
  { month: "May", patients: 45 },
  { month: "Jun", patients: 68 },
  { month: "Jul", patients: 60 },
];

export default function PatientChart({ data = defaultData }) {
  const chartData = data.length > 0 ? data : [];

  return (
    <div className="rounded-2xl border border-[#E8EDF3] bg-white p-5 sm:p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[#101D35]">
          Patient Overview
        </h2>
        <p className="mt-1 text-sm text-[#94A3B8]">
          Monthly patient registration statistics
        </p>
      </div>

      {chartData.length === 0 ? (
        <div className="flex h-[280px] items-center justify-center text-sm text-[#94A3B8]">
          No patient statistics available.
        </div>
      ) : (
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                stroke="#EEF2F6"
                strokeDasharray="4 4"
                vertical={false}
              />

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94A3B8", fontSize: 12 }}
                dy={10}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94A3B8", fontSize: 12 }}
              />

              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #E8EDF3",
                  boxShadow: "0 4px 12px rgba(16, 29, 53, 0.06)",
                }}
                labelStyle={{
                  color: "#101D35",
                  fontWeight: 600,
                }}
              />

              <Line
                type="monotone"
                dataKey="patients"
                stroke="#37BD83"
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: "#37BD83",
                  stroke: "#FFFFFF",
                  strokeWidth: 2,
                }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}