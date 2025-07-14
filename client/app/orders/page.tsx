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
import { FaArrowLeft, FaSearch, FaFilter, FaCalendarAlt, FaBox } from "react-icons/fa";
import axios from "axios";

export default function OrdersPage() {
  const [UserData, setUserData] = useState(null);
  const [UserOrder, setUserOrder] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    axios.get("/api/user")
      .then((res) => {
        setUserData(res.data.user);
        console.warn("Fetched Data:", res.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (UserData?.database?.shopping?.orders) {
      setUserOrder(UserData.database.shopping.orders);
      setFilteredOrders(UserData.database.shopping.orders);
      console.log("User Orders:", UserData.database.shopping.orders);
    }
  }, [UserData]);

  useEffect(() => {
    let filtered = UserOrder;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.product?.mobile_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.product?.doc_id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter);
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
      <Icon icon="mdi:package-variant-closed" className="mb-4 text-6xl text-gray-300" />
      <h3 className="mb-2 text-xl font-semibold text-gray-600">No orders found</h3>
      <p className="max-w-md text-gray-500">
        {searchTerm || statusFilter !== "all" 
          ? "Try adjusting your search or filter criteria"
          : "You haven't placed any orders yet. Start shopping to see your orders here."}
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
                className="font-medium"
              >
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
                <p className="text-sm text-gray-600">
                  {UserOrder.length} {UserOrder.length === 1 ? 'order' : 'orders'} total
                </p>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col gap-4 mb-6 sm:flex-row">
            <div className="flex-1">
              <Input
                placeholder="Search orders by product name or ID..."
                startContent={<FaSearch className="text-gray-400" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                classNames={{
                  input: "text-sm",
                  inputWrapper: "bg-white shadow-sm border-gray-200"
                }}
              />
            </div>
            <Select
              placeholder="Filter by status"
              selectedKeys={statusFilter ? [statusFilter] : []}
              onSelectionChange={(keys) => setStatusFilter(Array.from(keys)[0] || "all")}
              startContent={<FaFilter className="text-gray-400" />}
              className="w-full sm:w-48"
              classNames={{
                trigger: "bg-white shadow-sm border-gray-200"
              }}
            >
              <SelectItem key="all" value="all">All Status</SelectItem>
              <SelectItem key="delivered" value="delivered">Delivered</SelectItem>
              <SelectItem key="shipped" value="shipped">Shipped</SelectItem>
              <SelectItem key="processing" value="pending">Pending</SelectItem>
              <SelectItem key="cancelled" value="cancelled">Cancelled</SelectItem>
            </Select>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card className="shadow-sm">
              <CardBody>
                <EmptyState />
              </CardBody>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order?.product?.doc_id} className="transition-shadow shadow-sm hover:shadow-md">
                <CardBody className="p-6">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    {/* Product Info */}
                    <div className="flex items-start flex-1 gap-4">
                      <Avatar
                        src={order?.product?.phone_img}
                        alt={order?.product?.mobile_name}
                        className="w-16 h-16 rounded-lg"
                        imgProps={{ className: "object-cover" }}
                        fallback={<Icon icon="mdi:cellphone" className="text-2xl text-gray-400" />}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {order.product?.mobile_name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                          <Icon icon="mdi:tag" className="text-gray-400" />
                          <span>#{order?.product?.doc_id}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                          <FaCalendarAlt className="text-gray-400" />
                          <span>Ordered on {formatDate(order?.buy_at)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Order Status and Price */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center lg:gap-8">
                      <div className="flex items-center gap-2">
                        <Chip
                          color={getStatusColor(order.status)}
                          variant="flat"
                          size="md"
                          startContent={<Icon icon={getStatusIcon(order.status)} className="text-sm" />}
                          classNames={{
                            content: "font-medium"
                          }}
                        >
                          {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                        </Chip>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          {order?.product?.price?.toLocaleString("en-PK", {
                            style: "currency",
                            currency: "PKR",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </div>

        {/* Summary Footer */}
        {filteredOrders.length > 0 && (
          <div className="p-4 mt-8 bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Showing {filteredOrders.length} of {UserOrder.length} orders
              </span>
              <span>
                Total value: {filteredOrders.reduce((sum, order) => sum + (order?.product?.price || 0), 0).toLocaleString("en-PK", {
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