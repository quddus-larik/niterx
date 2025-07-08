import { NextResponse } from "next/server";
import { getUserSession } from "@/app/lib/sessions/authSession";
import clientPromise from "@/app/lib/db/mongoDB";

export async function GET() {
  try {
    const user = await getUserSession();
    const client = await clientPromise;
    const db = await client.db("niterx").collection("users");

    if (!user || !user.email) {
      return NextResponse.json({
        error: true,
        user: null,
        message: "No session or email found.",
      });
    }

    const existUser = await db.findOne({ email: user.email });

    if (existUser) {
      return NextResponse.json({
        error: false,
        message: "user alrady exist",
        user: {
          name: user.name,
          email: user.email,
          image: user.image,
          database: existUser
        },
      });
    } else {
      const username = user.name?.toLowerCase().replace(/\s+/g, '_');
      db.insertOne({ username , email: user.email });
    }

    return NextResponse.json({
      error: false,
      user: {
        name: user.name,
        email: user.email,
        image: user.image,
      },
    });
  } catch (err) {
    console.error("Error fetching session:", err);
    return NextResponse.json({
      error: true,
      user: null,
      message: `Server error: ${err}`,
    });
  }
}
