import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Settings,
  User,
  Sliders,
  Sparkles,
  CreditCard,
  Layers,
  ShoppingBag,
  Bell,
  Globe,
  Database,
  Terminal,
  HelpCircle,
  Eye,
  EyeOff,
  Check,
  CheckCircle2,
  ChevronDown,
  Upload,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Cpu,
  RefreshCw,
  Zap,
  Key,
  Lock,
  Server,
  Smartphone,
  X,
  AlertCircle,
  Trash2,
  Copy,
  Download,
  Phone,
  MapPin,
  Activity,
  CheckCheck,
  Plus,
  GitBranch,
  FolderGit2,
  GitCommit,
  GitPullRequest,
  Code2,
} from 'lucide-react';
import { AppSidebar } from '../navigation/AppSidebar';
import { AppHeader } from '../navigation/AppHeader';

const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

interface SettingsPageProps {
  onNavigate: (view: string, subItem?: string) => void;
  activeSubItem?: string;
  onOpenSearchModal?: () => void;
}

export type SettingsTabId =
  | 'all'
  | 'general'
  | 'ai'
  | 'github'
  | 'integrations'
  | 'ecommerce'
  | 'tracking'
  | 'notifications'
  | 'security'
  | 'billing';

export const SettingsPage: React.FC<SettingsPageProps> = ({
  onNavigate,
  activeSubItem = 'all',
  onOpenSearchModal,
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTabId>(() => {
    if (activeSubItem && ['general', 'ai', 'github', 'integrations', 'ecommerce', 'tracking', 'notifications', 'security', 'billing'].includes(activeSubItem)) {
      return activeSubItem as SettingsTabId;
    }
    return 'all';
  });

  useEffect(() => {
    if (activeSubItem && ['general', 'ai', 'github', 'integrations', 'ecommerce', 'tracking', 'notifications', 'security', 'billing', 'all'].includes(activeSubItem)) {
      setActiveTab(activeSubItem as SettingsTabId);
    }
  }, [activeSubItem]);

  // -------------------------------------------------------------
  // 1. PROFILE & ACCOUNT STATE
  // -------------------------------------------------------------
  const [name, setName] = useState(() => localStorage.getItem('user_name') || 'Yahia Kada');
  const [email, setEmail] = useState(() => localStorage.getItem('user_email') || 'yahia.kada@example.com');
  const [phone, setPhone] = useState(() => localStorage.getItem('user_phone') || '+213 550 12 34 56');
  const [wilaya, setWilaya] = useState(() => localStorage.getItem('user_wilaya') || '16 - Alger');
  const [avatar, setAvatar] = useState<string | null>(() => localStorage.getItem('user_avatar') || null);
  const [profileSaved, setProfileSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Change Password Modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // -------------------------------------------------------------
  // 2. AI & API CONFIGURATION (DEEPSEEK, GEMINI, OPENAI, ANTHROPIC, OPENROUTER, AGENTROUTER, NVIDIA)
  // -------------------------------------------------------------
  const [aiProvider, setAiProvider] = useState<
    'deepseek' | 'gemini' | 'openai' | 'anthropic' | 'openrouter' | 'agentrouter' | 'nvidia' | 'custom'
  >(() => {
    return (localStorage.getItem('ai_provider') as any) || 'openai';
  });

  // Keep separate storage keys so switching providers keeps keys intact
  const [deepseekKey, setDeepseekKey] = useState(() => localStorage.getItem('deepseek_api_key') || '');
  const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem('gemini_api_key') || localStorage.getItem('user_api_key') || '');
  const [openaiKey, setOpenaiKey] = useState(() => {
    const stored = localStorage.getItem('openai_api_key');
    if (stored && stored.includes('pLR9ijJfrTx-qqmIj4vV8gxmrcr53U6awReyoGDvX-lZtmbnWG')) {
      localStorage.removeItem('openai_api_key');
      return '';
    }
    return stored || '';
  });
  const [anthropicKey, setAnthropicKey] = useState(() => localStorage.getItem('anthropic_api_key') || '');
  const [openrouterKey, setOpenrouterKey] = useState(() => localStorage.getItem('openrouter_api_key') || '');
  const [agentrouterKey, setAgentrouterKey] = useState(() => localStorage.getItem('agentrouter_api_key') || '');
  const [nvidiaKey, setNvidiaKey] = useState(() => localStorage.getItem('nvidia_api_key') || '');

  const [aiModel, setAiModel] = useState(() => {
    return localStorage.getItem('ai_model') || 'gpt-4o-mini';
  });
  const [temperature, setTemperature] = useState(0.7);
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeySavedSuccess, setApiKeySavedSuccess] = useState(false);
  const [isTestingAi, setIsTestingAi] = useState(false);
  const [aiTestResult, setAiTestResult] = useState<{
    success: boolean;
    message: string;
    latencyMs?: number;
    reply?: string;
  } | null>(null);

  // Live Detected Models state from API
  const [availableModels, setAvailableModels] = useState<
    Array<{ id: string; name: string; isRecommended?: boolean; category?: string }>
  >([]);
  const [isDetectingModels, setIsDetectingModels] = useState(false);
  const [detectedModelsMsg, setDetectedModelsMsg] = useState<string | null>(null);
  const [isCustomModelActive, setIsCustomModelActive] = useState(false);
  const [customModelInput, setCustomModelInput] = useState('');

  // Per-model and batch model testing state
  const [isTestingCurrentModel, setIsTestingCurrentModel] = useState(false);
  const [currentModelTestResult, setCurrentModelTestResult] = useState<{
    model: string;
    success: boolean;
    latencyMs?: number;
    reply?: string;
    message?: string;
  } | null>(null);
  const [isBatchTesting, setIsBatchTesting] = useState(false);
  const [batchResults, setBatchResults] = useState<
    Array<{ model: string; success: boolean; status?: number; latencyMs?: number; reply?: string; error?: string }>
  >([]);
  const [showBatchResults, setShowBatchResults] = useState(false);

  // =========================================================================
  // SAVED API KEYS VAULT (Allows instant one-click selection of saved keys)
  // =========================================================================
  const [savedKeysVault, setSavedKeysVault] = useState<
    Array<{
      id: string;
      name: string;
      provider: 'openai' | 'gemini' | 'deepseek' | 'anthropic' | 'openrouter' | 'agentrouter' | 'nvidia' | 'custom';
      key: string;
      preferredModel: string;
      createdAt: string;
      lastUsedAt?: string;
    }>
  >(() => {
    const stored = localStorage.getItem('saved_api_keys_vault');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse saved_api_keys_vault', e);
      }
    }
    const initial: Array<{
      id: string;
      name: string;
      provider: 'openai' | 'gemini' | 'deepseek' | 'anthropic' | 'openrouter' | 'agentrouter' | 'nvidia' | 'custom';
      key: string;
      preferredModel: string;
      createdAt: string;
      lastUsedAt?: string;
    }> = [];

    const oKey = localStorage.getItem('openai_api_key');
    if (oKey && !oKey.includes('pLR9ijJfrTx-qqmIj4vV8gxmrcr53U6awReyoGDvX-lZtmbnWG')) {
      initial.push({
        id: 'key_openai_primary',
        name: 'Primary OpenAI Account',
        provider: 'openai',
        key: oKey,
        preferredModel: 'gpt-4o-mini',
        createdAt: new Date().toLocaleDateString(),
        lastUsedAt: 'Active Now',
      });
    }
    const dKey = localStorage.getItem('deepseek_api_key');
    if (dKey) {
      initial.push({
        id: 'key_deepseek_primary',
        name: 'DeepSeek Platform Key',
        provider: 'deepseek',
        key: dKey,
        preferredModel: 'deepseek-chat',
        createdAt: new Date().toLocaleDateString(),
      });
    }
    const gKey = localStorage.getItem('gemini_api_key');
    if (gKey) {
      initial.push({
        id: 'key_gemini_primary',
        name: 'Google AI Studio Key',
        provider: 'gemini',
        key: gKey,
        preferredModel: 'gemini-3.8-flash',
        createdAt: new Date().toLocaleDateString(),
      });
    }

    const orKey = localStorage.getItem('openrouter_api_key');
    if (orKey) {
      initial.push({
        id: 'key_openrouter_primary',
        name: 'OpenRouter Account Key',
        provider: 'openrouter',
        key: orKey,
        preferredModel: 'deepseek/deepseek-r1',
        createdAt: new Date().toLocaleDateString(),
      });
    }

    const arKey = localStorage.getItem('agentrouter_api_key');
    if (arKey) {
      initial.push({
        id: 'key_agentrouter_primary',
        name: 'AgentRouter Account Key',
        provider: 'agentrouter',
        key: arKey,
        preferredModel: 'agentrouter/auto',
        createdAt: new Date().toLocaleDateString(),
      });
    }

    const nvKey = localStorage.getItem('nvidia_api_key');
    if (nvKey) {
      initial.push({
        id: 'key_nvidia_primary',
        name: 'NVIDIA NIM API Key',
        provider: 'nvidia',
        key: nvKey,
        preferredModel: 'meta/llama-3.3-70b-instruct',
        createdAt: new Date().toLocaleDateString(),
      });
    }

    return initial;
  });

  const [vaultSelectedNotice, setVaultSelectedNotice] = useState<string | null>(null);
  const [showAddKeyModal, setShowAddKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyProvider, setNewKeyProvider] = useState<
    'openai' | 'gemini' | 'deepseek' | 'anthropic' | 'openrouter' | 'agentrouter' | 'nvidia'
  >('openai');
  const [newKeyValue, setNewKeyValue] = useState('');
  const [newKeyModel, setNewKeyModel] = useState('gpt-4o-mini');
  const [newKeyError, setNewKeyError] = useState<string | null>(null);

  // Auto-persist OpenAI key if valid and entered
  useEffect(() => {
    if (openaiKey && openaiKey.trim() && !openaiKey.includes('pLR9ijJfrTx-qqmIj4vV8gxmrcr53U6awReyoGDvX-lZtmbnWG')) {
      localStorage.setItem('openai_api_key', openaiKey.trim());
      localStorage.setItem('user_api_key', openaiKey.trim());
    }
  }, [openaiKey]);

  const [features, setFeatures] = useState({
    textGen: true,
    codeGen: true,
    imageAnalysis: true,
    webSearch: true,
  });

  // Current active API key according to provider
  const currentKey =
    aiProvider === 'deepseek'
      ? deepseekKey
      : aiProvider === 'gemini'
      ? geminiKey
      : aiProvider === 'openai'
      ? openaiKey
      : aiProvider === 'openrouter'
      ? openrouterKey
      : aiProvider === 'agentrouter'
      ? agentrouterKey
      : aiProvider === 'nvidia'
      ? nvidiaKey
      : anthropicKey;

  const setCurrentKey = (val: string) => {
    if (aiProvider === 'deepseek') setDeepseekKey(val);
    else if (aiProvider === 'gemini') setGeminiKey(val);
    else if (aiProvider === 'openai') setOpenaiKey(val);
    else if (aiProvider === 'openrouter') setOpenrouterKey(val);
    else if (aiProvider === 'agentrouter') setAgentrouterKey(val);
    else if (aiProvider === 'nvidia') setNvidiaKey(val);
    else setAnthropicKey(val);
  };

  const handleDetectModels = useCallback(async (prov = aiProvider, key = currentKey) => {
    setIsDetectingModels(true);
    setDetectedModelsMsg(null);
    try {
      const res = await fetch('/api/ai/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: prov,
          apiKey: key.trim(),
        }),
      });
      const data = await res.json();
      if (data.models && data.models.length > 0) {
        setAvailableModels(data.models);
        setDetectedModelsMsg(data.message || `Detected ${data.models.length} active models`);
        const modelExists = data.models.some((m: any) => m.id === aiModel);
        if (!modelExists && !isCustomModelActive) {
          const defaultPick = data.models.find((m: any) => m.isRecommended)?.id || data.models[0].id;
          setAiModel(defaultPick);
          localStorage.setItem('ai_model', defaultPick);
        }
      } else {
        setDetectedModelsMsg(data.message || 'No models returned from API.');
      }
    } catch (err: any) {
      setDetectedModelsMsg(`Detection error: ${err.message}`);
    } finally {
      setIsDetectingModels(false);
    }
  }, [aiProvider, currentKey, aiModel, isCustomModelActive]);

  const handleTestSingleModel = async (modelToTest = aiModel) => {
    setIsTestingCurrentModel(true);
    setCurrentModelTestResult(null);
    try {
      const res = await fetch('/api/ai/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: aiProvider,
          apiKey: currentKey.trim(),
          model: modelToTest,
        }),
      });
      const data = await res.json();
      setCurrentModelTestResult({
        model: modelToTest,
        success: data.success,
        latencyMs: data.latencyMs,
        reply: data.reply,
        message: data.message || (data.success ? 'Model verified and operational.' : 'Failed to connect.'),
      });

      if (data.success) {
        try {
          const stored: any[] = JSON.parse(localStorage.getItem('verified_working_models') || '[]');
          const otherModels = stored.filter((m) => !(m.id === modelToTest && m.provider === aiProvider));
          const updated = [
            {
              id: modelToTest,
              name: modelToTest,
              provider: aiProvider,
              latencyMs: data.latencyMs,
              success: true,
              testedAt: new Date().toLocaleTimeString(),
            },
            ...otherModels,
          ];
          localStorage.setItem('verified_working_models', JSON.stringify(updated));
        } catch {}
      }
    } catch (err: any) {
      setCurrentModelTestResult({
        model: modelToTest,
        success: false,
        message: err?.message || 'Connection error',
      });
    } finally {
      setIsTestingCurrentModel(false);
    }
  };

  const handleTestAllModels = async () => {
    setIsBatchTesting(true);
    setShowBatchResults(true);
    try {
      const modelsToTest = (availableModels.length > 0
        ? availableModels.map((m) => m.id)
        : aiProvider === 'openai'
        ? ['gpt-4o-mini', 'gpt-4o', 'o1-mini', 'gpt-4-turbo', 'gpt-3.5-turbo']
        : [aiModel]
      ).slice(0, 15);

      const res = await fetch('/api/ai/test-models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: aiProvider,
          apiKey: currentKey.trim(),
          models: modelsToTest,
        }),
      });
      const data = await res.json();
      if (data.results) {
        setBatchResults(data.results);
        localStorage.setItem('tested_models_diagnostic', JSON.stringify(data.results));

        const workingOnes = data.results
          .filter((r: any) => r.success)
          .map((r: any) => ({
            id: r.model,
            name: r.model,
            provider: aiProvider,
            latencyMs: r.latencyMs,
            success: true,
            reply: r.reply,
            testedAt: new Date().toLocaleTimeString(),
          }));

        try {
          const stored: any[] = JSON.parse(localStorage.getItem('verified_working_models') || '[]');
          // Remove previous entries for this provider that were tested in this run
          const testedIds = new Set(modelsToTest);
          const untouched = stored.filter((m) => m.provider !== aiProvider || !testedIds.has(m.id));
          const merged = [...workingOnes, ...untouched];
          localStorage.setItem('verified_working_models', JSON.stringify(merged));
        } catch {
          localStorage.setItem('verified_working_models', JSON.stringify(workingOnes));
        }

        // If current model failed but another model succeeded, auto-select first working model
        const currentPassed = workingOnes.some((w: any) => w.id === aiModel);
        if (!currentPassed && workingOnes.length > 0) {
          setAiModel(workingOnes[0].id);
          localStorage.setItem('ai_model', workingOnes[0].id);
        }
      }
    } catch (err: any) {
      console.error('Batch test error:', err);
    } finally {
      setIsBatchTesting(false);
    }
  };

  useEffect(() => {
    handleDetectModels(aiProvider, currentKey);
  }, []);

  const handleSelectProvider = (
    prov: 'deepseek' | 'gemini' | 'openai' | 'anthropic' | 'openrouter' | 'agentrouter' | 'nvidia' | 'custom'
  ) => {
    setAiProvider(prov);
    localStorage.setItem('ai_provider', prov);
    let targetModel = 'gpt-4o-mini';
    if (prov === 'deepseek') {
      targetModel = 'deepseek-chat';
      if (deepseekKey) localStorage.setItem('user_api_key', deepseekKey.trim());
    } else if (prov === 'gemini') {
      targetModel = 'gemini-3.8-flash';
      if (geminiKey) localStorage.setItem('user_api_key', geminiKey.trim());
    } else if (prov === 'openai') {
      targetModel = 'gpt-4o-mini';
      if (openaiKey) {
        localStorage.setItem('openai_api_key', openaiKey.trim());
        localStorage.setItem('user_api_key', openaiKey.trim());
      }
    } else if (prov === 'openrouter') {
      targetModel = 'nvidia/nemotron-3.5-lightning:free';
      if (openrouterKey) {
        localStorage.setItem('openrouter_api_key', openrouterKey.trim());
        localStorage.setItem('user_api_key', openrouterKey.trim());
      }
    } else if (prov === 'agentrouter') {
      targetModel = 'gpt-4o';
      if (agentrouterKey) {
        localStorage.setItem('agentrouter_api_key', agentrouterKey.trim());
        localStorage.setItem('user_api_key', agentrouterKey.trim());
      }
    } else if (prov === 'nvidia') {
      targetModel = 'meta/llama-3.3-70b-instruct';
      if (nvidiaKey) {
        localStorage.setItem('nvidia_api_key', nvidiaKey.trim());
        localStorage.setItem('user_api_key', nvidiaKey.trim());
      }
    } else if (prov === 'anthropic') {
      targetModel = 'claude-3-5-sonnet';
    }

    setAiModel(targetModel);
    localStorage.setItem('ai_model', targetModel);
    setIsCustomModelActive(false);
    setAiTestResult(null);

    const keyToUse =
      prov === 'deepseek'
        ? deepseekKey
        : prov === 'gemini'
        ? geminiKey
        : prov === 'openai'
        ? openaiKey
        : prov === 'openrouter'
        ? openrouterKey
        : prov === 'agentrouter'
        ? agentrouterKey
        : prov === 'nvidia'
        ? nvidiaKey
        : anthropicKey;

    handleDetectModels(prov, keyToUse);
  };

  const handleSelectKeyFromVault = (item: {
    id: string;
    name: string;
    provider: 'openai' | 'gemini' | 'deepseek' | 'anthropic' | 'openrouter' | 'agentrouter' | 'nvidia' | 'custom';
    key: string;
    preferredModel: string;
  }) => {
    setAiProvider(item.provider);
    localStorage.setItem('ai_provider', item.provider);
    if (item.provider === 'openai') {
      setOpenaiKey(item.key);
      localStorage.setItem('openai_api_key', item.key);
    } else if (item.provider === 'gemini') {
      setGeminiKey(item.key);
      localStorage.setItem('gemini_api_key', item.key);
    } else if (item.provider === 'deepseek') {
      setDeepseekKey(item.key);
      localStorage.setItem('deepseek_api_key', item.key);
    } else if (item.provider === 'openrouter') {
      setOpenrouterKey(item.key);
      localStorage.setItem('openrouter_api_key', item.key);
    } else if (item.provider === 'agentrouter') {
      setAgentrouterKey(item.key);
      localStorage.setItem('agentrouter_api_key', item.key);
    } else if (item.provider === 'nvidia') {
      setNvidiaKey(item.key);
      localStorage.setItem('nvidia_api_key', item.key);
    } else if (item.provider === 'anthropic') {
      setAnthropicKey(item.key);
      localStorage.setItem('anthropic_api_key', item.key);
    }
    localStorage.setItem('user_api_key', item.key);
    setAiModel(item.preferredModel);
    localStorage.setItem('ai_model', item.preferredModel);
    setIsCustomModelActive(false);

    setSavedKeysVault((prev) => {
      const updated = prev.map((k) =>
        k.id === item.id
          ? { ...k, lastUsedAt: 'Active Now' }
          : { ...k, lastUsedAt: k.lastUsedAt === 'Active Now' ? new Date().toLocaleDateString() : k.lastUsedAt }
      );
      localStorage.setItem('saved_api_keys_vault', JSON.stringify(updated));
      return updated;
    });

    handleDetectModels(item.provider, item.key);
    setVaultSelectedNotice(`Activated ${item.name} (${item.provider.toUpperCase()} - ${item.preferredModel})`);
    setTimeout(() => setVaultSelectedNotice(null), 3500);
  };

  const handleDeleteKeyFromVault = (id: string) => {
    setSavedKeysVault((prev) => {
      const updated = prev.filter((k) => k.id !== id);
      localStorage.setItem('saved_api_keys_vault', JSON.stringify(updated));
      return updated;
    });
  };

  const handleAddNewKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyValue.trim()) {
      setNewKeyError('API Key value is required.');
      return;
    }
    const cleanName = newKeyName.trim() || `${newKeyProvider.toUpperCase()} Key`;
    const cleanModel =
      newKeyModel.trim() ||
      (newKeyProvider === 'openai'
        ? 'gpt-4o-mini'
        : newKeyProvider === 'deepseek'
        ? 'deepseek-chat'
        : 'gemini-3.8-flash');

    const newItem = {
      id: `key_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: cleanName,
      provider: newKeyProvider,
      key: newKeyValue.trim(),
      preferredModel: cleanModel,
      createdAt: new Date().toLocaleDateString(),
      lastUsedAt: 'Saved in Vault',
    };

    setSavedKeysVault((prev) => {
      const updated = [newItem, ...prev];
      localStorage.setItem('saved_api_keys_vault', JSON.stringify(updated));
      return updated;
    });

    setNewKeyName('');
    setNewKeyValue('');
    setNewKeyError(null);
    setShowAddKeyModal(false);
    setVaultSelectedNotice(`Added "${cleanName}" to API Key Vault.`);
    setTimeout(() => setVaultSelectedNotice(null), 3500);
  };

  const handleSaveAiConfig = (customName?: string) => {
    localStorage.setItem('ai_provider', aiProvider);
    localStorage.setItem('ai_model', aiModel);

    if (aiProvider === 'deepseek') {
      localStorage.setItem('deepseek_api_key', deepseekKey.trim());
      localStorage.setItem('user_api_key', deepseekKey.trim());
    } else if (aiProvider === 'gemini') {
      localStorage.setItem('gemini_api_key', geminiKey.trim());
      localStorage.setItem('user_api_key', geminiKey.trim());
    } else if (aiProvider === 'openai') {
      localStorage.setItem('openai_api_key', openaiKey.trim());
      localStorage.setItem('user_api_key', openaiKey.trim());
    } else if (aiProvider === 'openrouter') {
      localStorage.setItem('openrouter_api_key', openrouterKey.trim());
      localStorage.setItem('user_api_key', openrouterKey.trim());
    } else if (aiProvider === 'agentrouter') {
      localStorage.setItem('agentrouter_api_key', agentrouterKey.trim());
      localStorage.setItem('user_api_key', agentrouterKey.trim());
    } else if (aiProvider === 'nvidia') {
      localStorage.setItem('nvidia_api_key', nvidiaKey.trim());
      localStorage.setItem('user_api_key', nvidiaKey.trim());
    } else if (aiProvider === 'anthropic') {
      localStorage.setItem('anthropic_api_key', anthropicKey.trim());
      localStorage.setItem('user_api_key', anthropicKey.trim());
    }

    if (currentKey.trim()) {
      setSavedKeysVault((prev) => {
        const existingIdx = prev.findIndex(
          (k) => k.key.trim() === currentKey.trim() && k.provider === aiProvider
        );
        let updated;
        if (existingIdx >= 0) {
          updated = prev.map((k, idx) =>
            idx === existingIdx
              ? {
                  ...k,
                  name: customName || k.name,
                  preferredModel: aiModel,
                  lastUsedAt: 'Active Now',
                }
              : k
          );
        } else {
          const newItem = {
            id: `key_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            name: customName || `${aiProvider.toUpperCase()} Account Key`,
            provider: aiProvider,
            key: currentKey.trim(),
            preferredModel: aiModel,
            createdAt: new Date().toLocaleDateString(),
            lastUsedAt: 'Active Now',
          };
          updated = [newItem, ...prev];
        }
        localStorage.setItem('saved_api_keys_vault', JSON.stringify(updated));
        return updated;
      });
    }

    setApiKeySavedSuccess(true);
    setTimeout(() => setApiKeySavedSuccess(false), 3000);
  };

  const handleRunAiTest = async () => {
    setIsTestingAi(true);
    setAiTestResult(null);
    try {
      const res = await fetch('/api/ai/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: aiProvider,
          apiKey: currentKey.trim(),
          model: aiModel,
        }),
      });

      const data = await res.json();
      setAiTestResult({
        success: data.success,
        message: data.message || 'API responded.',
        latencyMs: data.latencyMs,
        reply: data.reply,
      });
    } catch (err: any) {
      setAiTestResult({
        success: false,
        message: err?.message || 'Failed to reach testing endpoint.',
      });
    } finally {
      setIsTestingAi(false);
    }
  };

  // -------------------------------------------------------------
  // 3. E-COMMERCE & COD SETTINGS
  // -------------------------------------------------------------
  const [storePlatform, setStorePlatform] = useState(() => localStorage.getItem('ecommerce_platform') || 'Shopify');
  const [currency, setCurrency] = useState(() => localStorage.getItem('ecommerce_currency') || 'DZD - Algerian Dinar');
  const [timeZone, setTimeZone] = useState(() => localStorage.getItem('ecommerce_timezone') || '(GMT+1) Algeria');
  const [shippingProvider, setShippingProvider] = useState(() => localStorage.getItem('ecommerce_shipping') || 'Yalidine Express');
  const [autoConfirmCod, setAutoConfirmCod] = useState(() => localStorage.getItem('ecommerce_autoconfirm') === 'true');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  const handleSaveEcommerce = () => {
    localStorage.setItem('ecommerce_platform', storePlatform);
    localStorage.setItem('ecommerce_currency', currency);
    localStorage.setItem('ecommerce_timezone', timeZone);
    localStorage.setItem('ecommerce_shipping', shippingProvider);
    localStorage.setItem('ecommerce_autoconfirm', String(autoConfirmCod));
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 2500);
  };

  // -------------------------------------------------------------
  // 4. ADS & TRACKING PIXELS
  // -------------------------------------------------------------
  const [pixels, setPixels] = useState(() => {
    const saved = localStorage.getItem('tracking_pixels');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      fbPixelId: '84920194829103',
      fbEnabled: true,
      gtmId: 'GTM-N84920',
      gtmEnabled: true,
      tiktokPixelId: '',
      tiktokEnabled: false,
      snapchatPixelId: '',
      snapchatEnabled: false,
    };
  });
  const [pixelSaveSuccess, setPixelSaveSuccess] = useState(false);

  const handleSavePixels = () => {
    localStorage.setItem('tracking_pixels', JSON.stringify(pixels));
    setPixelSaveSuccess(true);
    setTimeout(() => setPixelSaveSuccess(false), 2500);
  };

  // -------------------------------------------------------------
  // 5. INTEGRATIONS
  // -------------------------------------------------------------
  interface IntegrationItem {
    id: string;
    name: string;
    connected: boolean;
    icon: string;
    color: string;
    category: string;
  }

  const [integrations, setIntegrations] = useState<IntegrationItem[]>(() => {
    const saved = localStorage.getItem('integrations_list');
    if (saved) {
      try {
        return JSON.parse(saved) as IntegrationItem[];
      } catch {}
    }
    return [
      { id: 'fb', name: 'Facebook Ads', connected: true, icon: 'f', color: '#1877F2', category: 'Advertising' },
      { id: 'ig', name: 'Instagram', connected: true, icon: '📷', color: '#E4405F', category: 'Advertising' },
      { id: 'tt', name: 'TikTok Ads', connected: true, icon: '🎵', color: '#000000', category: 'Advertising' },
      { id: 'ga', name: 'Google Ads', connected: false, icon: 'G', color: '#4285F4', category: 'Advertising' },
      { id: 'sp', name: 'Shopify', connected: true, icon: '🛍️', color: '#96BF48', category: 'Store' },
      { id: 'yalidine', name: 'Yalidine Express', connected: true, icon: '🚚', color: '#E11D48', category: 'Logistics' },
      { id: 'zr', name: 'ZR Express', connected: false, icon: '📦', color: '#2563EB', category: 'Logistics' },
      { id: 'wa', name: 'WhatsApp COD Bot', connected: true, icon: '💬', color: '#25D366', category: 'Communication' },
    ];
  });

  const handleToggleIntegration = (id: string) => {
    setIntegrations((prev: IntegrationItem[]) => {
      const next = prev.map((item: IntegrationItem) => (item.id === id ? { ...item, connected: !item.connected } : item));
      localStorage.setItem('integrations_list', JSON.stringify(next));
      return next;
    });
  };

  // -------------------------------------------------------------
  // 6. NOTIFICATIONS TOGGLES
  // -------------------------------------------------------------
  interface NotificationConfig {
    newOrders: boolean;
    adPerformance: boolean;
    productAlerts: boolean;
    systemUpdates: boolean;
    marketingTips: boolean;
    rtoAlerts: boolean;
  }

  const [notifications, setNotifications] = useState<NotificationConfig>(() => {
    const saved = localStorage.getItem('notifications_config');
    if (saved) {
      try {
        return JSON.parse(saved) as NotificationConfig;
      } catch {}
    }
    return {
      newOrders: true,
      adPerformance: true,
      productAlerts: true,
      systemUpdates: true,
      marketingTips: false,
      rtoAlerts: true,
    };
  });

  const handleToggleNotification = (key: keyof NotificationConfig) => {
    setNotifications((prev: NotificationConfig) => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem('notifications_config', JSON.stringify(next));
      return next;
    });
  };

  // -------------------------------------------------------------
  // 7. LANGUAGE & REGION
  // -------------------------------------------------------------
  const [language, setLanguage] = useState(() => localStorage.getItem('app_language') || 'English');
  const [region, setRegion] = useState(() => localStorage.getItem('app_region') || 'Algeria');
  const [regionSaved, setRegionSaved] = useState(false);

  const handleSaveRegion = () => {
    localStorage.setItem('app_language', language);
    localStorage.setItem('app_region', region);
    setRegionSaved(true);
    setTimeout(() => setRegionSaved(false), 2000);
  };

  // -------------------------------------------------------------
  // 8. BILLING & PLAN MODAL
  // -------------------------------------------------------------
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<'Starter' | 'Pro' | 'Enterprise'>('Pro');

  // -------------------------------------------------------------
  // 9. DATA EXPORT & CLEAR CACHE
  // -------------------------------------------------------------
  const [cacheClearedSuccess, setCacheClearedSuccess] = useState(false);

  const handleExportData = () => {
    const exportObject = {
      user: { name, email, phone, wilaya },
      ai: { provider: aiProvider, model: aiModel },
      ecommerce: { storePlatform, currency, timeZone, shippingProvider },
      pixels,
      notifications,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `product-intelligence-os-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearCache = () => {
    sessionStorage.clear();
    setCacheClearedSuccess(true);
    setTimeout(() => setCacheClearedSuccess(false), 3000);
  };

  // Avatar upload handler
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        console.warn('Avatar file size exceeds 5MB limit.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setAvatar(result);
        localStorage.setItem('user_avatar', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    localStorage.setItem('user_name', name.trim());
    localStorage.setItem('user_email', email.trim());
    localStorage.setItem('user_phone', phone.trim());
    localStorage.setItem('user_wilaya', wilaya);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    if (!currPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }
    setPasswordSuccess(true);
    setTimeout(() => {
      setPasswordSuccess(false);
      setShowPasswordModal(false);
      setCurrPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1500);
  };

  // -------------------------------------------------------------
  // 10. GITHUB & REPOSITORIES STATE & HANDLERS
  // -------------------------------------------------------------
  const [githubToken, setGithubToken] = useState<string>(() => {
    return localStorage.getItem('github_token') || '';
  });
  const [showGithubToken, setShowGithubToken] = useState(false);
  const [githubUser, setGithubUser] = useState<{
    login: string;
    avatar_url: string;
    html_url: string;
    name?: string;
    public_repos?: number;
    bio?: string;
  } | null>(() => {
    const cached = localStorage.getItem('github_user_cache');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    }
    return null;
  });
  const [isVerifyingGithub, setIsVerifyingGithub] = useState(false);
  const [githubVerifyError, setGithubVerifyError] = useState('');
  const [githubRepos, setGithubRepos] = useState<
    Array<{
      id: number;
      name: string;
      full_name: string;
      html_url: string;
      default_branch: string;
      private: boolean;
      description?: string;
      updated_at: string;
    }>
  >(() => {
    const cached = localStorage.getItem('github_repos_cache');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    }
    return [];
  });
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const [repoSearchQuery, setRepoSearchQuery] = useState('');
  const [selectedRepoFullName, setSelectedRepoFullName] = useState<string>(() => {
    return localStorage.getItem('github_selected_repo') || 'yahiakd-crypto/20271';
  });
  const [selectedRepoUrl, setSelectedRepoUrl] = useState<string>(() => {
    return localStorage.getItem('github_repo_url') || 'https://github.com/yahiakd-crypto/20271.git';
  });
  const [pushBranch, setPushBranch] = useState('main');
  const [commitMessage, setCommitMessage] = useState(
    'feat: complete product intelligence engine, multi-scan, workflow charts & settings'
  );
  const [forcePush, setForcePush] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [pushStatus, setPushStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [pushLogs, setPushLogs] = useState<string[]>([
    'Ready to push. Select target repository and click "Push Project to GitHub".',
  ]);
  const [pushErrorMsg, setPushErrorMsg] = useState('');

  // New repo creation modal
  const [showCreateRepoModal, setShowCreateRepoModal] = useState(false);
  const [newRepoName, setNewRepoName] = useState('');
  const [newRepoDesc, setNewRepoDesc] = useState('AI Product Intelligence Platform & Algerian COD Dashboard');
  const [newRepoIsPrivate, setNewRepoIsPrivate] = useState(false);
  const [isCreatingRepo, setIsCreatingRepo] = useState(false);
  const [createRepoError, setCreateRepoError] = useState('');

  // GitHub Handlers (Direct GitHub API with CORS support + local fallback)
  const handleVerifyGithubToken = async (tokenToTest?: string) => {
    const token = (tokenToTest || githubToken).trim();
    if (!token) {
      setGithubVerifyError('Please enter a GitHub Personal Access Token.');
      return;
    }
    setIsVerifyingGithub(true);
    setGithubVerifyError('');
    try {
      // Direct call to GitHub API (CORS is natively enabled on api.github.com)
      const ghRes = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });
      const data = await ghRes.json();
      if (ghRes.ok && data.login) {
        setGithubUser(data);
        localStorage.setItem('github_token', token);
        localStorage.setItem('github_user_cache', JSON.stringify(data));
        handleFetchRepos(token);
        return;
      } else {
        setGithubVerifyError(data.message || 'Failed to authenticate with GitHub. Check your token.');
      }
    } catch (err: any) {
      // Optional fallback to backend endpoint
      try {
        const res = await fetch(`/api/github/user?token=${encodeURIComponent(token)}`);
        const text = await res.text();
        if (text.startsWith('{')) {
          const data = JSON.parse(text);
          if (data.success && data.user) {
            setGithubUser(data.user);
            localStorage.setItem('github_token', token);
            localStorage.setItem('github_user_cache', JSON.stringify(data.user));
            handleFetchRepos(token);
            return;
          }
        }
      } catch {}
      setGithubVerifyError(err?.message || 'Network error verifying GitHub token.');
    } finally {
      setIsVerifyingGithub(false);
    }
  };

  const handleFetchRepos = async (tokenToUse?: string) => {
    const token = (tokenToUse || githubToken).trim();
    if (!token) return;
    setIsLoadingRepos(true);
    try {
      const ghRes = await fetch(
        'https://api.github.com/user/repos?per_page=100&sort=updated&affiliation=owner,collaborator',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );
      if (ghRes.ok) {
        const repos = await ghRes.json();
        if (Array.isArray(repos)) {
          setGithubRepos(repos);
          localStorage.setItem('github_repos_cache', JSON.stringify(repos));
          return;
        }
      }
    } catch (err) {
      console.warn('Direct fetch repos error, trying backend route:', err);
    }

    try {
      const res = await fetch(`/api/github/repos?token=${encodeURIComponent(token)}`);
      const text = await res.text();
      if (text.startsWith('{')) {
        const data = JSON.parse(text);
        if (data.success && Array.isArray(data.repos)) {
          setGithubRepos(data.repos);
          localStorage.setItem('github_repos_cache', JSON.stringify(data.repos));
        }
      }
    } catch (err) {
      console.error('Error fetching GitHub repos:', err);
    } finally {
      setIsLoadingRepos(false);
    }
  };

  const handleSelectRepository = (repo: { full_name: string; html_url: string; default_branch?: string }) => {
    setSelectedRepoFullName(repo.full_name);
    const gitUrl = repo.html_url.endsWith('.git') ? repo.html_url : `${repo.html_url}.git`;
    setSelectedRepoUrl(gitUrl);
    if (repo.default_branch) setPushBranch(repo.default_branch);
    localStorage.setItem('github_selected_repo', repo.full_name);
    localStorage.setItem('github_repo_url', gitUrl);
    setPushLogs((prev) => [
      ...prev,
      `[Target Changed] Selected repository: ${repo.full_name} (${gitUrl}) on branch ${repo.default_branch || 'main'}`,
    ]);
  };

  const handleCreateNewRepo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRepoName.trim()) {
      setCreateRepoError('Repository name is required.');
      return;
    }
    setIsCreatingRepo(true);
    setCreateRepoError('');
    try {
      const ghRes = await fetch('https://api.github.com/user/repos', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${githubToken.trim()}`,
          'Content-Type': 'application/json',
          Accept: 'application/vnd.github.v3+json',
        },
        body: JSON.stringify({
          name: newRepoName.trim(),
          description: newRepoDesc.trim(),
          private: newRepoIsPrivate,
          auto_init: false,
        }),
      });
      const data = await ghRes.json();
      if (ghRes.ok && data.id) {
        handleSelectRepository(data);
        setShowCreateRepoModal(false);
        setNewRepoName('');
        handleFetchRepos(githubToken);
      } else {
        setCreateRepoError(data.message || 'Failed to create repository on GitHub.');
      }
    } catch (err: any) {
      setCreateRepoError(err?.message || 'Network error while creating repository.');
    } finally {
      setIsCreatingRepo(false);
    }
  };

  const handlePushProject = async () => {
    if (!githubToken.trim()) {
      setPushErrorMsg('Please connect your GitHub account with a valid Personal Access Token.');
      setPushStatus('error');
      return;
    }
    if (!selectedRepoUrl.trim()) {
      setPushErrorMsg('Please select or specify a target GitHub repository URL.');
      setPushStatus('error');
      return;
    }

    setIsPushing(true);
    setPushStatus('idle');
    setPushErrorMsg('');
    localStorage.setItem('github_token', githubToken.trim());
    localStorage.setItem('github_repo_url', selectedRepoUrl.trim());
    setPushLogs([
      `[${new Date().toLocaleTimeString()}] Initiating push to ${selectedRepoUrl}...`,
      `[Git Config] Branch: ${pushBranch} | Force push: ${forcePush ? 'Yes (--force)' : 'No'}`,
      `[Commit Message] "${commitMessage}"`,
      `[Git Status] Staging all modified and created project files...`,
    ]);

    try {
      const res = await fetch('/api/github/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: githubToken.trim(),
          repoUrl: selectedRepoUrl.trim(),
          branch: pushBranch.trim() || 'main',
          commitMessage: commitMessage.trim() || 'feat: update product intelligence project',
          force: forcePush,
        }),
      });

      const text = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          'Backend push endpoint not yet loaded in active dev server. Please restart your server (npm run dev) or allow the automated agent to sync the remote directly.'
        );
      }

      if (data.success) {
        setPushStatus('success');
        setPushLogs((prev) => [
          ...prev,
          ...(data.logs || []),
          `[${new Date().toLocaleTimeString()}] 🚀 SUCCESS! Project successfully pushed to ${selectedRepoUrl} (branch: ${pushBranch}).`,
        ]);
      } else {
        setPushStatus('error');
        const isPermission403 = data.error && (data.error.includes('403') || data.error.includes('denied'));
        const friendlyError = isPermission403
          ? 'GitHub Permission Denied (403): Your Personal Access Token does not have write access to this specific repository. If using a fine-grained token, grant "Repository permissions → Contents: Read and write" and ensure this repo is selected under "Repository access". Or use a Classic Token (ghp_...) with "repo" scope.'
          : data.error || 'Failed to push project to GitHub.';
        setPushErrorMsg(friendlyError);
        setPushLogs((prev) => [
          ...prev,
          ...(data.logs || []),
          `[${new Date().toLocaleTimeString()}] ❌ ERROR: ${friendlyError}`,
        ]);
      }
    } catch (err: any) {
      setPushStatus('error');
      const msg = err?.message || 'Network connection failed while pushing to GitHub.';
      setPushErrorMsg(msg);
      setPushLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ❌ NETWORK EXCEPTION: ${msg}`]);
    } finally {
      setIsPushing(false);
    }
  };

  // Auto-verify on mount if token is saved and no user profile cached
  useEffect(() => {
    if (githubToken && !githubUser) {
      handleVerifyGithubToken(githubToken);
    }
  }, []);

  // Tab definitions
  const tabs: { id: SettingsTabId; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'all', label: 'All Settings', icon: Sliders },
    { id: 'general', label: 'General & Profile', icon: User },
    { id: 'ai', label: 'AI & DeepSeek API', icon: Sparkles },
    { id: 'github', label: 'GitHub & Repositories', icon: GithubIcon },
    { id: 'ecommerce', label: 'E-commerce & COD', icon: ShoppingBag },
    { id: 'tracking', label: 'Ads & Tracking', icon: Sliders },
    { id: 'integrations', label: 'Integrations', icon: Layers },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: ShieldCheck },
    { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
  ];

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] text-slate-800 font-sans overflow-hidden">
      {/* 1. App Sidebar */}
      <AppSidebar
        activeView="settings"
        activeSubItem={activeTab === 'all' ? 'general' : activeTab}
        onNavigate={onNavigate}
      />

      {/* 2. Main Body */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <AppHeader
          breadcrumbs={[
            { label: 'Settings', isCurrent: activeTab === 'all' },
            ...(activeTab !== 'all'
              ? [{ label: tabs.find((t) => t.id === activeTab)?.label || activeTab, isCurrent: true }]
              : []),
          ]}
          onOpenSearchModal={onOpenSearchModal}
          currentCountry="Algeria"
        />

        {/* Scrollable Settings View */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Header Title Row */}
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25 shrink-0 mt-0.5">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">Settings</h1>
                <p className="text-xs text-slate-500">
                  Configure DeepSeek API, AI models, store parameters, tracking pixels, and integrations.
                </p>
              </div>
            </div>

            {/* Quick Status Pill */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                AI Engine: {aiProvider === 'deepseek' ? 'DeepSeek-V3 / R1' : aiProvider.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Interactive Settings Tabs Bar */}
          <div className="flex items-center gap-1.5 border-b border-slate-200 overflow-x-auto pb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'border-blue-600 text-blue-600 font-bold bg-blue-50/40 rounded-t-lg'
                      : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 rounded-t-lg'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* ========================================================================= */}
          {/* TAB: AI & API CONFIGURATION (FEATURED / DEDICATED OR IN ALL)              */}
          {/* ========================================================================= */}
          {(activeTab === 'ai' || activeTab === 'all') && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">AI & Model Provider Configuration</h3>
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                        DeepSeek Supported
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Connect your API key to power live research, Algerian COD ad copywriting, and product intelligence.
                    </p>
                  </div>
                </div>

                {apiKeySavedSuccess && (
                  <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Key Linked & Saved to Board!
                  </span>
                )}
              </div>

              {/* Provider Selection Grid */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Select AI Provider
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2.5">
                  {/* DeepSeek Provider Card */}
                  <button
                    type="button"
                    onClick={() => handleSelectProvider('deepseek')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                      aiProvider === 'deepseek'
                        ? 'border-blue-600 bg-blue-50/80 shadow-xs ring-1 ring-blue-600'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">
                          D
                        </span>
                        <span className="text-xs font-bold text-slate-900">DeepSeek</span>
                      </div>
                      <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                        HOT
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      V3 & R1 Reasoning, fast & cost-efficient
                    </p>
                  </button>

                  {/* OpenAI */}
                  <button
                    type="button"
                    onClick={() => handleSelectProvider('openai')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                      aiProvider === 'openai'
                        ? 'border-emerald-600 bg-emerald-50/80 shadow-xs ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                        O
                      </span>
                      <span className="text-xs font-bold text-slate-900">OpenAI</span>
                      {aiProvider === 'openai' && (
                        <span className="ml-auto text-[9.5px] px-1.5 py-0.5 rounded-full bg-emerald-600 text-white font-bold">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      GPT-4o, GPT-4o-mini & o1 Reasoning
                    </p>
                  </button>

                  {/* Google Gemini */}
                  <button
                    type="button"
                    onClick={() => handleSelectProvider('gemini')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      aiProvider === 'gemini'
                        ? 'border-blue-600 bg-blue-50/80 shadow-xs ring-1 ring-blue-600'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-5 h-5 rounded-md bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                        G
                      </span>
                      <span className="text-xs font-bold text-slate-900">Google Gemini</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      Gemini 3.8 Flash, multimodal & reasoning
                    </p>
                  </button>

                  {/* OpenRouter (Requested by user) */}
                  <button
                    type="button"
                    onClick={() => handleSelectProvider('openrouter')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                      aiProvider === 'openrouter'
                        ? 'border-purple-600 bg-purple-50/80 shadow-xs ring-1 ring-purple-600'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-md bg-purple-600 text-white flex items-center justify-center text-[10px] font-black">
                          OR
                        </span>
                        <span className="text-xs font-bold text-slate-900">OpenRouter</span>
                      </div>
                      <span className="text-[9px] font-bold bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded">
                        UNIFIED
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      Claude 3.5, DeepSeek R1, Llama 3.3 & GPT-4o
                    </p>
                  </button>

                  {/* AgentRouter (Requested by user) */}
                  <button
                    type="button"
                    onClick={() => handleSelectProvider('agentrouter')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                      aiProvider === 'agentrouter'
                        ? 'border-cyan-600 bg-cyan-50/80 shadow-xs ring-1 ring-cyan-600'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-md bg-cyan-600 text-white flex items-center justify-center text-[10px] font-black">
                          AR
                        </span>
                        <span className="text-xs font-bold text-slate-900">AgentRouter</span>
                      </div>
                      <span className="text-[9px] font-bold bg-cyan-100 text-cyan-800 px-1.5 py-0.2 rounded">
                        SMART
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      Multi-agent orchestration & dynamic routing
                    </p>
                  </button>

                  {/* NVIDIA NIM (Requested by user) */}
                  <button
                    type="button"
                    onClick={() => handleSelectProvider('nvidia')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                      aiProvider === 'nvidia'
                        ? 'border-[#76B900] bg-emerald-50/80 shadow-xs ring-1 ring-[#76B900]'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-md bg-[#76B900] text-black flex items-center justify-center text-[10px] font-black">
                          NV
                        </span>
                        <span className="text-xs font-bold text-slate-900">NVIDIA NIM</span>
                      </div>
                      <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                        FAST
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      GPU-accelerated Llama 3.3 70B & DeepSeek R1
                    </p>
                  </button>

                  {/* Anthropic Claude */}
                  <button
                    type="button"
                    onClick={() => handleSelectProvider('anthropic')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      aiProvider === 'anthropic'
                        ? 'border-blue-600 bg-blue-50/80 shadow-xs ring-1 ring-blue-600'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-5 h-5 rounded-md bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold">
                        C
                      </span>
                      <span className="text-xs font-bold text-slate-900">Claude</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      Claude 3.5 Sonnet long-form analysis
                    </p>
                  </button>

                  {/* Custom Provider */}
                  <button
                    type="button"
                    onClick={() => handleSelectProvider('custom')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      aiProvider === 'custom'
                        ? 'border-blue-600 bg-blue-50/80 shadow-xs ring-1 ring-blue-600'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-5 h-5 rounded-md bg-slate-700 text-white flex items-center justify-center">
                        <Sliders className="w-3 h-3 text-white" />
                      </span>
                      <span className="text-xs font-bold text-slate-900">Custom / Local</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      Self-hosted or simulated engine
                    </p>
                  </button>
                </div>
              </div>

              {/* Provider Specific Details & Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                {/* Left: API Key Input & Model Choice */}
                <div className="space-y-3.5">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-blue-600" />
                        <span>
                          {aiProvider === 'deepseek'
                            ? 'DeepSeek API Key'
                            : aiProvider === 'gemini'
                            ? 'Google Gemini API Key'
                            : aiProvider === 'openai'
                            ? 'OpenAI API Key (sk-proj-...)'
                            : aiProvider === 'openrouter'
                            ? 'OpenRouter API Key (sk-or-v1-...)'
                            : aiProvider === 'agentrouter'
                            ? 'AgentRouter API Key'
                            : aiProvider === 'nvidia'
                            ? 'NVIDIA NIM API Key (nvapi-...)'
                            : `${aiProvider.toUpperCase()} API Key`}
                        </span>
                      </label>
                      {currentKey.trim() ? (
                        <span className="text-[10.5px] text-emerald-600 font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Key entered
                        </span>
                      ) : (
                        <span className="text-[10.5px] text-amber-600 font-medium">
                          Key optional (fallback active)
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type={showApiKey ? 'text' : 'password'}
                        value={currentKey}
                        onChange={(e) => setCurrentKey(e.target.value)}
                        placeholder={
                          aiProvider === 'deepseek'
                            ? 'sk-...'
                            : aiProvider === 'gemini'
                            ? 'AIzaSy...'
                            : aiProvider === 'openai'
                            ? 'sk-proj-...'
                            : aiProvider === 'openrouter'
                            ? 'sk-or-v1-...'
                            : aiProvider === 'agentrouter'
                            ? 'ar_...'
                            : aiProvider === 'nvidia'
                            ? 'nvapi-...'
                            : 'Enter API Key'
                        }
                        className="w-full pl-3.5 pr-10 py-2 rounded-xl bg-white border border-slate-300 text-xs font-mono text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        title={showApiKey ? 'Hide Key' : 'Show Key'}
                      >
                        {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {/* Quick Link to get Key */}
                    {aiProvider === 'openai' && (
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
                        <span>Get or view your OpenAI API keys:</span>
                        <a
                          href="https://platform.openai.com/api-keys"
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 font-bold hover:underline flex items-center gap-1"
                        >
                          <span>platform.openai.com/api-keys</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                    {aiProvider === 'deepseek' && (
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
                        <span>Get your key from DeepSeek Platform:</span>
                        <a
                          href="https://platform.deepseek.com/api_keys"
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 font-bold hover:underline flex items-center gap-1"
                        >
                          <span>platform.deepseek.com</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                    {aiProvider === 'gemini' && (
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
                        <span>Get your Google AI Studio key:</span>
                        <a
                          href="https://aistudio.google.com/app/apikey"
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 font-bold hover:underline flex items-center gap-1"
                        >
                          <span>aistudio.google.com</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                    {aiProvider === 'openrouter' && (
                      <div className="space-y-1.5 mt-2">
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>Get or manage OpenRouter key:</span>
                          <a
                            href="https://openrouter.ai/keys"
                            target="_blank"
                            rel="noreferrer"
                            className="text-purple-600 font-bold hover:underline flex items-center gap-1"
                          >
                            <span>openrouter.ai/keys</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <div className="p-2.5 rounded-lg bg-purple-50/80 border border-purple-200/80 text-[11px] text-purple-900 leading-relaxed">
                          <span className="font-semibold">💡 Free Tier Support:</span> Free accounts without purchased credits get <strong>50 free requests daily</strong> on models ending in <code className="bg-purple-100 text-purple-800 px-1 py-0.5 rounded font-mono text-[10px]">:free</code> (e.g. <code className="bg-purple-100 text-purple-800 px-1 py-0.5 rounded font-mono text-[10px]">nvidia/nemotron-3.5-lightning:free</code>). To use paid models (DeepSeek V3, Claude, GPT-4o), deposit balance at <a href="https://openrouter.ai/settings/credits" target="_blank" rel="noreferrer" className="underline font-bold text-purple-700">openrouter.ai/settings/credits</a>.
                        </div>
                      </div>
                    )}
                    {aiProvider === 'agentrouter' && (
                      <div className="space-y-1.5 mt-2">
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>Get your AgentRouter API key:</span>
                          <a
                            href="https://agentrouter.org"
                            target="_blank"
                            rel="noreferrer"
                            className="text-cyan-600 font-bold hover:underline flex items-center gap-1"
                          >
                            <span>agentrouter.org</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <div className="p-2.5 rounded-lg bg-cyan-50/80 border border-cyan-200/80 text-[11px] text-cyan-900 leading-relaxed">
                          <span className="font-semibold">🌐 Live Gateway:</span> Connected to official REST gateway at <code className="bg-cyan-100 text-cyan-800 px-1 py-0.5 rounded font-mono text-[10px]">https://co.agentrouter.org/v1</code>. Supports routing to GPT-4o, Claude 3.5, and DeepSeek with intelligent failover.
                        </div>
                      </div>
                    )}
                    {aiProvider === 'nvidia' && (
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
                        <span>Get your NVIDIA NIM API key:</span>
                        <a
                          href="https://build.nvidia.com"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#76B900] font-bold hover:underline flex items-center gap-1"
                        >
                          <span>build.nvidia.com</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Model Selector & Diagnostics Suite */}
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-blue-600" />
                        <span>Target AI Model</span>
                      </label>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleDetectModels(aiProvider, currentKey)}
                          disabled={isDetectingModels}
                          className="px-2.5 py-1 rounded-lg text-[10.5px] font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
                          title="Fetch and detect available models from your API key"
                        >
                          <RefreshCw className={`w-3 h-3 ${isDetectingModels ? 'animate-spin text-blue-600' : ''}`} />
                          <span>{isDetectingModels ? 'Fetching Models...' : 'Fetch Models'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleTestSingleModel(aiModel)}
                          disabled={isTestingCurrentModel}
                          className="px-2.5 py-1 rounded-lg text-[10.5px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
                          title="Test currently selected model"
                        >
                          <Activity className={`w-3 h-3 text-blue-600 ${isTestingCurrentModel ? 'animate-spin' : ''}`} />
                          <span>{isTestingCurrentModel ? 'Testing...' : 'Test Selected'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleTestAllModels}
                          disabled={isBatchTesting}
                          className="px-2.5 py-1 rounded-lg text-[10.5px] font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
                          title="Test all detected models inside your API key to find working ones"
                        >
                          <Zap className={`w-3 h-3 text-indigo-600 ${isBatchTesting ? 'animate-pulse' : ''}`} />
                          <span>{isBatchTesting ? 'Testing All...' : 'Test All Models'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setIsCustomModelActive(!isCustomModelActive);
                            if (!isCustomModelActive) {
                              setCustomModelInput(aiModel);
                            }
                          }}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                            isCustomModelActive
                              ? 'bg-purple-100 text-purple-800 border-purple-300'
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                          }`}
                          title="Manually type a custom model ID"
                        >
                          {isCustomModelActive ? 'Use Dropdown' : 'Custom ID'}
                        </button>
                      </div>
                    </div>

                    {isCustomModelActive ? (
                      <div className="space-y-1.5">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={customModelInput}
                            onChange={(e) => {
                              setCustomModelInput(e.target.value);
                              setAiModel(e.target.value);
                              localStorage.setItem('ai_model', e.target.value);
                            }}
                            placeholder="e.g. gpt-4o-mini, gpt-4o, o1-mini, gemini-3.8-flash..."
                            className="flex-1 px-3 py-2 rounded-xl bg-white border border-purple-300 font-mono text-xs text-slate-900 focus:outline-none focus:border-purple-600 shadow-2xs"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (customModelInput.trim()) {
                                setAiModel(customModelInput.trim());
                                localStorage.setItem('ai_model', customModelInput.trim());
                                setApiKeySavedSuccess(true);
                                setTimeout(() => setApiKeySavedSuccess(false), 2000);
                              }
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer shadow-xs"
                          >
                            Set Model
                          </button>
                        </div>
                        <p className="text-[10px] text-purple-700 font-medium">
                          Active Custom Model: <code className="font-mono font-bold bg-purple-100 px-1 py-0.5 rounded">{aiModel}</code>. Enter any valid model ID supported by your account.
                        </p>
                      </div>
                    ) : (
                      <select
                        value={aiModel}
                        onChange={(e) => {
                          if (e.target.value === '__custom__') {
                            setIsCustomModelActive(true);
                            setCustomModelInput(aiModel);
                          } else {
                            setAiModel(e.target.value);
                            localStorage.setItem('ai_model', e.target.value);
                            setCurrentModelTestResult(null);
                          }
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 font-semibold focus:outline-none focus:border-blue-500 shadow-2xs cursor-pointer"
                      >
                        {availableModels.length > 0 ? (
                          <>
                            <optgroup label="Detected Models on API Key">
                              {availableModels.map((m) => {
                                const testStat = batchResults.find((r) => r.model === m.id);
                                const statSuffix = testStat
                                  ? testStat.success
                                    ? ` [Verified - ${testStat.latencyMs}ms]`
                                    : ` [Inaccessible - ${testStat.status || 'Err'}]`
                                  : '';
                                return (
                                  <option key={m.id} value={m.id}>
                                    {m.name || m.id} {m.isRecommended ? '(Recommended)' : ''}{statSuffix}
                                  </option>
                                );
                              })}
                            </optgroup>
                            <optgroup label="Custom Options">
                              <option value="__custom__">Custom Model ID (Type Manually)...</option>
                            </optgroup>
                          </>
                        ) : (
                          <>
                            {aiProvider === 'openai' && (
                              <>
                                <optgroup label="Verified Production Models (Recommended)">
                                  <option value="gpt-4o-mini">gpt-4o-mini — Fast, High Value, Economical (Default)</option>
                                  <option value="gpt-4o">gpt-4o — Flagship Omni (Best Creative Hooks & Strategy)</option>
                                  <option value="gpt-4o-2024-08-06">gpt-4o-2024-08-06 — Structured Analytics</option>
                                  <option value="chatgpt-4o-latest">chatgpt-4o-latest — Dynamic Latest Checkpoint</option>
                                </optgroup>
                                <optgroup label="Advanced Reasoning Models (o1 Series)">
                                  <option value="o1-mini">o1-mini — Speed-Optimized STEM & Calculations</option>
                                  <option value="o1">o1 — Deep Multi-Step Chain-of-Thought</option>
                                </optgroup>
                                <optgroup label="Classic & Standard Models">
                                  <option value="gpt-4-turbo">gpt-4-turbo — 128k Context Window</option>
                                  <option value="gpt-4">gpt-4 — Standard Base Foundation</option>
                                  <option value="gpt-3.5-turbo">gpt-3.5-turbo — Classic Fast Baseline</option>
                                </optgroup>
                                <optgroup label="Custom Options">
                                  <option value="__custom__">Custom Model ID (Type Manually)...</option>
                                </optgroup>
                              </>
                            )}
                            {aiProvider === 'deepseek' && (
                              <>
                                <optgroup label="DeepSeek Official Models">
                                  <option value="deepseek-chat">deepseek-chat (DeepSeek-V3, High Speed & Conversational)</option>
                                  <option value="deepseek-reasoner">deepseek-reasoner (DeepSeek-R1, Chain-of-Thought COD Strategy)</option>
                                </optgroup>
                                <optgroup label="Custom Options">
                                  <option value="__custom__">Custom Model ID...</option>
                                </optgroup>
                              </>
                            )}
                            {aiProvider === 'gemini' && (
                              <>
                                <optgroup label="Google Gemini Models">
                                  <option value="gemini-3.8-flash">gemini-3.8-flash (Recommended Default - Fast, High Accuracy)</option>
                                  <option value="gemini-4-argon">gemini-4-argon (Flagship Complex Reasoning)</option>
                                  <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Ultra-Low Latency)</option>
                                  <option value="gemini-3.1-flash-lite-image">gemini-3.1-flash-lite-image (Vision & Images)</option>
                                </optgroup>
                                <optgroup label="Custom Options">
                                  <option value="__custom__">Custom Model ID...</option>
                                </optgroup>
                              </>
                            )}
                            {aiProvider === 'openrouter' && (
                              <>
                                <optgroup label="✨ Free Tier Models (50 Daily Requests, 0 Credits Needed)">
                                  <option value="nvidia/nemotron-3.5-lightning:free">nvidia/nemotron-3.5-lightning:free (Free • Fast & High Quality)</option>
                                  <option value="google/gemma-4-31b-it:free">google/gemma-4-31b-it:free (Free • Gemma 31B)</option>
                                  <option value="nvidia/nemotron-3.5-super-vl:free">nvidia/nemotron-3.5-super-vl:free (Free • Vision-Language)</option>
                                  <option value="meta-llama/llama-3.2-3b-instruct:free">meta-llama/llama-3.2-3b-instruct:free (Free • Lightweight Llama)</option>
                                  <option value="qwen/qwen-2.5-coder-32b-instruct:free">qwen/qwen-2.5-coder-32b-instruct:free (Free • Qwen Coder)</option>
                                </optgroup>
                                <optgroup label="OpenRouter Flagship Models (Requires Purchased Credits)">
                                  <option value="deepseek/deepseek-chat">deepseek/deepseek-chat (DeepSeek V3 High Speed)</option>
                                  <option value="anthropic/claude-3.5-sonnet">anthropic/claude-3.5-sonnet (Claude 3.5 Sonnet)</option>
                                  <option value="openai/gpt-4o">openai/gpt-4o (GPT-4o Omni)</option>
                                  <option value="openai/gpt-4o-mini">openai/gpt-4o-mini (GPT-4o Mini Fast)</option>
                                  <option value="meta-llama/llama-3.3-70b-instruct">meta-llama/llama-3.3-70b-instruct (Llama 3.3 70B)</option>
                                  <option value="mistralai/mistral-large-2411">mistralai/mistral-large-2411 (Mistral Large 2)</option>
                                  <option value="google/gemini-2.5-flash">google/gemini-2.5-flash (Gemini 2.5 Flash)</option>
                                </optgroup>
                                <optgroup label="Custom Options">
                                  <option value="__custom__">Custom Model ID...</option>
                                </optgroup>
                              </>
                            )}
                            {aiProvider === 'agentrouter' && (
                              <>
                                <optgroup label="AgentRouter Multi-Model Routing">
                                  <option value="gpt-4o">gpt-4o (GPT-4o Routed)</option>
                                  <option value="claude-3-5-sonnet-latest">claude-3-5-sonnet-latest (Claude Routed)</option>
                                  <option value="deepseek-v3">deepseek-v3 (DeepSeek V3 Routed)</option>
                                  <option value="deepseek-r1">deepseek-r1 (DeepSeek R1 Routed)</option>
                                  <option value="llama-3.3-70b-instruct">llama-3.3-70b-instruct (Llama 3.3 Routed)</option>
                                  <option value="agentrouter/auto">agentrouter/auto (Smart Dynamic Routing)</option>
                                  <option value="agentrouter/fast">agentrouter/fast (Ultra-Low Latency Routing)</option>
                                </optgroup>
                                <optgroup label="Custom Options">
                                  <option value="__custom__">Custom Model ID...</option>
                                </optgroup>
                              </>
                            )}
                            {aiProvider === 'nvidia' && (
                              <>
                                <optgroup label="NVIDIA NIM AI Foundation Models">
                                  <option value="meta/llama-3.3-70b-instruct">meta/llama-3.3-70b-instruct (NVIDIA NIM Llama 3.3 70B)</option>
                                  <option value="deepseek-ai/deepseek-r1">deepseek-ai/deepseek-r1 (NVIDIA NIM DeepSeek R1)</option>
                                  <option value="mistralai/mixtral-8x22b-instruct-v0.1">mistralai/mixtral-8x22b-instruct-v0.1 (Mixtral 8x22B)</option>
                                  <option value="nvidia/llama-3.1-nemotron-70b-instruct">nvidia/llama-3.1-nemotron-70b-instruct (Nemotron 70B)</option>
                                  <option value="meta/llama-3.1-8b-instruct">meta/llama-3.1-8b-instruct (NVIDIA NIM High Speed 8B)</option>
                                  <option value="google/gemma-2-27b-it">google/gemma-2-27b-it (NVIDIA NIM Gemma 2 27B)</option>
                                </optgroup>
                                <optgroup label="Custom Options">
                                  <option value="__custom__">Custom Model ID...</option>
                                </optgroup>
                              </>
                            )}
                            {aiProvider === 'anthropic' && (
                              <>
                                <optgroup label="Claude Official Models">
                                  <option value="claude-3-5-sonnet">claude-3-5-sonnet (Superb Analysis)</option>
                                  <option value="claude-3-haiku">claude-3-haiku (Fast & Brief)</option>
                                </optgroup>
                                <optgroup label="Custom Options">
                                  <option value="__custom__">Custom Model ID...</option>
                                </optgroup>
                              </>
                            )}
                            {aiProvider === 'custom' && (
                              <>
                                <optgroup label="Local / Custom Models">
                                  <option value="local-algeria-intelligence">Local Intelligence Engine (Algeria COD Simulation)</option>
                                  <option value="custom-ollama">Custom OpenAI Compatible Endpoint</option>
                                </optgroup>
                                <optgroup label="Custom Options">
                                  <option value="__custom__">Custom Model ID...</option>
                                </optgroup>
                              </>
                            )}
                          </>
                        )}
                      </select>
                    )}

                    {/* Detected models summary banner */}
                    {detectedModelsMsg && (
                      <div className="mt-1.5 flex items-center justify-between text-[11px] px-2.5 py-1.5 rounded-lg bg-blue-50 border border-blue-200">
                        <span className="text-blue-900 font-semibold flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-blue-600" />
                          <span>{detectedModelsMsg}</span>
                        </span>
                        {availableModels.length > 0 && (
                          <span className="text-blue-700 font-mono text-[10px] font-bold">
                            {availableModels.length} models ready
                          </span>
                        )}
                      </div>
                    )}

                    {/* Single model test result card */}
                    {currentModelTestResult && (
                      <div
                        className={`p-3 rounded-xl border text-xs transition-all ${
                          currentModelTestResult.success
                            ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                            : 'bg-rose-50/90 border-rose-300 text-rose-950'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold mb-1">
                          <div className="flex items-center gap-1.5">
                            {currentModelTestResult.success ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                            )}
                            <span>
                              {currentModelTestResult.model} — {currentModelTestResult.success ? 'Operational & Verified' : 'Model Test Failed'}
                            </span>
                          </div>
                          {currentModelTestResult.latencyMs && (
                            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/70 border border-slate-200">
                              {currentModelTestResult.latencyMs} ms
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] leading-relaxed">
                          {currentModelTestResult.message}
                        </p>

                        {currentModelTestResult.reply && (
                          <div className="mt-1.5 px-2.5 py-1.5 rounded-lg bg-white/80 border border-emerald-200 font-mono text-[10.5px] text-slate-700">
                            Response: "{currentModelTestResult.reply}"
                          </div>
                        )}

                        {!currentModelTestResult.success && (
                          <div className="mt-2 text-[10.5px] text-rose-800 space-y-0.5 border-t border-rose-200/60 pt-1.5">
                            <span className="font-semibold block">Troubleshooting steps:</span>
                            <ul className="list-disc list-inside space-y-0.5 text-[10px]">
                              <li>Check if your OpenAI account has available credits or quota balance at platform.openai.com.</li>
                              <li>Click <strong>Test All Models</strong> above to scan which models are authorized for this key.</li>
                              <li>Or switch to <strong>gpt-4o-mini</strong> which has the highest compatibility across all API tiers.</li>
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Batch Model Testing Suite */}
                    {showBatchResults && (
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-300 shadow-xs space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-indigo-600" />
                            <span className="text-xs font-bold text-slate-800">
                              API Key Model Diagnostic Matrix
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {batchResults.length > 0 && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                                {batchResults.filter((r) => r.success).length} / {batchResults.length} Working
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => setShowBatchResults(false)}
                              className="text-[10px] text-slate-400 hover:text-slate-600 font-semibold cursor-pointer"
                            >
                              Hide
                            </button>
                          </div>
                        </div>

                        {isBatchTesting && (
                          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-indigo-50/70 border border-indigo-200 text-indigo-800 text-xs">
                            <Activity className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                            <span>Pinging models in parallel across your API key...</span>
                          </div>
                        )}

                        {batchResults.length > 0 && (
                          <div className="max-h-56 overflow-y-auto rounded-lg border border-slate-200 bg-white">
                            <table className="w-full text-left text-[11px] border-collapse">
                              <thead className="bg-slate-100 text-slate-600 font-bold sticky top-0 border-b border-slate-200 text-[10px] uppercase tracking-wider">
                                <tr>
                                  <th className="py-1.5 px-2.5">Model ID</th>
                                  <th className="py-1.5 px-2">Status</th>
                                  <th className="py-1.5 px-2">Latency</th>
                                  <th className="py-1.5 px-2 text-right">Action</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {batchResults.map((item) => (
                                  <tr key={item.model} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-1.5 px-2.5 font-mono font-medium text-slate-800">
                                      <div className="flex items-center gap-1.5">
                                        <span>{item.model}</span>
                                        {aiModel === item.model && (
                                          <span className="text-[9px] font-bold px-1 py-0.2 bg-blue-100 text-blue-800 rounded">
                                            ACTIVE
                                          </span>
                                        )}
                                      </div>
                                      {item.error && (
                                        <p className="text-[9.5px] text-rose-600 font-sans mt-0.5 leading-tight truncate max-w-xs" title={item.error}>
                                          {item.error}
                                        </p>
                                      )}
                                    </td>
                                    <td className="py-1.5 px-2 whitespace-nowrap">
                                      {item.success ? (
                                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-emerald-100 text-emerald-800">
                                          <Check className="w-2.5 h-2.5" /> Working
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-rose-100 text-rose-800" title={item.error}>
                                          <X className="w-2.5 h-2.5" /> {item.status ? `HTTP ${item.status}` : 'Unavailable'}
                                        </span>
                                      )}
                                    </td>
                                    <td className="py-1.5 px-2 font-mono text-[10px] text-slate-500 whitespace-nowrap">
                                      {item.latencyMs ? `${item.latencyMs}ms` : '—'}
                                    </td>
                                    <td className="py-1.5 px-2 text-right whitespace-nowrap">
                                      {item.success && aiModel !== item.model && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setAiModel(item.model);
                                            localStorage.setItem('ai_model', item.model);
                                            setIsCustomModelActive(false);
                                            setCurrentModelTestResult({
                                              model: item.model,
                                              success: true,
                                              latencyMs: item.latencyMs,
                                              reply: item.reply,
                                              message: `Model switched to ${item.model} and ready for Board tasks!`,
                                            });
                                          }}
                                          className="px-2 py-0.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] transition-colors cursor-pointer"
                                        >
                                          Select
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="mt-2.5 p-2.5 rounded-xl bg-slate-100/80 border border-slate-200 text-[11px] text-slate-800 flex flex-col gap-1 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                          <span>Selected Model: <code className="font-mono font-bold text-blue-700 bg-blue-100/70 px-1.5 py-0.5 rounded">{aiModel}</code></span>
                        </span>
                        <span className="px-2 py-0.5 rounded text-[9.5px] font-bold bg-blue-100 text-blue-800">
                          {aiProvider.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[10.5px] text-slate-600 leading-snug">
                        {aiModel.includes('mini') || aiModel.includes('lite')
                          ? 'High Speed & Low Token Cost: Ideal for generating rapid hooks, video variations, ad angles, and live workflows.'
                          : aiModel.startsWith('o1') || aiModel.startsWith('o3') || aiModel.includes('reasoner') || aiModel.includes('argon')
                          ? 'Advanced Step-by-Step Reasoning: Solves complex COD unit economics, shipping margin formulas, and return mitigation.'
                          : 'Flagship Omni Model: Superior creative nuance for persuasive copywriting and e-commerce strategy.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right: Endpoint Info, Temperature, & Test Connection */}
                <div className="space-y-3.5">
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      API Gateway Info
                    </span>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Base URL:</span>
                        <span className="font-mono text-slate-800 font-semibold">
                          {aiProvider === 'openai'
                            ? 'https://api.openai.com/v1'
                            : aiProvider === 'deepseek'
                            ? 'https://api.deepseek.com'
                            : aiProvider === 'openrouter'
                            ? 'https://openrouter.ai/api/v1'
                            : aiProvider === 'agentrouter'
                            ? 'https://co.agentrouter.org/v1'
                            : aiProvider === 'nvidia'
                            ? 'https://integrate.api.nvidia.com/v1'
                            : aiProvider === 'gemini'
                            ? 'generativelanguage.googleapis.com'
                            : 'api.openai.com'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Protocol:</span>
                        <span className="text-slate-800 font-semibold">
                          {aiProvider === 'openai' || aiProvider === 'deepseek' || aiProvider === 'openrouter' || aiProvider === 'agentrouter' || aiProvider === 'nvidia'
                            ? 'OpenAI-Compatible REST'
                            : 'Official SDK'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Execution Scope:</span>
                        <span className="text-emerald-700 font-semibold">Board Workflow, Node Run, Hook Generator</span>
                      </div>
                    </div>
                  </div>

                  {/* Temperature slider */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-bold text-slate-700">Creativity / Temperature</span>
                      <span className="font-mono text-slate-600">{temperature}</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Precise & Analytical (0.2)</span>
                      <span>Balanced (0.7)</span>
                      <span>Highly Creative Hooks (1.0)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Save & Test */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleSaveAiConfig()}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Save & Link Key to Board</span>
                </button>

                <button
                  type="button"
                  onClick={handleRunAiTest}
                  disabled={isTestingAi}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 active:scale-98 text-slate-700 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Activity className={`w-4 h-4 text-blue-600 ${isTestingAi ? 'animate-spin' : ''}`} />
                  <span>{isTestingAi ? 'Pinging Provider...' : `Test ${aiProvider.toUpperCase()} Connection`}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('board')}
                  className="ml-auto text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Go to Workflow Board</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Test Result Feedback Card */}
              {aiTestResult && (
                <div
                  className={`p-3.5 rounded-xl border text-xs leading-relaxed transition-all ${
                    aiTestResult.success
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-amber-50 border-amber-200 text-amber-900'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold mb-1">
                    {aiTestResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                    )}
                    <span>{aiTestResult.message}</span>
                    {aiTestResult.latencyMs && (
                      <span className="font-mono text-[10px] bg-white/70 px-2 py-0.5 rounded-md border border-slate-200">
                        {aiTestResult.latencyMs}ms
                      </span>
                    )}
                  </div>
                  {aiTestResult.reply && (
                    <p className="text-[11px] font-mono text-slate-700 bg-white/60 p-2 rounded-lg mt-1 border border-slate-100">
                      "{aiTestResult.reply}"
                    </p>
                  )}
                </div>
              )}

              {/* ========================================================================= */}
              {/* SAVED API KEYS VAULT TABLE (Select, Test, or Manage All Saved Keys)       */}
              {/* ========================================================================= */}
              <div className="mt-6 pt-5 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Key className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">Saved API Keys Vault</h4>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] font-bold">
                          {savedKeysVault.length} Saved
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        All your saved API keys. Click "Select Key" on any row to immediately activate it for the entire app and Board.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddKeyModal(true)}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-98"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Key to Vault</span>
                    </button>
                  </div>
                </div>

                {vaultSelectedNotice && (
                  <div className="mb-3 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{vaultSelectedNotice}</span>
                  </div>
                )}

                {savedKeysVault.length === 0 ? (
                  <div className="p-8 text-center rounded-xl bg-slate-50 border border-slate-200">
                    <Key className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-700">No saved API keys in vault yet</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 mb-3">
                      Enter an API key above and click "Save & Link Key to Board", or click below to add one.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowAddKeyModal(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 cursor-pointer"
                    >
                      Add First Key
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                          <th className="py-2.5 px-3.5">Account / Name</th>
                          <th className="py-2.5 px-3">Provider</th>
                          <th className="py-2.5 px-3">API Key</th>
                          <th className="py-2.5 px-3">Default Model</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {savedKeysVault.map((item) => {
                          const isActive =
                            aiProvider === item.provider &&
                            currentKey.trim() === item.key.trim();
                          const maskedKey =
                            item.key.length > 14
                              ? `${item.key.slice(0, 7)}••••••••${item.key.slice(-4)}`
                              : item.key.length > 6
                              ? `${item.key.slice(0, 3)}••••`
                              : '••••••';

                          return (
                            <tr
                              key={item.id}
                              className={`transition-colors ${
                                isActive ? 'bg-blue-50/40 hover:bg-blue-50/60' : 'hover:bg-slate-50/80'
                              }`}
                            >
                              <td className="py-2.5 px-3.5">
                                <div className="font-bold text-slate-900 flex items-center gap-2">
                                  <span
                                    className="w-2 h-2 rounded-full shrink-0"
                                    style={{ backgroundColor: isActive ? '#2563eb' : '#94a3b8' }}
                                  />
                                  <span>{item.name}</span>
                                </div>
                                <span className="text-[10px] text-slate-400 font-medium block ml-4">
                                  Added {item.createdAt}
                                </span>
                              </td>

                              <td className="py-2.5 px-3">
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded-md font-bold text-[10px] border ${
                                    item.provider === 'openai'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                      : item.provider === 'deepseek'
                                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                                      : item.provider === 'openrouter'
                                      ? 'bg-purple-50 text-purple-700 border-purple-200'
                                      : item.provider === 'agentrouter'
                                      ? 'bg-cyan-50 text-cyan-700 border-cyan-200'
                                      : item.provider === 'nvidia'
                                      ? 'bg-emerald-50 text-emerald-800 border-[#76B900]'
                                      : item.provider === 'gemini'
                                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                      : 'bg-slate-50 text-slate-700 border-slate-200'
                                  }`}
                                >
                                  {item.provider.toUpperCase()}
                                </span>
                              </td>

                              <td className="py-2.5 px-3">
                                <div className="flex items-center gap-1.5">
                                  <code className="font-mono text-[11px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/80">
                                    {maskedKey}
                                  </code>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      navigator.clipboard.writeText(item.key);
                                      setVaultSelectedNotice(`Copied key for ${item.name} to clipboard`);
                                      setTimeout(() => setVaultSelectedNotice(null), 2500);
                                    }}
                                    className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                                    title="Copy full API Key"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                </div>
                              </td>

                              <td className="py-2.5 px-3">
                                <code className="font-mono text-[11px] font-bold text-slate-800">
                                  {item.preferredModel}
                                </code>
                              </td>

                              <td className="py-2.5 px-3">
                                {isActive ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                                    <Check className="w-3 h-3 text-emerald-600" />
                                    <span>Active</span>
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-slate-500 font-medium">
                                    {item.lastUsedAt || 'Ready'}
                                  </span>
                                )}
                              </td>

                              <td className="py-2.5 px-3.5 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {isActive ? (
                                    <span className="text-[11px] text-emerald-700 font-bold px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200/80">
                                      In Use
                                    </span>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => handleSelectKeyFromVault(item)}
                                      className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] transition-colors cursor-pointer shadow-2xs"
                                      title="Activate this API key and model now"
                                    >
                                      Select Key
                                    </button>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteKeyFromVault(item.id)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                    title="Remove key from vault"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Modal to Add New Key to Vault */}
          {showAddKeyModal && (
            <div
              className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
              onClick={() => setShowAddKeyModal(false)}
            >
              <div
                className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-5 space-y-4 select-text"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-blue-600" />
                    <h4 className="text-sm font-bold text-slate-900">Add API Key to Vault</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddKeyModal(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleAddNewKeySubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Key Label / Name</label>
                    <input
                      type="text"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="e.g. My OpenAI Production Key, Personal Gemini Key..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Provider</label>
                      <select
                        value={newKeyProvider}
                        onChange={(e) => {
                          const prov = e.target.value as any;
                          setNewKeyProvider(prov);
                          if (prov === 'openai') setNewKeyModel('gpt-4o-mini');
                          else if (prov === 'deepseek') setNewKeyModel('deepseek-chat');
                          else if (prov === 'openrouter') setNewKeyModel('nvidia/nemotron-3.5-lightning:free');
                          else if (prov === 'agentrouter') setNewKeyModel('gpt-4o');
                          else if (prov === 'nvidia') setNewKeyModel('meta/llama-3.3-70b-instruct');
                          else if (prov === 'gemini') setNewKeyModel('gemini-3.8-flash');
                          else if (prov === 'anthropic') setNewKeyModel('claude-3-5-sonnet');
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500 cursor-pointer"
                      >
                        <option value="openai">OpenAI</option>
                        <option value="gemini">Google Gemini</option>
                        <option value="deepseek">DeepSeek</option>
                        <option value="openrouter">OpenRouter</option>
                        <option value="agentrouter">AgentRouter</option>
                        <option value="nvidia">NVIDIA NIM</option>
                        <option value="anthropic">Claude Anthropic</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Default Model</label>
                      <input
                        type="text"
                        value={newKeyModel}
                        onChange={(e) => setNewKeyModel(e.target.value)}
                        placeholder="e.g. gpt-4o-mini, gemini-3.8-flash"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">API Key String</label>
                    <input
                      type="password"
                      value={newKeyValue}
                      onChange={(e) => setNewKeyValue(e.target.value)}
                      placeholder="sk-proj-... / AIzaSy... / sk-..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                    />
                    {newKeyError && <p className="text-[11px] text-rose-600 font-semibold mt-1">{newKeyError}</p>}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowAddKeyModal(false)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs cursor-pointer"
                    >
                      Save to Vault
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: GENERAL & PROFILE                                                   */}
          {/* ========================================================================= */}
          {(activeTab === 'general' || activeTab === 'all') && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Profile & Store Account</h3>
                    <p className="text-xs text-slate-500">
                      Manage your personal details, Algerian contact numbers, and security credentials.
                    </p>
                  </div>
                </div>

                {profileSaved && (
                  <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
                    <Check className="w-3.5 h-3.5" />
                    Profile Updated!
                  </span>
                )}
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                {/* Left Form Inputs */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Algerian Phone (WhatsApp COD)
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Wilaya / Headquarters</label>
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <select
                        value={wilaya}
                        onChange={(e) => setWilaya(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white font-medium"
                      >
                        <option value="16 - Alger">16 - Alger (Hub Capital)</option>
                        <option value="31 - Oran">31 - Oran (Western Hub)</option>
                        <option value="19 - Sétif">19 - Sétif (High COD Volume)</option>
                        <option value="25 - Constantine">25 - Constantine (Eastern Hub)</option>
                        <option value="09 - Blida">09 - Blida (Mitidja Center)</option>
                        <option value="35 - Boumerdès">35 - Boumerdès</option>
                        <option value="15 - Tizi Ouzou">15 - Tizi Ouzou</option>
                        <option value="58 - Wilayas Full Coverage">58 Wilayas (Algeria COD)</option>
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-2 flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-600 font-semibold">Account Status:</span>
                      <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200/80">
                        Pro E-commerce Seller
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowPasswordModal(true)}
                      className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                      Change Password
                    </button>
                  </div>
                </div>

                {/* Right Profile Picture Box */}
                <div className="w-full md:w-36 flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 font-bold mb-2 uppercase">
                    Profile Picture
                  </span>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 bg-white flex flex-col items-center justify-center p-2 text-center hover:border-blue-500 transition-all cursor-pointer relative overflow-hidden group shadow-2xs"
                  >
                    {avatar ? (
                      <img src={avatar} alt="Profile" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-slate-400 mb-1 group-hover:text-blue-500 transition-colors" />
                        <span className="text-[9px] font-bold text-slate-700 leading-tight">
                          Click to upload
                        </span>
                        <span className="text-[8px] text-slate-400 mt-0.5">JPG / PNG</span>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  {avatar && (
                    <button
                      type="button"
                      onClick={() => {
                        setAvatar(null);
                        localStorage.removeItem('user_avatar');
                      }}
                      className="text-[10px] text-rose-600 font-semibold hover:underline mt-2"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Profile Changes</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: GITHUB & REPOSITORIES                                               */}
          {/* ========================================================================= */}
          {(activeTab === 'github' || activeTab === 'all') && (
            <div className="space-y-6">
              {/* CARD 1: GITHUB CONNECTION & AUTHENTICATION */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                      <GithubIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">GitHub Connection & Authentication</h3>
                        {githubUser ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Connected
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            Not Connected
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">
                        Connect your GitHub account to choose target repositories and push project updates directly.
                      </p>
                    </div>
                  </div>

                  {githubUser && (
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl">
                      <img
                        src={githubUser.avatar_url || 'https://github.com/ghost.png'}
                        alt={githubUser.login}
                        className="w-7 h-7 rounded-full border border-slate-300"
                      />
                      <div className="text-left">
                        <a
                          href={githubUser.html_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-bold text-slate-800 hover:text-blue-600 flex items-center gap-1"
                        >
                          @{githubUser.login}
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>
                        <span className="text-[10px] text-slate-500 block">
                          {githubUser.public_repos ?? 0} repositories
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Token Configuration Input */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-slate-400" />
                      GitHub Personal Access Token (PAT)
                    </label>
                    <a
                      href="https://github.com/settings/tokens"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                    >
                      Generate token on GitHub
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="relative">
                    <input
                      type={showGithubToken ? 'text' : 'password'}
                      value={githubToken}
                      onChange={(e) => setGithubToken(e.target.value)}
                      placeholder="github_pat_... or ghp_..."
                      className="w-full pl-3.5 pr-28 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setShowGithubToken(!showGithubToken)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                        title={showGithubToken ? 'Hide token' : 'Show token'}
                      >
                        {showGithubToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleVerifyGithubToken()}
                        disabled={isVerifyingGithub || !githubToken.trim()}
                        className="px-3 py-1 bg-slate-900 hover:bg-black text-white text-[11px] font-bold rounded-lg transition-all shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                      >
                        {isVerifyingGithub ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            <span>Verifying...</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Verify & Save</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {githubVerifyError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">Authentication Failed</p>
                        <p className="text-[11px] mt-0.5">{githubVerifyError}</p>
                      </div>
                    </div>
                  )}

                  <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-[11px] text-blue-900 space-y-1">
                    <p className="font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      Token Permissions Required to Push:
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                      • <strong>Fine-grained tokens (github_pat_...)</strong>: Ensure under <em>Repository access</em> that your repository is selected, and set <strong>Repository permissions → Contents</strong> to <strong>Read and write</strong>.
                      <br />
                      • <strong>Classic tokens (ghp_...)</strong>: Check the <strong>repo</strong> (Full control of private repositories) scope checkbox.
                    </p>
                  </div>
                </div>
              </div>

              {/* CARD 2: REPOSITORY SELECTION */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                      <FolderGit2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Choose Target Repository</h3>
                      <p className="text-xs text-slate-500">
                        Select a repository from your GitHub account or specify a custom Git URL.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleFetchRepos()}
                      disabled={isLoadingRepos || !githubToken.trim()}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingRepos ? 'animate-spin text-blue-600' : 'text-slate-500'}`} />
                      <span>{isLoadingRepos ? 'Refreshing...' : 'Refresh Repos'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateRepoModal(!showCreateRepoModal)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Repo</span>
                    </button>
                  </div>
                </div>

                {/* Inline New Repository Form */}
                {showCreateRepoModal && (
                  <form
                    onSubmit={handleCreateNewRepo}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in zoom-in-98"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Plus className="w-3.5 h-3.5 text-blue-600" />
                        Create New GitHub Repository
                      </h4>
                      <button
                        type="button"
                        onClick={() => setShowCreateRepoModal(false)}
                        className="text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Repository Name *</label>
                        <input
                          type="text"
                          value={newRepoName}
                          onChange={(e) => setNewRepoName(e.target.value)}
                          placeholder="e.g. 2027-product-intelligence"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Visibility</label>
                        <select
                          value={newRepoIsPrivate ? 'private' : 'public'}
                          onChange={(e) => setNewRepoIsPrivate(e.target.value === 'private')}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                        >
                          <option value="public">Public (Visible to everyone)</option>
                          <option value="private">Private (Only authorized users)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Description (Optional)</label>
                      <input
                        type="text"
                        value={newRepoDesc}
                        onChange={(e) => setNewRepoDesc(e.target.value)}
                        placeholder="Description of this project repository"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>

                    {createRepoError && (
                      <p className="text-xs text-rose-600 font-semibold">{createRepoError}</p>
                    )}

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowCreateRepoModal(false)}
                        className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isCreatingRepo || !newRepoName.trim()}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                      >
                        {isCreatingRepo ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            <span>Creating on GitHub...</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Create Repository</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}

                {/* Selected Repository Pill / Target */}
                <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <FolderGit2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                        Active Target Repository
                      </span>
                      <span className="text-xs font-bold text-slate-900 font-mono">
                        {selectedRepoFullName || selectedRepoUrl}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-white text-blue-800 border border-blue-200 shadow-2xs">
                      Branch: {pushBranch}
                    </span>
                    <a
                      href={selectedRepoUrl.replace(/\.git$/, '')}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors"
                      title="Open on GitHub"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Search & Repos Grid */}
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={repoSearchQuery}
                      onChange={(e) => setRepoSearchQuery(e.target.value)}
                      placeholder="Search repositories in your account (e.g. 20271)..."
                      className="w-full pl-3 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                    />
                  </div>

                  {githubRepos.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
                      {githubRepos
                        .filter((r) =>
                          r.full_name.toLowerCase().includes(repoSearchQuery.toLowerCase()) ||
                          (r.description && r.description.toLowerCase().includes(repoSearchQuery.toLowerCase()))
                        )
                        .map((repo) => {
                          const isSelected =
                            selectedRepoFullName === repo.full_name ||
                            selectedRepoUrl.toLowerCase().includes(repo.full_name.toLowerCase());
                          return (
                            <button
                              key={repo.id}
                              type="button"
                              onClick={() => handleSelectRepository(repo)}
                              className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative group flex flex-col justify-between ${
                                isSelected
                                  ? 'bg-blue-50/60 border-blue-500 shadow-xs ring-1 ring-blue-500/30'
                                  : 'bg-white hover:bg-slate-50 border-slate-200'
                              }`}
                            >
                              <div className="space-y-1">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                                    {repo.name}
                                  </span>
                                  {repo.private ? (
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                      Private
                                    </span>
                                  ) : (
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                                      Public
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-slate-500 line-clamp-2">
                                  {repo.description || 'No description provided.'}
                                </p>
                              </div>
                              <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100 text-[10px] text-slate-400">
                                <span className="font-mono flex items-center gap-1 text-slate-600">
                                  <GitBranch className="w-3 h-3 text-slate-400" />
                                  {repo.default_branch || 'main'}
                                </span>
                                {isSelected ? (
                                  <span className="text-blue-600 font-bold flex items-center gap-1">
                                    <Check className="w-3 h-3" /> Selected
                                  </span>
                                ) : (
                                  <span className="group-hover:text-slate-700">Select</span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1.5">
                      <p className="text-xs font-bold text-slate-700">
                        {isLoadingRepos ? 'Loading your repositories...' : 'No repositories loaded yet.'}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Enter your token above and click &quot;Refresh Repos&quot; or directly enter your repository URL below.
                      </p>
                    </div>
                  )}

                  {/* Manual / Custom Remote Git URL Input */}
                  <div className="pt-2">
                    <label className="text-[11px] font-bold text-slate-700 block mb-1 flex items-center gap-1">
                      <Code2 className="w-3.5 h-3.5 text-slate-400" />
                      Target Git Clone / Remote URL
                    </label>
                    <input
                      type="text"
                      value={selectedRepoUrl}
                      onChange={(e) => {
                        setSelectedRepoUrl(e.target.value);
                        localStorage.setItem('github_repo_url', e.target.value);
                      }}
                      placeholder="https://github.com/yahiakd-crypto/20271.git"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* CARD 3: PUSH PROJECT TO GITHUB */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <GitPullRequest className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Push Project to GitHub</h3>
                      <p className="text-xs text-slate-500">
                        Stage all files, generate a commit, and sync your entire workspace to GitHub.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={forcePush}
                        onChange={(e) => setForcePush(e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="font-semibold text-[11px]">Force Push (--force)</span>
                    </label>
                  </div>
                </div>

                {/* Commit Message & Branch */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 block flex items-center gap-1">
                      <GitCommit className="w-3.5 h-3.5 text-slate-400" />
                      Commit Message
                    </label>
                    <input
                      type="text"
                      value={commitMessage}
                      onChange={(e) => setCommitMessage(e.target.value)}
                      placeholder="e.g. feat: complete product intelligence engine & settings"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 block flex items-center gap-1">
                      <GitBranch className="w-3.5 h-3.5 text-slate-400" />
                      Target Branch
                    </label>
                    <input
                      type="text"
                      value={pushBranch}
                      onChange={(e) => setPushBranch(e.target.value)}
                      placeholder="main"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                {/* Push Action Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <div className="text-xs text-slate-500">
                    Target: <span className="font-mono font-bold text-slate-800">{selectedRepoUrl}</span> &rarr; branch <span className="font-mono font-bold text-slate-800">{pushBranch}</span>
                  </div>

                  <button
                    type="button"
                    onClick={handlePushProject}
                    disabled={isPushing}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-98 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isPushing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>Pushing to GitHub...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>🚀 Push Project to GitHub</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Push Status Alerts */}
                {pushStatus === 'success' && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Project successfully pushed to GitHub repository!</span>
                    </div>
                    <a
                      href={selectedRepoUrl.replace(/\.git$/, '')}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1"
                    >
                      View on GitHub
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {pushStatus === 'error' && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-1">
                    <div className="flex items-center gap-2 font-bold text-rose-900">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Push Failed</span>
                    </div>
                    <p className="text-[11px] text-rose-700 pl-6 leading-relaxed">
                      {pushErrorMsg || 'Git command returned an error.'}
                    </p>
                  </div>
                )}

                {/* Console Log Output Terminal */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                    <span className="flex items-center gap-1.5 font-mono">
                      <Terminal className="w-3.5 h-3.5 text-slate-500" />
                      Git Execution Terminal Log
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(pushLogs.join('\n'));
                      }}
                      className="text-slate-400 hover:text-slate-600 flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Copy logs
                    </button>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 text-slate-200 border border-slate-800 font-mono text-[11px] max-h-48 overflow-y-auto space-y-1">
                    {pushLogs.map((log, idx) => (
                      <div
                        key={idx}
                        className={`leading-relaxed ${
                          log.includes('SUCCESS') || log.includes('✓')
                            ? 'text-emerald-400 font-bold'
                            : log.includes('ERROR') || log.includes('FAILED')
                            ? 'text-rose-400 font-bold'
                            : log.startsWith('>')
                            ? 'text-blue-400'
                            : 'text-slate-300'
                        }`}
                      >
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: E-COMMERCE & COD SETTINGS                                           */}
          {/* ========================================================================= */}
          {(activeTab === 'ecommerce' || activeTab === 'all') && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">E-commerce & COD Store Settings</h3>
                    <p className="text-xs text-slate-500">
                      Configure store platforms, Algerian shipping providers (Yalidine, ZR Express), and currencies.
                    </p>
                  </div>
                </div>

                {saveSuccessMsg && (
                  <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
                    <Check className="w-3.5 h-3.5" />
                    Store Settings Saved!
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Store Platform
                  </label>
                  <select
                    value={storePlatform}
                    onChange={(e) => setStorePlatform(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-semibold focus:outline-none focus:border-blue-500"
                  >
                    <option value="Shopify">Shopify</option>
                    <option value="WooCommerce">WooCommerce</option>
                    <option value="YouCan">YouCan (Algeria / Morocco COD)</option>
                    <option value="Custom">Custom Algerian COD Platform</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-semibold focus:outline-none focus:border-blue-500"
                  >
                    <option value="DZD - Algerian Dinar">DZD - Algerian Dinar (دينار)</option>
                    <option value="USD - US Dollar">USD - US Dollar ($)</option>
                    <option value="EUR - Euro">EUR - Euro (€)</option>
                    <option value="MAD - Moroccan Dirham">MAD - Moroccan Dirham</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Time Zone</label>
                  <select
                    value={timeZone}
                    onChange={(e) => setTimeZone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-semibold focus:outline-none focus:border-blue-500"
                  >
                    <option value="(GMT+1) Algeria">(GMT+1) Algeria / Algiers</option>
                    <option value="(GMT+0) London / UTC">(GMT+0) London / UTC</option>
                    <option value="(GMT+1) Paris">(GMT+1) Paris / Europe</option>
                    <option value="(GMT+3) Riyadh / Dubai">(GMT+3) Riyadh / Dubai</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Shipping Provider (COD)
                  </label>
                  <select
                    value={shippingProvider}
                    onChange={(e) => setShippingProvider(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-semibold focus:outline-none focus:border-blue-500"
                  >
                    <option value="Yalidine Express">Yalidine Express (58 Wilayas)</option>
                    <option value="ZR Express">ZR Express</option>
                    <option value="Procolis">Procolis</option>
                    <option value="Kazitour">Kazitour</option>
                    <option value="Local (Algeria COD)">Local In-House Couriers</option>
                  </select>
                </div>
              </div>

              {/* COD Automation Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Automated Call Center Validation
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Automatically trigger WhatsApp audio confirmation to customer before dispatching Yalidine slip.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoConfirmCod(!autoConfirmCod)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    autoConfirmCod ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      autoConfirmCod ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleSaveEcommerce}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save E-commerce Settings</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: ADS & TRACKING PIXELS                                               */}
          {/* ========================================================================= */}
          {(activeTab === 'tracking' || activeTab === 'all') && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Ads & Conversion Tracking Pixels</h3>
                    <p className="text-xs text-slate-500">
                      Input your Meta Pixel ID, Google Tag Manager container, and TikTok Conversion APIs.
                    </p>
                  </div>
                </div>

                {pixelSaveSuccess && (
                  <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
                    <Check className="w-3.5 h-3.5" />
                    Tracking Pixels Saved!
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Meta / Facebook Pixel */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                        f
                      </span>
                      <span className="text-xs font-bold text-slate-800">Meta (Facebook) Pixel ID</span>
                    </div>
                    <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pixels.fbEnabled}
                        onChange={(e) => setPixels({ ...pixels, fbEnabled: e.target.checked })}
                        className="rounded text-blue-600"
                      />
                      <span>Active</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={pixels.fbPixelId}
                    onChange={(e) => setPixels({ ...pixels, fbPixelId: e.target.value })}
                    placeholder="e.g. 84920194829103"
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 font-mono text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-[10px] text-slate-400 block">
                    Tracks Lead, Purchase, and InitiateCheckout for Algerian landing pages.
                  </span>
                </div>

                {/* Google Tag Manager */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-blue-500 text-white font-bold text-xs flex items-center justify-center">
                        G
                      </span>
                      <span className="text-xs font-bold text-slate-800">Google Tag Manager ID</span>
                    </div>
                    <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pixels.gtmEnabled}
                        onChange={(e) => setPixels({ ...pixels, gtmEnabled: e.target.checked })}
                        className="rounded text-blue-600"
                      />
                      <span>Active</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={pixels.gtmId}
                    onChange={(e) => setPixels({ ...pixels, gtmId: e.target.value })}
                    placeholder="e.g. GTM-N84920"
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 font-mono text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-[10px] text-slate-400 block">
                    Container identifier for universal GA4 and Google Ads event forwarding.
                  </span>
                </div>

                {/* TikTok Pixel */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-black text-white font-bold text-xs flex items-center justify-center">
                        🎵
                      </span>
                      <span className="text-xs font-bold text-slate-800">TikTok Pixel Code</span>
                    </div>
                    <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pixels.tiktokEnabled}
                        onChange={(e) => setPixels({ ...pixels, tiktokEnabled: e.target.checked })}
                        className="rounded text-blue-600"
                      />
                      <span>Active</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={pixels.tiktokPixelId}
                    onChange={(e) => setPixels({ ...pixels, tiktokPixelId: e.target.value })}
                    placeholder="e.g. C8X928492019"
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 font-mono text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-[10px] text-slate-400 block">
                    Direct TikTok Ads attribution for viral video campaigns.
                  </span>
                </div>

                {/* Snapchat Pixel */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-amber-400 text-black font-bold text-xs flex items-center justify-center">
                        👻
                      </span>
                      <span className="text-xs font-bold text-slate-800">Snapchat Pixel ID</span>
                    </div>
                    <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pixels.snapchatEnabled}
                        onChange={(e) => setPixels({ ...pixels, snapchatEnabled: e.target.checked })}
                        className="rounded text-blue-600"
                      />
                      <span>Active</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={pixels.snapchatPixelId}
                    onChange={(e) => setPixels({ ...pixels, snapchatPixelId: e.target.value })}
                    placeholder="e.g. SNAP-918294"
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 font-mono text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-[10px] text-slate-400 block">
                    Snapchat ads attribution for youth audience in Algiers & Oran.
                  </span>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleSavePixels}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Tracking Pixels</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: INTEGRATIONS HUB                                                     */}
          {/* ========================================================================= */}
          {(activeTab === 'integrations' || activeTab === 'all') && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Connected Services & Integrations</h3>
                    <p className="text-xs text-slate-500">
                      Manage webhooks, couriers, WhatsApp bots, and store synchronization.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {integrations.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleToggleIntegration(item.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      item.connected
                        ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-300'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{item.icon}</span>
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">{item.name}</span>
                        <span className="text-[10px] text-slate-400 block">{item.category}</span>
                      </div>
                    </div>

                    <span
                      className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full border ${
                        item.connected
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-slate-200 text-slate-600 border-slate-300'
                      }`}
                    >
                      {item.connected ? 'Active' : 'Off'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: NOTIFICATIONS & SYSTEM PREFERENCES                                  */}
          {/* ========================================================================= */}
          {(activeTab === 'notifications' || activeTab === 'all') && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Notification Preferences</h3>
                  <p className="text-xs text-slate-500">
                    Real-time alerts for orders, courier return spikes (RTO), and ad spend thresholds.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {[
                  { id: 'newOrders', label: 'New COD Orders', desc: 'Instant ping when customer submits checkout form' },
                  { id: 'rtoAlerts', label: 'High RTO / Return Warning', desc: 'Alert when return rate exceeds 18% in any Wilaya' },
                  { id: 'adPerformance', label: 'Ad Performance Anomalies', desc: 'Notification if ROAS drops below break-even point' },
                  { id: 'productAlerts', label: 'Inventory & Stock Depletion', desc: 'Alert when warehouse stock falls below 50 units' },
                  { id: 'systemUpdates', label: 'Engine & Model Updates', desc: 'Notices on DeepSeek & Gemini reasoning upgrades' },
                  { id: 'marketingTips', label: 'Algerian Market Intelligence', desc: 'Weekly trending products report in Algeria' },
                ].map((n) => {
                  const isChecked = (notifications as any)[n.id];
                  return (
                    <div
                      key={n.id}
                      onClick={() => handleToggleNotification(n.id as any)}
                      className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50 flex items-center justify-between cursor-pointer hover:bg-slate-100/60 transition-colors"
                    >
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">{n.label}</span>
                        <span className="text-[10px] text-slate-500">{n.desc}</span>
                      </div>
                      <div
                        className={`w-10 h-5.5 rounded-full transition-colors relative shrink-0 ${
                          isChecked ? 'bg-blue-600' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white transition-transform ${
                            isChecked ? 'left-5' : 'left-0.5'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: BILLING & SUBSCRIPTION PLAN                                         */}
          {/* ========================================================================= */}
          {(activeTab === 'billing' || activeTab === 'all') && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Plan & Subscription Management</h3>
                    <p className="text-xs text-slate-500">
                      View current subscription tier, invoices, and billing methods.
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                  Active (Next cycle Nov 1, 2026)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Plan Card */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 via-indigo-50/50 to-white border border-blue-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-blue-800">Current Plan</span>
                    <span className="text-base">👑</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900">$29</span>
                    <span className="text-xs text-slate-500">/ month</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1">
                    <li>✓ Unlimited board nodes & skills</li>
                    <li>✓ DeepSeek-V3 & R1 native execution</li>
                    <li>✓ 58 Algerian Wilayas logistics tracker</li>
                    <li>✓ Export high-res ad creatives</li>
                  </ul>
                  <button
                    type="button"
                    onClick={() => setShowUpgradeModal(true)}
                    className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                  >
                    Manage / Change Plan
                  </button>
                </div>

                {/* Payment Card */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-700 block">Default Payment Card</span>
                  <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white border border-slate-200">
                    <span className="px-2 py-0.5 bg-blue-600 text-white rounded font-mono font-bold text-[10px]">
                      VISA
                    </span>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Visa ending in •••• 4242</span>
                      <span className="text-[10px] text-slate-400">Expires 12/2028</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(true)}
                    className="w-full py-2 rounded-xl border border-slate-300 hover:bg-white text-slate-700 text-xs font-semibold cursor-pointer"
                  >
                    Update Payment Method
                  </button>
                </div>

                {/* Quick Invoicing */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">Latest Invoices</span>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                      <span>Oct 1, 2026 - Pro</span>
                      <span className="font-mono font-bold text-slate-800">$29.00 Paid</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                      <span>Sep 1, 2026 - Pro</span>
                      <span className="font-mono font-bold text-slate-800">$29.00 Paid</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleExportData}
                    className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1 pt-1 cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download All Invoices (PDF/CSV)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: DATA, BACKUP & CACHE RESET                                          */}
          {/* ========================================================================= */}
          {(activeTab === 'security' || activeTab === 'all') && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Data Management & Cache</h3>
                  <p className="text-xs text-slate-500">
                    Backup your workspaces, export API configurations, or clear session cache.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={handleExportData}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/30 text-left transition-all cursor-pointer group"
                >
                  <Download className="w-4 h-4 text-blue-600 mb-1.5" />
                  <span className="text-xs font-bold text-slate-800 block">Export Full JSON Backup</span>
                  <span className="text-[10px] text-slate-500">Download settings, keys & store setup</span>
                </button>

                <button
                  type="button"
                  onClick={handleClearCache}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-amber-400 bg-slate-50 hover:bg-amber-50/30 text-left transition-all cursor-pointer group"
                >
                  <RefreshCw className="w-4 h-4 text-amber-600 mb-1.5" />
                  <span className="text-xs font-bold text-slate-800 block">Clear Session Cache</span>
                  <span className="text-[10px] text-slate-500">Reset UI viewport and temporary pings</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('board')}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/30 text-left transition-all cursor-pointer group"
                >
                  <ArrowRight className="w-4 h-4 text-slate-700 mb-1.5" />
                  <span className="text-xs font-bold text-slate-800 block">Open Board Canvas</span>
                  <span className="text-[10px] text-slate-500">Return to visual workflow execution</span>
                </button>
              </div>

              {cacheClearedSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Session cache refreshed successfully.</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: CHANGE PASSWORD                                                    */}
      {/* ========================================================================= */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Change Account Password</h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleChangePasswordSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currPassword}
                  onChange={(e) => setCurrPassword(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  placeholder="At least 6 characters"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  placeholder="Repeat new password"
                />
              </div>

              {passwordError && (
                <p className="text-xs text-rose-600 font-semibold">{passwordError}</p>
              )}

              {passwordSuccess && (
                <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Password changed successfully!
                </p>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: UPGRADE SUBSCRIPTION                                               */}
      {/* ========================================================================= */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Upgrade Your E-commerce Intelligence</h3>
                <p className="text-xs text-slate-500">Select the plan matching your monthly COD order volume.</p>
              </div>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="p-4 rounded-xl border-2 border-blue-600 bg-blue-50/40 relative">
                <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-blue-600 text-white text-[9px] font-bold">
                  Current
                </span>
                <h4 className="text-sm font-bold text-slate-900">Pro Plan</h4>
                <div className="text-lg font-black text-slate-900 my-1">$29 / mo</div>
                <p className="text-[11px] text-slate-500 mb-2">Ideal for active sellers running 500-3,000 orders/mo</p>
                <ul className="text-[11px] text-slate-600 space-y-1">
                  <li>✓ DeepSeek & Gemini models</li>
                  <li>✓ Unlimited node executions</li>
                  <li>✓ 58 Wilayas COD Analytics</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300">
                <h4 className="text-sm font-bold text-slate-900">Enterprise Agency</h4>
                <div className="text-lg font-black text-slate-900 my-1">$89 / mo</div>
                <p className="text-[11px] text-slate-500 mb-2">For multi-store media buyers & COD call centers</p>
                <ul className="text-[11px] text-slate-600 space-y-1">
                  <li>✓ Multi-account API routing</li>
                  <li>✓ Dedicated Yalidine auto-sync</li>
                  <li>✓ VIP WhatsApp priority queue</li>
                </ul>
                <button
                  type="button"
                  onClick={() => {
                    setShowUpgradeModal(false);
                  }}
                  className="w-full mt-3 py-1.5 rounded-lg bg-slate-900 hover:bg-black text-white text-xs font-bold cursor-pointer"
                >
                  Upgrade to Enterprise
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: UPDATE PAYMENT CARD                                                */}
      {/* ========================================================================= */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Update Credit Card</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Card Number</label>
                <input
                  type="text"
                  placeholder="4242 •••• •••• 4242"
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Expiry</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">CVC</label>
                  <input
                    type="password"
                    placeholder="•••"
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowPaymentModal(false);
                }}
                className="w-full mt-2 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
              >
                Save New Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
