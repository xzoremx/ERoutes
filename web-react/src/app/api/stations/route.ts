import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3001";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const origin = searchParams.get("origin");
    const radiusKm = searchParams.get("radiusKm");

    const params = new URLSearchParams();
    if (origin) params.set("origin", origin);
    if (radiusKm) params.set("radiusKm", radiusKm);

    const url = `${API_BASE_URL}/api/stations?${params.toString()}`;
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching stations:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stations", data: [] },
      { status: 500 }
    );
  }
}
