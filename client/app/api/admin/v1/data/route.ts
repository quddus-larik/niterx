import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/db/mongoDB";
import axios from "axios";

export async function GET() {
  try {
    const client = await clientPromise;

    const totalRevenueResult = await client
      .db("niterx")
      .collection("users")
      .aggregate([
        { $unwind: "$shopping.orders" },
        {
          $project: {
            orderTotal: {
              $multiply: [
                "$shopping.orders.product.price",
                "$shopping.orders.product.qty",
              ],
            },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$orderTotal" },
          },
        },
        {
          $project: {
            totalRevenue: { $round: ["$totalRevenue", 2] },
          },
        },
      ])
      .toArray();

      
      const revenue = totalRevenueResult[0]?.totalRevenue || 0;
      
      const baseUrl = process.env.BASE_URL as string;
      
      const ordersRes = await axios.get(`${baseUrl}/api/user/orders/admin`);
      const productsRes = await axios.get(`${baseUrl}/api/v1/products/phones`);
      const growthRes = await axios.get(`${baseUrl}/api/admin/v1/data/growth`);
      const customersRes = (await client.db('niterx').collection('users').find().toArray()).length

    const { monthlyGrowth, orderGrowth, productGrowth } = growthRes.data || {};

    return NextResponse.json({
      totalRevenue: revenue,
      totalCustomers: customersRes,
      totalOrders: ordersRes.data.orders.length,
      totalProducts: productsRes.data.phones.length,
      monthlyGrowth: monthlyGrowth ?? 0,
      orderGrowth: orderGrowth ?? 0,
      productGrowth: productGrowth ?? 0,
    });
  } catch (err: any) {
    console.error("Error occurs", err.message);
    return NextResponse.json(
      { error: "Internal Server Error", res: err.message },
      { status: 500 }
    );
  }
}
