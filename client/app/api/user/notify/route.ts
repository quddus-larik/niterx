import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { Vonage } from "@vonage/server-sdk";

// Use ENV instead of hardcoded values!
const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY!,
  apiSecret: process.env.VONAGE_API_SECRET!,
});

export async function GET(req: NextRequest) {
  const phone = req.nextUrl.searchParams.get("phone"); // Get phone from query

  if (!phone) {
    return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
  }

  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    const from = "Vonage";
    const to = phone;
    const text = `Your OTP code is: ${otp}`;

    await vonage.sms.send({ to, from, text });

    return NextResponse.json({ success: true, otp });
  } catch (error: any) {
    console.error("Error sending SMS:", error);
    return NextResponse.json({ error: "Failed to send SMS" }, { status: 500 });
  }
}
