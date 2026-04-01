'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Bebas+Neue&display=swap');

  .ch-root {
    font-family: 'IBM Plex Mono', monospace;
    background: transparent;
    color: var(--text);
    --g: #1D9E75;
    --g2: #0F6E56;
    --g3: #9FE1CB;
    --r: #D85A30;
    --r2: #993C1D;
    --y: #BA7517;
    --bg: #0a0a0a;
    --surface: #111;
    --surface2: #1a1a1a;
    --border: #2a2a2a;
    --text: #f0f0f0;
    --muted: #666;
  }

  .ch-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
    padding-bottom: 14px;
    border-bottom: 0.5px solid var(--border);
  }

  .ch-eyebrow {
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--g);
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .ch-eyebrow::before { content: ''; width: 16px; height: 1px; background: var(--g); }

  .ch-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(26px, 4vw, 38px);
    letter-spacing: 0.02em;
    line-height: 1;
    color: var(--text);
  }
  .ch-title span { color: var(--g); }
  .ch-sub { margin-top: 6px; color: var(--muted); font-size: 11px; letter-spacing: 0.05em; }

  .ch-live {
    display: flex; align-items: center; gap: 6px;
    font-size: 10px; letter-spacing: 0.15em;
    color: var(--g); padding: 4px 10px;
    border: 0.5px solid var(--g); border-radius: 2px;
    white-space: nowrap;
  }
  .ch-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--g); animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

  .ch-controls {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
    flex-wrap: wrap;
    align-items: center;
  }

  .ch-ctrl-label {
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
    margin-right: 2px;
  }

  .ch-btn {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.08em;
    padding: 5px 12px;
    border: 0.5px solid var(--border);
    border-radius: 3px;
    background: transparent;
    color: var(--muted);
    cursor: pointer;
    transition: all 0.15s;
  }
  .ch-btn:hover { border-color: var(--g); color: var(--g); }
  .ch-btn.active { background: rgba(15,110,86,0.15); border-color: var(--g); color: var(--g3); }

  .ch-separator { width: 1px; height: 20px; background: var(--border); margin: 0 4px; }

  .ch-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin-bottom: 16px;
  }
  .ch-stat {
    background: var(--surface2);
    border-radius: 4px;
    padding: 12px;
    border: 0.5px solid var(--border);
  }
  .ch-stat-label { font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); margin-bottom: 4px; }
  .ch-stat-val { font-size: 16px; font-weight: 500; color: var(--text); }
  .ch-stat-val.g { color: var(--g); }
  .ch-stat-val.r { color: var(--r); }
  .ch-stat-val.y { color: var(--y); }

  .ch-matrix-wrap {
    background: var(--surface);
    border: 0.5px solid var(--border);
    border-radius: 6px;
    padding: 16px;
    overflow: auto;
    position: relative;
  }

  .ch-matrix {
    display: inline-block;
    min-width: 100%;
  }

  .ch-row { display: flex; align-items: center; }

  .ch-row-label {
    font-size: 10px;
    font-weight: 500;
    color: var(--text);
    width: 72px;
    min-width: 72px;
    padding-right: 8px;
    text-align: right;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    letter-spacing: 0.03em;
  }

  .ch-col-labels {
    display: flex;
    margin-left: 72px;
    margin-bottom: 4px;
  }

  .ch-col-label {
    font-size: 9px;
    font-weight: 500;
    color: var(--muted);
    writing-mode: vertical-rl;
    text-orientation: mixed;
    transform: rotate(180deg);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    letter-spacing: 0.03em;
    padding-bottom: 4px;
  }

  .ch-cell {
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: transform 0.1s, box-shadow 0.1s;
    position: relative;
    flex-shrink: 0;
  }
  .ch-cell:hover { transform: scale(1.15); z-index: 10; box-shadow: 0 0 0 1.5px var(--text); }
  .ch-cell.diagonal { opacity: 0.4; }

  .ch-tooltip {
    position: fixed;
    background: var(--surface2);
    border: 0.5px solid var(--border);
    border-radius: 4px;
    padding: 10px 14px;
    font-size: 11px;
    pointer-events: none;
    z-index: 100;
    white-space: nowrap;
    transform: translate(-50%, -110%);
    box-shadow: 0 4px 16px rgba(0,0,0,0.4);
  }
  .ch-tooltip-title { font-size: 10px; letter-spacing: 0.15em; color: var(--muted); margin-bottom: 4px; }
  .ch-tooltip-val { font-size: 16px; font-weight: 500; }
  .ch-tooltip-val.strong-pos { color: var(--g); }
  .ch-tooltip-val.pos { color: #5DCAA5; }
  .ch-tooltip-val.neutral { color: var(--muted); }
  .ch-tooltip-val.neg { color: #F0997B; }
  .ch-tooltip-val.strong-neg { color: var(--r); }
  .ch-tooltip-desc { font-size: 10px; color: var(--muted); margin-top: 3px; }

  .ch-legend {
    display: flex;
    align-items: center;
    gap: 0;
    margin-top: 16px;
    justify-content: center;
  }
  .ch-legend-label { font-size: 9px; color: var(--muted); letter-spacing: 0.1em; }
  .ch-legend-bar {
    width: 200px;
    height: 8px;
    border-radius: 2px;
    margin: 0 10px;
    background: linear-gradient(to right, #993C1D, #D85A30, #2a2a2a, #1D9E75, #0F6E56);
  }

  .ch-pairs {
    margin-top: 16px;
    background: var(--surface);
    border: 0.5px solid var(--border);
    border-radius: 6px;
    overflow: hidden;
  }
  .ch-pairs-header {
    display: grid;
    grid-template-columns: 1fr 1fr 80px 120px;
    padding: 8px 16px;
    background: var(--surface2);
    border-bottom: 0.5px solid var(--border);
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .ch-pair-row {
    display: grid;
    grid-template-columns: 1fr 1fr 80px 120px;
    padding: 10px 16px;
    border-bottom: 0.5px solid var(--border);
    font-size: 12px;
    align-items: center;
    transition: background 0.1s;
  }
  .ch-pair-row:last-child { border-bottom: none; }
  .ch-pair-row:hover { background: var(--surface2); }
  .ch-pair-name { font-weight: 500; color: var(--text); }
  .ch-pair-corr { font-weight: 500; }
  .ch-pair-corr.strong-pos { color: var(--g); }
  .ch-pair-corr.pos { color: #5DCAA5; }
  .ch-pair-corr.neutral { color: var(--muted); }
  .ch-pair-corr.neg { color: #F0997B; }
  .ch-pair-corr.strong-neg { color: var(--r); }
  .ch-pair-bar-wrap { height: 4px; background: var(--border); border-radius: 2px; overflow: hidden; }
  .ch-pair-bar-fill { height: 100%; border-radius: 2px; }

  .ch-loading {
    display: flex; align-items: center; gap: 10px;
    padding: 60px; justify-content: center;
    color: var(--muted); font-size: 12px;
    flex-direction: column;
  }
  .ch-spinner {
    width: 20px; height: 20px;
    border: 1.5px solid var(--border);
    border-top-color: var(--g);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .ch-empty {
    padding: 60px; text-align: center;
    color: var(--muted); font-size: 12px; letter-spacing: 0.1em;
  }

  .ch-footer {
    display: flex; justify-content: space-between;
    align-items: center; margin-top: 12px;
    font-size: 10px; color: var(--muted);
  }
  .ch-refresh {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px; padding: 5px 12px;
    border: 0.5px solid var(--border); border-radius: 3px;
    background: transparent; color: var(--muted); cursor: pointer;
    transition: all 0.15s;
  }
  .ch-refresh:hover { border-color: var(--g); color: var(--g); }

  .ch-pairs-tabs {
    display: flex; gap: 4px; margin-top: 16px; margin-bottom: 8px;
  }
`

const CANDLE_INTERVALS = [
  { label: '1H', value: '1h', limit: 168, points: 168 },
  { label: '4H', value: '4h', limit: 168, points: 168 },
  { label: '1D', value: '1d', limit: 90, points: 90 },
]

const CATEGORIES = ['All', 'Crypto', 'Equities', 'FX', 'Commodities', 'Indices']

const CRYPTO = new Set(['BTC','ETH','SOL','AVAX','ARB','OP','DOGE','LINK','AAVE','UNI','MATIC','INJ','SUI','APT','SEI','TIA','ATOM','DOT','ADA','XRP','LTC','BCH','ETC','FIL','NEAR','XVS'])
const FX = new Set(['EUR','GBP','JPY','AUD','CAD','CHF','NZD','SGD','HKD','NOK','SEK'])
const COMMODITIES = new Set(['XAU','XAG','OIL','WTI','BRENT','GAS','WHEAT','CORN','COPPER','PLATINUM'])
const INDICES = new Set(['SPX','NDX','DJI','RUT','FTSE','DAX','CAC','NIKKEI','HANGSENG','ASX'])

function getCategory(name) {
  const asset = name.split('-')[0].toUpperCase()
  if (INDICES.has(asset) || [...INDICES].some(i => asset.includes(i))) return 'Indices'
  if (COMMODITIES.has(asset)) return 'Commodities'
  if (FX.has(asset)) return 'FX'
  if (CRYPTO.has(asset)) return 'Crypto'
  return 'Equities'
}

function pearsonCorrelation(a, b) {
  const n = Math.min(a.length, b.length)
  if (n < 10) return null
  const ax = a.slice(0, n), bx = b.slice(0, n)
  const meanA = ax.reduce((s, v) => s + v, 0) / n
  const meanB = bx.reduce((s, v) => s + v, 0) / n
  let num = 0, da = 0, db = 0
  for (let i = 0; i < n; i++) {
    const dA = ax[i] - meanA, dB = bx[i] - meanB
    num += dA * dB; da += dA * dA; db += dB * dB
  }
  const denom = Math.sqrt(da * db)
  if (denom === 0) return null
  return Math.max(-1, Math.min(1, num / denom))
}

function getReturns(closes) {
  const returns = []
  for (let i = 1; i < closes.length; i++) {
    if (closes[i - 1] !== 0) returns.push((closes[i] - closes[i - 1]) / closes[i - 1])
  }
  return returns
}

function corrClass(r) {
  if (r === null) return 'neutral'
  if (r >= 0.7) return 'strong-pos'
  if (r >= 0.3) return 'pos'
  if (r <= -0.7) return 'strong-neg'
  if (r <= -0.3) return 'neg'
  return 'neutral'
}

function corrLabel(r) {
  if (r === null) return 'Insufficient data'
  if (r >= 0.7) return 'Strong positive'
  if (r >= 0.3) return 'Moderate positive'
  if (r <= -0.7) return 'Strong negative'
  if (r <= -0.3) return 'Moderate negative'
  return 'Uncorrelated'
}

function corrColor(r) {
  if (r === null) return '#2a2a2a'
  const intensity = Math.abs(r)
  if (r > 0) {
    const g = Math.round(intensity * 158 + (1 - intensity) * 42)
    const opacity = 0.15 + intensity * 0.7
    return `rgba(29, ${g}, 117, ${opacity})`
  } else {
    const opacity = 0.15 + intensity * 0.7
    return `rgba(216, 90, 48, ${opacity})`
  }
}

function corrTextColor(r) {
  if (r === null) return '#444'
  const intensity = Math.abs(r)
  if (intensity < 0.2) return 'transparent'
  return r > 0 ? '#9FE1CB' : '#F0997B'
}

const BASE = 'https://api.starknet.extended.exchange/api/v1'
const HEADERS = { 'User-Agent': 'ExtendedCorrelationHeatmap/1.0' }

export default function CorrelationHeatmap() {
  const [markets, setMarkets] = useState([])
  const [returns, setReturns] = useState({})
  const [matrix, setMatrix] = useState([])
  const [status, setStatus] = useState('idle')
  const [interval, setIntervalVal] = useState(CANDLE_INTERVALS[0])
  const [category, setCategory] = useState('All')
  const [pairsTab, setPairsTab] = useState('positive')
  const [tooltip, setTooltip] = useState(null)
  const [ts, setTs] = useState('')
  const [progress, setProgress] = useState(0)
  const tooltipRef = useRef(null)

  const fetchCandles = useCallback(async (market, intv, limit) => {
    try {
      const endTime = Date.now()
      const startTime = endTime - (limit * (intv === '1h' ? 3600000 : intv === '4h' ? 14400000 : 86400000))
      const url = `/api/candles/${market}?interval=${intv}&limit=${limit}&endTime=${endTime}`
      const res = await fetch(url)
      if (!res.ok) return null
      const json = await res.json()
      if (json.status !== 'OK' && json.status !== 'ok') return null
      return (json.data || []).map(c => parseFloat(c.c)).filter(v => isFinite(v) && v > 0)
    } catch { return null }
  }, [])

  const load = useCallback(async () => {
    setStatus('loading')
    setProgress(0)
    setMatrix([])

    try {
      // 1. Fetch active markets
      const mRes = await fetch('/api/markets')
      const mJson = await mRes.json()
      const activeMarkets = (mJson.data || [])
        .filter(m => m.status === 'ACTIVE' && parseFloat(m.marketStats?.openInterest || 0) > 100000)
        .map(m => ({ name: m.name, asset: m.assetName, cat: getCategory(m.name) }))
        .slice(0, 30) // cap at 30 for performance

      setMarkets(activeMarkets)
      setProgress(10)

      // 2. Fetch candles for each market
      const returnsMap = {}
      const total = activeMarkets.length
      for (let i = 0; i < total; i++) {
        const m = activeMarkets[i]
        const closes = await fetchCandles(m.name, interval.value, interval.limit)
        if (closes && closes.length >= 10) {
          returnsMap[m.name] = getReturns(closes)
        }
        setProgress(10 + Math.round((i / total) * 70))
        // small delay to avoid rate limiting
        if (i % 5 === 4) await new Promise(r => setTimeout(r, 200))
      }

      setReturns(returnsMap)
      setProgress(80)

      // 3. Build correlation matrix
      const names = activeMarkets.map(m => m.name).filter(n => returnsMap[n])
      const mat = names.map(a =>
        names.map(b => {
          if (a === b) return 1
          const r = returnsMap[a], s = returnsMap[b]
          if (!r || !s) return null
          return pearsonCorrelation(r, s)
        })
      )
      setMatrix(mat)
      setProgress(100)
      setStatus('ok')
      setTs(`${names.length} markets · ${interval.label} candles · Updated ${new Date().toLocaleTimeString()}`)
    } catch (err) {
      setStatus('error')
      setTs('Failed to load — check API proxy')
    }
  }, [interval, fetchCandles])

  useEffect(() => { load() }, [load])

  const filteredMarkets = markets.filter(m =>
    category === 'All' || m.cat === category
  )
  const filteredNames = filteredMarkets.map(m => m.name).filter(n => returns[n])
  const filteredIndices = filteredNames.map(n => markets.findIndex(m => m.name === n))

  const filteredMatrix = filteredIndices.map(i =>
    filteredIndices.map(j => matrix[i]?.[j] ?? null)
  )

  // Stats
  const allCorrs = []
  for (let i = 0; i < filteredMatrix.length; i++)
    for (let j = i + 1; j < filteredMatrix[i].length; j++)
      if (filteredMatrix[i][j] !== null) allCorrs.push(filteredMatrix[i][j])

  const avgCorr = allCorrs.length ? allCorrs.reduce((s, v) => s + v, 0) / allCorrs.length : 0
  const strongPos = allCorrs.filter(r => r >= 0.7).length
  const strongNeg = allCorrs.filter(r => r <= -0.7).length
  const uncorr = allCorrs.filter(r => Math.abs(r) < 0.3).length

  // Top pairs
  const pairs = []
  for (let i = 0; i < filteredMatrix.length; i++)
    for (let j = i + 1; j < filteredMatrix[i].length; j++) {
      const r = filteredMatrix[i][j]
      if (r !== null) pairs.push({ a: filteredNames[i], b: filteredNames[j], r })
    }
  const topPos = [...pairs].sort((a, b) => b.r - a.r).slice(0, 8)
  const topNeg = [...pairs].sort((a, b) => a.r - b.r).slice(0, 8)

  const cellSize = Math.max(18, Math.min(32, Math.floor(560 / Math.max(filteredNames.length, 1))))
  const labelWidth = 72

  const handleMouseMove = (e, i, j) => {
    if (filteredNames[i] === filteredNames[j]) { setTooltip(null); return }
    const r = filteredMatrix[i][j]
    setTooltip({
      x: e.clientX, y: e.clientY,
      a: filteredNames[i], b: filteredNames[j],
      r, cls: corrClass(r), label: corrLabel(r)
    })
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="ch-root">
        <div className="ch-header">
          <div>
            <div className="ch-eyebrow">Extended Protocol · Starknet</div>
            <h1 className="ch-title">Market Correlation <span>Heatmap</span></h1>
            <p className="ch-sub">// How every Extended market moves relative to every other — crypto, equities, FX, commodities & indices</p>
          </div>
          <div className="ch-live"><div className="ch-dot" />LIVE</div>
        </div>

        {/* Controls */}
        <div className="ch-controls">
          <span className="ch-ctrl-label">Timeframe</span>
          {CANDLE_INTERVALS.map(iv => (
            <button key={iv.value} className={`ch-btn ${interval.value === iv.value ? 'active' : ''}`}
              onClick={() => setIntervalVal(iv)}>{iv.label}</button>
          ))}
          <div className="ch-separator" />
          <span className="ch-ctrl-label">Category</span>
          {CATEGORIES.map(c => (
            <button key={c} className={`ch-btn ${category === c ? 'active' : ''}`}
              onClick={() => setCategory(c)}>{c}</button>
          ))}
        </div>

        {/* Stats */}
        <div className="ch-stats">
          <div className="ch-stat">
            <div className="ch-stat-label">Markets</div>
            <div className="ch-stat-val">{filteredNames.length}</div>
          </div>
          <div className="ch-stat">
            <div className="ch-stat-label">Avg correlation</div>
            <div className={`ch-stat-val ${avgCorr > 0.3 ? 'g' : avgCorr < -0.3 ? 'r' : 'y'}`}>
              {allCorrs.length ? (avgCorr >= 0 ? '+' : '') + avgCorr.toFixed(2) : '—'}
            </div>
          </div>
          <div className="ch-stat">
            <div className="ch-stat-label">Strong positive pairs</div>
            <div className="ch-stat-val g">{strongPos}</div>
          </div>
          <div className="ch-stat">
            <div className="ch-stat-label">Strong negative pairs</div>
            <div className="ch-stat-val r">{strongNeg}</div>
          </div>
        </div>

        {/* Matrix */}
        <div className="ch-matrix-wrap">
          {status === 'loading' && (
            <div className="ch-loading">
              <div className="ch-spinner" />
              <div>Fetching {interval.label} candles for {markets.length} markets... {progress}%</div>
              <div style={{ width: 200, height: 3, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: 'var(--g)', transition: 'width 0.3s', borderRadius: 2 }} />
              </div>
            </div>
          )}
          {status === 'error' && (
            <div className="ch-empty">
              API unavailable — add proxy route at <code style={{ background: 'var(--surface2)', padding: '2px 6px', borderRadius: 3 }}>app/api/markets/route.js</code>
            </div>
          )}
          {status === 'ok' && filteredNames.length === 0 && (
            <div className="ch-empty">No markets in this category have sufficient data</div>
          )}
          {status === 'ok' && filteredNames.length > 0 && (
            <div className="ch-matrix">
              {/* Column labels */}
              <div className="ch-col-labels" style={{ marginLeft: labelWidth }}>
                {filteredNames.map((name, j) => (
                  <div key={j} className="ch-col-label" style={{ width: cellSize, minWidth: cellSize, height: 64, fontSize: 9 }}>
                    {name.replace('-USD', '').replace('-PERP', '')}
                  </div>
                ))}
              </div>
              {/* Rows */}
              {filteredNames.map((rowName, i) => (
                <div key={i} className="ch-row" style={{ marginBottom: 2 }}>
                  <div className="ch-row-label" style={{ width: labelWidth, minWidth: labelWidth, fontSize: 10 }}>
                    {rowName.replace('-USD', '').replace('-PERP', '')}
                  </div>
                  {filteredNames.map((colName, j) => {
                    const r = filteredMatrix[i]?.[j] ?? null
                    const isDiag = i === j
                    const bg = isDiag ? '#1D9E7522' : corrColor(r)
                    const textColor = isDiag ? 'var(--g)' : corrTextColor(r)
                    const displayVal = isDiag ? '1' : r !== null ? r.toFixed(2).replace('0.', '.') : ''
                    return (
                      <div
                        key={j}
                        className={`ch-cell ${isDiag ? 'diagonal' : ''}`}
                        style={{
                          width: cellSize, height: cellSize,
                          background: bg, color: textColor,
                          fontSize: Math.max(7, cellSize * 0.28),
                          marginRight: 2,
                        }}
                        onMouseMove={e => handleMouseMove(e, i, j)}
                        onMouseLeave={() => setTooltip(null)}
                      >
                        {displayVal}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Legend */}
        {status === 'ok' && filteredNames.length > 0 && (
          <div className="ch-legend">
            <span className="ch-legend-label" style={{ color: 'var(--r)' }}>-1.0 Strong negative</span>
            <div className="ch-legend-bar" />
            <span className="ch-legend-label" style={{ color: 'var(--g)' }}>+1.0 Strong positive</span>
          </div>
        )}

        {/* Top pairs */}
        {status === 'ok' && pairs.length > 0 && (
          <>
            <div className="ch-pairs-tabs">
              <span className="ch-ctrl-label" style={{ marginRight: 8, lineHeight: '28px' }}>Top pairs</span>
              <button className={`ch-btn ${pairsTab === 'positive' ? 'active' : ''}`} onClick={() => setPairsTab('positive')}>Most correlated</button>
              <button className={`ch-btn ${pairsTab === 'negative' ? 'active' : ''}`} onClick={() => setPairsTab('negative')}>Most inverse</button>
              <button className={`ch-btn ${pairsTab === 'uncorrelated' ? 'active' : ''}`} onClick={() => setPairsTab('uncorrelated')}>Most independent</button>
            </div>
            <div className="ch-pairs">
              <div className="ch-pairs-header">
                <div>Market A</div>
                <div>Market B</div>
                <div>Correlation</div>
                <div>Strength</div>
              </div>
              {(pairsTab === 'positive' ? topPos :
                pairsTab === 'negative' ? topNeg :
                [...pairs].sort((a, b) => Math.abs(a.r) - Math.abs(b.r)).slice(0, 8)
              ).map((pair, i) => {
                const cls = corrClass(pair.r)
                const barPct = Math.round(Math.abs(pair.r) * 100)
                const barColor = pair.r >= 0 ? 'var(--g)' : 'var(--r)'
                return (
                  <div key={i} className="ch-pair-row">
                    <div className="ch-pair-name">{pair.a.replace('-USD', '')}</div>
                    <div className="ch-pair-name">{pair.b.replace('-USD', '')}</div>
                    <div className={`ch-pair-corr ${cls}`}>{pair.r >= 0 ? '+' : ''}{pair.r.toFixed(3)}</div>
                    <div>
                      <div style={{ fontSize: 9, color: 'var(--muted)', marginBottom: 3 }}>{corrLabel(pair.r)}</div>
                      <div className="ch-pair-bar-wrap">
                        <div className="ch-pair-bar-fill" style={{ width: `${barPct}%`, background: barColor }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        <div className="ch-footer">
          <span style={{ color: 'var(--muted)' }}>{ts || 'Loading...'} · Pearson correlation of log returns</span>
          <button className="ch-refresh" onClick={load}>↻ Refresh</button>
        </div>

        {/* Tooltip */}
        {tooltip && (
          <div className="ch-tooltip" style={{ left: tooltip.x, top: tooltip.y }} ref={tooltipRef}>
            <div className="ch-tooltip-title">{tooltip.a.replace('-USD', '')} × {tooltip.b.replace('-USD', '')}</div>
            <div className={`ch-tooltip-val ${tooltip.cls}`}>
              {tooltip.r !== null ? (tooltip.r >= 0 ? '+' : '') + tooltip.r.toFixed(3) : '—'}
            </div>
            <div className="ch-tooltip-desc">{tooltip.label}</div>
          </div>
        )}
      </div>
    </>
  )
}
