"use server"
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/app/lib/db/mongoDB";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: true, message: "Email is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("niterx").collection("users");

    const userDoc = await db.findOne({ email });

    if (!userDoc) {
      return NextResponse.json(
        { error: true, message: "User not found" },
        { status: 404 }
      );
    }

    const orders = userDoc.shopping?.orders || [];

    return NextResponse.json({
      error: false,
      message: "Orders fetched",
      orders,
    });
  } catch (err) {
    console.error("Error fetching orders:", err);
    return NextResponse.json(
      { error: true, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
