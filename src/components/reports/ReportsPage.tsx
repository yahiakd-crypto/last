import React, { useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Share2,
  TrendingUp,
  DollarSign,
  PieChart,
  ArrowRight,
  Filter,
  CheckCircle2,
  Clock,
  Printer,
  Sparkles,
} from 'lucide-react';
import { AppSidebar } from '../navigation/AppSidebar';
import { AppHeader } from '../navigation/AppHeader';

interface ReportsPageProps {
  onNavigate: (view: string, subItem?: string) => void;
  onOpenSearchModal?: () => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ onNavigate, onOpenSearchModal }) => {
  const [reports, setReports] = useState([
    {
      id: 'rep-1',
      title: 'October 2025 Algeria COD Executive Summary & P&L',
      type: 'Financial & COD Margin',
      date: 'Oct 31, 2025',
      size: '2.4 MB',
      format: 'PDF + CSV',
      status: 'Ready',
      metrics: {
        revenue: '187,500 DZD',
        deliveredRate: '71.5%',
        netProfit: '64,200 DZD',
      },
    },
    {
      id: 'rep-2',
      title: 'Meta & TikTok Creative ROAS Performance Audit',
      type: 'Paid Advertising',
      date: 'Oct 28, 2025',
      size: '1.8 MB',
      format: 'PDF',
      status: 'Ready',
      metrics: {
        revenue: '28,400 DZD Spend',
        deliveredRate: '6.61 ROAS',
        netProfit: '14,461 Clicks',
      },
    },
    {
      id: 'rep-3',
      title: '58 Wilayas Yalidine & ZR Express Logistics Benchmark',
      type: 'Supply Chain & Logistics',
      date: 'Oct 25, 2025',
      size: '3.1 MB',
      format: 'Excel / CSV',
      status: 'Ready',
      metrics: {
        revenue: '1,248 Orders',
        deliveredRate: '12.4% RTO',
        netProfit: 'Alger & Oran Top',
      },
    },
    {
      id: 'rep-4',
      title: 'Q3 E-commerce Inventory Turn & Product Validation',
      type: 'Inventory & Sourcing',
      date: 'Oct 15, 2025',
      size: '4.2 MB',
      format: 'PDF + Excel',
      status: 'Ready',
      metrics: {
        revenue: 'Portable Blender Top',
        deliveredRate: '8.7% Conv.',
        netProfit: 'High Margin',
      },
    },
  ]);

  const handleDownloadReport = (title: string) => {
    const reportContent = `Product Intelligence OS - Report\nTitle: ${title}\nExport Date: ${new Date().toISOString()}\nStatus: Verified\n`;
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] text-slate-800 font-sans overflow-hidden">
      <AppSidebar activeView="reports" onNavigate={onNavigate} />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <AppHeader
          breadcrumbs={[
            { label: 'Reports', isCurrent: true },
          ]}
          onOpenSearchModal={onOpenSearchModal}
          currentCountry="Algeria"
        />

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/70">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  Performance & Financial Reports
                </h1>
                <p className="text-xs text-slate-500">
                  Generate, preview and download complete P&L statements, COD cash flow sheets, and ad audit decks.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const newReport = {
                    id: `rep-${Date.now()}`,
                    title: 'Real-Time COD Delivery & Wilaya Audit',
                    type: 'Audit' as const,
                    date: 'Generated Just Now',
                    size: '1.2 MB',
                    format: 'PDF / CSV',
                    status: 'Ready' as const,
                    metrics: {
                      revenue: '240,000 DZD',
                      deliveredRate: '78%',
                      netProfit: '92,000 DZD',
                    },
                  };
                  setReports((prev) => [newReport, ...prev]);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate New Report</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map((rep) => (
              <div
                key={rep.id}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                        {rep.type}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 mt-2 leading-snug">
                        {rep.title}
                      </h3>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{rep.date}</span>
                        <span>•</span>
                        <span>{rep.size}</span>
                        <span>•</span>
                        <span className="font-semibold text-slate-600">{rep.format}</span>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-200">
                      {rep.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">Metric 1</span>
                      <span className="text-xs font-bold text-slate-800">{rep.metrics.revenue}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">Metric 2</span>
                      <span className="text-xs font-bold text-slate-800">{rep.metrics.deliveredRate}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">Metric 3</span>
                      <span className="text-xs font-bold text-slate-800">{rep.metrics.netProfit}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleDownloadReport(rep.title)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>

                  <button
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(window.location.href);
                      }
                    }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
