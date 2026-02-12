import React from 'react';
import {
    BarChart3,
    TrendingUp,
    PieChart,
    AlertTriangle,
    Clock,
    Target,
    FileText,
    Activity
} from 'lucide-react';

type ReportId =
    | 'accuracy'
    | 'volume'
    | 'fulfillment'
    | 'aging'
    | 'expiry'
    | 'turnover'
    | 'cycle_time'
    | 'picking_accuracy'
    | 'dead_stock';

interface ReportsProps {
    activeTab?: ReportId;
}

export default function Reports({ activeTab = 'accuracy' }: ReportsProps) {

    const reportTitles: Record<ReportId, string> = {
        accuracy: 'Inventory Accuracy',
        volume: 'Inbound / Outbound Volume',
        fulfillment: 'Order Fulfillment Rate',
        aging: 'Stock Aging Report',
        expiry: 'Expiry Alerts',
        turnover: 'Inventory Turnover',
        cycle_time: 'Order Cycle Time',
        picking_accuracy: 'Picking Accuracy',
        dead_stock: 'Dead Stock Analysis'
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'accuracy':
                return (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <h3 className="text-gray-500 text-sm font-medium">System Count</h3>
                                <p className="text-3xl font-bold mt-2">15,420</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <h3 className="text-gray-500 text-sm font-medium">Physical Count</h3>
                                <p className="text-3xl font-bold mt-2">15,380</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <h3 className="text-gray-500 text-sm font-medium">Accuracy Rate</h3>
                                <p className="text-3xl font-bold mt-2 text-green-600">99.74%</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-200">
                            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 text-gray-400">
                                <BarChart3 className="w-12 h-12 mb-2" />
                                <span className="ml-2">Select a date range to view accuracy trends</span>
                            </div>
                        </div>
                    </div>
                );

            case 'volume':
                return (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">{reportTitles['volume']}</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-xl border border-gray-200">
                                <h3 className="font-medium mb-4 flex items-center"><Activity className="w-4 h-4 mr-2 text-blue-500" /> Inbound Volume</h3>
                                {/* Placeholder Chart */}
                                <div className="space-y-2">
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
                                        <div key={day} className="flex items-center">
                                            <span className="w-10 text-xs text-gray-500">{day}</span>
                                            <div className="flex-1 bg-gray-100 rounded-full h-2">
                                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.random() * 80 + 10}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-gray-200">
                                <h3 className="font-medium mb-4 flex items-center"><Activity className="w-4 h-4 mr-2 text-green-500" /> Outbound Volume</h3>
                                {/* Placeholder Chart */}
                                <div className="space-y-2">
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
                                        <div key={day} className="flex items-center">
                                            <span className="w-10 text-xs text-gray-500">{day}</span>
                                            <div className="flex-1 bg-gray-100 rounded-full h-2">
                                                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.random() * 80 + 10}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <h2 className="text-xl font-semibold text-gray-900">{reportTitles[activeTab]}</h2>
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200">
                            <FileText className="w-16 h-16 mb-4 text-gray-300" />
                            <h3 className="text-xl font-medium text-gray-900 mb-2">Report Generation</h3>
                            <p className="text-gray-500 max-w-md text-center">
                                Select parameters to generate the <strong>{reportTitles[activeTab]}</strong>.
                            </p>
                            <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                Generate Report
                            </button>
                        </div>
                    </div>
                )
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboards & Reports</h1>
                    <p className="text-gray-500 mt-2">Operational insights and management KPIs.</p>
                </div>
                <div className="w-full">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}
