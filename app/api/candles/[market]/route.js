const BASE = 'https://api.starknet.extended.exchange/api/v1'

export async function GET(request, { params }) {
  try {
    const { searchParams } = new URL(request.url)
    const interval = searchParams.get('interval') || '1h'
    const limit = searchParams.get('limit') || '168'
    const endTime = searchParams.get('endTime') || Date.now()

    const res = await fetch(
      `${BASE}/info/candles/${params.market}/trades?interval=${interval}&limit=${limit}&endTime=${endTime}`,
      {
        headers: { 'User-Agent': 'ExtendedCorrelationHeatmap/1.0' },
        next: { revalidate: 60 },
      }
    )

    if (!res.ok) throw new Error(`Extended API error: ${res.status}`)
    const data = await res.json()

    return Response.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 's-maxage=60, stale-while-revalidate=120',
      },
    })
  } catch (err) {
    return Response.json(
      { status: 'ERROR', error: { message: err.message } },
      { status: 500 }
    )
  }
}
