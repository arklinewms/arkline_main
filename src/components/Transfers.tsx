import React from 'react';
import {
    ArrowLeftRight,
    Truck,
    RefreshCcw,
    AlertOctagon,
    ArrowRightLeft,
    Settings
} from 'lucide-react';

type StepId = 'bin_transfer' | 'warehouse_transfer' | 'replenishment' | 'thresholds';

interface TransfersProps {
    activeTab?: StepId;
}

export default function Transfers({ activeTab = 'bin_transfer' }: TransfersProps) {

    const stepTitles: Record<StepId, string> = {
        bin_transfer: 'Inter-bin Transfer',
        warehouse_transfer: 'Inter-warehouse Transfer',
        replenishment: 'Auto-replenishment Rules',
        thresholds: 'Minimum Stock Thresholds'
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'bin_transfer':
                return (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-900">{stepTitles['bin_transfer']}</h2>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                                <ArrowLeftRight className="w-4 h-4 mr-2" />
                                New Transfer
                            </button>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                <ArrowRightLeft className="w-8 h-8 text-blue-500" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">Move Stock Between Bins</h3>
                            <p className="max-w-md mx-auto mt-2 text-gray-500">Scan source bin, item, and destination bin to move inventory instantly.</p>

                            <div className="mt-6 grid grid-cols-3 gap-4 w-full max-w-lg">
                                <div className="p-4 border rounded-lg bg-gray-50 text-left">
                                    <label className="text-xs text-gray-500 uppercase font-bold">Source</label>
                                    <p className="font-mono text-lg text-gray-400">Scan Bin...</p>
                                </div>
                                <div className="flex items-center justify-center">
                                    <ArrowRightLeft className="w-6 h-6 text-gray-400" />
                                </div>
                                <div className="p-4 border rounded-lg bg-gray-50 text-left">
                                    <label className="text-xs text-gray-500 uppercase font-bold">Destination</label>
                                    <p className="font-mono text-lg text-gray-400">Scan Bin...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'thresholds':
                return (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-900">{stepTitles['thresholds']}</h2>
                            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
                                <Settings className="w-4 h-4 mr-2" />
                                Configure Global Rules
                            </button>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <table className="w-full text-left text-sm text-gray-600">
                                <thead className="bg-gray-50 text-gray-700 uppercase font-semibold text-xs border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4">Product</th>
                                        <th className="px-6 py-4">SKU</th>
                                        <th className="px-6 py-4">Min Level</th>
                                        <th className="px-6 py-4">Max Level</th>
                                        <th className="px-6 py-4">Current Rule</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {[1, 2, 3].map(i => (
                                        <tr key={i} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">Sample Item {i}</td>
                                            <td className="px-6 py-4 font-mono">SKU-00{i}</td>
                                            <td className="px-6 py-4 text-amber-600 font-bold">100</td>
                                            <td className="px-6 py-4">500</td>
                                            <td className="px-6 py-4"><span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">Fixed Qty</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <h2 className="text-xl font-semibold text-gray-900">{stepTitles[activeTab]}</h2>
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200">
                            <RefreshCcw className="w-16 h-16 mb-4 text-gray-300" />
                            <h3 className="text-xl font-medium text-gray-900 mb-2">Module Under Construction</h3>
                            <p className="text-gray-500 max-w-md text-center">
                                The <strong>{activeTab}</strong> workflow is currently being implemented.
                            </p>
                        </div>
                    </div>
                )
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Transfer & Replenishment</h1>
                    <p className="text-gray-500 mt-2">Manage internal movements and automate stock levels.</p>
                </div>
                <div className="w-full">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}
