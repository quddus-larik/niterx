"use client"


import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Spinner,
  Button,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";

const mockOrders = [
  {
    id: "ORD-12432",
    product: "Samsung Galaxy S22 Ultra",
    status: "Shipped",
    amount: "Rs. 234,999",
    date: "2025-07-10",
    image: "/s22.jpg",
  },
  {
    id: "ORD-45281",
    product: "iPhone 14 Pro Max",
    status: "Delivered",
    amount: "Rs. 379,999",
    date: "2025-06-29",
    image: "/iphone.jpg",
  },
  {
    id: "ORD-76391",
    product: "Infinix Zero X Neo",
    status: "Processing",
    amount: "Rs. 47,999",
    date: "2025-07-12",
    image: "/infinix.jpg",
  },
];

export default function OrdersPage() {
  const [UserData, setUserData] = useState(null);

  useEffect(() => {
    axios.get("/api/user").then((res) => {
      setUserData(res.data.user);
      console.warn("Fetched Data:", res.data); // This logs the actual data
    });
  }, []);

  return (
    <div className="min-h-screen p-4 bg-background text-foreground">
      <div className="max-w-5xl mx-auto space-y-6">
        <Card className="shadow-lg rounded-xl">
          <CardHeader className="flex items-center justify-between p-6">
            <Button
              variant="flat"
              color="primary"
              startContent={<FaArrowLeft />}
              onPress={() => window.history.back()}
              className="font-semibold"
            >
              Back to Profile
            </Button>
            <h2 className="text-2xl font-bold text-gray-900">Your Orders</h2>
          </CardHeader>
          <Divider className="bg-gray-200" />
          <CardBody className="p-6 space-y-6">
            {mockOrders.length === 0 ? (
              <div className="flex justify-center py-10">
                <Spinner size="lg" color="primary" />
              </div>
            ) : (
              mockOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col items-start gap-4 p-4 rounded-lg bg-gray-50 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={order.image}
                      alt={order.product}
                      className="object-cover w-20 h-20 rounded-md ring-2 ring-primary"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {order.product}
                      </h3>
                      <p className="text-sm text-gray-600">#{order.id}</p>
                      <p className="text-sm text-gray-500">{order.date}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-right md:text-left">
                    <p className="text-sm font-semibold text-gray-700">
                      Status:{" "}
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "Shipped"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </p>
                    <p className="text-xl font-bold text-primary-700">
                      {order.amount}
                    </p>
                  </div>
                  <Button
                    variant="flat"
                    color="primary"
                    startContent={<Icon icon="lucide:eye" />}
                    className="w-full md:w-auto"
                  >
                    View Details
                  </Button>
                </div>
              ))
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
