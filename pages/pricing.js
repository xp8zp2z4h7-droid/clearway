import { useState, useEffect } from "react";

const KEYWORDS = ["code","catalog","description","desc","price","cost","item","sku","unit","qty","quantity","vendor","upc","part","number","material"];

function scoreRow(row) {
  const cells = Object.values(row);
  if (cells.length === 0) return 0;
  let score = 0;
  let textCells = 0;
  let emptyCells = 0;
  cells.forEach((cell) => {
    if (cell === null || cell === undefined || cell === "") { emptyCells++; return; }
    if (typeof cell === "string" && cell.trim() !== "") {
      textCells++;
      const lower = cell.toLowerCase().trim();
      if (KEYWORDS.some((k) => lower.includes(k))) score += 3;
    }
  });
  const fillRate = (cells.length - emptyCells) / cells.length;
  const textRate = textCells / cells.length;
  score += textRate * 5;
  score += fillRate * 2;
  return score;
}

export default function Pricing() {
  const [step, setStep] = useState("upload");
  const [rawRows, setRawRows] = useState([]);
  const [headerRowIndex, setHeaderRowIndex] = useState(0);
  const [columns, setColumns] = useState([]);
  const [mapping, setMapping] = useState({ code: "", description: "", price: "" });
  const [results, setResults] = useState([]);
  const [xlsxReady, setXlsxReady] = useState(false);

  useEffect(() => {
    if (window.XLSX) { setXlsxReady(true); return; }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
    script.onload = () => setXlsxReady(true);
    document.head.appendChild(script);
  }, []);

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file || !xlsxReady) return;
    const data = await file.arrayBuffer();
    const workbook = window.XLSX.read(data);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const raw = window.XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
    const preview = raw.slice(0, 20);
    setRawRows(preview);
    const scores = preview.map((row, i) => ({ i, score: scoreRow(Object.fromEntries(row.map((c, j) => [j, c]))) }));
    const best = scores.reduce((a, b) => (b.score > a.score ? b : a), scores[0]);
    setHeaderRowIndex(best.i);
    setStep("confirm-header");
  }

  function confirmHeader() {
    const headerRow = rawRows[headerRowIndex];
    const cols = headerRow.map((c, i) => ({ label: String(c).trim() || `Column ${i + 1}`, index: i })).filter((c) => c.label !== "");
    setColumns(cols);
    const autoCode = cols.find((c) => KEYWORDS.slice(0, 4).some((k) => c.label.toLowerCase().includes(k)))?.label || "";
    const autoDesc = cols.find((c) => ["description","desc","name"].some((k) => c.label.toLowerCase().includes(k)))?.label || "";
    const autoPrice = cols.find((c) => ["price","cost","rate"].some((k) => c.label.toLowerCase().includes(k)))?.label || "";
    setMapping({ code: autoCode, description: autoDesc, price: autoPrice });
    setStep("map-columns");
  }

  function processFile() {
    const dataRows = rawRows.slice(headerRowIndex + 1);
    const headerRow = rawRows[headerRowIndex];
    const colIndex = (name) => headerRow.indexOf(name) !== -1 ? headerRow.indexOf(name) : columns.find((c) => c.label === name)?.index ?? -1;
    const codeIdx = colIndex(mapping.code);
    const descIdx = colIndex(mapping.description);
    const priceIdx = colIndex(mapping.price);
    const processed = dataRows
      .filter((row) => row.some((c) => c !== ""))
      .map((row) => ({
        code: codeIdx >= 0 ? String(row[codeIdx] || "").trim() : "",
        description: descIdx >= 0 ? String(row[descIdx] || "").trim() : "",
        price: priceIdx >= 0 ? row[priceIdx] : "",
      }));
    setResults(processed);
    setStep("results");
  }

  const s = {
    page: { fontFamily: "sans-serif", maxWidth: 1000, margin: "0 auto", padding: "40px 24px" },
    back: { fontSize: 13, color: "#6b7280", textDecoration: "none" },
    h1: { fontSize: 24, fontWeight: 600, margin: "8px 0 4px" },
    sub: { color: "#6b7280", margin: "0 0 32px" },
    card: { border: "1px solid #e5e7eb", borderRadius: 12, padding: 24, marginBottom: 20, background: "#fafafa" },
    btn: { background: "#111", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 8, fontSize: 14, cursor: "pointer", fontWeight: 500 },
    btnSm: { background: "#f3f4f6", color: "#374151", border: "1px solid #e5e7eb", padding: "6px 14px", borderRadius: 6, fontSize: 13, cursor: "pointer" },
    select: { border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 12px", fontSize: 14, width: "100%", background: "#fff" },
    label: { fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 6 },
    tag: (ok) => ({ display:"inline-block", fontSize:11, fontWeight:500, padding:"2px 8px", borderRadius:20, background: ok ? "#dcfce7" : "#fee2e2", color: ok ? "#166534" : "#991b1b" }),
  };

  const matched = results.filter((r) => r.code);
  const unmatched = results.filter((r) => !r.code);

  return (
    <div style={s.page}>
      <div style={{ marginBottom: 32 }}>
        <a href="/" style={s.back}>← Back to Clearway</a>
        <h1 style={s.h1}>Vendor Pricing</h1>
        <p style={s.sub}>Upload a vendor pricing file to match against the BH item master.</p>
      </div>

      {/* Step 1: Upload */}
      {step === "upload" && (
        <div style={{ ...s.card, border: "2px dashed #e5e7eb", textAlign: "center", padding: 48 }}>
          <p style={{ margin: "0 0 16px", color: "#6b7280" }}>Select a vendor pricing file (.xlsx or .xls)</p>
          <input type="file" accept=".xlsx,.xls" onChange={handleFile} style={{ fontSize: 14 }} disabled={!xlsxReady} />
          {!xlsxReady && <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 8 }}>Loading file reader...</p>}
        </div>
      )}

      {/* Step 2: Confirm header row */}
      {step === "confirm-header" && (
        <div>
          <div style={s.card}>
            <h2 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 4px" }}>Step 1 — Confirm the header row</h2>
            <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 20px" }}>We detected the highlighted row as the column headers. Use the arrows to adjust if needed.</p>
            <div style={{ overflowX: "auto", marginBottom: 16 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <tbody>
                  {rawRows.map((row, i) => (
                    <tr key={i} style={{ background: i === headerRowIndex ? "#fef9c3" : i % 2 === 0 ? "#fafafa" : "#fff", borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "6px 10px", color: "#9ca3af", width: 32, fontSize: 11 }}>{i + 1}</td>
                      {row.slice(0, 8).map((cell, j) => (
                        <td key={j} style={{ padding: "6px 10px", color: i === headerRowIndex ? "#854d0e" : "#374151", fontWeight: i === headerRowIndex ? 600 : 400, maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{String(cell)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button style={s.btnSm} onClick={() => setHeaderRowIndex(Math.max(0, headerRowIndex - 1))}>↑ Move up</button>
              <button style={s.btnSm} onClick={() => setHeaderRowIndex(Math.min(rawRows.length - 1, headerRowIndex + 1))}>↓ Move down</button>
              <span style={{ fontSize: 13, color: "#6b7280" }}>Header is on row {headerRowIndex + 1}</span>
              <button style={{ ...s.btn, marginLeft: "auto" }} onClick={confirmHeader}>This is correct →</button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Map columns */}
      {step === "map-columns" && (
        <div style={s.card}>
          <h2 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 4px" }}>Step 2 — Map the columns</h2>
          <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 24px" }}>Tell us which column contains each piece of information. We've made our best guess — adjust if needed.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 24 }}>
            {[["code","Catalog / item code"],["description","Description"],["price","Price / cost"]].map(([key, label]) => (
              <div key={key}>
                <label style={s.label}>{label}</label>
                <select style={s.select} value={mapping[key]} onChange={(e) => setMapping({ ...mapping, [key]: e.target.value })}>
                  <option value="">— select column —</option>
                  {columns.map((c) => <option key={c.index} value={c.label}>{c.label}</option>)}
                </select>
              </div>
            ))}
          </div>
          <button style={s.btn} onClick={processFile} disabled={!mapping.code}>Process file →</button>
        </div>
      )}

      {/* Step 4: Results */}
      {step === "results" && (
        <>
          <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
            <Stat
