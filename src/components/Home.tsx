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


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">
                  {stat.title}
                </h3>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            );
          })}
        </div>

        <div className="max-w-xl">
          <div className="bg-white rounded-2xl shadow-lg p-6">
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
                    <div className={`wo-2 h-2 rounded-full ${activity.status === 'success' ? 'bg-black' : 'bg-gray-400'
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
        </div>

      </div>
    </div>
  );
}
