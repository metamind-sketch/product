import { useState } from "react";
import { motion } from "motion/react";
import { BookOpen, ExternalLink, CheckSquare, Sparkles, BookMarked, ArrowLeft, ChevronRight, FileText, Check } from "lucide-react";
import { DigitalProduct, Currency, formatPrice } from "../types";

interface CustomerLibraryProps {
  products: DigitalProduct[];
  purchasedIds: string[];
  setActiveTab: (tab: 'explore' | 'seller' | 'library' | 'incubator') => void;
  currency: Currency;
}

export default function CustomerLibrary({ products, purchasedIds, setActiveTab, currency }: CustomerLibraryProps) {
  const [activeProduct, setActiveProduct] = useState<DigitalProduct | null>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  // Interactive Checklist states for items that are lists
  const [checklistValues, setChecklistValues] = useState<{ [key: string]: boolean }>({});

  const purchasedProducts = products.filter(p => purchasedIds.includes(p.id));

  const toggleChecklist = (itemKey: string) => {
    setChecklistValues(prev => ({
      ...prev,
      [itemKey]: !prev[itemKey]
    }));
  };

  const handleOpenProduct = (product: DigitalProduct) => {
    setActiveProduct(product);
    setActiveChapterIndex(0);
  };

  // If viewing a product, render the dedicated custom Reading Console
  if (activeProduct) {
    const isEbook = activeProduct.category === 'E-Book';
    const isCourse = activeProduct.category === 'Mini-Course';
    const isChecklist = activeProduct.category === 'Checklist';
    const isTemplate = activeProduct.category === 'Template';

    // Parse checklist lines if it's a checklist category on the fly
    const checklistItems = isChecklist
      ? activeProduct.contents
          .split("\n")
          .filter(line => line.trim().startsWith("- [ ]") || line.trim().startsWith("- [x]"))
          .map((line, idx) => {
            const cleanText = line.replace("- [ ]", "").replace("- [x]", "").trim();
            return { id: `${activeProduct.id}-check-${idx}`, text: cleanText };
          })
      : [];

    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 text-slate-200 font-sans" id="library-reader">
        {/* Back navigation bar */}
        <button
          onClick={() => setActiveProduct(null)}
          className="mb-6 flex items-center gap-1.5 text-xs font-mono font-bold tracking-widest text-[#d97706] uppercase hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 stroke-[2.5]" /> Return to my library bookcase
        </button>

        {/* Console layout */}
        <div className="grid gap-8 lg:grid-cols-4">
          
          {/* Side navigation rail / structure */}
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-lg border border-white/5 bg-[#0A0A0A] p-5 shadow-2xl">
              <span className="rounded bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider text-amber-500">
                {activeProduct.category}
              </span>
              <h3 className="mt-3 text-lg font-serif italic text-white font-normal leading-tight">{activeProduct.title}</h3>
              <p className="mt-1 text-[10px] uppercase font-mono tracking-wider text-slate-500">By {activeProduct.author}</p>
            </div>

            {/* Navigation item lists depending on product categories */}
            {isCourse && activeProduct.chapters && (
              <div className="rounded-lg border border-white/5 bg-[#0A0A0A] p-4 shadow-2xl">
                <span className="block text-[9px] font-mono font-bold uppercase tracking-widest text-slate-500 mb-2 px-2">Lectures Directory</span>
                <nav className="space-y-1">
                  {activeProduct.chapters.map((ch, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveChapterIndex(idx)}
                      className={`w-full text-left rounded-sm px-3 py-2 text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                        activeChapterIndex === idx
                          ? "bg-white text-black font-extrabold"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span className="truncate">{ch.title}</span>
                      <ChevronRight className="h-3.5 w-3.5 opacity-55" />
                    </button>
                  ))}
                </nav>
              </div>
            )}

            {isEbook && (
              <div className="rounded-lg border border-white/5 bg-[#0A0A0A] p-4 shadow-2xl">
                <span className="block text-[9px] font-mono font-bold uppercase tracking-widest text-slate-500 mb-2 px-2">E-Book Navigator</span>
                <div className="space-y-1">
                  <button className="w-full text-left rounded-sm px-3 py-2 text-xs font-bold bg-white text-black flex items-center gap-2">
                    <BookMarked className="h-4 w-4" /> Full Document Content
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Active Reading Pane Workspace */}
          <div className="lg:col-span-3">
            <div className="rounded-lg border border-white/5 bg-[#0A0A0A] p-6 md:p-8 shadow-2xl min-h-[450px]">
              
              {/* RENDER MODE: E-BOOK */}
              {isEbook && (
                <article className="prose prose-invert max-w-none text-slate-300 leading-relaxed space-y-6">
                  {/* Clean up mock header lines from contents since we have a title */}
                  <div className="markdown-body text-xs md:text-sm space-y-4 font-light text-left">
                    {activeProduct.contents.split('\r\n').map((line, lIdx) => {
                      if (line.trim().startsWith("# ")) {
                        return <h2 key={lIdx} className="text-xl md:text-2xl font-serif text-white tracking-tight pb-2 border-b border-white/5 pt-2 mt-4 italic font-normal">{line.replace("#", "").trim()}</h2>;
                      }
                      if (line.trim().startsWith("## ")) {
                        return <h3 key={lIdx} className="text-base md:text-lg font-serif text-white mt-6 mb-2">{line.replace("##", "").trim()}</h3>;
                      }
                      if (line.trim().startsWith("### ")) {
                        return <h4 key={lIdx} className="text-xs font-mono font-bold text-amber-500 tracking-wider uppercase mt-4">{line.replace("###", "").trim()}</h4>;
                      }
                      if (line.trim().startsWith("` ") || line.trim().startsWith("```")) {
                        return null; // Skip code blocks or custom markdown tags to avoid text clutter in visual reader
                      }
                      return <p key={lIdx} className="text-slate-300 leading-relaxed">{line}</p>;
                    })}
                  </div>
                </article>
              )}

              {/* RENDER MODE: MINI-COURSE */}
              {isCourse && activeProduct.chapters && (
                <div className="text-left font-light">
                  <div className="border-b border-white/5 pb-4 mb-6">
                    <span className="text-[9px] font-bold text-amber-500 tracking-widest font-mono uppercase">Lecture Part {activeChapterIndex + 1}</span>
                    <h3 className="text-2xl font-serif text-white mt-1 italic font-normal">{activeProduct.chapters[activeChapterIndex].title}</h3>
                  </div>

                  <div className="prose prose-invert max-w-none text-xs md:text-sm text-slate-300 space-y-4">
                    {/* Render rich mini-course details split by lines */}
                    {activeProduct.chapters[activeChapterIndex].content.split("\n").map((line, cIdx) => {
                      if (line.startsWith("### ")) {
                        return <h4 key={cIdx} className="text-base font-serif italic text-white mt-4 mb-2">{line.replace("### ", "")}</h4>;
                      }
                      if (line.startsWith("#### ")) {
                        return <h5 key={cIdx} className="text-[9px] uppercase font-mono font-bold tracking-widest text-amber-500 mt-4 mb-2">{line.replace("#### ", "")}</h5>;
                      }
                      if (line.startsWith("`") || line.includes("```")) {
                        // Treat as code representation
                        return (
                          <pre key={cIdx} className="rounded bg-[#0F0F0F] p-4 font-mono text-[10px] text-amber-400 overflow-x-auto my-3 border border-white/5">
                            {line.replace(/```/g, "")}
                          </pre>
                        );
                      }
                      return <p key={cIdx} className="leading-relaxed">{line}</p>;
                    })}
                  </div>

                  {/* Navigation Footer inside Course */}
                  <div className="mt-10 pt-6 border-t border-white/5 flex justify-between">
                    <button
                      disabled={activeChapterIndex === 0}
                      onClick={() => setActiveChapterIndex(p => p - 1)}
                      className="px-4 py-2 border border-white/10 text-xs font-mono font-bold uppercase text-slate-400 rounded-sm hover:text-white disabled:opacity-20 cursor-pointer transition"
                    >
                      previous
                    </button>
                    <button
                      disabled={activeChapterIndex === (activeProduct.chapters.length - 1)}
                      onClick={() => setActiveChapterIndex(p => p + 1)}
                      className="px-4 py-2 bg-white text-black text-xs font-mono font-bold uppercase rounded-sm hover:bg-amber-500 disabled:opacity-20 cursor-pointer transition"
                    >
                      next
                    </button>
                  </div>
                </div>
              )}

              {/* RENDER MODE: CHECKLIST */}
              {isChecklist && (
                <div className="text-left font-light">
                  <div className="border-b border-white/5 pb-4 mb-6">
                    <h4 className="text-xl font-serif italic text-white font-normal">Interactive Launch Progress</h4>
                    <p className="text-xs text-slate-400">Tick off modules dynamically as you deploy. Your checklist stays active inside Coursezy.</p>
                  </div>

                  {checklistItems.length === 0 ? (
                    <div className="py-8 text-center text-slate-500 text-xs">
                      No matching bullet list inside checklist document. Read full guidelines below:
                      <p className="mt-4 text-left p-4 bg-[#0F0F0F] font-mono text-slate-300 rounded border border-white/5 whitespace-pre-wrap">{activeProduct.contents}</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {checklistItems.map((item) => {
                        const isChecked = !!checklistValues[item.id];
                        return (
                          <div
                            key={item.id}
                            onClick={() => toggleChecklist(item.id)}
                            className={`flex items-start gap-4 rounded border p-4 cursor-pointer transition ${
                              isChecked 
                                ? "border-amber-500/20 bg-amber-500/5" 
                                : "border-white/5 bg-[#0F0F0F] hover:bg-white/[0.015]"
                            }`}
                          >
                            <div className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border transition ${
                              isChecked ? "bg-amber-500 border-amber-500 text-black" : "border-white/10 bg-[#050505]"
                            }`}>
                              {isChecked && <Check className="h-3.5 w-3.5 stroke-[3.5]" />}
                            </div>
                            <span className={`text-xs ${isChecked ? "text-slate-550 line-through italic" : "text-slate-200"}`}>
                              {item.text}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Complete details markdown at end of checklist */}
                  <div className="mt-10 pt-6 border-t border-white/5">
                    <h5 className="text-[9px] font-bold uppercase text-slate-500 mb-3 tracking-widest font-mono">Reference Guidelines</h5>
                    <div className="text-xs text-slate-300 whitespace-pre-line leading-relaxed bg-[#0F0F0F] p-4 rounded border border-white/5">
                      {activeProduct.contents.replace(/- \[[x ]\]/g, "•")}
                    </div>
                  </div>
                </div>
              )}

              {/* RENDER MODE: TEMPLATE */}
              {isTemplate && (
                <div className="text-center py-10 space-y-6">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    <ExternalLink className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif italic text-white font-normal">Your Duplicating Dashboard</h3>
                    <p className="mx-auto mt-2 max-w-sm text-xs text-slate-400 leading-relaxed font-light">
                      This template is stored in cloud servers. Click the links below to securely duplicate the master layout directly to your personal account.
                    </p>
                  </div>

                  <div className="pt-4">
                    <a
                      href={activeProduct.templateUrl || "https://notion.so"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mx-auto inline-flex items-center gap-2 rounded-sm bg-white text-black px-6 py-3.5 text-xs font-extrabold uppercase tracking-wider hover:bg-amber-500 hover:text-black transition"
                    >
                      Duplicate Master Creator Workspace <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>

                  {/* Manual duplication steps details */}
                  <div className="mx-auto max-w-xl text-left border border-white/5 bg-[#0F0F0F] rounded-lg p-5 mt-8 space-y-3">
                    <h5 className="font-mono text-[10px] font-bold uppercase text-amber-500 flex items-center gap-1.5"><Sparkles className="h-4 w-4" /> Instructions for Duplicating</h5>
                    <ol className="list-decimal pl-5 text-xs text-slate-300 space-y-1.5 font-light">
                      <li>Make sure you are logged in to your target suite tool (e.g., Notion, Figma).</li>
                      <li>Click the button above to launch the secure document link in a new tab.</li>
                      <li>In the top right corner of the launched document page, click the <strong>"Duplicate"</strong> icon button.</li>
                      <li>Select the team or personal workspace where you want the layouts populated.</li>
                    </ol>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise, render the classic Library Grid
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 text-slate-200" id="library-container">
      {/* Hero */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h2 className="font-serif text-3xl font-normal italic text-white">
            My Purchased Bookcase
          </h2>
          <p className="mt-1.5 text-xs text-slate-400 font-light max-w-xl">
            Access your courses, read ebooks, download files, and work checklists.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('explore')}
          className="inline-flex items-center gap-1.5 rounded-sm border border-white/10 px-4 py-2 text-[10px] font-mono uppercase tracking-widest font-bold text-slate-300 hover:text-amber-400 hover:border-amber-500/40 transition cursor-pointer"
        >
          Explore Assets Store
        </button>
      </div>

      {purchasedProducts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-white/10 py-16 text-center bg-[#0A0A0A] flex flex-col items-center justify-center p-8" id="empty-library">
          <BookOpen className="mx-auto h-8 w-8 text-amber-500/15 animate-pulse mb-3" />
          <h3 className="mt-2 text-base font-serif italic text-white font-normal">Your bookcase is empty</h3>
          <p className="mx-auto mt-2 max-w-xs text-xs text-slate-400 leading-relaxed font-light">
            You haven't bought any mini skills or templates yet. Check out the storefront for premium direct-to-outcome assets!
          </p>
          <div className="mt-6">
            <button
              onClick={() => setActiveTab('explore')}
              className="rounded-sm bg-white text-black hover:bg-amber-500 px-5 py-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer transition"
            >
              Go to Storefront
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" id="library-grid">
          {purchasedProducts.map((p) => (
            <div
              key={p.id}
              className="group relative flex flex-col overflow-hidden rounded-lg border border-white/5 bg-[#0a0a0add]/70 hover:border-white/15 transition-all duration-300"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-black/40">
                <img
                  src={p.coverImage}
                  alt={p.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover filter grayscale opacity-75 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300 group-hover:scale-105"
                />
                <span className="absolute top-2.5 right-2.5 rounded bg-black/85 backdrop-blur-sm px-2 py-0.5 text-[8px] font-mono font-bold text-amber-500 border border-amber-500/20 uppercase tracking-widest">
                  {p.category}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <h4 className="font-serif italic text-white font-normal text-sm group-hover:text-amber-500 transition line-clamp-1">{p.title}</h4>
                <p className="mt-1 text-xs text-slate-400 font-light line-clamp-2 flex-1 leading-relaxed">{p.tagline}</p>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[8px] font-mono tracking-widest text-slate-500 uppercase">Owned PRO</span>
                  <button
                    onClick={() => handleOpenProduct(p)}
                    className="inline-flex items-center gap-1 rounded bg-white text-black px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-tight hover:bg-amber-500 hover:text-black transition cursor-pointer"
                  >
                    Launch <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
