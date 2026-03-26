import React, { useState } from 'react';
import { Header } from './components/Header';
import { CartInput } from './components/CartInput';
import { CartDisplay } from './components/CartDisplay';
import { BudgetPanel } from './components/BudgetPanel';
import { RecommendationPanel } from './components/RecommendationPanel';
import { SubsetResults } from './components/SubsetResults';
import { ExplanationPanel } from './components/ExplanationPanel';
import { StateIndicators } from './components/StateIndicators';
import { useApp } from './context/AppContext';

function App() {
  const { cart, budget, recommendations, subsetResults } = useApp();
  const [selectedResultIdx, setSelectedResultIdx] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />

      <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Hero Section */}
          {!cart.length && (
            <section className="text-center py-12">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                🛍️ Smart Shopping Budget Optimizer
              </h2>
              <p className="text-xl text-slate-600 mb-2">
                Find the perfect basket of items within your budget using AI-powered recommendations.
              </p>
              <p className="text-slate-500">
                Powered by quantum-walk-inspired and classical optimization algorithms.
              </p>
            </section>
          )}

          {/* State Indicators */}
          <StateIndicators />

          {/* Main Grid */}
          <div className="grid gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              <CartInput />
              <CartDisplay cart={cart} />
              <BudgetPanel />
            </div>

            {/* Right Column - Shows after loading cart */}
            {cart.length > 0 && (
              <div className="space-y-8">
                <RecommendationPanel />
                {subsetResults.length > 0 && (
                  <>
                    <SubsetResults
                      results={subsetResults}
                      budget={budget}
                      selectedIndex={selectedResultIdx}
                      onSelect={setSelectedResultIdx}
                    />
                  </>
                )}
                <ExplanationPanel />
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-slate-200 text-center text-slate-600">
            <p className="mb-2">
              <strong>Quantum Budget Optimizer</strong> © 2026 | AI Shopping Assistant
            </p>
            <p className="text-sm">
              Combining quantum-walk simulations and classical algorithms for smart budgeting.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;
