import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ArrowRight, CheckCircle, HelpCircle, RefreshCw, DollarSign, Target, Award, Map } from "lucide-react";
import { DigitalProduct, ProductCategory, OutlineResult, Currency } from "../types";

interface AICoCreatorProps {
  onAddProduct: (product: DigitalProduct) => void;
  setActiveTab: (tab: 'explore' | 'seller' | 'library' | 'incubator') => void;
  currency: Currency;
}

export default function AICoCreator({ onAddProduct, setActiveTab, currency }: AICoCreatorProps) {
  const [topic, setTopic] = useState("React 19 testing patterns");
  const [category, setCategory] = useState<ProductCategory>("E-Book");
  const [audienceDetails, setAudienceDetails] = useState("Mid-level developers eager to implement robust Cypress and Jest specs");
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [outline, setOutline] = useState<OutlineResult | null>(null);
  const [isAdopted, setIsAdopted] = useState(false);

  const handleGenerateOutline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;

    setIsGenerating(true);
    setErrorText("");
    setOutline(null);
    setIsAdopted(false);

    try {
      const resp = await fetch("/api/generate-outline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, category, audienceDetails })
      });

      if (!resp.ok) {
        throw new Error("HTTP error generating syllabus outline.");
      }

      const result = await resp.ok ? await resp.json() : null;
      setOutline(result);
    } catch (err: any) {
      console.error(err);
      setErrorText("Gemini API connection error. Rendering a high-quality preset fallback outline instead.");
      
      // Fallback
      setOutline({
        title: `The Ultimate Guide to ${topic.charAt(0).toUpperCase() + topic.slice(1)}`,
        tagline: `Accelerate your product delivery roadmap with this complete masterclass ${category.toLowerCase()}.`,
        suggestedPrice: 19.99,
        targetAudience: [
          "Senior product designers & builders",
          "Tech-driven startup founders looking to scale",
          "Independent creators aiming for passive cashflow"
        ],
        highlights: [
          "Zero theoretical bloat - 100% focused on immediate outcomes and direct deployment",
          "Pre-audited custom asset packs and modular files included in final folder",
          "Advanced speed tricks that compress 20 hours of manual labor into 5 minutes"
        ],
        chapters: [
          { title: "Chapter 1: The Initial Architecture Setup", summary: "Learn first principles, install frameworks, configure configuration tags, and wire up central pipelines safely." },
          { title: "Chapter 2: Designing Dynamic Layout Compartments", summary: "Modular design systems, custom responsive parameters, grid ratios, and elegant micro-animations configurations." },
          { title: "Chapter 3: Connecting State Channels & Sockets", summary: "Set up asynchronous client stores, request handling, hooks integration, and safe local backups." },
          { title: "Chapter 4: Final Auditing, Deployment & Optimization", summary: "Code-splitting routines, visual lighthouse optimizations, SEO crawling audits, and safe server launch checks." }
        ]
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAdoptOutline = () => {
    if (!outline) return;

    // Convert outline chapters into contents markdown
    const chapterContents = outline.chapters.map(ch => 
      `## ${ch.title}\n${ch.summary}\n\n*Reference Exercise*: Experiment rewriting this module locally to configure customized state parameters.`
    ).join("\n\n");

    const fullContents = `# ${outline.title}\n\n${outline.tagline}\n\n${chapterContents}`;

    const newProduct: DigitalProduct = {
      id: "prod-ai-" + Math.floor(Math.random() * 89999 + 10000),
      title: outline.title,
      tagline: outline.tagline,
      description: `Tailored digital training curriculum created instantly by Coursezy AI.\n\nTarget Audience:\n${outline.targetAudience.map(t => `• ${t}`).join("\n")}`,
      category,
      price: outline.suggestedPrice || 14.99,
      rating: 5.0,
      reviewsCount: 0,
      salesCount: 0,
      coverImage: getCoverForCategory(category),
      author: "Coursezy AI Expert",
      tags: [topic.split(" ")[0] || "AI", "Micro-Skill", "Learning"],
      contents: fullContents,
      createdAt: new Date().toISOString()
    };

    onAddProduct(newProduct);
    setIsAdopted(true);

    // After 1.5 seconds navigate to Storefront explore
    setTimeout(() => {
      setActiveTab('explore');
    }, 1800);
  };

  const getCoverForCategory = (cat: ProductCategory) => {
    const urls: Record<ProductCategory, string> = {
      "Template": "https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&w=600&q=80",
      "E-Book": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
      "Mini-Course": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
      "Checklist": "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=600&q=80",
      "Backlinks": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    };
    return urls[cat] || urls["Template"];
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 text-slate-200" id="incubator-container">
      {/* Intro */}
      <div className="mb-12 border-b border-white/5 pb-6">
        <h2 className="font-serif text-3xl font-normal italic text-white">
          AI Syllabus Architect
        </h2>
        <p className="mt-1.5 text-xs text-slate-400 max-w-2xl font-light">
          Enter a micro-skill idea topic. Gemini AI will instantly program a high-converting outline syllabus including price recommendations. Deploys live with 1 click!
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        
        {/* Pitch Ideas Form Column */}
        <div className="lg:col-span-2 rounded-lg border border-white/5 bg-[#0A0A0A] p-6 shadow-2xl h-fit space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4.5 w-4.5 text-amber-500" />
            <h4 className="text-xs uppercase font-mono tracking-wider font-bold text-slate-100">Configure Product</h4>
          </div>

          <form onSubmit={handleGenerateOutline} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">Product Topic Concept</label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Master React 19 testing patterns"
                className="w-full text-xs rounded border border-white/10 bg-[#0F0F0F] text-slate-200 px-3.5 py-2.5 focus:border-amber-500 focus:outline-none placeholder-slate-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">Target Product Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full text-xs rounded border border-white/10 bg-[#0F0F0F] text-slate-200 px-3 py-2.5 focus:border-amber-500 focus:outline-none"
              >
                <option value="E-Book">E-Book Guide</option>
                <option value="Template">Duplicatable Template</option>
                <option value="Mini-Course">Mini-Course Modules</option>
                <option value="Checklist">Actionable Checklist</option>
                <option value="Backlinks">Backlinks Checklist & Database</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">Audience description (Optional)</label>
              <textarea
                rows={3}
                value={audienceDetails}
                onChange={(e) => setAudienceDetails(e.target.value)}
                placeholder="Describe your buyers details e.g. self-taught creators looking to automate social content scheduling..."
                className="w-full text-xs rounded border border-white/10 bg-[#0F0F0F] text-slate-200 px-3.5 py-2.5 focus:border-amber-500 focus:outline-none placeholder-slate-600"
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full cursor-pointer rounded-sm bg-white text-black hover:bg-amber-500 font-bold uppercase tracking-wider text-xs py-3 text-center transition flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="animate-spin h-4 w-4" />
                  Generating Syllabus...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 fill-black" /> Formulate Product outline
                </>
              )}
            </button>
          </form>
        </div>

        {/* AI Answer & Adoption Column */}
        <div className="lg:col-span-3">
          {errorText && (
            <div className="p-3 mb-4 rounded bg-[#1A1110] border border-red-500/10 text-rose-400 text-xs text-left">
              {errorText}
            </div>
          )}

          {outline ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-white/5 bg-[#0A0A0A] p-6 md:p-8 shadow-2xl space-y-6"
              id="incubated-visualizer"
            >
              {/* Header result */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-white/5">
                <div className="min-w-0">
                  <span className="rounded bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[9px] font-bold text-amber-500 uppercase tracking-widest font-mono">
                    Incubator Succeeded
                  </span>
                  <h3 className="mt-2 text-xl font-serif text-white italic font-normal leading-tight">
                    {outline.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-400 font-light italic">"{outline.tagline}"</p>
                </div>

                <div className="flex items-center gap-1 rounded bg-[#0F0F0F] border border-white/10 px-3.5 py-1.5 font-mono text-xs text-white shrink-0">
                  <DollarSign className="h-3.5 w-3.5 text-amber-500" />
                  <span>Price: ${outline.suggestedPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Targets */}
              <div className="space-y-3">
                <h5 className="text-[10px] uppercase font-mono tracking-widest font-bold text-slate-500 flex items-center gap-1.5"><Target className="h-3.5 w-3.5 text-amber-500" /> Target Buyer Avatars</h5>
                <div className="grid gap-3 sm:grid-cols-3">
                  {outline.targetAudience.map((target, idx) => (
                    <div key={idx} className="rounded border border-white/5 p-3.5 bg-[#0F0F0F] text-left">
                      <span className="text-[9px] font-mono font-bold text-amber-500 uppercase">Persona 0{idx + 1}</span>
                      <p className="mt-1 text-xs text-slate-300 leading-relaxed font-light">{target}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Learning Highlights */}
              <div className="space-y-3">
                <h5 className="text-[10px] uppercase font-mono tracking-widest font-bold text-slate-500 flex items-center gap-1.5"><Award className="h-3.5 w-3.5 text-amber-500" /> Learning Highlights</h5>
                <ul className="space-y-2 text-xs text-slate-300 pl-1 text-left font-light">
                  {outline.highlights.map((h, idx) => (
                    <li key={idx} className="flex gap-2.5 items-start leading-relaxed text-slate-300">
                      <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Syllabus chapter grids */}
              <div className="space-y-3">
                <h5 className="text-[10px] uppercase font-mono tracking-widest font-bold text-slate-500 flex items-center gap-1.5"><Map className="h-3.5 w-3.5 text-amber-500" /> Syllabus outline</h5>
                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                  {outline.chapters.map((ch, idx) => (
                    <div key={idx} className="rounded border border-white/5 p-4 text-left hover:border-white/10 bg-[#0F0F0F] transition">
                      <p className="text-[9px] font-bold text-amber-500 font-mono uppercase tracking-widest">PART {idx + 1}: {ch.title}</p>
                      <p className="mt-1 text-xs text-white leading-relaxed font-semibold">{ch.title}</p>
                      <p className="mt-0.5 text-xs text-slate-400 font-light leading-relaxed">{ch.summary}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* One click listing button */}
              <div className="pt-6 border-t border-white/5 flex flex-col items-center justify-between gap-4">
                {isAdopted ? (
                  <div className="w-full rounded bg-emerald-500/10 border border-emerald-500/20 p-4 flex items-center justify-center gap-2 text-emerald-400 text-xs font-bold font-mono uppercase tracking-wide">
                    <CheckCircle className="h-5 w-5 animate-pulse stroke-[3]" /> Added to Catalog! Opening Storefront explore index...
                  </div>
                ) : (
                  <button
                    onClick={handleAdoptOutline}
                    className="w-full cursor-pointer inline-flex items-center justify-center gap-2 rounded bg-amber-500 py-3 px-6 text-xs font-bold text-black uppercase tracking-wider hover:bg-amber-600 transition"
                  >
                    Adopt Outline & Launch inside Storefront <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                  </button>
                )}
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest text-center">Converts outline into complete draft template contents.</span>
              </div>

            </motion.div>
          ) : (
            <div className="rounded-lg border border-dashed border-white/10 py-24 text-center bg-[#0A0A0A] text-slate-500 flex flex-col items-center justify-center">
              <Sparkles className="mx-auto h-8 w-8 text-amber-500/10 animate-pulse mb-3" />
              <h3 className="text-base font-serif italic text-white font-normal">Syllabus awaiting concept</h3>
              <p className="mx-auto mt-2 max-w-xs text-xs text-slate-400 leading-normal font-light">
                Provide your micro-skill educational ideas on the left form and harness Gemini AI to map the learning directory outline instantly.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
