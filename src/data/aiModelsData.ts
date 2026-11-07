export interface AiModelOption {
  id: string;
  name: string;
  isRecommended?: boolean;
  isVision?: boolean;
  isFree?: boolean;
}

export interface AiModelGroup {
  label: string;
  models: AiModelOption[];
}

export interface AiProviderData {
  id: 'openai' | 'openrouter' | 'gemini' | 'deepseek' | 'nvidia' | 'agentrouter' | 'anthropic' | 'custom';
  name: string;
  badge?: string;
  defaultModel: string;
  groups: AiModelGroup[];
}

export const SETTINGS_AI_PROVIDERS: AiProviderData[] = [
  {
    id: 'openrouter',
    name: 'OpenRouter',
    badge: 'Multi-Model Hub',
    defaultModel: 'nvidia/nemotron-3.5-lightning:free',
    groups: [
      {
        label: '✨ Free Tier Models (50 Daily Requests, 0 Credits Needed)',
        models: [
          {
            id: 'nvidia/nemotron-3.5-lightning:free',
            name: 'nvidia/nemotron-3.5-lightning:free (Free • Fast & High Quality)',
            isRecommended: true,
            isFree: true,
          },
          {
            id: 'google/gemma-4-31b-it:free',
            name: 'google/gemma-4-31b-it:free (Free • Gemma 31B)',
            isFree: true,
            isVision: true,
          },
          {
            id: 'nvidia/nemotron-3.5-super-vl:free',
            name: 'nvidia/nemotron-3.5-super-vl:free (Free • Vision-Language)',
            isVision: true,
            isFree: true,
          },
          {
            id: 'meta-llama/llama-3.2-3b-instruct:free',
            name: 'meta-llama/llama-3.2-3b-instruct:free (Free • Lightweight Llama)',
            isFree: true,
          },
          {
            id: 'qwen/qwen-2.5-coder-32b-instruct:free',
            name: 'qwen/qwen-2.5-coder-32b-instruct:free (Free • Qwen Coder)',
            isFree: true,
          },
        ],
      },
      {
        label: 'OpenRouter Flagship Models (Requires Purchased Credits)',
        models: [
          { id: 'deepseek/deepseek-chat', name: 'deepseek/deepseek-chat (DeepSeek V3 High Speed)' },
          { id: 'anthropic/claude-3.5-sonnet', name: 'anthropic/claude-3.5-sonnet (Claude 3.5 Sonnet)', isVision: true },
          { id: 'openai/gpt-4o', name: 'openai/gpt-4o (GPT-4o Omni)', isVision: true },
          { id: 'openai/gpt-4o-mini', name: 'openai/gpt-4o-mini (GPT-4o Mini Fast)', isVision: true },
          { id: 'meta-llama/llama-3.3-70b-instruct', name: 'meta-llama/llama-3.3-70b-instruct (Llama 3.3 70B)' },
          { id: 'mistralai/mistral-large-2411', name: 'mistralai/mistral-large-2411 (Mistral Large 2)' },
          { id: 'google/gemini-2.5-flash', name: 'google/gemini-2.5-flash (Gemini 2.5 Flash)', isVision: true },
        ],
      },
    ],
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    badge: 'Vision Native',
    defaultModel: 'gemini-3.8-flash',
    groups: [
      {
        label: 'Google Gemini Multimodal Vision Models',
        models: [
          {
            id: 'gemini-3.8-flash',
            name: 'gemini-3.8-flash (Recommended Default - High Speed Multimodal Vision)',
            isRecommended: true,
            isVision: true,
          },
          {
            id: 'gemini-4-argon',
            name: 'gemini-4-argon (Flagship Complex Reasoning & Deep Vision)',
            isVision: true,
          },
          {
            id: 'gemini-3.1-flash-lite',
            name: 'gemini-3.1-flash-lite (Ultra-Low Latency)',
            isVision: true,
          },
          {
            id: 'gemini-3.1-flash-lite-image',
            name: 'gemini-3.1-flash-lite-image (Vision & Image Generation)',
            isVision: true,
          },
        ],
      },
    ],
  },
  {
    id: 'openai',
    name: 'OpenAI',
    badge: 'Flagship API',
    defaultModel: 'gpt-4o-mini',
    groups: [
      {
        label: 'Verified Production Models (Recommended)',
        models: [
          {
            id: 'gpt-4o-mini',
            name: 'gpt-4o-mini — Fast, High Value, Economical (Default)',
            isRecommended: true,
            isVision: true,
          },
          {
            id: 'gpt-4o',
            name: 'gpt-4o — Flagship Omni (Best Creative Hooks & Strategy)',
            isVision: true,
          },
          {
            id: 'gpt-4o-2024-08-06',
            name: 'gpt-4o-2024-08-06 — Structured Analytics',
            isVision: true,
          },
          {
            id: 'chatgpt-4o-latest',
            name: 'chatgpt-4o-latest — Dynamic Latest Checkpoint',
            isVision: true,
          },
        ],
      },
      {
        label: 'Advanced Reasoning Models (o1 Series)',
        models: [
          { id: 'o1-mini', name: 'o1-mini — Speed-Optimized STEM & Calculations' },
          { id: 'o1', name: 'o1 — Deep Multi-Step Chain-of-Thought' },
        ],
      },
      {
        label: 'Classic & Standard Models',
        models: [
          { id: 'gpt-4-turbo', name: 'gpt-4-turbo — 128k Context Window', isVision: true },
          { id: 'gpt-4', name: 'gpt-4 — Standard Base Foundation' },
          { id: 'gpt-3.5-turbo', name: 'gpt-3.5-turbo — Classic Fast Baseline' },
        ],
      },
    ],
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    badge: 'Deep Reasoning',
    defaultModel: 'deepseek-chat',
    groups: [
      {
        label: 'DeepSeek Official Models',
        models: [
          {
            id: 'deepseek-chat',
            name: 'deepseek-chat (DeepSeek-V3, High Speed & Conversational)',
            isRecommended: true,
          },
          {
            id: 'deepseek-reasoner',
            name: 'deepseek-reasoner (DeepSeek-R1, Chain-of-Thought COD Strategy)',
          },
        ],
      },
    ],
  },
  {
    id: 'nvidia',
    name: 'NVIDIA NIM',
    badge: 'Enterprise NIM',
    defaultModel: 'meta/llama-3.3-70b-instruct',
    groups: [
      {
        label: 'NVIDIA NIM AI Foundation Models',
        models: [
          {
            id: 'meta/llama-3.3-70b-instruct',
            name: 'meta/llama-3.3-70b-instruct (NVIDIA NIM Llama 3.3 70B)',
            isRecommended: true,
          },
          {
            id: 'deepseek-ai/deepseek-r1',
            name: 'deepseek-ai/deepseek-r1 (NVIDIA NIM DeepSeek R1)',
          },
          {
            id: 'mistralai/mixtral-8x22b-instruct-v0.1',
            name: 'mistralai/mixtral-8x22b-instruct-v0.1 (Mixtral 8x22B)',
          },
          {
            id: 'nvidia/llama-3.1-nemotron-70b-instruct',
            name: 'nvidia/llama-3.1-nemotron-70b-instruct (Nemotron 70B)',
          },
          {
            id: 'meta/llama-3.1-8b-instruct',
            name: 'meta/llama-3.1-8b-instruct (NVIDIA NIM High Speed 8B)',
          },
          {
            id: 'google/gemma-2-27b-it',
            name: 'google/gemma-2-27b-it (NVIDIA NIM Gemma 2 27B)',
          },
        ],
      },
    ],
  },
  {
    id: 'agentrouter',
    name: 'AgentRouter',
    badge: 'Smart Router',
    defaultModel: 'agentrouter/auto',
    groups: [
      {
        label: 'AgentRouter Multi-Model Routing',
        models: [
          { id: 'agentrouter/auto', name: 'agentrouter/auto (Smart Dynamic Routing)', isRecommended: true },
          { id: 'agentrouter/fast', name: 'agentrouter/fast (Ultra-Low Latency Routing)' },
          { id: 'gpt-4o', name: 'gpt-4o (GPT-4o Routed)', isVision: true },
          { id: 'claude-3-5-sonnet-latest', name: 'claude-3-5-sonnet-latest (Claude Routed)', isVision: true },
          { id: 'deepseek-v3', name: 'deepseek-v3 (DeepSeek V3 Routed)' },
          { id: 'deepseek-r1', name: 'deepseek-r1 (DeepSeek R1 Routed)' },
          { id: 'llama-3.3-70b-instruct', name: 'llama-3.3-70b-instruct (Llama 3.3 Routed)' },
        ],
      },
    ],
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    badge: 'Persuasive Copy',
    defaultModel: 'claude-3-5-sonnet',
    groups: [
      {
        label: 'Claude Official Models',
        models: [
          { id: 'claude-3-5-sonnet', name: 'claude-3-5-sonnet (Superb Analysis)', isRecommended: true, isVision: true },
          { id: 'claude-3-haiku', name: 'claude-3-haiku (Fast & Brief)' },
        ],
      },
    ],
  },
];

export function getProviderData(providerId: string): AiProviderData {
  return (
    SETTINGS_AI_PROVIDERS.find((p) => p.id === providerId) ||
    SETTINGS_AI_PROVIDERS[0]
  );
}

export function getAllModelsForProvider(providerId: string): AiModelOption[] {
  const p = getProviderData(providerId);
  return p.groups.flatMap((g) => g.models);
}

