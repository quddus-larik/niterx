import { NextRequest, NextResponse } from "next/server";
import { getUserSession } from "@/app/lib/sessions/authSession";
import clientPromise from "@/app/lib/db/mongoDB";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, orders } = body;

    const user = await getUserSession();
    if (!user || !user.email) {
      return NextResponse.json(
        { error: true, message: "No session found" },
        { status: 401 }
      );
    }

    if (email !== user.email) {
      return NextResponse.json(
        { error: true, message: "Unauthorized email" },
        { status: 403 }
      );
    }

    const client = await clientPromise;
    const db = client.db("niterx").collection("users");

    const updateResult = await db.updateOne(
      { email: user.email },
      {
        $push: {
          "shopping.orders": {
            $each: orders,
          },
        },
      },
      { upsert: true }
    );

    if (updateResult.matchedCount === 0 && !updateResult.upsertedId) {
      return NextResponse.json(
        { error: true, message: "User not found or not updated" },
        { status: 404 }
      );
    }

    console.info("Order appended successfully");

    return NextResponse.json({
      error: false,
      message: "Order added to shopping.orders",
      userData: { email, orders },
    });
  } catch (error) {
    console.error("Error in POST /user/shopping:", error);
    return NextResponse.json(
      { error: true, message: "Internal server error" },
      { status: 500 }
    );
  }
}
