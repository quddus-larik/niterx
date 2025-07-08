import { NextRequest, NextResponse } from "next/server";
import { getUserSession } from "@/app/lib/sessions/authSession";
import clientPromise from "@/app/lib/db/mongoDB";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // read JSON body
    const { email, cell, address, zip, city } = body;

    // Get current session user
    const user = await getUserSession();
    if (!user || !user.email) {
      return NextResponse.json(
        { error: true, message: "No session found" },
        { status: 401 }
      );
    }

    // Ensure email from session matches provided email
    if (email !== user.email) {
      return NextResponse.json(
        { error: true, message: "Unauthorized email" },
        { status: 403 }
      );
    }

    // Connect to DB
    const client = await clientPromise;
    const db = client.db("niterx").collection("users");

    // Update user record with new info
    const updateResult = await db.updateOne(
      { email: user.email },
      {
        $set: {
          cell,
          address,
          zip,
          city,
        },
      }
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { error: true, message: "User not found" },
        { status: 404 }
      );
    }
    console.info('success API working');

    return NextResponse.json({
      error: false,
      message: "Profile details updated successfully",
      userData: { email, cell, address, zip, city },
    });
  } catch (error) {
    console.error("Error in POST /user:", error);
    return NextResponse.json(
      { error: true, message: "Internal server error" },
      { status: 500 }
    );
  }
}
