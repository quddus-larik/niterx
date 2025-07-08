'use client';

import { Button } from "@heroui/button";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error("Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in .env.local");
}

const stripePromise = loadStripe(publishableKey);

interface CheckoutButtonProps {
  amount: number;
  isDisabled?: boolean;
}

export default function CheckoutButton({ amount, isDisabled }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const stripe = await stripePromise;

      const res = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      const data = await res.json();

      if (data.error) {
        alert(`Error: ${data.error}`);
        return;
      }

      const result = await stripe?.redirectToCheckout({
        sessionId: data.id,
      });

      if (result?.error) {
        alert(result.error.message);
      }
    } catch (err: any) {
      console.error("Checkout error:", err.message);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onPress={handleCheckout}
      className="w-full px-6 py-2 text-white bg-black rounded-xl hover:bg-gray-800"
      type="submit"
      isDisabled={loading || isDisabled}
    >
      {loading ? "Redirecting..." : "Pay Now"}
    </Button>
  );
}
