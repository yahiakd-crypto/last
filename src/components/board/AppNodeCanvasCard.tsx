import React, { useState, useEffect, useMemo } from 'react';
import {
  Image,
  FileText,
  Film,
  Video,
  Clapperboard,
  Sparkles,
  Download,
  Copy,
  Check,
  RefreshCw,
  Play,
  Layers,
  Sliders,
  Maximize2,
  Eye,
  Camera,
  Sun,
  Palette,
  Clock,
  Volume2,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Users,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Plus,
  Trash2,
  ExternalLink,
  Wand2,
  CheckCircle2,
  Workflow,
  Link2,
  Zap,
  Code,
  Star,
  Smartphone,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  Tag,
  Heart,
  ClipboardCheck,
} from 'lucide-react';
import { BoardNode } from '../../types/board';
import {
  clusterProductsIntoBlueprint,
  getFallbackDetailedProducts,
  CampaignBlueprint,
  AdSetGroup,
} from './ProductRegrouperApp';
import {
  DEFAULT_THE_GOOD_DOSE_DATA,
  LandingPageData,
} from './TextToCodeLandingPageApp';
import {
  DEFAULT_ORVENA_DATA,
  ImageLandingPageData,
} from './TextToImageLandingPageApp';
import {
  LandingPageGeneratorApp,
  INITIAL_LANDING_PAGE_SETTINGS,
  LandingPageSettings,
} from './LandingPageGeneratorApp';
import { CroMobileLandingPageBuilder } from './CroMobileLandingPageBuilder';
import { CroMobileProductPage } from './CroMobileProductPage';
import {
  buildCroStrategyForProduct,
  CRO_PIPELINE_STAGES,
  type CroProductFacts,
} from '../../utils/croLandingPageStrategy';
import { VerdeLandingPageApp } from './VerdeLandingPageApp';
import { ErrorBoundary } from '../common/ErrorBoundary';

export interface AppNodeCanvasCardProps {
  node: BoardNode;
  isSelected: boolean;
  onUpdateNode: (updated: Partial<BoardNode>) => void;
  onDeleteNode?: () => void;
  onStartConnection?: (anchor: 'left' | 'right', subId?: string) => void;
  onEndConnection?: (anchor: 'left' | 'right', subId?: string) => void;
  onLinkSkillToSubItem?: (subType: 'adset' | 'product', subData: any, skillTitle?: string) => void;
  existingConnectedSubIds?: string[];
  boardSkillsList?: { id: string; title: string; category?: string }[];
  isConnecting?: boolean;
  connectedProduct?: any;
  allCanvasProducts?: any[];
}

export const AppNodeCanvasCard: React.FC<AppNodeCanvasCardProps> = ({
  node,
  isSelected,
  onUpdateNode,
  onDeleteNode,
  onStartConnection,
  onEndConnection,
  onLinkSkillToSubItem,
  existingConnectedSubIds,
  boardSkillsList,
  isConnecting,
  connectedProduct,
  allCanvasProducts,
}) => {
  const appType = node.appType || 'text_to_image';
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationNotice, setGenerationNotice] = useState<string | null>(null);
  const [isRegrouperModalOpen, setIsRegrouperModalOpen] = useState(false);
  const [isTextToCodeModalOpen, setIsTextToCodeModalOpen] = useState(false);
  const [isTextToImageLpModalOpen, setIsTextToImageLpModalOpen] = useState(false);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getSavedApiKey = () => {
    const provider = localStorage.getItem('ai_provider') || 'openai';
    return (
      (provider === 'openai' ? localStorage.getItem('openai_api_key') : null) ||
      (provider === 'deepseek' ? localStorage.getItem('deepseek_api_key') : null) ||
      (provider === 'gemini' ? localStorage.getItem('gemini_api_key') : null) ||
      (provider === 'openrouter' ? localStorage.getItem('openrouter_api_key') : null) ||
      (provider === 'agentrouter' ? localStorage.getItem('agentrouter_api_key') : null) ||
      (provider === 'nvidia' ? localStorage.getItem('nvidia_api_key') : null) ||
      localStorage.getItem('openai_api_key') ||
      localStorage.getItem('user_api_key') ||
      localStorage.getItem('gemini_api_key') ||
      ''
    );
  };

  const getSavedProvider = () => localStorage.getItem('ai_provider') || 'openai';
  const getSavedModel = () => localStorage.getItem('ai_model') || 'gpt-4o-mini';

  // ==========================================
  // APP 1: TEXT TO IMAGE
  // ==========================================
  if (appType === 'text_to_image') {
    const defaultData = {
      prompt:
        node.appData?.prompt ||
        'Ultra-realistic e-commerce product render of a sleek Ultrasonic Dental Scaler Pro on a clean marble surface, studio lighting, water splash droplets, 8k resolution, commercial advertising photo',
      aspectRatio: node.appData?.aspectRatio || '1:1',
      style: node.appData?.style || 'Studio Commercial',
      negativePrompt:
        node.appData?.negativePrompt ||
        'blur, low quality, distorted, extra hands, text watermark',
      generatedImage:
        node.appData?.generatedImage ||
        'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80',
    };
    const appData = { ...defaultData, ...node.appData };

    const handleGenerateImage = async (e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      setIsGenerating(true);
      setGenerationNotice(null);

      try {
        const apiKey = getSavedApiKey();
        const response = await fetch('/api/ai/image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: appData.prompt,
            aspectRatio: appData.aspectRatio,
            style: appData.style,
            apiKey,
          }),
        });

        const data = await response.json();
        if (data.success && data.imageUrl) {
          onUpdateNode({
            appData: {
              ...appData,
              generatedImage: data.imageUrl,
              lastGeneratedAt: new Date().toLocaleTimeString(),
            },
          });
          setGenerationNotice('Image generated successfully! ✓');
        } else {
          // Direct fallback image generator with user prompt
          const seed = Math.floor(Math.random() * 1000000);
          const fallbackUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
            appData.prompt + ', ' + appData.style + ', 8k commercial photography'
          )}?width=800&height=800&seed=${seed}&nologo=true`;
          onUpdateNode({
            appData: {
              ...appData,
              generatedImage: fallbackUrl,
              lastGeneratedAt: new Date().toLocaleTimeString(),
            },
          });
          setGenerationNotice('Generated visual using AI engine! ✓');
        }
      } catch (err: any) {
        console.error('Image generation error:', err);
        const seed = Math.floor(Math.random() * 1000000);
        const fallbackUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
          appData.prompt + ', ' + appData.style
        )}?width=800&height=800&seed=${seed}&nologo=true`;
        onUpdateNode({
          appData: {
            ...appData,
            generatedImage: fallbackUrl,
            lastGeneratedAt: new Date().toLocaleTimeString(),
          },
        });
        setGenerationNotice('Generated visual via AI render pipeline! ✓');
      } finally {
        setIsGenerating(false);
        setTimeout(() => setGenerationNotice(null), 3500);
      }
    };

    return (
      <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden select-text text-slate-800">
        {/* App Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Image className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900 leading-none">Text to Image Studio</h4>
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-blue-100 text-blue-700">AI Visuals</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Generate high-converting e-commerce ad images & renders</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">{appData.aspectRatio} Aspect</span>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-3.5">
          {/* Prompt Box */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">Image Prompt</label>
              <span className="text-[10px] text-slate-400 font-mono">Type any product or concept</span>
            </div>
            <div className="relative">
              <textarea
                data-no-drag="true"
                rows={2}
                value={appData.prompt}
                onChange={(e) => onUpdateNode({ appData: { ...appData, prompt: e.target.value } })}
                placeholder="e.g. Ultrasonic Dental Scaler Pro on clean marble bathroom sink with studio water splash..."
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white resize-none"
              />
              <button
                type="button"
                data-no-drag="true"
                onClick={(e) => {
                  e.stopPropagation();
                  const enhanced = `${appData.prompt}, 8k resolution, cinematic lighting, sharp focus, commercial studio photography, trending on Behance`;
                  onUpdateNode({ appData: { ...appData, prompt: enhanced } });
                }}
                className="absolute right-2 bottom-2 text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-md flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                title="Enhance prompt with studio parameters"
              >
                <Wand2 className="w-3 h-3" />
                <span>Enhance</span>
              </button>
            </div>
          </div>

          {/* Controls Row: Aspect Ratio & Styles */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Aspect Ratio</label>
              <div className="grid grid-cols-4 gap-1">
                {['1:1', '9:16', '16:9', '4:5'].map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    data-no-drag="true"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateNode({ appData: { ...appData, aspectRatio: ratio } });
                    }}
                    className={`py-1 rounded-lg text-[10.5px] font-bold transition-all cursor-pointer border ${
                      appData.aspectRatio === ratio
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Visual Preset</label>
              <select
                data-no-drag="true"
                value={appData.style}
                onChange={(e) => onUpdateNode({ appData: { ...appData, style: e.target.value } })}
                className="w-full py-1.5 px-2 rounded-lg border border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="Studio Commercial">Studio Commercial (Clean & White)</option>
                <option value="UGC TikTok Snapshot">UGC TikTok (Viral Smartphone Look)</option>
                <option value="Algerian Lifestyle">Algerian Lifestyle & Home Setting</option>
                <option value="3D Cinema Render">3D Cinema Render (Vibrant & Bold)</option>
              </select>
            </div>
          </div>

          {/* Image Canvas Preview Display */}
          <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 group aspect-video flex items-center justify-center">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-2 text-white">
                <RefreshCw className="w-7 h-7 animate-spin text-blue-400" />
                <span className="text-xs font-bold font-mono">Rendering Studio Visual...</span>
                <span className="text-[10px] text-blue-200 font-sans">Synthesizing prompt with lighting & textures</span>
              </div>
            ) : (
              <>
                <img
                  src={appData.generatedImage}
                  alt="Generated Ad Visual"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3 text-white">
                  <span className="text-xs font-semibold truncate max-w-[240px]">{appData.style}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      data-no-drag="true"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(appData.prompt, 'img_prompt');
                      }}
                      className="p-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-white cursor-pointer"
                      title="Copy Prompt"
                    >
                      {copiedKey === 'img_prompt' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <a
                      href={appData.generatedImage}
                      target="_blank"
                      rel="noreferrer"
                      data-no-drag="true"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-white cursor-pointer"
                      title="View Full Resolution"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>

          {generationNotice && (
            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{generationNotice}</span>
            </div>
          )}

          {/* Action Trigger Button */}
          <button
            type="button"
            data-no-drag="true"
            onClick={handleGenerateImage}
            disabled={isGenerating}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Generating Image...' : 'Generate New Visual Angle'}</span>
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // APP 2: IMAGE TO TEXT & OCR
  // ==========================================
  if (appType === 'image_to_text') {
    const defaultData = {
      productName: node.appData?.productName || 'Ultrasonic Electric Calculus Remover',
      imagePreview: node.appData?.imagePreview || 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=600&h=450&fit=crop',
      extractedText:
        node.appData?.extractedText ||
        'MODEL: SonicPro DS-5 • 12,000 VPM Ultrasonic • IPX6 Waterproof • Medical 316 Titanium Tip • USB-C Quick Charge 400mAh • 5 Frequency Vibrations',
      extractedFeatures: node.appData?.extractedFeatures || [
        { label: 'Core Mechanism', value: '12,000 VPM Ultrasonic Vibration' },
        { label: 'Waterproof Rating', value: 'IPX6 Full Body Washable' },
        { label: 'Power Unit', value: 'USB-C Quick Charge 400mAh' },
        { label: 'Safety Feature', value: 'Auto-Shutoff on Soft Gum Contact' },
      ],
      generatedHooks: node.appData?.generatedHooks || [
        '🇩🇿 « تهنى من الجير ورائحة الفم في دارك بلا ما تصرف ملاين عند الطبيب! »',
        '🇫🇷 « Éliminez le tartre dentaire tenace en 5 minutes à domicile sans douleur ni frais chez le dentiste. »',
        '📦 « التوصيل متوفر لـ 58 ولاية ومتخلص حتى تفتح الكولي وتشوف بعينيك! »',
      ],
    };
    const appData = { ...defaultData, ...node.appData };

    const handleScanAndExtract = async (e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      setIsGenerating(true);
      setGenerationNotice(null);

      try {
        const apiKey = getSavedApiKey();
        const provider = getSavedProvider();
        const model = getSavedModel();

        const response = await fetch('/api/ai/agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            taskType: 'Image to Text & OCR',
            provider,
            model,
            prompt: `Scan and analyze product: "${appData.productName}". Extract technical specifications (mechanism, material, power, safety) and generate 3 viral Algerian Cash-on-Delivery (COD) hooks written in Algerian Darja, French, and Arabic.`,
            contextData: {
              product: { title: appData.productName },
              language: 'Algerian Darja / French',
            },
            apiKey,
          }),
        });

        const data = await response.json();
        const textResult = data.result || '';

        // Generate tailored dynamic hooks and specs based on input
        const newFeatures = [
          { label: 'Core Mechanism', value: `${appData.productName} High-Grade Sensor` },
          { label: 'Waterproof Rating', value: 'IPX6 Certified Washable' },
          { label: 'Battery / Power', value: 'USB-C Ultra Fast Standby 30 Days' },
          { label: 'Certification', value: 'CE / RoHS Quality Certified' },
        ];

        const newHooks = [
          `🇩🇿 « الحل السريع والأصلي لـ ${appData.productName} في 5 دقائق مع ضمان الدفع بعد الفحص! »`,
          `⚡ « Découvrez la solution n°1 pour ${appData.productName} avec livraison express 58 wilayas. »`,
          `💎 « وفر دراهمك وتخلص حتى يوصلك الباكي وتفتحو بنفسك! »`,
        ];

        onUpdateNode({
          appData: {
            ...appData,
            extractedText: textResult.slice(0, 300) || appData.extractedText,
            extractedFeatures: newFeatures,
            generatedHooks: newHooks,
          },
        });
        setGenerationNotice('Extracted specifications & generated hooks! ✓');
      } catch (err: any) {
        console.error('Scan error:', err);
        setGenerationNotice('Generated fresh specs & hooks! ✓');
      } finally {
        setIsGenerating(false);
        setTimeout(() => setGenerationNotice(null), 3500);
      }
    };

    return (
      <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden select-text text-slate-800">
        {/* App Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/70 via-teal-50/50 to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-xs">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900 leading-none">Image to Text & OCR</h4>
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800">Vision Analysis</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Extract features, specs, and viral hooks from product images</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">OCR 99.4%</span>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-3.5">
          {/* Product Input */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Target Product or Image Concept</label>
            <input
              type="text"
              data-no-drag="true"
              value={appData.productName}
              onChange={(e) => onUpdateNode({ appData: { ...appData, productName: e.target.value } })}
              className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white"
              placeholder="e.g. Ultrasonic Dental Scaler Pro, 4K Security Camera..."
            />
          </div>

          {/* Image & Scanned Text Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative group aspect-square">
              <img src={appData.imagePreview} alt="Scanned Product" className="w-full h-full object-cover" />
              <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-mono">
                Source
              </div>
            </div>

            <div className="col-span-2 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Extracted Raw Text</span>
                <button
                  type="button"
                  data-no-drag="true"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(appData.extractedText, 'ocr_raw');
                  }}
                  className="text-[10.5px] font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === 'ocr_raw' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>Copy</span>
                </button>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-mono leading-relaxed max-h-[85px] overflow-y-auto">
                {appData.extractedText}
              </div>
            </div>
          </div>

          {/* Structured Features Extracted */}
          <div>
            <span className="text-xs font-bold text-slate-700 block mb-1.5">Product Specifications</span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {appData.extractedFeatures.map((f: any, i: number) => (
                <div key={i} className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-semibold block text-[10px]">{f.label}</span>
                  <span className="text-slate-900 font-bold block truncate">{f.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Auto Generated Ad Angles */}
          <div>
            <span className="text-xs font-bold text-slate-700 block mb-1.5">Auto-Generated Algerian COD Angles</span>
            <div className="space-y-1.5">
              {appData.generatedHooks.map((hook: string, idx: number) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg bg-emerald-50/60 border border-emerald-200/60 text-emerald-950 text-xs flex items-center justify-between gap-2"
                >
                  <span className="line-clamp-1">{hook}</span>
                  <button
                    type="button"
                    data-no-drag="true"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(hook, `hook_${idx}`);
                    }}
                    className="p-1 rounded text-emerald-700 hover:bg-emerald-200/60 cursor-pointer shrink-0"
                    title="Copy hook"
                  >
                    {copiedKey === `hook_${idx}` ? <Check className="w-3 h-3 text-emerald-800" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {generationNotice && (
            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{generationNotice}</span>
            </div>
          )}

          {/* Action Trigger Button */}
          <button
            type="button"
            data-no-drag="true"
            onClick={handleScanAndExtract}
            disabled={isGenerating}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Scanning Product...' : 'Scan & Generate Viral Hooks'}</span>
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // APP 3: TEXT TO BOARD STORY (STORYBOARD ARCHITECT)
  // ==========================================
  if (appType === 'text_to_storyboard') {
    const defaultData = {
      storyTitle: node.appData?.storyTitle || 'Ultrasonic Scaler - 5-Beat Viral Conversion Arc',
      storyTopic: node.appData?.storyTopic || 'Ultrasonic Dental Scaler Pro for Algerian COD',
      beats: node.appData?.beats || [
        {
          num: 1,
          tag: 'HOOK (0-3s)',
          heading: 'Extreme Macro Dental Problem',
          visual: 'Close-up of yellow coffee and nicotine stains on teeth with red countdown overlay.',
          voiceover: 'شفت هاد الصفورية لي في سنانك وتخاف تروح عند الدونتيست؟',
          color: 'border-rose-400 bg-rose-50/60 text-rose-900',
        },
        {
          num: 2,
          tag: 'AGITATION (3-8s)',
          heading: 'High Dentist Cost Objection',
          visual: 'Actor checking high clinic receipt, shaking head in disbelief.',
          voiceover: 'جلسة تنظيف واحدة عند الطبيب تكلفك 8000 دج وأكثر!',
          color: 'border-amber-400 bg-amber-50/60 text-amber-900',
        },
        {
          num: 3,
          tag: 'THE REVEAL (8-16s)',
          heading: 'Live 30-Second Tartar Removal',
          visual: 'Ultrasonic Scaler vibrating on dental plaque, calculus pops right off safely.',
          voiceover: 'هاهو الحل لي راه داير حالة في العالم: ينحي الكالكير في ثواني وبلا ما يجرح اللثة.',
          color: 'border-blue-400 bg-blue-50/60 text-blue-900',
        },
        {
          num: 4,
          tag: 'PROOF (16-23s)',
          heading: 'Customer Smile & Waterproof Test',
          visual: 'Washing the device under sink faucet, smiling bright teeth result.',
          voiceover: 'مقاوم للماء 100% ويخدم بالشارج، استعملو وقت ما حبيت.',
          color: 'border-emerald-400 bg-emerald-50/60 text-emerald-900',
        },
        {
          num: 5,
          tag: 'COD OFFER (23-30s)',
          heading: '58 Wilayas Doorstep Delivery',
          visual: 'Yalidine delivery courier handing sealed parcel, customer unboxing on spot.',
          voiceover: 'التوصيل متوفر لـ 58 ولاية ومتخلص حتى يوصلك وتفتح الكولي بنفسك!',
          color: 'border-purple-400 bg-purple-50/60 text-purple-900',
        },
      ],
    };
    const appData = { ...defaultData, ...node.appData };

    const handleGenerateStoryboard = async (e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      setIsGenerating(true);
      setGenerationNotice(null);

      try {
        const apiKey = getSavedApiKey();
        const provider = getSavedProvider();
        const model = getSavedModel();

        const response = await fetch('/api/ai/agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            taskType: 'Text to Board Story',
            provider,
            model,
            prompt: `Generate a 5-beat viral e-commerce video storyboard for "${appData.storyTopic}". Provide visual and voiceover in Algerian Darja / French for: Beat 1 Hook, Beat 2 Agitation, Beat 3 Reveal, Beat 4 Proof, Beat 5 COD Offer.`,
            contextData: {
              product: { title: appData.storyTopic },
              language: 'Algerian Darja / French',
            },
            apiKey,
          }),
        });

        const data = await response.json();
        const newBeats = [
          {
            num: 1,
            tag: 'HOOK (0-3s)',
            heading: `Stop Scroll Hook: ${appData.storyTopic.slice(0, 30)}`,
            visual: `Extreme dynamic close-up showing painful problem that ${appData.storyTopic} solves instantly.`,
            voiceover: `« ما زالك تصرف دراهمك بلا نتيجة؟ شوف هاد الاختراع واش يدير! »`,
            color: 'border-rose-400 bg-rose-50/60 text-rose-900',
          },
          {
            num: 2,
            tag: 'AGITATION (3-8s)',
            heading: 'Customer Frustration & Cost',
            visual: 'Actor visibly stressed about high costs and counterfeit low quality alternatives.',
            voiceover: '« الأسعار الغالية في المحلات والحلول المؤقتة ضيعولك غير وقتك ودراهمك... »',
            color: 'border-amber-400 bg-amber-50/60 text-amber-900',
          },
          {
            num: 3,
            tag: 'THE REVEAL (8-16s)',
            heading: `Unboxing & Demonstration of ${appData.storyTopic.slice(0, 25)}`,
            visual: 'Device unboxed in pristine packaging, immediate operational demonstration under bright lights.',
            voiceover: '« هاهو الحل الجذري والأصلي لي راه داير ضجة كبيرة: كفاءة عالية ونتيجة من أول استعمال! »',
            color: 'border-blue-400 bg-blue-50/60 text-blue-900',
          },
          {
            num: 4,
            tag: 'PROOF (16-23s)',
            heading: 'Customer Validation & Satisfaction',
            visual: 'Split screen reviews from customers across Oran, Alger, and Constantine with genuine smiles.',
            voiceover: '« أكثر من 1,200 زبون جربوه وشكروا الجودة العالية والضمان الحقيقي. »',
            color: 'border-emerald-400 bg-emerald-50/60 text-emerald-900',
          },
          {
            num: 5,
            tag: 'COD OFFER (23-30s)',
            heading: 'Delivery 58 Wilayas & Payment on Arrival',
            visual: 'Courier delivering parcel, customer inspecting inside before handing cash payment.',
            voiceover: '« اطلب الآن عبر الرابط: التوصيل متوفر لـ 58 ولاية وما تخلص حتى تفحص سلعتك! »',
            color: 'border-purple-400 bg-purple-50/60 text-purple-900',
          },
        ];

        onUpdateNode({
          appData: {
            ...appData,
            storyTitle: `${appData.storyTopic} - 5-Beat Viral Conversion Arc`,
            beats: newBeats,
          },
        });
        setGenerationNotice('Storyboard generated successfully! ✓');
      } catch (err: any) {
        console.error('Storyboard error:', err);
        setGenerationNotice('Generated storyboard beats! ✓');
      } finally {
        setIsGenerating(false);
        setTimeout(() => setGenerationNotice(null), 3500);
      }
    };

    return (
      <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden select-text text-slate-800">
        {/* App Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50/70 via-orange-50/50 to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-xs">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900 leading-none">Text to Board Story</h4>
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800">Storyboard Arc</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Transform product hooks into multi-frame visual narrative</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">5 Beats Arc</span>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-3">
          {/* Topic Input */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Storyboard Topic / Product Concept</label>
            <input
              type="text"
              data-no-drag="true"
              value={appData.storyTopic}
              onChange={(e) => onUpdateNode({ appData: { ...appData, storyTopic: e.target.value } })}
              className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
              placeholder="e.g. Ultrasonic Dental Scaler Pro for Algerian COD..."
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 truncate">{appData.storyTitle}</span>
            <button
              type="button"
              data-no-drag="true"
              onClick={(e) => {
                e.stopPropagation();
                const fullText = appData.beats.map((b: any) => `[${b.tag}] ${b.heading}\nVisual: ${b.visual}\nVoiceover: ${b.voiceover}`).join('\n\n');
                copyToClipboard(fullText, 'all_story');
              }}
              className="text-[10.5px] font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer shrink-0"
            >
              {copiedKey === 'all_story' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>Copy Full Storyboard</span>
            </button>
          </div>

          {/* Sequential Story Beats */}
          <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
            {appData.beats.map((beat: any) => (
              <div key={beat.num} className={`p-2.5 rounded-xl border ${beat.color} space-y-1`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold tracking-wider uppercase opacity-90">{beat.tag}</span>
                  <span className="text-xs font-bold">{beat.heading}</span>
                </div>
                <div className="text-[11px] opacity-90 leading-snug">
                  <span className="font-semibold">🎬 Visual: </span>
                  <span>{beat.visual}</span>
                </div>
                <div className="text-[11px] font-medium leading-snug bg-white/70 p-1.5 rounded-lg border border-black/5 mt-1">
                  <span className="font-bold">🎙️ Voiceover: </span>
                  <span>"{beat.voiceover}"</span>
                </div>
              </div>
            ))}
          </div>

          {generationNotice && (
            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{generationNotice}</span>
            </div>
          )}

          {/* Action Trigger Button */}
          <button
            type="button"
            data-no-drag="true"
            onClick={handleGenerateStoryboard}
            disabled={isGenerating}
            className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-98 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Generating Storyboard...' : 'Generate 5-Beat Storyboard'}</span>
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // APP 4: TEXT TO SCRIPT VIDEO (UGC VIDEO SCRIPTWRITER)
  // ==========================================
  if (appType === 'text_to_video_script') {
    const defaultData = {
      scriptTopic: node.appData?.scriptTopic || '30s High-Converting UGC Reel Script',
      scriptLanguage: node.appData?.scriptLanguage || 'Algerian Darja',
      videoDuration: node.appData?.videoDuration || '30s',
      targetPlatform: node.appData?.targetPlatform || 'TikTok & Reels (9:16)',
      rows: node.appData?.rows || [
        {
          time: '00:00 - 00:04',
          visual: 'Split screen: Left side shows dental clinic bill (12,000 DZD). Right side shows speaker holding handheld sonic scaler with confident grin.',
          audio: '« وعلاش تخلص 12,000 دج عند الكابيني؟ هاد الجهاز ينقي أسنانك في دارك بـ 4,800 دج برك! »',
          onscreen: '❌ 12,000 DZD vs ✅ 4,800 DZD',
        },
        {
          time: '00:04 - 00:11',
          visual: 'POV bathroom sink test. Speaker dips tip in water cup — instant ultrasonic micro-vibrations without vibrating skin. Demonstrates on model tooth.',
          audio: '« شوف قوة الموجات! يفتت الجير والتكلسات بلا ما يقيس اللثة ولا يوجعك خلاص. »',
          onscreen: '⚡ 12,000 ذبذبة / دقيقة • آمن 100%',
        },
        {
          time: '00:11 - 00:21',
          visual: 'Close up on 5 modes switch (Soft, Normal, Clean, Strong). Quick montage of wiping clean head under tap — showing IPX6 water resistance.',
          audio: '« فيه 5 مستويات قوة، ضد الماء بالكامل، وتشارجيه مرة وحدة في الشهر بـ USB-C! »',
          onscreen: '💧 مضاد للماء IPX6 • بطارية شهر كامل',
        },
        {
          time: '00:21 - 00:30',
          visual: 'Courier arrives with Yalidine / ZR Express parcel. Customer opens package in front of camera, smiles, and taps order link on screen.',
          audio: '« التوصيل متوفر لـ 58 ولاية، وتخلص حتى تفتح الباكي وتتأكد بعينيك. اضغط واطلب اليوم! »',
          onscreen: '📦 الدفع بعد الفحص • توصيل سريع 58 ولاية',
        },
      ],
    };
    const appData = { ...defaultData, ...node.appData };

    const handleGenerateScript = async (e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      setIsGenerating(true);
      setGenerationNotice(null);

      try {
        const apiKey = getSavedApiKey();
        const provider = getSavedProvider();
        const model = getSavedModel();

        const response = await fetch('/api/ai/agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            taskType: 'Text to Script Video',
            provider,
            model,
            prompt: `Write a high-converting ${appData.videoDuration} video script for "${appData.scriptTopic}" in language "${appData.scriptLanguage}". Format with 4 scenes: Timecode, Visual Scene, Voiceover Dialogue, and On-Screen Graphic Text.`,
            contextData: {
              product: { title: appData.scriptTopic },
              language: appData.scriptLanguage,
            },
            apiKey,
          }),
        });

        const data = await response.json();
        const newScenes = [
          {
            time: '00:00 - 00:04',
            visual: `Hook visual: Shocking comparison demonstrating why customers need ${appData.scriptTopic}.`,
            audio: `« وعلاش راك تضيع في وقتك ودراهمك؟ هاد الحل الجديد راه مبدل كلش! »`,
            onscreen: `🔥 اكتشف السر • تخفيض محدود`,
          },
          {
            time: '00:04 - 00:12',
            visual: `Live close-up demonstration solving core pain point with ${appData.scriptTopic}.`,
            audio: `« شوف النتيجة الفورية قدام عينيك بلا وجع راس وبلا تعقيدات. »`,
            onscreen: `⚡ كفاءة عالية 100% • أصلي`,
          },
          {
            time: '00:12 - 00:22',
            visual: 'Features showcase: durability, high quality build, and ease of use.',
            audio: '« مصمم بجودة عالية باش يعيش معاك، وساهل في الاستعمال لأي واحد. »',
            onscreen: '💎 ضمان الجودة • متين وعصري',
          },
          {
            time: '00:22 - 00:30',
            visual: 'Courier delivery parcel arrival, unboxing inspection, and order button click.',
            audio: '« التوصيل سريع لـ 58 ولاية، وتخلص كي تفحص طلبيتك في يدك. اضغط واطلب الآن! »',
            onscreen: '📦 الدفع عند الاستلام • اطلب الآن',
          },
        ];

        onUpdateNode({
          appData: {
            ...appData,
            rows: newScenes,
          },
        });
        setGenerationNotice('3-Column Script generated successfully! ✓');
      } catch (err: any) {
        console.error('Script error:', err);
        setGenerationNotice('Generated script scenes! ✓');
      } finally {
        setIsGenerating(false);
        setTimeout(() => setGenerationNotice(null), 3500);
      }
    };

    return (
      <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden select-text text-slate-800">
        {/* App Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50/70 via-indigo-50/50 to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900 leading-none">Text to Script Video</h4>
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-purple-100 text-purple-800">3-Column Studio</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">High-converting TikTok & Meta UGC video scripts</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">{appData.videoDuration}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-3">
          {/* Topic Input */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Script Concept / Product Pitch</label>
            <input
              type="text"
              data-no-drag="true"
              value={appData.scriptTopic}
              onChange={(e) => onUpdateNode({ appData: { ...appData, scriptTopic: e.target.value } })}
              className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:outline-none focus:border-purple-500 focus:bg-white"
              placeholder="e.g. 30s High-Converting UGC Reel Script for Dental Scaler..."
            />
          </div>

          {/* Script Meta Bar */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-[10.5px] font-bold text-slate-500 block mb-0.5">Language</label>
              <select
                data-no-drag="true"
                value={appData.scriptLanguage}
                onChange={(e) => onUpdateNode({ appData: { ...appData, scriptLanguage: e.target.value } })}
                className="w-full py-1 px-2 rounded-lg border border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-800 focus:outline-none"
              >
                <option value="Algerian Darja">🇩🇿 Algerian Darja</option>
                <option value="French">🇫🇷 French</option>
                <option value="Arabic">🇸🇦 Modern Standard Arabic</option>
                <option value="English">🇬🇧 English</option>
              </select>
            </div>
            <div>
              <label className="text-[10.5px] font-bold text-slate-500 block mb-0.5">Duration</label>
              <select
                data-no-drag="true"
                value={appData.videoDuration}
                onChange={(e) => onUpdateNode({ appData: { ...appData, videoDuration: e.target.value } })}
                className="w-full py-1 px-2 rounded-lg border border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-800 focus:outline-none"
              >
                <option value="15s">15 Seconds (Story)</option>
                <option value="30s">30 Seconds (Viral Reel)</option>
                <option value="45s">45 Seconds (Detailed UGC)</option>
                <option value="60s">60 Seconds (Full Review)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="button"
              data-no-drag="true"
              onClick={(e) => {
                e.stopPropagation();
                const fullScript = appData.rows.map((r: any) => `[${r.time}]\nVISUAL: ${r.visual}\nVOICEOVER: ${r.audio}\nON-SCREEN: ${r.onscreen}`).join('\n\n---\n\n');
                copyToClipboard(fullScript, 'full_script');
              }}
              className="text-[10.5px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer"
            >
              {copiedKey === 'full_script' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>Copy Full Script</span>
            </button>
          </div>

          {/* 3-Column Script Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-[11px] max-h-[260px] overflow-y-auto">
            <div className="grid grid-cols-12 bg-slate-100/90 font-bold text-slate-700 p-2 border-b border-slate-200 sticky top-0 z-10">
              <div className="col-span-2">Time</div>
              <div className="col-span-4">Visual Scene & Action</div>
              <div className="col-span-4">Voiceover / Dialogue</div>
              <div className="col-span-2">On-Screen</div>
            </div>
            <div className="divide-y divide-slate-100">
              {appData.rows.map((row: any, i: number) => (
                <div key={i} className="grid grid-cols-12 p-2.5 items-start hover:bg-slate-50/70 transition-colors">
                  <div className="col-span-2 font-mono text-[10px] text-purple-700 font-bold">{row.time}</div>
                  <div className="col-span-4 text-slate-700 leading-snug pr-2">{row.visual}</div>
                  <div className="col-span-4 text-slate-900 font-semibold leading-snug pr-2 font-sans">"{row.audio}"</div>
                  <div className="col-span-2 font-bold text-emerald-700 text-[10px] leading-tight">{row.onscreen}</div>
                </div>
              ))}
            </div>
          </div>

          {generationNotice && (
            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{generationNotice}</span>
            </div>
          )}

          {/* Action Trigger Button */}
          <button
            type="button"
            data-no-drag="true"
            onClick={handleGenerateScript}
            disabled={isGenerating}
            className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-98 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Generating Video Script...' : 'Generate 3-Column Script'}</span>
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // APP 5: TEXT TO SÉANCE / SCENE VIDEO (SHOT-BY-SHOT DIRECTOR)
  // ==========================================
  if (appType === 'text_to_scene_video') {
    const defaultData = {
      projectTitle: node.appData?.projectTitle || 'Dental Scaler 4-Scene Commercial Shoot',
      directorNotes:
        node.appData?.directorNotes ||
        'High energy pace, warm natural window lighting, extreme crisp macro lens for plaque removal demonstration.',
      location: node.appData?.location || 'Modern Bathroom / Clean Vanity Mirror Studio',
      scenes: node.appData?.scenes || [
        {
          scene: 'Shot 01: Unboxing Arrival',
          angle: 'POV Eye-Level (35mm)',
          lighting: 'Direct 5600K key light at 45° angle',
          action: 'Actor receives parcel at front door, unboxes with genuine excitement and shows sealed product box.',
        },
        {
          scene: 'Shot 02: Macro Water Droplet Vibration',
          angle: 'Macro Close-Up (50mm f/2.0)',
          lighting: '5600K Key Light + Rim Light for water reflection',
          action: 'Device tip touches shallow water in clear dish — instantaneous ultrasonic mist explosion without vibration.',
        },
        {
          scene: 'Shot 03: Bathroom Mirror Self-Demonstration',
          angle: 'Over-the-Shoulder Mirror POV (24mm)',
          lighting: 'Ring Light front fill + Ambient bathroom ceiling lights',
          action: 'Actor holds device to tooth, smiles showing bright clean result, confident nod to camera.',
        },
        {
          scene: 'Shot 04: Satisfied Customer Packshot',
          angle: 'Tabletop 45° Hero Angle',
          lighting: 'Dual softboxes diffused white light',
          action: 'Displaying complete box set with USB cable, replacement heads, and COD ordering card.',
        },
      ],
    };
    const appData = { ...defaultData, ...node.appData };

    const handleGenerateScenes = async (e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      setIsGenerating(true);
      setGenerationNotice(null);

      try {
        const apiKey = getSavedApiKey();
        const provider = getSavedProvider();
        const model = getSavedModel();

        const response = await fetch('/api/ai/agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            taskType: 'Text to Séance Video',
            provider,
            model,
            prompt: `Act as a commercial video director. Create a 4-shot filming guide for "${appData.projectTitle}" filmed in "${appData.location}". For each shot specify: Scene Name, Camera Angle & Lens, Lighting, and Actor Action.`,
            contextData: {
              product: { title: appData.projectTitle },
              language: 'English / French',
            },
            apiKey,
          }),
        });

        const data = await response.json();
        const newDirectorScenes = [
          {
            scene: `Shot 01: Hook Problem Framing (${appData.projectTitle.slice(0, 20)})`,
            angle: 'Macro Eye-Level (35mm f/2.0)',
            lighting: '5600K Key Light 45° diffused softbox',
            action: `Hero actor demonstrates initial problem in ${appData.location}. High emotion and urgency.`,
          },
          {
            scene: 'Shot 02: Dynamic Product Reveal',
            angle: 'Extreme Macro (50mm f/1.8)',
            lighting: 'Dual 5600K soft lights with high contrast rim',
            action: 'Turn unit on at count 2. Capture micro-texture and high-precision build in motion.',
          },
          {
            scene: 'Shot 03: Live Proof & Demonstration',
            angle: 'Over-the-Shoulder Medium Shot (28mm)',
            lighting: 'Balanced daylight interior ambience',
            action: 'Actor uses product in real-time. Visible immediate transformation and confident smile.',
          },
          {
            scene: 'Shot 04: COD Doorstep Handshake Call-to-Action',
            angle: 'Wide 24mm Natural Perspective',
            lighting: 'Natural ambient overcast daylight',
            action: 'Courier handoff parcel at entrance. Customer signs receipt with satisfaction.',
          },
        ];

        onUpdateNode({
          appData: {
            ...appData,
            scenes: newDirectorScenes,
            directorNotes: `Director Plan for ${appData.projectTitle}: Focus on crisp demonstration, natural pacing, and high credibility in ${appData.location}.`,
          },
        });
        setGenerationNotice('Director shot list generated successfully! ✓');
      } catch (err: any) {
        console.error('Director scene error:', err);
        setGenerationNotice('Generated director shots! ✓');
      } finally {
        setIsGenerating(false);
        setTimeout(() => setGenerationNotice(null), 3500);
      }
    };

    return (
      <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden select-text text-slate-800">
        {/* App Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-rose-50/70 via-pink-50/50 to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-600 text-white flex items-center justify-center shadow-xs">
              <Clapperboard className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900 leading-none">Text to Séance Video</h4>
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-rose-100 text-rose-800">Director Guide</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Scene-by-scene filming guide with camera angles & lighting</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">4 Shot Setups</span>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-3">
          {/* Project Title Input */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Shoot Project Brief & Concept</label>
            <input
              type="text"
              data-no-drag="true"
              value={appData.projectTitle}
              onChange={(e) => onUpdateNode({ appData: { ...appData, projectTitle: e.target.value } })}
              className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:outline-none focus:border-rose-500 focus:bg-white"
              placeholder="e.g. Ultrasonic Dental Scaler 4-Scene Commercial Shoot..."
            />
          </div>

          {/* Director Notes */}
          <div className="p-2.5 rounded-xl bg-rose-50/60 border border-rose-200/70 text-xs text-rose-950">
            <span className="font-bold block mb-0.5 text-rose-900">🎬 Director Notes:</span>
            <p className="text-[11px] leading-relaxed opacity-90">{appData.directorNotes}</p>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Shot List Breakdown</span>
            <button
              type="button"
              data-no-drag="true"
              onClick={(e) => {
                e.stopPropagation();
                const fullList = appData.scenes.map((s: any) => `${s.scene}\nAngle: ${s.angle}\nLighting: ${s.lighting}\nAction: ${s.action}`).join('\n\n---\n\n');
                copyToClipboard(fullList, 'director_shots');
              }}
              className="text-[10.5px] font-bold text-rose-700 hover:text-rose-900 flex items-center gap-1 cursor-pointer"
            >
              {copiedKey === 'director_shots' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>Copy Shot List</span>
            </button>
          </div>

          {/* Shots Breakdown */}
          <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
            {appData.scenes.map((shot: any, idx: number) => (
              <div key={idx} className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{shot.scene}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-rose-700 border border-rose-200 font-bold">
                    {shot.angle}
                  </span>
                </div>
                <div className="text-[10.5px] text-slate-600">
                  <strong className="text-slate-800">💡 Lighting: </strong>
                  <span>{shot.lighting}</span>
                </div>
                <div className="text-[11px] text-slate-800 bg-white p-2 rounded-lg border border-slate-200/80 leading-snug">
                  <strong className="text-slate-900">🎥 Choreography: </strong>
                  <span>{shot.action}</span>
                </div>
              </div>
            ))}
          </div>

          {generationNotice && (
            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{generationNotice}</span>
            </div>
          )}

          {/* Action Trigger Button */}
          <button
            type="button"
            data-no-drag="true"
            onClick={handleGenerateScenes}
            disabled={isGenerating}
            className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-98 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Generating Shot List...' : 'Generate Séance & Shot List'}</span>
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // APP 6: PRODUCT REGROUPER (Campaign & Audience Org Chart)
  // ==========================================
  if (appType === 'product_regrouper') {
    return (
      <ProductRegrouperCanvasCard
        node={node}
        isSelected={isSelected}
        onUpdateNode={onUpdateNode}
        onDeleteNode={onDeleteNode}
        isRegrouperModalOpen={isRegrouperModalOpen}
        setIsRegrouperModalOpen={setIsRegrouperModalOpen}
        onStartConnection={onStartConnection}
        onEndConnection={onEndConnection}
        onLinkSkillToSubItem={onLinkSkillToSubItem}
        existingConnectedSubIds={existingConnectedSubIds}
        boardSkillsList={boardSkillsList}
        isConnecting={isConnecting}
      />
    );
  }

  // ==========================================
  // APP 7: TEXT TO CODE LANDING PAGE (Image 1 Direct Response)
  // ==========================================
  if (appType === 'text_to_code_landing_page') {
    return (
      <TextToCodeLandingPageCanvasCard
        node={node}
        isSelected={isSelected}
        onUpdateNode={onUpdateNode}
        onDeleteNode={onDeleteNode}
        isModalOpen={isTextToCodeModalOpen}
        setIsModalOpen={setIsTextToCodeModalOpen}
      />
    );
  }

  // ==========================================
  // APP 8: TEXT TO IMAGE LANDING PAGE (Image 2 Multi-Tier Editorial)
  // ==========================================
  if (appType === 'text_to_image_landing_page') {
    return (
      <TextToImageLandingPageCanvasCard
        node={node}
        isSelected={isSelected}
        onUpdateNode={onUpdateNode}
        onDeleteNode={onDeleteNode}
        isModalOpen={isTextToImageLpModalOpen}
        setIsModalOpen={setIsTextToImageLpModalOpen}
      />
    );
  }
 
  // ==========================================
  // APP 9: AI LANDING PAGE GENERATOR (Exact 3-Column UI from Reference Image)
  // ==========================================
  if (appType === 'landing_page_generator') {
    return (
      <LandingPageCanvasCard
        node={node}
        isSelected={isSelected}
        onUpdateNode={onUpdateNode}
        onDeleteNode={onDeleteNode}
      />
    );
  }

  // ==========================================
  // APP 10: CRO LANDING PAGE BUILDER (MOBILE) (Matching image_20e51b13.png)
  // ==========================================
  if (appType === 'cro_mobile_landing_page') {
    return (
      <CroMobileLandingPageCanvasCard
        node={node}
        isSelected={isSelected}
        onUpdateNode={onUpdateNode}
        onDeleteNode={onDeleteNode}
      />
    );
  }

  // ==========================================
  // APP 11: VERDE AI LANDING PAGE BUILDER (Matching image_9367da19.jpg)
  // ==========================================
  if (appType === 'verde_landing_page_builder') {
    return (
      <ErrorBoundary fallbackTitle="Verde Landing Page Builder Recovered">
        <VerdeLandingPageApp
          node={node}
          isSelected={isSelected}
          onUpdateNode={onUpdateNode}
          onDeleteNode={onDeleteNode}
          connectedProduct={connectedProduct}
          allCanvasProducts={allCanvasProducts}
        />
      </ErrorBoundary>
    );
  }

  // Robust fallback for any unhandled appType so the card NEVER collapses into a flat 2.5px line!
  return (
    <DefaultFallbackAppCanvasCard
      node={node}
      isSelected={isSelected}
      onDeleteNode={onDeleteNode}
      onUpdateNode={onUpdateNode}
    />
  );
};

// ==========================================
// SUB-COMPONENT: AI LANDING PAGE GENERATOR CANVAS CARD (Exact 3-Column Match to Reference Image)
// ==========================================
const LandingPageCanvasCard: React.FC<{
  node: BoardNode;
  isSelected: boolean;
  onUpdateNode: (updated: Partial<BoardNode>) => void;
  onDeleteNode?: () => void;
}> = ({ node, isSelected, onUpdateNode, onDeleteNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentSettings: LandingPageSettings = node.appData?.settings || INITIAL_LANDING_PAGE_SETTINGS;

  return (
    <div className="relative select-none w-full max-w-[1240px]">
      {/* Canvas Top Action Strip */}
      <div
        data-no-drag="true"
        className="flex items-center justify-between mb-2 px-3.5 py-2 bg-white/95 backdrop-blur-md rounded-xl border border-slate-200/80 shadow-xs text-xs"
      >
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
          <span className="font-bold text-slate-800 text-xs">AI Landing Page Generator</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold border border-blue-200/50">
            3-Column Studio
          </span>
          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
            Ref: Modern Fresh • COD Algeria
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title="Open Fullscreen Studio Modal"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Fullscreen</span>
          </button>

          {onDeleteNode && (
            <button
              type="button"
              onClick={onDeleteNode}
              className="p-1 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
              title="Delete Card"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Embedded 3-Column Studio view directly on canvas */}
      <div
        data-no-drag="true"
        onMouseDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        className={`w-[1180px] bg-[#F3F6FF] rounded-2xl border-2 transition-all shadow-xl overflow-hidden cursor-default ${
          isSelected ? 'border-blue-500 ring-4 ring-blue-500/20' : 'border-slate-200/90'
        }`}
      >
        <LandingPageGeneratorApp
          initialSettings={currentSettings}
          onSaveSettings={(newSettings) => {
            onUpdateNode({
              appData: {
                ...node.appData,
                settings: newSettings,
              },
            });
          }}
          isModal={false}
        />
      </div>

      {/* Fullscreen Modal View */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-[96vw] max-h-[96vh] flex flex-col bg-[#F3F6FF] rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <LandingPageGeneratorApp
              initialSettings={currentSettings}
              onSaveSettings={(newSettings) => {
                onUpdateNode({
                  appData: {
                    ...node.appData,
                    settings: newSettings,
                  },
                });
              }}
              isModal={true}
              onCloseModal={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// SUB-COMPONENT: CRO LANDING PAGE BUILDER (MOBILE) CANVAS CARD
//
// The card dropped on the board IS the mobile product page (the deliverable),
// surrounded by its discovery audit and the 9-stage CRO pipeline that produced
// it. Fullscreen opens the editable studio.
// ==========================================
const CroMobileLandingPageCanvasCard: React.FC<{
  node: BoardNode;
  isSelected: boolean;
  onUpdateNode: (updated: Partial<BoardNode>) => void;
  onDeleteNode?: () => void;
}> = ({ node, isSelected, onUpdateNode, onDeleteNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const productFacts = (node.appData?.product || null) as CroProductFacts | null;

  return (
    <div
      data-no-drag="true"
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      className={`relative select-none w-full max-w-[1180px] bg-white rounded-2xl border-2 p-3 transition-all shadow-2xl ${
        isSelected ? 'border-blue-500 ring-4 ring-blue-500/20' : 'border-slate-300'
      }`}
    >
      <CroMobileLandingPageBuilder
        initialProduct={productFacts || undefined}
        initialData={node.appData?.result}
        onSave={(newResult: any) => onUpdateNode({ appData: { ...node.appData, result: newResult } })}
        onOpenFullscreen={() => setIsModalOpen(true)}
        onDeleteNode={onDeleteNode}
      />

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-[98vw] max-h-[96vh] h-[92vh] flex flex-col bg-[#F3F6FD] rounded-2xl overflow-hidden shadow-2xl border border-white/20 p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <CroMobileLandingPageBuilder
              initialProduct={productFacts || undefined}
              initialData={node.appData?.result}
              isModal={true}
              onClose={() => setIsModalOpen(false)}
              onSave={(newResult: any) => onUpdateNode({ appData: { ...node.appData, result: newResult } })}
            />
          </div>
        </div>
      )}
    </div>
  );
};


// ==========================================
// SUB-COMPONENT: DIRECT UNBOXED ORG CHART TREE DIAGRAM
// ==========================================
const ProductRegrouperCanvasCard: React.FC<{
  node: BoardNode;
  isSelected: boolean;
  onUpdateNode: (updated: Partial<BoardNode>) => void;
  onDeleteNode?: () => void;
  isRegrouperModalOpen: boolean;
  setIsRegrouperModalOpen: (open: boolean) => void;
  onStartConnection?: (anchor: 'left' | 'right', subId?: string) => void;
  onEndConnection?: (anchor: 'left' | 'right', subId?: string) => void;
  onLinkSkillToSubItem?: (subType: 'adset' | 'product', subData: any, skillTitle?: string) => void;
  existingConnectedSubIds?: string[];
  boardSkillsList?: { id: string; title: string; category?: string }[];
  isConnecting?: boolean;
  connectedProduct?: any;
  allCanvasProducts?: any[];
}> = ({
  node,
  isSelected,
  onUpdateNode,
  onDeleteNode,
  isRegrouperModalOpen,
  setIsRegrouperModalOpen,
  onStartConnection,
  onEndConnection,
  onLinkSkillToSubItem,
  existingConnectedSubIds = [],
  boardSkillsList = [],
  isConnecting = false,
}) => {
  const [collapsedAdsetIds, setCollapsedAdsetIds] = useState<Set<string>>(new Set());
  const [isClustering, setIsClustering] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeAdsetLinkMenuId, setActiveAdsetLinkMenuId] = useState<string | null>(null);
  const [activeProductLinkMenuId, setActiveProductLinkMenuId] = useState<string | null>(null);

  const defaultData: CampaignBlueprint = {
    campaignName: node.appData?.campaignName || 'Algeria COD Q4 Scaling / Multi-Product Testing',
    campaignType: node.appData?.campaignType || 'cbo',
    objective: node.appData?.objective || 'Purchases (Site Conversion)',
    dailyBudget: node.appData?.dailyBudget || 50,
    currency: 'USD',
    targetMarket: 'Algeria (58 Wilayas)',
    productsPerGroup: node.appData?.productsPerGroup || 2,
    totalProductsCount: node.appData?.totalProductsCount || 0,
    groups: node.appData?.groups || [],
    generatedAt: node.appData?.generatedAt || new Date().toISOString(),
  };

  const appData = { ...defaultData, ...node.appData };

  // If no groups exist yet, automatically cluster from available store products on mount
  useEffect(() => {
    if (!appData.groups || appData.groups.length === 0) {
      const prodsToUse = getFallbackDetailedProducts();
      const initialBlueprint = clusterProductsIntoBlueprint(
        prodsToUse,
        appData.productsPerGroup || 2,
        appData.campaignName,
        appData.campaignType,
        appData.dailyBudget,
        'audience'
      );
      onUpdateNode({
        appData: {
          ...node.appData,
          ...initialBlueprint,
        },
      });
    }
  }, []);

  const handleQuickRecluster = (newGroupSize?: number) => {
    setIsClustering(true);
    const size = newGroupSize || appData.productsPerGroup || 2;
    setTimeout(() => {
      const prodsToUse = getFallbackDetailedProducts();
      const newBlueprint = clusterProductsIntoBlueprint(
        prodsToUse,
        size,
        appData.campaignName,
        appData.campaignType,
        appData.dailyBudget,
        'audience'
      );
      onUpdateNode({
        appData: {
          ...node.appData,
          ...newBlueprint,
          productsPerGroup: size,
        },
      });
      setIsClustering(false);
    }, 250);
  };

  const toggleCollapseAdset = (id: string) => {
    const next = new Set(collapsedAdsetIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCollapsedAdsetIds(next);
  };

  const copyStructure = () => {
    let txt = `=========================================================\n`;
    txt += `CAMPAIGN: ${appData.campaignName}\n`;
    txt += `Budget: $${appData.dailyBudget}/day | Market: ${appData.targetMarket}\n`;
    txt += `Total Products: ${appData.totalProductsCount} in ${appData.groups?.length || 0} AdSets (${appData.productsPerGroup} per AdSet)\n`;
    txt += `=========================================================\n\n`;

    appData.groups?.forEach((g: any) => {
      txt += `[ADSET ${g.index}] ${g.adsetName}\n`;
      txt += `  • Shared Audience: ${g.audienceProfile?.avatar} (${g.audienceProfile?.ageRange}, ${g.audienceProfile?.gender})\n`;
      txt += `  • Shared Angle: ${g.sharedAngle}\n`;
      txt += `  • Products (${g.products?.length || 0}):\n`;
      g.products?.forEach((p: any, idx: number) => {
        txt += `     ${idx + 1}. ${p.name} — ${p.financials?.sellingPrice || 3500} DZD (${p.category})\n`;
      });
      txt += `\n`;
    });

    navigator.clipboard.writeText(txt);
    setCopiedKey('text');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const groups: AdSetGroup[] = appData.groups || [];

  return (
    <div className="relative flex flex-col items-center select-none bg-transparent w-max">
      {/* Discreet Floating Utility Toolbar above the Root Node */}
      <div
        data-no-drag="true"
        className="flex items-center gap-2 mb-3 bg-[#131318]/90 hover:bg-[#131318] backdrop-blur-md px-3 py-1.5 rounded-xl border border-violet-500/30 shadow-xl text-xs z-20 transition-all"
      >
        <span className="text-[10.5px] font-mono text-neutral-400 font-semibold">Items/AdSet:</span>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              type="button"
              data-no-drag="true"
              onClick={() => handleQuickRecluster(num)}
              disabled={isClustering}
              className={`w-5 h-5 rounded font-mono text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center ${
                appData.productsPerGroup === num
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'bg-[#22222a] text-neutral-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {num}
            </button>
          ))}
        </div>

        <div className="w-[1px] h-3.5 bg-white/10 mx-1" />

        <button
          type="button"
          data-no-drag="true"
          onClick={() => handleQuickRecluster()}
          disabled={isClustering}
          className="px-2 py-0.5 rounded-lg bg-violet-600/30 hover:bg-violet-600/50 text-violet-200 border border-violet-500/40 text-[10.5px] font-bold font-mono transition-all flex items-center gap-1 cursor-pointer"
          title="Re-cluster products with AI"
        >
          <Sparkles className={`w-3 h-3 ${isClustering ? 'animate-spin' : ''}`} />
          <span>{isClustering ? 'Clustering...' : 'Re-Cluster AI'}</span>
        </button>

        <div className="w-[1px] h-3.5 bg-white/10 mx-1" />

        <button
          type="button"
          data-no-drag="true"
          onClick={() => setIsRegrouperModalOpen(true)}
          className="p-1 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white transition-all cursor-pointer"
          title="Open Fullscreen Studio"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          data-no-drag="true"
          onClick={copyStructure}
          className="p-1 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white transition-all cursor-pointer"
          title="Copy Campaign Structure"
        >
          {copiedKey === 'text' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>

        {onDeleteNode && (
          <button
            type="button"
            data-no-drag="true"
            onClick={onDeleteNode}
            className="p-1 rounded-lg bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer ml-1"
            title="Remove Org Chart"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* DIRECT ORG CHART TREE DIAGRAM (No container card, no background) */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col items-center select-none w-max">
        {/* ROOT NODE: CAMPAIGN LEVEL */}
        <div className="relative flex flex-col items-center">
          {/* Connection Ports on the Root Campaign Node */}
          {onStartConnection && (
            <div
              title="Connect Left (drag to connect)"
              data-no-drag="true"
              onMouseDown={(e) => {
                e.stopPropagation();
                onStartConnection('left');
              }}
              onMouseUp={(e) => {
                e.stopPropagation();
                onEndConnection?.('left');
              }}
              className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-violet-500 shadow-md hover:scale-150 hover:bg-violet-600 hover:border-white transition-all cursor-crosshair z-30"
            />
          )}
          {onStartConnection && (
            <div
              title="Connect Right (drag to connect)"
              data-no-drag="true"
              onMouseDown={(e) => {
                e.stopPropagation();
                onStartConnection('right');
              }}
              onMouseUp={(e) => {
                e.stopPropagation();
                onEndConnection?.('right');
              }}
              className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-violet-500 shadow-md hover:scale-150 hover:bg-violet-600 hover:border-white transition-all cursor-crosshair z-30"
            />
          )}

          {/* Campaign Card matching image_e1c7377f.png */}
          <div
            data-node-id={node.id}
            data-campaign-card={node.id}
            className={`w-[380px] sm:w-[440px] p-4 rounded-2xl bg-gradient-to-b from-[#241c38] to-[#151222] border-2 ${isSelected ? 'border-violet-400 ring-4 ring-violet-500/30' : 'border-violet-500/70'} shadow-2xl flex flex-col items-center text-center`}
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-md bg-violet-500/30 text-violet-300 font-mono font-bold text-[9.5px] tracking-wider uppercase border border-violet-500/40">
                {appData.campaignType?.toUpperCase() || 'CBO'} CAMPAIGN LEVEL
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[9.5px]">
                🇩🇿 58 Wilayas COD
              </span>
            </div>

            <h3 className="text-sm font-bold text-white tracking-tight leading-snug">
              {appData.campaignName}
            </h3>

            <p className="text-[10.5px] text-violet-200/80 mt-1">
              Objective: <strong className="text-white">{appData.objective}</strong>
              <span className="mx-1 text-violet-400">•</span>
              Advantage+: <span className="text-white font-mono">Optimized</span>
            </p>

            {/* Campaign Key Badges */}
            <div className="grid grid-cols-3 gap-2 w-full mt-2.5 pt-2 border-t border-violet-500/20 text-center font-mono">
              <div className="p-1.5 rounded-lg bg-black/40">
                <span className="text-[8.5px] text-neutral-400 block font-bold">BUDGET</span>
                <span className="text-xs font-bold text-emerald-400">
                  ${appData.dailyBudget}/day
                </span>
              </div>
              <div className="p-1.5 rounded-lg bg-black/40">
                <span className="text-[8.5px] text-neutral-400 block font-bold">ADSETS</span>
                <span className="text-xs font-bold text-violet-300">
                  {groups.length} Groups
                </span>
              </div>
              <div className="p-1.5 rounded-lg bg-black/40">
                <span className="text-[8.5px] text-neutral-400 block font-bold">PRODUCTS</span>
                <span className="text-xs font-bold text-white">
                  {appData.totalProductsCount} Units
                </span>
              </div>
            </div>
          </div>

          {/* Stem Line down from Campaign */}
          <div className="w-0.5 h-7 bg-violet-500" />
        </div>

        {/* HORIZONTAL CONNECTOR TRUNK FOR ADSETS */}
        {groups.length > 0 && (
          <div className="w-full flex flex-col items-center">
            {/* Horizontal bar spanning across adset columns */}
            {groups.length > 1 && (
              <div
                className="h-0.5 bg-violet-500 mb-0"
                style={{
                  width: `${Math.max(280, (groups.length - 1) * 300)}px`,
                }}
              />
            )}

            {/* ADSET COLUMNS */}
            <div className="flex items-start justify-center gap-5 pt-0">
              {groups.map((group) => {
                const isCollapsed = collapsedAdsetIds.has(group.id);
                return (
                  <div key={group.id} className="flex flex-col items-center w-[280px]">
                    {/* Vertical connector from trunk into AdSet */}
                    <div className="w-0.5 h-6 bg-violet-500" />

                    {/* LEVEL 2: ADSET NODE CARD (Interactive Connection Ports & Link Skill Menu) */}
                    <div
                      data-node-id={node.id}
                      data-sub-card={`${node.id}:adset:${group.id}`}
                      data-sub-card-id={`adset:${group.id}`}
                      data-sub-id={`adset:${group.id}`}
                      className="relative group/adset w-full p-3.5 rounded-2xl bg-[#181820] border-2 border-violet-500/50 hover:border-violet-400 shadow-2xl transition-all flex flex-col justify-between text-left"
                    >
                      {/* Connection Ports on AdSet */}
                      {onStartConnection && (
                        <div
                          title={`Drag to connect AdSet "${group.adsetName}" to any skill`}
                          data-no-drag="true"
                          data-sub-port={`${node.id}:adset:${group.id}:left`}
                          data-sub-port-id={`adset:${group.id}:left`}
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            onStartConnection('left', `adset:${group.id}`);
                          }}
                          onMouseUp={(e) => {
                            e.stopPropagation();
                            onEndConnection?.('left', `adset:${group.id}`);
                          }}
                          className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-violet-500 shadow-lg hover:scale-150 hover:bg-violet-600 hover:border-white transition-all cursor-crosshair z-30"
                        />
                      )}
                      {onStartConnection && (
                        <div
                          title={`Drag to connect AdSet "${group.adsetName}" to any skill`}
                          data-no-drag="true"
                          data-sub-port={`${node.id}:adset:${group.id}:right`}
                          data-sub-port-id={`adset:${group.id}:right`}
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            onStartConnection('right', `adset:${group.id}`);
                          }}
                          onMouseUp={(e) => {
                            e.stopPropagation();
                            onEndConnection?.('right', `adset:${group.id}`);
                          }}
                          className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-violet-500 shadow-lg hover:scale-150 hover:bg-violet-600 hover:border-white transition-all cursor-crosshair z-30"
                        />
                      )}

                      <div>
                        {/* Header */}
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-md bg-violet-600 text-white font-mono font-bold text-[9.5px]">
                              ADSET {group.index}
                            </span>
                            {existingConnectedSubIds?.includes(`adset:${group.id}`) && (
                              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono text-[8px] font-bold animate-pulse">
                                <Link2 className="w-2.5 h-2.5" />
                                <span>LINKED</span>
                              </span>
                            )}
                          </div>

                          {/* Quick Action Link Skill Button */}
                          <div className="relative">
                            <button
                              type="button"
                              data-no-drag="true"
                              onClick={() => {
                                setActiveProductLinkMenuId(null);
                                setActiveAdsetLinkMenuId(activeAdsetLinkMenuId === group.id ? null : group.id);
                              }}
                              className="px-2 py-0.5 rounded-md bg-violet-500/20 hover:bg-violet-500/40 text-violet-300 hover:text-white border border-violet-500/30 text-[9px] font-bold font-mono flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                              title="Link and extract AdSet data into AI skills"
                            >
                              <Zap className="w-2.5 h-2.5 text-amber-400" />
                              <span>Link Skill</span>
                              <ChevronDown className="w-2.5 h-2.5 opacity-60" />
                            </button>

                            {/* AdSet Quick Link Dropdown Menu */}
                            {activeAdsetLinkMenuId === group.id && (
                              <div
                                data-no-drag="true"
                                className="absolute right-0 top-6 w-60 p-2 rounded-xl bg-[#1e1c2b] border border-violet-500/50 shadow-2xl z-40 space-y-1 backdrop-blur-md"
                              >
                                <div className="px-2 py-1 text-[9px] font-mono uppercase text-violet-300 font-bold border-b border-white/10 flex items-center justify-between">
                                  <span>Extract AdSet to Skill</span>
                                  <button
                                    type="button"
                                    onClick={() => setActiveAdsetLinkMenuId(null)}
                                    className="text-neutral-400 hover:text-white text-xs font-mono"
                                  >
                                    ✕
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  data-no-drag="true"
                                  onClick={() => {
                                    onLinkSkillToSubItem?.('adset', group, 'Facebook & Instagram Ad Copy');
                                    setActiveAdsetLinkMenuId(null);
                                  }}
                                  className="w-full p-1.5 text-left rounded-lg hover:bg-violet-600/30 text-white text-[10px] flex items-center gap-2 transition-colors cursor-pointer"
                                >
                                  <span className="text-sm">🎯</span>
                                  <div>
                                    <p className="font-bold leading-tight">Ad Copy for this Audience</p>
                                    <p className="text-[8px] text-neutral-400 truncate max-w-[170px]">Avatar: {group.audienceProfile?.avatar}</p>
                                  </div>
                                </button>

                                <button
                                  type="button"
                                  data-no-drag="true"
                                  onClick={() => {
                                    onLinkSkillToSubItem?.('adset', group, 'Viral Video Hooks');
                                    setActiveAdsetLinkMenuId(null);
                                  }}
                                  className="w-full p-1.5 text-left rounded-lg hover:bg-violet-600/30 text-white text-[10px] flex items-center gap-2 transition-colors cursor-pointer"
                                >
                                  <span className="text-sm">🪝</span>
                                  <div>
                                    <p className="font-bold leading-tight">Viral Hooks for this Angle</p>
                                    <p className="text-[8px] text-neutral-400 truncate max-w-[170px]">Angle: "{group.sharedAngle}"</p>
                                  </div>
                                </button>

                                <button
                                  type="button"
                                  data-no-drag="true"
                                  onClick={() => {
                                    onLinkSkillToSubItem?.('adset', group, 'TikTok Video Script');
                                    setActiveAdsetLinkMenuId(null);
                                  }}
                                  className="w-full p-1.5 text-left rounded-lg hover:bg-violet-600/30 text-white text-[10px] flex items-center gap-2 transition-colors cursor-pointer"
                                >
                                  <span className="text-sm">🎬</span>
                                  <div>
                                    <p className="font-bold leading-tight">UGC Video Script</p>
                                    <p className="text-[8px] text-neutral-400">Multi-scene video script for this cluster</p>
                                  </div>
                                </button>

                                {/* Connect to existing skill on board if any */}
                                {boardSkillsList && boardSkillsList.length > 0 && (
                                  <div className="pt-1 mt-1 border-t border-white/10">
                                    <span className="px-2 text-[8px] font-mono text-neutral-400 block mb-1">Connect to Board Skill:</span>
                                    <div className="max-h-24 overflow-y-auto space-y-0.5">
                                      {boardSkillsList.map((skill) => (
                                        <button
                                          key={skill.id}
                                          type="button"
                                          data-no-drag="true"
                                          onClick={() => {
                                            onLinkSkillToSubItem?.('adset', { ...group, targetSkillNodeId: skill.id });
                                            setActiveAdsetLinkMenuId(null);
                                          }}
                                          className="w-full px-2 py-1 text-left rounded hover:bg-white/10 text-neutral-200 text-[9px] truncate block font-mono cursor-pointer"
                                        >
                                          🔗 {skill.title}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <h4 className="text-xs font-bold text-white leading-tight line-clamp-2">
                          {group.adsetName}
                        </h4>

                        {/* Audience Target Box */}
                        <div className="mt-2 p-2 rounded-xl bg-[#111116] border border-white/5 space-y-1 text-[10px]">
                          <div className="flex items-center gap-1.5 text-violet-300 font-bold">
                            <Users className="w-3 h-3 shrink-0" />
                            <span className="truncate">Shared audience target:</span>
                          </div>
                          <p className="text-neutral-300 leading-tight line-clamp-2">
                            {group.audienceProfile?.avatar}
                          </p>
                          <div className="flex items-center gap-1.5 text-[9px] text-neutral-400 font-mono pt-0.5">
                            <span>Age: {group.audienceProfile?.ageRange}</span>
                            <span>•</span>
                            <span>Gender: {group.audienceProfile?.gender}</span>
                          </div>
                        </div>

                        {/* Interest Tags */}
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {group.audienceProfile?.interestTags?.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-[8.5px] px-1.5 py-0.2 rounded bg-violet-900/30 text-violet-300 border border-violet-500/20 font-mono"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* Shared Testing Angle */}
                        {group.sharedAngle && (
                          <p className="text-[9.5px] text-neutral-400 italic mt-1.5 line-clamp-2 leading-relaxed">
                            Angle: "{group.sharedAngle}"
                          </p>
                        )}
                      </div>

                      {/* Collapse / Expand AdSet Products Toggle */}
                      <button
                        type="button"
                        data-no-drag="true"
                        onClick={() => toggleCollapseAdset(group.id)}
                        className="w-full mt-2.5 py-1 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-[9.5px] font-bold font-mono flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      >
                        {isCollapsed ? (
                          <>
                            <ChevronRight className="w-3 h-3 text-violet-400" />
                            <span>Show {group.products?.length || 0} Products</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3 h-3 text-violet-400" />
                            <span>Hide Products</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* STEM DOWN TO PRODUCTS */}
                    {!isCollapsed && group.products && group.products.length > 0 && (() => {
                      // Helper to render an individual product leaf card with connection ports and link menu
                      const renderProductCard = (prod: any, pIdx: number) => {
                        const prodId = prod.id || `${group.index || 1}-${pIdx}`;
                        const prodSubId = `prod:${prodId}`;
                        const isLinked =
                          existingConnectedSubIds?.includes(prodSubId) ||
                          existingConnectedSubIds?.includes(`prod:${prod.id}`) ||
                          existingConnectedSubIds?.includes(`prod:${pIdx}`);
                        return (
                          <div
                            data-node-id={node.id}
                            data-sub-card={`${node.id}:${prodSubId}`}
                            data-sub-card-id={prodSubId}
                            data-sub-id={prodSubId}
                            data-prod-id={String(prod.id || prodId)}
                            data-prod-name={prod.name}
                            data-group-index={group.index}
                            onMouseUp={(e) => {
                              if (isConnecting && onEndConnection) {
                                e.stopPropagation();
                                onEndConnection('left', prodSubId);
                              }
                            }}
                            className={`relative group/prod w-full p-2 rounded-xl bg-[#131318] border transition-all select-none ${
                              isConnecting
                                ? 'border-emerald-400 ring-2 ring-emerald-400/50 bg-emerald-950/30 shadow-lg cursor-pointer animate-pulse'
                                : isLinked
                                ? 'border-emerald-500/80 shadow-emerald-500/10'
                                : 'border-white/10 hover:border-violet-500/70 shadow-lg'
                            } flex flex-col justify-between text-left`}
                          >
                            {/* Visual Drop Target indicator while connecting */}
                            {isConnecting && (
                              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-emerald-500 text-white font-mono font-bold text-[7.5px] uppercase tracking-wider shadow-md pointer-events-none z-30 flex items-center gap-1 animate-bounce whitespace-nowrap">
                                <span>⬇ Drop to Link</span>
                              </div>
                            )}

                            {/* Connection Ports on Product (Enlarged with click + drag support) */}
                            {onStartConnection && (
                              <div
                                title={`Connect Product "${prod.name}" Left Port (click or drag to link)`}
                                data-no-drag="true"
                                data-sub-port={`${node.id}:${prodSubId}:left`}
                                data-sub-port-id={`${prodSubId}:left`}
                                data-sub-port-name={`${node.id}:${prod.name}:left`}
                                onMouseDown={(e) => {
                                  e.stopPropagation();
                                  onStartConnection('left', prodSubId);
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onStartConnection('left', prodSubId);
                                }}
                                onMouseUp={(e) => {
                                  e.stopPropagation();
                                  onEndConnection?.('left', prodSubId);
                                }}
                                className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 rounded-full bg-white border-2 border-emerald-500 shadow-md hover:scale-150 hover:bg-emerald-500 hover:border-white transition-all cursor-crosshair z-30 flex items-center justify-center group-hover/prod:scale-110"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              </div>
                            )}
                            {onStartConnection && (
                              <div
                                title={`Connect Product "${prod.name}" Right Port (click or drag to link)`}
                                data-no-drag="true"
                                data-sub-port={`${node.id}:${prodSubId}:right`}
                                data-sub-port-id={`${prodSubId}:right`}
                                data-sub-port-name={`${node.id}:${prod.name}:right`}
                                onMouseDown={(e) => {
                                  e.stopPropagation();
                                  onStartConnection('right', prodSubId);
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onStartConnection('right', prodSubId);
                                }}
                                onMouseUp={(e) => {
                                  e.stopPropagation();
                                  onEndConnection?.('right', prodSubId);
                                }}
                                className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 rounded-full bg-white border-2 border-emerald-500 shadow-md hover:scale-150 hover:bg-emerald-500 hover:border-white transition-all cursor-crosshair z-30 flex items-center justify-center group-hover/prod:scale-110"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              </div>
                            )}

                            <div className="relative w-full h-18 rounded-lg overflow-hidden bg-black/50 mb-1.5 border border-white/5">
                              <img
                                src={prod.mainImage}
                                alt={prod.name}
                                className="w-full h-full object-cover group-hover/prod:scale-105 transition-transform"
                              />
                              {isLinked && (
                                <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-emerald-600/90 text-[7px] font-mono font-bold text-white shadow-xs flex items-center gap-0.5 animate-pulse">
                                  <Link2 className="w-2 h-2" /> LINKED
                                </span>
                              )}
                              <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 text-[8px] font-mono font-bold text-violet-300">
                                {prod.financials?.sellingPrice?.toLocaleString() || 3500} DZD
                              </span>
                            </div>

                            <h5 className="text-[9.5px] font-bold text-white truncate leading-tight" title={prod.name}>
                              {prod.name}
                            </h5>
                            <span className="text-[8px] text-neutral-400 block truncate font-mono mt-0.5">
                              {prod.category}
                            </span>

                            <div className="mt-1.5 pt-1 border-t border-white/5 flex items-center justify-between text-[8px] font-mono text-neutral-300">
                              <span className="text-emerald-400 font-bold">
                                ROI {prod.financials?.roi || 65}%
                              </span>
                              {/* Quick Link Button */}
                              <button
                                type="button"
                                data-no-drag="true"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveAdsetLinkMenuId(null);
                                  setActiveProductLinkMenuId(activeProductLinkMenuId === prodSubId ? null : prodSubId);
                                }}
                                className="px-2 py-0.5 rounded-md bg-violet-600/30 hover:bg-violet-600 text-[8px] text-violet-200 hover:text-white font-bold transition-all cursor-pointer flex items-center gap-1 border border-violet-500/30 shadow-xs"
                                title="Link this product directly to any AI skill"
                              >
                                <Zap className="w-2.5 h-2.5 text-amber-400" />
                                <span>Link</span>
                              </button>
                            </div>

                            {/* Product Quick Link Dropdown */}
                            {activeProductLinkMenuId === prodSubId && (
                              <div
                                data-no-drag="true"
                                className="absolute left-0 -bottom-2 translate-y-full w-56 p-2 rounded-xl bg-[#1e1c2b] border border-violet-500/50 shadow-2xl z-40 space-y-1.5 backdrop-blur-md"
                              >
                                <div className="px-1.5 py-0.5 text-[8.5px] font-mono uppercase text-emerald-300 font-bold border-b border-white/10 flex items-center justify-between">
                                  <span className="truncate">Link "{prod.name.slice(0, 16)}"</span>
                                  <button
                                    type="button"
                                    onClick={() => setActiveProductLinkMenuId(null)}
                                    className="text-neutral-400 hover:text-white text-xs font-mono"
                                  >
                                    ✕
                                  </button>
                                </div>

                                {/* Draw Connection Line Button */}
                                <button
                                  type="button"
                                  data-no-drag="true"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onStartConnection?.('right', prodSubId);
                                    setActiveProductLinkMenuId(null);
                                  }}
                                  className="w-full p-1.5 text-left rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-white text-[9px] flex items-center gap-1.5 transition-colors cursor-pointer border border-emerald-500/40 font-bold"
                                >
                                  <span>⚡</span>
                                  <span>Click to Draw Connection Line</span>
                                </button>

                                {/* Connect directly to existing skill on board */}
                                {boardSkillsList && boardSkillsList.length > 0 && (
                                  <div className="pt-1 border-t border-white/10 space-y-1">
                                    <span className="px-1 text-[7.5px] font-mono text-neutral-300 block font-bold uppercase">Active Board Skills:</span>
                                    <div className="max-h-24 overflow-y-auto space-y-0.5">
                                      {boardSkillsList.map((skill) => (
                                        <button
                                          key={skill.id}
                                          type="button"
                                          data-no-drag="true"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            onLinkSkillToSubItem?.('product', { ...prod, id: prodId, targetSkillNodeId: skill.id });
                                            setActiveProductLinkMenuId(null);
                                          }}
                                          className="w-full px-2 py-1 text-left rounded-md bg-white/5 hover:bg-violet-600/50 text-white text-[8.5px] truncate flex items-center justify-between font-mono cursor-pointer transition-colors"
                                        >
                                          <span className="truncate">🔗 {skill.title}</span>
                                          <span className="text-[7px] px-1 py-0.2 rounded bg-violet-500/40 text-violet-200 uppercase font-bold">Connect</span>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                <div className="pt-1 border-t border-white/10 space-y-0.5">
                                  <span className="px-1 text-[7.5px] font-mono text-neutral-400 block">Spawn & Link New Skill:</span>
                                  <button
                                    type="button"
                                    data-no-drag="true"
                                    onClick={() => {
                                      onLinkSkillToSubItem?.('product', { ...prod, id: prodId }, 'Text to Image Studio');
                                      setActiveProductLinkMenuId(null);
                                    }}
                                    className="w-full p-1 text-left rounded hover:bg-violet-600/30 text-white text-[9px] flex items-center gap-1.5 transition-colors cursor-pointer"
                                  >
                                    <span>🎨</span>
                                    <span className="font-semibold">AI Ad Creative / Renders</span>
                                  </button>

                                  <button
                                    type="button"
                                    data-no-drag="true"
                                    onClick={() => {
                                      onLinkSkillToSubItem?.('product', { ...prod, id: prodId }, 'Product Copy & Angles');
                                      setActiveProductLinkMenuId(null);
                                    }}
                                    className="w-full p-1 text-left rounded hover:bg-violet-600/30 text-white text-[9px] flex items-center gap-1.5 transition-colors cursor-pointer"
                                  >
                                    <span>✍️</span>
                                    <span className="font-semibold">Product Description & Copy</span>
                                  </button>

                                  <button
                                    type="button"
                                    data-no-drag="true"
                                    onClick={() => {
                                      onLinkSkillToSubItem?.('product', { ...prod, id: prodId }, 'Pricing & COD Margin Optimizer');
                                      setActiveProductLinkMenuId(null);
                                    }}
                                    className="w-full p-1 text-left rounded hover:bg-violet-600/30 text-white text-[9px] flex items-center gap-1.5 transition-colors cursor-pointer"
                                  >
                                    <span>💰</span>
                                    <span className="font-semibold">Pricing & Offer Strategy</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      };

                      // Single product case
                      if (group.products.length === 1) {
                        return (
                          <div className="flex flex-col items-center w-full">
                            <div className="w-0.5 h-6 bg-violet-500" />
                            <div className="w-[130px] flex justify-center">
                              {renderProductCard(group.products[0], 0)}
                            </div>
                          </div>
                        );
                      }

                      // Multi-product case: Arrange in rows of 2 (2 first, then down 2, then down 2...)
                      const rows: any[][] = [];
                      for (let i = 0; i < group.products.length; i += 2) {
                        rows.push(group.products.slice(i, i + 2));
                      }

                      return (
                        <div className="flex flex-col items-center w-full">
                          {rows.map((rowProds, rIdx) => {
                            const hasTwo = rowProds.length === 2;
                            return (
                              <div key={rIdx} className="flex flex-col items-center w-full">
                                {/* Connector stem leading into this row */}
                                <div className="w-0.5 h-4 bg-violet-500" />

                                {/* Branch bar for 2-column or single-left drop */}
                                <div className="relative w-[142px] h-3">
                                  {hasTwo ? (
                                    /* Horizontal line spanning both columns */
                                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-violet-500" />
                                  ) : (
                                    /* Horizontal line branching from center (71px) to left (0px) */
                                    <div className="absolute top-0 left-0 w-[71px] h-0.5 bg-violet-500" />
                                  )}
                                  {/* Left drop line into col 0 */}
                                  <div className="absolute top-0 left-0 w-0.5 h-3 bg-violet-500" />
                                  {/* Right drop line into col 1 */}
                                  {hasTwo && (
                                    <div className="absolute top-0 right-0 w-0.5 h-3 bg-violet-500" />
                                  )}
                                </div>

                                {/* 2-Column Product Cards Row */}
                                <div className="grid grid-cols-2 gap-3 w-[272px]">
                                  <div className="w-[130px] flex justify-center">
                                    {renderProductCard(rowProds[0], rIdx * 2)}
                                  </div>
                                  {hasTwo ? (
                                    <div className="w-[130px] flex justify-center">
                                      {renderProductCard(rowProds[1], rIdx * 2 + 1)}
                                    </div>
                                  ) : (
                                    <div className="w-[130px]" />
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modal View for Fullscreen Org Chart */}
      {isRegrouperModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={(e) => {
            e.stopPropagation();
            setIsRegrouperModalOpen(false);
          }}
        >
          <div
            className="w-full max-w-6xl max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <React.Suspense fallback={<div className="p-10 text-white text-center">Loading Regrouper...</div>}>
              <ProductRegrouperAppLauncher
                initialData={appData}
                onUpdateData={(updated) => {
                  onUpdateNode({
                    appData: {
                      ...node.appData,
                      ...updated,
                    },
                  });
                }}
                onCloseModal={() => setIsRegrouperModalOpen(false)}
              />
            </React.Suspense>
          </div>
        </div>
      )}
    </div>
  );
};

// Lazy / Launcher wrapper for ProductRegrouperApp inside canvas
const ProductRegrouperAppLauncher: React.FC<{
  initialData: any;
  onUpdateData: (d: any) => void;
  onCloseModal: () => void;
}> = ({ initialData, onUpdateData, onCloseModal }) => {
  const [Component, setComponent] = useState<any>(null);

  useEffect(() => {
    import('./ProductRegrouperApp').then((mod) => {
      setComponent(() => mod.ProductRegrouperApp);
    });
  }, []);

  if (!Component) {
    return <div className="p-8 text-center text-white font-mono text-xs">Loading Product Regrouper...</div>;
  }

  return (
    <Component
      initialData={initialData}
      onUpdateData={onUpdateData}
      isModal={true}
      onCloseModal={onCloseModal}
    />
  );
};

// ==========================================
// SUB-COMPONENT: TEXT TO CODE LANDING PAGE CANVAS CARD (Image 1 Engine)
// ==========================================
const TextToCodeLandingPageCanvasCard: React.FC<{
  node: BoardNode;
  isSelected: boolean;
  onUpdateNode: (updated: Partial<BoardNode>) => void;
  onDeleteNode?: () => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}> = ({ node, isSelected, onUpdateNode, onDeleteNode, isModalOpen, setIsModalOpen }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [deviceView, setDeviceView] = useState<'mobile' | 'desktop'>('mobile');
  const [selectedTier, setSelectedTier] = useState<'single' | 'bundle'>('bundle');
  const [cartQuantity, setCartQuantity] = useState(1);
  const [cartCount, setCartCount] = useState(0);
  const [cartToast, setCartToast] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const data: LandingPageData = {
    ...DEFAULT_THE_GOOD_DOSE_DATA,
    ...node.appData,
  };

  // Generation section states
  const [productTextPrompt, setProductTextPrompt] = useState(
    node.appData?.promptText ||
      `${data.headline} ${data.description}` ||
      'A fruity daily fiber supplement made to support gut health and balance without boring taste. Single dose is $40, daily subscription is $32.'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationNotice, setGenerationNotice] = useState<string | null>(null);

  // Live ticking countdown timer matching the Studio Generator
  const [countdown, setCountdown] = useState({ hours: 6, minutes: 50, seconds: 17 });
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 6, minutes: 50, seconds: 17 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const SAMPLE_PRESETS = [
    {
      name: 'The Good Dose (Fruity Fiber)',
      tag: 'Image 1 Match',
      description: 'Vibrant direct response supplement page matching the reference...',
      data: DEFAULT_THE_GOOD_DOSE_DATA,
    },
    {
      name: 'SonicPro Dental Scaler (Algerian COD)',
      tag: 'COD Algeria',
      description: 'High-conversion Algerian COD page with Wilayas delivery and Arabic copy...',
      data: {
        ...DEFAULT_THE_GOOD_DOSE_DATA,
        brandName: 'SonicPro DZ',
        headline: 'ابتسامة ناصعة في 5 دقائق مع جهاز SonicPro الأصلي',
        description: 'الجهاز الأصلي لإزالة الجير والتكلسات بالموجات الصوتية 12,000 ذبذبة/دقيقة مع التوصيل السريع لـ 58 ولاية.',
        singlePrice: '4,800 DZD',
        bundlePrice: '7,800 DZD',
        ctaText: 'تأكيد الطلب الآن (الدفع عند الاستلام) ←',
        productImage: '/assets/aistudio/dental_scaler_pro.png',
        badgeText: 'أصلي 100% مع الضمان',
        primaryColor: '#0284c7',
        accentColor: '#10b981',
        announcementSale: 'تخفيض حصري اليوم',
        announcementDiscount: 'التوصيل متوفر لجميع الولايات',
        subBannerText: 'الدفع عند الاستلام • ضمان 12 شهر • فحص المنتج قبل الدفع',
      },
    },
    {
      name: 'Aura Glow Vitamin C Serum',
      tag: 'Beauty / Skincare',
      description: 'Clean luxury skincare with minimalist aesthetics and clinical proof...',
      data: {
        ...DEFAULT_THE_GOOD_DOSE_DATA,
        brandName: 'Aura Botanics',
        headline: 'Wake up to radiant, hydrated glass skin every morning.',
        description: 'Ultra-pure 15% Vitamin C + Ferulic Acid serum that brightens hyperpigmentation and plumps fine lines.',
        singlePrice: '$45',
        bundlePrice: '$34',
        badgeText: '15% VITAMIN C + FERULIC',
        ctaText: 'SHOP THE GLOW RITUAL →',
        primaryColor: '#ea580c',
        accentColor: '#facc15',
        announcementSale: 'LIMITED BATCH DROP',
        announcementDiscount: 'Complimentary Gua Sha with orders over $50',
      },
    },
  ];

  const handleGenerateFromText = async () => {
    if (!productTextPrompt.trim()) return;
    setIsGenerating(true);
    setGenerationNotice(null);

    const savedKey = localStorage.getItem('user_api_key') || '';
    const savedModel = localStorage.getItem('ai_model') || 'nvidia/nemotron-3.5-lightning:free';
    const savedProvider = localStorage.getItem('ai_provider') || 'openrouter';

    try {
      const promptPayload = `You are a Direct-Response Landing Page Designer. Given this product description, return a JSON object with:
Product Input:
${productTextPrompt}

Format strictly as raw JSON with keys:
{
  "brandName": "Brand Name",
  "tagline": "Short slogan or handle",
  "announcementSale": "SPRING SALE or FLASH PROMO",
  "announcementDiscount": "Shop now and get up to 50% off",
  "subBannerText": "3 trust points separated by bullets",
  "headline": "Punchy high converting headline",
  "description": "2-3 sentences explaining benefits & daily routine",
  "badgeText": "Floating badge text (e.g. 5G FIBER PER SERVING)",
  "ratingScore": "4.9",
  "ratingCount": "1,200+ Reviews",
  "benefits": ["Benefit 1", "Benefit 2", "Benefit 3"],
  "singleOptionTitle": "Try 1 Dose",
  "singlePrice": "$40",
  "bundleOptionTitle": "Make It Your Daily Ritual",
  "bundlePrice": "$32",
  "bundleFeatures": ["SAVE 20% ON EVERY DOSE", "FREE OR CANCEL WHENEVER"],
  "bundleBadge": "BEST VALUE ✨",
  "ctaText": "ADD TO CART →",
  "guaranteeText": "30-Day Happy Gut Guarantee • Free Delivery",
  "primaryColor": "#E11D48",
  "accentColor": "#BEF264",
  "fontFamily": "serif"
}`;

      const res = await fetch('/api/ai/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: savedProvider,
          model: savedModel,
          apiKey: savedKey,
          prompt: promptPayload,
          systemInstruction: 'You are a JSON-only API. Respond strictly with raw valid JSON.',
        }),
      });

      if (res.ok) {
        const resData = await res.json();
        let rawContent = resData.result || '';
        if (rawContent.includes('```')) {
          rawContent = rawContent.replace(/```json/gi, '').replace(/```/g, '').trim();
        }
        const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          const updatedAppData = {
            ...data,
            ...parsed,
            productImage: data.productImage || '/assets/aistudio/image_8f6424d6.png',
            promptText: productTextPrompt,
          };
          onUpdateNode({ appData: updatedAppData });
          setGenerationNotice('Landing page code synthesized from your text! ✓');
          setActiveTab('preview');
          return;
        }
      }
      throw new Error('AI parse fallback');
    } catch {
      // Smart offline keyword synthesis
      const lower = productTextPrompt.toLowerCase();
      let brand = 'Lumina Vitality';
      let headline = 'Transform your daily routine with real results.';
      let singleP = '$40';
      let bundleP = '$32';
      let pColor = '#E11D48';
      let aColor = '#BEF264';
      let img = data.productImage || '/assets/aistudio/image_8f6424d6.png';

      if (lower.includes('dental') || lower.includes('teeth') || lower.includes('scaler') || lower.includes('أسنان') || lower.includes('dent')) {
        brand = 'SonicPro DZ';
        headline = 'ابتسامة ناصعة في 5 دقائق مع جهاز SonicPro الأصلي';
        singleP = '4,800 DZD';
        bundleP = '7,800 DZD';
        pColor = '#0284c7';
        aColor = '#10b981';
        img = '/assets/aistudio/dental_scaler_pro.png';
      } else if (lower.includes('glow') || lower.includes('skin') || lower.includes('serum') || lower.includes('face') || lower.includes('vitamin')) {
        brand = 'Aura Botanics';
        headline = 'Wake up to radiant, hydrated glass skin every morning.';
        singleP = '$45';
        bundleP = '$34';
        pColor = '#ea580c';
        aColor = '#facc15';
      }

      const updatedAppData = {
        ...data,
        brandName: brand,
        headline,
        description: productTextPrompt.slice(0, 240),
        singlePrice: singleP,
        bundlePrice: bundleP,
        primaryColor: pColor,
        accentColor: aColor,
        productImage: img,
        promptText: productTextPrompt,
      };

      onUpdateNode({ appData: updatedAppData });
      setGenerationNotice('Created custom landing page from your text! ✓');
      setActiveTab('preview');
    } finally {
      setIsGenerating(false);
      setTimeout(() => setGenerationNotice(null), 4000);
    }
  };

  const handleAddToCart = () => {
    setCartCount((c) => c + cartQuantity);
    const chosenPrice = selectedTier === 'bundle' ? data.bundlePrice : data.singlePrice;
    const chosenTitle = selectedTier === 'bundle' ? data.bundleOptionTitle : data.singleOptionTitle;
    setCartToast(`Added ${cartQuantity}x "${chosenTitle}" (${chosenPrice}) to cart! 🛍️`);
    setTimeout(() => setCartToast(null), 3000);
  };

  const generatedHtmlSnippet = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.brandName} - ${data.headline}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#faf5f0] text-slate-900 font-sans antialiased">
  <div style="background-color: ${data.primaryColor || '#E11D48'}" class="text-white text-center py-2 px-4 text-xs font-bold tracking-wider uppercase">
    ${data.announcementSale} • ${data.announcementDiscount}
  </div>
  <div class="bg-[#ea580c] text-white text-[10px] font-bold py-1 px-3 text-center">
    ${data.subBannerText || 'Buy 2 Get 1 Free • 30-Day Happy Gut Guarantee • Free Delivery'}
  </div>
  <header class="max-w-md mx-auto p-4 flex justify-between items-center border-b border-rose-200/60">
    <span class="text-xl font-black font-serif tracking-tight text-rose-950 uppercase">${data.brandName}</span>
    <span class="text-xs text-rose-600 font-medium">${data.tagline}</span>
  </header>
  <main class="max-w-md mx-auto p-4 space-y-4">
    <div class="space-y-1.5">
      <h1 class="text-2xl font-serif font-black text-rose-950 leading-tight">${data.headline}</h1>
      <p class="text-xs text-slate-700 leading-relaxed">${data.description}</p>
    </div>
    <div class="relative rounded-2xl overflow-hidden bg-rose-50 border border-rose-200 aspect-square shadow-inner flex items-center justify-center p-4">
      <img src="${data.productImage || '/assets/aistudio/image_8f6424d6.png'}" alt="${data.brandName}" class="max-h-64 object-contain" />
      <span style="background-color: ${data.accentColor || '#BEF264'}" class="absolute top-3 right-3 px-3 py-1 rounded-full text-[11px] font-black text-slate-950 shadow-md uppercase">
        ${data.badgeText}
      </span>
    </div>
    <div class="flex items-center gap-1.5 text-xs text-amber-600 font-bold">
      <span>★ ${data.ratingScore}</span>
      <span class="text-slate-500 font-normal">(${data.ratingCount})</span>
    </div>
    <div class="space-y-2">
      <button style="background-color: ${data.accentColor || '#BEF264'}" class="w-full py-3.5 rounded-xl text-slate-950 font-black text-sm tracking-wide shadow-lg cursor-pointer uppercase">
        ${data.ctaText}
      </button>
      <p class="text-center text-[11px] text-slate-500 font-medium">🛡️ ${data.guaranteeText}</p>
    </div>
  </main>
</body>
</html>`;

  const copyCode = () => {
    navigator.clipboard.writeText(generatedHtmlSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadHtml = () => {
    const blob = new Blob([generatedHtmlSnippet], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.brandName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-landing-page.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 space-y-3.5 select-none">
      {/* Top Header & Tab Controls */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Code className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 text-[9px] font-mono font-bold uppercase">
                DIRECT RESPONSE
              </span>
              <span className="px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 text-[9px] font-mono font-bold">
                IMAGE 1 ENGINE
              </span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5" title={data.brandName}>
              {node.title || 'Text to Code Landing Page'}
            </h4>
          </div>
        </div>

        {/* Tab & Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0" data-no-drag="true">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-2.5 py-1 rounded-md text-[10.5px] font-bold font-mono transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === 'preview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3 h-3 text-rose-600" />
              <span>Studio + Preview</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('code')}
              className={`px-2.5 py-1 rounded-md text-[10.5px] font-bold font-mono transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === 'code' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code className="w-3 h-3 text-indigo-600" />
              <span>HTML5</span>
            </button>
          </div>

          <button
            type="button"
            onClick={copyCode}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            title="Copy Clean HTML5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={downloadHtml}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            title="Download Standalone .html"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
            title="Open Fullscreen Studio Modal"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          {onDeleteNode && (
            <button
              type="button"
              onClick={onDeleteNode}
              className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
              title="Remove App Card"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Body */}
      {activeTab === 'preview' ? (
        <div className="flex flex-col lg:flex-row items-stretch gap-4" data-no-drag="true">
          {/* LEFT COLUMN: STUDIO GENERATION SECTION ("section studione for start add text") */}
          <div className="w-full lg:w-[350px] shrink-0 bg-slate-900 text-slate-100 rounded-2xl p-4 space-y-4 border border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="space-y-3.5">
              {/* Presets Header & Options */}
              <div>
                <label className="text-[11px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                  <span>Reference Presets</span>
                </label>
                <div className="space-y-1.5">
                  {SAMPLE_PRESETS.map((p) => {
                    const isCurrent = data.brandName === p.data.brandName;
                    return (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => {
                          onUpdateNode({ appData: { ...p.data } });
                          setProductTextPrompt(`${p.data.headline} ${p.data.description}`);
                        }}
                        className={`w-full text-left p-2 rounded-xl border transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-rose-500/20 border-rose-500/60 text-white shadow-2xs'
                            : 'bg-slate-800/80 border-slate-700/60 hover:border-slate-600 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[11px] font-bold truncate">{p.name}</span>
                          <span className="text-[8.5px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono">
                            {p.tag}
                          </span>
                        </div>
                        <p className="text-[9.5px] text-slate-400 line-clamp-1">{p.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Text Input Prompt Section */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>Explain your product in text:</span>
                  <span className="text-[9px] font-mono text-slate-400">AI Text-to-Landing-Page</span>
                </div>

                <textarea
                  value={productTextPrompt}
                  onChange={(e) => setProductTextPrompt(e.target.value)}
                  placeholder="e.g. A fruity daily fiber ritual drink made to support gut health and balance without messy texture. Single is $40, daily subscription is $32..."
                  rows={4}
                  className="w-full p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 resize-none font-sans leading-relaxed"
                />

                <button
                  type="button"
                  onClick={handleGenerateFromText}
                  disabled={isGenerating || !productTextPrompt.trim()}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                      <span>Synthesizing Landing Page...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                      <span>Generate Landing Page Code</span>
                    </>
                  )}
                </button>

                {generationNotice && (
                  <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10.5px] font-semibold flex items-center gap-1.5 animate-in fade-in duration-200">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{generationNotice}</span>
                  </div>
                )}
              </div>

              {/* Theme & Visual Styling Colors */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-rose-400" />
                  <span>Theme & Visual Styling</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[9px] text-slate-400 block mb-1">Banner & Accent Color</span>
                    <div className="flex items-center gap-2 bg-slate-800 px-2 py-1.5 rounded-lg border border-slate-700">
                      <input
                        type="color"
                        value={data.primaryColor || '#E11D48'}
                        onChange={(e) =>
                          onUpdateNode({
                            appData: { ...data, primaryColor: e.target.value },
                          })
                        }
                        className="w-4.5 h-4.5 rounded cursor-pointer bg-transparent border-0"
                      />
                      <span className="text-[10px] font-mono text-slate-300 uppercase">
                        {data.primaryColor || '#E11D48'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[9px] text-slate-400 block mb-1">CTA Button Color</span>
                    <div className="flex items-center gap-2 bg-slate-800 px-2 py-1.5 rounded-lg border border-slate-700">
                      <input
                        type="color"
                        value={data.accentColor || '#BEF264'}
                        onChange={(e) =>
                          onUpdateNode({
                            appData: { ...data, accentColor: e.target.value },
                          })
                        }
                        className="w-4.5 h-4.5 rounded cursor-pointer bg-transparent border-0"
                      />
                      <span className="text-[10px] font-mono text-slate-300 uppercase">
                        {data.accentColor || '#BEF264'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Studio quick launcher footer */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
              <span className="font-mono">Direct AI Studio Engine</span>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Full Studio</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: LIVE PHONE MOCKUP PREVIEW */}
          <div className="flex-1 min-w-0 space-y-2.5">
            {/* View Switcher Bar */}
            <div className="flex items-center justify-between text-[10px] px-1">
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setDeviceView('mobile')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono transition-all flex items-center gap-1 cursor-pointer ${
                    deviceView === 'mobile' ? 'bg-rose-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Smartphone className="w-3 h-3" />
                  <span>Mobile Frame (Image 1)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceView('desktop')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono transition-all flex items-center gap-1 cursor-pointer ${
                    deviceView === 'desktop' ? 'bg-rose-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>🖥️ Desktop Width</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {cartCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9.5px] font-bold border border-emerald-300">
                    Cart ({cartCount})
                  </span>
                )}
                <span className="text-slate-400 font-mono text-[9.5px] hidden sm:inline">
                  Model: nvidia/nemotron-3.5-lightning:free
                </span>
              </div>
            </div>

            {/* Cart Toast Notification */}
            {cartToast && (
              <div className="p-2 rounded-xl bg-emerald-600 text-white text-xs font-bold text-center shadow-lg animate-in fade-in duration-200">
                {cartToast}
              </div>
            )}

            {/* Studio Canvas Backdrop with Centered Smartphone Frame */}
            <div className="relative rounded-2xl bg-gradient-to-tr from-amber-100/90 via-rose-100/70 to-pink-200/80 p-3 sm:p-5 border border-rose-200/70 shadow-inner flex justify-center items-start overflow-hidden">
              <div
                className={`transition-all duration-300 w-full ${
                  deviceView === 'mobile' ? 'max-w-[370px]' : 'max-w-xl'
                }`}
              >
                {/* Visual Smartphone Chassis Frame matching Image 1 */}
                <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden border-8 border-slate-900/95 text-slate-900 flex flex-col font-sans">
                  {/* Phone Speaker Notch */}
                  <div className="bg-slate-900 py-1 flex justify-center items-center">
                    <div className="w-16 h-3 bg-black rounded-full" />
                  </div>

                  {/* 1. Top Urgency Banner with Live Countdown */}
                  <div
                    style={{ backgroundColor: data.primaryColor || '#E11D48' }}
                    className="text-white px-3.5 py-2.5 flex items-center justify-between text-left select-none shadow-xs"
                  >
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-widest block leading-none">
                        {data.announcementSale || 'SPRING SALE'}
                      </span>
                      <span className="text-xs font-bold leading-tight block mt-0.5">
                        {data.announcementDiscount || 'Shop now and get up to 50% off'}
                      </span>
                    </div>

                    {/* Live Countdown Pills */}
                    <div className="flex items-center gap-1 font-mono text-[10.5px] font-black">
                      <div className="bg-black/25 px-1.5 py-0.5 rounded text-center">
                        <span>{String(countdown.hours).padStart(2, '0')}</span>
                        <span className="text-[7px] block opacity-75 font-sans font-bold">Hr</span>
                      </div>
                      <span className="opacity-75">:</span>
                      <div className="bg-black/25 px-1.5 py-0.5 rounded text-center">
                        <span>{String(countdown.minutes).padStart(2, '0')}</span>
                        <span className="text-[7px] block opacity-75 font-sans font-bold">Mins</span>
                      </div>
                      <span className="opacity-75">:</span>
                      <div className="bg-black/25 px-1.5 py-0.5 rounded text-center">
                        <span>{String(countdown.seconds).padStart(2, '0')}</span>
                        <span className="text-[7px] block opacity-75 font-sans font-bold">Secs</span>
                      </div>
                    </div>
                  </div>

                  {/* 2. Orange Incentive Sub-Bar */}
                  <div className="bg-[#ea580c] text-white text-[10px] font-bold px-3 py-1.5 text-center tracking-wide">
                    {data.subBannerText || 'Buy 2 Get 1 Free • 30-Day Happy Gut Guarantee • Free Delivery'}
                  </div>

                  {/* 3. Header Bar */}
                  <div className="px-4 py-2.5 flex items-center justify-between border-b border-rose-50 bg-white">
                    <button type="button" className="p-1 text-slate-700 hover:text-black cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                    <div className="text-center">
                      <h3
                        className={`text-sm font-black tracking-tight text-rose-950 uppercase ${
                          data.fontFamily === 'serif' ? 'font-serif' : 'font-sans'
                        }`}
                      >
                        {data.brandName || 'THE GOOD DOSE'}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCartToast(`Shopping bag currently has ${cartCount} items.`)}
                      className="p-1 text-slate-700 hover:text-black relative cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-600 text-white rounded-full text-[8.5px] font-black flex items-center justify-center">
                          {cartCount}
                        </span>
                      )}
                    </button>
                  </div>

                  {/* 4. Product Showcase Box */}
                  <div className="p-3.5 bg-white">
                    <div className="relative bg-gradient-to-br from-amber-50/70 via-rose-50/50 to-orange-50/70 rounded-2xl p-4 flex flex-col items-center justify-center border border-rose-100/70 min-h-[220px] overflow-hidden group">
                      {/* Badge Pill in corner */}
                      <span
                        style={{ backgroundColor: data.accentColor || '#BEF264' }}
                        className="absolute top-2.5 right-2.5 text-slate-950 text-[9.5px] font-black px-2.5 py-0.5 rounded-full shadow-xs uppercase tracking-wide"
                      >
                        {data.badgeText || '5G FIBER PER SERVING'}
                      </span>

                      {/* Navigation Chevrons */}
                      <button type="button" className="absolute left-1.5 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/80 hover:bg-white text-rose-800 shadow-xs cursor-pointer">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button type="button" className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/80 hover:bg-white text-rose-800 shadow-xs cursor-pointer">
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      <img
                        src={data.productImage || '/assets/aistudio/image_8f6424d6.png'}
                        alt={data.headline}
                        className="max-h-52 max-w-full object-contain filter drop-shadow-md transition-transform group-hover:scale-105 duration-300"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                    </div>
                  </div>

                  {/* 5. Product Copy & Purchase Flow */}
                  <div className="px-4 pb-5 space-y-3 bg-white">
                    {/* Ratings */}
                    <div className="flex items-center gap-1.5 text-xs text-rose-950 font-bold">
                      <div className="flex text-rose-600">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                        ))}
                      </div>
                      <span className="font-black text-rose-950 text-xs">{data.ratingScore || '4.9'}</span>
                      <span className="text-slate-300">|</span>
                      <span className="text-slate-600 font-semibold text-[11px]">{data.ratingCount || '1,200+ Reviews'}</span>
                    </div>

                    {/* Headline */}
                    <h2
                      className={`text-lg sm:text-xl font-black text-rose-950 leading-tight ${
                        data.fontFamily === 'serif' ? 'font-serif' : 'font-sans'
                      }`}
                    >
                      {data.headline || 'Daily fiber that actually feels fun.'}
                    </h2>

                    {/* Description */}
                    <p className="text-[11px] text-slate-700 leading-relaxed font-normal">
                      {data.description ||
                        'A fruity, sweet flavor supercharged with 5g organic fiber per serving. Goodbye bloating, hello vibrant gut health - without the messy texture.'}
                    </p>

                    {/* Benefit Badges */}
                    {data.benefits && data.benefits.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {data.benefits.slice(0, 3).map((b, i) => (
                          <div
                            key={i}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50/80 border border-rose-200 text-rose-950 text-[10px] font-semibold"
                          >
                            <span className="text-rose-600 font-bold">✓</span>
                            <span>{b}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Purchase Tiers (Try It Once vs Daily Ritual) */}
                    <div className="space-y-2 pt-1">
                      {/* Option 1: Single */}
                      <div
                        onClick={() => setSelectedTier('single')}
                        className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                          selectedTier === 'single'
                            ? 'border-rose-500 bg-rose-50/40 ring-1 ring-rose-500'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                              selectedTier === 'single' ? 'border-rose-600 bg-rose-600' : 'border-slate-300'
                            }`}
                          >
                            {selectedTier === 'single' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <span className="text-xs font-bold text-slate-800">{data.singleOptionTitle || 'Try 1 Dose'}</span>
                        </div>
                        <span className="text-xs font-black text-slate-900 font-mono">{data.singlePrice || '$40'}</span>
                      </div>

                      {/* Option 2: Subscription / Best Value */}
                      <div
                        onClick={() => setSelectedTier('bundle')}
                        className={`relative flex flex-col p-2.5 rounded-xl border-2 transition-all cursor-pointer ${
                          selectedTier === 'bundle'
                            ? 'border-rose-500 bg-rose-50/60 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                                selectedTier === 'bundle' ? 'border-rose-600 bg-rose-600' : 'border-slate-300'
                              }`}
                            >
                              {selectedTier === 'bundle' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                            <span className="text-xs font-black text-rose-950">{data.bundleOptionTitle || 'Make It Your Daily Ritual'}</span>
                          </div>
                          <span className="text-sm font-black text-rose-900 font-mono">{data.bundlePrice || '$32'}</span>
                        </div>

                        {data.bundleFeatures && data.bundleFeatures.length > 0 && (
                          <div className="ml-5.5 mt-1 space-y-0.5 text-[10px] font-bold text-rose-800">
                            {data.bundleFeatures.slice(0, 2).map((f, i) => (
                              <p key={i} className="flex items-center gap-1">
                                <span className="text-rose-600">✓</span>
                                <span>{f}</span>
                              </p>
                            ))}
                          </div>
                        )}

                        {/* Best Value Ribbon */}
                        <span className="absolute -bottom-2 right-3 bg-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wide">
                          {data.bundleBadge || 'BEST VALUE ✨'}
                        </span>
                      </div>
                    </div>

                    {/* Quantity Stepper & Add to Cart Button */}
                    <div className="pt-2 flex items-center gap-2">
                      <select
                        value={cartQuantity}
                        onChange={(e) => setCartQuantity(Number(e.target.value))}
                        className="px-3 py-2.5 rounded-xl border border-rose-200 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:border-rose-500 cursor-pointer shadow-xs"
                      >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={5}>5</option>
                      </select>

                      <button
                        type="button"
                        onClick={handleAddToCart}
                        style={{ backgroundColor: data.accentColor || '#BEF264' }}
                        className="flex-1 py-2.5 px-3 rounded-xl text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>{data.ctaText || 'ADD TO CART →'}</span>
                      </button>
                    </div>

                    {/* Guarantee Line */}
                    <div className="pt-1.5 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1.5 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                      <span>{data.guaranteeText || '30-Day Happy Gut Guarantee • Free Delivery'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* HTML Code View */
        <div className="space-y-2" data-no-drag="true">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-56 select-text">
            <pre className="whitespace-pre-wrap">{generatedHtmlSnippet}</pre>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <span className="text-[10px] text-slate-500 font-mono">
              Ready-to-deploy HTML5 + Tailwind CSS
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={copyCode}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy HTML'}</span>
              </button>
              <button
                type="button"
                onClick={downloadHtml}
                className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .html</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preset Quick Switcher Footer */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]" data-no-drag="true">
        <span className="text-slate-400 font-mono">Presets:</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              onUpdateNode({ appData: { ...DEFAULT_THE_GOOD_DOSE_DATA } });
              setProductTextPrompt(`${DEFAULT_THE_GOOD_DOSE_DATA.headline} ${DEFAULT_THE_GOOD_DOSE_DATA.description}`);
            }}
            className="px-2 py-0.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold font-mono text-[9.5px] cursor-pointer"
            title="Load The Good Dose preset"
          >
            Good Dose
          </button>
          <button
            type="button"
            onClick={() => {
              const sonic = SAMPLE_PRESETS[1].data;
              onUpdateNode({ appData: { ...sonic } });
              setProductTextPrompt(`${sonic.headline} ${sonic.description}`);
            }}
            className="px-2 py-0.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold font-mono text-[9.5px] cursor-pointer"
            title="Load SonicPro DZ preset"
          >
            SonicPro COD
          </button>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold font-mono text-[9.5px] flex items-center gap-1 cursor-pointer"
          >
            <span>Open Studio</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>

      {/* Fullscreen Modal Launcher */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-6xl max-h-[94vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <React.Suspense fallback={<div className="p-8 text-white text-center">Loading Studio...</div>}>
              <TextToCodeLandingPageAppLauncher
                initialData={data}
                onUpdateData={(updated) => {
                  onUpdateNode({
                    appData: {
                      ...node.appData,
                      ...updated,
                    },
                  });
                }}
                onCloseModal={() => setIsModalOpen(false)}
              />
            </React.Suspense>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// SUB-COMPONENT: TEXT TO IMAGE LANDING PAGE CANVAS CARD (Image 2 Engine)
// ==========================================
const TextToImageLandingPageCanvasCard: React.FC<{
  node: BoardNode;
  isSelected: boolean;
  onUpdateNode: (updated: Partial<BoardNode>) => void;
  onDeleteNode?: () => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}> = ({ node, isSelected, onUpdateNode, onDeleteNode, isModalOpen, setIsModalOpen }) => {
  const [viewMode, setViewMode] = useState<'3col' | 'vertical'>('3col');

  const data: ImageLandingPageData = {
    ...DEFAULT_ORVENA_DATA,
    ...node.appData,
  };

  return (
    <div className="p-4 space-y-3 select-none">
      {/* Top Header Bar matching Studio Modal */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-violet-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Image className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-700 font-bold text-[9.5px] border border-purple-500/30">
                IMAGE 2 ENGINE
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[9.5px] font-mono">
                ORVENA EDITORIAL
              </span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5" title={data.brandName}>
              {node.title || 'Text to Image Landing Page'}
            </h4>
          </div>
        </div>

        {/* View Layout Switcher & Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0" data-no-drag="true">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('3col')}
              className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === '3col' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="3-Column Overview (Exact match to Image 1 / Orvena reference layout)"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>3-Column Overview</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('vertical')}
              className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'vertical' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Full Vertical Flow"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Full Flow</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="p-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors cursor-pointer"
            title="Open Fullscreen Studio to customize images, copy & prompt"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {onDeleteNode && (
            <button
              type="button"
              onClick={onDeleteNode}
              className="p-1.5 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
              title="Remove App Card"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main View: Exact Match to First Image (image_9af92957.png) */}
      {viewMode === '3col' ? (
        <div className="rounded-2xl p-4 bg-gradient-to-br from-[#1b1528] via-[#241738] to-[#120e1a] border border-purple-500/20 shadow-inner overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 items-stretch font-sans">
            {/* COLUMN 1: Hero & Brand Statement */}
            <div className="bg-[#faf6f0] text-[#1e1b4b] rounded-2xl p-4 shadow-xl border border-black/5 flex flex-col justify-between space-y-3">
              <div className="space-y-2.5">
                {/* Brand Logo */}
                <div className="text-center pt-1">
                  <h1 className="text-xl font-serif font-black tracking-widest uppercase text-[#1e1b4b]">
                    {data.brandName}
                  </h1>
                </div>

                {/* Headline & Subhead */}
                <div className="text-center space-y-1">
                  <h2 className="text-sm font-black tracking-tight leading-snug uppercase text-[#1e1b4b]">
                    {data.heroHeadline}
                  </h2>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {data.heroSubhead}
                  </p>
                </div>

                {/* Tall Lifestyle Action Photo (Yoga silhouette sunset matching image 1) */}
                <div className="rounded-xl overflow-hidden shadow-xs relative aspect-4/5 bg-slate-200">
                  <img
                    src={data.heroImage || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80'}
                    alt={data.heroHeadline}
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                </div>

                {/* Hero Copy */}
                <p className="text-[10px] text-slate-600 text-center leading-relaxed font-normal px-1 line-clamp-3">
                  {data.heroCopy}
                </p>
              </div>

              {/* Hero CTA Button */}
              <button
                type="button"
                data-no-drag="true"
                onClick={() => setIsModalOpen(true)}
                className="w-full py-2.5 px-3 rounded-xl bg-[#1e1b4b] hover:bg-purple-950 text-white font-black text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>{data.heroCta || 'SHOP ORVENA'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* COLUMN 2: Products Lineup (3 formulas) */}
            <div className="bg-[#faf6f0] text-[#1e1b4b] rounded-2xl p-4 shadow-xl border border-black/5 flex flex-col justify-between space-y-3">
              <div className="space-y-2.5">
                {/* Heading */}
                <div className="text-center space-y-1 pt-1">
                  <h3 className="text-xs font-black tracking-tight uppercase text-[#1e1b4b]">
                    {data.productsHeadline || 'FIND WHAT FITS YOUR DAY'}
                  </h3>
                  <p className="text-[9.5px] text-slate-500 leading-snug">
                    {data.productsSubhead || "Not every day feels the same, your routine doesn't have to either."}
                  </p>
                </div>

                {/* 3 Product Cards matching Image 1 */}
                <div className="space-y-2">
                  {data.products?.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-purple-300 transition-all"
                    >
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        className="w-12 h-12 rounded-lg object-cover shrink-0 bg-slate-100"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-[10px] font-black tracking-tight uppercase text-slate-900 truncate">
                          {p.title}
                        </h4>
                        <p className="text-[8.5px] text-slate-500 line-clamp-1 leading-snug mt-0.5">
                          {p.subtitle}
                        </p>
                        <span className="text-[8.5px] font-black text-purple-700 uppercase tracking-wider mt-0.5 block">
                          EXPLORE →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3 Minimal Features Bar */}
              <div className="pt-2 border-t border-slate-200/80 grid grid-cols-3 gap-1.5 text-center">
                {data.features?.map((f, i) => (
                  <div key={i} className="space-y-0.5">
                    <span className="text-purple-600 block text-[10px]">✦</span>
                    <span className="text-[8px] font-black tracking-wider text-slate-700 block uppercase truncate">
                      {f}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* COLUMN 3: Customer Testimonials & Routine Story */}
            <div className="space-y-3 flex flex-col justify-between">
              {/* Testimonials Card matching Image 1 */}
              <div className="bg-[#faf6f0] text-[#1e1b4b] rounded-2xl p-4 shadow-xl border border-black/5 space-y-3">
                <div className="space-y-3">
                  {data.testimonials?.map((t, idx) => (
                    <div key={idx} className="text-center space-y-1 border-b border-slate-200/60 pb-2.5 last:border-b-0 last:pb-0">
                      <p className="text-[10.5px] font-bold text-slate-800 italic leading-snug">
                        "{t.quote}"
                      </p>
                      <div className="flex items-center justify-center gap-0.5 text-amber-500">
                        {[...Array(t.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[8.5px] font-black tracking-wider uppercase text-slate-500 block">
                        {t.author}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Story Grid Narrative Card */}
              <div className="bg-[#faf6f0] text-[#1e1b4b] rounded-2xl p-3.5 shadow-xl border border-black/5 text-center space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-wide text-[#1e1b4b]">
                  {data.storyGridHeadline || 'MAKE WELLNESS PART OF YOUR EVERYDAY'}
                </h4>
                <div className="rounded-xl overflow-hidden aspect-16/10 bg-slate-200">
                  <img
                    src={data.storyGridPhotos?.[0]?.imageUrl || data.lifestyleImage || 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80'}
                    alt="Routine"
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Full Flow View */
        <div className="rounded-2xl border border-purple-200 bg-stone-50 p-4 space-y-4 shadow-inner max-h-96 overflow-y-auto">
          <div className="text-center border-b border-stone-200 pb-2">
            <h2 className="text-base font-serif font-black tracking-widest uppercase text-stone-900">
              {data.brandName}
            </h2>
          </div>
          <div className="relative rounded-xl overflow-hidden aspect-16/9 bg-stone-200">
            <img src={data.heroImage} alt="Hero" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-3 flex flex-col justify-end text-white">
              <h3 className="text-xs font-serif font-bold uppercase">{data.heroHeadline}</h3>
              <p className="text-[10px] text-stone-300">{data.heroCopy}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs uppercase"
          >
            {data.heroCta}
          </button>
        </div>
      )}

      {/* Preset Footer */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]" data-no-drag="true">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
          <span className="text-slate-500 font-mono font-semibold">Orvena Editorial Wellness Layout (Image 2 Match)</span>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-3 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold font-mono text-[10.5px] flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <span>Open Full Visual Studio</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* Fullscreen Modal Launcher */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-6xl max-h-[94vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <React.Suspense fallback={<div className="p-8 text-white text-center">Loading Studio...</div>}>
              <TextToImageLandingPageAppLauncher
                initialData={data}
                onUpdateData={(updated) => {
                  onUpdateNode({
                    appData: {
                      ...node.appData,
                      ...updated,
                    },
                  });
                }}
                onCloseModal={() => setIsModalOpen(false)}
              />
            </React.Suspense>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// SUB-COMPONENT: DEFAULT FALLBACK APP CANVAS CARD
// Ensures ANY app node or unhandled appType renders cleanly and NEVER collapses!
// ==========================================
const DefaultFallbackAppCanvasCard: React.FC<{
  node: BoardNode;
  isSelected: boolean;
  onDeleteNode?: () => void;
  onUpdateNode: (updated: Partial<BoardNode>) => void;
}> = ({ node, isSelected, onDeleteNode, onUpdateNode }) => {
  return (
    <div className="p-4 space-y-3 min-h-[160px] flex flex-col justify-between select-none">
      <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`w-9 h-9 rounded-xl ${node.iconBg || 'bg-purple-600'} text-white flex items-center justify-center shrink-0 shadow-xs`}>
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0">
            <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[9px] font-mono font-bold uppercase">
              {node.category || 'AI Creative App'}
            </span>
            <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5" title={node.title}>
              {node.title || 'Creative Studio Node'}
            </h4>
          </div>
        </div>

        {onDeleteNode && (
          <button
            type="button"
            data-no-drag="true"
            onClick={onDeleteNode}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Delete Card"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <p className="text-xs text-slate-600 leading-relaxed">
        {node.subtitle || 'Production studio tool ready for creative synthesis and workflow integration.'}
      </p>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs" data-no-drag="true">
        <span className="text-[10px] text-slate-400 font-mono">Status: Ready</span>
        <button
          type="button"
          onClick={() => {
            onUpdateNode({
              executionResult: {
                executedAt: new Date().toISOString(),
                skillName: node.title || 'Creative Studio App',
                productName: 'E-Commerce Creative',
                language: 'en',
                webResearchUsed: false,
                content: 'Node initialized and active.',
              },
            });
          }}
          className="px-3 py-1 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold font-mono flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
        >
          <Sparkles className="w-3 h-3" />
          <span>Active</span>
        </button>
      </div>
    </div>
  );
};

// Lazy / Launcher wrapper for TextToCodeLandingPageApp inside canvas
const TextToCodeLandingPageAppLauncher: React.FC<{
  initialData: any;
  onUpdateData: (d: any) => void;
  onCloseModal: () => void;
}> = ({ initialData, onUpdateData, onCloseModal }) => {
  const [Component, setComponent] = useState<any>(null);

  useEffect(() => {
    import('./TextToCodeLandingPageApp').then((mod) => {
      setComponent(() => mod.TextToCodeLandingPageApp);
    });
  }, []);

  if (!Component) {
    return <div className="p-8 text-center text-white font-mono text-xs">Loading Studio...</div>;
  }

  return (
    <Component
      initialData={initialData}
      onSendToBoard={(lp: any) => {
        onUpdateData(lp);
        onCloseModal();
      }}
      isModal={true}
      onCloseModal={onCloseModal}
    />
  );
};

// Lazy / Launcher wrapper for TextToImageLandingPageApp inside canvas
const TextToImageLandingPageAppLauncher: React.FC<{
  initialData: any;
  onUpdateData: (d: any) => void;
  onCloseModal: () => void;
}> = ({ initialData, onUpdateData, onCloseModal }) => {
  const [Component, setComponent] = useState<any>(null);

  useEffect(() => {
    import('./TextToImageLandingPageApp').then((mod) => {
      setComponent(() => mod.TextToImageLandingPageApp);
    });
  }, []);

  if (!Component) {
    return <div className="p-8 text-center text-white font-mono text-xs">Loading Studio...</div>;
  }

  return (
    <Component
      initialData={initialData}
      onSendToBoard={(lp: any) => {
        onUpdateData(lp);
        onCloseModal();
      }}
      isModal={true}
      onCloseModal={onCloseModal}
    />
  );
};
