/**
 * ------------------------------------------------------------------------------
 * PROJECT:    QuantumFlow.ai Resilience Engine
 * ARCHITECT:  Bruce Hirwa
 * VERSION:    1.0.0
 * FILE:       pages/index.tsx  (Next.js App Router) or src/App.tsx (CRA/Vite)
 * ------------------------------------------------------------------------------
 * 
 * INSTALL:    npm install react react-dom
 * RUN:        npm run dev   (Next.js)  |  npm start  (CRA)
 * 
 * A Hybrid Quantum-Classical (VQC-LSTM) Federated Learning dashboard
 * for SME liquidity risk mitigation with PQC-secured data pipelines.
 * ------------------------------------------------------------------------------
 */

import { useState, useEffect, useRef, useCallback } from "react";

/* ─── Theme Tokens ──────────────────────────────────────────────────── */
const T = {
  bg:    "#04080f",  bg1: "#070e1a",  bg2: "#0b1525",
  bdr:   "#0f2540",  bdrHi: "#1a4080",
  teal:  "#00d4aa",  amber: "#f5a623",  blue:   "#4da6ff",
  green: "#39d98a",  violet: "#a78bfa",  red:    "#ff4d6d",
  tx0:   "#ddeeff",  tx1:   "#6a9ec0",  tx2:    "#2a4a66",
  mono:  "'JetBrains Mono','Courier New',monospace",
  sans:  "'DM Sans',system-ui,sans-serif",
};

/* ─── Federated Learning Pipeline Steps ─────────────────────────────── */
const STEPS = [
  { id:0, phase:"INIT",        label:"System Initialisation",      layer:"all",   color:T.teal,   duration:2800,
    desc:"Bootstrapping 4 SME nodes. Generating Kyber-768 keypairs per node. Establishing secure channels to the cloud aggregator.",
    logs:["[AGG]     Aggregation server online — awaiting nodes","[NODE1]   Kyber-768 keygen OK  pk=0xA3F2...","[NODE2]   Kyber-768 keygen OK  pk=0xC8E0...","[NODE3]   Kyber-768 keygen OK  pk=0x71B3...","[NODE4]   Kyber-768 keygen OK  pk=0xF612...","[QUANTUM] VQC backend online  qubits=5  backend=AerSimulator  fidelity=0.94","[AGG]     4 nodes registered. Round 1 starting."] },
  { id:1, phase:"LOCAL_TRAIN", label:"Local Training (VQC+LSTM)",  layer:"local", color:T.blue,   duration:3200,
    desc:"Each SME trains a hybrid VQC–LSTM model on local revenue data. Raw data never leaves premises. DP noise injected (ε=2.8, δ=1e-5).",
    logs:["[NODE1]   Dataset: 24 mo revenue, 18 features","[NODE2]   Dataset: 18 mo revenue, 21 features","[QUANTUM] Angle-encoding 5-dim latent vec → 5 qubits","[QUANTUM] VQC forward pass  depth=4  shots=1024  loss=0.0821","[NODE2]   LSTM  hidden=128  seq=12  loss=0.0643","[NODE4]   DP noise injected  σ=0.42  clip_norm=1.0  ε_used=0.40","[ALL]     Local training done. Δweights ready."] },
  { id:2, phase:"ENCRYPT",     label:"Encrypt Model Updates",       layer:"nodes", color:T.violet, duration:2600,
    desc:"Weight gradients encrypted with Kyber-768 KEM. Dilithium-3 signatures appended. Packets chunked for upload.",
    logs:["[NODE1]   Serialising Δweights  2.1 MB","[NODE1]   Kyber-768 encapsulate → ct=0xB4A1...","[NODE2]   Dilithium-3 sign  sig=0x3FA2...  ok","[NODE3]   Chunking payload  8 × 256 KB","[NODE4]   Kyber-768 encapsulate → ct=0x77DC...","[ALL]     Payloads queued for upload."] },
  { id:3, phase:"TRANSMIT",    label:"Secure Transmission ↑",      layer:"up",    color:T.amber,  duration:2000,
    desc:"Quantum-resistant encrypted updates travel from each SME node to the cloud aggregator over TLS 1.3 + Kyber hybrid transport.",
    logs:["[CHAN]    NODE1→AGG  2.1MB  34ms  ✓","[CHAN]    NODE2→AGG  1.9MB  41ms  ✓","[CHAN]    NODE3→AGG  2.3MB  29ms  ✓","[CHAN]    NODE4→AGG  2.0MB  38ms  ✓","[AGG]     All 4 payloads received and verified."] },
  { id:4, phase:"AGGREGATE",   label:"Federated Averaging",         layer:"cloud", color:T.teal,   duration:3000,
    desc:"Aggregator decrypts updates in a secure enclave and runs FedAvg weighted by dataset size. New global model assembled.",
    logs:["[AGG]     Decrypt NODE1–4 → Δw intact","[AGG]     FedAvg  w_global=Σ(nᵢ/N)·Δwᵢ  n=[840,620,710,590]","[QUANTUM] VQC expectation values fused into global weight tensor","[PAR]     MA_short=£4,380  MA_long=£5,210  |Δ|=£830  >τ","[SHIFT]   ⚡ Market shift detected at t=current  |Δ|>τ  anomaly flagged","[PAR]     Adaptation window opened  k=2 periods  δ=£420","[AGG]     Global RMSE: £4,210  ↓11.3% vs LSTM · model checkpointed.","[AUDIT]   Round 12 checkpoint signed · Dilithium-3: sig_0x7F3A...E4C2 ✓","[XAI]     Decision trace: inventory buffer +23%  confidence 89%"] },
  { id:5, phase:"BROADCAST",   label:"Broadcast Global Model ↓",   layer:"down",  color:T.green,  duration:2000,
    desc:"Updated global weights encrypted per-node and pushed back. Each SME decrypts with its Kyber private key.",
    logs:["[AGG]     Encrypt → NODE1  pk=0xA3F2...","[AGG]     Encrypt → NODE2  pk=0xC8E0...","[AGG]     Encrypt → NODE3  pk=0x71B3...","[AGG]     Encrypt → NODE4  pk=0xF612...","[CHAN]    AGG→ALL broadcast complete  <50ms"] },
  { id:6, phase:"FORECAST",    label:"Local Inference & Forecast", layer:"local", color:T.amber,  duration:2400,
    desc:"Nodes apply the global model locally for a 52-week revenue forecast. Confidence intervals generated. Dashboard updated.",
    logs:["[NODE1]   Inference: 52w horizon  ensemble active","[NODE2]   Ensemble  VQC=0.35  LSTM=0.45  Prophet=0.20","[QUANTUM] Quantum kernel shift-detection lead: T+1 vs classical T+3","[NODE3]   RMSE=£3,940  MAE=£3,010  MAPE=2.6%","[PAR]     PAR score: 0.89  (2/2 shifts adapted within k=2)","[NODE4]   CI [95%]: £138k–£167k (wk 52)","[ALL]     Forecast done. Dashboard refreshed.","[AGG]     Round 1 complete. Next in 24h.","[AUDIT]   Forecast output signed for SME 1-4 · audit trail stored ✓","[XAI]     Top factor: Hilbert-space fidelity drop  weight=0.42  impact=critical"] },
];

/* ─── Shock Scenario ────────────────────────────────────────────────── */
const SHOCK_SCENARIO = [
  { text:"[AGG]      Standard Round 12: Global model synchronised.",                      color:T.blue },
  { text:"[PAR]      Baseline Metric: 0.88.  Forecasting stability: High.",               color:T.amber },
  { text:"──────────────────────────────────────────────────────────────────",             color:T.tx2 },
  { text:"[SHIFT]    !!! CRITICAL ANOMALY: RAW MATERIAL DISRUPTION DETECTED !!!",         color:T.red,   weight:"bold" },
  { text:"[SHIFT]    Supply-chain latency spike: +450% in Region-B.",                     color:T.red },
  { text:"[CLASSICAL] Kolay.ai Baseline (LSTM): Monitoring signal… [Status: No Action]", color:T.tx2,   opacity:0.65 },
  { text:"[QUANTUM]  Hilbert-Space Fidelity Drop: 0.98 → 0.42",                          color:T.teal,  weight:"bold" },
  { text:"[QUANTUM]  VQC Feature Mapping detects non-linear variance at T+1.",            color:T.teal },
  { text:"[PAR]      PROACTIVE ALERT: Adjusting SME Inventory Buffers immediately.",      color:T.amber },
  { text:"[CLASSICAL] Kolay.ai Baseline (LSTM): Shift confirmed at T+3. [Status: Reactive]", color:T.tx2, opacity:0.65 },
  { text:"[AGG]      Federated Re-Weighting initiated. Priority: Liquidity Preservation.", color:T.blue },
  { text:"[PAR]      Adaptation success (A=1) in 1.2 communication rounds.",              color:T.amber },
  { text:"[SYS]      Recovery Profile: Quantum Hybrid outpaces Classical by 48 hours.",   color:T.teal,  weight:"bold" },
  { text:"[CASH_FLOW] £42,500 working capital secured vs. Classical loss.",               color:T.green, weight:"bold" },
  { text:"[AUDIT]    Shock response signed · Dilithium-3: sig_0xB1D8...A95F ✓",          color:T.violet },
  { text:"[XAI]      Reasoning: supply-chain spike (42%) + fidelity drop (35%) + history (18%)", color:T.violet },
];

/* ═══════════════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════════════════ */

function ArchDiagram({ activeLayer, particles }: { activeLayer: string; particles: Particle[] }) {
  const W = 700, H = 310;
  const nodeXs = [80, 230, 380, 530];
  const aggCX = 310, aggY = 55;
  const nodeTopY = 165, localY = 268;

  const on = (ids: string | string[]) => Array.isArray(ids) ? ids.includes(activeLayer) : activeLayer === ids;
  const cloudOn = on(["cloud", "all"]);
  const nodesOn = on(["nodes", "local", "up", "down", "all"]);
  const localOn = on(["local", "all"]);
  const upOn    = on(["up", "all"]);
  const downOn  = on("down");

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
      {/* Cloud Aggregation Layer */}
      <rect x={12} y={12} width={W - 24} height={82} rx={6} fill={T.bg1}
        stroke={cloudOn ? T.teal : T.bdr} strokeWidth={cloudOn ? 1.6 : 0.8} opacity={cloudOn ? 1 : 0.45} />
      <text x={24} y={29} fill={cloudOn ? T.teal : T.tx2}
        fontSize={8.5} fontFamily={T.mono} fontWeight={700} letterSpacing="0.12em">CLOUD AGGREGATION LAYER</text>
      <text x={24} y={43} fill={T.tx1} fontSize={7.5} fontFamily={T.mono}>
        FedAvg Server  ·  Kyber-768 / Dilithium-3  ·  Secure Enclave  ·  TPM 2.0</text>

      {/* FedAvg Node */}
      <circle cx={aggCX} cy={aggY} r={22} fill={T.bg}
        stroke={cloudOn ? T.teal : T.bdr} strokeWidth={cloudOn ? 1.8 : 0.8} />
      <text x={aggCX} y={aggY - 4} fill={T.teal} fontSize={7.5} fontFamily={T.mono} fontWeight={700} textAnchor="middle">FED</text>
      <text x={aggCX} y={aggY + 7} fill={T.teal} fontSize={7.5} fontFamily={T.mono} fontWeight={700} textAnchor="middle">AVG</text>

      {/* Channel Label */}
      <text x={aggCX} y={133} fill={upOn || downOn ? T.amber : T.tx2}
        fontSize={8} textAnchor="middle" fontFamily={T.mono} letterSpacing="0.08em">
        {upOn ? "▲ UPLOADING — Kyber-768 encrypted" : downOn ? "▼ BROADCASTING — per-node encrypted" : "— Quantum-Resistant Channel —"}
      </text>

      {/* Federated Learning Nodes */}
      <rect x={12} y={150} width={W - 24} height={86} rx={6} fill={T.bg1}
        stroke={nodesOn ? T.violet : T.bdr} strokeWidth={nodesOn ? 1.4 : 0.8} opacity={nodesOn ? 1 : 0.45} />
      <text x={24} y={166} fill={nodesOn ? T.violet : T.tx2}
        fontSize={8.5} fontFamily={T.mono} fontWeight={700} letterSpacing="0.12em">FEDERATED LEARNING NODES</text>

      {nodeXs.map((nx, i) => (
        <g key={i}>
          <line x1={nx + 60} y1={nodeTopY} x2={aggCX} y2={aggY + 22}
            stroke={upOn ? T.amber : T.bdr} strokeWidth={upOn ? 1.2 : 0.5}
            strokeDasharray="4 3" opacity={upOn ? 0.85 : 0.3} />
          <line x1={aggCX} y1={aggY + 22} x2={nx + 60} y2={nodeTopY}
            stroke={downOn ? T.green : "none"} strokeWidth={1.2}
            strokeDasharray="4 3" opacity={0.8} />
          <line x1={nx + 60} y1={237} x2={nx + 60} y2={localY}
            stroke={localOn ? T.amber : T.bdr} strokeWidth={0.8}
            strokeDasharray="3 2" opacity={0.45} />
          <rect x={nx} y={nodeTopY} width={120} height={55} rx={5} fill={T.bg2}
            stroke={nodesOn ? T.blue : T.bdr} strokeWidth={nodesOn ? 1.2 : 0.6}
            opacity={nodesOn ? 1 : 0.5} />
          <text x={nx + 60} y={nodeTopY + 17} fill={nodesOn ? T.blue : T.tx2}
            fontSize={9.5} fontFamily={T.mono} fontWeight={700} textAnchor="middle">SME {i + 1}</text>
          <text x={nx + 60} y={nodeTopY + 31} fill={T.tx1}
            fontSize={7.5} fontFamily={T.mono} textAnchor="middle">
            {["Retail", "Hospitality", "Manufacturing", "Professional"][i]}</text>
          <text x={nx + 60} y={nodeTopY + 44} fill={T.tx2}
            fontSize={7} fontFamily={T.mono} textAnchor="middle">Kyber-768 ✓</text>
        </g>
      ))}

      {/* Local Processing */}
      <rect x={12} y={localY} width={W - 24} height={38} rx={6} fill={T.bg1}
        stroke={localOn ? T.amber : T.bdr} strokeWidth={localOn ? 1.4 : 0.8} opacity={localOn ? 1 : 0.4} />
      <text x={24} y={283} fill={localOn ? T.amber : T.tx2}
        fontSize={8.5} fontFamily={T.mono} fontWeight={700} letterSpacing="0.12em">LOCAL PROCESSING (on-premise)</text>
      <text x={24} y={297} fill={T.tx1} fontSize={7.5} fontFamily={T.mono}>
        VQC + LSTM training  ·  DP noise injection  ·  Raw data never leaves</text>

      {/* Animated Particles */}
      {particles.map(p => (
        <g key={p.id}>
          <circle cx={p.x} cy={p.y} r={4} fill={p.color} opacity={p.alpha} />
          <circle cx={p.x} cy={p.y} r={8} fill={p.color} opacity={p.alpha * 0.18} />
        </g>
      ))}
    </svg>
  );
}

function PrivacyGauge({ used }: { used: number }) {
  const max = 3, pct = Math.min(used / max, 1), R = 30, circ = 2 * Math.PI * R;
  const col = pct < 0.5 ? T.green : pct < 0.85 ? T.amber : T.red;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <svg width={76} height={76} viewBox="0 0 76 76">
        <circle cx={38} cy={38} r={R} fill="none" stroke={T.bdr} strokeWidth={5} />
        <circle cx={38} cy={38} r={R} fill="none" stroke={col} strokeWidth={5}
          strokeDasharray={`${circ * pct} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 38 38)"
          style={{ transition: "stroke-dasharray 0.7s ease" }} />
        <text x={38} y={35} textAnchor="middle" fill={col} fontSize={11} fontFamily={T.mono} fontWeight={700}>{used.toFixed(2)}</text>
        <text x={38} y={47} textAnchor="middle" fill={T.tx2} fontSize={7} fontFamily={T.mono}>/ {max}.00 ε</text>
      </svg>
      <span style={{ fontSize: 9, color: T.tx2, fontFamily: T.mono, letterSpacing: "0.1em" }}>PRIVACY BUDGET</span>
    </div>
  );
}

interface Particle { id: number; x: number; y: number; color: string; alpha: number; }

function LogPanel({ lines = [], activeColor, running, onClear }: {
  lines?: string[]; activeColor: string; running: boolean; onClear: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState("ALL");
  const filters = ["ALL", "AGG", "NODE", "CHAN", "QUANTUM", "PAR", "SHIFT", "SYS"];

  const parsed = lines.map((raw, i) => {
    const end = raw.indexOf("]");
    const tag = end > 0 ? raw.slice(1, end).trim() : null;
    const group = !tag ? "SYS"
      : tag === "AGG"     ? "AGG"
      : tag === "CHAN"    ? "CHAN"
      : tag === "ALL"     ? "AGG"
      : tag === "QUANTUM" ? "QUANTUM"
      : tag === "PAR"     ? "PAR"
      : tag === "SHIFT"   ? "SHIFT"
      : "NODE";
    const col =
      group === "AGG"     ? T.teal
      : group === "CHAN"    ? T.amber
      : group === "QUANTUM" ? T.teal
      : group === "PAR"     ? T.amber
      : group === "SHIFT"   ? T.red
      : group === "NODE"    ? T.blue
      : T.tx2;
    const bold = ["QUANTUM", "PAR", "SHIFT"].includes(group);
    const base = new Date("2025-01-14T09:00:00");
    base.setSeconds(base.getSeconds() + i * 4);
    const ts = base.toTimeString().slice(0, 8);
    return { raw, tag, end, col, group, bold, ts, i };
  });

  const visible = filter === "ALL" ? parsed : parsed.filter(p => p.group === filter);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [visible.length]);

  const tagCounts: Record<string, number> = {};
  filters.forEach(f => {
    tagCounts[f] = f === "ALL" ? parsed.length : parsed.filter(p => p.group === f).length;
  });

  const chipCol = (f: string) =>
    f === "AGG" ? T.teal : f === "CHAN" ? T.amber : f === "NODE" ? T.blue
    : f === "QUANTUM" ? T.teal : f === "PAR" ? T.amber : f === "SHIFT" ? T.red : T.tx2;

  const isIdle = lines.length === 0;

  return (
    <div style={{ background: T.bg, border: "1px solid " + T.bdr, borderRadius: 8, overflow: "hidden" }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "8px 12px", background: T.bg2, borderBottom: "1px solid " + T.bdr, flexWrap: "wrap", gap: 6
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <div style={{
            width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
            background: running ? T.teal : isIdle ? T.tx2 : T.green,
            opacity: running ? 1 : 0.6,
            animation: running ? "pulse 1s ease infinite" : "none",
          }} />
          <span style={{ fontSize: 9, fontFamily: T.mono, color: T.tx2, letterSpacing: "0.1em" }}>
            {running ? "STREAMING" : isIdle ? "IDLE" : parsed.length + " LINES"}
          </span>
          <div style={{ display: "flex", gap: 3, marginLeft: 6, flexWrap: "wrap" }}>
            {filters.map(f => {
              const cnt = tagCounts[f] ?? 0;
              const active = filter === f;
              const cc = chipCol(f);
              if (f !== "ALL" && cnt === 0) return null;
              return (
                <button key={f} onClick={() => setFilter(f)} style={{
                  padding: "2px 6px", borderRadius: 4, fontSize: 7.5, fontFamily: T.mono,
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 3,
                  background: active ? cc + "22" : "transparent",
                  border: "1px solid " + (active ? cc : T.bdr),
                  color: active ? cc : T.tx2, transition: "all 0.15s",
                }}>
                  {f === "SHIFT" ? "⚡" : f === "QUANTUM" ? "⬡" : f === "PAR" ? "📊" : ""}{f}
                  {cnt > 0 && (
                    <span style={{ fontSize: 7, color: active ? cc : T.tx2,
                      background: cc + "18", padding: "0 3px", borderRadius: 3 }}>{cnt}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        {!isIdle && (
          <button onClick={onClear} style={{
            padding: "2px 8px", borderRadius: 4, fontSize: 8, fontFamily: T.mono,
            cursor: "pointer", background: "transparent",
            border: "1px solid " + T.bdr, color: T.tx2,
          }}>✕ CLEAR</button>
        )}
      </div>

      <div ref={ref} style={{ height: 240, overflowY: "auto", padding: "10px 0",
        fontFamily: T.mono, fontSize: 10.5, lineHeight: 1.8 }}>
        {isIdle ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", height: "100%", gap: 10, opacity: 0.55 }}>
            <div style={{ fontSize: 22, color: T.tx2 }}>◌</div>
            <div style={{ fontSize: 10, color: T.tx2, textAlign: "center", lineHeight: 1.6 }}>
              System idle<br />
              <span style={{ fontSize: 9 }}>Press <span style={{ color: T.teal }}>▶ NEXT</span> or <span style={{ color: T.amber }}>⏩ AUTO</span> to begin</span>
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
              {["[QUANTUM]", "[PAR]", "[SHIFT]"].map(m => (
                <span key={m} style={{ fontSize: 7.5, fontFamily: T.mono, padding: "2px 7px",
                  borderRadius: 3, background: T.teal + "10", color: T.teal,
                  border: "1px solid " + T.teal + "20" }}>{m}</span>
              ))}
            </div>
          </div>
        ) : visible.length === 0 ? (
          <div style={{ padding: "10px 14px", fontSize: 9, color: T.tx2, fontFamily: T.mono }}>
            No {filter} entries yet.
          </div>
        ) : (
          visible.map((p, idx) => {
            const isLast = idx === visible.length - 1;
            const fade = 0.45 + (idx / Math.max(visible.length - 1, 1)) * 0.55;
            const accentCol = p.group === "SHIFT" ? T.red
              : p.group === "QUANTUM" ? T.teal
              : p.group === "PAR" ? T.amber
              : p.col;
            return (
              <div key={p.i} style={{
                display: "flex", gap: 0,
                opacity: isLast ? 1 : fade,
                padding: "1px 12px",
                background: isLast ? accentCol + "08" : p.group === "SHIFT" ? T.red + "05" : "transparent",
                borderLeft: "2px solid " + ((isLast || p.group === "SHIFT") ? accentCol : "transparent"),
                transition: "background 0.2s",
              }}>
                <span style={{ color: T.tx2, fontSize: 9, marginRight: 10, flexShrink: 0,
                  opacity: 0.6, lineHeight: 1.8 }}>{p.ts}</span>
                {p.tag && (
                  <span style={{ color: p.col, fontWeight: p.bold ? 700 : 600,
                    minWidth: 72, fontSize: 10.5, flexShrink: 0 }}>
                    {p.raw.slice(0, p.end + 1)}
                  </span>
                )}
                <span style={{
                  color: p.group === "SHIFT" ? T.red : p.tag ? T.tx1 : T.tx2,
                  fontSize: 10.5,
                  fontWeight: p.bold ? 600 : 400,
                }}>
                  {p.tag ? p.raw.slice(p.end + 1).trimStart() : p.raw}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN DASHBOARD
   ═══════════════════════════════════════════════════════════════════════ */

export default function QuantumFlowDashboard() {
  const [stepIndex, setStepIndex] = useState(-1);
  const [logs, setLogs] = useState<string[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [running, setRunning] = useState(false);
  const [auto, setAuto] = useState(false);
  const [shockMode, setShockMode] = useState(false);
  const [privacyUsed, setPrivacyUsed] = useState(0.0);
  const [showShock, setShowShock] = useState(false);

  const autoRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const particleIdRef = useRef(0);

  useEffect(() => { autoRef.current = auto; }, [auto]);

  const activeStep = stepIndex >= 0 && stepIndex < STEPS.length ? STEPS[stepIndex] : null;
  const activeLayer = activeStep ? activeStep.layer : "";

  /* ── Particle Animation ──────────────────────────────────────────── */
  useEffect(() => {
    if (!activeStep) { setParticles([]); return; }
    const layer = activeStep.layer;
    const isUp = layer === "up" || layer === "all";
    const isDown = layer === "down";
    if (!isUp && !isDown) { setParticles([]); return; }

    const interval = setInterval(() => {
      setParticles(prev => {
        const moved = prev
          .map(p => ({ ...p, y: isUp ? p.y - 2 : p.y + 2, alpha: p.alpha - 0.015 }))
          .filter(p => p.alpha > 0);
        const newParticles: Particle[] = [];
        if (Math.random() > 0.6) {
          const nodeXs = [140, 290, 440, 590];
          const nodeIdx = Math.floor(Math.random() * 4);
          newParticles.push({
            id: particleIdRef.current++,
            x: nodeXs[nodeIdx],
            y: isUp ? 165 : 55,
            color: isUp ? T.amber : T.green,
            alpha: 1,
          });
        }
        return [...moved, ...newParticles];
      });
    }, 30);
    return () => clearInterval(interval);
  }, [activeStep]);

  /* ── Step Execution ──────────────────────────────────────────────── */
  const executeStep = useCallback((idx: number) => {
    if (idx < 0 || idx >= STEPS.length) return;
    const step = STEPS[idx];
    setRunning(true);
    const stepLogs = step.logs;
    let i = 0;

    const stream = () => {
      if (i < stepLogs.length) {
        setLogs(prev => [...prev, stepLogs[i]]);
        i++;
        timerRef.current = setTimeout(stream, 280);
      } else {
        setRunning(false);
        if (autoRef.current && idx < STEPS.length - 1) {
          timerRef.current = setTimeout(() => {
            setStepIndex(idx + 1);
            executeStep(idx + 1);
          }, 800);
        }
      }
    };
    stream();

    if (step.phase === "LOCAL_TRAIN") {
      setPrivacyUsed(p => Math.min(p + 0.4, 3.0));
    }
  }, []);

  const handleNext = () => {
    if (running) return;
    const next = stepIndex + 1;
    if (next < STEPS.length) {
      setStepIndex(next);
      executeStep(next);
    }
  };

  const handleReset = () => {
    setRunning(false);
    setAuto(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    setStepIndex(-1);
    setLogs([]);
    setParticles([]);
    setPrivacyUsed(0);
    setShockMode(false);
    setShowShock(false);
  };

  const handleAutoToggle = () => {
    const nextAuto = !auto;
    setAuto(nextAuto);
    if (nextAuto && stepIndex === -1) {
      setStepIndex(0);
      executeStep(0);
    }
  };

  const handleShock = () => {
    setShockMode(true);
    setShowShock(true);
    const shockLogs = SHOCK_SCENARIO.map(s => s.text);
    setLogs(prev => [...prev, "", "═══ SHOCK SCENARIO TRIGGERED ═══", ...shockLogs]);
  };

  const clearLogs = () => setLogs([]);

  const cardStyle: React.CSSProperties = { background: T.bg1, border: "1px solid " + T.bdr, borderRadius: 10, padding: 16 };
  const btnBase: React.CSSProperties = { padding: "8px 16px", borderRadius: 6, fontSize: 11, fontFamily: T.mono, fontWeight: 600, cursor: "pointer", border: "1px solid " + T.bdr };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.tx0, fontFamily: T.sans, padding: "20px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>
            <span style={{ color: T.teal }}>QuantumFlow</span>
            <span style={{ color: T.tx1, fontWeight: 400 }}>.ai</span>
          </h1>
          <span style={{
            fontSize: 9, fontFamily: T.mono, color: T.teal,
            border: "1px solid " + T.teal + "40", padding: "2px 8px", borderRadius: 4,
            background: T.teal + "10",
          }}>
            RESILIENCE ENGINE v1.0.0
          </span>
        </div>
        <p style={{ margin: 0, fontSize: 12, color: T.tx1, maxWidth: 640, lineHeight: 1.5 }}>
          Hybrid Quantum-Classical (VQC-LSTM) Federated Learning for SME liquidity risk mitigation.
          Post-quantum cryptography secured. Differentially private.
        </p>
      </div>

      {/* Main Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, maxWidth: 1200 }}>
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Architecture Diagram */}
          <div style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 10, fontFamily: T.mono, color: T.tx2, letterSpacing: "0.1em" }}>
                SYSTEM ARCHITECTURE
              </span>
              {activeStep && (
                <span style={{
                  fontSize: 9, fontFamily: T.mono, color: activeStep.color,
                  border: "1px solid " + activeStep.color + "40", padding: "2px 8px", borderRadius: 4,
                  background: activeStep.color + "10",
                }}>
                  {activeStep.phase}
                </span>
              )}
            </div>
            <ArchDiagram activeLayer={activeLayer} particles={particles} />
          </div>

          {/* Step Progress */}
          <div style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 12 }}>
              {STEPS.map((s, i) => (
                <div key={s.id} style={{ flex: 1, display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontFamily: T.mono, fontWeight: 700,
                    background: i <= stepIndex ? s.color + "20" : T.bg2,
                    color: i <= stepIndex ? s.color : T.tx2,
                    border: "1.5px solid " + (i <= stepIndex ? s.color : T.bdr),
                    transition: "all 0.3s",
                  }}>
                    {i < stepIndex ? "✓" : i === stepIndex ? "●" : i + 1}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div style={{
                      flex: 1, height: 2,
                      background: i < stepIndex ? s.color : T.bdr,
                      transition: "background 0.3s",
                    }} />
                  )}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, fontFamily: T.mono, color: T.tx2 }}>
              {STEPS.map((s, i) => (
                <span key={s.id} style={{
                  color: i === stepIndex ? s.color : T.tx2,
                  fontWeight: i === stepIndex ? 600 : 400,
                  transition: "color 0.3s",
                  textAlign: "center", flex: 1,
                }}>
                  {s.label}
                </span>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div style={{ ...cardStyle, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              onClick={handleNext}
              disabled={running || stepIndex >= STEPS.length - 1}
              style={{
                ...btnBase,
                background: running || stepIndex >= STEPS.length - 1 ? T.bg2 : T.teal + "20",
                color: running || stepIndex >= STEPS.length - 1 ? T.tx2 : T.teal,
                border: "1px solid " + (running || stepIndex >= STEPS.length - 1 ? T.bdr : T.teal),
                opacity: running || stepIndex >= STEPS.length - 1 ? 0.5 : 1,
                cursor: running || stepIndex >= STEPS.length - 1 ? "not-allowed" : "pointer",
              }}
            >▶ NEXT STEP</button>

            <button
              onClick={handleAutoToggle}
              style={{
                ...btnBase,
                background: auto ? T.amber + "20" : T.bg2,
                color: auto ? T.amber : T.tx1,
                border: "1px solid " + (auto ? T.amber : T.bdr),
              }}
            >{auto ? "⏸ PAUSE AUTO" : "⏩ AUTO RUN"}</button>

            <button onClick={handleReset} style={{ ...btnBase, background: T.bg2, color: T.tx1 }}>⟲ RESET</button>

            <div style={{ flex: 1 }} />

            <button
              onClick={handleShock}
              disabled={shockMode}
              style={{
                ...btnBase,
                background: shockMode ? T.bg2 : T.red + "15",
                color: shockMode ? T.tx2 : T.red,
                border: "1px solid " + (shockMode ? T.bdr : T.red),
                opacity: shockMode ? 0.5 : 1,
                cursor: shockMode ? "not-allowed" : "pointer",
              }}
            >⚡ TRIGGER SHOCK</button>
          </div>

          {/* Step Description */}
          {activeStep && (
            <div style={{
              ...cardStyle,
              border: "1px solid " + activeStep.color + "30",
              borderLeft: "3px solid " + activeStep.color,
            }}>
              <div style={{ fontSize: 10, fontFamily: T.mono, color: activeStep.color, fontWeight: 700, marginBottom: 4 }}>
                {activeStep.phase} — {activeStep.label}
              </div>
              <div style={{ fontSize: 12, color: T.tx1, lineHeight: 1.5 }}>
                {activeStep.desc}
              </div>
            </div>
          )}

          {/* Logs */}
          <LogPanel
            lines={logs}
            activeColor={activeStep ? activeStep.color : T.teal}
            running={running}
            onClear={clearLogs}
          />
        </div>

        {/* Right Column — Metrics */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Privacy Budget */}
          <div style={{ ...cardStyle, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <PrivacyGauge used={privacyUsed} />
            <div style={{ fontSize: 10, color: T.tx1, textAlign: "center", marginTop: 4 }}>
              Differential Privacy<br />
              <span style={{ color: T.tx2, fontSize: 9 }}>(ε,δ)-DP with Gaussian mechanism</span>
            </div>
          </div>

          {/* Node Status */}
          <div style={cardStyle}>
            <div style={{ fontSize: 10, fontFamily: T.mono, color: T.tx2, letterSpacing: "0.1em", marginBottom: 12 }}>
              NODE STATUS
            </div>
            {[
              { name: "SME 1 — Retail", status: "ONLINE", color: T.green, last: "2s ago" },
              { name: "SME 2 — Hospitality", status: "TRAINING", color: T.amber, last: "now" },
              { name: "SME 3 — Manufacturing", status: "ONLINE", color: T.green, last: "5s ago" },
              { name: "SME 4 — Professional", status: "ENCRYPTING", color: T.violet, last: "now" },
            ].map((node, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "8px 0", borderBottom: i < 3 ? "1px solid " + T.bdr : "none",
              }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: T.tx0 }}>{node.name}</div>
                  <div style={{ fontSize: 9, fontFamily: T.mono, color: T.tx2, marginTop: 2 }}>
                    Last seen: {node.last}
                  </div>
                </div>
                <span style={{
                  fontSize: 8, fontFamily: T.mono, fontWeight: 700,
                  color: node.color,
                  border: "1px solid " + node.color + "40",
                  padding: "2px 8px", borderRadius: 4,
                  background: node.color + "10",
                }}>
                  {node.status}
                </span>
              </div>
            ))}
          </div>

          {/* Security Layer */}
          <div style={cardStyle}>
            <div style={{ fontSize: 10, fontFamily: T.mono, color: T.tx2, letterSpacing: "0.1em", marginBottom: 12 }}>
              SECURITY LAYER
            </div>
            {[
              { label: "Key Exchange", value: "Kyber-768" },
              { label: "Digital Signatures", value: "Dilithium-3" },
              { label: "Transport Security", value: "TLS 1.3 + PQC" },
              { label: "Secure Enclave", value: "TPM 2.0" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0" }}>
                <span style={{ fontSize: 10, color: T.tx1 }}>{item.label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 9, fontFamily: T.mono, color: T.violet }}>{item.value}</span>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.green }} />
                </div>
              </div>
            ))}
          </div>

          {/* Quantum Backend */}
          <div style={cardStyle}>
            <div style={{ fontSize: 10, fontFamily: T.mono, color: T.tx2, letterSpacing: "0.1em", marginBottom: 12 }}>
              QUANTUM BACKEND
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Qubits", value: "5", unit: "" },
                { label: "Backend", value: "AerSimulator", unit: "" },
                { label: "Fidelity", value: "0.94", unit: "" },
                { label: "Shots", value: "1024", unit: "" },
                { label: "VQC Depth", value: "4", unit: "layers" },
              ].map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: 10, color: T.tx1 }}>{m.label}</span>
                  <span style={{ fontSize: 11, fontFamily: T.mono, color: T.teal, fontWeight: 600 }}>
                    {m.value} <span style={{ fontSize: 8, color: T.tx2 }}>{m.unit}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* PAR Score */}
          <div style={cardStyle}>
            <div style={{ fontSize: 10, fontFamily: T.mono, color: T.tx2, letterSpacing: "0.1em", marginBottom: 8 }}>
              PAR SCORE
            </div>
            <div style={{ fontSize: 32, fontFamily: T.mono, fontWeight: 700, color: T.amber }}>
              0.89
            </div>
            <div style={{ fontSize: 9, color: T.tx2, marginTop: 4, lineHeight: 1.5 }}>
              Proactive Adaptation Rate<br />
              2/2 shifts adapted within k=2 periods
            </div>
          </div>
        </div>
      </div>

      {/* Shock Scenario Modal */}
      {showShock && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(4,8,15,0.85)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 100,
        }} onClick={() => setShowShock(false)}>
          <div style={{
            background: T.bg1, border: "1px solid " + T.red + "50",
            borderRadius: 12, padding: 28, maxWidth: 560, width: "90%",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span style={{ fontSize: 20 }}>⚡</span>
              <h2 style={{ margin: 0, fontSize: 16, color: T.red, fontWeight: 700 }}>
                SHOCK SCENARIO: Supply-Chain Disruption
              </h2>
            </div>
            <div style={{
              background: T.bg, borderRadius: 8, padding: 16,
              fontFamily: T.mono, fontSize: 11, lineHeight: 2,
              maxHeight: 400, overflowY: "auto",
            }}>
              {SHOCK_SCENARIO.map((line, i) => (
                <div key={i} style={{
                  color: line.color,
                  fontWeight: line.weight === "bold" ? 700 : 400,
                  opacity: line.opacity ?? 1,
                }}>
                  {line.text}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => setShowShock(false)}
                style={{ ...btnBase, background: T.red + "20", color: T.red, border: "1px solid " + T.red }}>
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.9); }
        }
        body { margin: 0; background: ${T.bg}; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${T.bdr}; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: ${T.bdrHi}; }
      `}</style>
    </div>
  );
}
