import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/db/mongoDB";
import axios from "axios";

export async function GET() {
  try {
    const client = await clientPromise;

    const customers = await client.db("niterx").collection("users").find({},{email: 1, orders: 1, })
  } catch (err) {
    return NextResponse.json({
      error: true,
      message: "Error Found: " + err.message,
    });
  }
}
