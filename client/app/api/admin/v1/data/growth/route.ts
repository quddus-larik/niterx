import { NextResponse } from "next/server";

export async function GET() {
  try {
    const BASE_URL = process.env.BASE_URL as string;
    const res = await fetch(`${BASE_URL}/api/user/orders/admin`, {
        cache: 'no-store'
    });
    const result = await res.json();

    if (!result.orders?.length) {
      return NextResponse.json({
        error: false,
        message: "No orders found",
        monthlyGrowth: 0,
        orderGrowth: 0,
        productGrowth: 0,
      });
    }

    const orders = result.orders;

    const monthlyStats = new Map<string, { revenue: number; orders: number; products: Set<number> }>();

    for (const order of orders) {
      const date = new Date(order.buy_at);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyStats.has(month)) {
        monthlyStats.set(month, { revenue: 0, orders: 0, products: new Set() });
      }

      const stats = monthlyStats.get(month)!;
      stats.revenue += order.product.price * order.quantity;
      stats.orders += 1;
      stats.products.add(order.product.doc_id);
    }

    const sorted = [...monthlyStats.entries()].sort(([a], [b]) => a.localeCompare(b));

    const revenueArr = sorted.map(([, { revenue }]) => revenue);
    const orderArr = sorted.map(([, { orders }]) => orders);
    const productArr = sorted.map(([, { products }]) => products.size);

    const calcGrowth = (arr: number[]) => {
      if (arr.length < 2) return 0;
      const [prev, curr] = arr.slice(-2);
      return prev === 0 ? 100 : Math.round(((curr - prev) / prev) * 100);
    };

    return NextResponse.json({
      monthlyGrowth: calcGrowth(revenueArr),
      orderGrowth: calcGrowth(orderArr),
      productGrowth: calcGrowth(productArr),
    });

  } catch (err) {
    console.error("Growth API error:", err);
    return NextResponse.json({
      error: true,
      message: "Internal Server Error: "+ err.message,
    }, { status: 500 });
  }
}
