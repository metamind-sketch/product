import { useState, useEffect } from "react";
import Header from "./components/Header";
import Storefront from "./components/Storefront";
import SellerHub from "./components/SellerHub";
import AICoCreator from "./components/AICoCreator";
import CustomerLibrary from "./components/CustomerLibrary";
import ChatAssistant from "./components/ChatAssistant";
import { INITIAL_PRODUCTS } from "./data";
import { DigitalProduct, Currency } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<'explore' | 'seller' | 'library' | 'incubator'>('explore');
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [purchasedIds, setPurchasedIds] = useState<string[]>([]);
  const [sellerBalance, setSellerBalance] = useState(240.00);
  const [currency, setCurrency] = useState<Currency>('USD');
  const userEmail = "haridev4049@gmail.com";

  // Load and sync with localStorage to ensure state holds across soft reloads!
  useEffect(() => {
    const storedProducts = localStorage.getItem("coursezy_products");
    const storedPurchases = localStorage.getItem("coursezy_purchased_ids");
    const storedBalance = localStorage.getItem("coursezy_seller_balance");
    const storedCurrency = localStorage.getItem("coursezy_currency");

    if (storedProducts) {
      try {
        setProducts(JSON.parse(storedProducts));
      } catch (e) {
        setProducts(INITIAL_PRODUCTS);
      }
    } else {
      setProducts(INITIAL_PRODUCTS);
    }

    if (storedPurchases) {
      try {
        setPurchasedIds(JSON.parse(storedPurchases));
      } catch (e) {
        setPurchasedIds([]);
      }
    } else {
      // Pre-purchase one item (e.g. "prod-3" launch checklist) so their library isn't completely empty initially
      setPurchasedIds(["prod-3"]);
    }

    if (storedBalance) {
      setSellerBalance(parseFloat(storedBalance) || 240.00);
    }

    if (storedCurrency === 'INR' || storedCurrency === 'USD') {
      setCurrency(storedCurrency as Currency);
    }
  }, []);

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    localStorage.setItem("coursezy_currency", newCurrency);
  };

  // Sync state helpers
  const saveProducts = (updatedProducts: DigitalProduct[]) => {
    setProducts(updatedProducts);
    localStorage.setItem("coursezy_products", JSON.stringify(updatedProducts));
  };

  const handlePurchaseComplete = (productId: string, price: number) => {
    const updatedPurchased = [...purchasedIds, productId];
    setPurchasedIds(updatedPurchased);
    localStorage.setItem("coursezy_purchased_ids", JSON.stringify(updatedPurchased));

    // Increment seller balance and product sales metrics inside model
    const updatedBalance = sellerBalance + price;
    setSellerBalance(updatedBalance);
    localStorage.setItem("coursezy_seller_balance", updatedBalance.toString());

    const updatedProducts = products.map((p) => {
      if (p.id === productId) {
        return {
          ...p,
          salesCount: (p.salesCount || 0) + 1
        };
      }
      return p;
    });
    saveProducts(updatedProducts);
  };

  const handleAddProduct = (newProduct: DigitalProduct) => {
    const updatedProducts = [newProduct, ...products];
    saveProducts(updatedProducts);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-200 flex flex-col justify-between selection:bg-amber-500/20 selection:text-amber-500" id="coursezy-app">
      <div>
        {/* Main Header navigation */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          purchasedCount={purchasedIds.length}
          sellerBalance={sellerBalance}
          userEmail={userEmail}
          currency={currency}
          onCurrencyChange={handleCurrencyChange}
        />

        {/* Tab router panes */}
        <main className="pb-24">
          {activeTab === 'explore' && (
            <Storefront
              products={products}
              purchasedIds={purchasedIds}
              onPurchaseComplete={handlePurchaseComplete}
              userEmail={userEmail}
              currency={currency}
              onCurrencyChange={handleCurrencyChange}
            />
          )}

          {activeTab === 'library' && (
            <CustomerLibrary
              products={products}
              purchasedIds={purchasedIds}
              setActiveTab={setActiveTab}
              currency={currency}
            />
          )}

          {activeTab === 'seller' && (
            <SellerHub
              products={products}
              onAddProduct={handleAddProduct}
              sellerBalance={sellerBalance}
              currency={currency}
            />
          )}

          {activeTab === 'incubator' && (
            <AICoCreator
              onAddProduct={handleAddProduct}
              setActiveTab={setActiveTab}
              currency={currency}
            />
          )}
        </main>
      </div>

      {/* Floating Store Concierge chatbot */}
      <ChatAssistant
        products={products}
        setActiveTab={setActiveTab}
      />

      {/* Standard Humble Footer */}
      <footer className="border-t border-white/5 py-8 bg-[#0A0A0A]" id="app-footer">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-2">
          <p className="font-sans text-xs font-semibold text-slate-500">
            &copy; 2026 COURSEZY DIGITAL LTD. All rights reserved.
          </p>
          <p className="font-mono text-[9px] uppercase tracking-widest text-slate-600">
            Powered by Gemini AI Product Engineering &bull; Sophisticated Dark Premium Edition
          </p>
        </div>
      </footer>
    </div>
  );
}
