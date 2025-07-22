'use client'
import React, { useEffect, useState } from 'react';
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
  Filter
} from 'lucide-react';
import axios from "axios";

// Mock data
const mockData = {
  stats: {
    totalRevenue: 245670,
    totalOrders: 1247,
    totalCustomers: 3420,
    totalProducts: 156,
    monthlyGrowth: 12.5,
    orderGrowth: 8.3,
    customerGrowth: 15.2,
    productGrowth: 5.7
  },
  recentOrders: [
    { id: '#ORD-001', customer: 'John Doe', product: 'iPhone 14 Pro', amount: 999, status: 'Completed', date: '2024-01-15' },
    { id: '#ORD-002', customer: 'Sarah Wilson', product: 'MacBook Air', amount: 1299, status: 'Processing', date: '2024-01-15' },
    { id: '#ORD-003', customer: 'Mike Johnson', product: 'AirPods Pro', amount: 249, status: 'Shipped', date: '2024-01-14' },
    { id: '#ORD-004', customer: 'Emma Davis', product: 'iPad Pro', amount: 1099, status: 'Pending', date: '2024-01-14' },
    { id: '#ORD-005', customer: 'Chris Brown', product: 'Apple Watch', amount: 399, status: 'Completed', date: '2024-01-13' }
  ],
  
  topProducts: [
    { id: 1, name: 'iPhone 14 Pro', sales: 234, revenue: 233766, stock: 45, image: '📱' },
    { id: 2, name: 'MacBook Air M2', sales: 156, revenue: 202644, stock: 23, image: '💻' },
    { id: 3, name: 'AirPods Pro', sales: 445, revenue: 110805, stock: 89, image: '🎧' },
    { id: 4, name: 'iPad Pro', sales: 123, revenue: 135177, stock: 34, image: '📱' },
    { id: 5, name: 'Apple Watch Ultra', sales: 89, revenue: 71111, stock: 67, image: '⌚' }
  ],
  customers: [
    { id: 1, name: 'John Doe', email: 'john@example.com', orders: 12, spent: 2340, joined: '2023-05-15', status: 'Active' },
    { id: 2, name: 'Sarah Wilson', email: 'sarah@example.com', orders: 8, spent: 1890, joined: '2023-08-22', status: 'Active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', orders: 15, spent: 3200, joined: '2023-03-10', status: 'VIP' },
    { id: 4, name: 'Emma Davis', email: 'emma@example.com', orders: 6, spent: 1450, joined: '2023-11-05', status: 'Active' },
    { id: 5, name: 'Chris Brown', email: 'chris@example.com', orders: 22, spent: 4560, joined: '2023-01-18', status: 'VIP' }
  ]
};

const Dashboard = () => {
  const [activeView, setActiveView] = useState('Dashboard');
  const [AdminData, setAdminData] = useState({
    totalRevenue: 245670,
    totalOrders: 1247,
    totalCustomers: 3420,
    totalProducts: 156,
    monthlyGrowth: 12.5,
    orderGrowth: 8.3,
    customerGrowth: 15.2,
    productGrowth: 5.7
  });

  const menuItems = [
    { text: 'Dashboard', icon: <LayoutDashboard size={20} />, id: 'Dashboard' },
    { text: 'Orders', icon: <ShoppingCart size={20} />, id: 'Orders' },
    { text: 'Products', icon: <Package size={20} />, id: 'Products' },
    { text: 'Customers', icon: <Users size={20} />, id: 'Customers' },
    { text: 'Analytics', icon: <BarChart3 size={20} />, id: 'Analytics' },
    { text: 'Settings', icon: <Settings size={20} />, id: 'Settings' }
  ];

  const StatCard = ({ title, value, change, icon, color }) => (
    <div className="p-6 transition-shadow bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md">
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
        <div className={`p-3 rounded-lg ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-1 text-gray-600">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Revenue" 
          value={`$${mockData.stats.totalRevenue.toLocaleString()}`}
          change={mockData.stats.monthlyGrowth}
          icon={<DollarSign size={24} />}
          color="text-green-600"
        />
        <StatCard 
          title="Orders" 
          value={mockData.stats.totalOrders.toLocaleString()}
          change={mockData.stats.orderGrowth}
          icon={<ShoppingCart size={24} />}
          color="text-blue-600"
        />
        <StatCard 
          title="Customers" 
          value={mockData.stats.totalCustomers.toLocaleString()}
          change={mockData.stats.customerGrowth}
          icon={<Users size={24} />}
          color="text-purple-600"
        />
        <StatCard 
          title="Products" 
          value={mockData.stats.totalProducts}
          change={mockData.stats.productGrowth}
          icon={<Package size={24} />}
          color="text-orange-600"
        />
      </div>

      {/* Charts and Tables Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Orders */}
        <div className="bg-white border border-gray-100 shadow-sm lg:col-span-2 rounded-xl">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Product</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  {mockData.recentOrders.map((order, index) => (
                    <tr key={order.id} className={index !== mockData.recentOrders.length - 1 ? 'border-b border-gray-50' : ''}>
                      <td className="py-3 text-sm font-medium text-gray-900">{order.id}</td>
                      <td className="py-3 text-sm text-gray-600">{order.customer}</td>
                      <td className="py-3 text-sm text-gray-600">{order.product}</td>
                      <td className="py-3 text-sm font-medium text-gray-900">${order.amount}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {mockData.topProducts.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{product.image}</div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.sales} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">${product.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
          <p className="mt-1 text-gray-600">Manage and track all customer orders</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 space-x-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter size={16} />
            <span>Filter</span>
          </button>
          <button className="flex items-center px-4 py-2 space-x-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            <Plus size={16} />
            <span>New Order</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm rounded-xl">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs font-medium tracking-wider text-left text-gray-500 uppercase border-b border-gray-200">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Product</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockData.recentOrders.map((order, index) => (
                  <tr key={order.id} className={index !== mockData.recentOrders.length - 1 ? 'border-b border-gray-50' : ''}>
                    <td className="py-4 text-sm font-medium text-blue-600">{order.id}</td>
                    <td className="py-4 text-sm text-gray-900">{order.customer}</td>
                    <td className="py-4 text-sm text-gray-600">{order.product}</td>
                    <td className="py-4 text-sm text-gray-600">{order.date}</td>
                    <td className="py-4 text-sm font-medium text-gray-900">${order.amount}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex space-x-2">
                        <button className="p-1 text-gray-400 hover:text-blue-600">
                          <Eye size={16} />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-green-600">
                          <Edit size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
          <p className="mt-1 text-gray-600">Manage your product catalog</p>
        </div>
        <button className="flex items-center px-4 py-2 space-x-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
          <Plus size={16} />
          <span>Add Product</span>
        </button>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm rounded-xl">
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockData.topProducts.map((product) => (
              <div key={product.id} className="p-4 transition-shadow border border-gray-200 rounded-lg hover:shadow-md">
                <div className="mb-4 text-center">
                  <div className="mb-2 text-4xl">{product.image}</div>
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sales:</span>
                    <span className="font-medium">{product.sales}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Revenue:</span>
                    <span className="font-medium">${product.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stock:</span>
                    <span className={`font-medium ${product.stock < 30 ? 'text-red-600' : 'text-green-600'}`}>
                      {product.stock}
                    </span>
                  </div>
                </div>
                <div className="flex mt-4 space-x-2">
                  <button className="flex-1 px-3 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700">
                    Edit
                  </button>
                  <button className="px-3 py-2 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCustomers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="mt-1 text-gray-600">Manage your customer relationships</p>
        </div>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm rounded-xl">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs font-medium tracking-wider text-left text-gray-500 uppercase border-b border-gray-200">
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Orders</th>
                  <th className="pb-3">Total Spent</th>
                  <th className="pb-3">Joined</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockData.customers.map((customer, index) => (
                  <tr key={customer.id} className={index !== mockData.customers.length - 1 ? 'border-b border-gray-50' : ''}>
                    <td className="py-4 text-sm font-medium text-gray-900">{customer.name}</td>
                    <td className="py-4 text-sm text-gray-600">{customer.email}</td>
                    <td className="py-4 text-sm text-gray-600">{customer.orders}</td>
                    <td className="py-4 text-sm font-medium text-gray-900">${customer.spent}</td>
                    <td className="py-4 text-sm text-gray-600">{customer.joined}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        customer.status === 'VIP' ? 'bg-gold-100 text-gold-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex space-x-2">
                        <button className="p-1 text-gray-400 hover:text-blue-600">
                          <Eye size={16} />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-green-600">
                          <Edit size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeView) {
      case 'Dashboard': return renderDashboard();
      case 'Orders': return renderOrders();
      case 'Products': return renderProducts();
      case 'Customers': return renderCustomers();
      case 'Analytics':
        return (
          <div className="py-12 text-center">
            <BarChart3 size={64} className="mx-auto mb-4 text-gray-300" />
            <h2 className="mb-2 text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
            <p className="text-gray-600">Advanced analytics and reporting features coming soon.</p>
          </div>
        );
      case 'Settings':
        return (
          <div className="py-12 text-center">
            <Settings size={64} className="mx-auto mb-4 text-gray-300" />
            <h2 className="mb-2 text-2xl font-bold text-gray-900">Settings</h2>
            <p className="text-gray-600">Configure your store settings and preferences.</p>
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">🛍️ ShopAdmin</h2>
          <p className="mt-1 text-sm text-gray-600">Admin Dashboard</p>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeView === item.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.text}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <button className="flex items-center w-full px-4 py-3 text-left text-gray-700 transition-colors rounded-lg hover:bg-gray-100">
            <LogOut size={20} className="mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="px-6 py-4 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search size={20} className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600">
                <Bell size={20} />
                <span className="absolute flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full -top-1 -right-1">3</span>
              </button>
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
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;