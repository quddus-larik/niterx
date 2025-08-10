"use server";

import clientPromise from "@/app/lib/db/mongoDB";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    // Parse JSON body
    const body = await req.json();

    // Example: destructure fields from body
    const { name, price, category } = body;

    if (!name || !price || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // MongoDB connection
    const client = await clientPromise;
    const db = client.db("niterx");

    // Insert data into collection
    const result = await db.collection("phones").insertOne({
      doc_id: uuidv4().slice(0, 6),
      qty,
      mobile_name,
      price,
      category,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "Product added successfully", insertedId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
