import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { proofData } = body

    // Validate required fields
    if (!proofData || !proofData.hash) {
      return NextResponse.json({ success: false, message: "Invalid proof data", verified: false }, { status: 400 })
    }

    // Simulate verification delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // For demo purposes, we'll verify if the proof has the required fields
    const isValid =
      proofData && typeof proofData === "object" && proofData.id && proofData.hash && proofData.hash.length === 64

    return NextResponse.json({
      success: true,
      verified: isValid,
      message: isValid
        ? "Proof successfully verified. The computation is valid."
        : "Proof verification failed. Invalid or incomplete proof data.",
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ success: false, message: "Internal server error", verified: false }, { status: 500 })
  }
}

