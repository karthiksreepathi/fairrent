// ============================================================
// PDF Report Generator: Styled HTML for printing via window.print()
// ============================================================

import { formatCurrency } from "@/lib/rent-calculator";

export function generateReportHTML(data: {
  tenantName: string;
  address: string;
  citySlug: string;
  currentRent: number;
  fairnessScore: number;
  grade: string;
  estimatedFareRent: number;
  potentialSavings: number;
  factors: { name: string; score: number; description: string }[];
  recommendations: string[];
  comparables: { address: string; rent: number; bedrooms: number }[];
  generatedDate: string;
}): string {
  const gradeColor = getGradeColor(data.grade);
  const scoreBarWidth = Math.max(5, Math.min(100, data.fairnessScore));

  const factorRows = data.factors
    .map(
      (f) => `
      <tr>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; font-weight: 500; color: #374151;">
          ${escapeHtml(f.name)}
        </td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
          <span style="display: inline-block; background: ${getScoreBackground(f.score)}; color: white; border-radius: 12px; padding: 2px 12px; font-weight: 600; font-size: 14px;">
            ${f.score}
          </span>
        </td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 13px;">
          ${escapeHtml(f.description)}
        </td>
      </tr>`
    )
    .join("\n");

  const recommendationItems = data.recommendations
    .map(
      (r) => `
      <li style="margin-bottom: 8px; padding-left: 4px; color: #374151; line-height: 1.5;">
        ${escapeHtml(r)}
      </li>`
    )
    .join("\n");

  const comparableRows = data.comparables
    .map(
      (c) => `
      <tr>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb; color: #374151;">
          ${escapeHtml(c.address)}
        </td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb; text-align: center; color: #374151;">
          ${c.bedrooms === 0 ? "Studio" : c.bedrooms}
        </td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 500; color: #374151;">
          ${formatCurrency(c.rent)}/mo
        </td>
      </tr>`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FareRent Rent Fairness Report</title>
  <style>
    @media print {
      body { margin: 0; padding: 0; }
      .page-break { page-break-before: always; }
      .no-print { display: none !important; }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #1f2937;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 24px;
      background: #ffffff;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 3px solid #2563eb;
      padding-bottom: 20px;
      margin-bottom: 32px;
    }
    .brand {
      font-size: 28px;
      font-weight: 800;
      color: #2563eb;
      letter-spacing: -0.5px;
    }
    .brand-subtitle {
      font-size: 13px;
      color: #6b7280;
      margin-top: 2px;
    }
    .report-meta {
      text-align: right;
      font-size: 13px;
      color: #6b7280;
    }
    .section-title {
      font-size: 18px;
      font-weight: 700;
      color: #1f2937;
      margin: 32px 0 16px 0;
      padding-bottom: 8px;
      border-bottom: 2px solid #e5e7eb;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    .score-card {
      background: #f8fafc;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 24px;
      margin: 24px 0;
      display: flex;
      align-items: center;
      gap: 24px;
    }
    .grade-circle {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
      font-weight: 800;
      color: white;
      flex-shrink: 0;
    }
    .score-details {
      flex: 1;
    }
    .score-bar-container {
      width: 100%;
      height: 10px;
      background: #e5e7eb;
      border-radius: 5px;
      margin: 8px 0;
    }
    .score-bar {
      height: 100%;
      border-radius: 5px;
      transition: width 0.3s ease;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin: 16px 0;
    }
    .summary-item {
      background: #f8fafc;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 16px;
    }
    .summary-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #6b7280;
      margin-bottom: 4px;
    }
    .summary-value {
      font-size: 22px;
      font-weight: 700;
      color: #1f2937;
    }
    .footer {
      margin-top: 48px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      font-size: 12px;
      color: #9ca3af;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">FareRent</div>
      <div class="brand-subtitle">Rent Fairness Analysis Report</div>
    </div>
    <div class="report-meta">
      <div><strong>Prepared for:</strong> ${escapeHtml(data.tenantName)}</div>
      <div><strong>Property:</strong> ${escapeHtml(data.address)}</div>
      <div><strong>Date:</strong> ${escapeHtml(data.generatedDate)}</div>
    </div>
  </div>

  <!-- Score Card -->
  <div class="score-card">
    <div class="grade-circle" style="background: ${gradeColor};">
      ${escapeHtml(data.grade)}
    </div>
    <div class="score-details">
      <div style="font-size: 14px; color: #6b7280;">Overall Fairness Score</div>
      <div style="font-size: 28px; font-weight: 800; color: #1f2937;">${data.fairnessScore} / 100</div>
      <div class="score-bar-container">
        <div class="score-bar" style="width: ${scoreBarWidth}%; background: ${gradeColor};"></div>
      </div>
    </div>
  </div>

  <!-- Summary Grid -->
  <div class="summary-grid">
    <div class="summary-item">
      <div class="summary-label">Current Rent</div>
      <div class="summary-value">${formatCurrency(data.currentRent)}</div>
    </div>
    <div class="summary-item">
      <div class="summary-label">Estimated Fair Rent</div>
      <div class="summary-value" style="color: ${data.estimatedFareRent < data.currentRent ? "#16a34a" : "#1f2937"};">
        ${formatCurrency(data.estimatedFareRent)}
      </div>
    </div>
    <div class="summary-item">
      <div class="summary-label">Potential Monthly Savings</div>
      <div class="summary-value" style="color: ${data.potentialSavings > 0 ? "#16a34a" : "#6b7280"};">
        ${data.potentialSavings > 0 ? formatCurrency(data.potentialSavings) : "$0"}
      </div>
    </div>
    <div class="summary-item">
      <div class="summary-label">Potential Annual Savings</div>
      <div class="summary-value" style="color: ${data.potentialSavings > 0 ? "#16a34a" : "#6b7280"};">
        ${data.potentialSavings > 0 ? formatCurrency(data.potentialSavings * 12) : "$0"}
      </div>
    </div>
  </div>

  <!-- Detailed Factors -->
  <div class="section-title">Detailed Factor Analysis</div>
  <table>
    <thead>
      <tr>
        <th style="padding: 10px 12px; text-align: left; background: #f9fafb; border-bottom: 2px solid #e5e7eb; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280;">Factor</th>
        <th style="padding: 10px 12px; text-align: center; background: #f9fafb; border-bottom: 2px solid #e5e7eb; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280;">Score</th>
        <th style="padding: 10px 12px; text-align: left; background: #f9fafb; border-bottom: 2px solid #e5e7eb; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280;">Details</th>
      </tr>
    </thead>
    <tbody>
      ${factorRows}
    </tbody>
  </table>

  <!-- Recommendations -->
  <div class="section-title">Recommendations</div>
  <ol style="padding-left: 20px; margin: 0;">
    ${recommendationItems}
  </ol>

  ${
    data.comparables.length > 0
      ? `
  <!-- Comparable Listings -->
  <div class="section-title">Comparable Listings</div>
  <table>
    <thead>
      <tr>
        <th style="padding: 8px 12px; text-align: left; background: #f9fafb; border-bottom: 2px solid #e5e7eb; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280;">Address</th>
        <th style="padding: 8px 12px; text-align: center; background: #f9fafb; border-bottom: 2px solid #e5e7eb; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280;">Beds</th>
        <th style="padding: 8px 12px; text-align: right; background: #f9fafb; border-bottom: 2px solid #e5e7eb; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280;">Rent</th>
      </tr>
    </thead>
    <tbody>
      ${comparableRows}
    </tbody>
  </table>`
      : ""
  }

  <!-- Footer -->
  <div class="footer">
    <p>This report was generated by FareRent on ${escapeHtml(data.generatedDate)}.</p>
    <p>Data is based on publicly available rental market information and HUD Fair Market Rent standards. This report is intended for informational purposes and does not constitute legal or financial advice.</p>
    <p style="margin-top: 8px; color: #2563eb; font-weight: 500;">FareRent | farerent.com</p>
  </div>
</body>
</html>`;
}

// ---------------------
// Internal helpers
// ---------------------

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getGradeColor(grade: string): string {
  switch (grade) {
    case "A":
      return "#16a34a";
    case "B":
      return "#2563eb";
    case "C":
      return "#eab308";
    case "D":
      return "#f97316";
    case "F":
      return "#dc2626";
    default:
      return "#6b7280";
  }
}

function getScoreBackground(score: number): string {
  if (score >= 80) return "#16a34a";
  if (score >= 60) return "#2563eb";
  if (score >= 40) return "#eab308";
  if (score >= 20) return "#f97316";
  return "#dc2626";
}
