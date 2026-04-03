import { useState } from "react";

export default function Home() {
  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, margin: 0 }}>Clearway</h1>
        <p style={{ color: "#666", marginTop: 6 }}>Blue Haven Homes — Procurement Platform</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
        <ModuleCard title="Vendor Pricing" description="Upload and match vendor pricing files to the BH item master." status="active" />
        <ModuleCard title="Plan & Takeoff" description="Import plans and assign items and quantities." status="coming" />
        <ModuleCard title="Bid Management" description="Send specs to vendors and compare bids." status="coming" />
        <ModuleCard title="Purchase Orders" description="Generate and track purchase orders." status="coming" />
      </div>
    </div>
  );
}

function ModuleCard({ title, description, status }) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 24, background: status === "active" ? "#f0fdf4" : "#fafafa", cursor: status === "active" ? "pointer" : "default" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>{title}</h2>
        <span style={{ fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 20, background: status === "active" ? "#dcfce7" : "#f3f4f6", color: status === "active" ? "#166534" : "#9ca3af" }}>
          {status === "active" ? "Active" : "Coming soon"}
        </span>
      </div>
      <p style={{ fontSize: 14, color: "#6b7280", margin: 0, lineHeight: 1.6 }}>{description}</p>
    </div>
  );
}
