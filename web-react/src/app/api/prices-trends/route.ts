import { NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3001";

export async function GET() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/public/prices/trends`, {
            headers: {
                "Content-Type": "application/json",
            },
            // Cache for 1 hour
            next: { revalidate: 3600 },
        });

        if (!response.ok) {
            throw new Error(`API responded with status ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching price trends:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch price trends" },
            { status: 500 }
        );
    }
}
