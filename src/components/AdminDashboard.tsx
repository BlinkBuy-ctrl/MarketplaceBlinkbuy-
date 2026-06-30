import React, { useState } from 'react';
import { BarChart3, Box, Users, TrendingUp, LogOut, Menu, X, Home, Settings as SettingsIcon, Eye, ShoppingCart, AlertCircle, CheckCircle } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Mock Data
  const stats = [
    { label: 'Total Sales', value: 'K 2,450,000', change: '+12%', icon: ShoppingCart },
    { label: 'Active Listings', value: '1,240', change: '+8%', icon: Box },
    { label: 'Verified Sellers', value: '324', change: '+5%', icon: Users },
    { label: 'Today Views', value: '12,580', change: '+23%', icon: Eye },
  ];

  const recentOrders = [
    { id: '#MH001', buyer: 'John Banda', amount: 'K 45,000', status: 'Completed', district: 'Lilongwe' },
    { id: '#MH002', buyer: 'Sarah Kaombe', amount: 'K 78,500', status: 'Pending', district: 'Blantyre' },
    { id: '#MH003', buyer: 'Mike Dlamini', amount: 'K 32,000', status: 'Completed', district: 'Mzuzu' },
    { id: '#MH004', buyer: 'Grace Phiri', amount: 'K 156,200', status: 'Processing', district: 'Zomba' },
  ];

  const topProducts = [
    { name: 'Samsung A12', sales: 245, price: 'K 89,999' },
    { name: 'Laptop Bag', sales: 189, price: 'K 12,500' },
    { name: 'Dining Table', sales: 156, price: 'K 125,000' },
    { name: 'iPhone 11', sales: 142, price: 'K 299,999' },
  ];

  const categories = [
    { name: 'Electronics', count: 450, trend: '+12%' },
    { name: 'Furniture', count: 320, trend: '+8%' },
    { name: 'Fashion', count: 680, trend: '-2%' },
    { name: 'Home & Garden', count: 290, trend: '+15%' },
  ];

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      {/* Header */}
      <header className="bg-[#1C1C1C] border-b border-[#FF2D8D]/20 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 md:px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-[#2C2C2C] rounded-lg"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-2xl font-black bg-gradient-to-r from-[#FF2D8D] to-[#FF6FAE] bg-clip-text text-transparent">
              🏷️ Market Hub Admin
            </h1>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#FF2D8D] hover:bg-[#FF6FAE] rounded-lg font-semibold transition-colors">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-[#1C1C1C] border-r border-[#FF2D8D]/20 transition-all duration-300 overflow-hidden md:w-64`}>
          <nav className="p-6 space-y-2 pt-8">
            <NavItem
              icon={<Home size={20} />}
              label="Overview"
              active={activeTab === 'overview'}
              onClick={() => setActiveTab('overview')}
            />
            <NavItem
              icon={<Box size={20} />}
              label="Products"
              active={activeTab === 'products'}
              onClick={() => setActiveTab('products')}
            />
            <NavItem
              icon={<ShoppingCart size={20} />}
              label="Orders"
              active={activeTab === 'orders'}
              onClick={() => setActiveTab('orders')}
            />
            <NavItem
              icon={<Users size={20} />}
              label="Sellers"
              active={activeTab === 'sellers'}
              onClick={() => setActiveTab('sellers')}
            />
            <NavItem
              icon={<TrendingUp size={20} />}
              label="Analytics"
              active={activeTab === 'analytics'}
              onClick={() => setActiveTab('analytics')}
            />
            <NavItem
              icon={<SettingsIcon size={20} />}
              label="Settings"
              active={activeTab === 'settings'}
              onClick={() => setActiveTab('settings')}
            />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          {activeTab === 'overview' && <OverviewTab stats={stats} recentOrders={recentOrders} topProducts={topProducts} categories={categories} />}
          {activeTab === 'products' && <ProductsTab />}
          {activeTab === 'orders' && <OrdersTab orders={recentOrders} />}
          {activeTab === 'sellers' && <SellersTab />}
          {activeTab === 'analytics' && <AnalyticsTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </main>
      </div>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      active
        ? 'bg-gradient-to-r from-[#FF2D8D] to-[#FF6FAE] text-white font-semibold'
        : 'text-[#B5B5B5] hover:bg-[#2C2C2C] hover:text-white'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

interface OverviewTabProps {
  stats: any[];
  recentOrders: any[];
  topProducts: any[];
  categories: any[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({ stats, recentOrders, topProducts, categories }) => (
  <div className="space-y-8">
    {/* KPI Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div key={idx} className="bg-[#1C1C1C] rounded-xl p-6 border border-[#FF2D8D]/20 hover:border-[#FF2D8D]/50 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-[#FF2D8D]/10 rounded-lg">
                <Icon className="text-[#FF2D8D]" size={24} />
              </div>
              <span className="text-green-500 text-sm font-semibold">{stat.change}</span>
            </div>
            <p className="text-[#B5B5B5] text-sm">{stat.label}</p>
            <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
          </div>
        );
      })}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Recent Orders */}
      <div className="lg:col-span-2 bg-[#1C1C1C] rounded-xl p-6 border border-[#FF2D8D]/20">
        <h2 className="text-xl font-bold text-white mb-4">Recent Orders</h2>
        <div className="space-y-3">
          {recentOrders.map((order, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-[#0F0F0F] rounded-lg border border-[#FF2D8D]/10">
              <div>
                <p className="font-semibold text-white">{order.buyer}</p>
                <p className="text-sm text-[#B5B5B5]">{order.id} • {order.district}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-[#FF2D8D]">{order.amount}</p>
                <span className={`text-xs px-2 py-1 rounded ${order.status === 'Completed' ? 'bg-green-500/20 text-green-400' : order.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-[#1C1C1C] rounded-xl p-6 border border-[#FF2D8D]/20">
        <h2 className="text-xl font-bold text-white mb-4">Top Products</h2>
        <div className="space-y-4">
          {topProducts.map((product, idx) => (
            <div key={idx} className="pb-4 border-b border-[#FF2D8D]/20 last:border-0">
              <p className="font-semibold text-white text-sm">{product.name}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-[#FF2D8D] font-bold">{product.price}</span>
                <span className="text-[#B5B5B5] text-xs">{product.sales} sold</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Categories */}
    <div className="bg-[#1C1C1C] rounded-xl p-6 border border-[#FF2D8D]/20">
      <h2 className="text-xl font-bold text-white mb-4">Categories Performance</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat, idx) => (
          <div key={idx} className="p-4 bg-[#0F0F0F] rounded-lg border border-[#FF2D8D]/10">
            <p className="text-white font-semibold">{cat.name}</p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-2xl font-bold text-[#FF2D8D]">{cat.count}</span>
              <span className={`text-sm ${cat.trend.includes('-') ? 'text-red-400' : 'text-green-400'}`}>{cat.trend}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ProductsTab = () => (
  <div className="bg-[#1C1C1C] rounded-xl p-6 border border-[#FF2D8D]/20">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-white">Manage Products</h2>
      <button className="bg-gradient-to-r from-[#FF2D8D] to-[#FF6FAE] text-white font-semibold px-6 py-2 rounded-lg hover:shadow-lg hover:shadow-[#FF2D8D]/50 transition-all">
        + Add Product
      </button>
    </div>
    <p className="text-[#B5B5B5]">Product management interface coming soon...</p>
  </div>
);

interface OrdersTabProps {
  orders: any[];
}

const OrdersTab: React.FC<OrdersTabProps> = ({ orders }) => (
  <div className="bg-[#1C1C1C] rounded-xl p-6 border border-[#FF2D8D]/20">
    <h2 className="text-2xl font-bold text-white mb-6">Order Management</h2>
    <div className="space-y-3">
      {orders.map((order, idx) => (
        <div key={idx} className="flex items-center justify-between p-4 bg-[#0F0F0F] rounded-lg border border-[#FF2D8D]/10 hover:border-[#FF2D8D]/50 transition-colors">
          <div className="flex-1">
            <p className="font-semibold text-white">{order.buyer}</p>
            <p className="text-sm text-[#B5B5B5]">{order.id} • {order.district}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-[#FF2D8D] mb-2">{order.amount}</p>
            <span className={`px-3 py-1 rounded text-xs font-semibold ${order.status === 'Completed' ? 'bg-green-500/20 text-green-400' : order.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>
              {order.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SellersTab = () => (
  <div className="space-y-6">
    <div className="bg-[#1C1C1C] rounded-xl p-6 border border-[#FF2D8D]/20">
      <h2 className="text-2xl font-bold text-white mb-4">Active Sellers</h2>
      <div className="space-y-3">
        {[
          { name: 'Chipo Electronics', products: 145, rating: '4.8★', status: 'Verified' },
          { name: 'Home Comfort Store', products: 89, rating: '4.6★', status: 'Verified' },
          { name: 'Fashion Hub Lilongwe', products: 234, rating: '4.7★', status: 'Verified' },
        ].map((seller, idx) => (
          <div key={idx} className="p-4 bg-[#0F0F0F] rounded-lg border border-[#FF2D8D]/10 flex justify-between items-center">
            <div>
              <p className="font-semibold text-white">{seller.name}</p>
              <p className="text-sm text-[#B5B5B5]">{seller.products} products • {seller.rating}</p>
            </div>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">{seller.status}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AnalyticsTab = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div className="bg-[#1C1C1C] rounded-xl p-6 border border-[#FF2D8D]/20">
      <h2 className="text-xl font-bold text-white mb-4">Monthly Revenue</h2>
      <p className="text-[#B5B5B5]">K 12,450,000</p>
      <div className="mt-4 h-40 bg-[#0F0F0F] rounded-lg flex items-center justify-center">
        <p className="text-[#B5B5B5]">Chart visualization coming soon</p>
      </div>
    </div>

    <div className="bg-[#1C1C1C] rounded-xl p-6 border border-[#FF2D8D]/20">
      <h2 className="text-xl font-bold text-white mb-4">User Growth</h2>
      <p className="text-[#B5B5B5]">+324 new users this month</p>
      <div className="mt-4 h-40 bg-[#0F0F0F] rounded-lg flex items-center justify-center">
        <p className="text-[#B5B5B5]">Chart visualization coming soon</p>
      </div>
    </div>
  </div>
);

const SettingsTab = () => (
  <div className="bg-[#1C1C1C] rounded-xl p-6 border border-[#FF2D8D]/20">
    <h2 className="text-2xl font-bold text-white mb-6">Admin Settings</h2>
    <div className="space-y-4">
      <div className="p-4 bg-[#0F0F0F] rounded-lg border border-[#FF2D8D]/10">
        <p className="font-semibold text-white mb-2">Marketplace Settings</p>
        <p className="text-[#B5B5B5] text-sm">Configure marketplace features and policies</p>
      </div>
      <div className="p-4 bg-[#0F0F0F] rounded-lg border border-[#FF2D8D]/10">
        <p className="font-semibold text-white mb-2">Commission Rates</p>
        <p className="text-[#B5B5B5] text-sm">Set seller commission and fee structure</p>
      </div>
      <div className="p-4 bg-[#0F0F0F] rounded-lg border border-[#FF2D8D]/10">
        <p className="font-semibold text-white mb-2">Moderation Tools</p>
        <p className="text-[#B5B5B5] text-sm">Manage content and seller verification</p>
      </div>
    </div>
  </div>
);
