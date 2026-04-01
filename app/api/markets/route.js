const BASE = 'https://api.starknet.extended.exchange/api/v1'
export async function GET() {
  try {
    const res = await fetch(`${BASE}/info/markets`, {
      headers: { 'User-Agent': 'ExtendedWhaleMonitor/1.0' },
      next: { revalidate: 15 },
    })
    if (!res.ok) throw new Error(`Extended API error: ${res.status}`)
    const data = await res.json()
    return Response.json(data, {
      headers: { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 's-maxage=15, stale-while-revalidate=30' },
    })
  } catch (err) {
    return Response.json({ status: 'ERROR', error: { message: err.message } }, { status: 500 })
  }
}
