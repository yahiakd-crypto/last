import React, { useState } from 'react';
import {
  Package,
  Truck,
  PhoneCall,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Search,
  Filter,
  Download,
  Plus,
  ChevronDown,
  MapPin,
  ExternalLink,
  DollarSign,
  User,
} from 'lucide-react';
import { AppSidebar } from '../navigation/AppSidebar';
import { AppHeader } from '../navigation/AppHeader';

interface OrdersPageProps {
  onNavigate: (view: string, subItem?: string) => void;
  onOpenSearchModal?: () => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ onNavigate, onOpenSearchModal }) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Realistic Algerian COD orders across Wilayas
  const [orders, setOrders] = useState([
    {
      id: 'ORD-4587',
      customer: 'Amine Benali',
      phone: '0550 12 34 56',
      wilaya: '16 - Alger (Bab Ezzouar)',
      product: 'Portable Blender Pro 500ml',
      quantity: 1,
      totalAmount: '4,500 DZD',
      shippingProvider: 'Yalidine Express',
      trackingCode: 'YAL-DZ-994821',
      status: 'Delivered',
      statusColor: 'emerald',
      date: 'Today, 14:22',
      callConfirmed: true,
    },
    {
      id: 'ORD-4586',
      customer: 'Khadidja Merah',
      phone: '0661 98 76 54',
      wilaya: '31 - Oran (Bir El Djir)',
      product: 'Smart Watch Ultra 49mm',
      quantity: 1,
      totalAmount: '5,800 DZD',
      shippingProvider: 'ZR Express',
      trackingCode: 'ZR-882190',
      status: 'In Transit',
      statusColor: 'blue',
      date: 'Today, 11:05',
      callConfirmed: true,
    },
    {
      id: 'ORD-4585',
      customer: 'Youcef Brahimi',
      phone: '0770 45 67 89',
      wilaya: '19 - Sétif (El Eulma)',
      product: 'Aspirateur Sans Fil Cyclone',
      quantity: 2,
      totalAmount: '12,400 DZD',
      shippingProvider: 'Yalidine Express',
      trackingCode: 'YAL-DZ-994819',
      status: 'Call Pending',
      statusColor: 'amber',
      date: 'Today, 09:30',
      callConfirmed: false,
    },
    {
      id: 'ORD-4584',
      customer: 'Fatima Zohra',
      phone: '0560 33 22 11',
      wilaya: '25 - Constantine',
      product: 'Soin Visage Éclat Naturel',
      quantity: 1,
      totalAmount: '3,200 DZD',
      shippingProvider: 'Procolis',
      trackingCode: 'PRO-10294',
      status: 'Delivered',
      statusColor: 'emerald',
      date: 'Yesterday',
      callConfirmed: true,
    },
    {
      id: 'ORD-4583',
      customer: 'Walid Mansouri',
      phone: '0780 11 22 33',
      wilaya: '09 - Blida (Boufarik)',
      product: 'Support Téléphone Magnétique MagSafe',
      quantity: 1,
      totalAmount: '2,800 DZD',
      shippingProvider: 'Local Delivery',
      trackingCode: 'LOC-5512',
      status: 'Returned (RTO)',
      statusColor: 'rose',
      date: 'Oct 21, 2025',
      callConfirmed: true,
    },
  ]);

  const filteredOrders = orders.filter((o) => {
    if (filterStatus !== 'all' && o.status.toLowerCase() !== filterStatus.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        o.id.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.wilaya.toLowerCase().includes(q) ||
        o.product.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] text-slate-800 font-sans overflow-hidden">
      <AppSidebar activeView="orders-cod" onNavigate={onNavigate} />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <AppHeader
          breadcrumbs={[
            { label: 'Orders & COD', isCurrent: true },
          ]}
          onOpenSearchModal={onOpenSearchModal}
          currentCountry="Algeria"
        />

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Header Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25 shrink-0">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  Algeria Cash-On-Delivery (COD) Orders
                </h1>
                <p className="text-xs text-slate-500">
                  Track deliveries across 58 Wilayas, manage Yalidine / ZR shipments, and monitor call center confirmation rates.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const headers = 'ID,Customer,Phone,Wilaya,Product,Qty,Total,Provider,Tracking,Status\n';
                  const rows = orders.map(o => `"${o.id}","${o.customer}","${o.phone}","${o.wilaya}","${o.product}",${o.quantity},"${o.totalAmount}","${o.shippingProvider}","${o.trackingCode}","${o.status}"`).join('\n');
                  const blob = new Blob([headers + rows], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `cod-manifest-${Date.now()}.csv`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 shadow-2xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Manifest</span>
              </button>
              <button
                onClick={() => {
                  const newOrd = {
                    id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
                    customer: 'Client Nouveau',
                    phone: '0555 00 11 22',
                    wilaya: '16 - Alger (Centre)',
                    product: 'Portable Blender Pro 500ml',
                    quantity: 1,
                    totalAmount: '4,500 DZD',
                    shippingProvider: 'Yalidine Express',
                    trackingCode: `YAL-DZ-${Math.floor(100000 + Math.random() * 900000)}`,
                    status: 'Pending Call',
                    statusColor: 'amber',
                    date: 'Just now',
                    callConfirmed: false,
                  };
                  setOrders(prev => [newOrd, ...prev]);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>New COD Order</span>
              </button>
            </div>
          </div>

          {/* COD Metrics Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Delivered Orders</span>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-bold text-slate-900">892</span>
                <span className="text-xs font-bold text-emerald-600">71.5% Delivery Rate</span>
              </div>
              <span className="text-[10px] text-slate-400">Total collected: 3,420,000 DZD</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">In Transit (Shipping)</span>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-bold text-slate-900">214</span>
                <span className="text-xs font-bold text-blue-600">Yalidine / ZR</span>
              </div>
              <span className="text-[10px] text-slate-400">Average transit: 48 hours</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Confirmation Rate</span>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-bold text-slate-900">88.4%</span>
                <span className="text-xs font-bold text-emerald-600">Top Wilayas</span>
              </div>
              <span className="text-[10px] text-slate-400">Call center response &lt; 15 mins</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">RTO Return Rate</span>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-bold text-slate-900">12.4%</span>
                <span className="text-xs font-bold text-amber-600">Healthy &lt; 15%</span>
              </div>
              <span className="text-[10px] text-slate-400">Auto-blacklist active</span>
            </div>
          </div>

          {/* Orders Table */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {['all', 'Delivered', 'In Transit', 'Call Pending', 'Returned (RTO)'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors ${
                      filterStatus === s
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {s === 'all' ? 'All Orders' : s}
                  </button>
                ))}
              </div>

              <div className="relative w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter order ID, Wilaya, name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 text-[11px] font-semibold">
                    <th className="pb-2">Order ID</th>
                    <th className="pb-2">Customer & Phone</th>
                    <th className="pb-2">Destination (Wilaya)</th>
                    <th className="pb-2">Product</th>
                    <th className="pb-2">Amount (COD)</th>
                    <th className="pb-2">Shipping Provider</th>
                    <th className="pb-2">Call Verified</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 font-mono font-bold text-blue-600">{o.id}</td>
                      <td className="py-3">
                        <span className="font-semibold text-slate-800 block">{o.customer}</span>
                        <span className="text-[10px] text-slate-400">{o.phone}</span>
                      </td>
                      <td className="py-3 font-medium text-slate-700">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{o.wilaya}</span>
                        </div>
                      </td>
                      <td className="py-3 text-slate-700">
                        <span className="block truncate max-w-xs">{o.product}</span>
                        <span className="text-[10px] text-slate-400">Qty: {o.quantity}</span>
                      </td>
                      <td className="py-3 font-bold text-slate-900">{o.totalAmount}</td>
                      <td className="py-3">
                        <span className="font-medium text-slate-800 block">{o.shippingProvider}</span>
                        <span className="text-[10px] text-blue-500 font-mono">{o.trackingCode}</span>
                      </td>
                      <td className="py-3">
                        {o.callConfirmed ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3" /> Confirmed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold">
                            <PhoneCall className="w-3 h-3" /> Calling
                          </span>
                        )}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            o.status === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                              : o.status === 'In Transit'
                              ? 'bg-blue-50 text-blue-600 border border-blue-200'
                              : o.status === 'Call Pending'
                              ? 'bg-amber-50 text-amber-600 border border-amber-200'
                              : 'bg-rose-50 text-rose-600 border border-rose-200'
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
