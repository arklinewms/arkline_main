import React from 'react';
import {
    ClipboardCheck,
    ListChecks,
    Box,
    Truck,
    CheckSquare,
    Scan,
    Users,
    Send,
    ArrowRight
} from 'lucide-react';

type StepId = 'picking' | 'picklist' | 'packing' | 'shipment' | 'dispatch' | 'validation' | 'allocation';

interface OutboundProps {
    activeTab?: StepId;
}

export default function Outbound({ activeTab = 'picking' }: OutboundProps) {

    const stepTitles: Record<StepId, string> = {
        picking: 'Order Picking (Single, Batch, Wave)',
        picklist: 'Pick List Generation',
        packing: 'Packing & Packing List',
        shipment: 'Shipment Creation',
        dispatch: 'Dispatch Confirmation',
        validation: 'Barcode Validation',
        allocation: 'Customer / Store Allocation'
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'picking':
                return (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-900">{stepTitles['picking']}</h2>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 text-sm bg-white border border-slate-300 rounded hover:bg-slate-50 text-slate-700">Single Pick</button>
                                <button className="px-4 py-2 text-sm bg-white border border-slate-300 rounded hover:bg-slate-50 text-slate-700">Batch Pick</button>
                                <button className="px-4 py-2 text-sm bg-blue-700 text-white rounded hover:bg-blue-800 shadow-sm">Wave Pick</button>
                            </div>
                        </div>
                        <div className="bg-white rounded border border-slate-200 p-8 flex flex-col items-center justify-center text-center shadow-sm">
                            <ClipboardCheck className="w-16 h-16 text-blue-600 mb-4 p-4 bg-blue-50 rounded-full" />
                            <h3 className="text-lg font-medium text-slate-900">No Active Pick Waves</h3>
                            <p className="max-w-md mx-auto mt-2 text-slate-500">Create a new pick wave to start assigning orders to pickers.</p>
                            <button className="mt-6 px-6 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 shadow-sm">Create Pick Wave</button>
                        </div>
                    </div>
                );

            case 'packing':
                return (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <h2 className="text-xl font-semibold text-gray-900">{stepTitles['packing']}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded border border-slate-200 p-6 shadow-sm">
                                <h3 className="font-semibold mb-4 flex items-center text-slate-900"><Box className="w-5 h-5 mr-2 text-blue-700" /> Ready to Pack</h3>
                                <div className="space-y-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                            <div>
                                                <p className="font-medium">Order #ORD-2024-00{i}</p>
                                                <p className="text-xs text-gray-500">5 items • Zone A</p>
                                            </div>
                                            <button className="px-3 py-1 text-sm bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-50 hover:text-blue-700 hover:border-blue-300 transition-colors">Pack</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 flex flex-col items-center justify-center text-gray-500 border-dashed">
                                <Scan className="w-12 h-12 mb-3 opacity-50" />
                                <p>Scan Pick Bin to Start Packing</p>
                            </div>
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <h2 className="text-xl font-semibold text-gray-900">{stepTitles[activeTab]}</h2>
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200">
                            <Send className="w-16 h-16 mb-4 text-gray-300" />
                            <h3 className="text-xl font-medium text-gray-900 mb-2">Module Under Construction</h3>
                            <p className="text-gray-500 max-w-md text-center">
                                The <strong>{activeTab}</strong> module is currently being built.
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
                    <h1 className="text-3xl font-bold text-gray-900">Outbound Operations</h1>
                    <p className="text-gray-500 mt-2">Manage picking, packing, and shipment dispatch.</p>
                </div>
                <div className="w-full">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}
