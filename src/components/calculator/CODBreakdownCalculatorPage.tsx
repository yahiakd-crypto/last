import React, { useState, useMemo } from 'react';
import {
  Calculator,
  DollarSign,
  TrendingUp,
  Package,
  Truck,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Percent,
  RefreshCw,
  Search,
} from 'lucide-react';
import { AppSidebar } from '../navigation/AppSidebar';
import { ALGERIAN_WILAYAS } from '../../utils/algeriaCOD';

interface CODBreakdownCalculatorPageProps {
  onNavigate: (view: string, subItem?: string) => void;
  onOpenSearchModal?: () => void;
}

export const CODBreakdownCalculatorPage: React.FC<CODBreakdownCalculatorPageProps> = ({
  onNavigate,
  onOpenSearchModal,
}) => {
  // Input parameters (in Algerian Dinars DZD)
  const [sellingPrice, setSellingPrice] = useState<number>(4500);
  const [productCost, setProductCost] = useState<number>(1200);
  const [shippingFee, setShippingFee] = useState<number>(650);
  const [returnFee, setReturnFee] = useState<number>(250);
  const [packagingCost, setPackagingCost] = useState<number>(100);
  const [callCenterCost, setCallCenterCost] = useState<number>(80);

  // Conversion rates (percentages)
  const [confirmationRate, setConfirmationRate] = useState<number>(80);
  const [deliveryRate, setDeliveryRate] = useState<number>(75);
  const [targetMarginPercent, setTargetMarginPercent] = useState<number>(25);

  // Simulated orders
  const [monthlyOrders, setMonthlyOrders] = useState<number>(500);

  // Current CPA ad spend test
  const [adSpendCPA, setAdSpendCPA] = useState<number>(900);

  // Calculations
  const metrics = useMemo(() => {
    const confRate = confirmationRate / 100;
    const delivRate = deliveryRate / 100;
    const rtoRate = 1 - delivRate;

    // Out of 100 raw orders received:
    // Confirmed = 100 * confRate
    // Delivered = Confirmed * delivRate = 100 * confRate * delivRate
    // Returned = Confirmed * rtoRate = 100 * confRate * (1 - delivRate)
    const effectiveDeliveryPerRawOrder = confRate * delivRate;

    // Per delivered unit:
    // We spend 1 / effectiveDeliveryPerRawOrder orders worth of:
    // - Call center: per order
    // - Packaging: per shipped order (1/delivRate)
    // - Shipping: per shipped order
    // - Return shipping: (rtoRate / delivRate) * returnFee
    // - Sourcing: 1 product unit cost
    const shippedPerDelivered = 1 / Math.max(delivRate, 0.01);
    const returnsPerDelivered = (1 - delivRate) / Math.max(delivRate, 0.01);
    const rawOrdersPerDelivered = 1 / Math.max(effectiveDeliveryPerRawOrder, 0.01);

    const callCenterPerDelivered = rawOrdersPerDelivered * callCenterCost;
    const packagingPerDelivered = shippedPerDelivered * packagingCost;
    const shippingPerDelivered = shippedPerDelivered * shippingFee;
    const returnCostPerDelivered = returnsPerDelivered * returnFee;

    const operationalCostPerDelivered =
      productCost +
      packagingPerDelivered +
      shippingPerDelivered +
      returnCostPerDelivered +
      callCenterPerDelivered;

    // Max Breakeven CPA (per raw order)
    // SellingPrice - operationalCostPerDelivered = Max Ad Spend per delivered
    // Max CPA per raw order = (SellingPrice - operationalCostPerDelivered) * effectiveDeliveryPerRawOrder
    const grossMarginPerDelivered = sellingPrice - operationalCostPerDelivered;
    const maxBreakevenCPA = Math.max(0, grossMarginPerDelivered * effectiveDeliveryPerRawOrder);

    // Target CPA for desired net margin
    const targetProfitAmount = sellingPrice * (targetMarginPercent / 100);
    const targetGrossAfterProfit = grossMarginPerDelivered - targetProfitAmount;
    const targetCPA = Math.max(0, targetGrossAfterProfit * effectiveDeliveryPerRawOrder);

    // Real net profit with currently assumed ad spend CPA
    const currentAdSpendPerDelivered = rawOrdersPerDelivered * adSpendCPA;
    const realNetProfitPerDelivered = grossMarginPerDelivered - currentAdSpendPerDelivered;
    const realNetMarginPercent = (realNetProfitPerDelivered / sellingPrice) * 100;

    // Volume totals
    const totalDelivered = Math.round(monthlyOrders * effectiveDeliveryPerRawOrder);
    const totalRevenue = totalDelivered * sellingPrice;
    const totalAdSpend = monthlyOrders * adSpendCPA;
    const totalCOGS = totalDelivered * productCost;
    const totalNetProfit = totalDelivered * realNetProfitPerDelivered;

    return {
      effectiveDeliveryPerRawOrder,
      operationalCostPerDelivered,
      grossMarginPerDelivered,
      maxBreakevenCPA,
      targetCPA,
      realNetProfitPerDelivered,
      realNetMarginPercent,
      totalDelivered,
      totalRevenue,
      totalAdSpend,
      totalCOGS,
      totalNetProfit,
    };
  }, [
    sellingPrice,
    productCost,
    shippingFee,
    returnFee,
    packagingCost,
    callCenterCost,
    confirmationRate,
    deliveryRate,
    targetMarginPercent,
    monthlyOrders,
    adSpendCPA,
  ]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC] font-sans text-slate-900 select-none">
      {/* 1. App Sidebar */}
      <AppSidebar
        activeView="breakdown"
        onNavigate={onNavigate}
        onOpenNewModal={() => onNavigate('board')}
      />

      {/* 2. Main Calculator Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-14 bg-white border-b border-slate-200/90 px-6 flex items-center justify-between shrink-0 z-10 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-xs">
              <Calculator className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 tracking-tight">
                COD Margin & CPA Breakdown Calculator
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">
                Algerian Cash On Delivery Unit Economics & Breakeven Analytics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSellingPrice(4500);
                setProductCost(1200);
                setShippingFee(650);
                setReturnFee(250);
                setPackagingCost(100);
                setCallCenterCost(80);
                setConfirmationRate(80);
                setDeliveryRate(75);
                setAdSpendCPA(900);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset Standards</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-1">
                  <span>MAX BREAKEVEN CPA</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-2xl font-black text-slate-900">
                  {Math.round(metrics.maxBreakevenCPA)} <span className="text-xs font-bold text-slate-400">DZD</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Maximum allowable ad CPA before losing money
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-1">
                  <span>TARGET CPA ({targetMarginPercent}%)</span>
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-2xl font-black text-blue-600">
                  {Math.round(metrics.targetCPA)} <span className="text-xs font-bold text-slate-400">DZD</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Target Facebook CPA to guarantee {targetMarginPercent}% profit
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-1">
                  <span>NET PROFIT / DELIVERED</span>
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                </div>
                <div className={`text-2xl font-black ${metrics.realNetProfitPerDelivered >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {Math.round(metrics.realNetProfitPerDelivered)} <span className="text-xs font-bold text-slate-400">DZD</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Real margin: {metrics.realNetMarginPercent.toFixed(1)}% per delivered item
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-1">
                  <span>EST. MONTHLY NET PROFIT</span>
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                </div>
                <div className={`text-2xl font-black ${metrics.totalNetProfit >= 0 ? 'text-purple-600' : 'text-red-500'}`}>
                  {Math.round(metrics.totalNetProfit).toLocaleString()} <span className="text-xs font-bold text-slate-400">DZD</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Based on {monthlyOrders} raw orders ({metrics.totalDelivered} delivered)
                </p>
              </div>
            </div>

            {/* Main Interactive Controls & Breakdown Table */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Sliders & Controls */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                    Commercial & Logistics Inputs
                  </h3>

                  {/* Selling Price */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Customer Selling Price</span>
                      <span className="font-bold text-slate-900">{sellingPrice} DZD</span>
                    </div>
                    <input
                      type="range"
                      min="1000"
                      max="20000"
                      step="100"
                      value={sellingPrice}
                      onChange={(e) => setSellingPrice(Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>

                  {/* Product Cost (COGS) */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Product Cost (COGS)</span>
                      <span className="font-bold text-slate-900">{productCost} DZD</span>
                    </div>
                    <input
                      type="range"
                      min="200"
                      max="8000"
                      step="50"
                      value={productCost}
                      onChange={(e) => setProductCost(Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>

                  {/* Confirmation Rate */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Call Confirmation Rate</span>
                      <span className="font-bold text-slate-900">{confirmationRate}%</span>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="98"
                      value={confirmationRate}
                      onChange={(e) => setConfirmationRate(Number(e.target.value))}
                      className="w-full accent-blue-500"
                    />
                  </div>

                  {/* Delivery Rate */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Courier Delivery Rate</span>
                      <span className="font-bold text-slate-900">{deliveryRate}%</span>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="95"
                      value={deliveryRate}
                      onChange={(e) => setDeliveryRate(Number(e.target.value))}
                      className="w-full accent-blue-500"
                    />
                  </div>

                  {/* Current Ad Spend CPA */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Current Ad CPA (Per Order)</span>
                      <span className="font-bold text-emerald-600">{adSpendCPA} DZD</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="3000"
                      step="50"
                      value={adSpendCPA}
                      onChange={(e) => setAdSpendCPA(Number(e.target.value))}
                      className="w-full accent-purple-500"
                    />
                  </div>

                  {/* Shipping Fee */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500 block mb-1">Shipping Fee (DZD)</label>
                      <input
                        type="number"
                        value={shippingFee}
                        onChange={(e) => setShippingFee(Number(e.target.value))}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500 block mb-1">Return / RTO Fee (DZD)</label>
                      <input
                        type="number"
                        value={returnFee}
                        onChange={(e) => setReturnFee(Number(e.target.value))}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Complete Unit Economics Table */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-2xs">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 mb-3">
                    Per-Delivered-Unit Economics Breakdown
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px]">
                          <th className="py-2.5">Cost Component</th>
                          <th className="py-2.5 text-right">Cost (DZD)</th>
                          <th className="py-2.5 text-right">% of Price</th>
                          <th className="py-2.5 text-right">Note</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        <tr>
                          <td className="py-2.5 text-slate-900 font-bold">Selling Price</td>
                          <td className="py-2.5 text-right text-slate-900 font-bold">{sellingPrice} DZD</td>
                          <td className="py-2.5 text-right text-slate-500">100.0%</td>
                          <td className="py-2.5 text-right text-slate-400">Cash collected</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 text-slate-700">Product Sourcing (COGS)</td>
                          <td className="py-2.5 text-right text-slate-700">-{productCost} DZD</td>
                          <td className="py-2.5 text-right text-slate-500">{((productCost / sellingPrice) * 100).toFixed(1)}%</td>
                          <td className="py-2.5 text-right text-slate-400">Delivered stock</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 text-slate-700">Courier Shipping Fee</td>
                          <td className="py-2.5 text-right text-slate-700">-{Math.round(shippingFee / (deliveryRate / 100))} DZD</td>
                          <td className="py-2.5 text-right text-slate-500">{(((shippingFee / (deliveryRate / 100)) / sellingPrice) * 100).toFixed(1)}%</td>
                          <td className="py-2.5 text-right text-slate-400">Adj. for delivery %</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 text-slate-700">RTO Return Provision</td>
                          <td className="py-2.5 text-right text-slate-700">-{Math.round(((1 - deliveryRate / 100) / (deliveryRate / 100)) * returnFee)} DZD</td>
                          <td className="py-2.5 text-right text-slate-500">{(((((1 - deliveryRate / 100) / (deliveryRate / 100)) * returnFee) / sellingPrice) * 100).toFixed(1)}%</td>
                          <td className="py-2.5 text-right text-slate-400">{100 - deliveryRate}% return fee</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 text-slate-700">Packaging & Call Center</td>
                          <td className="py-2.5 text-right text-slate-700">-{Math.round((packagingCost / (deliveryRate / 100)) + (callCenterCost / metrics.effectiveDeliveryPerRawOrder))} DZD</td>
                          <td className="py-2.5 text-right text-slate-500">{((((packagingCost / (deliveryRate / 100)) + (callCenterCost / metrics.effectiveDeliveryPerRawOrder)) / sellingPrice) * 100).toFixed(1)}%</td>
                          <td className="py-2.5 text-right text-slate-400">Ops & Confirmation</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 text-purple-700 font-semibold">Advertising (Facebook CPA)</td>
                          <td className="py-2.5 text-right text-purple-700 font-semibold">-{Math.round(adSpendCPA / metrics.effectiveDeliveryPerRawOrder)} DZD</td>
                          <td className="py-2.5 text-right text-purple-500">{(((adSpendCPA / metrics.effectiveDeliveryPerRawOrder) / sellingPrice) * 100).toFixed(1)}%</td>
                          <td className="py-2.5 text-right text-slate-400">Per delivered unit</td>
                        </tr>
                        <tr className="bg-emerald-50/50 font-bold">
                          <td className="py-3 text-emerald-900">REAL NET PROFIT</td>
                          <td className="py-3 text-right text-emerald-600">{Math.round(metrics.realNetProfitPerDelivered)} DZD</td>
                          <td className="py-3 text-right text-emerald-600">{metrics.realNetMarginPercent.toFixed(1)}%</td>
                          <td className="py-3 text-right text-emerald-700 font-semibold">In your pocket</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Wilaya Quick Presets */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-2xs">
                  <h4 className="text-xs font-bold text-slate-900 mb-2">Wilaya Benchmark Presets</h4>
                  <div className="flex flex-wrap gap-2">
                    {ALGERIAN_WILAYAS.slice(0, 6).map((wilaya) => (
                      <button
                        key={wilaya.code}
                        type="button"
                        onClick={() => {
                          setShippingFee(wilaya.deliveryFee);
                          setReturnFee(wilaya.returnFee);
                          setDeliveryRate(wilaya.avgDeliveryRate);
                          setConfirmationRate(wilaya.avgConfirmationRate);
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 text-[11px] font-semibold text-slate-700 transition-colors"
                      >
                        {wilaya.name} ({wilaya.avgDeliveryRate}%)
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

