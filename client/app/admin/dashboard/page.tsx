"use client";
import React, { useEffect, useState } from "react";
import { useValidatorFetch } from "@/app/lib/useFetch/useFetch";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  BarChart3,
  Settings,
  LogOut,
  Search,
  Bell,
  User,
  TrendingUp,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  X,
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  Select,
  SelectItem,
  Card,
  CardBody,
  CardHeader,
  Divider,
} from "@heroui/react";
import axios from "axios";
import { gql, useQuery } from "@apollo/client";

const mockData = {
  stats: {
    totalRevenue: 245670,
    totalOrders: 1247,
    totalCustomers: 3420,
    totalProducts: 156,
    monthlyGrowth: 12.5,
    orderGrowth: 8.3,
    productGrowth: 5.7,
    customerGrowth: 15.2,
  },
  recentOrders: [
    {
      id: "#ORD-001",
      customer: "John Doe",
      product: "iPhone 14 Pro",
      amount: 999,
      status: "completed",
      date: "2024-01-15",
    },
    {
      id: "#ORD-002",
      customer: "Sarah Wilson",
      product: "MacBook Air",
      amount: 1299,
      status: "processing",
      date: "2024-01-15",
    },
    {
      id: "#ORD-003",
      customer: "Mike Johnson",
      product: "AirPods Pro",
      amount: 249,
      status: "shipped",
      date: "2024-01-14",
    },
    {
      id: "#ORD-004",
      customer: "Emma Davis",
      product: "iPad Pro",
      amount: 1099,
      status: "pending",
      date: "2024-01-14",
    },
    {
      id: "#ORD-005",
      customer: "Chris Brown",
      product: "Apple Watch",
      amount: 399,
      status: "completed",
      date: "2024-01-13",
    },
  ],
  topProducts: [
    {
      id: 1,
      name: "iPhone 14 Pro",
      sales: 234,
      revenue: 233766,
      stock: 45,
      image: "📱",
      category: "Electronics",
      price: 999,
    },
    {
      id: 2,
      name: "MacBook Air M2",
      sales: 156,
      revenue: 202644,
      stock: 23,
      image: "💻",
      category: "Electronics",
      price: 1299,
    },
    {
      id: 3,
      name: "AirPods Pro",
      sales: 445,
      revenue: 110805,
      stock: 89,
      image: "🎧",
      category: "Audio",
      price: 249,
    },
    {
      id: 4,
      name: "iPad Pro",
      sales: 123,
      revenue: 135177,
      stock: 34,
      image: "📱",
      category: "Electronics",
      price: 1099,
    },
    {
      id: 5,
      name: "Apple Watch Ultra",
      sales: 89,
      revenue: 71111,
      stock: 67,
      image: "⌚",
      category: "Wearables",
      price: 799,
    },
  ],
  customers: [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      orders: 12,
      spent: 2340,
      joined: "2023-05-15",
      status: "active",
    },
    {
      id: 2,
      name: "Sarah Wilson",
      email: "sarah@example.com",
      orders: 8,
      spent: 1890,
      joined: "2023-08-22",
      status: "active",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      orders: 15,
      spent: 3200,
      joined: "2023-03-10",
      status: "vip",
    },
    {
      id: 4,
      name: "Emma Davis",
      email: "emma@example.com",
      orders: 6,
      spent: 1450,
      joined: "2023-11-05",
      status: "active",
    },
    {
      id: 5,
      name: "Chris Brown",
      email: "chris@example.com",
      orders: 22,
      spent: 4560,
      joined: "2023-01-18",
      status: "vip",
    },
  ],
};

const Dashboard = () => {
  // Default stats structure for easier resets and reference
  const defaultStats = {
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    monthlyGrowth: 0,
    orderGrowth: 0,
    productGrowth: 0,
    customerGrowth: 0,
    Customers: [],
  };

  // UI State
  const [activeView, setActiveView] = useState("Dashboard");
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isEditOrderModalOpen, setIsEditOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Form State
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    description: "",
  });

  // Data State
  const [Stats, setStats] = useState(defaultStats);
  const [orders, setOrders] = useState([]);

  // Fetch Orders from REST API
  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/user/orders/admin"
      );
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // GraphQL Query for Phones
  const GET_ALL_PHONES = gql`
    query GetAllPhones {
      getAllPhones {
        doc_id
        mobile_name
        category {
          name
        }
        phone_img
        price
        qty
      }
    }
  `;
  const {
    data: GData,
    loading, Gloading,
    error: Gerror
  } = useQuery(GET_ALL_PHONES)
  console.log(GData);

  // Custom Hook Data
  const {
    data: validatorData,
    loading: validatorLoading,
    error: validatorError,
  } = useValidatorFetch("/api/admin/v1/data", 180);

  // Sync Validator Data with Stats
  useEffect(() => {
    if (!validatorLoading && !validatorError && validatorData) {
      setStats(validatorData);
    }

    if (validatorError) {
      console.error("Failed to fetch dashboard data:", validatorError);
    }
  }, [validatorData, validatorLoading, validatorError]);

  const menuItems = [
    { text: "Dashboard", icon: <LayoutDashboard size={20} />, id: "Dashboard" },
    { text: "Orders", icon: <ShoppingCart size={20} />, id: "Orders" },
    { text: "Products", icon: <Package size={20} />, id: "Products" },
    { text: "Customers", icon: <Users size={20} />, id: "Customers" },
    { text: "Analytics", icon: <BarChart3 size={20} />, id: "Analytics" },
    { text: "Settings", icon: <Settings size={20} />, id: "Settings" },
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "success";
      case "processing":
        return "primary";
      case "shipped":
        return "secondary";
      case "pending":
        return "warning";
      case "cancelled":
        return "danger";
      case "active":
        return "success";
      case "vip":
        return "warning";
      default:
        return "default";
    }
  };

  const StatCard = ({ title, value, change, icon, color }) => (
    <Card>
      <CardBody className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
            <div className="flex items-center mt-2">
              <TrendingUp size={16} className={`${color} mr-1`} />
              <span className={`text-sm font-medium ${color}`}>+{change}%</span>
              <span className="ml-1 text-sm text-gray-500">vs last month</span>
            </div>
          </div>
          <div className={`p-3 rounded-lg ${color} bg-slate-100`}>{icon}</div>
        </div>
      </CardBody>
    </Card>
  );

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setIsEditOrderModalOpen(true);
  };

  const handleAddProduct = () => {
    console.log("Adding product:", newProduct);
    setIsAddProductModalOpen(false);
    setNewProduct({
      name: "",
      price: "",
      category: "",
      stock: "",
      description: "",
    });
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-1 text-gray-600">
          Welcome back! Here's what's happening with your store.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={`$${Stats?.totalRevenue || 0}`}
          change={Stats?.monthlyGrowth || 0}
          icon={<DollarSign size={24} />}
          color="text-green-600"
        />
        <StatCard
          title="Orders"
          value={Stats?.totalOrders || 0}
          change={Stats?.orderGrowth || 0}
          icon={<ShoppingCart size={24} />}
          color="text-blue-600"
        />
        <StatCard
          title="Customers"
          value={Stats?.totalCustomers || 0}
          change={0}
          icon={<Users size={24} />}
          color="text-purple-600"
        />
        <StatCard
          title="Products"
          value={Stats?.totalProducts || 0}
          change={Stats?.productGrowth || 0}
          icon={<Package size={24} />}
          color="text-orange-600"
        />
      </div>

      {/* Charts and Tables Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Orders
              </h3>
            </CardHeader>
            <Divider />
            <CardBody className="p-0">
              <Table isStriped aria-label="Recent orders table" removeWrapper>
                <TableHeader>
                  <TableColumn>ORDER ID</TableColumn>
                  <TableColumn>CUSTOMER</TableColumn>
                  <TableColumn>PRODUCT</TableColumn>
                  <TableColumn>AMOUNT</TableColumn>
                  <TableColumn>STATUS</TableColumn>
                </TableHeader>
                <TableBody>
                  {orders.slice(0, 6).map((itm) => (
                    <TableRow key={itm.product.doc_id}>
                      <TableCell className="font-medium text-blue-600">
                        {"ORD-" + itm.product.doc_id}
                      </TableCell>
                      <TableCell>{itm.user_email}</TableCell>
                      <TableCell className="text-gray-600">
                        {itm.product.mobile_name}
                      </TableCell>
                      <TableCell className="font-medium">
                        ${itm.product.price}
                      </TableCell>
                      <TableCell>
                        <Chip
                          color={getStatusColor(itm.status)}
                          variant="flat"
                          size="sm"
                        >
                          {itm.status.charAt(0).toUpperCase() +
                            itm.status.slice(1)}
                        </Chip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </div>

        {/* Top Products */}
        <div>
          <Card>
            <CardHeader className="pb-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Top Products
              </h3>
            </CardHeader>
            <Divider />
            <CardBody>
              <div className="space-y-4">
                {mockData.topProducts.slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{product.image}</div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {product.sales} sales
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ${product.revenue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Orders Management
          </h1>
          <p className="mt-1 text-gray-600">
            Manage and track all customer orders
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            color="default"
            variant="bordered"
            startContent={<Filter size={16} />}
          >
            Filter
          </Button>
          <Button color="primary" startContent={<Plus size={16} />}>
            New Order
          </Button>
        </div>
      </div>

      <Card>
        <CardBody className="p-0">
          <Table aria-label="Orders table" removeWrapper>
            <TableHeader>
              <TableColumn>S#</TableColumn>
              <TableColumn>CUSTOMER</TableColumn>
              <TableColumn>PRODUCT</TableColumn>
              <TableColumn>DATE</TableColumn>
              <TableColumn>AMOUNT</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {orders.map((order, idx) => (
                <TableRow key={order.product.doc_id}>
                  <TableCell className="font-medium text-blue-600">
                    {idx + 1}
                  </TableCell>
                  <TableCell>{order.user_email}</TableCell>
                  <TableCell className="text-gray-600">
                    {order.product.mobile_name}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {order.buy_at}
                  </TableCell>
                  <TableCell className="font-medium">
                    {parseInt(
                      order.product.price * order.product.qty
                    ).toLocaleString("en-US", {
                      style: "currency",
                      currency: "PKR",
                      maximumFractionDigits: 0, // removes after decimal
                    })}
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={getStatusColor(order.status)}
                      variant="flat"
                      size="sm"
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        isIconOnly
                        color="default"
                        variant="light"
                        size="sm"
                      >
                        <Eye size={16} />
                      </Button>
                      <Button
                        isIconOnly
                        color="primary"
                        variant="light"
                        size="sm"
                        onPress={() => handleEditOrder(order)}
                      >
                        <Edit size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Edit Order Modal */}
      <Modal
        isOpen={isEditOrderModalOpen}
        onClose={() => setIsEditOrderModalOpen(false)}
        size="2xl"
      >
        <ModalContent>
          <ModalHeader>Edit Order {selectedOrder?.id}</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Customer"
                value={selectedOrder?.customer || ""}
                variant="bordered"
              />
              <Input
                label="Product"
                value={selectedOrder?.product || ""}
                variant="bordered"
              />
              <Input
                label="Amount"
                value={selectedOrder?.amount ? `$${selectedOrder.amount}` : ""}
                variant="bordered"
              />
              <Select
                label="Status"
                variant="bordered"
                defaultSelectedKeys={
                  selectedOrder ? [selectedOrder.status] : []
                }
              >
                <SelectItem key="pending" value="pending">
                  Pending
                </SelectItem>
                <SelectItem key="processing" value="processing">
                  Processing
                </SelectItem>
                <SelectItem key="shipped" value="shipped">
                  Shipped
                </SelectItem>
                <SelectItem key="completed" value="completed">
                  Completed
                </SelectItem>
                <SelectItem key="cancelled" value="cancelled">
                  Cancelled
                </SelectItem>
              </Select>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={() => setIsEditOrderModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={() => setIsEditOrderModalOpen(false)}
            >
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Products Management
          </h1>
          <p className="mt-1 text-gray-600">Manage your product catalog</p>
        </div>
        <Button
          color="primary"
          startContent={<Plus size={16} />}
          onPress={() => setIsAddProductModalOpen(true)}
        >
          Add Product
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {GData.getAllPhones.map((product) => (
          <Card key={product.doc_id} className="transition-shadow hover:shadow-lg">
            <CardBody className="p-4">
              <div className="mb-4 text-center">
                <img src={product.phone_img} alt={product.mobile_name} className="h-52"/>
                <Chip color="default" variant="flat" size="sm" className="mt-1">
                  {product.category.name}
                </Chip>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium">${product.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sales:</span>
                  <span className="font-medium">{product.qty}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Stock:</span>
                  <Chip
                    color={product.qty < 30 ? "danger" : "success"}
                    variant="flat"
                    size="sm"
                  >
                    {product.qty}
                  </Chip>
                </div>
              </div>
              <div className="flex mt-4 space-x-2">
                <Button color="primary" className="flex-1">
                  Edit
                </Button>
                <Button color="danger" variant="light" isIconOnly>
                  <Trash2 size={16} />
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Add Product Modal */}
      <Modal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        size="2xl"
      >
        <ModalContent>
          <ModalHeader>Add New Phone</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Phone Name"
                placeholder="Enter Phone name"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, mobile_name: e.target.value })
                }
                variant="bordered"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Price"
                  placeholder="0.00"
                  startContent="$"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                  variant="bordered"
                />
                <Input
                  label="Stock Quantity"
                  placeholder="0"
                  value={newProduct.stock}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, qty: e.target.value })
                  }
                  variant="bordered"
                />
              </div>
              <Select
                label="Category"
                placeholder="Select category"
                variant="bordered"
                value={newProduct.category.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: { name: e.target.value }})
                }
              >
                <SelectItem key="electronics" value="electronics">
                  Huawai
                </SelectItem>
                <SelectItem key="audio" value="audio">
                  Samsung
                </SelectItem>
                <SelectItem key="wearables" value="wearables">
                  Asus
                </SelectItem>
                <SelectItem key="accessories" value="accessories">
                  Oppo
                </SelectItem>
              </Select>
              <Textarea
                label="Description"
                placeholder="Enter product description"
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
                variant="bordered"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={() => setIsAddProductModalOpen(false)}
            >
              Cancel
            </Button>
            <Button color="primary" onPress={handleAddProduct}>
              Add Product
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );

  const renderCustomers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="mt-1 text-gray-600">
            Manage your customer relationships
          </p>
        </div>
      </div>

      <Card>
        <CardBody className="p-0">
          <Table aria-label="Customers table" removeWrapper>
            <TableHeader>
              <TableColumn>CUSTOMER</TableColumn>
              <TableColumn>EMAIL</TableColumn>
              <TableColumn>ORDERS</TableColumn>
              <TableColumn>TOTAL SPENT</TableColumn>
              <TableColumn>JOINED</TableColumn>
            </TableHeader>
            <TableBody>
              {Stats.Customers.map((customer, idx) => (
                <TableRow key={idx + 1}>
                  <TableCell className="font-medium">
                    {customer.username}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {customer.email}
                  </TableCell>
                  <TableCell>{customer.shopping.orders.length}</TableCell>
                  <TableCell className="font-medium">
                    ${customer.spent || "null"}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {customer.joined || "null"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeView) {
      case "Dashboard":
        return renderDashboard();
      case "Orders":
        return renderOrders();
      case "Products":
        return renderProducts();
      case "Customers":
        return renderCustomers();
      case "Analytics":
        return (
          <div className="py-12 text-center">
            <BarChart3 size={64} className="mx-auto mb-4 text-gray-300" />
            <h2 className="mb-2 text-2xl font-bold text-gray-900">
              Analytics Dashboard
            </h2>
            <p className="text-gray-600">
              Advanced analytics and reporting features coming soon.
            </p>
          </div>
        );
      case "Settings":
        return (
          <div className="py-12 text-center">
            <Settings size={64} className="mx-auto mb-4 text-gray-300" />
            <h2 className="mb-2 text-2xl font-bold text-gray-900">Settings</h2>
            <p className="text-gray-600">
              Configure your store settings and preferences.
            </p>
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="flex h-svh bg-gray-50 max-w-*">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">🛍️ niterX</h2>
          <p className="mt-1 text-sm text-gray-600">Admin Dashboard</p>
        </div>

        <nav className="p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full justify-start h-12 ${
                  activeView === item.id
                    ? "bg-blue-50 text-blue-700 ring-1 ring-blue-700"
                    : "text-gray-700 bg-transparent hover:bg-gray-100"
                }`}
                startContent={item.icon}
                variant="light"
                disableAnimation
              >
                {item.text}
              </Button>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="px-6 py-4 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Input
                placeholder="Search..."
                startContent={<Search size={20} className="text-gray-400" />}
                className="w-64"
                variant="bordered"
              />
            </div>

            <div className="flex items-center space-x-4">
              <Button
                isIconOnly
                color="default"
                variant="light"
                className="relative"
              >
                <Bell size={20} />
                <span className="absolute flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full -top-1 -right-1">
                  3
                </span>
              </Button>
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                  <User size={16} className="text-blue-600" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">Admin User</p>
                  <p className="text-gray-600">admin@shopadmin.com</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-auto">{renderContent()}</main>
      </div>
    </div>
  );
};

export default Dashboard;
