import { NextRequest, NextResponse } from "next/server";
import { getUserSession } from "@/app/lib/sessions/authSession";
import clientPromise from "@/app/lib/db/mongoDB";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, orders } = body;

    // Check if orders is valid array
    if (!Array.isArray(orders) || orders.length === 0) {
      return NextResponse.json(
        { error: true, message: "Orders must be a non-empty array" },
        { status: 400 }
      );
    }

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

    // Append user email to each order
    const user_orders = orders.map((order: any) => ({
      ...order,
      user_email: user.email,
    }));

    const client = await clientPromise;
    const usersCollection = client.db("niterx").collection("users");

    const updateResult = await usersCollection.updateOne(
      { email: user.email },
      {
        $push: {
          "shopping.orders": {
            $each: user_orders,
          },
        },
      },
      { upsert: true }
    );

    if (updateResult.matchedCount === 0 && !updateResult.upsertedId) {
      return NextResponse.json(
        { error: true, message: "User not found or update failed" },
        { status: 404 }
      );
    }

    console.info("✅ Order(s) appended successfully");

    return NextResponse.json({
      error: false,
      message: "Order(s) added to shopping.orders",
      userData: { email, orders: user_orders },
    });
  } catch (error) {
    console.error("❌ Error in POST /user/shopping:", error);
    return NextResponse.json(
      { error: true, message: "Internal server error" },
      { status: 500 }
    );
  }
}
