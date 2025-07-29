import clientPromise from "@/app/lib/db/mongoDB";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const products = await client.db("niterx").collection("phones").find({}).toArray();

    return NextResponse.json({
      error: false,
      message: "Data found",
      phones: products,
    });
  } catch (err) {
    console.error("Internal Server Error:", err.message);
    return NextResponse.json(
      {
        error: true,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
