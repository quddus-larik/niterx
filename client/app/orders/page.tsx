"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Spinner,
  Button,
  Chip,
  Input,
  Select,
  SelectItem,
  Avatar,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { FaArrowLeft, FaSearch, FaFilter, FaCalendarAlt } from "react-icons/fa";
import axios from "axios";
import { Ban } from "lucide-react";

export default function OrdersPage() {
  const [UserData, setUserData] = useState(null);
  const [UserOrder, setUserOrder] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("/api/user")
      .then((res) => {
        setUserData(res.data.user);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (UserData?.database?.shopping?.orders) {
      setUserOrder(UserData.database.shopping.orders);
      setFilteredOrders(UserData.database.shopping.orders);
    }
  }, [UserData]);

  useEffect(() => {
    let filtered = [...UserOrder];

    if (searchTerm.trim()) {
      filtered = filtered.filter((order) =>
        order.product?.mobile_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, UserOrder]);

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "success";
      case "shipped":
        return "primary";
      case "processing":
        return "warning";
      case "cancelled":
        return "danger";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return "mdi:check-circle";
      case "shipped":
        return "mdi:truck-delivery";
      case "processing":
        return "mdi:clock-time-four";
      case "cancelled":
        return "mdi:close-circle";
      default:
        return "mdi:package-variant";
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Icon
        icon="mdi:package-variant-closed"
        className="mb-4 text-6xl text-gray-300"
      />
      <h3 className="mb-2 text-xl font-semibold text-gray-600">
        No orders found
      </h3>
      <p className="max-w-md text-gray-500">
        {searchTerm || statusFilter !== "all"
          ? "Try adjusting your search or filter criteria"
          : "You haven't placed any orders yet."}
      </p>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Spinner size="lg" color="default" />
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="light"
                color="default"
                startContent={<FaArrowLeft />}
                onPress={() => window.history.back()}
              >
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Order History
                </h1>
                <p className="text-sm text-gray-600">
                  {UserOrder.length} total order
                  {UserOrder.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-4 mb-6 sm:flex-row">
            <Input
              placeholder="Search by name or ID..."
              startContent={<FaSearch className="text-gray-400" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="sm:flex-1"
            />
            <Select
              placeholder="Filter by status"
              selectedKeys={[statusFilter]}
              onSelectionChange={(keys) =>
                setStatusFilter(Array.from(keys)[0] || "all")
              }
              startContent={<FaFilter className="text-gray-400" />}
              className="w-full sm:w-48"
            >
              <SelectItem key="all">All</SelectItem>
              <SelectItem key="delivered">Delivered</SelectItem>
              <SelectItem key="shipped">Shipped</SelectItem>
              <SelectItem key="processing">Processing</SelectItem>
              <SelectItem key="cancelled">Cancelled</SelectItem>
            </Select>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardBody>
                <EmptyState />
              </CardBody>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <Card
                key={order?.product?.doc_id}
                className="transition-shadow hover:shadow-md"
              >
                <CardBody className="p-6">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    {/* Product Info */}
                    <div className="flex gap-4">
                      <Avatar
                        src={order?.product?.phone_img}
                        alt={order?.product?.mobile_name}
                        className="w-16 h-16 rounded-lg"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {order.product?.mobile_name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          #{order?.product?.doc_id}
                        </p>
                        <p className="flex items-center gap-1 text-sm text-gray-400">
                          <FaCalendarAlt className="text-gray-400" />
                          Ordered on {formatDate(order?.buy_at)}
                        </p>
                      <Button 
                      size="sm" 
                      className="mt-2" 
                      radius="full" 
                      variant="flat" 
                      color="danger"
                      
                      >cancel</Button>
                      </div>
                    </div>

                    {/* Status and Price */}
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center lg:gap-8">
                      <Chip
                        size="md"
                        variant="flat"
                        color={getStatusColor(order.status)}
                        startContent={
                          <Icon
                            icon={getStatusIcon(order.status)}
                            className="text-md"
                          />
                        }
                      >
                        {order.status?.charAt(0).toUpperCase() +
                          order.status?.slice(1)}
                      </Chip>
                      <p className="text-xl font-bold text-primary-700">
                        {order?.product?.price?.toLocaleString("en-PK", {
                          style: "currency",
                          currency: "PKR",
                        })}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </div>

        {/* Summary */}
        {filteredOrders.length > 0 && (
          <div className="p-4 mt-8 bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Showing {filteredOrders.length} of {UserOrder.length} orders
              </span>
              <span>
                Total value:{" "}
                {filteredOrders
                  .reduce((sum, order) => sum + (order?.product?.price || 0), 0)
                  .toLocaleString("en-PK", {
                    style: "currency",
                    currency: "PKR",
                  })}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
