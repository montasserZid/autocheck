import type { FinalRecommendation, RiskLevel } from "@/types/domain";

export function RecommendationBadge({
  recommendation,
  riskLevel
}: {
  recommendation: FinalRecommendation;
  riskLevel?: RiskLevel;
}) {
  const className = recommendation === "Avoid" ? "badge danger" : "badge success";

  return (
    <span className={className}>
      {riskLevel ? `${riskLevel} risk - ` : ""}
      {recommendation}
    </span>
  );
}
