import React from 'react';
import {
  Search,
  Video,
  Globe,
  Share2,
  Users,
  FileText,
  CornerDownRight,
  Lightbulb,
  Layers,
  Truck,
  Eye,
  TrendingUp,
  BarChart2,
  HeartHandshake,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  Image,
  Scan,
  Sparkles,
  Layout,
  Film,
  Zap,
  Type,
  Sliders,
  Activity,
  ShoppingBag,
  Monitor,
  CheckSquare,
  CreditCard,
  Radio,
  UserX,
  GitFork,
  Package,
  PhoneCall,
  MessageSquare,
  Phone,
  MapPin,
  Map,
  Send,
  CheckCircle,
  XCircle,
  RotateCcw,
  UserMinus,
  DollarSign,
  MousePointer,
  Target,
  Award,
  PieChart,
  AlertCircle,
  Banknote,
  Box,
  Coins,
  Percent,
  Crosshair,
  Repeat,
  Bot,
  Brain,
  GitBranch,
  Filter,
  Clock,
  Link,
  Terminal,
  Code,
  Bell,
  UserCheck,
  GitMerge,
  Database,
  Bookmark,
  FileCheck,
  Table,
  File,
  Download,
  Flag,
  StickyNote,
} from 'lucide-react';

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export const NodeIcon: React.FC<IconProps> = ({ name, className = 'w-4 h-4', size = 16 }) => {
  // Custom brand SVG for Meta
  if (name === 'Meta') {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
      </svg>
    );
  }

  // Custom brand SVG for WhatsApp
  if (name === 'WhatsApp' || name === 'whatsapp_confirmation') {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.78 14.15c-.24.68-1.39 1.3-1.92 1.38-.5.08-1.15.11-3.69-.94-3.25-1.35-5.34-4.66-5.5-4.88-.16-.22-1.32-1.76-1.32-3.36 0-1.6 1.03-2.38 1.39-2.74.37-.36.81-.45 1.08-.45.27 0 .54 0 .78.02.25.01.59-.09.92.7.34.82 1.17 2.85 1.27 3.06.1.21.17.46.03.73-.13.27-.2.44-.41.68-.2.24-.44.53-.62.71-.21.21-.43.44-.19.86.24.42 1.07 1.76 2.3 2.86 1.58 1.41 2.91 1.84 3.33 2.05.41.21.66.18.91-.1.25-.28 1.07-1.25 1.36-1.68.29-.43.58-.36.97-.21.4.15 2.52 1.19 2.95 1.4.43.21.72.31.83.49.1.18.1.98-.14 1.66z" />
      </svg>
    );
  }

  // Custom brand SVG for Shopify
  if (name === 'Shopify' || name === 'shopify_store') {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.42 3.65c-.04-.33-.27-.6-.59-.69-.32-.09-2.4-.44-2.4-.44s-1.65-1.65-1.84-1.84C10.4.5 10.15.5 9.94.62c-.04.02-1.32 1.05-1.75 1.4-.43-.35-1.71-1.38-1.75-1.4-.21-.12-.46-.12-.65.06C5.6 0.87 3.95 2.52 3.95 2.52s-2.08.35-2.4.44c-.32.09-.55.36-.59.69L.02 18.9c-.06.49.27.93.75.99l10.97 1.47c.07.01.14.01.21.01.07 0 .14 0 .21-.01l10.97-1.47c.48-.06.81-.5.75-.99L22.94 3.65z" />
      </svg>
    );
  }

  const iconMap: Record<string, any> = {
    Search,
    Video,
    Globe,
    Share2,
    Users,
    FileText,
    CornerDownRight,
    Lightbulb,
    Layers,
    Truck,
    Eye,
    TrendingUp,
    BarChart2,
    HeartHandshake,
    CheckCircle2,
    ShieldCheck,
    AlertTriangle,
    Image,
    Scan,
    Sparkles,
    Layout,
    Film,
    Zap,
    Type,
    Sliders,
    Activity,
    ShoppingBag,
    Monitor,
    CheckSquare,
    CreditCard,
    Radio,
    UserX,
    GitFork,
    Package,
    PhoneCall,
    MessageSquare,
    Phone,
    MapPin,
    Map,
    Send,
    CheckCircle,
    XCircle,
    RotateCcw,
    UserMinus,
    DollarSign,
    MousePointer,
    Target,
    Award,
    PieChart,
    AlertCircle,
    Banknote,
    Box,
    Coins,
    Percent,
    Crosshair,
    Repeat,
    Bot,
    Brain,
    GitBranch,
    Filter,
    Clock,
    Link,
    Terminal,
    Code,
    Bell,
    UserCheck,
    GitMerge,
    Database,
    Bookmark,
    FileCheck,
    Table,
    File,
    Download,
    Flag,
    StickyNote,
  };

  const IconComponent = iconMap[name] || FileText;
  return <IconComponent className={className} size={size} />;
};
