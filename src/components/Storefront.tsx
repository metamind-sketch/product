import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, SlidersHorizontal, Star, ShoppingBag, ArrowRight, CheckCircle, CreditCard, Lock, ArrowLeft, Download, Eye, Link, FileText, BookOpen, Shield, Zap, Award, Flame, ChevronDown, HelpCircle, Heart, Plus, ShoppingCart, Minus, Trash2 } from "lucide-react";
import { DigitalProduct, ProductCategory, Currency, formatPrice } from "../types";
import { MOCK_REVIEWS } from "../data";

interface StorefrontProps {
  products: DigitalProduct[];
  purchasedIds: string[];
  onPurchaseComplete: (productId: string, price: number) => void;
  userEmail: string;
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
}

export default function Storefront({ products, purchasedIds, onPurchaseComplete, userEmail, currency, onCurrencyChange }: StorefrontProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
  const [selectedProduct, setSelectedProduct] = useState<DigitalProduct | null>(null);
  const [checkoutProduct, setCheckoutProduct] = useState<DigitalProduct | null>(null);

  // Cart and Liked/Wishlist States
  const [likedIds, setLikedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("coursezy_liked_ids");
      return stored ? JSON.parse(stored) : [];
    } catch (_) {
      return [];
    }
  });

  interface CartItemState {
    productId: string;
    quantity: number;
  }

  const [cart, setCart] = useState<CartItemState[]>(() => {
    try {
      const stored = localStorage.getItem("coursezy_cart_items");
      return stored ? JSON.parse(stored) : [];
    } catch (_) {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCartCheckout, setIsCartCheckout] = useState(false);

  // Wishlist and Cart methods
  const toggleLike = (productId: string) => {
    setLikedIds(prev => {
      const next = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      localStorage.setItem("coursezy_liked_ids", JSON.stringify(next));
      return next;
    });
  };

  const isLiked = (productId: string) => likedIds.includes(productId);

  const addToCart = (product: DigitalProduct) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      let next: CartItemState[];
      if (existing) {
        next = prev.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        next = [...prev, { productId: product.id, quantity: 1 }];
      }
      localStorage.setItem("coursezy_cart_items", JSON.stringify(next));
      return next;
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    setCart(prev => {
      let next: CartItemState[];
      if (quantity <= 0) {
        next = prev.filter(item => item.productId !== productId);
      } else {
        next = prev.map(item =>
          item.productId === productId ? { ...item, quantity } : item
        );
      }
      localStorage.setItem("coursezy_cart_items", JSON.stringify(next));
      return next;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const next = prev.filter(item => item.productId !== productId);
      localStorage.setItem("coursezy_cart_items", JSON.stringify(next));
      return next;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("coursezy_cart_items");
  };

  const isInCart = (productId: string) => cart.some(item => item.productId === productId);
  const getCartQuantity = (productId: string) => cart.find(item => item.productId === productId)?.quantity || 0;

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const activeCartItems = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return {
      product,
      quantity: item.quantity
    };
  }).filter(item => item.product !== undefined) as { product: DigitalProduct; quantity: number }[];

  const cartTotalSum = activeCartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  // Sandbox Checkout Form states
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3>(1);
  const [billingName, setBillingName] = useState("Alpha Learner");
  const [billingEmail, setBillingEmail] = useState(userEmail);
  const [cardNumber, setCardNumber] = useState("4111 2222 3333 4444");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvv, setCardCvv] = useState("123");
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastTxId, setLastTxId] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const categories: (ProductCategory | 'All')[] = ['All', 'E-Book', 'Template', 'Mini-Course', 'Checklist', 'Backlinks'];

  // Filtered lists
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleStartCheckout = (product: DigitalProduct) => {
    setSelectedProduct(null); // Close main info modal
    setIsCartCheckout(false);
    setCheckoutProduct(product);
    setCheckStepAndMeta();
  };

  const handleStartCartCheckout = () => {
    if (activeCartItems.length === 0) return;
    setIsCartOpen(false);
    setIsCartCheckout(true);
    setCheckoutProduct(activeCartItems[0].product);
    setCheckStepAndMeta();
  };

  const setCheckStepAndMeta = () => {
    setCheckoutStep(1);
    setLastTxId("TX-" + Math.floor(Math.random() * 900000 + 100000));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkoutStep === 1) {
      setCheckoutStep(2);
    }
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setCheckoutStep(3);
      if (isCartCheckout) {
        activeCartItems.forEach(item => {
          onPurchaseComplete(item.product.id, item.product.price * item.quantity);
        });
        clearCart();
      } else if (checkoutProduct) {
        onPurchaseComplete(checkoutProduct.id, checkoutProduct.price);
      }
    }, 1800);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 text-slate-200" id="storefront-container">
      
      {/* Hero Section */}
      <section className="mb-12 rounded-xl overflow-hidden border border-white/5 bg-gradient-to-b from-[#111111] to-[#0A0A0A] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-12 text-left shadow-2xl">
        <div className="flex-1 space-y-4">
          <span className="text-amber-500 uppercase tracking-[0.25em] text-[10px] font-bold block">
            Digital Products for Modern Creators
          </span>
          <h1 className="text-3xl md:text-5xl font-['Arial',sans-serif] text-white leading-tight font-bold tracking-tight">
            Grow Your Skills with <span className="text-amber-500 font-serif italic font-normal">Premium Resources</span> Designed For Creators And Freelancers.
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-lg font-light leading-relaxed">
            Premium ebooks, Notion templates, and specialized guides designed to accelerate your creative workflow and income.
          </p>
        </div>
        <div className="w-full md:w-2/5 h-56 bg-slate-950 rounded-lg relative overflow-hidden shrink-0 border border-white/5 shadow-inner">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#1e293b_0%,#0a0a0a_100%)] opacity-85"></div>
          <div className="absolute inset-0 w-full h-full" id="featured-video-embed">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/_WS9fpJBpek?autoplay=1&mute=1&loop=1&playlist=_WS9fpJBpek"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              referrerPolicy="no-referrer"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar with Stats row combined */}
      <div className="mb-10 mt-12 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between border-b border-t border-white/5 py-8" id="filter-bar">
        {/* Category Pill Sliders */}
        <div className="flex flex-nowrap overflow-x-auto gap-2 pb-2 pt-1 items-center max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer border shrink-0 whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-amber-500/10 border-amber-500 text-amber-500"
                  : "bg-transparent border-white/10 text-slate-400 hover:text-white hover:border-white/30"
              }`}
            >
              {cat === 'All' ? 'All Assets' : cat + 's'}
            </button>
          ))}
        </div>

        {/* Search Field & Stats Group */}
        <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
          {/* Quick Stats in line with prompt specifications */}
          <div className="hidden sm:flex items-center gap-6 shrink-0">
            <div className="text-left">
              <div className="text-white font-serif italic text-base">14.2k+</div>
              <div className="text-[9px] text-slate-500 uppercase tracking-widest leading-none mt-0.5">Assets Sold</div>
            </div>
            <div className="h-6 w-px bg-white/10"></div>
            <div className="text-left">
              <div className="text-white font-serif italic text-base">4.9/5</div>
              <div className="text-[9px] text-slate-500 uppercase tracking-widest leading-none mt-0.5">Average Rating</div>
            </div>
            <div className="h-6 w-px bg-white/10"></div>
          </div>

          {/* Quick Currency Switcher Option */}
          <div className="flex bg-[#111111] rounded border border-white/10 p-0.5 shrink-0" id="storefront-currency-selector">
            <button 
              onClick={() => onCurrencyChange('USD')}
              className={`px-2.5 py-1 rounded text-[10px] font-mono transition-all uppercase tracking-wider font-bold ${
                currency === 'USD' 
                  ? "bg-amber-500 text-black font-semibold" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Change price display to USD ($)"
            >
              $ USD
            </button>
            <button 
              onClick={() => onCurrencyChange('INR')}
              className={`px-2.5 py-1 rounded text-[10px] font-mono transition-all uppercase tracking-wider font-bold ${
                currency === 'INR' 
                  ? "bg-amber-500 text-black font-semibold" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Change price display to Indian Rupees (₹)"
            >
              ₹ INR
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute top-3 left-3 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search assets, ebooks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-white/10 bg-[#0F0F0F] py-2.5 pr-4 pl-10 text-xs text-slate-200 focus:border-amber-500 focus:outline-none placeholder-slate-500 transition-all font-mono"
            />
          </div>
        </div>
      </div>

      {/* Grid of Digital Products */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 py-16 text-center bg-[#0F0F0F]" id="empty-state">
          <ShoppingBag className="mx-auto h-12 w-12 text-slate-600 animate-pulse" />
          <h3 className="mt-4 text-base font-serif italic text-white text-lg">No assets found</h3>
          <p className="mt-2 text-xs text-slate-500 max-w-xs mx-auto">
            We couldn't find any matches for "{searchQuery}". Try updating filters or search terms.
          </p>
        </div>
      ) : (
        <div className="grid gap-0 border border-white/5 bg-[#0A0A0A] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12" id="product-grid">
          {filteredProducts.map((p) => {
            const hasPurchased = purchasedIds.includes(p.id);
            return (
              <motion.div
                key={p.id}
                layout
                className="group relative flex flex-col justify-between p-6 border border-white/5 hover:bg-white/[0.015] transition-all duration-300"
                id={`card-${p.id}`}
              >
                <div>
                  {/* Aspect image module with elegant styling */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#0A0A0A] rounded border border-white/5 shadow-2xl mb-5 flex items-center justify-center p-4">
                    <img
                      src={p.coverImage}
                      alt={p.title}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 h-full w-full object-cover opacity-85 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                    />
                    
                    {/* Dark gradient overlay for text readability over high quality visible images */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/60 z-[5]" />
                    
                    <div className="relative z-10 text-center flex flex-col items-center justify-center pointer-events-none px-4">
                      <span className="text-[8px] tracking-[0.2em] font-mono text-amber-500 uppercase font-black mb-2 px-2 py-0.5 bg-amber-500/10 rounded">
                        {p.category}
                      </span>
                      <h5 className="font-serif italic text-lg text-slate-100 font-medium leading-snug line-clamp-2">
                        {p.title}
                      </h5>
                    </div>

                    {p.badge && (
                      <span className="absolute top-3 left-3 z-10 rounded-sm bg-amber-500 px-2 py-0.5 text-[9px] font-extrabold text-black uppercase tracking-wider font-sans">
                        {p.badge}
                      </span>
                    )}

                    {/* Floating interactive buttons over the image */}
                    <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
                      {/* Like Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(p.id);
                        }}
                        className={`group/like flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300 cursor-pointer ${
                          isLiked(p.id)
                            ? "bg-red-500/20 border-red-500/40 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.25)]"
                            : "bg-black/60 border-white/10 text-slate-300 hover:text-red-400 hover:border-red-400/30 hover:scale-105"
                        }`}
                        title={isLiked(p.id) ? "Unlike Asset" : "Like Asset"}
                      >
                        <Heart
                          className={`h-4 w-4 transition-transform duration-300 ${
                            isLiked(p.id)
                              ? "fill-red-500 text-red-500 scale-105"
                              : "group-hover/like:scale-110"
                          }`}
                        />
                      </button>

                      {/* Add to Cart Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (hasPurchased) return;
                          addToCart(p);
                        }}
                        disabled={hasPurchased}
                        className={`group/cart flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300 ${
                          hasPurchased
                            ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-500/40 cursor-not-allowed opacity-40"
                            : isInCart(p.id)
                            ? "bg-amber-500/20 border-amber-500/40 text-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.25)] cursor-pointer"
                            : "bg-black/60 border-white/10 text-slate-300 hover:text-amber-500 hover:border-amber-500/30 hover:scale-105 cursor-pointer"
                        }`}
                        title={hasPurchased ? "Already Owned" : isInCart(p.id) ? "Add another to Cart" : "Add to Cart"}
                      >
                        {isInCart(p.id) ? (
                          <span className="text-[10px] font-mono font-bold text-amber-400">
                            {getCartQuantity(p.id)}x
                          </span>
                        ) : (
                          <Plus className="h-4 w-4 transition-transform duration-300 group-hover/cart:rotate-90" />
                        )}
                      </button>
                    </div>

                    {/* Quick View Button on Hover */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-25">
                      <button 
                        onClick={() => setSelectedProduct(p)}
                        className="cursor-pointer flex items-center gap-1.5 rounded bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-black shadow-md transition hover:scale-105"
                      >
                        <Eye className="h-3.5 w-3.5" /> View Details
                      </button>
                    </div>
                  </div>

                  {/* Text details */}
                  <div className="mb-2 flex items-center justify-between text-[10px] text-slate-500 font-mono uppercase tracking-wide">
                    <span>By {p.author}</span>
                  </div>
                  <h4 className="font-serif text-lg text-white font-normal italic line-clamp-1 group-hover:text-amber-500 transition-colors">
                    {p.title}
                  </h4>
                  <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed font-light">
                    {p.tagline}
                  </p>

                  {/* Rating / Sales */}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[11px]">
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                      <span className="font-bold text-slate-200">{p.rating.toFixed(1)}</span>
                      <span className="text-slate-500">({p.reviewsCount})</span>
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">{p.salesCount} sold</span>
                  </div>
                </div>

                {/* Buy Section */}
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex flex-col text-left">
                    <span className="font-mono text-base font-bold text-amber-500">
                      {p.price === 0 ? "FREE" : formatPrice(p.price, currency)}
                    </span>
                    {p.price > 0 && (
                      <span className="font-mono text-[9px] text-slate-500 mt-0.5">
                        {currency === 'USD' ? `or ${formatPrice(p.price, 'INR')}` : `or ${formatPrice(p.price, 'USD')}`}
                      </span>
                    )}
                  </div>

                  {hasPurchased ? (
                    <span className="rounded-sm bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[9px] uppercase tracking-wider font-extrabold text-emerald-400">
                      Owned
                    </span>
                  ) : (
                    <button
                      onClick={() => handleStartCheckout(p)}
                      className="cursor-pointer inline-flex items-center justify-center text-center rounded-sm bg-white text-black hover:bg-amber-500 hover:text-black font-extrabold uppercase tracking-tight text-[10px] px-3.5 py-1.5 transition-all duration-300"
                    >
                      Buy Now
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Dynamic Key Benefits highlights right below products */}
      <div className="mt-8 mb-16 grid grid-cols-1 md:grid-cols-2 gap-6" id="key-benefits-highlights">
        {/* Tamil Explanation */}
        <div className="relative group overflow-hidden rounded-xl border border-white/5 bg-gradient-to-br from-[#0c0f16] via-[#050508] to-[#010101] p-6 hover:border-amber-500/20 transition-all duration-300" id="highlight-tamil-explanation">
          <div className="absolute top-0 right-0 h-24 w-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors pointer-events-none" />
          <div className="flex items-start gap-4">
            <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded bg-amber-500/10 border border-amber-500/20 text-amber-500 font-bold text-lg select-none">
              TM
            </div>
            <div>
              <h4 className="text-base font-sans font-bold text-white tracking-wide">Tamil Explanation</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed font-light">
                Complex concepts explained in simple, native Tamil for better understanding.
              </p>
            </div>
          </div>
        </div>

        {/* Lifetime Access */}
        <div className="relative group overflow-hidden rounded-xl border border-white/5 bg-gradient-to-br from-[#0c0f16] via-[#050508] to-[#010101] p-6 hover:border-amber-500/20 transition-all duration-300" id="highlight-lifetime-access">
          <div className="absolute top-0 right-0 h-24 w-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors pointer-events-none" />
          <div className="flex items-start gap-4">
            <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded bg-amber-500/10 border border-amber-500/20 text-amber-500 font-sans text-2xl select-none leading-none">
              ∞
            </div>
            <div>
              <h4 className="text-base font-sans font-bold text-white tracking-wide">Lifetime Access</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed font-light">
                Learn at your own pace with lifetime access to all products and course and updates.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic CTA Banner Section */}
      <div className="mt-16 rounded-xl border border-white/5 bg-gradient-to-br from-[#0c0f16] via-[#050508] to-[#010101] p-6 sm:p-10 relative overflow-hidden" id="creator-success-banner">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[#0A0A0A]/40 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
        <div className="absolute top-0 right-0 h-96 w-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-96 w-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* LEFT PORTION: GROW YOUR ONLINE PRESENCE */}
            <div className="lg:col-span-8 text-left flex flex-col justify-between h-full space-y-6">
              
              {/* Marketing Headings */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  <span className="text-[10px] sm:text-xs font-mono tracking-[0.25em] text-amber-500/90 uppercase font-black">
                    Grow Your Online Presence
                  </span>
                </div>
                
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-sans text-white leading-none font-extrabold tracking-tight">
                  WITH HIGH QUALITY <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-200">DIGITAL PRODUCTS</span>
                </h3>

                {/* Blue Subheading highlight banner */}
                <div className="mt-4 inline-block bg-blue-600/10 border border-blue-500/30 px-4 py-1.5 rounded">
                  <span className="text-[11px] sm:text-xs text-blue-400 font-mono uppercase tracking-[0.16em] font-bold">
                    BOOST RANKINGS • SAVE TIME • GROW FASTER
                  </span>
                </div>
              </div>

              {/* Three Product Pillars Showcase (Backlinks, Templates, Ebooks) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                
                {/* Backlinks */}
                <div className="bg-[#0f111a] border border-blue-500/10 p-4 rounded-lg flex flex-col justify-between hover:border-blue-500/35 transition-all">
                  <div>
                    <div className="h-10 w-10 flex items-center justify-center rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3 select-none">
                      <Link className="h-5 w-5" />
                    </div>
                    <h4 className="text-xs font-mono font-bold tracking-widest text-blue-400 uppercase">Backlinks</h4>
                    <p className="text-[10px] text-slate-400 mt-1 mb-3">High Quality Backlinks</p>
                    <ul className="space-y-1.5">
                      {["Improve SEO Rankings", "Increase Domain Authority", "100% Safe & White Hat", "Fast & Reliable Results"].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1 text-[9px] text-slate-300">
                          <CheckCircle className="h-3 w-3 text-blue-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Templates */}
                <div className="bg-[#12101a] border border-purple-500/10 p-4 rounded-lg flex flex-col justify-between hover:border-purple-500/35 transition-all">
                  <div>
                    <div className="h-10 w-10 flex items-center justify-center rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-3 select-none">
                      <FileText className="h-5 w-5" />
                    </div>
                    <h4 className="text-xs font-mono font-bold tracking-widest text-purple-400 uppercase">Templates</h4>
                    <p className="text-[10px] text-slate-400 mt-1 mb-3">Premium Templates</p>
                    <ul className="space-y-1.5">
                      {["Save Time & Effort", "Professional Designs", "Editable & Easy to Use", "For All Your Needs"].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1 text-[9px] text-slate-300">
                          <CheckCircle className="h-3 w-3 text-purple-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Ebooks */}
                <div className="bg-[#101411] border border-emerald-500/10 p-4 rounded-lg flex flex-col justify-between hover:border-emerald-500/35 transition-all">
                  <div>
                    <div className="h-10 w-10 flex items-center justify-center rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3 select-none">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <h4 className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">Ebooks</h4>
                    <p className="text-[10px] text-slate-400 mt-1 mb-3">Expert Ebooks</p>
                    <ul className="space-y-1.5">
                      {["In-Depth Knowledge", "Step-by-Step Guides", "Boost Skills & Growth", "Lifetime Value"].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1 text-[9px] text-slate-300">
                          <CheckCircle className="h-3 w-3 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>

              {/* Four Trust Badges Core Row at bottom of Left Side */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 bg-white/[0.02] border border-white/5 p-2 rounded">
                  <Shield className="h-3.5 w-3.5 text-amber-500" />
                  <span className="text-[9px] text-white font-mono uppercase tracking-wider font-semibold font-bold">100% Safe</span>
                </div>
                <div className="flex items-center gap-2 bg-white/[0.02] border border-white/5 p-2 rounded">
                  <Zap className="h-3.5 w-3.5 text-amber-500" />
                  <span className="text-[9px] text-white font-mono uppercase tracking-wider font-semibold font-bold">Fast Delivery</span>
                </div>
                <div className="flex items-center gap-2 bg-white/[0.02] border border-white/5 p-2 rounded">
                  <Award className="h-3.5 w-3.5 text-amber-500" />
                  <span className="text-[9px] text-white font-mono uppercase tracking-wider font-semibold font-bold">Premium Quality</span>
                </div>
                <div className="flex items-center gap-2 bg-white/[0.02] border border-white/5 p-2 rounded">
                  <Flame className="h-3.5 w-3.5 text-amber-500" />
                  <span className="text-[9px] text-white font-mono uppercase tracking-wider font-semibold font-bold">24/7 Support</span>
                </div>
              </div>

            </div>

            {/* RIGHT PORTION: HARIDEV AND CONVERSION OPT-IN */}
            <div className="lg:col-span-4 flex flex-col justify-between h-full space-y-6">
              
              {/* Image Frame with beautiful styling of founder */}
              <div className="relative group rounded-xl overflow-hidden border border-amber-500/10 bg-[#050505] p-3 flex flex-col items-center">
                <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-black pointer-events-none z-10 rounded-xl" />
                
                {/* Glowing Aura backdrop */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-44 w-44 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-all pointer-events-none" />

                {/* Haridev Image */}
                <div className="relative h-64 w-full rounded-lg overflow-hidden border border-white/5 bg-[#111111]">
                  <img 
                    src="/src/assets/images/haridev_new_founder_1780006360370.png" 
                    alt="Haridev, Founder of Coursezy" 
                    className="h-full w-full object-cover group-hover:scale-105 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Floating Customer Rating */}
                  <div className="absolute top-3 right-3 z-20 bg-black/80 backdrop-blur-md rounded border border-amber-500/30 p-2 text-right">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 block font-bold">Trusted Globally</span>
                    <div className="flex text-amber-500 gap-0.5 text-[10px] mt-0.5">
                      {"★".repeat(5)}
                    </div>
                  </div>
                </div>

                {/* Founder Info & Short Quote block */}
                <div className="mt-4 w-full text-center relative z-20">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-mono tracking-widest text-amber-500 uppercase font-black leading-snug">
                      Learn from a Seasoned Expert with 10+ Years Experience
                    </span>
                    <span className="text-[9px] font-mono uppercase text-slate-500 mt-1">Founder of Coursezy</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-light mt-3.5 max-w-sm mx-auto leading-relaxed px-3">
                    Hi, I'm HariDev — Graphics Designer, Video Editor, and Motion Graphics Artist with over a decade of creative experience. I'm the founder of coursezy, a top-tier training institute that has mentored 1000+ students. My mission is to make high-quality design and templates editing education accessible to everyone.
                  </p>
                </div>
              </div>

              {/* Order Now Call-To-Action Box styled as "LEVEL UP YOUR WEBSITE - ORDER NOW!" */}
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg p-4 text-center border border-amber-400/20 shadow-lg shadow-amber-500/10 flex flex-col justify-center items-center">
                <span className="text-[9px] font-mono font-bold uppercase tracking-[0.25em] text-amber-950">Level Up Your Website</span>
                <h4 className="text-xl font-sans font-black uppercase text-black leading-none mt-1 select-none">
                  ORDER NOW!
                </h4>
                
                <button 
                  onClick={() => {
                    const searchInput = document.querySelector('input[placeholder*="Search assets"]') as HTMLInputElement;
                    if (searchInput) {
                      searchInput.focus();
                      searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }}
                  className="mt-3 cursor-pointer w-full inline-flex items-center justify-center gap-2 rounded-sm bg-black hover:bg-white text-white hover:text-black font-extrabold uppercase tracking-widest text-[10px] px-4 py-2 transition-all duration-300"
                >
                  <span>Browse 100+ Premium Assets</span>
                  <ArrowRight className="h-3 w-3 shrink-0" />
                </button>
              </div>

            </div>

          </div>

          {/* Testimonies / Trust Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10 pt-10 border-t border-white/5 w-full text-left" id="creator-testimonials-grid">
            <div className="bg-[#0c0c0c] border border-white/[0.03] p-5 rounded-lg flex flex-col justify-between hover:border-amber-500/10 transition-colors">
              <div>
                <div className="flex text-amber-500 gap-0.5 text-xs mb-3">
                  {"★".repeat(5)}
                </div>
                <p className="text-white/90 text-xs leading-relaxed font-light">
                  “Premium feel at a very low price. Highly impressed!”
                </p>
              </div>
              <span className="text-[9px] font-mono text-slate-500 uppercase mt-4 block">Verified Purchase</span>
            </div>

            <div className="bg-[#0c0c0c] border border-white/[0.03] p-5 rounded-lg flex flex-col justify-between hover:border-amber-500/10 transition-colors">
              <div>
                <div className="flex text-amber-500 gap-0.5 text-xs mb-3">
                  {"★".repeat(5)}
                </div>
                <p className="text-white/90 text-xs leading-relaxed font-light">
                  “Everything is well designed and very easy to customize.”
                </p>
              </div>
              <span className="text-[9px] font-mono text-slate-500 uppercase mt-4 block">Customizable Theme</span>
            </div>

            <div className="bg-[#0c0c0c] border border-amber-500/10 p-5 rounded-lg flex flex-col justify-between hover:border-amber-500/20 transition-colors relative overflow-hidden group">
              <div className="absolute top-0 right-0 h-16 w-16 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-colors" />
              <div>
                <div className="flex text-amber-500 gap-0.5 text-xs mb-3">
                  {"★".repeat(5)}
                </div>
                <p className="text-[#d6d2ca] text-xs leading-normal font-semibold">
                  Affordable Premium Products With Lifetime Access Included
                </p>
              </div>
              <span className="text-[9px] font-mono text-amber-500 uppercase mt-4 block font-bold">Lifetime Value</span>
            </div>

            <div className="bg-[#0c0c0c] border border-white/[0.03] p-5 rounded-lg flex flex-col justify-between hover:border-amber-500/10 transition-colors">
              <div>
                <div className="flex text-amber-500 gap-0.5 text-xs mb-3">
                  {"★".repeat(5)}
                </div>
                <p className="text-white/90 text-xs leading-relaxed font-light">
                  “Outstanding experience! The templates saved me so much time.”
                </p>
              </div>
              <span className="text-[9px] font-mono text-slate-500 uppercase mt-4 block">Verified Review</span>
            </div>
          </div>
          
          {/* Banner bottom inline tagline */}
          <div className="mt-8 pt-4 border-t border-white/[0.02] flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[9px] font-mono text-slate-500 uppercase tracking-widest text-center select-none">
            <span>Backlinks That Rank</span>
            <span className="text-white/10 hidden sm:inline">|</span>
            <span>Templates That Impress</span>
            <span className="text-white/10 hidden sm:inline">|</span>
            <span>Ebooks That Empower</span>
          </div>
          
        </div>
      </div>

      {/* Got Questions? FAQ Section */}
      <div className="mt-16 rounded-xl border border-white/5 bg-gradient-to-br from-[#0c0f16] via-[#050508] to-[#010101] p-6 sm:p-10 relative overflow-hidden" id="faq-section">
        {/* Subtle background patterns */}
        <div className="absolute inset-0 bg-[#0A0A0A]/40 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center mb-10">
          <div className="flex items-center gap-2 mb-3 justify-center">
            <HelpCircle className="h-4 w-4 text-amber-500 animate-pulse" />
            <span className="text-[10px] sm:text-xs font-mono tracking-[0.25em] text-slate-400 uppercase font-bold">
              Frequently Asked Questions
            </span>
          </div>
          
          <h3 className="text-3xl sm:text-4xl font-sans text-white leading-tight font-extrabold tracking-tight">
            Got <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-200">Questions?</span>
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm mt-3 font-light">
            Everything you need to know about the products.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="relative z-10 max-w-3xl mx-auto space-y-4" id="faq-accordion-list">
          {[
            {
              q: "How do I access the products?",
              a: "Instantly! After payment, you'll receive an email with login credentials to our premium learning portal. You can access it on your laptop, tablet, or smartphone."
            },
            {
              q: "Is it lifetime access?",
              a: "Yes. Once you buy, you have lifetime access to all templates and future updates at no extra cost. No monthly subscriptions."
            },
            {
              q: "What language is used?",
              a: "The course is taught in simple Tamil, making it easy for everyone to understand complex technical terms without any language barrier."
            }
          ].map((item, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div 
                key={index} 
                className={`rounded-lg border transition-all duration-300 overflow-hidden ${
                  isOpen 
                    ? "border-amber-500/30 bg-[#0e111a]" 
                    : "border-white/5 bg-[#050508] hover:border-white/10"
                }`}
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left transition-colors cursor-pointer"
                >
                  <span className="text-sm font-sans font-bold text-white tracking-wide pr-4">
                    {item.q}
                  </span>
                  <div className={`shrink-0 h-6 w-6 rounded-full flex items-center justify-center bg-white/[0.02] border border-white/5 transition-transform duration-300 ${isOpen ? "rotate-180 text-amber-500 border-amber-500/20" : "text-slate-400"}`}>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, cubicBezier: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-5 pb-5 pt-1 border-t border-white/[0.03]">
                        {/* The styled ↓ arrow indicator asked by user request */}
                        <div className="flex items-center gap-2 text-amber-500/80 mb-2 font-mono text-xs select-none">
                          <span>↓</span>
                          <span className="text-[9px] uppercase tracking-widest text-slate-500">Answer</span>
                        </div>
                        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-light">
                          {item.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>



      {/* PRODUCT DETAILS MODAL */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 overflow-y-auto" id="product-details-modal">
            <div 
              className="fixed inset-0 bg-black/80 backdrop-blur-md" 
              onClick={() => setSelectedProduct(null)} 
            />

            <div className="flex min-h-screen items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="relative w-full max-w-3xl overflow-hidden rounded-xl bg-[#0F0F0F] border border-white/15 text-slate-200 shadow-2xl"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#0A0A0A] border border-white/10 text-slate-400 hover:text-white transition"
                >
                  &times;
                </button>

                {/* Hero aspect */}
                <div className="relative aspect-video w-full bg-[#0A0A0A] sm:aspect-[2.2/1] border-b border-white/5">
                  <img
                    src={selectedProduct.coverImage}
                    alt={selectedProduct.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/30 to-transparent flex items-end p-8">
                    <div>
                      <span className="rounded bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 text-[9px] font-bold text-amber-500 uppercase tracking-widest font-mono">
                        {selectedProduct.category}
                      </span>
                      <h3 className="mt-3 text-2xl font-serif text-white italic font-normal leading-tight">
                        {selectedProduct.title}
                      </h3>
                      <p className="text-xs text-slate-300 mt-1 max-w-xl font-light leading-relaxed">{selectedProduct.tagline}</p>
                    </div>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-6 md:p-8 space-y-6">
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-2 space-y-6">
                      <div>
                        <h5 className="font-serif text-base italic text-white border-b border-white/5 pb-2 mb-3">Product Description</h5>
                        <div className="text-xs text-slate-300 leading-relaxed font-light space-y-3">
                          <p className="whitespace-pre-line">{selectedProduct.description || "Master these valuable technical micro-skills instantly inside a simplified visual module. Designed for quick references and actionable deployment."}</p>
                          
                          {selectedProduct.chapters && selectedProduct.chapters.length > 0 && (
                            <div className="pt-2">
                              <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400 mb-2 font-bold">Chapters Included in Asset:</p>
                              <ul className="space-y-1.5 pl-1">
                                {selectedProduct.chapters.map((ch, idx) => (
                                  <li key={idx} className="flex gap-2 items-start text-xs text-slate-300">
                                    <span className="text-amber-500 font-mono">•</span>
                                    <span><strong className="text-white font-medium">{ch.title}</strong> - {ch.summary}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Display Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {selectedProduct.tags.map(tag => (
                          <span key={tag} className="rounded-sm bg-white/[0.03] border border-white/5 px-2.5 py-1 text-[10px] font-mono text-slate-400">
                            #{tag.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Pricing Segment */}
                    <div className="rounded-lg border border-white/5 bg-[#0A0A0A] p-5 flex flex-col justify-between h-fit space-y-6">
                      <div>
                        <span className="text-[9px] uppercase font-mono font-bold tracking-widest text-slate-500 block">Fixed Cost</span>
                        <div className="mt-1 flex items-baseline gap-2">
                          <span className="text-3xl font-mono font-bold text-amber-500">{formatPrice(selectedProduct.price, currency)}</span>
                          {selectedProduct.price > 0 && (
                            <span className="font-mono text-xs text-slate-400">
                              (or {currency === 'USD' ? formatPrice(selectedProduct.price, 'INR') : formatPrice(selectedProduct.price, 'USD')})
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-[10px] text-slate-400 leading-normal">Instant download securely compiled inside your web customer vault library.</p>
                      </div>

                      <div className="space-y-3">
                        {purchasedIds.includes(selectedProduct.id) ? (
                          <div className="w-full text-center rounded bg-emerald-500/10 border border-emerald-500/20 py-2.5 text-xs font-bold text-emerald-400 font-mono uppercase tracking-wider">
                            Already Owned
                          </div>
                        ) : (
                          <button
                            onClick={() => handleStartCheckout(selectedProduct)}
                            className="w-full rounded bg-amber-500 text-black hover:bg-amber-600 py-2.5 text-center text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            Buy Now <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
                          </button>
                        )}
                        <span className="block text-center text-[9px] font-mono text-slate-500 uppercase tracking-widest">🔒 Secure SSL Verification</span>
                      </div>
                    </div>
                  </div>

                  {/* Simple Reviews Inside detail */}
                  <div className="pt-6 border-t border-white/5">
                    <h5 className="font-serif italic text-base text-white mb-4 flex items-center gap-1.5">
                      Customer Reviews <span className="text-xs font-sans font-medium text-amber-500">({selectedProduct.reviewsCount})</span>
                    </h5>
                    <div className="space-y-3">
                      {MOCK_REVIEWS.map((r, i) => (
                        <div key={r.id || i} className="bg-[#0A0A0A] p-4 rounded border border-white/5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white">{r.author}</span>
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: r.rating }).map((_, rIdx) => (
                                <Star key={rIdx} className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
                              ))}
                            </div>
                          </div>
                          <p className="mt-1.5 text-xs text-slate-400 font-light leading-relaxed">"{r.comment}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* SECURE CHECKOUT FLOW MODAL */}
      <AnimatePresence>
        {checkoutProduct && (
          <div className="fixed inset-0 z-50 overflow-y-auto" id="checkout-modal">
            <div className="fixed inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setCheckoutProduct(null)} />

            <div className="flex min-h-screen items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-lg overflow-hidden rounded-xl bg-[#0F0F0F] text-slate-200 border border-white/10 shadow-2xl"
              >
                {/* Header aspect */}
                <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between bg-[#0A0A0A]">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                      <Lock className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-serif text-sm font-normal italic text-white">Secure Sandbox Checkout</h4>
                      <p className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">Coursezy Certified Encrypt</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      if (!isProcessing) setCheckoutProduct(null);
                    }}
                    disabled={isProcessing}
                    className="text-slate-400 hover:text-white disabled:opacity-50 cursor-pointer text-xl"
                  >
                    &times;
                  </button>
                </div>

                {/* Checkout Navigation Steps Indicator */}
                <div className="bg-[#0A0A0A]/50 py-3 px-6 border-b border-white/5 flex items-center justify-between">
                  <div className="flex gap-4 text-[10px] uppercase font-mono tracking-wider font-semibold">
                    <span className={checkoutStep === 1 ? "text-amber-500" : "text-slate-500"}>1. Billing</span>
                    <span className="text-white/10">/</span>
                    <span className={checkoutStep === 2 ? "text-amber-500" : "text-slate-500"}>2. Payment</span>
                    <span className="text-white/10">/</span>
                    <span className={checkoutStep === 3 ? "text-amber-500" : "text-slate-500"}>3. Completed</span>
                  </div>
                  <span className="text-xs font-mono text-white">Total: <strong className="text-amber-500">{isCartCheckout ? formatPrice(cartTotalSum, currency) : formatPrice(checkoutProduct.price, currency)}</strong></span>
                </div>

                {/* Checkout Content Panels */}
                <div className="p-6">
                  {checkoutStep === 1 && (
                    <form onSubmit={handleNextStep} className="space-y-4">
                      <div className="space-y-1">
                        <h5 className="font-serif italic text-white text-base">Confirm Billing Details</h5>
                        <p className="text-xs text-slate-400">Your secure downloadable access link will align with this profile.</p>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">Full Name</label>
                        <input
                          type="text"
                          required
                          value={billingName}
                          onChange={(e) => setBillingName(e.target.value)}
                          className="w-full rounded border border-white/10 bg-[#0A0A0A] text-slate-200 px-3.5 py-2 text-xs focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">Email Delivery Address</label>
                        <input
                          type="email"
                          required
                          value={billingEmail}
                          onChange={(e) => setBillingEmail(e.target.value)}
                          className="w-full rounded border border-white/10 bg-[#0A0A0A] text-slate-200 px-3.5 py-2 text-xs focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      {/* Purchased Summary info */}
                      {isCartCheckout ? (
                        <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                          {activeCartItems.map((item) => (
                            <div key={item.product.id} className="bg-[#0A0A0A] rounded border border-white/5 p-2.5 flex gap-3 items-center justify-between">
                              <div className="flex gap-2.5 items-center min-w-0">
                                <img 
                                  src={item.product.coverImage} 
                                  alt="" 
                                  className="h-8 w-11 object-cover rounded opacity-100 shrink-0" 
                                />
                                <div className="min-w-0">
                                  <p className="text-xs font-serif italic text-white truncate">{item.product.title}</p>
                                  <p className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">{item.product.category}</p>
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-xs font-mono text-amber-500 block font-semibold">{formatPrice(item.product.price, currency)}</span>
                                <span className="text-[9px] font-mono text-slate-500">Qty: {item.quantity}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-[#0A0A0A] rounded border border-white/5 p-3 flex gap-3 items-center">
                          <img 
                            src={checkoutProduct.coverImage} 
                            alt="" 
                            className="h-10 w-14 object-cover rounded opacity-100" 
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-serif italic text-white truncate">{checkoutProduct.title}</p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">{checkoutProduct.category}</p>
                          </div>
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full rounded bg-amber-500 text-black hover:bg-amber-600 py-3 text-center text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        Continue to Card Setup <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                      </button>
                    </form>
                  )}

                  {checkoutStep === 2 && (
                    <form onSubmit={handlePay} className="space-y-4">
                      {/* Interactive Credit Card Widget Representation styled perfectly dark */}
                      <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-white/10 p-5 text-white shadow-2xl">
                        <div className="absolute top-0 right-0 h-28 w-28 -translate-y-6 translate-x-6 rounded-full bg-amber-500/[0.03] border border-amber-500/[0.05]" />
                        <div className="flex justify-between items-start">
                          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-amber-500 font-bold">Secure Sandbox Vault</span>
                          <CreditCard className="h-5 w-5 text-amber-500" />
                        </div>
                        <div className="mt-6 mb-4 font-mono text-base font-light tracking-[0.15em] text-slate-200">
                          {cardNumber}
                        </div>
                        <div className="flex justify-between items-end">
                          <div>
                            <span className="text-[8px] uppercase tracking-wider text-slate-500 font-mono">Card Holder</span>
                            <p className="font-sans text-xs font-semibold truncate max-w-[150px] text-slate-300">{billingName || 'Alpha Learner'}</p>
                          </div>
                          <div className="flex gap-4">
                            <div>
                              <span className="text-[8px] uppercase tracking-wider text-slate-500 font-mono">Expiry</span>
                              <p className="font-mono text-xs font-bold text-slate-300">{cardExpiry || 'MM/YY'}</p>
                            </div>
                            <div>
                              <span className="text-[8px] uppercase tracking-wider text-slate-500 font-mono">CVV</span>
                              <p className="font-mono text-xs font-bold text-slate-300">{cardCvv ? '•••' : '123'}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Inputs */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-3 space-y-1">
                          <label className="block text-[9px] font-mono font-bold tracking-wider text-slate-500 uppercase">Card Number</label>
                          <input
                            type="text"
                            required
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="4111 2222 3333 4444"
                            className="w-full rounded border border-white/10 bg-[#0A0A0A] text-slate-200 px-3.5 py-2 text-xs focus:border-amber-500 focus:outline-none placeholder-slate-600"
                          />
                        </div>
                        <div className="col-span-2 space-y-1">
                          <label className="block text-[9px] font-mono font-bold tracking-wider text-slate-500 uppercase">Expiration</label>
                          <input
                            type="text"
                            required
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM/YY"
                            className="w-full rounded border border-white/10 bg-[#0A0A0A] text-slate-200 px-3.5 py-2 text-xs focus:border-amber-500 focus:outline-none placeholder-slate-600"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[9px] font-mono font-bold tracking-wider text-slate-500 uppercase">CVV</label>
                          <input
                            type="password"
                            required
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="123"
                            maxLength={4}
                            className="w-full rounded border border-white/10 bg-[#0A0A0A] text-slate-200 px-3.5 py-2 text-xs focus:border-amber-500 focus:outline-none placeholder-slate-700"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setCheckoutStep(1)}
                          disabled={isProcessing}
                          className="px-4 py-2 bg-[#0A0A0A] border border-white/10 text-slate-400 rounded text-xs font-bold uppercase tracking-wider hover:text-white disabled:opacity-50 cursor-pointer flex items-center gap-1"
                        >
                          <ArrowLeft className="h-3.5 w-3.5" /> Back
                        </button>
                        <button
                          type="submit"
                          disabled={isProcessing}
                          className="flex-1 rounded bg-amber-500 text-black hover:bg-amber-600 py-2.5 text-center text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                        >
                          {isProcessing ? (
                            <>
                              <svg className="animate-spin h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                              Validating Ledger...
                            </>
                          ) : (
                            <>Authorize Sandbox Fund & Open</>
                          )}
                        </button>
                      </div>
                    </form>
                  )}

                  {checkoutStep === 3 && (
                    <div className="text-center py-4 space-y-5">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                        <CheckCircle className="h-8 w-8 stroke-[2.5]" />
                      </div>
                      <div>
                        <h4 className="font-serif italic text-xl text-white">Purchase Successful!</h4>
                        <p className="mt-1 text-xs text-slate-400">Instantly catalogued and unlocked inside your custom library folder.</p>
                      </div>
 
                      {/* Receipt breakdown widget */}
                      <div className="rounded border border-white/5 bg-[#0A0A0A] p-4.5 font-mono text-left text-xs text-slate-400 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-500">TRANSACTION INDEX:</span>
                          <span className="font-semibold text-slate-200">{lastTxId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">DELIVERY VAULT ID:</span>
                          <span className="font-semibold text-slate-200 truncate max-w-[170px]">{billingEmail}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">PURCHASE TYPE:</span>
                          <span className="font-semibold text-slate-200">
                            {isCartCheckout ? `Cart Purchase` : `Single Item`}
                          </span>
                        </div>
                        <div className="border-t border-dashed border-white/10 my-2 pt-2 flex justify-between font-sans text-sm font-bold text-white">
                          <span className="font-mono text-slate-500 text-xs">AMOUNT CHARGED</span>
                          <span className="text-amber-500">
                            {isCartCheckout ? formatPrice(cartTotalSum, currency) : formatPrice(checkoutProduct.price, currency)}
                          </span>
                        </div>
                      </div>
 
                      <div className="pt-2">
                        <button
                          onClick={() => setCheckoutProduct(null)}
                          className="w-full rounded bg-amber-500 text-black hover:bg-amber-600 py-3 text-center text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                        >
                          Open Vault & Read Now
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
 
      {/* FLOATING CART TRIGGER AND COUNTER */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-24 right-6 z-40">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCartOpen(true)}
            className="cursor-pointer flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-black shadow-2xl hover:bg-amber-600 border border-white/15 relative"
            title="Open Shopping Cart"
          >
            <ShoppingCart className="h-6 w-6 stroke-[2.5]" />
            <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-[10px] font-mono font-black text-black border border-amber-500 shadow-md">
              {totalCartCount}
            </span>
          </motion.button>
        </div>
      )}
 
      {/* SHOPPING CART DRAWER OVERLAY */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden" id="cart-drawer">
            <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
            
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", duration: 0.3 }}
                className="w-screen max-w-md bg-[#0F0F0F] text-slate-200 border-l border-white/10 shadow-2xl flex flex-col justify-between"
              >
                {/* Header */}
                <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-[#0A0A0A]">
                  <h3 className="font-serif italic text-lg text-white flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-amber-500" /> Shopping Cart
                    <span className="text-xs font-sans font-normal text-amber-500">({totalCartCount} items)</span>
                  </h3>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="text-slate-400 hover:text-white cursor-pointer text-xl"
                  >
                    &times;
                  </button>
                </div>
 
                {/* Items list */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {activeCartItems.length === 0 ? (
                    <div className="h-full flex flex-col justify-center items-center text-center space-y-3 py-10">
                      <ShoppingBag className="h-10 w-10 text-slate-600 animate-pulse" />
                      <p className="text-sm font-serif italic text-slate-400">Your cart is currently empty</p>
                      <p className="text-xs text-slate-500 max-w-xs">Explore our digital products and add items to your cart to checkout together.</p>
                      <button 
                        onClick={() => setIsCartOpen(false)}
                        className="cursor-pointer rounded bg-white text-black hover:bg-amber-500 px-4 py-2 text-[10px] uppercase font-bold tracking-wider transition-all"
                      >
                        Start Browsing
                      </button>
                    </div>
                  ) : (
                    activeCartItems.map(({ product, quantity }) => (
                      <div key={product.id} className="bg-[#0A0A0A] rounded border border-white/5 p-4 flex gap-4 items-center relative group">
                        {/* Remove item button */}
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="absolute top-2 right-2 text-slate-500 hover:text-red-400 cursor-pointer p-1"
                          title="Remove item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
 
                        <img 
                          src={product.coverImage} 
                          alt="" 
                          className="h-14 w-20 object-cover rounded opacity-100 shrink-0" 
                        />
                        <div className="min-w-0 flex-1 space-y-1">
                          <span className="text-[8px] font-mono text-amber-500 uppercase tracking-widest block bg-amber-500/10 rounded px-1.5 py-0.5 w-max">
                            {product.category}
                          </span>
                          <h4 className="text-xs font-serif italic text-white truncate pr-5">{product.title}</h4>
                          <p className="text-xs font-mono text-amber-500 font-bold">{formatPrice(product.price, currency)}</p>
                          
                          {/* Counter controls */}
                          <div className="flex items-center gap-2 mt-2 w-max bg-[#0F0F0F] rounded border border-white/10 p-0.5">
                            <button
                              onClick={() => updateCartQuantity(product.id, quantity - 1)}
                              className="w-5 h-5 flex items-center justify-center rounded-xs hover:bg-white/5 text-slate-400 hover:text-white cursor-pointer"
                            >
                              <Minus className="h-2.5 w-2.5" />
                            </button>
                            <span className="text-[11px] font-mono w-6 text-center text-slate-200">{quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(product.id, quantity + 1)}
                              className="w-5 h-5 flex items-center justify-center rounded-xs hover:bg-white/5 text-slate-300 hover:text-white cursor-pointer"
                            >
                              <Plus className="h-2.5 w-2.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
 
                {/* Footer and Checkout */}
                {activeCartItems.length > 0 && (
                  <div className="p-6 bg-[#0A0A0A] border-t border-white/5 space-y-4">
                    <div className="flex justify-between items-end font-sans text-sm font-semibold">
                      <span className="text-slate-400 text-xs uppercase font-mono">Subtotal Amount:</span>
                      <span className="text-amber-500 font-mono text-lg font-bold">{formatPrice(cartTotalSum, currency)}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal">🔒 SSL verified checkout. Lifetime license & free updates included on all items.</p>
                    
                    <button
                      onClick={handleStartCartCheckout}
                      className="w-full rounded bg-amber-500 text-black hover:bg-amber-600 py-3 text-center text-xs font-extrabold uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
                    >
                      Checkout Combined Cart <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
