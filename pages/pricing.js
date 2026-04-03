import { useState, useEffect } from "react";

const KEYWORDS = ["code","catalog","description","desc","price","cost","item","sku","unit","qty","quantity","vendor","upc","part","number","material"];

function scoreRow(row) {
  const cells = Object.values(row);
  if (cells.length === 0) return 0;
  let score = 0; let textCells = 0; let emptyCells = 0;
  cells.forEach((cell) => {
    if (cell === null || cell === undefined || cell === "") { emptyCells++; return; }
    if (typeof cell === "string" && cell.trim() !== "") {
      textCells++;
      if (KEYWORDS.some((k) => cell.toLowerCase().trim().includes(k))) score += 3;
    }
  });
  score += (textCells / cells.length) * 5;
  score += ((cells.length - emptyCells) / cells.length) * 2;
  return score;
}

function extractCatalogCode(description) {
  if (!description) return "";
  const str = String(description).trim();
  const colonIdx = str.indexOf(":");
  if (colonIdx > 0) return str.substring(0, colonIdx).trim();
  return "";
}

function ProgressBar({ step }) {
  const steps = ["upload-vendor","confirm-header","map-columns","upload-master","results"];
  const vendorDone = ["upload-master","results"].includes(step);
  const masterDone = step === "results";
  const vendorActive = ["upload-vendor","confirm-header","map-columns"].includes(step);
  const masterActive = step === "upload-master";
  const resultsActive = step === "results";
  return (
    <div style={{ display:"flex", gap:8, marginBottom:32, fontSize:13, alignItems:"center" }}>
      <StepDot label="Upload vendor file" active={vendorActive} done={vendorDone} num={1} />
      <span style={{ color:"#e5e7eb" }}>→</span>
      <StepDot label="Upload BH master" active={masterActive} done={masterDone} num={2} />
      <span style={{ color:"#e5e7eb" }}>→</span>
      <StepDot label="Review results" active={resultsActive} done={false} num={3} />
    </div>
  );
}

function StepDot({ label, active, done, num }) {
  const bg = done ? "#dcfce7" : active ? "#111" : "#f3f4f6";
  const color = done ? "#166534" : active ? "#fff" : "#9ca3af";
  return (
    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
      <div style={{ width:24, height:24, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:600, background:bg, color }}>{done ? "✓" : num}</div>
      <span style={{ color: active ? "#111" : "#9ca3af", fontWeight: active ? 500 : 400 }}>{label}</span>
    </div>
  );
}

export default function Pricing() {
  const [step, setStep] = useState("upload-vendor");
  const [allRows, setAllRows] = useState([]);
  const [previewRows, setPreviewRows] = useState([]);
  const [headerRowIndex, setHeaderRowIndex] = useState(0);
  const [columns, setColumns] = useState([]);
  const [mapping, setMapping] = useState({ code:"", description:"", price:"" });
  const [vendorItems, setVendorItems] = useState([]);
  const [matchResults, setMatchResults] = useState(null);
  const [xlsxReady, setXlsxReady] = useState(false);

  useEffect(() => {
    if (window.XLSX) { setXlsxReady(true); return; }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
    script.onload = () => setXlsxReady(true);
    document.head.appendChild(script);
  }, []);

  async function handleVendorFile(e) {
    const file = e.target.files[0];
    if (!file || !xlsxReady) return;
    const data = await file.arrayBuffer();
    const workbook = window.XLSX.read(data);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const raw = window.XLSX.utils.sheet_to_json(sheet, { header:1, defval:"" });
    setAllRows(raw);
    const preview = raw.slice(0, 20);
    setPreviewRows(preview);
    const scores = preview.map((row, i) => ({ i, score: scoreRow(Object.fromEntries(row.map((c, j) => [j, c]))) }));
    const best = scores.reduce((a, b) => (b.score > a.score ? b : a), scores[0]);
    setHeaderRowIndex(best.i);
    setStep("confirm-header");
  }

  function confirmHeader() {
    const headerRow = allRows[headerRowIndex];
    const cols = headerRow.map((c, i) => ({ label: String(c).trim() || `Column ${i+1}`, index:i })).filter((c) => c.label !== "");
    setColumns(cols);
    const autoCode = cols.find((c) => ["catalog","code","sku","item","part"].some((k) => c.label.toLowerCase().includes(k)))?.label || "";
    const autoDesc = cols.find((c) => ["description","desc","name"].some((k) => c.label.toLowerCase().includes(k)))?.label || "";
    const autoPrice = cols.find((c) => ["price","cost","rate"].some((k) => c.label.toLowerCase().includes(k)))?.label || "";
    setMapping({ code:autoCode, description:autoDesc, price:autoPrice });
    setStep("map-columns");
  }

  function processVendorFile() {
    const headerRow = allRows[headerRowIndex];
    const dataRows = allRows.slice(headerRowIndex + 1);
    const colIndex = (name) => {
      const idx = headerRow.findIndex((h) => String(h).trim() === name);
      return idx >= 0 ? idx : columns.find((c) => c.label === name)?.index ?? -1;
    };
    const codeIdx = colIndex(mapping.code);
    const descIdx = colIndex(mapping.description);
    const priceIdx = colIndex(mapping.price);
    const items = dataRows
      .filter((row) => row.some((c) => c !== ""))
      .map((row) => ({
        code: codeIdx >= 0 ? String(row[codeIdx] || "").trim() : "",
        description: descIdx >= 0 ? String(row[descIdx] || "").trim() : "",
        price: priceIdx >= 0 ? row[priceIdx] : "",
      }))
      .filter((r) => r.code);
    setVendorItems(items);
    setStep("upload-master");
  }

  async function handleMasterFile(e) {
    const file = e.target.files[0];
    if (!file || !xlsxReady) return;
    const data = await file.arrayBuffer();
    const workbook = window.XLSX.read(data);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const raw = window.XLSX.utils.sheet_to_json(sheet, { header:1, defval:"" });
    let headerIdx = 0;
    for (let i = 0; i < Math.min(raw.length, 15); i++) {
      const row = raw[i];
      if (row.some((c) => String(c).toLowerCase().includes("item") || String(c).toLowerCase().includes("description"))) {
        headerIdx = i;
        break;
      }
    }
    const headerRow = raw[headerIdx];
    const dataRows = raw.slice(headerIdx + 1);
    const itemIdx = headerRow.findIndex((h) => String(h).toLowerCase().includes("item"));
    const descIdx = headerRow.findIndex((h) => String(h).toLowerCase().includes("desc"));
    const costIdx = headerRow.findIndex((h) => String(h).toLowerCase().includes("cost"));
    const bhMap = {};
    dataRows.forEach((row) => {
      const bhSku = itemIdx >= 0 ? String(row[itemIdx] || "").trim() : "";
      const desc = descIdx >= 0 ? String(row[descIdx] || "").trim() : "";
      const cost = costIdx >= 0 ? row[costIdx] : "";
      const catalogCode = extractCatalogCode(desc);
      if (catalogCode && bhSku) {
        bhMap[catalogCode.toUpperCase()] = { bhSku, description:desc, currentCost:cost };
      }
    });
    const matched = [];
    const newItems = [];
    vendorItems.forEach((item) => {
      const bh = bhMap[item.code.toUpperCase()];
      if (bh) {
        const oldCost = parseFloat(bh.currentCost) || 0;
        const newCost = parseFloat(item.price) || 0;
        const delta = newCost - oldCost;
        matched.push({ ...item, bhSku:bh.bhSku, bhDescription:bh.description, currentCost:bh.currentCost, delta, hasChange: Math.abs(delta) > 0.001 });
      } else {
        newItems.push(item);
      }
    });
    setMatchResults({ matched, priceChanges: matched.filter((r) => r.hasChange), noChange: matched.filter((r) => !r.hasChange), newItems });
    setStep("results");
  }

  const s = {
    page: { fontFamily:"sans-serif", maxWidth:1100, margin:"0 auto", padding:"40px 24px" },
    back: { fontSize:13, color:"#6b7280", textDecoration:"none" },
    h1: { fontSize:24, fontWeight:600, margin:"8px 0 4px" },
    sub: { color:"#6b7280", margin:"0 0 32px" },
    card: { border:"1px solid #e5e7eb", borderRadius:12, padding:24, marginBottom:20, background:"#fafafa" },
    btn: { background:"#111", color:"#fff", border:"none", padding:"10px 24px", borderRadius:8, fontSize:14, cursor:"pointer", fontWeight:500 },
    btnSm: { background:"#f3f4f6", color:"#374151", border:"1px solid #e5e7eb", padding:"6px 14px", borderRadius:6, fontSize:13, cursor:"pointer" },
    select: { border:"1px solid #e5e7eb", borderRadius:8, padding:"8px 12px", fontSize:14, width:"100%", background:"#fff" },
    label: { fontSize:13, fontWeight:500, color:"#374151", display:"block", marginBottom:6 },
  };

  return (
    <div style={s.page}>
      <div style={{ marginBottom:32 }}>
        <a href="/" style={s.back}>← Back to Clearway</a>
        <h1 style={s.h1}>Vendor Pricing</h1>
        <p style={s.sub}>Upload a vendor pricing file and match it against the BH item master.</p>
      </div>

      <ProgressBar step={step} />

      {step === "upload-vendor" && (
        <div style={{ ...s.card, border:"2px dashed #e5e7eb", textAlign:"center", padding:48 }}>
          <p style={{ margin:"0 0 8px", fontWeight:500 }}>Upload vendor pricing file</p>
          <p style={{ margin:"0 0 16px", color:"#6b7280", fontSize:13 }}>Elliott Electric or any other vendor (.xlsx or .xls)</p>
          <input type="file" accept=".xlsx,.xls" onChange={handleVendorFile} style={{ fontSize:14 }} disabled={!xlsxReady} />
        </div>
      )}

      {step === "confirm-header" && (
        <div style={s.card}>
          <h2 style={{ fontSize:16, fontWeight:600, margin:"0 0 4px" }}>Confirm the header row</h2>
          <p style={{ fontSize:13, color:"#6b7280", margin:"0 0 20px" }}>The highlighted row will be used as column headers. Adjust if needed.</p>
          <div style={{ overflowX:"auto", marginBottom:16 }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <tbody>
                {previewRows.map((row, i) => (
                  <tr key={i} style={{ background: i === headerRowIndex ? "#fef9c3" : i % 2 === 0 ? "#fafafa" : "#fff", borderBottom:"1px solid #f3f4f6" }}>
                    <td style={{ padding:"6px 10px", color:"#9ca3af", width:32, fontSize:11 }}>{i+1}</td>
                    {row.slice(0, 8).map((cell, j) => (
                      <td key={j} style={{ padding:"6px 10px", color: i === headerRowIndex ? "#854d0e" : "#374151", fontWeight: i === headerRowIndex ? 600 : 400, maxWidth:140, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{String(cell)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <button style={s.btnSm} onClick={() => setHeaderRowIndex(Math.max(0, headerRowIndex - 1))}>↑ Move up</button>
            <button style={s.btnSm} onClick={() => setHeaderRowIndex(Math.min(previewRows.length - 1, headerRowIndex + 1))}>↓ Move down</button>
            <span style={{ fontSize:13, color:"#6b7280" }}>Header is row {headerRowIndex+1}</span>
            <button style={{ ...s.btn, marginLeft:"auto" }} onClick={confirmHeader}>Confirm →</button>
          </div>
        </div>
      )}

      {step === "map-columns" && (
        <div style={s.card}>
          <h2 style={{ fontSize:16, fontWeight:600, margin:"0 0 4px" }}>Map the columns</h2>
          <p style={{ fontSize:13, color:"#6b7280", margin:"0 0 24px" }}>Which column contains each piece of information?</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:20, marginBottom:24 }}>
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
          <button style={s.btn} onClick={processVendorFile} disabled={!mapping.code}>Next: Upload BH master →</button>
        </div>
      )}

      {step === "upload-master" && (
        <div style={{ ...s.card, border:"2px dashed #e5e7eb", textAlign:"center", padding:48 }}>
          <p style={{ margin:"0 0 4px", fontWeight:500 }}>Upload BH item master</p>
          <p style={{ margin:"0 0 4px", color:"#6b7280", fontSize:13 }}>Vendor file loaded: {vendorItems.length.toLocaleString()} items ready to match</p>
          <p style={{ margin:"0 0 20px", color:"#6b7280", fontSize:13 }}>Now upload the BH electrical item master list (.xlsx)</p>
          <input type="file" accept=".xlsx,.xls" onChange={handleMasterFile} style={{ fontSize:14 }} />
        </div>
      )}

      {step === "results" && matchResults && (
        <>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:12, marginBottom:28 }}>
            <StatCard label="Vendor items" value={vendorItems.length.toLocaleString()} />
            <StatCard label="Price changes" value={matchResults.priceChanges.length.toLocaleString()} color="#92400e" bg="#fef3c7" />
            <StatCard label="No change" value={matchResults.noChange.length.toLocaleString()} color="#166534" bg="#dcfce7" />
            <StatCard label="New — not in BH" value={matchResults.newItems.length.toLocaleString()} color="#991b1b" bg="#fee2e2" />
          </div>
          {matchResults.priceChanges.length > 0 && <Section title="Price changes" color="#92400e" bg="#fef3c7" items={matchResults.priceChanges} showDelta />}
          {matchResults.newItems.length > 0 && <Section title="New items — not in BH master" color="#991b1b" bg="#fee2e2" items={matchResults.newItems} isNew />}
          {matchResults.noChange.length > 0 && <Section title="Matched — no price change" color="#166534" bg="#dcfce7" items={matchResults.noChange} />}
          <button style={{ ...s.btnSm, marginTop:24 }} onClick={() => { setStep("upload-vendor"); setMatchResults(null); setVendorItems([]); }}>Start over</button>
        </>
      )}
    </div>
  );
}

function Section({ title, color, bg, items, showDelta, isNew }) {
  const [expanded, setExpanded] = useState(false);
  const displayed = expanded ? items : items.slice(0, 5);
  const th = { padding:"10px 14px", textAlign:"left", fontWeight:600, color:"#374151", fontSize:12 };
  const td = { padding:"10px 14px", color:"#374151", fontSize:12 };
  return (
    <div style={{ marginBottom:28 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
        <h2 style={{ fontSize:15, fontWeight:600, margin:0 }}>{title}</h2>
        <span style={{ fontSize:11, fontWeight:500, padding:"2px 8px", borderRadius:20, background:bg, color }}>{items.length.toLocaleString()}</span>
      </div>
      <div style={{ border:"1px solid #e5e7eb", borderRadius:10, overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"#f9fafb", borderBottom:"1px solid #e5e7eb" }}>
              <th style={th}>Catalog code</th>
              <th style={th}>Description</th>
              {!isNew && <th style={th}>BH SKU</th>}
              {!isNew && <th style={th}>Current cost</th>}
              <th style={th}>Vendor price</th>
              {showDelta && <th style={th}>Change</th>}
            </tr>
          </thead>
          <tbody>
            {displayed.map((r, i) => (
              <tr key={i} style={{ borderBottom:"1px solid #f9fafb", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td style={td}>{r.code}</td>
                <td style={{ ...td, maxWidth:280, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.description || r.bhDescription}</td>
                {!isNew && <td style={td}>{r.bhSku}</td>}
                {!isNew && <td style={td}>{r.currentCost != null && r.currentCost !== "" ? `$${Number(r.currentCost).toFixed(2)}` : "—"}</td>}
                <td style={td}>{r.price !== "" ? `$${Number(r.price).toFixed(2)}` : "—"}</td>
                {showDelta && <td style={{ ...td, color: r.delta > 0 ? "#991b1b" : "#166534", fontWeight:600 }}>{r.delta > 0 ? "+" : ""}{r.delta.toFixed(2)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
        {items.length > 5 && (
          <div style={{ padding:"10px 14px", borderTop:"1px solid #f3f4f6" }}>
            <button style={{ fontSize:13, color:"#6b7280", background:"none", border:"none", cursor:"pointer" }} onClick={() => setExpanded(!expanded)}>
              {expanded ? "Show less ↑" : `Show all ${items.length.toLocaleString()} rows ↓`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color="#111", bg="#f3f4f6" }) {
  return (
    <div style={{ background:bg, borderRadius:10, padding:"16px 20px" }}>
      <div style={{ fontSize:26, fontWeight:700, color }}>{value}</div>
      <div style={{ fontSize:12, color:"#6b7280", marginTop:2 }}>{label}</div>
    </div>
  );
}
