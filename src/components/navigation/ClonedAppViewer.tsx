import React, { useState } from 'react';
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
    setIframeKey((prev) => prev + 1);
  };

  const handleReload = () => {
    setIframeKey((prev) => prev + 1);
  };

  const iframeSrc = currentUrl.startsWith('/') ? currentUrl : `/${currentUrl}`;

  return (
    <div className="w-screen h-screen flex flex-col bg-[#F7F8F7] overflow-hidden select-none">
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
            title="Open in Full Browser Tab"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </header>

      {/* Main Full-Height Iframe Viewport:
          No React sidebar is visible!
          The cloned app displays its own complete sidebar and interface! */}
      <main className="flex-1 w-full h-full relative overflow-hidden bg-white">
        <iframe
          key={iframeKey}
          src={iframeSrc}
          className="w-full h-full border-none"
          title={activeService.title}
        />
      </main>
    </div>
  );
};

