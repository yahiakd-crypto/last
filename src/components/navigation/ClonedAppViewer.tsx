import React, { useState, useEffect, useRef } from 'react';
import {
  ServicesMenuDropdown,
  ServiceItem,
  PUNCHLINE_SERVICES,
} from './ServicesMenuDropdown';
import {
  ArrowLeft,
  ExternalLink,
  RotateCw,
  Workflow,
  Maximize2,
  Crosshair,
  Copy,
  Check,
  Sparkles,
  X,
} from 'lucide-react';

interface ClonedAppViewerProps {
  initialUrl: string;
  onBackToBoard: () => void;
}

export const ClonedAppViewer: React.FC<ClonedAppViewerProps> = ({
  initialUrl,
  onBackToBoard,
}) => {
  const [currentUrl, setCurrentUrl] = useState<string>(initialUrl);
  const [iframeKey, setIframeKey] = useState<number>(1);
  const [isHeaderCompact, setIsHeaderCompact] = useState<boolean>(false);
  const [isInspectorActive, setIsInspectorActive] = useState<boolean>(false);
  const [selectedElement, setSelectedElement] = useState<{
    selector: string;
    tagName: string;
    id: string;
    className: string;
    text: string;
  } | null>(null);
  const [promptInstruction, setPromptInstruction] = useState<string>('');
  const [copiedSelector, setCopiedSelector] = useState<boolean>(false);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMsg = (e: MessageEvent) => {
      if (e.data?.type === 'AI_STUDIO_ELEMENT_SELECTED') {
        setSelectedElement(e.data);
        setCopiedSelector(false);
        setCopiedPrompt(false);
      } else if (e.data?.type === 'INSPECTOR_STATE_CHANGED') {
        setIsInspectorActive(e.data.active);
      }
    };
    window.addEventListener('message', handleMsg);
    return () => window.removeEventListener('message', handleMsg);
  }, []);

  const handleToggleInspector = () => {
    const nextState = !isInspectorActive;
    setIsInspectorActive(nextState);
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'TOGGLE_INSPECTOR_MODE', enabled: nextState },
        '*'
      );
    }
  };

  const handleCopySelector = () => {
    if (!selectedElement) return;
    navigator.clipboard.writeText(selectedElement.selector);
    setCopiedSelector(true);
    setTimeout(() => setCopiedSelector(false), 2000);
  };

  const handleCopyPrompt = () => {
    if (!selectedElement) return;
    const instruction = promptInstruction.trim() || 'Please modify this element.';
    const prompt = `[AIS_METADATA_SECTION_START]\nCSS selector 1: ${selectedElement.selector}\nCSS 1: {}\n[AIS_METADATA_SECTION_END]\n${instruction}`;
    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  const activeService =
    PUNCHLINE_SERVICES.find((s) => s.url === currentUrl) || {
      id: 'app',
      title: 'PUNCHLINE APP',
      subtitle: currentUrl,
      url: currentUrl,
      icon: null,
    };

  const handleSelectService = (service: ServiceItem) => {
    if (service.url === 'board') {
      onBackToBoard();
      return;
    }
    setCurrentUrl(service.url);
    setSelectedElement(null);
    setIframeKey((prev) => prev + 1);
  };

  const handleReload = () => {
    setIframeKey((prev) => prev + 1);
  };

  const iframeSrc = currentUrl.startsWith('/') ? currentUrl : `/${currentUrl}`;

  return (
    <div className="w-screen h-screen flex flex-col bg-[#F7F8F7] overflow-hidden select-auto relative">
      {/* Top Punchline Unified Navigation Bar */}
      <header className="h-13 bg-white border-b border-slate-200/90 px-4 flex items-center justify-between shrink-0 z-30 shadow-2xs">
        {/* Left: Punchline Logo with Full Services Menu */}
        <div className="flex items-center gap-3">
          <ServicesMenuDropdown
            currentUrl={currentUrl}
            onSelectService={handleSelectService}
          />

          <div className="w-[1px] h-5 bg-slate-200 mx-1 hidden sm:block" />

          {/* Active Service Pill */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-100/80 text-emerald-800 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{activeService.title}</span>
            <span className="text-emerald-500/70 font-normal text-[11px] hidden md:inline">
              · {activeService.subtitle}
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Select & Edit Element Mode Button */}
          <button
            type="button"
            onClick={handleToggleInspector}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer border ${
              isInspectorActive
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-emerald-500/20'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200/80'
            }`}
            title="Click any element on the page to inspect & edit for Google Studio"
          >
            <Crosshair className={`w-3.5 h-3.5 ${isInspectorActive ? 'animate-spin' : ''}`} />
            <span>{isInspectorActive ? 'Click Any Element...' : '🎯 Select Element to Edit'}</span>
          </button>

          {/* Back to Board Button */}
          <button
            type="button"
            onClick={onBackToBoard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
            title="Return to React Workflow Board"
          >
            <Workflow className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to Board OS</span>
          </button>

          {/* Reload App */}
          <button
            type="button"
            onClick={handleReload}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
            title="Reload Cloned App"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Open in full tab */}
          <a
            href={iframeSrc}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
            title="Open Direct Page in Full Browser Tab (No Iframe)"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </header>

      {/* Main Full-Height Iframe Viewport */}
      <main className="flex-1 w-full h-full relative overflow-hidden bg-white select-auto">
        <iframe
          ref={iframeRef}
          key={iframeKey}
          src={iframeSrc}
          className="w-full h-full border-none select-auto pointer-events-auto"
          title={activeService.title}
        />
      </main>

      {/* Floating Selected Element Inspector Drawer */}
      {selectedElement && (
        <div className="absolute bottom-5 right-5 z-50 w-[420px] max-w-[calc(100vw-40px)] bg-white border-2 border-emerald-500 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="bg-emerald-50 px-4 py-3 border-b border-emerald-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-extrabold">
                🎯
              </span>
              <div>
                <div className="text-xs font-extrabold text-emerald-950">
                  Element Selected for Edit
                </div>
                <div className="text-[11px] text-emerald-700/80 font-mono">
                  &lt;{selectedElement.tagName}&gt;
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedElement(null)}
              className="p-1 hover:bg-emerald-100/80 text-emerald-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-3">
            {/* CSS Selector */}
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1 block">
                Target CSS Selector
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={selectedElement.selector}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono text-[11px] text-emerald-800 font-semibold truncate outline-none select-all"
                />
                <button
                  type="button"
                  onClick={handleCopySelector}
                  className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                >
                  {copiedSelector ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSelector ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Content Preview */}
            {selectedElement.text && (
              <div className="bg-slate-50 border border-slate-100 rounded-lg p-2 text-xs text-slate-600 line-clamp-2 italic">
                "{selectedElement.text}"
              </div>
            )}

            {/* Instruction input */}
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1 block">
                Tell Google AI Studio What to Change
              </label>
              <input
                type="text"
                value={promptInstruction}
                onChange={(e) => setPromptInstruction(e.target.value)}
                placeholder="e.g., make it wider, change background to orange, make text bold"
                className="w-full bg-white border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none transition-all"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCopyPrompt();
                }}
              />
            </div>

            {/* Copy Prompt for Google AI Studio Button */}
            <button
              type="button"
              onClick={handleCopyPrompt}
              className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              {copiedPrompt ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied for AI Studio! Paste into Chat</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Copy Instructions for Google AI Studio</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

