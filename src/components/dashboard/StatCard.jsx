import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export default function StatCard({
  title,
  value = 0,
  change,
  description,
  icon: Icon,
  iconColor = "text-[#37BD83]",
  iconBg = "bg-[#E8F8EF]",
}) {
  const isPositive = Number(change) >= 0;

  return (
    <div className="rounded-2xl border border-[#E8EDF3] bg-white p-5 transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-[#64748B]">{title}</p>

        {Icon && (
          <div className={`rounded-xl p-3 ${iconBg}`}>
            <Icon size={21} className={iconColor} />
          </div>
        )}
      </div>

      <div className="mt-5">
        <h3 className="text-3xl font-bold tracking-tight text-[#101D35]">
          {Number(value).toLocaleString()}
        </h3>

        {(change !== undefined || description) && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {change !== undefined && (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
                  isPositive
                    ? "bg-[#E8F8EF] text-[#269B68]"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {isPositive ? (
                  <ArrowUpRight size={14} />
                ) : (
                  <ArrowDownRight size={14} />
                )}
                {Math.abs(Number(change))}%
              </span>
            )}

            {description && (
              <span className="text-xs text-[#94A3B8]">
                {description}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}