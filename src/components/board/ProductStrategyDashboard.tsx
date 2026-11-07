import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Edit3,
  Check,
  ShieldCheck,
  DollarSign,
  Users,
  Target,
  Award,
  Layers,
  Palette,
  FileText,
  BarChart3,
  TrendingUp,
  AlertCircle,
  Package,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { StrategyReportOutputA, ProductInputData } from '../../types/landingPage';

interface ProductStrategyDashboardProps {
  report: StrategyReportOutputA;
  product: ProductInputData;
  onApproveAndGenerate: () => void;
  onRegenerate: () => void;
  onUpdateReport?: (updated: StrategyReportOutputA) => void;
  isGenerating?: boolean;
}

export const ProductStrategyDashboard: React.FC<ProductStrategyDashboardProps> = ({
  report,
  product,
  onApproveAndGenerate,
  onRegenerate,
  onUpdateReport,
  isGenerating = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableReport, setEditableReport] = useState<StrategyReportOutputA>(report);

  // Sync if prop changes
  React.useEffect(() => {
    setEditableReport(report);
  }, [report]);

  const handleSaveEdits = () => {
    setIsEditing(false);
    if (onUpdateReport) {
      onUpdateReport(editableReport);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in pb-10">
      {/* =========================================================
          TOP BANNER & APPROVAL CONTROLS (OUTPUT A MANDATE)
      ========================================================= */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white space-y-3 shadow-md border border-indigo-900/40">
        <div className="flex items-center justify-between border-b border-indigo-800/50 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-black uppercase tracking-wider text-indigo-300">
              OUTPUT A: Strategy Report Ready
            </span>
          </div>
          <span className="text-[10px] font-mono bg-indigo-900/70 border border-indigo-700/60 text-indigo-200 px-2 py-0.5 rounded-full">
            15 / 15 Dimensions Analyzed
          </span>
        </div>

        <div>
          <h2 className="text-sm font-extrabold text-white leading-tight">
            {product.name || 'Universal E-Commerce Product'}
          </h2>
          <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
            Comprehensive business, pricing, audience, and CRO blueprint synthesized before generating landing page code.
          </p>
        </div>

        {/* Action Buttons: Approve & Generate vs Regenerate vs Edit */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            disabled={isGenerating}
            onClick={onApproveAndGenerate}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-black shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
          >
            <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Synthesizing...' : 'Approve Strategy & Generate Page →'}</span>
          </button>

          <button
            type="button"
            onClick={onRegenerate}
            disabled={isGenerating}
            className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
            title="Regenerate full strategy"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Regenerate</span>
          </button>

          <button
            type="button"
            onClick={() => (isEditing ? handleSaveEdits() : setIsEditing(true))}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isEditing ? 'bg-emerald-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            {isEditing ? <Check className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
            <span>{isEditing ? 'Save' : 'Edit'}</span>
          </button>
        </div>
      </div>

      {/* =========================================================
          SECTION 01: PRODUCT INTELLIGENCE
      ========================================================= */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Package className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
              1. Product Intelligence
            </h3>
          </div>
          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
            {editableReport.productIntelligence.functionalClassification}
          </span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          {editableReport.productIntelligence.visualAnalysis}
        </p>
        <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
            <span className="font-bold text-slate-800 block text-[10.5px]">Materials & Build</span>
            <span className="text-slate-600">{editableReport.productIntelligence.materialsBuild}</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
            <span className="font-bold text-slate-800 block text-[10.5px]">Emotional Appeal</span>
            <span className="text-slate-600">{editableReport.productIntelligence.emotionalAppeal}</span>
          </div>
        </div>
      </div>

      {/* =========================================================
          SECTION 02: MARKET OPPORTUNITY & COMPETITION
      ========================================================= */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
              2. Market Opportunity
            </h3>
          </div>
          <span className="text-xs font-black font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            {editableReport.marketAnalysis.marketOpportunityScore} / 100
          </span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          {editableReport.marketAnalysis.categoryDynamics}
        </p>
        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
          <span className="font-bold text-slate-800 block text-[10.5px] mb-0.5">Competitive Advantage</span>
          <p className="text-slate-600 text-[11px]">{editableReport.marketAnalysis.competitorLandscape}</p>
        </div>
      </div>

      {/* =========================================================
          SECTION 03: TARGET AUDIENCE & AWARENESS LEVEL
      ========================================================= */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Target className="w-4 h-4 text-purple-600" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
              3. Target Audience & Awareness
            </h3>
          </div>
          <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
            Stage: {editableReport.targetAudience.awarenessLevel}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
            <span className="font-bold text-slate-800 block text-[10.5px]">Demographics</span>
            <p className="text-slate-600 text-[11px]">{editableReport.targetAudience.demographics}</p>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
            <span className="font-bold text-slate-800 block text-[10.5px]">Buying Mindset</span>
            <p className="text-slate-600 text-[11px]">{editableReport.targetAudience.buyingMindset}</p>
          </div>
        </div>
      </div>

      {/* =========================================================
          SECTION 04: CUSTOMER AVATARS (3 RANKED PERSONAS)
      ========================================================= */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
              4. Customer Avatars (Ranked)
            </h3>
          </div>
          <span className="text-[10px] font-bold text-slate-500">3 Personas</span>
        </div>

        <div className="space-y-2">
          {editableReport.customerAvatars.map((av, idx) => (
            <div key={idx} className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-slate-900 block">{av.name}</span>
                  <span className="text-[10.5px] text-slate-500">{av.role}</span>
                </div>
                <span
                  className={`text-[9.5px] font-black uppercase px-2 py-0.5 rounded-full ${
                    av.likelihood === 'Highest'
                      ? 'bg-emerald-100 text-emerald-800'
                      : av.likelihood === 'Very High'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {av.likelihood} Conversion
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10.5px]">
                <div className="text-rose-700">
                  <span className="font-bold block">Pain Point:</span>
                  <span className="line-clamp-2">{av.corePain}</span>
                </div>
                <div className="text-emerald-700">
                  <span className="font-bold block">Desire:</span>
                  <span className="line-clamp-2">{av.primaryDesire}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================
          SECTION 05 & 06: BRAND IDENTITY & NAME SUGGESTIONS
      ========================================================= */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
              5 & 6. Brand Identity & Name
            </h3>
          </div>
          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full">
            {editableReport.brandIdentity.archetype}
          </span>
        </div>

        <p className="text-xs text-slate-600 italic">
          "{editableReport.brandIdentity.positioningStatement}"
        </p>

        <div className="space-y-1.5 pt-1">
          <span className="text-[10.5px] font-bold text-slate-700 block">Brand Name Candidates:</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {editableReport.brandNames.map((bn, i) => (
              <div
                key={i}
                className={`p-2 rounded-xl border text-xs flex items-center justify-between ${
                  bn.isRecommended
                    ? 'border-emerald-500 bg-emerald-50/40 text-emerald-950 font-bold'
                    : 'border-slate-200 bg-slate-50 text-slate-700'
                }`}
              >
                <div>
                  <span className="block">{bn.name}</span>
                  <span className="text-[9.5px] font-normal text-slate-500">{bn.rationale}</span>
                </div>
                {bn.isRecommended && (
                  <span className="text-[9px] font-black uppercase bg-emerald-600 text-white px-1.5 py-0.2 rounded-full shrink-0">
                    Recommended
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================
          SECTION 08: COLOR PALETTE & PSYCHOLOGY
      ========================================================= */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-rose-600" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
              8. Color Palette & Psychology
            </h3>
          </div>
          <span className="text-[10px] text-slate-400">Harmonized</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 p-1.5 rounded-xl border border-slate-200 bg-slate-50">
            <span
              className="w-5 h-5 rounded-lg shadow-xs border border-black/10"
              style={{ backgroundColor: editableReport.colorPalette.primaryHex }}
            />
            <span className="text-[10.5px] font-mono font-bold text-slate-800">
              {editableReport.colorPalette.primaryHex}
            </span>
          </div>

          <div className="flex items-center gap-1.5 p-1.5 rounded-xl border border-slate-200 bg-slate-50">
            <span
              className="w-5 h-5 rounded-lg shadow-xs border border-black/10"
              style={{ backgroundColor: editableReport.colorPalette.accentHex }}
            />
            <span className="text-[10.5px] font-mono font-bold text-slate-800">
              {editableReport.colorPalette.accentHex}
            </span>
          </div>

          <p className="text-[11px] text-slate-600 flex-1 pl-1 leading-snug">
            {editableReport.colorPalette.psychologicalJustification}
          </p>
        </div>
      </div>

      {/* =========================================================
          SECTION 09: 5 RANKED MARKETING ANGLES
      ========================================================= */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Target className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
              9. Marketing Angles (5 Ranked)
            </h3>
          </div>
          <span className="text-[10px] font-bold text-blue-600">Direct-Response Hooks</span>
        </div>

        <div className="space-y-2">
          {editableReport.marketingAngles.map((ang) => (
            <div key={ang.rank} className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900">
                  #{ang.rank} {ang.angleName}
                </span>
                <span className="text-[9.5px] text-slate-500">{ang.targetAvatar}</span>
              </div>
              <p className="font-bold text-blue-700 bg-blue-50/60 p-1.5 rounded-lg border border-blue-100 text-[11px]">
                "{ang.hookHeadline}"
              </p>
              <p className="text-[10.5px] text-slate-600">{ang.bodyAngle}</p>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================
          SECTION 10: UNIQUE SELLING PROPOSITION (USP)
      ========================================================= */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/40 border border-blue-200 space-y-2 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-blue-700" />
            <h3 className="text-xs font-black uppercase tracking-wider text-blue-950">
              10. Unique Selling Proposition
            </h3>
          </div>
          <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">
            Anti-Objection Locked
          </span>
        </div>

        <p className="text-xs font-black text-slate-900 leading-snug">
          {editableReport.usp.primaryUSP}
        </p>

        <ul className="space-y-1 pt-1 text-[11px] text-slate-700">
          {editableReport.usp.supportingPoints.map((pt, idx) => (
            <li key={idx} className="flex items-center gap-1.5">
              <span className="text-emerald-600 font-black">✓</span>
              <span>{pt}</span>
            </li>
          ))}
        </ul>

        <div className="p-2 rounded-xl bg-white border border-blue-200/80 text-[11px] text-blue-900">
          <strong>Risk Reversal:</strong> {editableReport.usp.antiObjectionClaim}
        </div>
      </div>

      {/* =========================================================
          SECTION 11: OFFER STRATEGY & BUNDLE ARCHITECTURE
      ========================================================= */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
              11. Tiered Offer Architecture
            </h3>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
            Image Benchmark Aligned
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          {/* Tier 1 */}
          <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
            <span className="font-bold text-slate-900 block">{editableReport.offerStrategy.tier1.name}</span>
            <span className="text-[10px] text-slate-500 block">{editableReport.offerStrategy.tier1.supply}</span>
            <div className="pt-1">
              <span className="font-mono font-black text-slate-900">{editableReport.offerStrategy.tier1.price}</span>
            </div>
          </div>

          {/* Tier 2 */}
          <div className="p-2.5 rounded-xl border-2 border-emerald-500 bg-emerald-50/30 space-y-1 relative">
            <span className="absolute -top-2 right-2 text-[8.5px] font-black uppercase bg-emerald-600 text-white px-1.5 py-0.2 rounded-full">
              Most Popular
            </span>
            <span className="font-bold text-slate-900 block">{editableReport.offerStrategy.tier2.name}</span>
            <span className="text-[10px] text-emerald-800 block">{editableReport.offerStrategy.tier2.supply}</span>
            <div className="pt-1">
              <span className="font-mono font-black text-emerald-700">{editableReport.offerStrategy.tier2.price}</span>
            </div>
          </div>

          {/* Tier 3 */}
          <div className="p-2.5 rounded-xl border border-amber-300 bg-amber-50/20 space-y-1 relative">
            <span className="absolute -top-2 right-2 text-[8.5px] font-black uppercase bg-amber-600 text-white px-1.5 py-0.2 rounded-full">
              Best Value
            </span>
            <span className="font-bold text-slate-900 block">{editableReport.offerStrategy.tier3.name}</span>
            <span className="text-[10px] text-slate-500 block">{editableReport.offerStrategy.tier3.supply}</span>
            <div className="pt-1">
              <span className="font-mono font-black text-slate-900">{editableReport.offerStrategy.tier3.price}</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          SECTION 12 & 13: PRICING ECONOMICS & PROFITABILITY
      ========================================================= */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
              12 & 13. Unit Economics & Margins
            </h3>
          </div>
          <span className="text-[10px] font-bold text-slate-600 font-mono">
            ROAS Target: {editableReport.pricingStrategy.breakEvenRoas}x
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 block uppercase">Retail Price</span>
            <span className="font-mono font-black text-slate-900">{editableReport.pricingStrategy.retailPrice}</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 block uppercase">Wholesale COGS</span>
            <span className="font-mono font-black text-slate-700">{editableReport.pricingStrategy.costOfGoods}</span>
          </div>
          <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="text-[10px] text-emerald-800 block uppercase">Gross Margin</span>
            <span className="font-mono font-black text-emerald-700">+{editableReport.pricingStrategy.grossMarginPercent}%</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-600 leading-snug">
          {editableReport.bundleEconomics.codReturnAbsorptionNotes}
        </p>
      </div>

      {/* =========================================================
          SECTION 14 & 15: PAGE ARCHITECTURE & DESIGN DIRECTION
      ========================================================= */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
              14 & 15. Page Architecture & Design
            </h3>
          </div>
          <span className="text-[10px] font-bold text-slate-500">12 Sections</span>
        </div>

        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          {editableReport.pageArchitecture.map((sec) => (
            <div key={sec.order} className="p-1.5 rounded-lg bg-slate-50 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">
                {sec.order}. {sec.section}
              </span>
              <span className="text-[10px] text-slate-500">{sec.purpose}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Final Action CTA at Bottom */}
      <div className="pt-2">
        <button
          type="button"
          disabled={isGenerating}
          onClick={onApproveAndGenerate}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white text-xs font-black shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Approve Strategy & Generate Landing Page Code →</span>
        </button>
      </div>
    </div>
  );
};
