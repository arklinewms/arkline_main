import React from 'react';
import {
    Grid,
    Maximize,
    Scale,
    Activity,
    Map,
    Box,
    Layers
} from 'lucide-react';

type StepId = 'layout' | 'capacity' | 'limits' | 'zones';

interface StorageProps {
    activeTab?: StepId;
}

export default function Storage({ activeTab = 'layout' }: StorageProps) {

    const stepTitles: Record<StepId, string> = {
        layout: 'Warehouse Layout (Zones, Aisles, Racks, Bins)',
        capacity: 'Capacity Management',
        limits: 'Bin Size & Weight Limits',
        zones: 'Fast-moving vs Slow-moving SKU Zones'
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'layout':
                return (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-900">{stepTitles['layout']}</h2>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Edit Layout</button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm col-span-2">
                                <h3 className="font-medium text-gray-900 mb-4">Visual Map</h3>
                                <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center border-2 border-dashed border-gray-300">
                                    <div className="text-center text-gray-400">
                                        <Map className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                        <p>Interactive Map View</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">Total Zones</h3>
                                    <p className="text-2xl font-bold">5</p>
                                </div>
                                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">Total Aisles</h3>
                                    <p className="text-2xl font-bold">24</p>
                                </div>
                                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">Active Bins</h3>
                                    <p className="text-2xl font-bold">1,420</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'capacity':
                return (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <h2 className="text-xl font-semibold text-gray-900">{stepTitles['capacity']}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            {['Zone A', 'Zone B', 'Zone C', 'Cold Storage'].map(zone => (
                                <div key={zone} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-medium">{zone}</h3>
                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Optimal</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                                    </div>
                                    <p className="text-xs text-gray-500 text-right">70% Full</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <h2 className="text-xl font-semibold text-gray-900">{stepTitles[activeTab]}</h2>
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200">
                            <Box className="w-16 h-16 mb-4 text-gray-300" />
                            <h3 className="text-xl font-medium text-gray-900 mb-2">Module Under Construction</h3>
                            <p className="text-gray-500 max-w-md text-center">
                                The <strong>{activeTab}</strong> configuration view is currently being implemented.
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
                    <h1 className="text-3xl font-bold text-gray-900">Storage Management</h1>
                    <p className="text-gray-500 mt-2">Optimize warehouse layout, bins, and zone performance.</p>
                </div>
                <div className="w-full">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}
