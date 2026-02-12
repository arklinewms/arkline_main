import React, { useState } from 'react';
import {
    FileText,
    Truck,
    Scan,
    CheckCircle,
    Box,
    Layers,
    Calendar,
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    ArrowRight,
    AlertTriangle,
    Clock,
    MapPin
} from 'lucide-react';

type StepId = 'asn' | 'grn' | 'scanning' | 'qc' | 'putaway' | 'batch' | 'dates';

interface InboundProps {
    activeTab?: StepId;
}

export default function Inbound({ activeTab = 'asn' }: InboundProps) {

    const stepTitles: Record<StepId, string> = {
        asn: 'Advance Shipping Notices (ASN)',
        grn: 'Goods Receipt Note (GRN)',
        scanning: 'Barcode & QR Scanning',
        qc: 'Quality Check',
        putaway: 'Put-away Rules',
        batch: 'Batch & Lot Tracking',
        dates: 'MFG & EXP Date Handling'
    };

    // --- Mock Data ---
    const mockASNs = [
        { id: 'ASN-2024-001', vendor: 'Global Supplies Inc.', status: 'In Transit', date: '2024-03-20', items: 450, type: 'Standard' },
        { id: 'ASN-2024-002', vendor: 'Tech Components Ltd.', status: 'Scheduled', date: '2024-03-22', items: 120, type: 'Express' },
        { id: 'ASN-2024-003', vendor: 'Raw Materials Co.', status: 'Arrived', date: '2024-03-19', items: 1200, type: 'Bulk' },
    ];

    const mockQCQueue = [
        { id: 'QC-101', sku: 'ELEC-WZ-001', name: 'Wireless Controller', qty: 50, batch: 'B-2901', status: 'Pending' },
        { id: 'QC-102', sku: 'MECH-GR-88', name: 'Gearbox Assembly', qty: 12, batch: 'B-2902', status: 'In Progress' },
    ];

    const mockPutaway = [
        { id: 'PA-554', sku: 'ELEC-WZ-001', name: 'Wireless Controller', qty: 50, suggestedBin: 'A-01-04', travelPath: 'Zone A > Aisle 1' },
        { id: 'PA-555', sku: 'CHEM-SOL-99', name: 'Indust. Solvent', qty: 200, suggestedBin: 'HZ-02-01', travelPath: 'Hazmat Zone > Rack 2' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'asn':
                return (
                    <div className="space-y-4 animate-in fade-in duration-300">
                        {/* Toolbar */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                            <div className="flex items-center space-x-2 w-full sm:w-auto">
                                <div className="relative flex-1 sm:w-64">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search ASNs..."
                                        className="w-full pl-9 pr-4 py-1.5 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    />
                                </div>
                                <button className="p-1.5 text-slate-600 hover:bg-slate-100 rounded border border-slate-200">
                                    <Filter className="w-4 h-4" />
                                </button>
                            </div>
                            <button className="flex items-center px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors shadow-sm">
                                <Plus className="w-4 h-4 mr-2" />
                                Create ASN
                            </button>
                        </div>

                        {/* Table */}
                        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                                    <tr>
                                        <th className="px-4 py-3">ASN Number</th>
                                        <th className="px-4 py-3">Vendor</th>
                                        <th className="px-4 py-3">Type</th>
                                        <th className="px-4 py-3">Expected Date</th>
                                        <th className="px-4 py-3">Items</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 text-slate-700">
                                    {mockASNs.map((asn) => (
                                        <tr key={asn.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-3 font-mono font-medium text-blue-600">{asn.id}</td>
                                            <td className="px-4 py-3">{asn.vendor}</td>
                                            <td className="px-4 py-3">{asn.type}</td>
                                            <td className="px-4 py-3 font-mono">{asn.date}</td>
                                            <td className="px-4 py-3 font-mono">{asn.items}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${asn.status === 'Arrived' ? 'bg-green-50 text-green-700 border-green-200' :
                                                        asn.status === 'In Transit' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                            'bg-slate-100 text-slate-600 border-slate-200'
                                                    }`}>
                                                    {asn.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <button className="text-slate-400 hover:text-blue-600">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'grn':
                return (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Panel: Selection */}
                            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 flex items-center mb-4">
                                        <Truck className="w-5 h-5 mr-2 text-blue-600" />
                                        Inbound Receipt
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Select ASN or PO</label>
                                            <div className="relative">
                                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="text"
                                                    placeholder="Scan or type ID..."
                                                    className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Dock Door</label>
                                            <select className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none">
                                                <option>Dock A-01</option>
                                                <option>Dock A-02</option>
                                                <option>Dock B-01</option>
                                            </select>
                                        </div>
                                        <button className="w-full py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-colors">
                                            Start Offloading
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Right Panel: Pending Receipts Placeholder */}
                            <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 shadow-sm p-6 flex flex-col items-center justify-center text-slate-500 min-h-[300px]">
                                <FileText className="w-16 h-16 mb-4 text-slate-200" />
                                <h4 className="text-lg font-medium text-slate-900">No Active Receipt</h4>
                                <p className="text-sm mt-1">Select an ASN or Purchase Order to begin receiving items.</p>
                            </div>
                        </div>
                    </div>
                );
            case 'scanning':
                return (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-slate-900 rounded-xl p-8 flex flex-col items-center justify-center text-white min-h-[400px] shadow-lg relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-pulse"></div>
                                <Scan className="w-24 h-24 mb-6 opacity-80" />
                                <h3 className="text-2xl font-mono font-bold tracking-wider mb-2">SCANNER ACTIVE</h3>
                                <p className="text-slate-400 mb-8">Waiting for input...</p>
                                <div className="w-full max-w-sm bg-slate-800 rounded-lg p-4 border border-slate-700">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                        <span className="font-mono text-sm text-slate-300">Device: ZEBRA-MC9300-01</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                                <h3 className="font-semibold text-lg text-slate-900 mb-6 flex items-center">
                                    <Layers className="w-5 h-5 mr-2 text-slate-500" />
                                    Manual Entry
                                </h3>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Barcode / SKU / LPN</label>
                                        <input type="text" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-slate-900" placeholder="Scan or type..." />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                                        <input type="number" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-slate-900" placeholder="0" />
                                    </div>
                                    <div className="pt-4">
                                        <button className="w-full py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium shadow transition-all active:scale-[0.98]">
                                            Process Item
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'qc':
                return (
                    <div className="space-y-4 animate-in fade-in duration-300">
                        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 flex justify-between items-center">
                            <div className="flex items-center space-x-2 text-slate-600">
                                <CheckCircle className="w-5 h-5 text-blue-600" />
                                <span className="font-medium text-slate-900">Quality Control Queue</span>
                                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold">2 Pending</span>
                            </div>
                            <div className="flex space-x-2">
                                <button className="px-3 py-1.5 text-sm border border-slate-200 rounded hover:bg-slate-50 text-slate-600">History</button>
                                <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 shadow-sm">Start Inspection</button>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                                    <tr>
                                        <th className="px-4 py-3">QC ID</th>
                                        <th className="px-4 py-3">SKU</th>
                                        <th className="px-4 py-3">Product Name</th>
                                        <th className="px-4 py-3">Batch</th>
                                        <th className="px-4 py-3">Qty</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 text-slate-700">
                                    {mockQCQueue.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-3 font-mono text-slate-500">{item.id}</td>
                                            <td className="px-4 py-3 font-mono font-medium">{item.sku}</td>
                                            <td className="px-4 py-3">{item.name}</td>
                                            <td className="px-4 py-3 font-mono text-xs">{item.batch}</td>
                                            <td className="px-4 py-3 font-mono">{item.qty}</td>
                                            <td className="px-4 py-3">
                                                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{item.status}</span>
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right space-x-2">
                                                <button className="text-xs px-2 py-1 bg-green-50 text-green-700 border border-green-200 rounded hover:bg-green-100">Pass</button>
                                                <button className="text-xs px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded hover:bg-red-100">Fail</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'putaway':
                return (
                    <div className="space-y-4 animate-in fade-in duration-300">
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start space-x-3">
                            <Box className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-semibold text-blue-900">Optimization Active</h4>
                                <p className="text-sm text-blue-700 mt-1">Put-away algorithm is prioritizing efficiency based on Zone A congestion levels.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {mockPutaway.map((task) => (
                                <div key={task.id} className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 hover:border-blue-300 transition-colors relative group">
                                    <div className="absolute top-4 right-4 text-xs font-mono text-slate-400">{task.id}</div>
                                    <h4 className="font-semibold text-slate-900 mb-1">{task.name}</h4>
                                    <div className="text-xs text-slate-500 font-mono mb-4">{task.sku} • Qty: {task.qty}</div>

                                    <div className="bg-slate-50 rounded p-3 border border-slate-100 mb-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Suggested Bin</span>
                                            <MapPin className="w-4 h-4 text-blue-500" />
                                        </div>
                                        <div className="text-lg font-mono font-bold text-slate-800">{task.suggestedBin}</div>
                                        <div className="text-xs text-slate-500 mt-1 flex items-center">
                                            <ArrowRight className="w-3 h-3 mr-1" />
                                            {task.travelPath}
                                        </div>
                                    </div>

                                    <button className="w-full py-1.5 bg-slate-900 text-white text-sm rounded hover:bg-slate-800 transition-colors opacity-90 group-hover:opacity-100">
                                        Confirm Put-away
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'batch':
                return (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                                <Layers className="w-5 h-5 mr-2 text-slate-500" />
                                Batch & Lot Management
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Product SKU</label>
                                    <div className="flex space-x-2">
                                        <input type="text" className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none" placeholder="Search SKU..." />
                                        <button className="px-3 py-2 bg-slate-100 border border-slate-200 rounded text-slate-600 hover:bg-slate-200">
                                            <Search className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">New Batch Number</label>
                                    <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none font-mono" placeholder="Auto-generate or type..." />
                                </div>
                            </div>

                            <div className="mt-6 border-t border-slate-100 pt-6">
                                <h4 className="text-sm font-semibold text-slate-900 mb-3">Recent Batches</h4>
                                <div className="space-y-2">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded border border-slate-200 text-sm">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                <span className="font-mono text-slate-700">BATCH-2024-X{i}9</span>
                                                <span className="text-slate-400">|</span>
                                                <span className="text-slate-600">Created just now</span>
                                            </div>
                                            <button className="text-blue-600 hover:underline">Print Labels</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'dates':
                return (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 text-center">
                            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-900">Date Handling & Expiry Rules</h3>
                            <p className="text-slate-500 text-sm max-w-lg mx-auto mt-2">
                                Configure Minimum Shelf Life (MSL) rules and FIFO/FEFO logic for inbound items.
                            </p>
                            <div className="mt-8 flex justify-center space-x-4">
                                <button className="px-4 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 text-sm font-medium">View Expiry Alerts</button>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium">Configure Rules</button>
                            </div>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
                        <p className="text-center text-slate-500">Unknown Module Step</p>
                    </div>
                )
        }
    };

    return (
        <div className="bg-slate-50/50 p-6 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Inbound Operations</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage incoming shipments, receipts, quality control, and put-away.</p>
                </div>

                <div className="bg-white border-b border-slate-200 sticky top-0 z-10 -mx-6 px-6">
                    <div className="flex space-x-1 overflow-x-auto no-scrollbar">
                        {Object.entries(stepTitles).map(([key, title]) => {
                            const isActive = activeTab === key;
                            return (
                                <div
                                    key={key}
                                    className={`
                                        whitespace-nowrap px-4 py-3 text-sm font-medium border-b-2 cursor-default transition-colors
                                        ${isActive ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'}
                                    `}
                                >
                                    {title}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="w-full">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}
