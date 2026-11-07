import { AlgerianWilayaData, WorkflowNode, WorkflowEdge } from '../types/workflow';

// Key representative Algerian Wilayas with accurate COD logistics benchmarks
export const ALGERIAN_WILAYAS: AlgerianWilayaData[] = [
  { code: 16, name: 'Alger', nameAr: 'الجزائر', region: 'Centre', deliveryFee: 500, returnFee: 200, avgDeliveryRate: 84, avgConfirmationRate: 80 },
  { code: 9, name: 'Blida', nameAr: 'البليدة', region: 'Centre', deliveryFee: 550, returnFee: 200, avgDeliveryRate: 82, avgConfirmationRate: 78 },
  { code: 31, name: 'Oran', nameAr: 'وهران', region: 'Ouest', deliveryFee: 650, returnFee: 250, avgDeliveryRate: 79, avgConfirmationRate: 76 },
  { code: 25, name: 'Constantine', nameAr: 'قسنطينة', region: 'Est', deliveryFee: 650, returnFee: 250, avgDeliveryRate: 78, avgConfirmationRate: 75 },
  { code: 19, name: 'Sétif', nameAr: 'سطيف', region: 'Est', deliveryFee: 650, returnFee: 250, avgDeliveryRate: 81, avgConfirmationRate: 77 },
  { code: 15, name: 'Tizi Ouzou', nameAr: 'تيزي وزو', region: 'Centre', deliveryFee: 600, returnFee: 200, avgDeliveryRate: 80, avgConfirmationRate: 75 },
  { code: 35, name: 'Boumerdès', nameAr: 'بومرداس', region: 'Centre', deliveryFee: 550, returnFee: 200, avgDeliveryRate: 82, avgConfirmationRate: 78 },
  { code: 13, name: 'Tlemcen', nameAr: 'تلمسان', region: 'Ouest', deliveryFee: 700, returnFee: 250, avgDeliveryRate: 75, avgConfirmationRate: 73 },
  { code: 23, name: 'Annaba', nameAr: 'عنابة', region: 'Est', deliveryFee: 700, returnFee: 250, avgDeliveryRate: 77, avgConfirmationRate: 74 },
  { code: 5, name: 'Batna', nameAr: 'باتنة', region: 'Est', deliveryFee: 700, returnFee: 250, avgDeliveryRate: 76, avgConfirmationRate: 74 },
  { code: 30, name: 'Ouargla', nameAr: 'ورقلة', region: 'Sud', deliveryFee: 950, returnFee: 300, avgDeliveryRate: 68, avgConfirmationRate: 70 },
  { code: 47, name: 'Ghardaïa', nameAr: 'غرداية', region: 'Sud', deliveryFee: 900, returnFee: 300, avgDeliveryRate: 72, avgConfirmationRate: 72 },
  { code: 39, name: 'El Oued', nameAr: 'الوادي', region: 'Sud', deliveryFee: 950, returnFee: 300, avgDeliveryRate: 70, avgConfirmationRate: 71 },
  { code: 8, name: 'Béchar', nameAr: 'بشار', region: 'Sud', deliveryFee: 1050, returnFee: 350, avgDeliveryRate: 65, avgConfirmationRate: 68 },
  { code: 11, name: 'Tamanrasset', nameAr: 'تمنراست', region: 'Grand Sud', deliveryFee: 1350, returnFee: 450, avgDeliveryRate: 58, avgConfirmationRate: 65 },
  { code: 33, name: 'Illizi', nameAr: 'إليزي', region: 'Grand Sud', deliveryFee: 1350, returnFee: 450, avgDeliveryRate: 55, avgConfirmationRate: 62 },
];

export interface CODMetricsInput {
  ordersReceived: number;
  confirmedOrders?: number;
  confirmationRate?: number;
  dispatchedOrders?: number;
  deliveredOrders?: number;
  deliveryRate?: number;
  refusedOrders?: number;
  rtoOrders?: number;
  rtoRate?: number;
  adSpend: number;
  sellingPrice: number;
  productCost: number;
  packagingCost?: number;
  avgShippingCost?: number;
  avgReturnCost?: number;
  callCenterCostPerOrder?: number;
}

export interface CODMetricsOutput {
  ordersReceived: number;
  confirmedOrders: number;
  dispatchedOrders: number;
  deliveredOrders: number;
  refusedOrders: number;
  rtoOrders: number;
  confirmationRate: number; // percentage
  deliveryRate: number; // percentage
  rtoRate: number; // percentage
  costPerOrder: number; // DZD
  costPerDeliveredOrder: number; // DZD
  collectedRevenue: number; // DZD
  totalProductCost: number; // DZD
  totalAdSpend: number; // DZD
  totalShippingCost: number; // DZD
  totalReturnCost: number; // DZD
  totalPackagingCost: number; // DZD
  totalCallCenterCost: number; // DZD
  netProfit: number; // DZD
  netMargin: number; // percentage
  roas: number; // multiplier
  breakevenCPA: number; // DZD
}

/**
 * Calculates complete, accurate e-commerce COD metrics accounting for returns and refused orders.
 */
export function calculateCODMetrics(inputs: CODMetricsInput): CODMetricsOutput {
  const ordersReceived = Math.max(0, inputs.ordersReceived || 0);
  const sellingPrice = Math.max(0, inputs.sellingPrice || 0);
  const productCost = Math.max(0, inputs.productCost || 0);
  const packagingCost = Math.max(0, inputs.packagingCost || 100);
  const avgShippingCost = Math.max(0, inputs.avgShippingCost || 650);
  const avgReturnCost = Math.max(0, inputs.avgReturnCost || 250);
  const callCenterCost = Math.max(0, inputs.callCenterCostPerOrder || 50);
  const totalAdSpend = Math.max(0, inputs.adSpend || 0);

  // Confirmation calculation
  const confRate = inputs.confirmationRate ?? (ordersReceived > 0 ? ((inputs.confirmedOrders ?? ordersReceived * 0.72) / ordersReceived) * 100 : 72);
  const confirmedOrders = inputs.confirmedOrders !== undefined
    ? inputs.confirmedOrders
    : Math.round(ordersReceived * (confRate / 100));

  // Dispatched calculation (usually equals confirmed unless stock shortage)
  const dispatchedOrders = inputs.dispatchedOrders !== undefined
    ? inputs.dispatchedOrders
    : confirmedOrders;

  // Delivery rate & delivered calculation
  const delRate = inputs.deliveryRate ?? (dispatchedOrders > 0 ? ((inputs.deliveredOrders ?? dispatchedOrders * 0.78) / dispatchedOrders) * 100 : 78);
  const deliveredOrders = inputs.deliveredOrders !== undefined
    ? inputs.deliveredOrders
    : Math.round(dispatchedOrders * (delRate / 100));

  // RTO calculation
  const rtoOrders = inputs.rtoOrders !== undefined
    ? inputs.rtoOrders
    : Math.max(0, dispatchedOrders - deliveredOrders);
  const rtoRate = dispatchedOrders > 0 ? (rtoOrders / dispatchedOrders) * 100 : 0;
  const refusedOrders = inputs.refusedOrders ?? Math.max(0, ordersReceived - confirmedOrders);

  // Financials
  // In Algerian COD, revenue is ONLY collected from successfully delivered and paid packages!
  const collectedRevenue = deliveredOrders * sellingPrice;
  // Product cost only incurred for delivered items (or returned items if damaged, but standard accounting treats non-damaged returns as inventory returned)
  const totalProductCost = deliveredOrders * productCost;
  // Shipping cost paid to courier for ALL dispatched parcels
  const totalShippingCost = dispatchedOrders * avgShippingCost;
  // Return fee paid to courier for ALL returned parcels
  const totalReturnCost = rtoOrders * avgReturnCost;
  // Packaging costs for all dispatched packages
  const totalPackagingCost = dispatchedOrders * packagingCost;
  // Call center confirmation fees
  const totalCallCenterCost = ordersReceived * callCenterCost;

  // Net Profit formula
  const netProfit = collectedRevenue - totalProductCost - totalAdSpend - totalShippingCost - totalReturnCost - totalPackagingCost - totalCallCenterCost;
  const netMargin = collectedRevenue > 0 ? (netProfit / collectedRevenue) * 100 : 0;
  const roas = totalAdSpend > 0 ? collectedRevenue / totalAdSpend : (collectedRevenue > 0 ? 99 : 0);

  // Cost per metrics
  const costPerOrder = ordersReceived > 0 ? totalAdSpend / ordersReceived : 0;
  const costPerDeliveredOrder = deliveredOrders > 0 ? totalAdSpend / deliveredOrders : 0;

  // Break-even CPA per delivered order formula:
  // Net contribution per delivered order before ad spend:
  // sellingPrice - productCost - packagingCost - (dispatched/delivered)*shipping - (rto/delivered)*returnCost
  const dispatchRatio = deliveredOrders > 0 ? dispatchedOrders / deliveredOrders : 1.25;
  const rtoRatio = deliveredOrders > 0 ? rtoOrders / deliveredOrders : 0.25;
  const breakevenCPA = Math.max(0, sellingPrice - productCost - packagingCost - (dispatchRatio * avgShippingCost) - (rtoRatio * avgReturnCost) - (dispatchRatio * callCenterCost));

  return {
    ordersReceived,
    confirmedOrders,
    dispatchedOrders,
    deliveredOrders,
    refusedOrders,
    rtoOrders,
    confirmationRate: Math.round(confRate * 10) / 10,
    deliveryRate: Math.round(delRate * 10) / 10,
    rtoRate: Math.round(rtoRate * 10) / 10,
    costPerOrder: Math.round(costPerOrder),
    costPerDeliveredOrder: Math.round(costPerDeliveredOrder),
    collectedRevenue: Math.round(collectedRevenue),
    totalProductCost: Math.round(totalProductCost),
    totalAdSpend: Math.round(totalAdSpend),
    totalShippingCost: Math.round(totalShippingCost),
    totalReturnCost: Math.round(totalReturnCost),
    totalPackagingCost: Math.round(totalPackagingCost),
    totalCallCenterCost: Math.round(totalCallCenterCost),
    netProfit: Math.round(netProfit),
    netMargin: Math.round(netMargin * 10) / 10,
    roas: Math.round(roas * 100) / 100,
    breakevenCPA: Math.round(breakevenCPA),
  };
}

/**
 * Propagate workflow numbers across connected nodes
 */
export function propagateGraphMetrics(nodes: WorkflowNode[], edges: WorkflowEdge[]): { updatedNodes: WorkflowNode[]; updatedEdges: WorkflowEdge[] } {
  const nodeMap = new Map<string, WorkflowNode>(nodes.map(n => [n.id, { ...n, metrics: { ...n.metrics } }]));
  const edgeMap = new Map<string, WorkflowEdge>(edges.map(e => [e.id, { ...e }]));

  // Find root nodes (no incoming edges)
  const incomingCount = new Map<string, number>();
  nodes.forEach(n => incomingCount.set(n.id, 0));
  edges.forEach(e => {
    incomingCount.set(e.target, (incomingCount.get(e.target) || 0) + 1);
  });

  // Topological sorting or multi-pass simulation
  // Update edges with traffic volume based on source node audience/metrics
  edges.forEach(edge => {
    const sourceNode = nodeMap.get(edge.source);
    if (!sourceNode) return;

    let sourceVolume = sourceNode.metrics?.visitors ?? sourceNode.metrics?.impressions ?? sourceNode.metrics?.leads ?? sourceNode.metrics?.orders ?? 1000;
    if (typeof sourceNode.audienceBadge === 'string') {
      const match = sourceNode.audienceBadge.match(/^([\d.]+)([KM]?)$/);
      if (match) {
        let val = parseFloat(match[1]);
        if (match[2] === 'K') val *= 1000;
        if (match[2] === 'M') val *= 1000000;
        sourceVolume = val;
      }
    }

    if (edge.conversionRate !== undefined && edge.conversionRate > 0) {
      const targetTraffic = Math.round(sourceVolume * (edge.conversionRate / 100));
      edge.trafficVolume = targetTraffic;
      edge.trafficLabel = formatVolumeLabel(targetTraffic) + ' ppl';

      // Dropoff calculation if applicable
      if (edge.hasDropoff) {
        const drop = sourceVolume - targetTraffic;
        edge.dropoffCount = drop;
        edge.dropoffLabel = '-' + formatVolumeLabel(drop);
      }
    }
  });

  return {
    updatedNodes: Array.from(nodeMap.values()),
    updatedEdges: Array.from(edgeMap.values()),
  };
}

export function formatVolumeLabel(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return num.toString();
}

export function formatCurrencyDZD(val: number): string {
  return val.toLocaleString('fr-DZ') + ' DZD';
}
