'use client'

import { useState, useEffect, useCallback } from 'react'
import CorrelationHeatmap from './CorrelationHeatmap'

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Bebas+Neue&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0a;
    --surface: #111111;
    --surface2: #1a1a1a;
    --border: #2a2a2a;
    --g: #1D9E75;
    --g2: #0F6E56;
    --g3: #9FE1CB;
    --r: #D85A30;
    --y: #BA7517;
    --text: #f0f0f0;
    --muted: #666;
    --mono: 'IBM Plex Mono', monospace;
    --title: 'Bebas Neue', sans-serif;
  }

  html, body { background: var(--bg); color: var(--text); }

  .app {
    min-height: 100vh;
    background: var(--bg);
    font-family: var(--mono);
    position: relative;
  }

  .grid-bg {
    position: fixed; inset: 0;
    background-image:
      linear-gradient(rgba(29,158,117,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(29,158,117,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none; z-index: 0;
  }

  .nav {
    position: sticky; top: 0; z-index: 10;
    background: rgba(10,10,10,0.95);
    border-bottom: 0.5px solid var(--border);
    padding: 0 24px;
    display: flex;
    align-items: center;
    gap: 0;
    backdrop-filter: blur(8px);
  }

  .nav-brand {
    font-family: var(--title);
    font-size: 20px;
    letter-spacing: 0.05em;
    color: var(--text);
    padding: 14px 20px 14px 0;
    border-right: 0.5px solid var(--border);
    margin-right: 20px;
    white-space: nowrap;
  }
  .nav-brand span { color: var(--g); }

  .nav-tabs { display: flex; gap: 0; }
  .nav-tab {
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    padding: 14px 18px;
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    color: var(--muted);
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
  }
  .nav-tab:hover { color: var(--text); }
  .nav-tab.active { color: var(--g); border-bottom-color: var(--g); }

  .nav-badge {
    margin-left: auto;
    font-size: 9px;
    letter-spacing: 0.15em;
    color: var(--g);
    padding: 3px 8px;
    border: 0.5px solid var(--g);
    border-radius: 2px;
  }

  .page {
    max-width: 720px;
    margin: 0 auto;
    padding: 32px 20px 60px;
    position: relative;
    z-index: 1;
  }

  .header { margin-bottom: 28px; }
  .eyebrow {
    font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--g); margin-bottom: 8px;
    display: flex; align-items: center; gap: 8px;
  }
  .eyebrow::before { content: ''; width: 16px; height: 1px; background: var(--g); }
  .page-title {
    font-family: var(--title);
    font-size: clamp(28px, 5vw, 40px);
    letter-spacing: -0.01em; line-height: 1;
  }
  .page-title span { color: var(--g); }
  .page-sub { margin-top: 6px; color: var(--muted); font-size: 11px; letter-spacing: 0.05em; }

  .card {
    background: var(--surface);
    border: 0.5px solid var(--border);
    border-radius: 6px;
    padding: 22px;
    margin-bottom: 10px;
  }

  .card-label {
    font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase;
    color: var(--muted); margin-bottom: 16px;
    display: flex; align-items: center; gap: 8px;
  }
  .card-label::after { content: ''; flex: 1; height: 0.5px; background: var(--border); }

  /* --- SIDE TOGGLE --- */
  .side-toggle { display: flex; gap: 3px; margin-bottom: 18px; }
  .side-btn {
    flex: 1; padding: 10px;
    border: 0.5px solid var(--border);
    background: transparent; color: var(--muted);
    font-family: var(--mono); font-size: 11px; font-weight: 500;
    letter-spacing: 0.15em; text-transform: uppercase;
    cursor: pointer; border-radius: 4px; transition: all 0.15s;
  }
  .side-btn.long.active { background: rgba(29,158,117,0.12); border-color: var(--g); color: var(--g); }
  .side-btn.short.active { background: rgba(216,90,48,0.12); border-color: var(--r); color: var(--r); }
  .side-btn:hover:not(.active) { border-color: #444; color: var(--text); }

  /* --- INPUTS --- */
  .input-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
  .inp-group { display: flex; flex-direction: column; gap: 5px; }
  .inp-lbl { font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); }
  .inp-wrap { position: relative; display: flex; align-items: center; }
  .inp-wrap input {
    width: 100%; background: var(--surface2); border: 0.5px solid var(--border);
    color: var(--text); font-family: var(--mono); font-size: 13px;
    padding: 9px 36px 9px 11px; border-radius: 4px; outline: none;
    transition: border 0.15s; -moz-appearance: textfield;
  }
  .inp-wrap input::-webkit-outer-spin-button,
  .inp-wrap input::-webkit-inner-spin-button { -webkit-appearance: none; }
  .inp-wrap input:focus { border-color: var(--g); }
  .inp-unit { position: absolute; right: 10px; font-size: 10px; color: var(--muted); pointer-events: none; }

  /* --- LEVERAGE --- */
  .lev-num { font-size: 22px; font-weight: 500; text-align: center; margin-bottom: 6px; }
  .lev-num.warn { color: var(--y); }
  .lev-num.danger { color: var(--r); }
  .lev-num.safe { color: var(--g); }
  .lev-slider {
    width: 100%; -webkit-appearance: none; height: 3px;
    background: var(--border); border-radius: 2px; outline: none; cursor: pointer;
  }
  .lev-slider::-webkit-slider-thumb {
    -webkit-appearance: none; width: 16px; height: 16px;
    border-radius: 50%; background: var(--g); cursor: pointer; transition: background 0.15s;
  }
  .lev-slider.warn::-webkit-slider-thumb { background: var(--y); }
  .lev-slider.danger::-webkit-slider-thumb { background: var(--r); }
  .lev-marks { display: flex; justify-content: space-between; margin-top: 5px; }
  .lev-marks span { font-size: 9px; color: var(--muted); }
  .presets { display: flex; gap: 5px; margin-top: 8px; }
  .preset {
    flex: 1; padding: 5px; background: transparent;
    border: 0.5px solid var(--border); color: var(--muted);
    font-family: var(--mono); font-size: 10px; cursor: pointer;
    border-radius: 3px; transition: all 0.15s;
  }
  .preset:hover, .preset.active { border-color: var(--g); color: var(--g); background: rgba(29,158,117,0.07); }

  /* --- FEE CARD --- */
  .fee-note {
    font-size: 10px; color: var(--muted); margin-top: 8px;
    padding: 8px 10px; background: var(--surface2);
    border-radius: 4px; border: 0.5px solid var(--border); line-height: 1.7;
  }
  .fee-note span { color: var(--g); font-weight: 500; }
  .fee-postonly { display: flex; align-items: center; gap: 8px; margin-top: 8px; font-size: 10px; color: var(--muted); cursor: pointer; }

  /* --- RESULTS --- */
  .results-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .res-cell {
    background: var(--surface2); padding: 14px;
    border-radius: 4px; border: 0.5px solid var(--border);
  }
  .res-cell.wide { grid-column: 1 / -1; }
  .res-cell.good { border-color: rgba(29,158,117,0.4); background: rgba(29,158,117,0.04); }
  .res-cell.warn { border-color: rgba(186,117,23,0.4); background: rgba(186,117,23,0.04); }
  .res-cell.danger { border-color: rgba(216,90,48,0.4); background: rgba(216,90,48,0.04); }
  .res-key { font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); margin-bottom: 5px; }
  .res-val { font-size: 18px; font-weight: 500; }
  .res-val.good { color: var(--g); }
  .res-val.warn { color: var(--y); }
  .res-val.danger { color: var(--r); }
  .res-sub { font-size: 10px; color: var(--muted); margin-top: 2px; }

  .risk-wrap { margin-top: 16px; }
  .risk-labels { display: flex; justify-content: space-between; font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); margin-bottom: 6px; }
  .risk-labels b { color: var(--text); font-weight: 500; }
  .risk-track { height: 5px; background: var(--border); border-radius: 3px; overflow: hidden; }
  .risk-fill { height: 100%; border-radius: 3px; transition: width 0.4s cubic-bezier(0.4,0,0.2,1); }

  .warn-box {
    margin-top: 12px; padding: 10px 14px;
    border-left: 2px solid var(--y); background: rgba(186,117,23,0.06);
    font-size: 11px; color: var(--y); line-height: 1.6;
    display: flex; gap: 8px;
  }
  .warn-box.crit { border-color: var(--r); background: rgba(216,90,48,0.06); color: var(--r); }

  .empty { padding: 40px; text-align: center; color: var(--muted); font-size: 12px; letter-spacing: 0.1em; }

  /* --- WHALE MONITOR --- */
  .wm-live { display: flex; align-items: center; gap: 6px; font-size: 10px; letter-spacing: 0.15em; color: var(--g); padding: 4px 10px; border: 0.5px solid var(--g); border-radius: 2px; }
  .wm-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--g); animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

  .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 14px; }
  .stat-cell { background: var(--surface2); border-radius: 4px; padding: 12px; }
  .stat-lbl { font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); margin-bottom: 4px; }
  .stat-val { font-size: 16px; font-weight: 500; }
  .stat-val.g { color: var(--g); }
  .stat-val.r { color: var(--r); }
  .stat-val.a { color: var(--y); }

  .filters { display: flex; gap: 5px; margin-bottom: 12px; flex-wrap: wrap; }
  .filter-btn {
    font-family: var(--mono); font-size: 10px; letter-spacing: 0.08em;
    padding: 5px 11px; border: 0.5px solid var(--border);
    border-radius: 3px; background: transparent; color: var(--muted);
    cursor: pointer; transition: all 0.15s;
  }
  .filter-btn:hover { border-color: var(--g); color: var(--g); }
  .filter-btn.active { background: rgba(15,110,86,0.15); border-color: var(--g); color: var(--g3); }

  .table-wrap { border: 0.5px solid var(--border); border-radius: 6px; overflow: hidden; }
  .table-head {
    display: grid;
    grid-template-columns: minmax(0,1.3fr) 88px 88px 82px 82px 68px;
    padding: 8px 16px;
    background: var(--surface2);
    border-bottom: 0.5px solid var(--border);
  }
  .th { font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); }
  .th.r { text-align: right; }

  .mkt-row {
    display: grid;
    grid-template-columns: minmax(0,1.3fr) 88px 88px 82px 82px 68px;
    padding: 11px 16px;
    border-bottom: 0.5px solid var(--border);
    transition: background 0.1s;
    position: relative; overflow: hidden;
    animation: slideIn 0.25s ease forwards; opacity: 0;
  }
  @keyframes slideIn { from{opacity:0;transform:translateX(-5px)} to{opacity:1;transform:translateX(0)} }
  .mkt-row:last-child { border-bottom: none; }
  .mkt-row:hover { background: var(--surface2); }

  .row-accent { position: absolute; left: 0; top: 0; bottom: 0; width: 2px; }
  .row-accent.bull { background: var(--g); }
  .row-accent.bear { background: var(--r); }
  .row-accent.neutral { background: var(--border); }

  .td { font-size: 12px; display: flex; align-items: center; }
  .td.r { justify-content: flex-end; }
  .td.col { flex-direction: column; align-items: flex-start; justify-content: center; gap: 2px; }

  .mkt-name { font-weight: 500; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .cat-badge { font-size: 8px; letter-spacing: 0.1em; padding: 1px 5px; border-radius: 2px; font-weight: 500; }
  .crypto { background: rgba(29,158,117,0.12); color: var(--g2); }
  .equities { background: rgba(55,138,221,0.12); color: #185FA5; }
  .fx { background: rgba(127,119,221,0.12); color: #534AB7; }
  .commodities { background: rgba(186,117,23,0.12); color: #854F0B; }
  .indices { background: rgba(136,135,128,0.12); color: #5F5E5A; }

  .bias-tag { font-size: 9px; font-weight: 500; letter-spacing: 0.1em; padding: 2px 7px; border-radius: 2px; }
  .bias-tag.bull { background: rgba(29,158,117,0.12); color: var(--g2); }
  .bias-tag.bear { background: rgba(216,90,48,0.12); color: #993C1D; }
  .bias-tag.neutral { background: var(--surface2); color: var(--muted); border: 0.5px solid var(--border); }

  .bar-track { height: 2px; background: var(--border); border-radius: 1px; margin-top: 3px; overflow: hidden; width: 100%; }
  .bar-fill { height: 100%; border-radius: 1px; transition: width 0.8s ease; }

  .wm-loading { display: flex; align-items: center; gap: 8px; padding: 32px; justify-content: center; color: var(--muted); font-size: 12px; }
  .spinner { width: 14px; height: 14px; border: 1.5px solid var(--border); border-top-color: var(--g); border-radius: 50%; animation: spin 0.8s linear infinite; flex-shrink: 0; }
  @keyframes spin { to{transform:rotate(360deg)} }

  .wm-error { padding: 24px; text-align: center; }
  .wm-error-title { font-size: 13px; font-weight: 500; margin-bottom: 6px; }
  .wm-error-sub { font-size: 11px; color: var(--muted); line-height: 1.7; }
  .wm-error code { background: var(--surface2); padding: 2px 6px; border-radius: 3px; font-size: 10px; }

  .page-footer { text-align: center; margin-top: 24px; font-size: 9px; color: var(--muted); letter-spacing: 0.1em; }

  @media (max-width: 520px) {
    .input-grid { grid-template-columns: 1fr; }
    .results-grid { grid-template-columns: 1fr; }
    .res-cell.wide { grid-column: 1; }
    .stat-grid { grid-template-columns: 1fr 1fr; }
    .table-head, .mkt-row { grid-template-columns: minmax(0,1fr) 70px 70px 60px; }
    .table-head .th:nth-child(5), .table-head .th:nth-child(6),
    .mkt-row .td:nth-child(5), .mkt-row .td:nth-child(6) { display: none; }
  }
`

// ─── HELPERS ───────────────────────────────────────────────────────────────

function fmt(n, d = 2) {
  if (!isFinite(n)) return '—'
  return n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })
}
function fmtUSD(n) {
  if (!isFinite(n) || n === 0) return '—'
  const abs = Math.abs(n)
  const sign = n < 0 ? '-' : ''
  if (abs >= 1e9) return sign + '$' + (abs / 1e9).toFixed(2) + 'B'
  if (abs >= 1e6) return sign + '$' + (abs / 1e6).toFixed(1) + 'M'
  if (abs >= 1e3) return sign + '$' + Math.round(abs / 1e3) + 'K'
  return sign + '$' + fmt(abs, 2)
}
function fmtPrice(n, cat) {
  if (!isFinite(n)) return '—'
  if (cat === 'fx') return n.toFixed(4)
  if (n >= 1000) return '$' + Math.round(n).toLocaleString()
  if (n >= 1) return '$' + n.toFixed(3)
  return '$' + n.toFixed(6)
}
function fmtFund(f) {
  if (!isFinite(f)) return '—'
  return (f >= 0 ? '+' : '') + (f * 100).toFixed(4) + '%'
}
function getBias(f) { return f > 0.0001 ? 'bull' : f < -0.0001 ? 'bear' : 'neutral' }

const CRYPTO = new Set(['BTC','ETH','SOL','AVAX','ARB','OP','DOGE','LINK','AAVE','UNI','MATIC','INJ','SUI','APT','SEI','TIA','ATOM','DOT','ADA','XRP','LTC','BCH','ETC','FIL','NEAR','ALGO','ICP','XVS'])
const FX = new Set(['EUR','GBP','JPY','AUD','CAD','CHF','NZD','SGD','HKD','NOK','SEK','DKK','MXN','BRL','ZAR','TRY'])
const COMMODITIES = new Set(['XAU','XAG','OIL','WTI','BRENT','GAS','WHEAT','CORN','COPPER','PLATINUM'])
const INDICES = new Set(['SPX','NDX','DJI','RUT','FTSE','DAX','CAC','NIKKEI','HANGSENG','ASX'])

function getCategory(name) {
  const asset = name.split('-')[0].toUpperCase()
  if (INDICES.has(asset) || [...INDICES].some(i => asset.includes(i))) return 'indices'
  if (COMMODITIES.has(asset)) return 'commodities'
  if (FX.has(asset)) return 'fx'
  if (CRYPTO.has(asset)) return 'crypto'
  // heuristic: if it looks like a stock ticker (all caps, short) and not crypto/fx → equities
  if (asset.length >= 2 && asset.length <= 5 && !name.includes('USD') && !CRYPTO.has(asset)) return 'equities'
  return 'crypto'
}

const CAT_LABEL = { crypto: 'Crypto', equities: 'Equity', fx: 'FX', commodities: 'Commodity', indices: 'Index' }

// ─── RISK CALCULATOR ──────────────────────────────────────────────────────

function RiskCalculator() {
  const [side, setSide] = useState('long')
  const [entry, setEntry] = useState('')
  const [size, setSize] = useState('')
  const [lev, setLev] = useState(10)
  const [tp, setTp] = useState('')
  const [sl, setSl] = useState('')
  const [postOnly, setPostOnly] = useState(false)
  const [results, setResults] = useState(null)

  const calc = useCallback(() => {
    const e = parseFloat(entry), s = parseFloat(size)
    if (!e || !s || e <= 0 || s <= 0) { setResults(null); return }
    const notional = s * lev
    const takerFee = 0.00025, makerFee = 0
    const openFee = notional * (postOnly ? makerFee : takerFee)
    const closeFee = notional * takerFee
    const totalFees = openFee + closeFee
    const maint = 0.005
    const liqPrice = side === 'long'
      ? e * (1 - (1 / lev) + maint + takerFee)
      : e * (1 + (1 / lev) - maint - takerFee)
    const liqPct = Math.abs(e - liqPrice) / e * 100
    const breakeven = side === 'long'
      ? e * (1 + totalFees / notional)
      : e * (1 - totalFees / notional)
    let tpPnl = null, slPnl = null, rr = null
    const tpV = parseFloat(tp), slV = parseFloat(sl)
    if (tpV > 0) { const d = side === 'long' ? tpV - e : e - tpV; tpPnl = (d / e) * notional - closeFee }
    if (slV > 0) { const d = side === 'long' ? slV - e : e - slV; slPnl = (d / e) * notional - closeFee }
    if (tpPnl !== null && slPnl !== null && slPnl < 0) rr = Math.abs(tpPnl / slPnl)
    setResults({ notional, liqPrice, liqPct, totalFees, breakeven, tpPnl, slPnl, rr, riskScore: Math.min(100, lev), margin: s })
  }, [entry, size, lev, tp, sl, side, postOnly])

  useEffect(() => { calc() }, [calc])

  const lvCls = lev >= 50 ? 'danger' : lev >= 20 ? 'warn' : 'safe'
  const riskColor = lev >= 50 ? 'var(--r)' : lev >= 20 ? 'var(--y)' : 'var(--g)'

  return (
    <>
      <div className="header">
        <div className="eyebrow">Extended Protocol · Starknet</div>
        <h1 className="page-title">Position Risk <span>Calculator</span></h1>
        <p className="page-sub">// USDC collateral · 0% maker / 0.025% taker · Up to 100× leverage</p>
      </div>

      <div className="card">
        <div className="side-toggle">
          <button className={`side-btn long ${side === 'long' ? 'active' : ''}`} onClick={() => setSide('long')}>▲ Long</button>
          <button className={`side-btn short ${side === 'short' ? 'active' : ''}`} onClick={() => setSide('short')}>▼ Short</button>
        </div>
        <div className="card-label">Position parameters</div>
        <div className="input-grid">
          <div className="inp-group">
            <label className="inp-lbl">Entry price</label>
            <div className="inp-wrap">
              <input type="number" placeholder="0.00" value={entry} onChange={e => setEntry(e.target.value)} />
              <span className="inp-unit">USD</span>
            </div>
          </div>
          <div className="inp-group">
            <label className="inp-lbl">Collateral (USDC)</label>
            <div className="inp-wrap">
              <input type="number" placeholder="0.00" value={size} onChange={e => setSize(e.target.value)} />
              <span className="inp-unit">USDC</span>
            </div>
          </div>
        </div>
        <div className="inp-group">
          <label className="inp-lbl">Leverage</label>
          <div className={`lev-num ${lvCls}`}>{lev}×</div>
          <input type="range" min="1" max="100" value={lev} step="1" className={`lev-slider ${lvCls}`}
            onChange={e => setLev(Number(e.target.value))} />
          <div className="lev-marks"><span>1×</span><span>25×</span><span>50×</span><span>75×</span><span>100×</span></div>
          <div className="presets">
            {[2,5,10,25,50,100].map(v => (
              <button key={v} className={`preset ${lev === v ? 'active' : ''}`} onClick={() => setLev(v)}>{v}×</button>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-label">Take profit / Stop loss</div>
        <div className="input-grid">
          <div className="inp-group">
            <label className="inp-lbl">Take profit</label>
            <div className="inp-wrap">
              <input type="number" placeholder="Optional" value={tp} onChange={e => setTp(e.target.value)} />
              <span className="inp-unit">USD</span>
            </div>
          </div>
          <div className="inp-group">
            <label className="inp-lbl">Stop loss</label>
            <div className="inp-wrap">
              <input type="number" placeholder="Optional" value={sl} onChange={e => setSl(e.target.value)} />
              <span className="inp-unit">USD</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-label">Extended fee schedule</div>
        <div className="results-grid">
          <div className="res-cell good">
            <div className="res-key">Maker fee</div>
            <div className="res-val good">0.000%</div>
            <div className="res-sub">Post-only orders</div>
          </div>
          <div className="res-cell warn">
            <div className="res-key">Taker fee</div>
            <div className="res-val warn">0.025%</div>
            <div className="res-sub">Market / limit orders</div>
          </div>
        </div>
        <div className="fee-note">
          Using <span>0.025% taker</span> for open + close. Toggle post-only to set open fee to <span>0%</span>.
          <label className="fee-postonly">
            <input type="checkbox" checked={postOnly} onChange={e => setPostOnly(e.target.checked)} />
            Post-only open order (maker fee)
          </label>
        </div>
      </div>

      <div className="card">
        {!results ? (
          <div className="empty">Enter position parameters to calculate risk</div>
        ) : (
          <>
            <div className="card-label">Risk analysis</div>
            <div className="results-grid">
              <div className={`res-cell ${lvCls}`}>
                <div className="res-key">Liquidation price</div>
                <div className={`res-val ${lvCls}`}>{fmtUSD(results.liqPrice)}</div>
                <div className="res-sub">{fmt(results.liqPct)}% from entry</div>
              </div>
              <div className="res-cell">
                <div className="res-key">Position size</div>
                <div className="res-val">{fmtUSD(results.notional)}</div>
                <div className="res-sub">Notional (USDC)</div>
              </div>
              <div className="res-cell warn">
                <div className="res-key">Total fees</div>
                <div className="res-val warn">{fmtUSD(results.totalFees)}</div>
                <div className="res-sub">{postOnly ? 'Maker open (0%) + taker close' : 'Taker open + taker close'}</div>
              </div>
              <div className="res-cell">
                <div className="res-key">Breakeven</div>
                <div className="res-val">{fmtUSD(results.breakeven)}</div>
                <div className="res-sub">After fees</div>
              </div>
              {results.tpPnl !== null && (
                <div className="res-cell good">
                  <div className="res-key">TP PnL</div>
                  <div className="res-val good">+{fmtUSD(results.tpPnl)}</div>
                  <div className="res-sub">{fmt(results.tpPnl / results.margin * 100)}% ROI on collateral</div>
                </div>
              )}
              {results.slPnl !== null && (
                <div className="res-cell danger">
                  <div className="res-key">SL PnL</div>
                  <div className="res-val danger">{fmtUSD(results.slPnl)}</div>
                  <div className="res-sub">{fmt(results.slPnl / results.margin * 100)}% ROI on collateral</div>
                </div>
              )}
              {results.rr !== null && (
                <div className={`res-cell wide ${results.rr >= 2 ? 'good' : results.rr >= 1 ? 'warn' : 'danger'}`}>
                  <div className="res-key">Risk / reward ratio</div>
                  <div className={`res-val ${results.rr >= 2 ? 'good' : results.rr >= 1 ? 'warn' : 'danger'}`}>1 : {fmt(results.rr)}</div>
                  <div className="res-sub">{results.rr >= 2 ? '✓ Favorable setup' : results.rr >= 1 ? '⚠ Acceptable' : '✗ Poor R:R — reconsider'}</div>
                </div>
              )}
            </div>
            <div className="risk-wrap">
              <div className="risk-labels">
                <span>Risk score</span>
                <b>{lev >= 50 ? 'HIGH RISK' : lev >= 20 ? 'MODERATE' : 'CONSERVATIVE'}</b>
              </div>
              <div className="risk-track">
                <div className="risk-fill" style={{ width: `${results.riskScore}%`, background: riskColor }} />
              </div>
            </div>
            {lev >= 50 && <div className="warn-box crit"><span>⚠</span><span>{lev}× leverage — liquidation only {fmt(results.liqPct)}% away. One adverse move wipes your full USDC margin.</span></div>}
            {lev >= 20 && lev < 50 && <div className="warn-box"><span>△</span><span>High leverage. Consider a tighter stop loss to protect your USDC collateral.</span></div>}
          </>
        )}
      </div>
    </>
  )
}

// ─── WHALE MONITOR ────────────────────────────────────────────────────────

function WhaleMonitor() {
  const [markets, setMarkets] = useState([])
  const [filter, setFilter] = useState('all')
  const [status, setStatus] = useState('loading')
  const [ts, setTs] = useState('Connecting...')
  const [stats, setStats] = useState({ count: '—', oi: '—', vol: '—', fund: '—', fundCls: '' })

  const getFiltered = useCallback((all) => {
    if (filter === 'bull') return all.filter(m => m.bias === 'bull')
    if (filter === 'bear') return all.filter(m => m.bias === 'bear')
    if (['crypto','equities','fx','commodities','indices'].includes(filter)) return all.filter(m => m.cat === filter)
    return all
  }, [filter])

  const load = useCallback(async () => {
    setStatus('loading')
    try {
      const res = await fetch('/api/markets')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      if (json.status !== 'ok' && json.status !== 'OK') throw new Error(json.error?.message || 'API error')
      const data = (json.data || [])
        .filter(m => m.status === 'ACTIVE' && m.marketStats)
        .map(m => {
          const s = m.marketStats
          return {
            name: m.name, asset: m.assetName,
            cat: getCategory(m.name),
            oi: parseFloat(s.openInterest) || 0,
            oiBase: parseFloat(s.openInterestBase) || 0,
            mark: parseFloat(s.markPrice) || 0,
            vol: parseFloat(s.dailyVolume) || 0,
            funding: parseFloat(s.fundingRate) || 0,
            change: parseFloat(s.dailyPriceChangePercentage) || 0,
            bias: getBias(parseFloat(s.fundingRate) || 0),
          }
        })
      if (!data.length) throw new Error('No active markets')
      setMarkets(data)
      setStatus('ok')
      setTs(`Live · ${data.length} markets · ${new Date().toLocaleTimeString()}`)
    } catch (err) {
      setMarkets([])
      setStatus('error')
      setTs('Connection failed')
    }
  }, [])

  useEffect(() => { load() }, [load])
  useEffect(() => {
    const id = setInterval(load, 30000)
    return () => clearInterval(id)
  }, [load])

  useEffect(() => {
    const visible = getFiltered(markets)
    if (!visible.length) { setStats({ count: '0', oi: '—', vol: '—', fund: '—', fundCls: '' }); return }
    const totalOI = visible.reduce((s, m) => s + m.oi, 0)
    const totalVol = visible.reduce((s, m) => s + m.vol, 0)
    const avgFund = visible.reduce((s, m) => s + m.funding, 0) / visible.length
    setStats({
      count: visible.length,
      oi: fmtUSD(totalOI),
      vol: fmtUSD(totalVol),
      fund: fmtFund(avgFund),
      fundCls: avgFund > 0 ? 'g' : avgFund < 0 ? 'r' : '',
    })
  }, [markets, filter, getFiltered])

  const visible = [...getFiltered(markets)].sort((a, b) => b.oi - a.oi)
  const maxOI = visible[0]?.oi || 1

  return (
    <>
      <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="eyebrow">Extended Protocol · Starknet · 100+ Markets</div>
          <h1 className="page-title">Whale <span>Monitor</span></h1>
          <p className="page-sub">// Live OI, funding rates & market bias across crypto, equities, FX, commodities & indices</p>
        </div>
        <div className="wm-live"><div className="wm-dot" />{status === 'ok' ? 'LIVE' : 'CONNECTING'}</div>
      </div>

      <div className="stat-grid">
        <div className="stat-cell"><div className="stat-lbl">Markets</div><div className="stat-val">{stats.count}</div></div>
        <div className="stat-cell"><div className="stat-lbl">Total OI (USDC)</div><div className="stat-val">{stats.oi}</div></div>
        <div className="stat-cell"><div className="stat-lbl">24h volume</div><div className="stat-val a">{stats.vol}</div></div>
        <div className="stat-cell"><div className="stat-lbl">Avg funding</div><div className={`stat-val ${stats.fundCls}`}>{stats.fund}</div></div>
      </div>

      <div className="filters">
        {[['all','All markets'],['crypto','Crypto'],['equities','Equities'],['fx','FX'],['commodities','Commodities'],['indices','Indices'],['bull','Long bias'],['bear','Short bias']].map(([k,l]) => (
          <button key={k} className={`filter-btn ${filter === k ? 'active' : ''}`} onClick={() => setFilter(k)}>{l}</button>
        ))}
      </div>

      <div className="table-wrap">
        <div className="table-head">
          <div className="th">Market</div>
          <div className="th r">Open int.</div>
          <div className="th r">Mark price</div>
          <div className="th r">24h vol</div>
          <div className="th r">Funding</div>
          <div className="th r">Bias</div>
        </div>
        <div>
          {status === 'loading' && (
            <div className="wm-loading"><div className="spinner" />Fetching from api.starknet.extended.exchange...</div>
          )}
          {status === 'error' && (
            <div className="wm-error">
              <div className="wm-error-title">API proxy not connected</div>
              <div className="wm-error-sub">
                Add <code>app/api/markets/route.js</code> to your Next.js project to bypass CORS.<br />
                Once deployed, this monitor shows live data from all Extended markets.
              </div>
            </div>
          )}
          {status === 'ok' && visible.length === 0 && (
            <div className="empty">No markets match current filter</div>
          )}
          {status === 'ok' && visible.map((m, i) => {
            const fundCls = m.funding > 0 ? '#1D9E75' : m.funding < 0 ? '#D85A30' : 'var(--muted)'
            const barColor = m.bias === 'bull' ? '#1D9E75' : m.bias === 'bear' ? '#D85A30' : 'var(--border)'
            const barPct = Math.round(m.oi / maxOI * 100)
            return (
              <div key={m.name} className="mkt-row" style={{ animationDelay: `${i * 20}ms` }}>
                <div className={`row-accent ${m.bias}`} />
                <div className="td col">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="mkt-name">{m.name}</span>
                    <span className={`cat-badge ${m.cat}`}>{CAT_LABEL[m.cat]}</span>
                  </div>
                  <div className="bar-track"><div className="bar-fill" style={{ width: `${barPct}%`, background: barColor }} /></div>
                </div>
                <div className="td r col" style={{ alignItems: 'flex-end' }}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{fmtUSD(m.oi)}</span>
                  <span style={{ fontSize: 10, color: 'var(--muted)' }}>{m.oiBase.toFixed(2)} {m.asset}</span>
                </div>
                <div className="td r col" style={{ alignItems: 'flex-end' }}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{fmtPrice(m.mark, m.cat)}</span>
                  <span style={{ fontSize: 10, color: m.change >= 0 ? '#1D9E75' : '#D85A30' }}>{m.change >= 0 ? '+' : ''}{m.change.toFixed(2)}%</span>
                </div>
                <div className="td r"><span style={{ fontSize: 13, fontWeight: 500 }}>{fmtUSD(m.vol)}</span></div>
                <div className="td r"><span style={{ fontSize: 13, fontWeight: 500, color: fundCls }}>{fmtFund(m.funding)}</span></div>
                <div className="td r"><span className={`bias-tag ${m.bias}`}>{m.bias === 'bull' ? 'LONG' : m.bias === 'bear' ? 'SHORT' : 'NEUTRAL'}</span></div>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, fontSize: 10, color: 'var(--muted)' }}>
        <span>{ts}</span>
        <button className="preset" style={{ padding: '5px 12px' }} onClick={load}>↻ Refresh</button>
      </div>
    </>
  )
}

// ─── ROOT ─────────────────────────────────────────────────────────────────

export default function Tools() {
  const [tab, setTab] = useState('risk')

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <div className="grid-bg" />
        <nav className="nav">
          <div className="nav-brand">Extended <span>Tools</span></div>
          <div className="nav-tabs">
            <button className={`nav-tab ${tab === 'risk' ? 'active' : ''}`} onClick={() => setTab('risk')}>Risk Calculator</button>
            <button className={`nav-tab ${tab === 'whale' ? 'active' : ''}`} onClick={() => setTab('whale')}>Whale Monitor</button>
            <button className={`nav-tab ${tab === 'correlation' ? 'active' : ''}`} onClick={() => setTab('correlation')}>Correlation Heatmap</button>
          </div>
          <div className="nav-badge">Starknet · USDC</div>
        </nav>
        <div className="page">
          {tab === 'risk' ? <RiskCalculator /> : tab === 'whale' ? <WhaleMonitor /> : <CorrelationHeatmap />}
          <div className="page-footer">
            Extended Protocol · Starknet zk-chain · USDC settled · Built by ex-Revolut team · For informational use only
          </div>
        </div>
      </div>
    </>
  )
}
