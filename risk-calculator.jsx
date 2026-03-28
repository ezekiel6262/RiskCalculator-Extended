import { useState, useEffect, useCallback } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;800&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0a;
    --surface: #111111;
    --surface2: #1a1a1a;
    --border: #2a2a2a;
    --accent: #00ff88;
    --accent2: #ff3a3a;
    --accent3: #ffcc00;
    --text: #f0f0f0;
    --muted: #666;
    --font-display: 'Syne', sans-serif;
    --font-mono: 'Space Mono', monospace;
  }

  body { background: var(--bg); color: var(--text); }

  .app {
    min-height: 100vh;
    background: var(--bg);
    padding: 32px 20px;
    font-family: var(--font-mono);
    position: relative;
    overflow: hidden;
  }

  .grid-bg {
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    z-index: 0;
  }

  .container {
    max-width: 680px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  .header {
    margin-bottom: 40px;
  }

  .header-tag {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.3em;
    color: var(--accent);
    text-transform: uppercase;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .header-tag::before {
    content: '';
    width: 20px;
    height: 1px;
    background: var(--accent);
  }

  .title {
    font-family: var(--font-display);
    font-size: clamp(28px, 5vw, 42px);
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.02em;
    color: var(--text);
  }

  .title span {
    color: var(--accent);
  }

  .subtitle {
    margin-top: 8px;
    color: var(--muted);
    font-size: 12px;
    letter-spacing: 0.05em;
  }

  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 28px;
    margin-bottom: 2px;
    position: relative;
  }

  .card:first-of-type { border-radius: 4px 4px 0 0; }
  .card:last-of-type { border-radius: 0 0 4px 4px; margin-bottom: 0; }
  .card.solo { border-radius: 4px; margin-bottom: 16px; }

  .card-label {
    font-size: 9px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .card-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  .side-toggle {
    display: flex;
    gap: 2px;
    margin-bottom: 24px;
  }

  .side-btn {
    flex: 1;
    padding: 12px;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--muted);
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.15s;
  }

  .side-btn.long.active {
    background: rgba(0,255,136,0.1);
    border-color: var(--accent);
    color: var(--accent);
  }

  .side-btn.short.active {
    background: rgba(255,58,58,0.1);
    border-color: var(--accent2);
    color: var(--accent2);
  }

  .side-btn:hover:not(.active) {
    border-color: #444;
    color: var(--text);
  }

  .input-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 12px;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .input-group.full {
    grid-column: 1 / -1;
  }

  .input-label {
    font-size: 9px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--muted);
  }

  .input-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .input-wrap input {
    width: 100%;
    background: var(--surface2);
    border: 1px solid var(--border);
    color: var(--text);
    font-family: var(--font-mono);
    font-size: 14px;
    padding: 10px 40px 10px 12px;
    outline: none;
    transition: border-color 0.15s;
    border-radius: 2px;
    -moz-appearance: textfield;
  }

  .input-wrap input::-webkit-outer-spin-button,
  .input-wrap input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  .input-wrap input:focus {
    border-color: var(--accent);
  }

  .input-unit {
    position: absolute;
    right: 10px;
    font-size: 10px;
    color: var(--muted);
    pointer-events: none;
  }

  .leverage-display {
    font-size: 22px;
    font-weight: 700;
    color: var(--accent);
    text-align: center;
    margin-bottom: 8px;
    font-family: var(--font-display);
  }

  .leverage-display.danger { color: var(--accent2); }
  .leverage-display.warn { color: var(--accent3); }

  .leverage-slider {
    -webkit-appearance: none;
    width: 100%;
    height: 4px;
    background: var(--border);
    outline: none;
    border-radius: 2px;
    cursor: pointer;
  }

  .leverage-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    background: var(--accent);
    border-radius: 50%;
    cursor: pointer;
    transition: background 0.15s;
  }

  .leverage-slider.danger::-webkit-slider-thumb { background: var(--accent2); }
  .leverage-slider.warn::-webkit-slider-thumb { background: var(--accent3); }

  .leverage-labels {
    display: flex;
    justify-content: space-between;
    margin-top: 6px;
  }

  .leverage-labels span {
    font-size: 9px;
    color: var(--muted);
  }

  .presets {
    display: flex;
    gap: 6px;
    margin-top: 10px;
  }

  .preset-btn {
    flex: 1;
    padding: 6px 4px;
    background: transparent;
    border: 1px solid var(--border);
    color: var(--muted);
    font-family: var(--font-mono);
    font-size: 10px;
    cursor: pointer;
    transition: all 0.15s;
    border-radius: 2px;
  }

  .preset-btn:hover, .preset-btn.active {
    border-color: var(--accent);
    color: var(--accent);
    background: rgba(0,255,136,0.05);
  }

  .results-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2px;
  }

  .result-cell {
    background: var(--surface2);
    padding: 16px;
    border: 1px solid var(--border);
  }

  .result-cell.danger { border-color: rgba(255,58,58,0.3); background: rgba(255,58,58,0.05); }
  .result-cell.warn { border-color: rgba(255,204,0,0.3); background: rgba(255,204,0,0.05); }
  .result-cell.good { border-color: rgba(0,255,136,0.3); background: rgba(0,255,136,0.05); }
  .result-cell.wide { grid-column: 1 / -1; }

  .result-key {
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 6px;
  }

  .result-val {
    font-size: 18px;
    font-weight: 700;
    font-family: var(--font-display);
    color: var(--text);
  }

  .result-val.danger { color: var(--accent2); }
  .result-val.warn { color: var(--accent3); }
  .result-val.good { color: var(--accent); }

  .result-sub {
    font-size: 10px;
    color: var(--muted);
    margin-top: 2px;
  }

  .risk-bar-wrap {
    margin-top: 20px;
  }

  .risk-bar-label {
    display: flex;
    justify-content: space-between;
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 8px;
  }

  .risk-bar-label span:last-child {
    color: var(--text);
    font-weight: 700;
  }

  .risk-bar-track {
    height: 6px;
    background: var(--border);
    border-radius: 3px;
    overflow: hidden;
  }

  .risk-bar-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.4s cubic-bezier(0.4,0,0.2,1), background 0.3s;
  }

  .warning-box {
    margin-top: 16px;
    padding: 12px 16px;
    border-left: 2px solid var(--accent3);
    background: rgba(255,204,0,0.05);
    font-size: 11px;
    color: var(--accent3);
    line-height: 1.6;
    display: flex;
    gap: 10px;
    align-items: flex-start;
  }

  .warning-box.critical {
    border-color: var(--accent2);
    background: rgba(255,58,58,0.05);
    color: var(--accent2);
  }

  .stop-row {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-top: 12px;
  }

  .stop-tag {
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
    white-space: nowrap;
  }

  .stop-line {
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  .stop-val {
    font-size: 12px;
    font-family: var(--font-mono);
    color: var(--accent3);
  }

  .empty-state {
    text-align: center;
    padding: 48px 20px;
    color: var(--muted);
    font-size: 12px;
    letter-spacing: 0.1em;
  }

  .empty-icon {
    font-size: 32px;
    margin-bottom: 12px;
    opacity: 0.3;
  }

  .divider {
    height: 1px;
    background: var(--border);
    margin: 20px 0;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .animate-in {
    animation: fadeIn 0.25s ease forwards;
  }
`;

const FEE_TIERS = [
  { label: "Default", maker: 0.02, taker: 0.05 },
  { label: "VIP 1", maker: 0.015, taker: 0.04 },
  { label: "VIP 2", maker: 0.01, taker: 0.03 },
  { label: "VIP 3", maker: 0.005, taker: 0.02 },
];

function fmt(n, decimals = 2) {
  if (!isFinite(n)) return "—";
  return n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function fmtUSD(n) {
  if (!isFinite(n)) return "—";
  return "$" + fmt(Math.abs(n), 2);
}

export default function RiskCalc() {
  const [side, setSide] = useState("long");
  const [entry, setEntry] = useState("");
  const [size, setSize] = useState("");
  const [leverage, setLeverage] = useState(10);
  const [tp, setTp] = useState("");
  const [sl, setSl] = useState("");
  const [feeTier, setFeeTier] = useState(0);
  const [results, setResults] = useState(null);

  const calc = useCallback(() => {
    const e = parseFloat(entry);
    const s = parseFloat(size);
    if (!e || !s || e <= 0 || s <= 0) { setResults(null); return; }

    const fees = FEE_TIERS[feeTier];
    const notional = s * leverage;
    const margin = s;
    const taker = fees.taker / 100;
    const maker = fees.maker / 100;

    // Maintenance margin ~0.5%
    const maintMarginRate = 0.005;

    let liqPrice;
    if (side === "long") {
      liqPrice = e * (1 - (1 / leverage) + maintMarginRate + taker);
    } else {
      liqPrice = e * (1 + (1 / leverage) - maintMarginRate - taker);
    }

    const liqDistance = Math.abs(e - liqPrice);
    const liqPct = (liqDistance / e) * 100;

    const openFee = notional * taker;
    const closeFee = notional * taker;
    const totalFees = openFee + closeFee;

    let tpPnl = null, slPnl = null, rr = null;
    const tpVal = parseFloat(tp);
    const slVal = parseFloat(sl);

    if (tpVal > 0) {
      const priceDiff = side === "long" ? tpVal - e : e - tpVal;
      tpPnl = (priceDiff / e) * notional - closeFee;
    }

    if (slVal > 0) {
      const priceDiff = side === "long" ? slVal - e : e - slVal;
      slPnl = (priceDiff / e) * notional - closeFee;
    }

    if (tpPnl !== null && slPnl !== null && slPnl < 0) {
      rr = Math.abs(tpPnl / slPnl);
    }

    const riskScore = Math.min(100, (leverage / 100) * 100);

    setResults({
      notional, margin, liqPrice, liqPct, totalFees, openFee, closeFee,
      tpPnl, slPnl, rr, riskScore,
      breakeven: side === "long"
        ? e * (1 + (totalFees / notional))
        : e * (1 - (totalFees / notional)),
    });
  }, [entry, size, leverage, tp, sl, side, feeTier]);

  useEffect(() => { calc(); }, [calc]);

  const lvClass = leverage >= 50 ? "danger" : leverage >= 20 ? "warn" : "";

  const getRiskColor = (score) => {
    if (score >= 60) return "var(--accent2)";
    if (score >= 30) return "var(--accent3)";
    return "var(--accent)";
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <div className="grid-bg" />
        <div className="container">

          <div className="header">
            <div className="header-tag">Extended Protocol</div>
            <h1 className="title">Position Risk<br /><span>Calculator</span></h1>
            <p className="subtitle">// Perp trading risk analysis tool</p>
          </div>

          {/* Side */}
          <div className="card solo">
            <div className="side-toggle">
              <button className={`side-btn long ${side === "long" ? "active" : ""}`} onClick={() => setSide("long")}>▲ Long</button>
              <button className={`side-btn short ${side === "short" ? "active" : ""}`} onClick={() => setSide("short")}>▼ Short</button>
            </div>

            <div className="card-label">Position Parameters</div>

            <div className="input-row">
              <div className="input-group">
                <label className="input-label">Entry Price</label>
                <div className="input-wrap">
                  <input type="number" placeholder="0.00" value={entry} onChange={e => setEntry(e.target.value)} />
                  <span className="input-unit">USD</span>
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Collateral</label>
                <div className="input-wrap">
                  <input type="number" placeholder="0.00" value={size} onChange={e => setSize(e.target.value)} />
                  <span className="input-unit">USD</span>
                </div>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Leverage</label>
              <div className={`leverage-display ${lvClass}`}>{leverage}×</div>
              <input
                type="range" min="1" max="100" value={leverage}
                className={`leverage-slider ${lvClass}`}
                onChange={e => setLeverage(Number(e.target.value))}
              />
              <div className="leverage-labels">
                <span>1×</span><span>25×</span><span>50×</span><span>75×</span><span>100×</span>
              </div>
              <div className="presets">
                {[2, 5, 10, 25, 50].map(v => (
                  <button key={v} className={`preset-btn ${leverage === v ? "active" : ""}`} onClick={() => setLeverage(v)}>{v}×</button>
                ))}
              </div>
            </div>
          </div>

          {/* TP/SL */}
          <div className="card solo">
            <div className="card-label">Take Profit / Stop Loss</div>
            <div className="input-row">
              <div className="input-group">
                <label className="input-label">Take Profit</label>
                <div className="input-wrap">
                  <input type="number" placeholder="Optional" value={tp} onChange={e => setTp(e.target.value)} />
                  <span className="input-unit">USD</span>
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Stop Loss</label>
                <div className="input-wrap">
                  <input type="number" placeholder="Optional" value={sl} onChange={e => setSl(e.target.value)} />
                  <span className="input-unit">USD</span>
                </div>
              </div>
            </div>
          </div>

          {/* Fee tier */}
          <div className="card solo">
            <div className="card-label">Fee Tier</div>
            <div className="presets">
              {FEE_TIERS.map((t, i) => (
                <button key={i} className={`preset-btn ${feeTier === i ? "active" : ""}`} onClick={() => setFeeTier(i)}>
                  {t.label}
                </button>
              ))}
            </div>
            <div style={{ marginTop: 8, fontSize: 10, color: "var(--muted)" }}>
              Maker {FEE_TIERS[feeTier].maker}% / Taker {FEE_TIERS[feeTier].taker}%
            </div>
          </div>

          {/* Results */}
          {!results ? (
            <div className="card solo">
              <div className="empty-state">
                <div className="empty-icon">⬡</div>
                <div>Enter position parameters to calculate risk</div>
              </div>
            </div>
          ) : (
            <div className="card solo animate-in">
              <div className="card-label">Risk Analysis</div>

              <div className="results-grid">
                <div className={`result-cell ${leverage >= 50 ? "danger" : leverage >= 20 ? "warn" : "good"}`}>
                  <div className="result-key">Liquidation Price</div>
                  <div className={`result-val ${leverage >= 50 ? "danger" : leverage >= 20 ? "warn" : "good"}`}>
                    {fmtUSD(results.liqPrice)}
                  </div>
                  <div className="result-sub">{fmt(results.liqPct)}% from entry</div>
                </div>

                <div className="result-cell">
                  <div className="result-key">Position Size</div>
                  <div className="result-val">{fmtUSD(results.notional)}</div>
                  <div className="result-sub">Notional value</div>
                </div>

                <div className="result-cell">
                  <div className="result-key">Total Fees</div>
                  <div className="result-val warn">{fmtUSD(results.totalFees)}</div>
                  <div className="result-sub">Open + Close</div>
                </div>

                <div className="result-cell">
                  <div className="result-key">Breakeven</div>
                  <div className="result-val">{fmtUSD(results.breakeven)}</div>
                  <div className="result-sub">After fees</div>
                </div>

                {results.tpPnl !== null && (
                  <div className="result-cell good">
                    <div className="result-key">TP PnL</div>
                    <div className="result-val good">+{fmtUSD(results.tpPnl)}</div>
                    <div className="result-sub">{fmt((results.tpPnl / results.margin) * 100)}% ROI</div>
                  </div>
                )}

                {results.slPnl !== null && (
                  <div className="result-cell danger">
                    <div className="result-key">SL PnL</div>
                    <div className="result-val danger">{fmtUSD(results.slPnl)}</div>
                    <div className="result-sub">{fmt((results.slPnl / results.margin) * 100)}% ROI</div>
                  </div>
                )}

                {results.rr !== null && (
                  <div className={`result-cell wide ${results.rr >= 2 ? "good" : results.rr >= 1 ? "warn" : "danger"}`}>
                    <div className="result-key">Risk / Reward Ratio</div>
                    <div className={`result-val ${results.rr >= 2 ? "good" : results.rr >= 1 ? "warn" : "danger"}`}>
                      1 : {fmt(results.rr)}
                    </div>
                    <div className="result-sub">
                      {results.rr >= 2 ? "✓ Favorable setup" : results.rr >= 1 ? "⚠ Acceptable" : "✗ Poor R:R — reconsider"}
                    </div>
                  </div>
                )}
              </div>

              <div className="risk-bar-wrap">
                <div className="risk-bar-label">
                  <span>Risk Score</span>
                  <span>{leverage >= 50 ? "HIGH RISK" : leverage >= 20 ? "MODERATE" : "CONSERVATIVE"}</span>
                </div>
                <div className="risk-bar-track">
                  <div className="risk-bar-fill" style={{
                    width: `${results.riskScore}%`,
                    background: getRiskColor(results.riskScore)
                  }} />
                </div>
              </div>

              {leverage >= 50 && (
                <div className="warning-box critical">
                  <span>⚠</span>
                  <span>{leverage}× leverage — liquidation is only {fmt(results.liqPct)}% away. A small adverse move wipes your entire margin.</span>
                </div>
              )}

              {leverage >= 20 && leverage < 50 && (
                <div className="warning-box">
                  <span>△</span>
                  <span>High leverage detected. Consider reducing position size or using a tighter stop loss to protect capital.</span>
                </div>
              )}
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: 24, fontSize: 10, color: "var(--muted)", letterSpacing: "0.1em" }}>
            EXTENDED PROTOCOL // FOR INFORMATIONAL USE ONLY
          </div>
        </div>
      </div>
    </>
  );
}
