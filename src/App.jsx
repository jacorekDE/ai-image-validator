import { useState, useRef, useEffect } from "react";
import deLogo from "./assets/danish-endurance-logo-full-color-rgb.svg";

/* ── Design System ── */
const C = {
  bg: "#0f0809",
  surface: "#1a0d0e",
  sidebar: "#130a0b",
  border: "#2c1516",
  borderAccent: "#5c1219",
  accentBg: "#2d0709",
  red: "#BE1E28",
  textPrimary: "#f1f1f4",
  textMuted: "#9a7a7b",
  success: "#22c55e",
  warning: "#f59e0b",
  error: "#ef4444",
};

const FONT = "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

const SC = (s) => s >= 80 ? C.success : s >= 60 ? C.warning : s >= 40 ? C.error : C.red;
const BADGES = ["🥇", "🥈", "🥉"];
const LS_KEY = "imgval_v2";

function useIsMobile() {
  const [mobile, setMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 700);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 700);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mobile;
}

function ScoreBar({ label, value }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 500, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: SC(value) }}>{value}</span>
      </div>
      <div style={{ height: 4, background: C.border, borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${value}%`, background: SC(value), borderRadius: 2, transition: "width .6s cubic-bezier(0.4,0,0.2,1)" }} />
      </div>
    </div>
  );
}

function UploadZone({ label, sublabel, images, onAdd, onRemove, max = 99 }) {
  const ref = useRef();
  const [drag, setDrag] = useState(false);
  const process = (files) => {
    [...files].filter(f => f.type.startsWith("image/")).slice(0, max - images.length).forEach(file => {
      const r = new FileReader();
      r.onload = e => onAdd({ id: Date.now() + Math.random(), name: file.name, src: e.target.result });
      r.readAsDataURL(file);
    });
  };
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>{label}</div>
      {sublabel && <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 10 }}>{sublabel}</div>}
      {images.length < max && (
        <div
          onClick={() => ref.current.click()}
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); process(e.dataTransfer.files); }}
          style={{
            border: `1.5px dashed ${drag ? C.red : C.border}`,
            borderRadius: 10,
            padding: "28px 16px",
            textAlign: "center",
            cursor: "pointer",
            background: drag ? C.accentBg : C.surface,
            transition: "all .2s ease",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          <div style={{ fontSize: 26, marginBottom: 8, opacity: 0.6 }}>↑</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.textMuted }}>Click or drag files here</div>
          <input ref={ref} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={e => process(e.target.files)} />
        </div>
      )}
      {images.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(72px,1fr))", gap: 8, marginTop: images.length < max ? 10 : 0 }}>
          {images.map(img => (
            <div key={img.id} style={{ position: "relative", borderRadius: 8, overflow: "hidden", aspectRatio: "1", background: C.surface, border: `1px solid ${C.border}` }}>
              <img src={img.src} alt={img.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <button onClick={() => onRemove(img.id)}
                style={{ position: "absolute", top: 4, right: 4, background: C.red, color: C.textPrimary, border: "none", borderRadius: 4, width: 22, height: 22, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>×</button>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,.65)", padding: "6px 4px 3px", fontSize: 9, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{img.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Sheet({ open, onClose, title, children }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.6)", backdropFilter: "blur(3px)" }} />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: C.surface, borderRadius: "18px 18px 0 0",
        maxHeight: "92vh", overflowY: "auto", paddingBottom: 40,
        border: `1px solid ${C.border}`,
      }}>
        <style>{`@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}} .sheet-inner{animation:slideUp .28s cubic-bezier(0.4,0,0.2,1)}`}</style>
        <div className="sheet-inner">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 20px 14px", borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, background: C.surface, zIndex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary }}>{title}</div>
            <button onClick={onClose} style={{ background: "transparent", border: "none", color: C.textMuted, fontSize: 22, cursor: "pointer", lineHeight: 1 }}>×</button>
          </div>
          <div style={{ padding: "20px" }}>{children}</div>
        </div>
      </div>
    </div>
  );
}

function ResultCard({ r, idx, expanded, onToggle }) {
  return (
    <div style={{
      background: C.surface,
      border: `1px solid ${idx === 0 ? C.borderAccent : C.border}`,
      borderRadius: 12,
      marginBottom: 10,
      overflow: "hidden",
      cursor: "pointer",
      transition: "border-color .2s ease",
    }}>
      {idx === 0 && (
        <div style={{ background: C.accentBg, borderBottom: `1px solid ${C.borderAccent}`, padding: "4px 14px", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: C.red, textTransform: "uppercase", letterSpacing: "0.08em" }}>Top Match</span>
        </div>
      )}
      <div onClick={onToggle} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", WebkitTapHighlightColor: "transparent" }}>
        <div style={{ fontSize: 18, width: 26, textAlign: "center", flexShrink: 0 }}>
          {idx < 3 ? BADGES[idx] : <span style={{ fontSize: 12, color: C.textMuted }}>{idx + 1}</span>}
        </div>
        <img src={r.src} alt="" style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6, flexShrink: 0, border: `1px solid ${C.border}` }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: C.textPrimary }}>{r.name}</div>
          <div style={{ display: "flex", gap: 10, marginTop: 5, flexWrap: "wrap" }}>
            {[["🎨", r.avgColor], ["📐", r.avgShape], ["🔍", r.avgDetail], ["🏷", r.avgBrand]].map(([icon, val]) => (
              <span key={icon} style={{ fontSize: 10, fontWeight: 600, color: SC(val) }}>{icon} {val}</span>
            ))}
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: 30, fontWeight: 800, color: SC(r.avgOverall), lineHeight: 1 }}>{r.avgOverall}</div>
          <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>/100</div>
        </div>
      </div>

      {expanded && (
        <div style={{ borderTop: `1px solid ${C.border}`, padding: 16, background: C.bg }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 14 }}>Score Breakdown</div>
          <ScoreBar label="Color Accuracy" value={r.avgColor} />
          <ScoreBar label="Shape & Proportions" value={r.avgShape} />
          <ScoreBar label="Detail Fidelity" value={r.avgDetail} />
          <ScoreBar label="Brand Markings" value={r.avgBrand} />
          <ScoreBar label="Overall" value={r.avgOverall} />

          {r.refScores.map((rs, i) => (
            <div key={i} style={{ background: C.surface, borderRadius: 10, padding: 14, marginTop: 14, border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <img src={rs.refSrc} alt="" style={{ width: 34, height: 34, objectFit: "cover", borderRadius: 6, flexShrink: 0, border: `1px solid ${C.border}` }} />
                <div style={{ flex: 1, fontSize: 11, color: C.textMuted }}>vs {rs.refName}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: SC(rs.overallMatch || 0) }}>{rs.overallMatch}</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                <div>
                  <img src={rs.refSrc} alt="ref" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 8, marginBottom: 4, border: `1px solid ${C.border}` }} />
                  <div style={{ fontSize: 10, color: C.textMuted, textAlign: "center" }}>Reference</div>
                </div>
                <div>
                  <img src={r.src} alt="variant" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 8, marginBottom: 4, border: `1px solid ${C.border}` }} />
                  <div style={{ fontSize: 10, color: C.textMuted, textAlign: "center" }}>Variant</div>
                </div>
              </div>
              {rs.improvements && (
                <div style={{ fontSize: 11, color: C.textPrimary, padding: "10px 12px", background: C.bg, borderLeft: `2px solid ${C.warning}`, borderRadius: "0 6px 6px 0", lineHeight: 1.6 }}>
                  {rs.improvements}
                </div>
              )}
              {rs.verdict && (
                <div style={{ fontSize: 11, color: rs.verdict === "Production-ready" ? C.success : rs.verdict === "Adjust" ? C.warning : C.error, marginTop: 8, fontWeight: 700 }}>
                  {rs.verdict}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Btn({ children, variant = "primary", disabled = false, style: extraStyle = {}, ...props }) {
  const base = {
    primary: {
      background: disabled ? C.border : C.red,
      color: C.textPrimary,
      border: "none",
      borderRadius: 8,
      padding: "11px 18px",
      fontSize: 13,
      fontWeight: 700,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      transition: "opacity .2s ease",
      WebkitTapHighlightColor: "transparent",
    },
    ghost: {
      background: "transparent",
      color: C.textPrimary,
      border: `1px solid ${C.border}`,
      borderRadius: 8,
      padding: "10px 16px",
      fontSize: 12,
      fontWeight: 600,
      cursor: "pointer",
      WebkitTapHighlightColor: "transparent",
      transition: "all .2s ease",
    }
  };
  return <button style={{ ...base[variant], ...extraStyle }} disabled={disabled} {...props}>{children}</button>;
}

/* ══════════════ MAIN APP ══════════════ */
export default function App() {
  const isMobile = useIsMobile();
  const [refs, setRefs] = useState([]);
  const [variants, setVariants] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ n: 0, total: 0, label: "" });
  const [history, setHistory] = useState([]);
  const [tab, setTab] = useState("results");
  const [expanded, setExpanded] = useState(null);
  const [sessionName, setSessionName] = useState("");
  const [sheet, setSheet] = useState(null);

  useEffect(() => {
    try { setHistory(JSON.parse(localStorage.getItem(LS_KEY) || "[]")); } catch { }
  }, []);

  const persist = (h) => { setHistory(h); localStorage.setItem(LS_KEY, JSON.stringify(h)); };

  const analyzeImagePair = async (refSrc, variantSrc) => {
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("Missing VITE_ANTHROPIC_API_KEY in .env.local");

    const toBase64 = (dataUrl) => dataUrl.split(",")[1];
    const toMime = (dataUrl) => dataUrl.split(";")[0].split(":")[1];

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        messages: [{
          role: "user",
          content: [
            {
              type: "text",
              text: `You are a product image quality analyst for an e-commerce brand. Compare these two images:
- IMAGE 1: The reference packshot (original product photo)
- IMAGE 2: The AI-generated lifestyle variant

Score the AI variant against the reference on these 4 dimensions (0-100):
1. colorAccuracy — how well the product color/tone matches
2. shapeAndProportions — how well the product shape, fit, and silhouette match
3. detailFidelity — fabric texture, stitching, product details accuracy
4. brandMarkings — logos, labels, branding elements accuracy

Also provide:
- improvements: 1-2 specific actionable suggestions to improve the AI image
- verdict: one of "Production-ready", "Adjust", or "Iterate"

Respond ONLY with valid JSON, no markdown, no explanation:
{
  "colorAccuracy": 0-100,
  "shapeAndProportions": 0-100,
  "detailFidelity": 0-100,
  "brandMarkings": 0-100,
  "overallMatch": 0-100,
  "improvements": "string",
  "verdict": "Production-ready|Adjust|Iterate"
}`
            },
            { type: "image", source: { type: "base64", media_type: toMime(refSrc), data: toBase64(refSrc) } },
            { type: "image", source: { type: "base64", media_type: toMime(variantSrc), data: toBase64(variantSrc) } },
          ]
        }]
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || "API error");
    }

    const data = await response.json();
    const text = data.content[0].text.trim();
    const parsed = JSON.parse(text);

    return {
      colorAccuracy: parsed.colorAccuracy,
      shapeAndProportions: parsed.shapeAndProportions,
      detailFidelity: parsed.detailFidelity,
      brandMarkings: parsed.brandMarkings,
      overallMatch: parsed.overallMatch,
      improvements: parsed.improvements,
      verdict: parsed.verdict,
    };
  };

  const analyze = async () => {
    if (!refs.length || !variants.length) return alert("Need at least 1 reference and 1 variant.");
    setLoading(true); setResults([]); setTab("results"); setSheet(null);
    try {
      const all = [];
      const total = variants.length * refs.length;
      let n = 0;

      for (const variant of variants) {
        const refScores = [];
        for (const ref of refs) {
          setProgress({ n: ++n, total, label: `${variant.name.slice(0, 18)}…` });
          try {
            const parsed = await analyzeImagePair(ref.src, variant.src);
            refScores.push({ refName: ref.name, refSrc: ref.src, ...parsed });
          } catch (err) {
            console.error("Analysis error:", err.message);
            refScores.push({ refName: ref.name, refSrc: ref.src, colorAccuracy: 0, shapeAndProportions: 0, detailFidelity: 0, brandMarkings: 0, overallMatch: 0, improvements: `Error: ${err.message}`, verdict: "" });
          }
        }
        const avg = k => Math.round(refScores.reduce((s, r) => s + (r[k] || 0), 0) / refScores.length);
        all.push({ id: variant.id, name: variant.name, src: variant.src, refScores, avgColor: avg("colorAccuracy"), avgShape: avg("shapeAndProportions"), avgDetail: avg("detailFidelity"), avgBrand: avg("brandMarkings"), avgOverall: avg("overallMatch") });
      }

      all.sort((a, b) => b.avgOverall - a.avgOverall);
      setResults(all);
      setExpanded(all[0]?.id || null);

      const entry = {
        id: Date.now(),
        name: sessionName || `Session ${new Date().toLocaleDateString()}`,
        timestamp: Date.now(),
        refCount: refs.length, variantCount: variants.length,
        topScore: all[0]?.avgOverall || 0, topVariant: all[0]?.name || "",
        results: all, refSrcs: refs.map(r => r.src),
      };
      persist([entry, ...history].slice(0, 30));
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    const rows = [["Rank", "Variant", "Score", "Color", "Shape", "Detail", "Brand", "Notes"]];
    results.forEach((r, i) => {
      const improvements = r.refScores.map(rs => rs.improvements).join(" | ");
      rows.push([i + 1, r.name, r.avgOverall, r.avgColor, r.avgShape, r.avgDetail, r.avgBrand, improvements]);
    });
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
    a.download = `results-${Date.now()}.csv`;
    a.click();
  };

  const resetAnalysis = () => {
    setResults([]);
    setRefs([]);
    setVariants([]);
    setSessionName("");
    setLoading(false);
    setProgress({ n: 0, total: 0, label: "" });
    setTab("results");
  };

  /* ── MOBILE ── */
  if (isMobile) {
    const TabBtn = ({ id, label, count }) => (
      <button onClick={() => setTab(id)}
        style={{ flex: 1, background: tab === id ? C.red : "transparent", color: tab === id ? C.textPrimary : C.textMuted, border: "none", borderRadius: 7, padding: "10px", fontSize: 12, fontWeight: 700, cursor: "pointer", WebkitTapHighlightColor: "transparent", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, transition: "all .15s" }}>
        {label} {count != null && <span style={{ fontSize: 10 }}>{count}</span>}
      </button>
    );

    const ResultsPanel = () => (
      <div>
        {results.length === 0 ? (
          <div style={{ textAlign: "center", paddingTop: 48, color: C.textMuted }}>
            <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.3 }}>◎</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>No results yet</div>
            <div style={{ fontSize: 12, marginTop: 6 }}>Upload refs + variants and run analysis</div>
          </div>
        ) : (
          results.map((r, i) => <ResultCard key={r.id} r={r} idx={i} expanded={expanded === r.id} onToggle={() => setExpanded(expanded === r.id ? null : r.id)} />)
        )}
      </div>
    );

    const HistoryPanel = () => (
      <div>
        {history.length === 0 ? (
          <div style={{ textAlign: "center", paddingTop: 48, color: C.textMuted }}>
            <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.3 }}>◷</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>No history yet</div>
          </div>
        ) : (
          history.map(h => (
            <div key={h.id} onClick={() => { setResults(h.results); setTab("results"); setExpanded(h.results[0]?.id || null); }}
              style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 14px", marginBottom: 10, cursor: "pointer" }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.textPrimary, marginBottom: 3 }}>{h.name}</div>
              <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 6 }}>{new Date(h.timestamp).toLocaleString()}</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, color: C.textMuted }}>{h.refCount} refs · {h.variantCount} variants</span>
                <span style={{ fontSize: 15, fontWeight: 800, color: SC(h.topScore) }}>{h.topScore}</span>
              </div>
            </div>
          ))
        )}
      </div>
    );

    return (
      <div style={{ minHeight: "100vh", background: C.bg, color: C.textPrimary, fontFamily: FONT, paddingBottom: 88 }}>
        {/* Header */}
        <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "15px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src={deLogo} alt="Danish Endurance" style={{ height: 18 }} />
            <span style={{ fontSize: 11, color: C.textMuted, fontWeight: 500 }}>AI Image Validator</span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {loading && <span style={{ fontSize: 11, color: C.textMuted, fontWeight: 600 }}>{progress.n}/{progress.total}</span>}
            {results.length > 0 && !loading && (
              <div style={{ display: "flex", gap: 6 }}>
                <Btn variant="ghost" onClick={exportCSV} style={{ fontSize: 11, padding: "6px 10px" }}>CSV</Btn>
                <Btn variant="ghost" onClick={resetAnalysis} style={{ fontSize: 11, padding: "6px 10px" }}>New</Btn>
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {loading && (
          <div style={{ height: 2, background: C.border }}>
            <div style={{ height: "100%", width: `${progress.total ? (progress.n / progress.total) * 100 : 0}%`, background: C.red, transition: "width .3s ease" }} />
          </div>
        )}

        {/* Quick upload strip */}
        <div style={{ margin: "12px 14px 0", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}>
          <div onClick={() => setSheet("refs")} style={{ flex: 1, cursor: "pointer" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{refs.length}/2 Refs</div>
            {refs.length > 0 && <div style={{ display: "flex", gap: 4 }}>{refs.slice(0, 2).map(r => <img key={r.id} src={r.src} alt="" style={{ width: 26, height: 26, objectFit: "cover", borderRadius: 4, border: `1px solid ${C.border}` }} />)}</div>}
          </div>
          <div style={{ width: 1, height: 30, background: C.border }} />
          <div onClick={() => setSheet("variants")} style={{ flex: 1, cursor: "pointer" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{variants.length} Variants</div>
            {variants.length > 0 && <div style={{ display: "flex", gap: 4 }}>{variants.slice(0, 3).map(v => <img key={v.id} src={v.src} alt="" style={{ width: 26, height: 26, objectFit: "cover", borderRadius: 4, border: `1px solid ${C.border}` }} />)}</div>}
          </div>
          <button onClick={analyze} disabled={loading || !refs.length || !variants.length}
            style={{ background: refs.length && variants.length && !loading ? C.red : C.border, color: C.textPrimary, border: "none", borderRadius: 8, padding: "10px 14px", fontSize: 12, fontWeight: 700, cursor: refs.length && variants.length && !loading ? "pointer" : "not-allowed", flexShrink: 0, opacity: !refs.length || !variants.length ? 0.5 : 1, WebkitTapHighlightColor: "transparent" }}>
            {loading ? "…" : "Run"}
          </button>
        </div>

        {/* Tabs */}
        <div style={{ margin: "10px 14px 0", display: "flex", gap: 4, background: C.surface, padding: 5, borderRadius: 9, border: `1px solid ${C.border}` }}>
          <TabBtn id="results" label="Results" />
          <TabBtn id="history" label="History" count={history.length > 0 ? history.length : null} />
        </div>

        <div style={{ padding: "12px 14px 0" }}>
          {tab === "results" ? <ResultsPanel /> : <HistoryPanel />}
        </div>

        {/* Sheets */}
        <Sheet open={sheet === "refs"} onClose={() => setSheet(null)} title="Reference Images">
          <UploadZone label={`References (${refs.length}/2)`} sublabel="Real packshot or flatlay" images={refs}
            onAdd={img => setRefs(p => [...p, img].slice(0, 2))} onRemove={id => setRefs(p => p.filter(r => r.id !== id))} max={2} />
          <Btn onClick={() => setSheet(null)} style={{ width: "100%" }}>Done</Btn>
        </Sheet>

        <Sheet open={sheet === "variants"} onClose={() => setSheet(null)} title="AI Variants">
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 6 }}>Session Name</label>
            <input value={sessionName} onChange={e => setSessionName(e.target.value)} placeholder="e.g. Summer Campaign v2"
              style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 11px", color: C.textPrimary, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: FONT }} />
          </div>
          <UploadZone label={`Variants (${variants.length})`} sublabel="Lifestyle or model shots" images={variants}
            onAdd={img => setVariants(p => [...p, img])} onRemove={id => setVariants(p => p.filter(v => v.id !== id))} />
          <Btn onClick={() => setSheet(null)} style={{ width: "100%" }}>Done</Btn>
        </Sheet>

        {/* Bottom nav */}
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: C.surface, borderTop: `1px solid ${C.border}`, display: "flex", padding: "8px 10px 18px", gap: 6, zIndex: 49 }}>
          {[["refs", "Refs"], ["variants", "Variants"]].map(([id, label]) => (
            <button key={id} onClick={() => setSheet(id)} style={{ flex: 1, background: sheet === id ? C.red : C.bg, border: `1px solid ${sheet === id ? C.red : C.border}`, borderRadius: 8, padding: "10px", color: sheet === id ? C.textPrimary : C.textMuted, fontSize: 11, fontWeight: 700, cursor: "pointer", WebkitTapHighlightColor: "transparent", transition: "all .15s" }}>{label}</button>
          ))}
          <button onClick={() => setTab(tab === "history" ? "results" : "history")} style={{ flex: 1, background: tab === "history" ? C.red : C.bg, border: `1px solid ${tab === "history" ? C.red : C.border}`, borderRadius: 8, padding: "10px", color: tab === "history" ? C.textPrimary : C.textMuted, fontSize: 11, fontWeight: 700, cursor: "pointer", WebkitTapHighlightColor: "transparent", transition: "all .15s" }}>History</button>
        </div>
      </div>
    );
  }

  /* ── DESKTOP ── */
  const TabBtn = ({ id, label, count }) => (
    <button onClick={() => setTab(id)}
      style={{ background: tab === id ? C.red : "transparent", color: tab === id ? C.textPrimary : C.textMuted, border: "none", borderRadius: 7, padding: "9px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer", WebkitTapHighlightColor: "transparent", display: "flex", alignItems: "center", gap: 6, transition: "all .15s" }}>
      {label} {count != null && <span style={{ fontSize: 10, background: tab === id ? "rgba(255,255,255,.2)" : C.border, borderRadius: 10, padding: "1px 6px" }}>{count}</span>}
    </button>
  );

  const UploadPanel = () => (
    <div>
      <UploadZone label={`References (${refs.length}/2)`} sublabel="Real packshot or flatlay" images={refs}
        onAdd={img => setRefs(p => [...p, img].slice(0, 2))} onRemove={id => setRefs(p => p.filter(r => r.id !== id))} max={2} />
      <UploadZone label={`AI Variants (${variants.length})`} sublabel="Lifestyle or model shots" images={variants}
        onAdd={img => setVariants(p => [...p, img])} onRemove={id => setVariants(p => p.filter(v => v.id !== id))} />

      <button onClick={analyze} disabled={loading || !refs.length || !variants.length}
        style={{ width: "100%", background: refs.length && variants.length && !loading ? C.red : C.border, color: C.textPrimary, border: "none", borderRadius: 10, padding: "16px 18px", fontSize: 15, fontWeight: 800, cursor: refs.length && variants.length && !loading ? "pointer" : "not-allowed", opacity: !refs.length || !variants.length || loading ? 0.5 : 1, fontFamily: FONT, letterSpacing: "-0.01em", boxShadow: refs.length && variants.length && !loading ? `0 4px 18px rgba(190,30,40,0.35)` : "none", transition: "all .2s ease" }}>
        {loading ? `Analyzing ${progress.n}/${progress.total}…` : "▶  Run Analysis"}
      </button>
    </div>
  );

  const ResultsPanel = () => (
    <div>
      {results.length === 0 ? (
        <div style={{ textAlign: "center", paddingTop: 80, color: C.textMuted }}>
          <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.2 }}>◎</div>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>No results yet</div>
          <div style={{ fontSize: 13 }}>Upload references and variants, then run analysis</div>
        </div>
      ) : (
        results.map((r, i) => <ResultCard key={r.id} r={r} idx={i} expanded={expanded === r.id} onToggle={() => setExpanded(expanded === r.id ? null : r.id)} />)
      )}
    </div>
  );

  const HistoryPanel = () => (
    <div>
      {history.length === 0 ? (
        <div style={{ textAlign: "center", paddingTop: 80, color: C.textMuted }}>
          <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.2 }}>◷</div>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>No history yet</div>
          <div style={{ fontSize: 13 }}>Past analyses will appear here</div>
        </div>
      ) : (
        history.map(h => (
          <div key={h.id} onClick={() => { setResults(h.results); setTab("results"); setExpanded(h.results[0]?.id || null); }}
            style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px", marginBottom: 10, cursor: "pointer", transition: "border-color .15s" }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: C.textPrimary, marginBottom: 3 }}>{h.name}</div>
            <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 10 }}>{new Date(h.timestamp).toLocaleString()}</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, color: C.textMuted }}>{h.refCount} refs · {h.variantCount} variants</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: SC(h.topScore) }}>{h.topScore}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.textPrimary, fontFamily: FONT, display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src={deLogo} alt="Danish Endurance" style={{ height: 20 }} />
          <span style={{ fontSize: 12, color: C.textMuted, fontWeight: 500 }}>AI Image Validator</span>
        </div>
        {results.length > 0 && (
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="ghost" onClick={exportCSV} style={{ fontSize: 12, padding: "8px 14px" }}>Export CSV</Btn>
            <Btn variant="ghost" onClick={resetAnalysis} style={{ fontSize: 12, padding: "8px 14px" }}>New Analysis</Btn>
          </div>
        )}
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <div style={{ width: 290, background: C.sidebar, borderRight: `1px solid ${C.border}`, padding: "24px 22px", overflowY: "auto", flexShrink: 0 }}>
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 6 }}>Session Name</label>
            <input
              value={sessionName}
              onChange={e => setSessionName(e.target.value)}
              placeholder="e.g. Summer Campaign v2"
              style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 11px", color: C.textPrimary, fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: FONT }}
            />
          </div>
          <UploadPanel />
        </div>

        {/* Main content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
          <div style={{ display: "flex", gap: 4, marginBottom: 22, background: C.surface, padding: 5, borderRadius: 10, width: "fit-content", border: `1px solid ${C.border}` }}>
            <TabBtn id="results" label="Results" />
            <TabBtn id="history" label="History" count={history.length > 0 ? history.length : null} />
          </div>
          {tab === "results" ? <ResultsPanel /> : <HistoryPanel />}
        </div>
      </div>
    </div>
  );
}
