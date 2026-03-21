import { Package, TrendingUp, Users, AlertCircle, ArrowUp, ArrowDown, Activity } from 'lucide-react';

export default function Home() {
  const stats = [
    {
      title: 'Total Inventory',
      value: '24,532',
      change: '+12.5%',
      trend: 'up',
      icon: Package,
      color: 'bg-blue-600',
    },
    {
      title: 'Orders Processed',
      value: '1,847',
      change: '+8.2%',
      trend: 'up',
      icon: TrendingUp,
      color: 'bg-indigo-600',
    },
    {
      title: 'Active Users',
      value: '342',
      change: '-2.4%',
      trend: 'down',
      icon: Users,
      color: 'bg-slate-600',
    },
    {
      title: 'Low Stock Items',
      value: '23',
      change: '+5 items',
      trend: 'down',
      icon: AlertCircle,
      color: 'bg-amber-600',
    },
  ];

  const recentActivity = [
    { id: 1, action: 'New shipment received', location: 'Warehouse A', time: '5 min ago', status: 'success' },
    { id: 2, action: 'Order #1847 dispatched', location: 'Warehouse B', time: '12 min ago', status: 'success' },
    { id: 3, action: 'Stock adjustment required', location: 'Warehouse C', time: '25 min ago', status: 'warning' },
    { id: 4, action: 'Quality check completed', location: 'Warehouse A', time: '1 hour ago', status: 'success' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
WELCOME TO ARKLINE WMS
          </h1>
          <p className="text-gray-600 text-lg">
            Your comprehensive warehouse management solution
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${stat.trend === 'up' ? 'bg-zinc-100 text-black' : 'bg-gray-100 text-gray-500'
                    }`}>
                    {stat.trend === 'up' ? (
                      <ArrowUp className="w-4 h-4" />
                    ) : (
                      <ArrowDown className="w-4 h-4" />
                    )}
                    <span className="text-sm font-semibold">{stat.change}</span>
                  </div>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">
                  {stat.title}
                </h3>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
              <Activity className="w-6 h-6 text-gray-400" />
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-2 h-2 rounded-full ${activity.status === 'success' ? 'bg-black' : 'bg-gray-400'
                      }`} />
                    <div>
                      <p className="font-semibold text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-500">{activity.location}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-900 to-slate-900 rounded-lg shadow-lg p-6 text-white">
            <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-md p-4 text-left transition-all duration-200 border border-white/10">
                <p className="font-semibold text-blue-50">Create New Order</p>
                <p className="text-sm text-blue-200">Start a new warehouse order</p>
              </button>
              <button className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-md p-4 text-left transition-all duration-200 border border-white/10">
                <p className="font-semibold text-blue-50">Add Inventory</p>
                <p className="text-sm text-blue-200">Register new stock items</p>
              </button>
              <button className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-md p-4 text-left transition-all duration-200 border border-white/10">
                <p className="font-semibold text-blue-50">Generate Report</p>
                <p className="text-sm text-blue-200">View analytics and insights</p>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-600">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Warehouse Efficiency</h3>
            <p className="text-3xl font-bold text-blue-900 mb-1">94.5%</p>
            <p className="text-sm text-slate-500">Operating at optimal capacity</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-indigo-600">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Avg. Processing Time</h3>
            <p className="text-3xl font-bold text-indigo-900 mb-1">2.4 hrs</p>
            <p className="text-sm text-slate-500">15% faster than last month</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-emerald-600">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Customer Satisfaction</h3>
            <p className="text-3xl font-bold text-emerald-900 mb-1">4.8/5.0</p>
            <p className="text-sm text-slate-500">Based on 1,234 reviews</p>
          </div>
        </div>
      </div>
    </div>
  );
}
