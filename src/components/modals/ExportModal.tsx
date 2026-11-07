import React, { useState } from 'react';
import { WorkflowProject } from '../../types/workflow';
import { X, Download, Upload, Copy, Check, FileJson, FileSpreadsheet, Code, AlertCircle } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: WorkflowProject;
  onImportProject: (imported: WorkflowProject) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  project,
  onImportProject,
}) => {
  const [activeTab, setActiveTab] = useState<'export_json' | 'import_json' | 'export_csv'>('export_json');
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const jsonString = JSON.stringify(project, null, 2);

  const handleDownloadJson = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_workflow.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImportSubmit = () => {
    try {
      setImportError(null);
      const parsed = JSON.parse(importText);
      if (!parsed.nodes || !Array.isArray(parsed.nodes)) {
        throw new Error('Invalid JSON: Must contain a "nodes" array.');
      }
      if (!parsed.edges || !Array.isArray(parsed.edges)) {
        throw new Error('Invalid JSON: Must contain an "edges" array.');
      }
      onImportProject(parsed);
      onClose();
    } catch (err: any) {
      setImportError(err.message || 'Failed to parse JSON file.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setImportText(event.target?.result as string);
    };
    reader.readAsText(file);
  };

  const handleDownloadCsv = () => {
    const headers = ['Node ID', 'Category', 'Title', 'Status', 'Audience', 'Spend (DZD)', 'Revenue (DZD)', 'Net Profit (DZD)'];
    const rows = project.nodes.map((n) => [
      n.id,
      n.category,
      `"${n.title.replace(/"/g, '""')}"`,
      n.status,
      n.audienceBadge || '',
      n.metrics?.spend || 0,
      n.metrics?.revenue || 0,
      n.metrics?.netProfit || 0,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_report.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Import & Export Engine</h3>
              <p className="text-[11px] text-slate-500">JSON schema backup, restore & CSV financial analytics</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center border-b border-slate-100 px-4 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('export_json')}
            className={`py-2 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'export_json' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Export JSON
          </button>
          <button
            onClick={() => setActiveTab('import_json')}
            className={`py-2 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'import_json' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Import JSON
          </button>
          <button
            onClick={() => setActiveTab('export_csv')}
            className={`py-2 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'export_csv' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Export CSV
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 overflow-y-auto">
          {activeTab === 'export_json' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Versioned Workflow JSON ({project.nodes.length} nodes, {project.edges.length} edges)</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyJson}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={handleDownloadJson}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .JSON</span>
                  </button>
                </div>
              </div>
              <textarea
                readOnly
                className="w-full h-72 p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] focus:outline-none select-all"
                value={jsonString}
              />
            </div>
          )}

          {activeTab === 'import_json' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-center">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                <p className="text-xs text-slate-600 font-medium">Upload JSON workflow file</p>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="mt-2 text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Or paste JSON content</label>
                <textarea
                  className="w-full h-44 p-3 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 focus:outline-none focus:border-blue-500 resize-none"
                  placeholder="Paste workflow JSON here..."
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                />
              </div>

              {importError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                  <span>{importError}</span>
                </div>
              )}

              <button
                onClick={handleImportSubmit}
                disabled={!importText.trim()}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <Upload className="w-4 h-4" />
                <span>Load & Validate Workflow</span>
              </button>
            </div>
          )}

          {activeTab === 'export_csv' && (
            <div className="space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                Export all node metrics, advertising spend, revenue collected, and net profit as a spreadsheet CSV compatible with Microsoft Excel and Google Sheets.
              </p>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-slate-800">Financial Summary</span>
                  <span className="font-mono text-slate-500">{project.nodes.length} records</span>
                </div>
                <div className="space-y-1.5 text-[11px] text-slate-600">
                  <div className="flex justify-between">
                    <span>Currency:</span>
                    <strong className="font-mono">{project.settings.currency}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Algerian COD Nodes:</span>
                    <strong className="font-mono">{project.nodes.filter((n) => n.category === 'algeria_cod').length}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Export Format:</span>
                    <strong className="font-mono">Standard RFC 4180 CSV</strong>
                  </div>
                </div>
              </div>
              <button
                onClick={handleDownloadCsv}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Download Report CSV</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
