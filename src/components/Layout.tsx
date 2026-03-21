import { useState } from 'react';
import {
  Menu,
  X,
  Home,
  Package,
  Truck,
  BarChart3,
  ChevronDown,
  ChevronRight,
  FileText,
  Scan,
  CheckCircle,
  Box,
  Layers,
  Calendar,
  Plus,
  ClipboardList,
  PieChart,
  MapPin,
  Database,
  Tags,
  History,
  RefreshCw,
  Clock,
  Send,
  ClipboardCheck,
  ListChecks,
  ArrowUpRight,
  UserCheck,
  Grid,
  Maximize,
  Scale,
  Activity,
  Warehouse,
  ArrowLeftRight,
  RefreshCcw,
  AlertOctagon,
  TrendingUp,
  AlertTriangle,
  Target,
  Search,
  Bell,
  HelpCircle
} from 'lucide-react';
import Chatbot from './Chatbot';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

interface MenuItem {
  id: string;
  name: string;
  icon: any;
  path?: string;
  subItems?: MenuItem[];
}

export default function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['inbound']);

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev =>
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const menuItems: MenuItem[] = [
    { id: 'home', name: 'Home', icon: Home, path: '/' },
    {
      id: 'inventory',
      name: 'Inventory',
      icon: Package,
      subItems: [
        { id: 'inventory_all', name: 'All Products', icon: Package },
        { id: 'inventory_add', name: 'Add Product', icon: Plus },
        { id: 'inventory_onhand', name: 'Stock on hand', icon: ClipboardList },
        { id: 'inventory_availability', name: 'Available vs Reserved', icon: PieChart },
        { id: 'inventory_locations', name: 'Bin / Location', icon: MapPin },
        { id: 'inventory_master', name: 'SKU Master', icon: Database },
        { id: 'inventory_category', name: 'Category Stock', icon: Tags },
        { id: 'inventory_movement', name: 'FIFO / FEFO', icon: Clock },
        { id: 'inventory_counting', name: 'Cycle Counting', icon: RefreshCw },
        { id: 'inventory_aging', name: 'Stock Aging', icon: History },
      ]
    },
    {
      id: 'inbound',
      name: 'Inbound',
      icon: Truck,
      subItems: [
        { id: 'inbound_asn', name: 'ASN', icon: FileText },
        { id: 'inbound_grn', name: 'Goods Receipt', icon: Truck },
        { id: 'inbound_scanning', name: 'Scanning', icon: Scan },
        { id: 'inbound_qc', name: 'Quality Check', icon: CheckCircle },
        { id: 'inbound_putaway', name: 'Put-away', icon: Box },
        { id: 'inbound_batch', name: 'Batch / Lot', icon: Layers },
        { id: 'inbound_dates', name: 'Dates', icon: Calendar },
      ]
    },
    {
      id: 'outbound',
      name: 'Outbound',
      icon: Send,
      subItems: [
        { id: 'outbound_picking', name: 'Order Picking', icon: ClipboardCheck },
        { id: 'outbound_picklist', name: 'Pick List Gen', icon: ListChecks },
        { id: 'outbound_packing', name: 'Packing', icon: Box },
        { id: 'outbound_shipment', name: 'Shipment Creation', icon: Truck },
        { id: 'outbound_dispatch', name: 'Dispatch Confirm', icon: ArrowUpRight },
        { id: 'outbound_validation', name: 'Barcode Valid.', icon: Scan },
        { id: 'outbound_allocation', name: 'Cust Allocation', icon: UserCheck },
      ]
    },
    {
      id: 'storage',
      name: 'Storage',
      icon: Warehouse,
      subItems: [
        { id: 'storage_layout', name: 'Layout', icon: Grid },
        { id: 'storage_capacity', name: 'Capacity', icon: Maximize },
        { id: 'storage_limits', name: 'Bin Limits', icon: Scale },
        { id: 'storage_zones', name: 'Zones', icon: Activity },
      ]
    },
    {
      id: 'transfers',
      name: 'Transfers',
      icon: ArrowLeftRight,
      subItems: [
        { id: 'transfers_bin', name: 'Bin Transfer', icon: ArrowLeftRight },
        { id: 'transfers_warehouse', name: 'Warehouse Transfer', icon: Truck },
        { id: 'transfers_replenish', name: 'Auto-Replenish', icon: RefreshCcw },
        { id: 'transfers_thresholds', name: 'Min Thresholds', icon: AlertOctagon },
      ]
    },
    {
      id: 'reports',
      name: 'Reports',
      icon: BarChart3,
      subItems: [
        { id: 'reports_accuracy', name: 'Inventory Accuracy', icon: Target },
        { id: 'reports_volume', name: 'In/Out Volume', icon: TrendingUp },
        { id: 'reports_fulfillment', name: 'Fulfillment Rate', icon: FileText },
        { id: 'reports_aging', name: 'Stock Aging', icon: Clock },
        { id: 'reports_expiry', name: 'Expiry Alerts', icon: AlertTriangle },
        { id: 'reports_turnover', name: 'Inventory Turnover', icon: PieChart },
        { id: 'reports_cycle_time', name: 'Order Cycle Time', icon: Clock },
        { id: 'reports_picking_accuracy', name: 'Picking Accuracy', icon: Target },
        { id: 'reports_dead_stock', name: 'Dead Stock', icon: AlertTriangle },
      ]
    },
  ];

  const getBreadcrumbs = () => {
    const path = currentPage.split('_');
    const main = menuItems.find(m => m.id === path[0])?.name || 'Home';
    const sub = path.length > 1
      ? menuItems.find(m => m.id === path[0])?.subItems?.find(s => s.id === currentPage)?.name
      : '';
    return { main, sub };
  };

  const breadcrumbs = getBreadcrumbs();

  const handleNavigation = (item: MenuItem) => {
    if (item.subItems) {
      toggleMenu(item.id);
      if (sidebarOpen === false) setSidebarOpen(true);
    } else {
      onNavigate(item.id);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <aside
        className={`${sidebarOpen ? 'w-64' : 'w-20'
          } bg-slate-900 text-slate-300 transition-all duration-300 ease-in-out flex flex-col shadow-xl z-20`}
      >
        <div className="h-14 flex items-center justify-between px-4 bg-slate-950/50 border-b border-slate-800">
          {sidebarOpen && (
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 flex items-center justify-center">
                <img src="/arkline.jpg" alt="ARKLINE" className="w-10 h-10 object-contain" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">ARKLINE WMS</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-md hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 p-2 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id || item.subItems?.some(sub => sub.id === currentPage);
            const isExpanded = expandedMenus.includes(item.id);

            return (
              <div key={item.id}>
                <button
                  onClick={() => handleNavigation(item)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md transition-all duration-150 group ${isActive && !item.subItems
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                    {sidebarOpen && (
                      <span className={`text-sm font-medium`}>
                        {item.name}
                      </span>
                    )}
                  </div>
                  {sidebarOpen && item.subItems && (
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                  )}
                </button>

                {/* Sub-menu items */}
                {sidebarOpen && item.subItems && isExpanded && (
                  <div className="ml-3 mt-1 space-y-0.5 border-l border-slate-700 pl-3">
                    {item.subItems.map((subItem) => {
                      const SubIcon = subItem.icon;
                      const isSubActive = currentPage === subItem.id;
                      return (
                        <button
                          key={subItem.id}
                          onClick={() => onNavigate(subItem.id)}
                          className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-150 text-xs font-medium ${isSubActive
                            ? 'text-white bg-slate-800'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                            }`}
                        >
                          <SubIcon className="w-3.5 h-3.5 opacity-70" />
                          <span>{subItem.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="p-4 bg-slate-950/30 border-t border-slate-800">
          <div className={`${sidebarOpen ? 'flex items-center space-x-3' : 'flex justify-center'}`}>
            <div className="w-8 h-8 bg-blue-900 rounded-md flex items-center justify-center text-blue-100 font-bold border border-blue-700 text-xs">
              AD
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-slate-200 truncate">Admin User</p>
                <p className="text-xs text-slate-500 truncate">admin@arkline.com</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10 shrink-0">
          <div className="flex items-center text-sm">
            <span className="text-slate-500 font-medium">{breadcrumbs.main}</span>
            {breadcrumbs.sub && (
              <>
                <ChevronRight className="w-4 h-4 text-slate-400 mx-2" />
                <span className="text-slate-900 font-semibold">{breadcrumbs.sub}</span>
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Global Search (Ctrl+K)"
                className="w-64 pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-slate-700 placeholder:text-slate-400"
              />
            </div>
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <button className="text-slate-500 hover:text-slate-700">
              <Bell className="w-5 h-5" />
            </button>
            <button className="text-slate-500 hover:text-slate-700">
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-gray-50/50 p-6">
          <div className="max-w-[1920px] mx-auto">
            {children}
          </div>
        </main>

        {/* Chatbot Widget */}
        <Chatbot />
      </div>
    </div>
  );
}
