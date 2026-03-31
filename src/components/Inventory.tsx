import { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    Download,
    Package,
    AlertTriangle,
    DollarSign,
    Truck,
    ChevronLeft,
    ChevronRight,
    Edit2,
    Trash2,
    RefreshCw,
    AlertCircle
} from 'lucide-react';

interface WarehouseData {
    id: number;
    materialsku: string;
    mfgdate: string;
    expdate: string;
    categoryname: string;
    productname: string;
    productdescription: string;
    status: string;
    totalitemquantity: number;
}

interface InventoryProps {
    view?: string;
}

export default function Inventory({ view = 'all' }: InventoryProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField, setSearchField] = useState('all');
    const [items, setItems] = useState<WarehouseData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [editingItem, setEditingItem] = useState<WarehouseData | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 50;

    useEffect(() => {
        const fetchInventory = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const API_URL = import.meta.env.VITE_API_URL;
                const response = await fetch(`${API_URL}/api/inventory`, {
                    headers: { 'ngrok-skip-browser-warning': 'true' }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch inventory data');
                }
                const data = await response.json();
                setItems(data);
            } catch (err) {
                console.error('Error fetching inventory:', err);
                setError('Failed to connect to the inventory server. Please ensure the API is running.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchInventory();
    }, []);

    // Reset to first page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const getStatusColor = (status: string) => {
        const lowerStatus = status?.toLowerCase() || '';
        if (lowerStatus.includes('active') || lowerStatus.includes('stock')) return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
        if (lowerStatus.includes('low')) return 'bg-amber-50 text-amber-700 border border-amber-200';
        if (lowerStatus.includes('out') || lowerStatus.includes('inactive')) return 'bg-slate-100 text-slate-500 border border-slate-200';
        return 'bg-slate-50 text-slate-600 border border-slate-200';
    };

    // If view is NOT the main list, show a placeholder for now
    if (view !== 'all' && view !== 'add') {
        const titles: Record<string, string> = {
            availability: 'Available vs Reserved Stock',
            locations: 'Bin / Location Management',
            master: 'SKU & Material Master',
            category: 'Category-wise Stock',
            movement: 'FIFO / FEFO / LIFO Tracking',
            counting: 'Cycle Counting & Reconciliation',
            aging: 'Stock Aging Reports'
        };

        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">{titles[view] || 'Inventory Module'}</h1>
                    <div className="bg-white rounded-xl border border-gray-200 p-12 flex flex-col items-center justify-center text-center">
                        <Package className="w-16 h-16 text-white mb-4 p-4 bg-black rounded-full" />
                        <h3 className="text-xl font-medium text-gray-900">Module Under Construction</h3>
                        <p className="text-gray-500 mt-2 max-w-md">
                            The <strong>{titles[view] || view}</strong> module is currently being implemented. Check back soon for updates.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // --- STANDARD INVENTORY TABLE VIEW ---

    let stats = [
        { title: 'Total Products', value: items.length.toString(), icon: Package, color: 'bg-blue-600' },
        { title: 'Total Quantity', value: items.reduce((acc, curr) => acc + curr.totalitemquantity, 0).toLocaleString(), icon: AlertTriangle, color: 'bg-slate-600' },
        { title: 'Categories', value: new Set(items.map(i => i.categoryname)).size.toString(), icon: DollarSign, color: 'bg-emerald-600' },
        { title: 'Active Vendors', value: '45', icon: Truck, color: 'bg-indigo-600' },
    ];

    const filteredItems = items.filter(item => {
        const matchesProduct = (item.productname || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSku = (item.materialsku || '').toLowerCase().includes(searchTerm.toLowerCase());

        if (searchField === 'product') return matchesProduct;
        if (searchField === 'sku') return matchesSku;

        return matchesProduct || matchesSku;
    });

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };



    const handleExport = (type: 'current' | 'all') => {
        const dataToExport = type === 'current' ? currentItems : filteredItems;

        if (dataToExport.length === 0) {
            alert('No data to export');
            return;
        }

        // Define headers
        const headers = ['Product Name', 'SKU', 'Category', 'Quantity', 'Mfg Date', 'Exp Date', 'Status'];

        // Convert data to CSV rows
        const csvContent = [
            headers.join(','),
            ...dataToExport.map(item => [
                `"${item.productname.replace(/"/g, '""')}"`,
                `"${item.materialsku}"`,
                `"${item.categoryname}"`,
                item.totalitemquantity,
                item.mfgdate || '',
                item.expdate || '',
                item.status
            ].join(','))
        ].join('\n');

        // created blob and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `inventory_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setShowExportMenu(false);
    };

    // --- DELETE ACTION ---
    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            const API_URL = import.meta.env.VITE_API_URL;
            const response = await fetch(`${API_URL}/api/inventory/${id}`, {
                method: 'DELETE',
                headers: { 'ngrok-skip-browser-warning': 'true' }
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || 'Failed to delete product');
            }

            // Remove from local state
            setItems(prev => prev.filter(item => item.id !== id));
        } catch (err: any) {
            alert(err.message || 'Error deleting product');
        }
    };

    // --- EDIT / MODIFY ACTION ---


    const handleEditClick = (item: WarehouseData) => {
        setEditingItem({ ...item }); // Clone item to avoid direct mutation
        setIsEditModalOpen(true);
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        if (!editingItem) return;
        const { name, value } = e.target;
        setEditingItem(prev => prev ? { ...prev, [name]: name === 'totalitemquantity' ? parseInt(value) || 0 : value } : null);
    };



    const handleEditSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingItem) return;

        // Validation
        if (!editingItem.productname.trim() || !editingItem.materialsku.trim()) {
            alert("Product Name and SKU are required.");
            return;
        }

        try {
            const API_URL = import.meta.env.VITE_API_URL;
            const response = await fetch(`${API_URL}/api/inventory/${editingItem.id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify(editingItem)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || 'Failed to update product');
            }

            const updatedItem = await response.json();

            // Update local state is tricky because response structure might differ slightly,
            // but assuming backend returns { status: "success", data: ... } or just the item.
            // Based on backend implementation: returns result dict.
            // result["data"] has the fields.

            const newData = updatedItem.data || editingItem;

            setItems(prev => prev.map(item => item.id === newData.id ? { ...item, ...newData } : item));
            setIsEditModalOpen(false);
            setEditingItem(null);

        } catch (err: any) {
            alert(err.message || 'Error updating product');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-6">
            {/* EDIT MODAL */}
            {isEditModalOpen && editingItem && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">Edit Product</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <span className="sr-only">Close</span>
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleEditSave} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                    <input type="text" name="productname" value={editingItem.productname} onChange={handleEditChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                                    <input type="text" name="materialsku" value={editingItem.materialsku} onChange={handleEditChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <input type="text" name="categoryname" value={editingItem.categoryname} onChange={handleEditChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                    <input type="number" name="totalitemquantity" value={editingItem.totalitemquantity} onChange={handleEditChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select name="status" value={editingItem.status} onChange={handleEditChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                                        <option>Pending</option>
                                        <option>Shipped</option>
                                        <option>Canceled</option>
                                        <option>In Stock</option>
                                        <option>Low Stock</option>
                                        <option>Out of Stock</option>
                                        <option>Inactive</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mfg Date</label>
                                    <input type="date" name="mfgdate" value={editingItem.mfgdate || ''} onChange={handleEditChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Exp Date</label>
                                    <input type="date" name="expdate" value={editingItem.expdate || ''} onChange={handleEditChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea name="productdescription" value={editingItem.productdescription || ''} onChange={handleEditChange} rows={3} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <div className="max-w-[1920px] mx-auto space-y-6">

                {/* Header and Stats */}
                <div className="flex flex-col space-y-6">
                    <div className="flex justify-between items-end">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Inventory Management</h1>
                            <p className="text-slate-500 text-sm">
                                Manage your stock, track levels, and organize products.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-white rounded border border-slate-200 p-4 flex items-center space-x-4 shadow-sm hover:shadow-md transition-shadow">
                                <div className={`${stat.color.replace('bg-', 'bg-opacity-10 text-')} p-3 rounded bg-blue-50 text-blue-700`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.title}</p>
                                    <h3 className="text-xl font-bold text-slate-900 font-mono mt-0.5">{stat.value}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded shadow-sm border border-slate-200 flex flex-col">

                    {/* Toolbar */}
                    {/* Toolbar */}
                    <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
                        <div className="flex items-center gap-3 flex-1">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className="w-full pl-9 pr-4 py-1.5 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="relative min-w-[200px]">
                                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                <select
                                    className="w-full pl-9 pr-8 py-1.5 text-sm font-medium text-slate-700 bg-white rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer hover:bg-slate-50 relative z-10"
                                    value={searchField}
                                    onChange={(e) => setSearchField(e.target.value)}
                                >
                                    <option value="all">Filter: All Fields</option>
                                    <option value="sku">Filter: SKU Only</option>
                                    <option value="product">Filter: Product Name</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-400 z-20">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <button
                                    onClick={() => setShowExportMenu(!showExportMenu)}
                                    className="flex items-center px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Export
                                </button>
                                {showExportMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-slate-200 z-10">
                                        <div className="py-1">
                                            <button
                                                onClick={() => handleExport('current')}
                                                className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                                            >
                                                Export Current Page
                                            </button>
                                            <button
                                                onClick={() => handleExport('all')}
                                                className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                                            >
                                                Export All Results
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {/* <button className="flex items-center px-3 py-1.5 text-sm font-medium bg-blue-700 text-white rounded hover:bg-blue-800 transition-colors shadow-sm">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Product
                            </button> */}
                        </div>
                    </div>

                    {/* Table Content */}
                    <div className="overflow-x-auto min-h-[400px]">
                        {error ? (
                            <div className="flex flex-col items-center justify-center h-64 text-amber-600">
                                <AlertCircle className="w-12 h-12 mb-4" />
                                <p className="text-lg font-medium">{error}</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="mt-4 px-4 py-2 bg-amber-100 hover:bg-amber-200 rounded-lg text-amber-800 transition-colors"
                                >
                                    Retry Connection
                                </button>
                            </div>
                        ) : isLoading ? (
                            <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
                                <RefreshCw className="w-12 h-12 animate-spin mb-4" />
                                <p className="text-gray-500">Loading inventory data...</p>
                            </div>
                        ) : items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                                <Package className="w-12 h-12 mb-4" />
                                <p className="text-lg">No inventory items found.</p>
                            </div>
                        ) : (
                            <table className="w-full text-left text-sm text-slate-600">
                                <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-xs border-b border-slate-200">
                                    <tr>
                                        <th className="px-4 py-3 border-r border-slate-200 last:border-r-0">Product Name</th>
                                        <th className="px-4 py-3 border-r border-slate-200 last:border-r-0">SKU</th>
                                        <th className="px-4 py-3 border-r border-slate-200 last:border-r-0">Category</th>
                                        <th className="px-4 py-3 border-r border-slate-200 last:border-r-0 text-right">Quantity</th>
                                        <th className="px-4 py-3 border-r border-slate-200 last:border-r-0">Mfg Date</th>
                                        <th className="px-4 py-3 border-r border-slate-200 last:border-r-0">Exp Date</th>
                                        <th className="px-4 py-3 border-r border-slate-200 last:border-r-0">Status</th>
                                        <th className="px-4 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {currentItems.map((item) => (
                                        <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                                            <td className="px-4 py-2 border-r border-slate-100 last:border-r-0">
                                                <div className="flex items-center space-x-3">
                                                    <div>
                                                        <span className="font-semibold text-slate-900 block">{item.productname}</span>
                                                        <span className="text-xs text-slate-500 truncate max-w-[150px] block">{item.productdescription}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-2 font-mono text-xs text-slate-600 border-r border-slate-100 last:border-r-0">{item.materialsku}</td>
                                            <td className="px-4 py-2 border-r border-slate-100 last:border-r-0 text-slate-700">{item.categoryname}</td>
                                            <td className="px-4 py-2 font-mono font-medium text-slate-900 text-right border-r border-slate-100 last:border-r-0">{item.totalitemquantity}</td>
                                            <td className="px-4 py-2 text-slate-500 text-xs font-mono border-r border-slate-100 last:border-r-0">{item.mfgdate}</td>
                                            <td className="px-4 py-2 text-slate-500 text-xs font-mono border-r border-slate-100 last:border-r-0">{item.expdate}</td>
                                            <td className="px-4 py-2 border-r border-slate-100 last:border-r-0">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${getStatusColor(item.status)}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 text-right">
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleEditClick(item)}
                                                        className="p-1.5 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                                                        title="Edit Product"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                                        title="Delete Product"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )
                        }
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
                        <span className="text-sm text-gray-500">
                            Showing <span className="font-medium text-gray-900">{items.length > 0 ? 1 : 0}</span> to <span className="font-medium text-gray-900">{items.length}</span> of <span className="font-medium text-gray-900">{items.length}</span> results
                        </span>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                aria-label="Previous Page"
                            >
                                <ChevronLeft className="w-4 h-4 text-gray-600" />
                            </button>
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                aria-label="Next Page"
                            >
                                <ChevronRight className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>
                    </div >

                </div >
            </div >
        </div >
    );
}
