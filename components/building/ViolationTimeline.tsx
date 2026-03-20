import { AlertTriangle, CheckCircle, Clock } from "lucide-react";

interface Violation {
  date: string;
  type: string;
  description: string;
  status: "open" | "resolved" | "pending";
  severity: "minor" | "moderate" | "major" | "critical";
}

interface ViolationTimelineProps {
  violations: Violation[];
}

const severityConfig = {
  minor: { color: "text-blue-400", bg: "bg-blue-50", border: "border-blue-400/30" },
  moderate: { color: "text-amber-400", bg: "bg-amber-50", border: "border-amber-400/30" },
  major: { color: "text-orange-400", bg: "bg-[#f5f3ef]", border: "border-orange-400/30" },
  critical: { color: "text-[#dc2626]", bg: "bg-red-50", border: "border-[#dc2626]/30" },
};

const statusConfig = {
  open: { icon: AlertTriangle, color: "text-[#dc2626]", label: "Open" },
  resolved: { icon: CheckCircle, color: "text-[#16a34a]", label: "Resolved" },
  pending: { icon: Clock, color: "text-amber-400", label: "Pending" },
};

export default function ViolationTimeline({ violations }: ViolationTimelineProps) {
  if (violations.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] rounded-xl p-6 text-center">
        <CheckCircle className="w-8 h-8 text-[#16a34a] mx-auto mb-3" />
        <p className="text-sm text-[#a8a29e]">No violations on record. This is a clean building.</p>
      </div>
    );
  }

  const sorted = [...violations].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-3">
      {sorted.map((v, i) => {
        const sev = severityConfig[v.severity];
        const stat = statusConfig[v.status];
        const StatusIcon = stat.icon;

        return (
          <div key={i} className={`bg-white rounded-2xl shadow-sm border border-[#e2ddd5] rounded-xl p-4 border-l-4 ${sev.border}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold uppercase ${sev.color}`}>{v.severity}</span>
                  <span className="text-xs text-[#a8a29e]">{v.type}</span>
                </div>
                <p className="text-sm text-[#57534e] leading-relaxed">{v.description}</p>
                <p className="text-xs text-[#a8a29e] mt-1.5">
                  {new Date(v.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <StatusIcon className={`w-4 h-4 ${stat.color}`} />
                <span className={`text-xs font-medium ${stat.color}`}>{stat.label}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
