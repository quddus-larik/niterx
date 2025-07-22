"use server";
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/app/lib/db/mongoDB";

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("niterx").collection("users");

    const allUsers = await db.find({}).toArray();

    if (!allUsers || allUsers.length === 0) {
      return NextResponse.json(
        { error: true, message: "No users found" },
        { status: 404 }
      );
    }

    // Flatten all orders from all users
    const allOrders = allUsers.flatMap(user => user.shopping?.orders || []);

    return NextResponse.json({
      error: false,
      message: "All orders fetched successfully",
      orders: allOrders,
    });
  } catch (err) {
    console.error("Error fetching orders:", err);
    return NextResponse.json(
      { error: true, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
