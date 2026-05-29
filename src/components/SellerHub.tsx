import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, TrendingUp, DollarSign, ShoppingCart, Percent, FileText, Sparkles, Check, ChevronRight, Copy, ArrowLeft } from "lucide-react";
import { DigitalProduct, ProductCategory, Currency, formatPrice } from "../types";

interface SellerHubProps {
  products: DigitalProduct[];
  onAddProduct: (newProduct: DigitalProduct) => void;
  sellerBalance: number;
  currency: Currency;
}

export default function SellerHub({ products, onAddProduct, sellerBalance, currency }: SellerHubProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'listings' | 'analytics' | 'copywriter'>('listings');

  // Add Product Form states
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ProductCategory>("Template");
  const [price, setPrice] = useState("12.99");
  const [coverUrl, setCoverUrl] = useState("");
  const [contents, setContents] = useState("");
  const [templateUrl, setTemplateUrl] = useState("");
  const [tags, setTags] = useState("Notion, Productivity");

  // AI Sales Copy Assistant states
  const [selectedProductId, setSelectedProductId] = useState("");
  const [copyFeatures, setCopyFeatures] = useState("");
  const [generatedCopy, setGeneratedCopy] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorText, setErrorText] = useState("");

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !tagline || !contents) return;

    // Split tags
    const tagArray = tags.split(",").map(t => t.trim()).filter(Boolean);

    const mockCovers = {
      "Template": "https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&w=600&q=80",
      "E-Book": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
      "Mini-Course": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
      "Checklist": "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=600&q=80",
      "Backlinks": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    };

    const finalCover = coverUrl || mockCovers[category];

    const newProduct: DigitalProduct = {
      id: "prod-user-" + Math.floor(Math.random() * 89999 + 10000),
      title,
      tagline,
      description: description || tagline,
      category,
      price: parseFloat(price) || 0,
      rating: 5.0,
      reviewsCount: 0,
      salesCount: 0,
      coverImage: finalCover,
      author: "Me (Creator)",
      tags: tagArray,
      contents,
      templateUrl: category === "Template" ? (templateUrl || "https://notion.so") : undefined,
      createdAt: new Date().toISOString()
    };

    onAddProduct(newProduct);
    setShowAddModal(false);

    // Reset Form
    setTitle("");
    setTagline("");
    setDescription("");
    setPrice("12.99");
    setCoverUrl("");
    setContents("");
    setTemplateUrl("");
    setTags("Notion, Productivity");
  };

  const generateAICopy = async () => {
    setIsGenerating(true);
    setErrorText("");
    setGeneratedCopy("");
    
    // Find target product
    const prod = products.find(p => p.id === selectedProductId) || products[0];
    
    try {
      const resp = await fetch("/api/generate-copy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: prod?.title || "My Digital Asset",
          tagline: prod?.tagline || "",
          category: prod?.category || "Template",
          features: copyFeatures ? copyFeatures.split("\n").filter(Boolean) : []
        })
      });

      if (!resp.ok) {
        throw new Error("Copy generation failed. Check server status.");
      }

      const data = await resp.json();
      setGeneratedCopy(data.copy);
    } catch (err: any) {
      console.error(err);
      setErrorText("Our AI Copywriter endpoint failed or is missing its key. We've compiled a default template layout for you.");
      // Render fallback
      setGeneratedCopy(`## Why Choose ${prod?.title || "Digital Asset"}

${prod?.tagline || "Master this micro-skill with direct-to-outcome blueprints."}

This specialized **${(prod?.category || "Template").toLowerCase()}** provides instant deployable structures and files to reduce execution cycles.

### Key Benefits
- **Elite Workflows**: Prebuild code block modules ready to integrate.
- **Saves Days**: Avoid long bloated hours of course material.
- **Lifetime Updates**: Receive any standard file revisions for free directly inside your Coursezy Library.`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Static Metrics calculations inside listings
  const totalSalesCount = products.reduce((acc, p) => acc + (p.salesCount || 0), 0) + 12; // Base offset
  const conversionRate = 4.2; 
  
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 text-slate-200" id="seller-hub-container">
      {/* Header section with tabs */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between border-b border-white/5 gap-4 pb-6">
        <div>
          <h2 className="font-serif text-3xl font-normal italic text-white">
            Creator Hub & Dashboard
          </h2>
          <p className="mt-1.5 text-xs text-slate-400 max-w-xl font-light">
            Monitor, upload, and write high-converting landing copy with integrated sandbox analytics.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="cursor-pointer inline-flex items-center gap-1.5 rounded-sm bg-white text-black hover:bg-amber-500 hover:text-black px-4 py-2 text-xs font-extrabold uppercase tracking-tight transition"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" /> Launch Digital Asset
          </button>
        </div>
      </div>

      <div className="flex gap-6 mb-8 border-b border-white/5 pb-1 overflow-x-auto text-sm" id="sub-tabs font-medium">
        <button
          onClick={() => setActiveSubTab('listings')}
          className={`pb-3 border-b-2 px-1 text-[10px] tracking-[0.15em] uppercase font-bold transition cursor-pointer font-mono ${
            activeSubTab === 'listings' ? "border-amber-500 text-amber-500" : "border-transparent text-slate-500 hover:text-white"
          }`}
        >
          My Inventory
        </button>
        <button
          onClick={() => setActiveSubTab('analytics')}
          className={`pb-3 border-b-2 px-1 text-[10px] tracking-[0.15em] uppercase font-bold transition cursor-pointer font-mono ${
            activeSubTab === 'analytics' ? "border-amber-500 text-amber-500" : "border-transparent text-slate-500 hover:text-white"
          }`}
        >
          Revenue Flows
        </button>
        <button
          onClick={() => setActiveSubTab('copywriter')}
          className={`pb-3 border-b-2 px-1 text-[10px] tracking-[0.15em] uppercase font-bold transition cursor-pointer font-mono ${
            activeSubTab === 'copywriter' ? "border-amber-500 text-amber-500" : "border-transparent text-slate-500 hover:text-white"
          }`}
        >
          AI Copy Assistant
        </button>
      </div>

      {/* SUB-PANEL 1: ACTIVE LISTINGS */}
      {activeSubTab === 'listings' && (
        <div className="space-y-8">
          {/* Quick Metrics */}
          <div className="grid gap-0 border border-white/5 bg-[#0A0A0A] sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-6 border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[9px] uppercase font-mono tracking-widest text-slate-500">Gross Income</span>
                <h4 className="text-2xl font-serif text-amber-500 italic mt-1">{formatPrice(sellerBalance, currency)}</h4>
              </div>
              <div className="h-9 w-9 flex items-center justify-center rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <DollarSign className="h-4.5 w-4.5" />
              </div>
            </div>

            <div className="p-6 border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[9px] uppercase font-mono tracking-widest text-slate-500">Sales Volume</span>
                <h4 className="text-2xl font-serif text-white italic mt-1">{totalSalesCount} units</h4>
              </div>
              <div className="h-9 w-9 flex items-center justify-center rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <ShoppingCart className="h-4.5 w-4.5" />
              </div>
            </div>

            <div className="p-6 border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[9px] uppercase font-mono tracking-widest text-slate-500">Conversion Rate</span>
                <h4 className="text-2xl font-serif text-white italic mt-1">{conversionRate}%</h4>
              </div>
              <div className="h-9 w-9 flex items-center justify-center rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <Percent className="h-4.5 w-4.5" />
              </div>
            </div>

            <div className="p-6 border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[9px] uppercase font-mono tracking-widest text-slate-500">Listed Assets</span>
                <h4 className="text-2xl font-serif text-white italic mt-1">{products.length} assets</h4>
              </div>
              <div className="h-9 w-9 flex items-center justify-center rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <FileText className="h-4.5 w-4.5" />
              </div>
            </div>
          </div>

          {/* Listings Catalog Table */}
          <div className="overflow-hidden rounded-lg border border-white/5 bg-[#0a0a0add]/70">
            <div className="px-6 py-4.5 border-b border-white/5 flex justify-between items-center bg-[#070707]">
              <h4 className="text-xs uppercase font-mono tracking-wider font-bold text-slate-300">Creator Inventory Logs</h4>
              <span className="text-[10px] font-mono text-slate-500">Pricing vs Volume metrics</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#050505] border-b border-white/5 text-slate-400 font-bold uppercase font-mono tracking-wider text-[9px]">
                    <th className="p-4">Product Info</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Rating</th>
                    <th className="p-4">Sales Vol</th>
                    <th className="p-4 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300 font-medium h-fit">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-white/[0.015] transition">
                      <td className="p-4 flex gap-3 items-center min-w-[200px]">
                        <img src={p.coverImage} className="h-8 w-11 object-cover rounded bg-[#0A0A0A] border border-white/5 filter grayscale opacity-80" referrerPolicy="no-referrer" />
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate text-xs">{p.title}</p>
                          <p className="text-[9px] text-slate-500 font-mono truncate">{p.id}</p>
                        </div>
                      </td>
                      <td className="p-4 w-28">
                        <span className="rounded bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 text-[9px] font-bold text-amber-500 uppercase tracking-widest font-mono">
                          {p.category}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-white">{formatPrice(p.price, currency)}</td>
                      <td className="p-4 text-amber-500 font-bold">★ {p.rating.toFixed(1)}</td>
                      <td className="p-4 font-mono text-slate-400">{p.salesCount} units</td>
                      <td className="p-4 font-mono font-bold text-right text-amber-500">
                        {formatPrice(p.price * p.salesCount, currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-PANEL 2: REVENUE ANALYTICS */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Monthly SVG chart representation */}
            <div className="rounded-lg border border-white/5 bg-[#0A0A0A] p-6 md:p-8 shadow-2xl lg:col-span-2">
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <h4 className="text-base font-serif italic text-white font-normal">Income stream trends</h4>
                  <p className="text-xs text-slate-400">Monthly gross profits metrics in USD</p>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase tracking-wider">
                  +12.8% vs last month
                </span>
              </div>

              {/* Standalone SVG representation of area charts */}
              <div className="relative h-60 w-full" id="income-svg-graph">
                <svg className="h-full w-full" viewBox="0 0 600 240" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="50" y1="40" x2="570" y2="40" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="4" />
                  <line x1="50" y1="100" x2="570" y2="100" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="4" />
                  <line x1="50" y1="160" x2="570" y2="160" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="4" />
                  <line x1="50" y1="210" x2="570" y2="210" stroke="#ffffff" strokeOpacity="0.1" strokeWidth="1" />

                  {/* Area Fill Gradient Definitions */}
                  <defs>
                    <linearGradient id="gradient-income" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#d97706" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#d97706" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Filled Area Path */}
                  <path
                    d="M 50 210 L 50 160 Q 140 140 150 120 T 250 150 T 350 90 T 450 70 T 570 50 L 570 210 Z"
                    fill="url(#gradient-income)"
                  />

                  {/* Main Stroke Line */}
                  <path
                    d="M 50 160 Q 140 140 150 120 T 250 150 T 350 90 T 450 70 T 570 50"
                    fill="none"
                    stroke="#d97706"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />

                  {/* Dynamic Points dots */}
                  <circle cx="50" cy="160" r="4" fill="#d97706" stroke="#000000" strokeWidth="2" />
                  <circle cx="150" cy="120" r="4" fill="#d97706" stroke="#000000" strokeWidth="2" />
                  <circle cx="250" cy="150" r="4" fill="#d97706" stroke="#000000" strokeWidth="2" />
                  <circle cx="350" cy="90" r="4" fill="#d97706" stroke="#000000" strokeWidth="2" />
                  <circle cx="450" cy="70" r="4" fill="#d97706" stroke="#000000" strokeWidth="2" />
                  <circle cx="570" cy="50" r="4" fill="#d97706" stroke="#000000" strokeWidth="2" />
                </svg>

                {/* X Axis Labels */}
                <div className="absolute inset-x-0 bottom-0 mt-4 flex justify-between px-12 font-mono text-[9px] font-bold text-slate-500">
                  <span>DEC</span>
                  <span>JAN</span>
                  <span>FEB</span>
                  <span>MAR</span>
                  <span>APR</span>
                  <span>MAY</span>
                </div>
              </div>
            </div>

            {/* Category Breakdown list */}
            <div className="rounded-lg border border-white/5 bg-[#0A0A0A] p-6 shadow-2xl flex flex-col justify-between">
              <div>
                <h4 className="text-base font-serif italic text-white mb-1">Niche Distributions</h4>
                <p className="text-xs text-slate-400">Gross metrics split by digital product type.</p>
              </div>

              <div className="space-y-4 my-6">
                {[
                  { cat: "Template", share: "45%", count: "$2,840.00", color: "bg-amber-600" },
                  { cat: "E-Book", share: "25%", count: "$1,520.00", color: "bg-slate-400" },
                  { cat: "Mini-Course", share: "20%", count: "$910.00", color: "bg-slate-600" },
                  { cat: "Checklist", share: "10%", count: "$340.00", color: "bg-slate-800" }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-medium font-mono">
                      <span className="text-slate-300">{item.cat}</span>
                      <span className="text-slate-500">{item.share} ({item.count})</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#111111] rounded overflow-hidden border border-white/5">
                      <div className={`h-full ${item.color}`} style={{ width: item.share }} />
                    </div>
                  </div>
                ))}
              </div>

              <span className="block text-[8px] text-slate-500 text-center font-mono uppercase tracking-wider">🔒 Real-time sandbox metrics locked</span>
            </div>
          </div>
        </div>
      )}

      {/* SUB-PANEL 3: GEMINI COPYWRITER */}
      {activeSubTab === 'copywriter' && (
        <div className="space-y-8" id="copywriter-panel">
          <div className="grid gap-8 lg:grid-cols-5">
            {/* Input segment */}
            <div className="lg:col-span-2 rounded-lg border border-white/5 bg-[#0A0A0A] p-6 shadow-2xl space-y-5 h-fit">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  <Sparkles className="h-4 w-4" />
                </div>
                <h4 className="text-sm font-bold text-white uppercase font-mono tracking-wider">AI Sales Architect</h4>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Provide core benefits or identifiers and Gemini's specialized copywriting model will design a premium high-converting landing module text.
              </p>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-15">Target Product</label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full text-xs rounded border border-white/10 bg-[#0F0F0F] text-slate-200 px-3 py-2.5 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="">Select listed product...</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.title} ({p.category})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5">Core Features (one / entry)</label>
                  <textarea
                    rows={4}
                    placeholder="Enter features (one per line) e.g.&#10;- Lifetime update support&#10;- Perfect for teams up to 10&#10;- Developed with seasoned developers"
                    value={copyFeatures}
                    onChange={(e) => setCopyFeatures(e.target.value)}
                    className="w-full text-xs rounded border border-white/10 bg-[#0F0F0F] text-slate-200 px-3 py-2.5 focus:border-amber-500 focus:outline-none placeholder-slate-600"
                  />
                </div>

                <button
                  onClick={generateAICopy}
                  disabled={isGenerating || !selectedProductId}
                  className="w-full cursor-pointer rounded-sm bg-white text-black hover:bg-amber-500 font-bold uppercase tracking-wider text-xs py-3 text-center transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Consulting Gemini AI Writer...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5 fill-black" /> Produce Conversion Pitch
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Response copy visualizer panel */}
            <div className="lg:col-span-3 rounded-lg border border-white/5 bg-[#0A0A0A] p-6 md:p-8 shadow-2xl min-h-[300px] flex flex-col">
              <h5 className="text-[9px] uppercase font-mono font-bold tracking-widest text-slate-500 mb-4 pb-2 border-b border-white/5">Sales funnels output</h5>

              {errorText && (
                <div className="p-3 mb-4 rounded bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs text-left">
                  {errorText}
                </div>
              )}

              {generatedCopy ? (
                <div className="flex-1 flex flex-col justify-between">
                  <div className="max-w-none text-xs text-slate-300 space-y-4 max-h-[350px] overflow-y-auto p-4 bg-[#0F0F0F] border border-white/5 rounded font-mono whitespace-pre-wrap text-left leading-relaxed">
                    {generatedCopy}
                  </div>
                  <div className="pt-4 flex justify-end gap-2 border-t border-white/5 mt-4">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedCopy);
                      }}
                      className="cursor-pointer inline-flex items-center gap-1.5 rounded bg-white text-black text-xs font-bold uppercase tracking-wider px-4 py-2 hover:bg-amber-500"
                    >
                      <Copy className="h-3. w-3.5" /> Copy Landing Content
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 text-xs py-12">
                  <Sparkles className="h-8 w-8 text-amber-500/20 animate-pulse mb-3" />
                  <p className="max-w-sm text-xs font-light leading-relaxed">
                    Your custom-crafted copy will appear here. Selected assets from your inventory will automatically feed the model prompt.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PUBLISH MODAL FORM STATE */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto" id="publish-asset-modal">
            <div className="fixed inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />

            <div className="flex min-h-screen items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-2xl overflow-hidden rounded-xl bg-[#0F0F0F] text-slate-200 border border-white/10 shadow-2xl"
              >
                {/* Modal Title */}
                <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between bg-[#0A0A0A]">
                  <h3 className="font-serif italic text-base text-white">Publish Product to Storefront</h3>
                  <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white text-xl font-bold cursor-pointer">
                    &times;
                  </button>
                </div>

                <form onSubmit={handleCreateProduct} className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 space-y-1">
                      <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">Product Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Master React 19 State Models"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full text-xs rounded border border-white/10 bg-[#0A0A0A] text-slate-200 px-3.5 py-2.5 focus:border-amber-500 focus:outline-none placeholder-slate-600"
                      />
                    </div>

                    <div className="col-span-2 space-y-1">
                      <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">Elevator Tagline</label>
                      <input
                        type="text"
                        required
                        placeholder="Unlock clean React patterns and save weeks of build cycles."
                        value={tagline}
                        onChange={(e) => setTagline(e.target.value)}
                        className="w-full text-xs rounded border border-white/10 bg-[#0A0A0A] text-slate-200 px-3.5 py-2.5 focus:border-amber-500 focus:outline-none placeholder-slate-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">Product Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as ProductCategory)}
                        className="w-full text-xs rounded border border-white/10 bg-[#0A0A0A] text-slate-200 px-3 py-2.5 focus:border-amber-500 focus:outline-none"
                      >
                        <option value="Template">Template</option>
                        <option value="E-Book">E-Book</option>
                        <option value="Mini-Course">Mini-Course</option>
                        <option value="Checklist">Checklist</option>
                        <option value="Backlinks">Backlinks</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">Price (USD)</label>
                      <input
                        type="number"
                        required
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full text-xs rounded border border-white/10 bg-[#0A0A0A] text-slate-200 px-3.5 py-2.5 focus:border-amber-500 focus:outline-none placeholder-slate-600"
                      />
                    </div>

                    <div className="col-span-2 space-y-1">
                      <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">Tags (comma separated)</label>
                      <input
                        type="text"
                        placeholder="e.g. React, Nextjs, Architecture"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        className="w-full text-xs rounded border border-white/10 bg-[#0A0A0A] text-slate-200 px-3.5 py-2.5 focus:border-amber-500 focus:outline-none placeholder-slate-600"
                      />
                    </div>

                    {category === "Template" && (
                      <div className="col-span-2 space-y-1">
                        <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">Template Duplicate Link URL</label>
                        <input
                          type="url"
                          placeholder="e.g. https://notion.so/my-duplicated-layout"
                          value={templateUrl}
                          onChange={(e) => setTemplateUrl(e.target.value)}
                          className="w-full text-xs rounded border border-white/10 bg-[#0A0A0A] text-slate-200 px-3.5 py-2 focus:border-amber-500 focus:outline-none placeholder-slate-600"
                        />
                      </div>
                    )}

                    <div className="col-span-2 space-y-1">
                      <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">Cover Image URL (Optional)</label>
                      <input
                        type="url"
                        placeholder="Leave blank to deploy automatic category covers"
                        value={coverUrl}
                        onChange={(e) => setCoverUrl(e.target.value)}
                        className="w-full text-xs rounded border border-white/10 bg-[#0A0A0A] text-slate-200 px-3.5 py-2 focus:border-amber-500 focus:outline-none placeholder-slate-600"
                      />
                    </div>

                    <div className="col-span-2 space-y-1">
                      <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">Interactive Content / Outline / Checklist List</label>
                      <textarea
                        rows={5}
                        required
                        placeholder="Type premium asset content, course slides link or checklist steps starting with - [ ] for active libraries."
                        value={contents}
                        onChange={(e) => setContents(e.target.value)}
                        className="w-full text-xs rounded border border-white/10 bg-[#0A0A0A] text-slate-200 px-3.5 py-2 focus:border-amber-500 focus:outline-none placeholder-slate-700 font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 justify-end border-t border-white/5 mt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 border border-white/10 rounded text-slate-400 text-xs font-bold uppercase tracking-wider hover:text-white cursor-pointer"
                    >
                      Dismiss
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-white text-black hover:bg-amber-500 font-extrabold uppercase tracking-tight text-xs cursor-pointer"
                    >
                      Deploy Asset
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
