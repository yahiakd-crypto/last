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
  const [renderMode, setRenderMode] = useState<'direct' | 'iframe'>('direct');
  const [isLoadingDirect, setIsLoadingDirect] = useState<boolean>(false);
  const directMountRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Direct DOM Rendering: Loads HTML content and scripts directly into document DOM (ZERO IFRAMES)
  useEffect(() => {
    if (renderMode !== 'direct') return;
    let isCancelled = false;
    setIsLoadingDirect(true);

    const targetUrl = currentUrl.startsWith('/') ? currentUrl : `/${currentUrl}`;

    fetch(targetUrl)
      .then((res) => res.text())
      .then((html) => {
        if (isCancelled) return;
        setIsLoadingDirect(false);

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // 1. Inject external and internal styles
        const styles = Array.from(doc.querySelectorAll('style, link[rel="stylesheet"]'));
        styles.forEach((styleNode) => {
          if (styleNode.tagName === 'LINK') {
            const href = styleNode.getAttribute('href');
            if (href) {
              const fullHref = href.startsWith('http') || href.startsWith('/') ? href : `/${href}`;
              if (!document.querySelector(`link[href="${fullHref}"]`)) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = fullHref;
                document.head.appendChild(link);
              }
            }
          } else if (styleNode.tagName === 'STYLE') {
            const s = document.createElement('style');
            s.textContent = styleNode.textContent;
            document.head.appendChild(s);
          }
        });

        // 2. Mount body content directly into top-level DOM
        if (directMountRef.current) {
          directMountRef.current.innerHTML = doc.body.innerHTML;

          // 3. Sequentially execute and evaluate page scripts
          const scriptTags = Array.from(doc.querySelectorAll('script'));
          const scriptsToLoad = scriptTags.map((s) => ({
            src: s.getAttribute('src'),
            inline: s.textContent,
          }));

          const loadScript = (idx: number) => {
            if (idx >= scriptsToLoad.length || isCancelled) {
              if ((window as any).lucide) {
                try {
                  (window as any).lucide.createIcons();
                } catch {}
              }
              return;
            }
            const item = scriptsToLoad[idx];
            const script = document.createElement('script');
            if (item.src) {
              const src = item.src.startsWith('http') || item.src.startsWith('/') ? item.src : `/${item.src}`;
              script.src = src;
              script.onload = () => loadScript(idx + 1);
              script.onerror = () => loadScript(idx + 1);
              document.body.appendChild(script);
            } else if (item.inline) {
              try {
                script.textContent = item.inline;
                document.body.appendChild(script);
              } catch {}
              loadScript(idx + 1);
            } else {
              loadScript(idx + 1);
            }
          };

          loadScript(0);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          setIsLoadingDirect(false);
          console.error('Failed to load direct page content:', err);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [currentUrl, renderMode, iframeKey]);

  // Intercept navigation links inside direct DOM mount to preserve SPA feel
  useEffect(() => {
    const container = directMountRef.current;
    if (!container || renderMode !== 'direct') return;

    const handleAnchorClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a');
      if (a) {
        const href = a.getAttribute('href');
        if (href) {
          if (href.endsWith('.html')) {
            e.preventDefault();
            setCurrentUrl(href);
          } else if (href === '/' || href.startsWith('/?')) {
            e.preventDefault();
            onBackToBoard();
          }
        }
      }
    };

    container.addEventListener('click', handleAnchorClick);
    return () => container.removeEventListener('click', handleAnchorClick);
  }, [renderMode]);

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
          {/* Mode Switcher: Direct DOM vs Iframe */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/80">
            <button
              type="button"
              onClick={() => setRenderMode('direct')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                renderMode === 'direct'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Render as top-level DOM nodes (Zero iframes) so Google AI Studio's Edit tool can select individual elements"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct DOM (Studio Edit)</span>
            </button>
            <button
              type="button"
              onClick={() => setRenderMode('iframe')}
              className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                renderMode === 'iframe'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Standard embedded iframe preview"
            >
              <span>Iframe</span>
            </button>
          </div>

          {/* Direct Page (Studio Edit Mode) Top-Level URL Button */}
          <button
            type="button"
            id="btn-direct-page-studio-edit"
            onClick={() => {
              const target = currentUrl.startsWith('/') ? currentUrl : `/${currentUrl}`;
              window.location.href = target;
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-extrabold transition-all shadow-sm hover:shadow cursor-pointer shrink-0"
            title="Open selected page directly as a top-level document (Zero iframes) for Google AI Studio native Edit mode"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Direct Page (Studio Edit Mode)</span>
          </button>

          {/* Back to Board Button */}
          <button
            type="button"
            onClick={onBackToBoard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer shrink-0"
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
        </div>
      </header>

      {/* Mode Status Banner */}
      <div className="bg-emerald-50/90 border-b border-emerald-100/90 px-4 py-2 flex items-center justify-between text-xs text-emerald-950 shrink-0 flex-wrap gap-2">
        <div className="flex items-center gap-2 truncate">
          <span className="font-extrabold bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px] uppercase tracking-wider shrink-0">
            {renderMode === 'direct' ? 'Studio Edit Mode Active' : 'Iframe Mode'}
          </span>
          <span className="truncate">
            {renderMode === 'direct' ? (
              <span>All elements rendered as <strong>top-level DOM nodes (Zero iframes)</strong>. Click Google Studio's <strong>Edit</strong> button to select any heading, button, card, or text!</span>
            ) : (
              <span>Currently in <strong>Iframe Mode</strong>. Click <strong>Direct DOM (Studio Edit)</strong> to remove the iframe.</span>
            )}
          </span>
        </div>
        <div className="flex items-center gap-2 ml-auto shrink-0">
          <span className="text-emerald-700 text-[11px] font-bold hidden lg:inline">
            Target: /{currentUrl}
          </span>
          <button
            type="button"
            onClick={() => {
              const target = currentUrl.startsWith('/') ? currentUrl : `/${currentUrl}`;
              window.location.href = target;
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-2xs cursor-pointer"
            title="Open as top-level document with zero iframes"
          >
            <span>Launch Top-Level URL</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Viewport: ZERO IFRAMES in Direct DOM mode! */}
      <main className="flex-1 w-full h-full relative overflow-y-auto bg-[#2B2B2E] select-auto">
        {renderMode === 'direct' ? (
          <div
            ref={directMountRef}
            className="direct-page-mount-point w-full min-h-full"
          />
        ) : (
          <iframe
            ref={iframeRef}
            key={iframeKey}
            src={iframeSrc}
            className="w-full h-full border-none select-auto pointer-events-auto"
            title={activeService.title}
          />
        )}
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

