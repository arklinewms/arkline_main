import { useState } from 'react';
import Layout from './components/Layout';
import Home from './components/Home';
import Inventory from './components/Inventory';
import AddProduct from './components/AddProduct';
import Inbound from './components/Inbound';
import Outbound from './components/Outbound';
import Storage from './components/Storage';
import Transfers from './components/Transfers';
import Reports from './components/Reports';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    // Handle sub-routes for Inbound
    if (currentPage.startsWith('inbound')) {
      // Map IDs like 'inbound_asn' to 'asn'
      const tab = currentPage.replace('inbound_', '');

      // If just 'inbound' is selected, default to 'asn'
      const activeTab = tab === 'inbound' ? 'asn' : tab;

      return <Inbound activeTab={activeTab as any} />;
    }

    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'feature1': // Fallback if old ID used
      case 'inventory':
      case 'inventory_all':
        return <Inventory view="all" />;
      case 'inventory_onhand':
        return <Inventory view="onhand" />;
      case 'inventory_availability':
        return <Inventory view="availability" />;
      case 'inventory_locations':
        return <Inventory view="locations" />;
      case 'inventory_master':
        return <Inventory view="master" />;
      case 'inventory_category':
        return <Inventory view="category" />;
      case 'inventory_movement':
        return <Inventory view="movement" />;
      case 'inventory_counting':
        return <Inventory view="counting" />;
      case 'inventory_aging':
        return <Inventory view="aging" />;
      case 'inventory_add':
        return <AddProduct onBack={() => setCurrentPage('inventory_all')} />;
      // Outbound Routes
      case 'feature3': // Fallback
        return <Outbound activeTab="picking" />;
    }

    // Check for outbound sub-routes
    if (currentPage.startsWith('outbound')) {
      const tab = currentPage.replace('outbound_', '');
      const activeTab = tab === 'outbound' ? 'picking' : tab;
      return <Outbound activeTab={activeTab as any} />;
    }

    // Check for storage sub-routes
    if (currentPage.startsWith('storage')) {
      const tab = currentPage.replace('storage_', '');
      const activeTab = tab === 'storage' ? 'layout' : tab;
      return <Storage activeTab={activeTab as any} />;
    }

    // Check for transfer sub-routes
    if (currentPage.startsWith('transfers')) {
      const tab = currentPage.replace('transfers_', '');
      // Map to keys used in Transfers.tsx
      let activeTab = 'bin_transfer';
      if (tab === 'bin') activeTab = 'bin_transfer';
      else if (tab === 'warehouse') activeTab = 'warehouse_transfer';
      else if (tab === 'replenish') activeTab = 'replenishment';
      else if (tab === 'thresholds') activeTab = 'thresholds';

      return <Transfers activeTab={activeTab as any} />;
    }

    // Check for reports sub-routes
    if (currentPage.startsWith('reports')) {
      const tab = currentPage.replace('reports_', '');
      let activeTab = 'accuracy';
      if (tab === 'reports') activeTab = 'accuracy';
      else activeTab = tab;

      return <Reports activeTab={activeTab as any} />;
    }

    switch (currentPage) {
      default:
        return <Home />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default App;
