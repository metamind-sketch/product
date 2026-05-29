import { motion } from "motion/react";
import { Store, TrendingUp, BookOpen, Sparkles, User, ShoppingCart, Landmark } from "lucide-react";
import { Currency, formatPrice } from "../types";

interface HeaderProps {
  activeTab: 'explore' | 'seller' | 'library' | 'incubator';
  setActiveTab: (tab: 'explore' | 'seller' | 'library' | 'incubator') => void;
  purchasedCount: number;
  sellerBalance: number;
  userEmail: string;
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
}

export default function Header({ 
  activeTab, 
  setActiveTab, 
  purchasedCount, 
  sellerBalance, 
  userEmail,
  currency,
  onCurrencyChange
}: HeaderProps) {
  interface TabItem {
    id: 'explore' | 'seller' | 'library' | 'incubator';
    label: string;
    icon: any;
    badge?: number;
  }

  const tabs: TabItem[] = [
    { id: 'explore', label: 'Explore Store', icon: Store },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0A0A0A]/90 backdrop-blur-md text-slate-200" id="app-header">
      <div className="mx-auto flex max-w-7xl h-20 items-center justify-between px-6 sm:px-8 lg:px-10">
        {/* Brand name */}
        <div className="flex items-center cursor-pointer" onClick={() => setActiveTab('explore')}>
          <div>
            <h1 className="font-serif text-2xl tracking-tight text-white italic">
              Coursezy
            </h1>
            <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-slate-500 font-medium">Digital Assets</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 rounded-md px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all ${
                  isActive 
                    ? "text-amber-500" 
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]"
                }`}
                id={`nav-${tab.id}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-tab-indicator"
                    className="absolute inset-0 rounded-md bg-amber-500/[0.07] border border-amber-500/20"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <Icon className="h-4 w-4 text-slate-400 shrink-0" />
                  {tab.label}
                  {tab.badge !== undefined && (
                    <span className="flex h-4 min-w-[16px] items-center justify-center rounded-md bg-amber-500 px-1 text-[9px] font-bold text-black font-sans">
                      {tab.badge}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Right actions: Balance & Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Currency Switcher Option */}
          <div className="flex bg-[#111111] rounded border border-white/5 p-0.5" id="header-currency-switch">
            <button 
              onClick={() => onCurrencyChange('USD')}
              className={`px-2 py-1 rounded text-[9px] font-mono transition-all tracking-wider font-bold ${
                currency === 'USD' 
                  ? "bg-amber-500 text-black shadow-xs font-semibold" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="View in US Dollars ($)"
            >
              $ USD
            </button>
            <button 
              onClick={() => onCurrencyChange('INR')}
              className={`px-2 py-1 rounded text-[9px] font-mono transition-all tracking-wider font-bold ${
                currency === 'INR' 
                  ? "bg-amber-500 text-black shadow-xs font-semibold" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="View in Indian Rupees (₹)"
            >
              ₹ INR
            </button>
          </div>

          {/* User Profile Badge */}
          <div className="flex items-center gap-2 rounded-md border border-white/5 bg-[#0F0F0F] px-3.5 py-2" id="user-badge">
            <User className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-xs font-mono text-slate-300 hidden sm:inline max-w-[200px] truncate">
              {userEmail}
            </span>
            <span className="text-[9px] font-extrabold text-amber-500 px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-xs uppercase">
              PRO
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
