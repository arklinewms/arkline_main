import { useState, useEffect } from 'react';
import { Package, TrendingUp, Users, AlertCircle, Activity } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function Home() {
  const [inventoryData, setInventoryData] = useState<any[]>([]);
  const [totalInventory, setTotalInventory] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/inventory`);
        if (response.ok) {
          const data = await response.json();
          setInventoryData(data || []);

          let totalQty = 0;
          let lowStock = 0;
          data.forEach((item: any) => {
            totalQty += item.totalitemquantity || 0;
            if (item.totalitemquantity < 10) lowStock++;
          });
          setTotalInventory(totalQty);
          setLowStockCount(lowStock);
        }
      } catch (err) {
        console.error('Failed to fetch home data', err);
      }
    };
    fetchData();
  }, []);

  const stats = [
    {
      title: 'Total Inventory Quantity',
      value: totalInventory.toLocaleString(),
      change: 'Real-time sync',
      icon: Package,
      color: 'bg-blue-600',
    },
    {
      title: 'Unique SKUs',
      value: inventoryData.length.toString(),
      change: 'Active in warehouse',
      icon: TrendingUp,
      color: 'bg-indigo-600',
    },
    {
      title: 'Active Users',
      value: '342',
      change: 'Current operators',
      icon: Users,
      color: 'bg-slate-600',
    },
    {
      title: 'Low Stock Alerts',
      value: lowStockCount.toString(),
      change: 'Immediate focus needed',
      icon: AlertCircle,
      color: 'bg-amber-600',
    },
  ];

  const recentActivity = [
    { id: 1, action: 'New shipment received', location: 'Warehouse A', time: '5 min ago', status: 'success' },
    { id: 2, action: 'Order #1847 dispatched', location: 'Warehouse B', time: '12 min ago', status: 'success' },
    { id: 3, action: 'Stock adjustment required', location: 'Warehouse C', time: '25 min ago', status: 'warning' },
    { id: 4, action: 'Quality check completed', location: 'Warehouse A', time: '1 hour ago', status: 'success' },
    { id: 5, action: 'Maintenance routine D', location: 'Storage Wing', time: '2 hours ago', status: 'success' }
  ];

  // Process data for charts
  const categoryMap: Record<string, number> = {};
  inventoryData.forEach(item => {
    const cat = item.categoryname || 'Uncategorized';
    categoryMap[cat] = (categoryMap[cat] || 0) + (item.totalitemquantity || 0);
  });
  const pieData = Object.keys(categoryMap).map(key => ({ name: key, value: categoryMap[key] }));
  const pieColors = ['#6366f1', '#3b82f6', '#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6'];

  const barData = [...inventoryData]
    .sort((a, b) => (b.totalitemquantity || 0) - (a.totalitemquantity || 0))
    .slice(0, 5)
    .map(item => ({ name: item.productname?.substring(0, 15) || 'Unknown', Quantity: item.totalitemquantity || 0 }));

  // Group by Expiry Date Month
  const timelineMap: Record<string, number> = {};
  inventoryData.forEach(item => {
    if (item.expdate) {
      const date = new Date(item.expdate);
      // Format as Month Year (e.g., "Jan 2024") manually to handle cross-browser consistency easily
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthYear = `${months[date.getMonth()]} ${date.getFullYear()}`;
      timelineMap[monthYear] = (timelineMap[monthYear] || 0) + (item.totalitemquantity || 0);
    }
  });

  // Create line data
  const lineData = Object.keys(timelineMap)
    .map(key => {
      const [m, y] = key.split(' ');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return {
        name: key,
        Quantity: timelineMap[key],
        timestamp: new Date(parseInt(y), months.indexOf(m), 1).getTime()
      };
    })
    .sort((a, b) => a.timestamp - b.timestamp)
    .map(data => ({ name: data.name, Quantity: data.Quantity }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-12 animate-in fade-in duration-500">
      <div className="p-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          {/* <p className="text-gray-500 mt-1 font-medium">Real-time overview of your warehouse operations</p> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:border-blue-100 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 opacity-5 rounded-full -translate-y-12 translate-x-12 ${stat.color} blur-2xl group-hover:opacity-10 transition-opacity duration-300`}></div>

                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center shadow-md`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-gray-500 text-sm font-semibold mb-1 uppercase tracking-wider">
                  {stat.title}
                </h3>
                <p className="text-2xl font-bold text-gray-900 mb-2 font-mono">{stat.value}</p>
                <p className="text-xs text-gray-400 font-medium bg-gray-50 inline-block px-2 py-1 rounded-md">{stat.change}</p>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Line Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Quantity Scheduled for Expiration</h2>
              <div className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full">Timeline</div>
            </div>
            <div className="h-[340px] w-full mt-4">
              {lineData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineData} margin={{ top: 5, right: 20, bottom: 25, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.6} vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                    <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} dx={-10} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', fontWeight: 'bold', fontSize: '13px', padding: '8px 12px' }}
                      cursor={{ stroke: '#e5e7eb', strokeWidth: 2, strokeDasharray: '3 3' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '25px' }} iconType="circle" />
                    <Line type="monotone" dataKey="Quantity" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 8, strokeWidth: 0, fill: '#4f46e5' }} name="Expiring Quantity" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-400 font-medium">No expiration data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Highest Volume Inventory</h2>
              <div className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">Top 5</div>
            </div>
            <div className="h-[340px] w-full mt-4">
              {barData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 5, right: 20, bottom: 65, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.6} vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} interval={0} angle={-25} textAnchor="end" axisLine={false} tickLine={false} dy={10} dx={-5} />
                    <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} dx={-10} />
                    <Tooltip
                      cursor={{ fill: '#f3f4f6', radius: 4 }}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', fontWeight: 'bold', fontSize: '13px', padding: '8px 12px' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '50px' }} iconType="circle" />
                    <Bar dataKey="Quantity" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Stock Volume" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-400 font-medium">No inventory data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pie Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:col-span-1 hover:shadow-md transition-shadow duration-300">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Distribution by Category</h2>
            <div className="h-[340px] w-full flex items-center justify-center mt-2">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 0, right: 0, bottom: 25, left: 0 }}>
                    <Pie
                      data={pieData}
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={6}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', fontSize: '13px', padding: '8px 12px' }}
                      itemStyle={{ fontWeight: 700 }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '25px' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-400 font-medium">No category data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:col-span-2 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                Real-time System Activity
                <span className="relative flex h-3 w-3 ml-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              </h2>
              <Activity className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="group flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-gray-100/60 hover:bg-blue-50/30 hover:border-blue-100 transition-all duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-2.5 h-2.5 rounded-full ring-4 ${activity.status === 'success' ? 'bg-emerald-500 ring-emerald-50' : 'bg-amber-500 ring-amber-50'
                      }`} />
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-blue-900 transition-colors">{activity.action}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{activity.location}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-gray-500 bg-white border border-gray-200 shadow-sm px-3 py-1.5 rounded-full">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
