import { useState } from "react";
import * as XLSX from "xlsx";

export default function Pricing() {
  const [matches, setMatches] = useState([]);
  const [unmatched, setUnmatched] = useState([]);
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState("idle");

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setStatus("processing");

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    const matched = [];
    const unmatched = [];

    rows.forEach((row) => {
      const code = row["Catalog Code"] || row["catalog_code"] || row["Item"] || row["SKU"] || "";
      const desc = row["Description"] || row["description"] || "";
      const price = row["Price"] || row["price"] || row["Unit Price"] || row["Cost"] || "";

      if (code) {
        matched.push({ code, desc, price, status: "matched" });
      } else {
        unmatched.push({ code, desc, price, status: "unmatched" });
      }
    });

    setMatches(matched);
    setUnmatched(unmatched);
    setStatus("done");
  }

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: 1000, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ marginBottom: 32 }}>
        <a href="/" style={{ fontSize: 13, color: "#6b7280", textDecoration: "none" }}>← Back to Clearway</a>
        <h1 style={{ fontSize: 24, fontWeight: 600, margin: "8px 0 4px" }}>Vendor Pricing</h1>
        <p style={{ color: "#6b7280", margin: 0 }}>Upload a vendor pricing file to match against the BH item master.</p>
      </div>

      <div style={{ border: "2px dashed #e5e7eb", borderRadius: 12, padding: 40, textAlign: "center", marginBottom: 32, background: "#fafafa" }}>
        <p style={{ margin: "0 0 16px", color: "#6b7280" }}>Select an Elliott Electric pricing file (.xlsx)</p>
        <input type="file" accept=".xlsx,.xls" onChange={handleFile} style={{ fontSize: 14 }} />
      </div>

      {status === "processing" && <p style={{ color: "#6b7280" }}>Processing file...</p>}

      {status === "done" && (
        <>
          <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
            <StatCard label="Total rows" value={matches.length + unmatched.length} />
            <StatCard label="Matched" value={matches.length} color="#166534" bg="#dcfce7" />
            <StatCard label="Unmatched" value={unmatched.length} color="#991b1b" bg="#fee2e2" />
          </div>

          {matches.length > 0 && (
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Matched items</h2>
              <Table rows={matches} />
            </div>
          )}

          {unmatched.length > 0 && (
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: "#991b1b" }}>Unmatched items — needs review</h2>
              <Table rows={unmatched} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, color = "#111", bg = "#f3f4f6" }) {
  return (
    <div style={{ background: bg, borderRadius: 10, padding: "16px 24px", minWidth: 120 }}>
      <div style={{ fontSize: 28, fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>{label}</div>
    </div>
  );
}

function Table({ rows }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
            <th style={th}>Catalog code</th>
            <th style={th}>Description</th>
            <th style={th}>Price</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}>
              <td style={td}>{r.code}</td>
              <td style={td}>{r.desc}</td>
              <td style={td}>${Number(r.price).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th = { padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "#374151" };
const td = { padding: "10px 16px", color: "#374151" };
