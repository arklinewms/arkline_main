import React, { useState } from 'react';
import { Save, X, AlertCircle, CheckCircle } from 'lucide-react';

interface AddProductProps {
    onBack: () => void;
}

export default function AddProduct({ onBack }: AddProductProps) {
    const [formData, setFormData] = useState({
        productname: '',
        materialsku: '',
        categoryname: '',
        status: 'Pending',
        totalitemquantity: 0,
        mfgdate: '',
        expdate: '',
        productdescription: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types in sku field
        if (name === 'materialsku') setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        // Validation: Product Name, SKU, Description are mandatory
        if (!formData.productname.trim()) {
            setError('Product Name is required.');
            setLoading(false);
            return;
        }
        if (!formData.materialsku.trim()) {
            setError('SKU / Material Code is required.');
            setLoading(false);
            return;
        }
        if (!formData.productdescription.trim()) {
            setError('Product Description is required.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/inventory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle duplicate SKU error specifically
                if (data.detail && data.detail.includes('already exists')) {
                    throw new Error(data.detail);
                }
                throw new Error(data.detail || 'Failed to add product');
            }

            setSuccess('Product added successfully!');

            // Redirect after success
            setTimeout(() => {
                onBack(); // Navigate back to inventory list logic or whatever parent decides
            }, 2000);

        } catch (err: any) {
            setError(err.message || 'An error occurred while saving.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-3xl mx-auto space-y-8">

                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
                        <p className="text-gray-500 mt-2">Create a new inventory item in the warehouse.</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
                            <AlertCircle className="w-5 h-5 mr-2" />
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700">
                            <CheckCircle className="w-5 h-5 mr-2" />
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Form state handling matches previous implementation, just context and imports changed */}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Product Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="productname"
                                    value={formData.productname}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g. Amoxicillin 500mg"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">SKU / Material Code <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="materialsku"
                                    value={formData.materialsku}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g. SKU-12345"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <input
                                    type="text"
                                    name="categoryname"
                                    value={formData.categoryname}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g. Antibiotics"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                >
                                    <option>Pending</option>
                                    <option>Shipped</option>
                                    <option>Canceled</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                                <input
                                    type="number"
                                    name="totalitemquantity"
                                    value={formData.totalitemquantity}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="0"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Manufacturing Date</label>
                                <input
                                    type="date"
                                    name="mfgdate"
                                    value={formData.mfgdate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                                <input
                                    type="date"
                                    name="expdate"
                                    value={formData.expdate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Description <span className="text-red-500">*</span></label>
                            <textarea
                                name="productdescription"
                                rows={4}
                                value={formData.productdescription}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Product details..."
                            ></textarea>
                        </div>

                        <div className="pt-4 flex items-center justify-end gap-4">
                            <button
                                type="button"
                                onClick={onBack}
                                className="flex items-center px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                <X className="w-5 h-5 mr-2" />
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <Save className="w-5 h-5 mr-2" />
                                {loading ? 'Saving...' : 'Save Product'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}
